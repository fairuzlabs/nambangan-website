package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/faza/rw18-nambangan-backend/internal/model"
)

var ErrNotFound = errors.New("data tidak ditemukan")

type NewsRepository struct {
	pool *pgxpool.Pool
}

func NewNewsRepository(pool *pgxpool.Pool) *NewsRepository {
	return &NewsRepository{pool: pool}
}

const newsSelectCols = `
	n.id, n.title, n.slug, n.excerpt, n.content, n.image_url, n.category_id, n.author_id,
	n.status, n.published_at, n.created_at, n.updated_at,
	nc.name, nc.slug, a.display_name
`

func scanNews(row pgx.Row) (model.News, error) {
	var n model.News
	err := row.Scan(
		&n.ID, &n.Title, &n.Slug, &n.Excerpt, &n.Content, &n.ImageURL, &n.CategoryID, &n.AuthorID,
		&n.Status, &n.PublishedAt, &n.CreatedAt, &n.UpdatedAt,
		&n.CategoryName, &n.CategorySlug, &n.AuthorName,
	)
	return n, err
}

// List mengambil daftar berita dengan filter opsional kategori/pencarian dan paginasi.
func (r *NewsRepository) List(ctx context.Context, categorySlug, status, search string, limit, offset int) ([]model.News, int64, error) {
	baseQuery := `
		FROM news n
		LEFT JOIN news_categories nc ON nc.id = n.category_id
		LEFT JOIN admins a ON a.id = n.author_id
		WHERE 1=1
	`
	args := []interface{}{}
	argPos := 1

	if status != "" {
		baseQuery += ` AND n.status = $` + itoa(argPos)
		args = append(args, status)
		argPos++
	}
	if categorySlug != "" {
		baseQuery += ` AND nc.slug = $` + itoa(argPos)
		args = append(args, categorySlug)
		argPos++
	}
	if search != "" {
		baseQuery += ` AND (n.title ILIKE $` + itoa(argPos) + ` OR n.excerpt ILIKE $` + itoa(argPos) + `)`
		args = append(args, "%"+search+"%")
		argPos++
	}

	var total int64
	countQuery := `SELECT COUNT(*) ` + baseQuery
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	query := `SELECT ` + newsSelectCols + baseQuery + ` ORDER BY n.published_at DESC NULLS LAST, n.created_at DESC LIMIT $` + itoa(argPos) + ` OFFSET $` + itoa(argPos+1)
	args = append(args, limit, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var result []model.News
	for rows.Next() {
		n, err := scanNews(rows)
		if err != nil {
			return nil, 0, err
		}
		result = append(result, n)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return result, total, nil
}

// GetBySlug mengambil satu berita berdasarkan slug.
func (r *NewsRepository) GetBySlug(ctx context.Context, slug string) (model.News, error) {
	query := `SELECT ` + newsSelectCols + `
		FROM news n
		LEFT JOIN news_categories nc ON nc.id = n.category_id
		LEFT JOIN admins a ON a.id = n.author_id
		WHERE n.slug = $1
	`
	n, err := scanNews(r.pool.QueryRow(ctx, query, slug))
	if errors.Is(err, pgx.ErrNoRows) {
		return model.News{}, ErrNotFound
	}
	return n, err
}

// GetByID mengambil satu berita berdasarkan ID.
func (r *NewsRepository) GetByID(ctx context.Context, id string) (model.News, error) {
	query := `SELECT ` + newsSelectCols + `
		FROM news n
		LEFT JOIN news_categories nc ON nc.id = n.category_id
		LEFT JOIN admins a ON a.id = n.author_id
		WHERE n.id = $1
	`
	n, err := scanNews(r.pool.QueryRow(ctx, query, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return model.News{}, ErrNotFound
	}
	return n, err
}

// Create menyimpan berita baru dan mengembalikan ID-nya.
func (r *NewsRepository) Create(ctx context.Context, n model.News) (string, error) {
	query := `
		INSERT INTO news (title, slug, excerpt, content, image_url, category_id, author_id, status, published_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`
	var id string
	err := r.pool.QueryRow(ctx, query,
		n.Title, n.Slug, n.Excerpt, n.Content, n.ImageURL, n.CategoryID, n.AuthorID, n.Status, n.PublishedAt,
	).Scan(&id)
	return id, err
}

// Update memperbarui berita yang sudah ada (full field, dipanggil setelah merge di service layer).
func (r *NewsRepository) Update(ctx context.Context, n model.News) error {
	query := `
		UPDATE news SET
			title = $1, slug = $2, excerpt = $3, content = $4, image_url = $5,
			category_id = $6, status = $7, published_at = $8, updated_at = now()
		WHERE id = $9
	`
	tag, err := r.pool.Exec(ctx, query,
		n.Title, n.Slug, n.Excerpt, n.Content, n.ImageURL, n.CategoryID, n.Status, n.PublishedAt, n.ID,
	)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

// Delete menghapus berita berdasarkan ID.
func (r *NewsRepository) Delete(ctx context.Context, id string) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM news WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

// ListCategories mengambil semua kategori berita.
func (r *NewsRepository) ListCategories(ctx context.Context) ([]model.NewsCategory, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, slug FROM news_categories ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.NewsCategory
	for rows.Next() {
		var c model.NewsCategory
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug); err != nil {
			return nil, err
		}
		result = append(result, c)
	}
	return result, rows.Err()
}
