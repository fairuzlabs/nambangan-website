package handler

import (
	"net/http"

	"github.com/faza/rw18-nambangan-backend/internal/httpx"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
)

type TagHandler struct {
	repo *repository.TagRepository
}

func NewTagHandler(repo *repository.TagRepository) *TagHandler {
	return &TagHandler{repo: repo}
}

// List menangani GET /api/v1/tags
func (h *TagHandler) List(w http.ResponseWriter, r *http.Request) {
	tags, err := h.repo.List(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar tag")
		return
	}
	httpx.JSON(w, http.StatusOK, tags)
}
