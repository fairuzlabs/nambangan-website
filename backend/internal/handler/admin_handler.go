package handler

import (
	"errors"
	"net/http"

	"github.com/faza/rw18-nambangan-backend/internal/httpx"
	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/service"
)

type AdminHandler struct {
	authSvc *service.AuthService
}

func NewAdminHandler(authSvc *service.AuthService) *AdminHandler {
	return &AdminHandler{authSvc: authSvc}
}

// Login menangani POST /api/v1/admin/login
func (h *AdminHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req model.LoginRequest
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "body request tidak valid: "+err.Error())
		return
	}

	if req.Username == "" || req.Password == "" {
		httpx.Error(w, http.StatusBadRequest, "username dan password wajib diisi")
		return
	}

	resp, err := h.authSvc.Login(r.Context(), req.Username, req.Password)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			httpx.Error(w, http.StatusUnauthorized, "username atau password salah")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "gagal login: "+err.Error())
		return
	}

	httpx.JSON(w, http.StatusOK, resp)
}
