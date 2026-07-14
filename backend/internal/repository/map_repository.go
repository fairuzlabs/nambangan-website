package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/faza/rw18-nambangan-backend/internal/model"
)

type MapRepository struct {
	pool *pgxpool.Pool
}

func NewMapRepository(pool *pgxpool.Pool) *MapRepository {
	return &MapRepository{pool: pool}
}

const mapPointSelectCols = `
	mp.id, mp.category_id, mp.name, mp.subtitle, mp.description, mp.latitude, mp.longitude,
	mp.address, mp.image_url, mp.is_active, mp.created_at, mp.updated_at,
	mc.name, mc.slug
`

func scanMapPoint(row pgx.Row) (model.MapPoint, error) {
	var p model.MapPoint
	err := row.Scan(
		&p.ID, &p.CategoryID, &p.Name, &p.Subtitle, &p.Description, &p.Latitude, &p.Longitude,
		&p.Address, &p.ImageURL, &p.IsActive, &p.CreatedAt, &p.UpdatedAt,
		&p.CategoryName, &p.CategorySlug,
	)
	return p, err
}

// List mengambil daftar titik peta, opsional difilter berdasarkan slug kategori.
func (r *MapRepository) List(ctx context.Context, categorySlug string, activeOnly bool) ([]model.MapPoint, error) {
	query := `
		SELECT ` + mapPointSelectCols + `
		FROM map_points mp
		JOIN map_categories mc ON mc.id = mp.category_id
		WHERE 1=1
	`
	args := []interface{}{}
	argPos := 1

	if activeOnly {
		query += ` AND mp.is_active = true`
	}
	if categorySlug != "" {
		query += ` AND mc.slug = $` + itoa(argPos)
		args = append(args, categorySlug)
		argPos++
	}
	query += ` ORDER BY mp.created_at DESC`

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var points []model.MapPoint
	var umkmIDs []string
	for rows.Next() {
		p, err := scanMapPoint(rows)
		if err != nil {
			return nil, err
		}
		points = append(points, p)
		if p.CategorySlug != nil && *p.CategorySlug == "umkm" {
			umkmIDs = append(umkmIDs, p.ID)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(umkmIDs) > 0 {
		details, err := r.getUMKMDetails(ctx, umkmIDs)
		if err != nil {
			return nil, err
		}
		for i := range points {
			if d, ok := details[points[i].ID]; ok {
				points[i].UMKMDetail = &d
			}
		}
	}

	return points, nil
}

func (r *MapRepository) getUMKMDetails(ctx context.Context, mapPointIDs []string) (map[string]model.MapPointUMKMDetail, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT map_point_id, price, contact_phone, owner_name
		FROM map_point_umkm_details
		WHERE map_point_id = ANY($1)
	`, mapPointIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[string]model.MapPointUMKMDetail)
	for rows.Next() {
		var d model.MapPointUMKMDetail
		if err := rows.Scan(&d.MapPointID, &d.Price, &d.ContactPhone, &d.OwnerName); err != nil {
			return nil, err
		}
		result[d.MapPointID] = d
	}
	return result, rows.Err()
}

// GetByID mengambil satu titik peta berdasarkan ID, termasuk detail UMKM jika relevan.
func (r *MapRepository) GetByID(ctx context.Context, id string) (model.MapPoint, error) {
	query := `
		SELECT ` + mapPointSelectCols + `
		FROM map_points mp
		JOIN map_categories mc ON mc.id = mp.category_id
		WHERE mp.id = $1
	`
	p, err := scanMapPoint(r.pool.QueryRow(ctx, query, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return model.MapPoint{}, ErrNotFound
	}
	if err != nil {
		return model.MapPoint{}, err
	}

	if p.CategorySlug != nil && *p.CategorySlug == "umkm" {
		details, err := r.getUMKMDetails(ctx, []string{p.ID})
		if err != nil {
			return model.MapPoint{}, err
		}
		if d, ok := details[p.ID]; ok {
			p.UMKMDetail = &d
		}
	}

	return p, nil
}

// Create menyimpan titik peta baru, sekaligus detail UMKM jika disertakan.
func (r *MapRepository) Create(ctx context.Context, p model.MapPoint, umkm *model.MapPointUMKMDetail) (string, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var id string
	err = tx.QueryRow(ctx, `
		INSERT INTO map_points (category_id, name, subtitle, description, latitude, longitude, address, image_url, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`, p.CategoryID, p.Name, p.Subtitle, p.Description, p.Latitude, p.Longitude, p.Address, p.ImageURL, p.IsActive).Scan(&id)
	if err != nil {
		return "", err
	}

	if umkm != nil {
		_, err = tx.Exec(ctx, `
			INSERT INTO map_point_umkm_details (map_point_id, price, contact_phone, owner_name)
			VALUES ($1, $2, $3, $4)
		`, id, umkm.Price, umkm.ContactPhone, umkm.OwnerName)
		if err != nil {
			return "", err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return "", err
	}
	return id, nil
}

// Update memperbarui titik peta yang sudah ada, sekaligus upsert detail UMKM jika disertakan.
func (r *MapRepository) Update(ctx context.Context, p model.MapPoint, umkm *model.MapPointUMKMDetail, isUMKM bool) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	tag, err := tx.Exec(ctx, `
		UPDATE map_points SET
			category_id = $1, name = $2, subtitle = $3, description = $4, latitude = $5,
			longitude = $6, address = $7, image_url = $8, is_active = $9, updated_at = now()
		WHERE id = $10
	`, p.CategoryID, p.Name, p.Subtitle, p.Description, p.Latitude, p.Longitude, p.Address, p.ImageURL, p.IsActive, p.ID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	if isUMKM && umkm != nil {
		_, err = tx.Exec(ctx, `
			INSERT INTO map_point_umkm_details (map_point_id, price, contact_phone, owner_name)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (map_point_id) DO UPDATE SET
				price = EXCLUDED.price, contact_phone = EXCLUDED.contact_phone, owner_name = EXCLUDED.owner_name
		`, p.ID, umkm.Price, umkm.ContactPhone, umkm.OwnerName)
		if err != nil {
			return err
		}
	} else if !isUMKM {
		// Kategori berubah jadi bukan UMKM, bersihkan detail lama jika ada.
		_, err = tx.Exec(ctx, `DELETE FROM map_point_umkm_details WHERE map_point_id = $1`, p.ID)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// Delete menghapus titik peta berdasarkan ID.
func (r *MapRepository) Delete(ctx context.Context, id string) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM map_points WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

// ListCategories mengambil semua kategori titik peta.
func (r *MapRepository) ListCategories(ctx context.Context) ([]model.MapCategory, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, slug, color, icon FROM map_categories ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.MapCategory
	for rows.Next() {
		var c model.MapCategory
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.Color, &c.Icon); err != nil {
			return nil, err
		}
		result = append(result, c)
	}
	return result, rows.Err()
}

// GetCategorySlugByID mengambil slug kategori berdasarkan ID, dipakai untuk menentukan
// apakah suatu titik peta bertipe UMKM sebelum insert/update.
func (r *MapRepository) GetCategorySlugByID(ctx context.Context, categoryID string) (string, error) {
	var slug string
	err := r.pool.QueryRow(ctx, `SELECT slug FROM map_categories WHERE id = $1`, categoryID).Scan(&slug)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", ErrNotFound
	}
	return slug, err
}
