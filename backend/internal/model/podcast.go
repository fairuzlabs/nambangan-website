package model

import "time"

// PodcastCategory merepresentasikan kategori episode podcast.
type PodcastCategory struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

// PodcastGuest merepresentasikan narasumber/bintang tamu podcast.
type PodcastGuest struct {
	ID   string  `json:"id"`
	Name string  `json:"name"`
	Role *string `json:"role"`
}

// PodcastEpisode merepresentasikan satu episode podcast.
type PodcastEpisode struct {
	ID              string     `json:"id"`
	Title           string     `json:"title"`
	Slug            string     `json:"slug"`
	Description     *string    `json:"description"`
	YoutubeURL      string     `json:"youtube_url"`
	YoutubeVideoID  *string    `json:"youtube_video_id"`
	CategoryID      *string    `json:"category_id"`
	DurationSeconds *int       `json:"duration_seconds"`
	PublishedAt     *time.Time `json:"published_at"`
	IsFeatured      bool       `json:"is_featured"`
	CreatedAt       time.Time  `json:"created_at"`

	CategoryName *string        `json:"category_name,omitempty"`
	CategorySlug *string        `json:"category_slug,omitempty"`
	Guests       []PodcastGuest `json:"guests,omitempty"`
}

// PodcastEpisodeCreateRequest adalah payload untuk membuat episode baru.
type PodcastEpisodeCreateRequest struct {
	Title           string     `json:"title"`
	Slug            string     `json:"slug"`
	Description     *string    `json:"description"`
	YoutubeURL      string     `json:"youtube_url"`
	YoutubeVideoID  *string    `json:"youtube_video_id"`
	CategoryID      *string    `json:"category_id"`
	DurationSeconds *int       `json:"duration_seconds"`
	PublishedAt     *time.Time `json:"published_at"`
	IsFeatured      *bool      `json:"is_featured"`
	GuestIDs        []string   `json:"guest_ids"`
}

// PodcastEpisodeUpdateRequest adalah payload untuk memperbarui episode (partial update).
type PodcastEpisodeUpdateRequest struct {
	Title           *string    `json:"title"`
	Slug            *string    `json:"slug"`
	Description     *string    `json:"description"`
	YoutubeURL      *string    `json:"youtube_url"`
	YoutubeVideoID  *string    `json:"youtube_video_id"`
	CategoryID      *string    `json:"category_id"`
	DurationSeconds *int       `json:"duration_seconds"`
	PublishedAt     *time.Time `json:"published_at"`
	IsFeatured      *bool      `json:"is_featured"`
	GuestIDs        []string   `json:"guest_ids"`
}
