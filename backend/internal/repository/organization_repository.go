package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type OrganizationRepository struct {
	db *pgxpool.Pool
}

func NewOrganizationRepository(db *pgxpool.Pool) *OrganizationRepository {
	return &OrganizationRepository{db: db}
}

func (r *OrganizationRepository) List(ctx context.Context) ([]model.OrganizationMember, error) {
	query := `SELECT id, position, name, created_at, updated_at FROM organization_members ORDER BY position`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query list organization members gagal: %w", err)
	}
	defer rows.Close()

	var members []model.OrganizationMember
	for rows.Next() {
		var m model.OrganizationMember
		err := rows.Scan(&m.ID, &m.Position, &m.Name, &m.CreatedAt, &m.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("scan organization member gagal: %w", err)
		}
		members = append(members, m)
	}
	return members, nil
}

func (r *OrganizationRepository) UpdateByName(ctx context.Context, position string, name string) error {
	query := `UPDATE organization_members SET name = $1, updated_at = $2 WHERE position = $3`
	_, err := r.db.Exec(ctx, query, name, time.Now(), position)
	if err != nil {
		return fmt.Errorf("update organization member gagal: %w", err)
	}
	return nil
}
