package model

// Tag merepresentasikan label/tag yang bisa dipakai di berbagai entitas (mis. arsip dokumen).
type Tag struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}
