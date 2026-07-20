package handler

import (
	"encoding/json"
	"net/http"

	"github.com/faza/rw18-nambangan-backend/internal/httpx"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
)

type OrganizationHandler struct {
	repo *repository.OrganizationRepository
}

func NewOrganizationHandler(repo *repository.OrganizationRepository) *OrganizationHandler {
	return &OrganizationHandler{repo: repo}
}

func (h *OrganizationHandler) List(w http.ResponseWriter, r *http.Request) {
	members, err := h.repo.List(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "gagal mengambil daftar struktur organisasi")
		return
	}
	httpx.JSON(w, http.StatusOK, members)
}

type UpdateMemberReq struct {
	Position string `json:"position"`
	Name     string `json:"name"`
}

func (h *OrganizationHandler) UpdateBulk(w http.ResponseWriter, r *http.Request) {
	var req []UpdateMemberReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "request body tidak valid")
		return
	}

	for _, item := range req {
		if item.Position == "" || item.Name == "" {
			httpx.Error(w, http.StatusBadRequest, "posisi dan nama tidak boleh kosong")
			return
		}
		err := h.repo.UpdateByName(r.Context(), item.Position, item.Name)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "gagal memperbarui struktur organisasi")
			return
		}
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"success": true, "message": "struktur organisasi berhasil diperbarui"})
}
