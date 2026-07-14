package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/faza/rw18-nambangan-backend/internal/model"
)

type PodcastRepository struct {
	pool *pgxpool.Pool
}

func NewPodcastRepository(pool *pgxpool.Pool) *PodcastRepository {
	return &PodcastRepository{pool: pool}
}

const podcastSelectCols = `
	pe.id, pe.title, pe.slug, pe.description, pe.youtube_url, pe.youtube_video_id, pe.category_id,
	pe.duration_seconds, pe.published_at, pe.is_featured, pe.created_at,
	pc.name, pc.slug
`

func scanPodcastEpisode(row pgx.Row) (model.PodcastEpisode, error) {
	var e model.PodcastEpisode
	err := row.Scan(
		&e.ID, &e.Title, &e.Slug, &e.Description, &e.YoutubeURL, &e.YoutubeVideoID, &e.CategoryID,
		&e.DurationSeconds, &e.PublishedAt, &e.IsFeatured, &e.CreatedAt,
		&e.CategoryName, &e.CategorySlug,
	)
	return e, err
}

// List mengambil daftar episode podcast dengan filter opsional kategori & featured.
func (r *PodcastRepository) List(ctx context.Context, categorySlug string, featuredOnly bool, limit, offset int) ([]model.PodcastEpisode, int64, error) {
	baseQuery := `
		FROM podcast_episodes pe
		LEFT JOIN podcast_categories pc ON pc.id = pe.category_id
		WHERE 1=1
	`
	args := []interface{}{}
	argPos := 1

	if categorySlug != "" {
		baseQuery += ` AND pc.slug = $` + itoa(argPos)
		args = append(args, categorySlug)
		argPos++
	}
	if featuredOnly {
		baseQuery += ` AND pe.is_featured = true`
	}

	var total int64
	if err := r.pool.QueryRow(ctx, `SELECT COUNT(*) `+baseQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	query := `SELECT ` + podcastSelectCols + baseQuery + ` ORDER BY pe.published_at DESC NULLS LAST, pe.created_at DESC LIMIT $` + itoa(argPos) + ` OFFSET $` + itoa(argPos+1)
	args = append(args, limit, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var episodes []model.PodcastEpisode
	var ids []string
	for rows.Next() {
		e, err := scanPodcastEpisode(rows)
		if err != nil {
			return nil, 0, err
		}
		episodes = append(episodes, e)
		ids = append(ids, e.ID)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	guestMap, err := r.getGuestsForEpisodes(ctx, ids)
	if err != nil {
		return nil, 0, err
	}
	for i := range episodes {
		episodes[i].Guests = guestMap[episodes[i].ID]
	}

	return episodes, total, nil
}

func (r *PodcastRepository) getGuestsForEpisodes(ctx context.Context, episodeIDs []string) (map[string][]model.PodcastGuest, error) {
	result := make(map[string][]model.PodcastGuest)
	if len(episodeIDs) == 0 {
		return result, nil
	}

	rows, err := r.pool.Query(ctx, `
		SELECT peg.episode_id, pg.id, pg.name, pg.role
		FROM podcast_episode_guests peg
		JOIN podcast_guests pg ON pg.id = peg.guest_id
		WHERE peg.episode_id = ANY($1)
	`, episodeIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var episodeID string
		var g model.PodcastGuest
		if err := rows.Scan(&episodeID, &g.ID, &g.Name, &g.Role); err != nil {
			return nil, err
		}
		result[episodeID] = append(result[episodeID], g)
	}
	return result, rows.Err()
}

// GetBySlug mengambil satu episode berdasarkan slug, termasuk daftar tamu.
func (r *PodcastRepository) GetBySlug(ctx context.Context, slug string) (model.PodcastEpisode, error) {
	query := `
		SELECT ` + podcastSelectCols + `
		FROM podcast_episodes pe
		LEFT JOIN podcast_categories pc ON pc.id = pe.category_id
		WHERE pe.slug = $1
	`
	e, err := scanPodcastEpisode(r.pool.QueryRow(ctx, query, slug))
	if errors.Is(err, pgx.ErrNoRows) {
		return model.PodcastEpisode{}, ErrNotFound
	}
	if err != nil {
		return model.PodcastEpisode{}, err
	}

	guestMap, err := r.getGuestsForEpisodes(ctx, []string{e.ID})
	if err != nil {
		return model.PodcastEpisode{}, err
	}
	e.Guests = guestMap[e.ID]

	return e, nil
}

// GetByID mengambil satu episode berdasarkan ID.
func (r *PodcastRepository) GetByID(ctx context.Context, id string) (model.PodcastEpisode, error) {
	query := `
		SELECT ` + podcastSelectCols + `
		FROM podcast_episodes pe
		LEFT JOIN podcast_categories pc ON pc.id = pe.category_id
		WHERE pe.id = $1
	`
	e, err := scanPodcastEpisode(r.pool.QueryRow(ctx, query, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return model.PodcastEpisode{}, ErrNotFound
	}
	if err != nil {
		return model.PodcastEpisode{}, err
	}

	guestMap, err := r.getGuestsForEpisodes(ctx, []string{e.ID})
	if err != nil {
		return model.PodcastEpisode{}, err
	}
	e.Guests = guestMap[e.ID]

	return e, nil
}

// Create menyimpan episode baru beserta relasi tamu (jika ada).
func (r *PodcastRepository) Create(ctx context.Context, e model.PodcastEpisode, guestIDs []string) (string, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var id string
	err = tx.QueryRow(ctx, `
		INSERT INTO podcast_episodes (title, slug, description, youtube_url, youtube_video_id, category_id, duration_seconds, published_at, is_featured)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`, e.Title, e.Slug, e.Description, e.YoutubeURL, e.YoutubeVideoID, e.CategoryID, e.DurationSeconds, e.PublishedAt, e.IsFeatured).Scan(&id)
	if err != nil {
		return "", err
	}

	if err := replaceEpisodeGuests(ctx, tx, id, guestIDs); err != nil {
		return "", err
	}

	if err := tx.Commit(ctx); err != nil {
		return "", err
	}
	return id, nil
}

// Update memperbarui episode yang sudah ada beserta relasi tamu jika guestIDs bukan nil.
func (r *PodcastRepository) Update(ctx context.Context, e model.PodcastEpisode, guestIDs []string, replaceGuests bool) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	tag, err := tx.Exec(ctx, `
		UPDATE podcast_episodes SET
			title = $1, slug = $2, description = $3, youtube_url = $4, youtube_video_id = $5,
			category_id = $6, duration_seconds = $7, published_at = $8, is_featured = $9
		WHERE id = $10
	`, e.Title, e.Slug, e.Description, e.YoutubeURL, e.YoutubeVideoID, e.CategoryID, e.DurationSeconds, e.PublishedAt, e.IsFeatured, e.ID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	if replaceGuests {
		if err := replaceEpisodeGuests(ctx, tx, e.ID, guestIDs); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func replaceEpisodeGuests(ctx context.Context, tx pgx.Tx, episodeID string, guestIDs []string) error {
	if _, err := tx.Exec(ctx, `DELETE FROM podcast_episode_guests WHERE episode_id = $1`, episodeID); err != nil {
		return err
	}
	for _, guestID := range guestIDs {
		if _, err := tx.Exec(ctx, `
			INSERT INTO podcast_episode_guests (episode_id, guest_id) VALUES ($1, $2)
		`, episodeID, guestID); err != nil {
			return err
		}
	}
	return nil
}

// Delete menghapus episode berdasarkan ID.
func (r *PodcastRepository) Delete(ctx context.Context, id string) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM podcast_episodes WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

// ListCategories mengambil semua kategori podcast.
func (r *PodcastRepository) ListCategories(ctx context.Context) ([]model.PodcastCategory, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, slug FROM podcast_categories ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.PodcastCategory
	for rows.Next() {
		var c model.PodcastCategory
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug); err != nil {
			return nil, err
		}
		result = append(result, c)
	}
	return result, rows.Err()
}

// ListGuests mengambil semua data narasumber podcast.
func (r *PodcastRepository) ListGuests(ctx context.Context) ([]model.PodcastGuest, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, role FROM podcast_guests ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.PodcastGuest
	for rows.Next() {
		var g model.PodcastGuest
		if err := rows.Scan(&g.ID, &g.Name, &g.Role); err != nil {
			return nil, err
		}
		result = append(result, g)
	}
	return result, rows.Err()
}
