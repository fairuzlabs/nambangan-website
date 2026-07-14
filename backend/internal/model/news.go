package model

import "time"

// NewsCategory merepresentasikan kategori berita.
type NewsCategory struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

// News merepresentasikan artikel berita/informasi RW.
type News struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Slug        string     `json:"slug"`
	Excerpt     string     `json:"excerpt"`
	Content     string     `json:"content"`
	ImageURL    *string    `json:"image_url"`
	CategoryID  *string    `json:"category_id"`
	AuthorID    *string    `json:"author_id"`
	Status      string     `json:"status"`
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`

	// Field hasil join, hanya diisi saat query list/detail.
	CategoryName *string `json:"category_name,omitempty"`
	CategorySlug *string `json:"category_slug,omitempty"`
	AuthorName   *string `json:"author_name,omitempty"`
}

// NewsCreateRequest adalah payload untuk membuat berita baru.
type NewsCreateRequest struct {
	Title       string     `json:"title"`
	Slug        string     `json:"slug"`
	Excerpt     string     `json:"excerpt"`
	Content     string     `json:"content"`
	ImageURL    *string    `json:"image_url"`
	CategoryID  *string    `json:"category_id"`
	Status      string     `json:"status"`
	PublishedAt *time.Time `json:"published_at"`
}

// NewsUpdateRequest adalah payload untuk memperbarui berita. Pointer dipakai
// supaya field yang tidak dikirim tidak ikut menimpa data lama (partial update).
type NewsUpdateRequest struct {
	Title       *string    `json:"title"`
	Slug        *string    `json:"slug"`
	Excerpt     *string    `json:"excerpt"`
	Content     *string    `json:"content"`
	ImageURL    *string    `json:"image_url"`
	CategoryID  *string    `json:"category_id"`
	Status      *string    `json:"status"`
	PublishedAt *time.Time `json:"published_at"`
}
