package handler

import (
	"errors"
	"net/http"

	"github.com/faza/rw18-nambangan-backend/internal/httpx"
	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
	"github.com/faza/rw18-nambangan-backend/internal/service"
)

type MapHandler struct {
	svc *service.MapService
}

func NewMapHandler(svc *service.MapService) *MapHandler {
	return &MapHandler{svc: svc}
}

// List menangani GET /api/v1/map-points
func (h *MapHandler) List(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	points, err := h.svc.List(r.Context(), category, true)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar titik peta")
		return
	}
	httpx.JSON(w, http.StatusOK, points)
}

// AdminList menangani GET /api/v1/admin/map-points (termasuk yang non-aktif)
func (h *MapHandler) AdminList(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	points, err := h.svc.List(r.Context(), category, false)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar titik peta")
		return
	}
	httpx.JSON(w, http.StatusOK, points)
}

// GetByID menangani GET /api/v1/map-points/{id}
func (h *MapHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	p, err := h.svc.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "titik peta tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil titik peta")
		return
	}
	httpx.JSON(w, http.StatusOK, p)
}

// ListCategories menangani GET /api/v1/map-categories
func (h *MapHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.svc.ListCategories(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil kategori peta")
		return
	}
	httpx.JSON(w, http.StatusOK, categories)
}

// Create menangani POST /api/v1/admin/map-points
func (h *MapHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.MapPointCreateRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	p, err := h.svc.Create(r.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrValidation) {
			httpx.Error(w, http.StatusBadRequest, "name dan category_id wajib diisi")
			return
		}
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusBadRequest, "category_id tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal membuat titik peta: "+err.Error())
		return
	}
	httpx.JSON(w, http.StatusCreated, p)
}

// Update menangani PUT /api/v1/admin/map-points/{id}
func (h *MapHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req model.MapPointUpdateRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	p, err := h.svc.Update(r.Context(), id, req)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "titik peta atau kategori tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal memperbarui titik peta: "+err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, p)
}

// Delete menangani DELETE /api/v1/admin/map-points/{id}
func (h *MapHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.svc.Delete(r.Context(), id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "titik peta tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal menghapus titik peta")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]string{"message": "titik peta berhasil dihapus"})
}
