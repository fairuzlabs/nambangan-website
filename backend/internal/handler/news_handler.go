package handler

import (
	"errors"
	"net/http"

	"github.com/faza/rw18-nambangan-backend/internal/httpx"
	"github.com/faza/rw18-nambangan-backend/internal/middleware"
	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
	"github.com/faza/rw18-nambangan-backend/internal/service"
	"github.com/faza/rw18-nambangan-backend/internal/util"
)

type NewsHandler struct {
	svc *service.NewsService
}

func NewNewsHandler(svc *service.NewsService) *NewsHandler {
	return &NewsHandler{svc: svc}
}

// List menangani GET /api/v1/news
func (h *NewsHandler) List(w http.ResponseWriter, r *http.Request) {
	page, limit, offset := util.ParsePagination(r)
	q := r.URL.Query()

	items, pagination, err := h.svc.List(r.Context(), q.Get("category"), "published", q.Get("search"), page, limit, offset)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar berita")
		return
	}
	httpx.JSONWithMeta(w, http.StatusOK, items, pagination)
}

// GetBySlug menangani GET /api/v1/news/{slug}
func (h *NewsHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	n, err := h.svc.GetBySlug(r.Context(), slug)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "berita tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil berita")
		return
	}
	httpx.JSON(w, http.StatusOK, n)
}

// ListCategories menangani GET /api/v1/news-categories
func (h *NewsHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.svc.ListCategories(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil kategori berita")
		return
	}
	httpx.JSON(w, http.StatusOK, categories)
}

// AdminList menangani GET /api/v1/admin/news (menampilkan semua status, termasuk draft)
func (h *NewsHandler) AdminList(w http.ResponseWriter, r *http.Request) {
	page, limit, offset := util.ParsePagination(r)
	q := r.URL.Query()

	items, pagination, err := h.svc.List(r.Context(), q.Get("category"), q.Get("status"), q.Get("search"), page, limit, offset)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar berita")
		return
	}
	httpx.JSONWithMeta(w, http.StatusOK, items, pagination)
}

// AdminGetByID menangani GET /api/v1/admin/news/{id}
func (h *NewsHandler) AdminGetByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	n, err := h.svc.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "berita tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil berita")
		return
	}
	httpx.JSON(w, http.StatusOK, n)
}

// Create menangani POST /api/v1/admin/news
func (h *NewsHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.NewsCreateRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	adminID, _ := r.Context().Value(middleware.AdminIDContextKey).(string)
	n, err := h.svc.Create(r.Context(), req, adminID)
	if err != nil {
		if errors.Is(err, service.ErrValidation) {
			httpx.Error(w, http.StatusBadRequest, "title, excerpt, dan content wajib diisi")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal membuat berita: "+err.Error())
		return
	}
	httpx.JSON(w, http.StatusCreated, n)
}

// Update menangani PUT /api/v1/admin/news/{id}
func (h *NewsHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req model.NewsUpdateRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	n, err := h.svc.Update(r.Context(), id, req)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "berita tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal memperbarui berita: "+err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, n)
}

// Delete menangani DELETE /api/v1/admin/news/{id}
func (h *NewsHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.svc.Delete(r.Context(), id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "berita tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal menghapus berita")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]string{"message": "berita berhasil dihapus"})
}
