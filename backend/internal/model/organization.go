package model

import "time"

type OrganizationMember struct {
	ID        string    `json:"id"`
	Position  string    `json:"position"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
