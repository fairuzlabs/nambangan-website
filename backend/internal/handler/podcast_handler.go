package handler

import (
	"errors"
	"net/http"

	"github.com/faza/rw18-nambangan-backend/internal/httpx"
	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
	"github.com/faza/rw18-nambangan-backend/internal/service"
	"github.com/faza/rw18-nambangan-backend/internal/util"
)

type PodcastHandler struct {
	svc *service.PodcastService
}

func NewPodcastHandler(svc *service.PodcastService) *PodcastHandler {
	return &PodcastHandler{svc: svc}
}

// List menangani GET /api/v1/podcast-episodes
func (h *PodcastHandler) List(w http.ResponseWriter, r *http.Request) {
	page, limit, offset := util.ParsePagination(r)
	q := r.URL.Query()
	featuredOnly := q.Get("featured") == "true"

	items, pagination, err := h.svc.List(r.Context(), q.Get("category"), featuredOnly, page, limit, offset)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar episode podcast")
		return
	}
	httpx.JSONWithMeta(w, http.StatusOK, items, pagination)
}

// GetBySlug menangani GET /api/v1/podcast-episodes/{slug}
func (h *PodcastHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	e, err := h.svc.GetBySlug(r.Context(), slug)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "episode podcast tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil episode podcast")
		return
	}
	httpx.JSON(w, http.StatusOK, e)
}

// ListCategories menangani GET /api/v1/podcast-categories
func (h *PodcastHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.svc.ListCategories(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil kategori podcast")
		return
	}
	httpx.JSON(w, http.StatusOK, categories)
}

// ListGuests menangani GET /api/v1/podcast-guests
func (h *PodcastHandler) ListGuests(w http.ResponseWriter, r *http.Request) {
	guests, err := h.svc.ListGuests(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar narasumber")
		return
	}
	httpx.JSON(w, http.StatusOK, guests)
}

// Create menangani POST /api/v1/admin/podcast-episodes
func (h *PodcastHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.PodcastEpisodeCreateRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	e, err := h.svc.Create(r.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrValidation) {
			httpx.Error(w, http.StatusBadRequest, "title dan youtube_url wajib diisi")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal membuat episode podcast: "+err.Error())
		return
	}
	httpx.JSON(w, http.StatusCreated, e)
}

// Update menangani PUT /api/v1/admin/podcast-episodes/{id}
func (h *PodcastHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req model.PodcastEpisodeUpdateRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	e, err := h.svc.Update(r.Context(), id, req)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "episode podcast tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal memperbarui episode podcast: "+err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, e)
}

// Delete menangani DELETE /api/v1/admin/podcast-episodes/{id}
func (h *PodcastHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.svc.Delete(r.Context(), id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "episode podcast tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal menghapus episode podcast")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]string{"message": "episode podcast berhasil dihapus"})
}
