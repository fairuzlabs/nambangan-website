package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/faza/rw18-nambangan-backend/internal/model"
)

type ArchiveRepository struct {
	pool *pgxpool.Pool
}

func NewArchiveRepository(pool *pgxpool.Pool) *ArchiveRepository {
	return &ArchiveRepository{pool: pool}
}

func scanArchiveDocument(row pgx.Row) (model.ArchiveDocument, error) {
	var d model.ArchiveDocument
	err := row.Scan(&d.ID, &d.Title, &d.Description, &d.DocType, &d.ProgramType, &d.ActivityDate, &d.CreatedAt)
	return d, err
}

// List mengambil daftar dokumen arsip dengan filter opsional doc_type, program_type, dan tag.
func (r *ArchiveRepository) List(ctx context.Context, docType, programType, tagSlug string, limit, offset int) ([]model.ArchiveDocument, int64, error) {
	baseQuery := `
		FROM archive_documents ad
		WHERE 1=1
	`
	args := []interface{}{}
	argPos := 1

	if docType != "" {
		baseQuery += ` AND ad.doc_type = $` + itoa(argPos)
		args = append(args, docType)
		argPos++
	}
	if programType != "" {
		baseQuery += ` AND ad.program_type = $` + itoa(argPos)
		args = append(args, programType)
		argPos++
	}
	if tagSlug != "" {
		baseQuery += ` AND EXISTS (
			SELECT 1 FROM archive_document_tags adt
			JOIN tags t ON t.id = adt.tag_id
			WHERE adt.document_id = ad.id AND t.slug = $` + itoa(argPos) + `
		)`
		args = append(args, tagSlug)
		argPos++
	}

	var total int64
	if err := r.pool.QueryRow(ctx, `SELECT COUNT(*) `+baseQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	query := `SELECT ad.id, ad.title, ad.description, ad.doc_type, ad.program_type, ad.activity_date, ad.created_at ` +
		baseQuery + ` ORDER BY ad.activity_date DESC NULLS LAST, ad.created_at DESC LIMIT $` + itoa(argPos) + ` OFFSET $` + itoa(argPos+1)
	args = append(args, limit, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var docs []model.ArchiveDocument
	var ids []string
	for rows.Next() {
		d, err := scanArchiveDocument(rows)
		if err != nil {
			return nil, 0, err
		}
		docs = append(docs, d)
		ids = append(ids, d.ID)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	filesMap, err := r.getFilesForDocuments(ctx, ids)
	if err != nil {
		return nil, 0, err
	}
	tagsMap, err := r.getTagsForDocuments(ctx, ids)
	if err != nil {
		return nil, 0, err
	}
	for i := range docs {
		docs[i].Files = filesMap[docs[i].ID]
		docs[i].Tags = tagsMap[docs[i].ID]
	}

	return docs, total, nil
}

func (r *ArchiveRepository) getFilesForDocuments(ctx context.Context, documentIDs []string) (map[string][]model.ArchiveFile, error) {
	result := make(map[string][]model.ArchiveFile)
	if len(documentIDs) == 0 {
		return result, nil
	}
	rows, err := r.pool.Query(ctx, `
		SELECT id, document_id, file_url, file_type, file_name, sort_order
		FROM archive_files WHERE document_id = ANY($1) ORDER BY sort_order ASC
	`, documentIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var f model.ArchiveFile
		if err := rows.Scan(&f.ID, &f.DocumentID, &f.FileURL, &f.FileType, &f.FileName, &f.SortOrder); err != nil {
			return nil, err
		}
		result[f.DocumentID] = append(result[f.DocumentID], f)
	}
	return result, rows.Err()
}

func (r *ArchiveRepository) getTagsForDocuments(ctx context.Context, documentIDs []string) (map[string][]model.Tag, error) {
	result := make(map[string][]model.Tag)
	if len(documentIDs) == 0 {
		return result, nil
	}
	rows, err := r.pool.Query(ctx, `
		SELECT adt.document_id, t.id, t.name, t.slug
		FROM archive_document_tags adt
		JOIN tags t ON t.id = adt.tag_id
		WHERE adt.document_id = ANY($1)
	`, documentIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var docID string
		var t model.Tag
		if err := rows.Scan(&docID, &t.ID, &t.Name, &t.Slug); err != nil {
			return nil, err
		}
		result[docID] = append(result[docID], t)
	}
	return result, rows.Err()
}

// GetByID mengambil satu dokumen arsip berdasarkan ID, termasuk file dan tag.
func (r *ArchiveRepository) GetByID(ctx context.Context, id string) (model.ArchiveDocument, error) {
	d, err := scanArchiveDocument(r.pool.QueryRow(ctx, `
		SELECT id, title, description, doc_type, program_type, activity_date, created_at
		FROM archive_documents WHERE id = $1
	`, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return model.ArchiveDocument{}, ErrNotFound
	}
	if err != nil {
		return model.ArchiveDocument{}, err
	}

	filesMap, err := r.getFilesForDocuments(ctx, []string{id})
	if err != nil {
		return model.ArchiveDocument{}, err
	}
	tagsMap, err := r.getTagsForDocuments(ctx, []string{id})
	if err != nil {
		return model.ArchiveDocument{}, err
	}
	d.Files = filesMap[id]
	d.Tags = tagsMap[id]

	return d, nil
}

// ArchiveFileInput adalah representasi ringkas file yang dilampirkan ke dokumen arsip.
type ArchiveFileInput struct {
	FileURL   string
	FileType  *string
	FileName  *string
	SortOrder int
}

// Create menyimpan dokumen arsip baru beserta file dan tag terkait.
func (r *ArchiveRepository) Create(ctx context.Context, d model.ArchiveDocument, files []ArchiveFileInput, tagIDs []string) (string, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var id string
	err = tx.QueryRow(ctx, `
		INSERT INTO archive_documents (title, description, doc_type, program_type, activity_date)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`, d.Title, d.Description, d.DocType, d.ProgramType, d.ActivityDate).Scan(&id)
	if err != nil {
		return "", err
	}

	if err := insertArchiveFiles(ctx, tx, id, files); err != nil {
		return "", err
	}
	if err := replaceArchiveTags(ctx, tx, id, tagIDs); err != nil {
		return "", err
	}

	if err := tx.Commit(ctx); err != nil {
		return "", err
	}
	return id, nil
}

func insertArchiveFiles(ctx context.Context, tx pgx.Tx, documentID string, files []ArchiveFileInput) error {
	for _, f := range files {
		if _, err := tx.Exec(ctx, `
			INSERT INTO archive_files (document_id, file_url, file_type, file_name, sort_order)
			VALUES ($1, $2, $3, $4, $5)
		`, documentID, f.FileURL, f.FileType, f.FileName, f.SortOrder); err != nil {
			return err
		}
	}
	return nil
}

func replaceArchiveTags(ctx context.Context, tx pgx.Tx, documentID string, tagIDs []string) error {
	if _, err := tx.Exec(ctx, `DELETE FROM archive_document_tags WHERE document_id = $1`, documentID); err != nil {
		return err
	}
	for _, tagID := range tagIDs {
		if _, err := tx.Exec(ctx, `
			INSERT INTO archive_document_tags (document_id, tag_id) VALUES ($1, $2)
		`, documentID, tagID); err != nil {
			return err
		}
	}
	return nil
}

// Update memperbarui dokumen arsip. Jika files/tagIDs bukan nil, seluruh relasi lama diganti.
func (r *ArchiveRepository) Update(ctx context.Context, d model.ArchiveDocument, files []ArchiveFileInput, replaceFiles bool, tagIDs []string, replaceTags bool) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	tag, err := tx.Exec(ctx, `
		UPDATE archive_documents SET
			title = $1, description = $2, doc_type = $3, program_type = $4, activity_date = $5
		WHERE id = $6
	`, d.Title, d.Description, d.DocType, d.ProgramType, d.ActivityDate, d.ID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	if replaceFiles {
		if _, err := tx.Exec(ctx, `DELETE FROM archive_files WHERE document_id = $1`, d.ID); err != nil {
			return err
		}
		if err := insertArchiveFiles(ctx, tx, d.ID, files); err != nil {
			return err
		}
	}
	if replaceTags {
		if err := replaceArchiveTags(ctx, tx, d.ID, tagIDs); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// Delete menghapus dokumen arsip berdasarkan ID.
func (r *ArchiveRepository) Delete(ctx context.Context, id string) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM archive_documents WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}
