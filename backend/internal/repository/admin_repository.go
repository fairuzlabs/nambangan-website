package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/faza/rw18-nambangan-backend/internal/model"
)

type AdminRepository struct {
	pool *pgxpool.Pool
}

func NewAdminRepository(pool *pgxpool.Pool) *AdminRepository {
	return &AdminRepository{pool: pool}
}

// GetByUsername mengambil satu admin berdasarkan username, dipakai saat login.
func (r *AdminRepository) GetByUsername(ctx context.Context, username string) (model.Admin, error) {
	var a model.Admin
	err := r.pool.QueryRow(ctx, `
		SELECT id, username, password_hash, display_name, created_at
		FROM admins WHERE username = $1
	`, username).Scan(&a.ID, &a.Username, &a.PasswordHash, &a.DisplayName, &a.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.Admin{}, ErrNotFound
	}
	return a, err
}

// GetByID mengambil satu admin berdasarkan ID, dipakai untuk validasi token JWT.
func (r *AdminRepository) GetByID(ctx context.Context, id string) (model.Admin, error) {
	var a model.Admin
	err := r.pool.QueryRow(ctx, `
		SELECT id, username, password_hash, display_name, created_at
		FROM admins WHERE id = $1
	`, id).Scan(&a.ID, &a.Username, &a.PasswordHash, &a.DisplayName, &a.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.Admin{}, ErrNotFound
	}
	return a, err
}
