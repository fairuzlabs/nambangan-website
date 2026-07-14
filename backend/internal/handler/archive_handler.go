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

type ArchiveHandler struct {
	svc *service.ArchiveService
}

func NewArchiveHandler(svc *service.ArchiveService) *ArchiveHandler {
	return &ArchiveHandler{svc: svc}
}

// List menangani GET /api/v1/archive-documents
func (h *ArchiveHandler) List(w http.ResponseWriter, r *http.Request) {
	page, limit, offset := util.ParsePagination(r)
	q := r.URL.Query()

	items, pagination, err := h.svc.List(r.Context(), q.Get("doc_type"), q.Get("program_type"), q.Get("tag"), page, limit, offset)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar arsip dokumen")
		return
	}
	httpx.JSONWithMeta(w, http.StatusOK, items, pagination)
}

// GetByID menangani GET /api/v1/archive-documents/{id}
func (h *ArchiveHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	d, err := h.svc.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "dokumen arsip tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil dokumen arsip")
		return
	}
	httpx.JSON(w, http.StatusOK, d)
}

// Create menangani POST /api/v1/admin/archive-documents
func (h *ArchiveHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.ArchiveDocumentCreateRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	d, err := h.svc.Create(r.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrValidation) {
			httpx.Error(w, http.StatusBadRequest, "title dan doc_type wajib diisi")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal membuat dokumen arsip: "+err.Error())
		return
	}
	httpx.JSON(w, http.StatusCreated, d)
}

// Update menangani PUT /api/v1/admin/archive-documents/{id}
func (h *ArchiveHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req model.ArchiveDocumentUpdateRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	d, err := h.svc.Update(r.Context(), id, req)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "dokumen arsip tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal memperbarui dokumen arsip: "+err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, d)
}

// Delete menangani DELETE /api/v1/admin/archive-documents/{id}
func (h *ArchiveHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.svc.Delete(r.Context(), id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Error(w, http.StatusNotFound, "dokumen arsip tidak ditemukan")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal menghapus dokumen arsip")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]string{"message": "dokumen arsip berhasil dihapus"})
}
