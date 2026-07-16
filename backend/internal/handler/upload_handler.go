package handler

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awscfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/faza/rw18-nambangan-backend/internal/config"
	"github.com/faza/rw18-nambangan-backend/internal/httpx"
)

const (
	maxUploadSize = 5 << 20 // 5 MB
)

// allowedMIME maps allowed MIME types to their canonical file extensions.
var allowedMIME = map[string]string{
	"image/jpeg": "jpg",
	"image/png":  "png",
	"image/webp": "webp",
}

// allowedExtToMIME maps file extensions to MIME types for extension-based fallback.
var allowedExtToMIME = map[string]string{
	".jpg":  "image/jpeg",
	".jpeg": "image/jpeg",
	".png":  "image/png",
	".webp": "image/webp",
}

// UploadHandler menangani upload file gambar.
type UploadHandler struct {
	cfg *config.Config
}

// NewUploadHandler membuat instance UploadHandler baru.
func NewUploadHandler(cfg *config.Config) *UploadHandler {
	return &UploadHandler{cfg: cfg}
}

// Upload menangani POST /api/v1/admin/upload
// Menerima multipart/form-data dengan field "file" berisi gambar (JPEG/PNG/WEBP, maks 5 MB).
// Mengembalikan JSON { "url": "<public-url>" } setelah upload berhasil.
func (h *UploadHandler) Upload(w http.ResponseWriter, r *http.Request) {
	// Batasi ukuran total request agar tidak di-buffer tak terbatas
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize+512)

	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		httpx.Error(w, http.StatusBadRequest, "file terlalu besar atau format request tidak valid (maks 5 MB)")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "field 'file' tidak ditemukan dalam request")
		return
	}
	defer file.Close()

	// Baca seluruh konten ke buffer agar bisa dideteksi MIME-nya secara akurat
	buf := &bytes.Buffer{}
	written, err := io.Copy(buf, file)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal membaca file")
		return
	}

	if written > maxUploadSize {
		httpx.Error(w, http.StatusBadRequest, "ukuran file melebihi batas 5 MB")
		return
	}

	// Deteksi MIME dari byte pertama konten aktual (tidak bisa dipalsukan seperti header)
	detectedMIME := http.DetectContentType(buf.Bytes())
	ext, ok := allowedMIME[detectedMIME]
	if !ok {
		// Fallback: coba deteksi dari ekstensi nama file (untuk format seperti WEBP yang
		// kadang terdeteksi sebagai "application/octet-stream" oleh DetectContentType)
		nameLower := strings.ToLower(header.Filename)
		for suffix, mime := range allowedExtToMIME {
			if strings.HasSuffix(nameLower, suffix) {
				if e, ok2 := allowedMIME[mime]; ok2 {
					ext = e
					detectedMIME = mime
					ok = true
					break
				}
			}
		}
	}

	if !ok {
		httpx.Error(w, http.StatusBadRequest, "tipe file tidak didukung – gunakan JPEG, PNG, atau WEBP")
		return
	}

	// Buat nama file unik berdasarkan timestamp nanosecond
	filename := fmt.Sprintf("news_%d.%s", time.Now().UnixNano(), ext)

	var publicURL string

	if h.cfg.R2AccessKey != "" && h.cfg.R2SecretKey != "" && h.cfg.R2Bucket != "" {
		// ── Mode Cloudflare R2 ─────────────────────────────────────────────────────
		publicURL, err = h.uploadToR2(r.Context(), buf.Bytes(), filename, detectedMIME)
		if err != nil {
			log.Printf("upload R2 gagal: %v", err)
			httpx.Error(w, http.StatusInternalServerError, "gagal mengupload gambar ke storage")
			return
		}
	} else {
		// ── Mode lokal (development / on-prem) ─────────────────────────────────────
		publicURL, err = h.saveLocal(buf.Bytes(), filename)
		if err != nil {
			log.Printf("simpan lokal gagal: %v", err)
			httpx.Error(w, http.StatusInternalServerError, "gagal menyimpan gambar")
			return
		}
	}

	httpx.JSON(w, http.StatusOK, map[string]string{"url": publicURL})
}

// uploadToR2 mengunggah data ke Cloudflare R2 menggunakan AWS SDK v2 (S3-compatible API).
func (h *UploadHandler) uploadToR2(ctx context.Context, data []byte, key, mimeType string) (string, error) {
	endpoint := h.cfg.R2Endpoint
	if endpoint == "" {
		return "", fmt.Errorf("R2_ENDPOINT tidak dikonfigurasi")
	}

	awsConfig, err := awscfg.LoadDefaultConfig(ctx,
		awscfg.WithRegion("auto"),
		awscfg.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			h.cfg.R2AccessKey,
			h.cfg.R2SecretKey,
			"",
		)),
		awscfg.WithBaseEndpoint(endpoint),
	)
	if err != nil {
		return "", fmt.Errorf("gagal membuat AWS config: %w", err)
	}

	client := s3.NewFromConfig(awsConfig, func(o *s3.Options) {
		o.UsePathStyle = true
	})

	size := int64(len(data))
	_, err = client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:        aws.String(h.cfg.R2Bucket),
		Key:           aws.String(key),
		Body:          bytes.NewReader(data),
		ContentType:   aws.String(mimeType),
		ContentLength: &size,
	})
	if err != nil {
		return "", fmt.Errorf("PutObject gagal: %w", err)
	}

	publicURL := h.cfg.R2PublicURL
	if publicURL == "" {
		publicURL = endpoint + "/" + h.cfg.R2Bucket
	}
	return strings.TrimRight(publicURL, "/") + "/" + key, nil
}

// saveLocal menyimpan data ke direktori lokal dan mengembalikan path HTTP yang bisa diakses.
func (h *UploadHandler) saveLocal(data []byte, filename string) (string, error) {
	dir := h.cfg.UploadDir
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", fmt.Errorf("gagal membuat direktori upload: %w", err)
	}

	fullPath := filepath.Join(dir, filename)
	if err := os.WriteFile(fullPath, data, 0644); err != nil {
		return "", fmt.Errorf("gagal menulis file: %w", err)
	}

	// Kembalikan URL path yang dihandle oleh static file server di main.go
	return "/uploads/" + filename, nil
}
