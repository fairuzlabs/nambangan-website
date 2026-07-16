package config

import (
	"os"
	"time"
)

// Config menampung semua konfigurasi aplikasi yang diambil dari environment variable.
type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	JWTTTL      time.Duration
	R2AccessKey string
	R2SecretKey string
	R2Bucket    string
	// R2Endpoint adalah URL endpoint S3-compatible untuk Cloudflare R2,
	// format: https://<account-id>.r2.cloudflarestorage.com
	R2Endpoint  string
	// R2PublicURL adalah URL publik bucket R2, format: https://pub-xxx.r2.dev
	// Digunakan untuk membangun URL gambar yang bisa diakses publik.
	R2PublicURL string
	CORSOrigin  string
	// UploadDir adalah direktori lokal tempat file upload disimpan (fallback saat R2 tidak dikonfigurasi).
	UploadDir string
}

// Load membaca konfigurasi dari environment variable, dengan nilai default fallback.
func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", ""),
		JWTSecret:   getEnv("JWT_SECRET", ""),
		JWTTTL:      24 * time.Hour,
		R2AccessKey: getEnv("R2_ACCESS_KEY", ""),
		R2SecretKey: getEnv("R2_SECRET_KEY", ""),
		R2Bucket:    getEnv("R2_BUCKET_NAME", ""),
		R2Endpoint:  getEnv("R2_ENDPOINT", ""),
		R2PublicURL: getEnv("R2_PUBLIC_URL", ""),
		CORSOrigin:  getEnv("CORS_ORIGIN", "*"),
		UploadDir:   getEnv("UPLOAD_DIR", "uploads"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
