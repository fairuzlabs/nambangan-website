package model

import "time"

// MapCategory merepresentasikan kategori titik peta (Proklim, UMKM, Kesenian, dst).
type MapCategory struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Slug  string  `json:"slug"`
	Color *string `json:"color"`
	Icon  *string `json:"icon"`
}

// MapPointUMKMDetail berisi detail tambahan khusus titik peta bertipe UMKM.
type MapPointUMKMDetail struct {
	MapPointID   string   `json:"map_point_id"`
	Price        *float64 `json:"price"`
	ContactPhone *string  `json:"contact_phone"`
	OwnerName    *string  `json:"owner_name"`
}

// MapPoint merepresentasikan satu titik/lokasi pada peta interaktif.
type MapPoint struct {
	ID          string    `json:"id"`
	CategoryID  string    `json:"category_id"`
	Name        string    `json:"name"`
	Subtitle    *string   `json:"subtitle"`
	Description *string   `json:"description"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	Address     *string   `json:"address"`
	ImageURL    *string   `json:"image_url"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Field hasil join.
	CategoryName *string `json:"category_name,omitempty"`
	CategorySlug *string `json:"category_slug,omitempty"`

	// Diisi hanya jika kategori titik ini adalah UMKM dan detailnya tersedia.
	UMKMDetail *MapPointUMKMDetail `json:"umkm_detail,omitempty"`
}

// MapPointCreateRequest adalah payload untuk membuat titik peta baru.
type MapPointCreateRequest struct {
	CategoryID  string  `json:"category_id"`
	Name        string  `json:"name"`
	Subtitle    *string `json:"subtitle"`
	Description *string `json:"description"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Address     *string `json:"address"`
	ImageURL    *string `json:"image_url"`
	IsActive    *bool   `json:"is_active"`

	// Opsional, hanya dipakai jika kategorinya UMKM.
	Price        *float64 `json:"price"`
	ContactPhone *string  `json:"contact_phone"`
	OwnerName    *string  `json:"owner_name"`
}

// MapPointUpdateRequest adalah payload untuk memperbarui titik peta (partial update).
type MapPointUpdateRequest struct {
	CategoryID  *string  `json:"category_id"`
	Name        *string  `json:"name"`
	Subtitle    *string  `json:"subtitle"`
	Description *string  `json:"description"`
	Latitude    *float64 `json:"latitude"`
	Longitude   *float64 `json:"longitude"`
	Address     *string  `json:"address"`
	ImageURL    *string  `json:"image_url"`
	IsActive    *bool    `json:"is_active"`

	Price        *float64 `json:"price"`
	ContactPhone *string  `json:"contact_phone"`
	OwnerName    *string  `json:"owner_name"`
}
