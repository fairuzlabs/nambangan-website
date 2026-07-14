package model

import "time"

// ArchiveFile merepresentasikan satu berkas (foto/pdf/dll) milik dokumen arsip.
type ArchiveFile struct {
	ID         string  `json:"id"`
	DocumentID string  `json:"document_id"`
	FileURL    string  `json:"file_url"`
	FileType   *string `json:"file_type"`
	FileName   *string `json:"file_name"`
	SortOrder  int     `json:"sort_order"`
}

// ArchiveDocument merepresentasikan satu dokumen arsip kegiatan RW.
type ArchiveDocument struct {
	ID           string     `json:"id"`
	Title        string     `json:"title"`
	Description  *string    `json:"description"`
	DocType      string     `json:"doc_type"`
	ProgramType  *string    `json:"program_type"`
	ActivityDate *time.Time `json:"activity_date"`
	CreatedAt    time.Time  `json:"created_at"`

	Files []ArchiveFile `json:"files,omitempty"`
	Tags  []Tag         `json:"tags,omitempty"`
}

// ArchiveDocumentCreateRequest adalah payload untuk membuat dokumen arsip baru.
type ArchiveDocumentCreateRequest struct {
	Title        string     `json:"title"`
	Description  *string    `json:"description"`
	DocType      string     `json:"doc_type"`
	ProgramType  *string    `json:"program_type"`
	ActivityDate *time.Time `json:"activity_date"`
	TagIDs       []string   `json:"tag_ids"`
	Files        []struct {
		FileURL   string  `json:"file_url"`
		FileType  *string `json:"file_type"`
		FileName  *string `json:"file_name"`
		SortOrder int     `json:"sort_order"`
	} `json:"files"`
}

// ArchiveDocumentUpdateRequest adalah payload untuk memperbarui dokumen arsip (partial update).
// Files dan TagIDs, jika dikirim (non-nil), akan menggantikan seluruh relasi lama.
type ArchiveDocumentUpdateRequest struct {
	Title        *string    `json:"title"`
	Description  *string    `json:"description"`
	DocType      *string    `json:"doc_type"`
	ProgramType  *string    `json:"program_type"`
	ActivityDate *time.Time `json:"activity_date"`
	TagIDs       []string   `json:"tag_ids"`
	Files        []struct {
		FileURL   string  `json:"file_url"`
		FileType  *string `json:"file_type"`
		FileName  *string `json:"file_name"`
		SortOrder int     `json:"sort_order"`
	} `json:"files"`
}
