package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/faza/rw18-nambangan-backend/internal/httpx"
	"github.com/faza/rw18-nambangan-backend/internal/service"
)

type contextKey string

const AdminIDContextKey contextKey = "admin_id"

// RequireAuth adalah middleware yang memvalidasi header "Authorization: Bearer <token>"
// menggunakan AuthService, dan menolak request jika token tidak ada/tidak valid.
func RequireAuth(authService *service.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if header == "" {
				httpx.Error(w, http.StatusUnauthorized, "header Authorization wajib disertakan")
				return
			}

			parts := strings.SplitN(header, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				httpx.Error(w, http.StatusUnauthorized, "format header Authorization harus 'Bearer <token>'")
				return
			}

			claims, err := authService.ParseToken(parts[1])
			if err != nil {
				httpx.Error(w, http.StatusUnauthorized, "token tidak valid atau sudah kedaluwarsa")
				return
			}

			ctx := context.WithValue(r.Context(), AdminIDContextKey, claims.AdminID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
