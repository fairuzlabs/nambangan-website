package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/faza/rw18-nambangan-backend/internal/model"
)

type TagRepository struct {
	pool *pgxpool.Pool
}

func NewTagRepository(pool *pgxpool.Pool) *TagRepository {
	return &TagRepository{pool: pool}
}

// List mengambil semua tag yang tersedia.
func (r *TagRepository) List(ctx context.Context) ([]model.Tag, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, slug FROM tags ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.Tag
	for rows.Next() {
		var t model.Tag
		if err := rows.Scan(&t.ID, &t.Name, &t.Slug); err != nil {
			return nil, err
		}
		result = append(result, t)
	}
	return result, rows.Err()
}
