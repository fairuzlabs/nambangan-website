package service

import (
	"context"

	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
)

type MapService struct {
	repo *repository.MapRepository
}

func NewMapService(repo *repository.MapRepository) *MapService {
	return &MapService{repo: repo}
}

func (s *MapService) List(ctx context.Context, categorySlug string, activeOnly bool) ([]model.MapPoint, error) {
	return s.repo.List(ctx, categorySlug, activeOnly)
}

func (s *MapService) GetByID(ctx context.Context, id string) (model.MapPoint, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *MapService) ListCategories(ctx context.Context) ([]model.MapCategory, error) {
	return s.repo.ListCategories(ctx)
}

func (s *MapService) Create(ctx context.Context, req model.MapPointCreateRequest) (model.MapPoint, error) {
	if req.Name == "" || req.CategoryID == "" {
		return model.MapPoint{}, ErrValidation
	}

	slug, err := s.repo.GetCategorySlugByID(ctx, req.CategoryID)
	if err != nil {
		return model.MapPoint{}, err
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	p := model.MapPoint{
		CategoryID:  req.CategoryID,
		Name:        req.Name,
		Subtitle:    req.Subtitle,
		Description: req.Description,
		Latitude:    req.Latitude,
		Longitude:   req.Longitude,
		Address:     req.Address,
		ImageURL:    req.ImageURL,
		IsActive:    isActive,
	}

	var umkm *model.MapPointUMKMDetail
	if slug == "umkm" {
		umkm = &model.MapPointUMKMDetail{
			Price:        req.Price,
			ContactPhone: req.ContactPhone,
			OwnerName:    req.OwnerName,
		}
	}

	id, err := s.repo.Create(ctx, p, umkm)
	if err != nil {
		return model.MapPoint{}, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *MapService) Update(ctx context.Context, id string, req model.MapPointUpdateRequest) (model.MapPoint, error) {
	existing, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return model.MapPoint{}, err
	}

	categoryID := existing.CategoryID
	if req.CategoryID != nil {
		categoryID = *req.CategoryID
	}
	if req.Name != nil {
		existing.Name = *req.Name
	}
	if req.Subtitle != nil {
		existing.Subtitle = req.Subtitle
	}
	if req.Description != nil {
		existing.Description = req.Description
	}
	if req.Latitude != nil {
		existing.Latitude = *req.Latitude
	}
	if req.Longitude != nil {
		existing.Longitude = *req.Longitude
	}
	if req.Address != nil {
		existing.Address = req.Address
	}
	if req.ImageURL != nil {
		existing.ImageURL = req.ImageURL
	}
	if req.IsActive != nil {
		existing.IsActive = *req.IsActive
	}
	existing.CategoryID = categoryID

	slug, err := s.repo.GetCategorySlugByID(ctx, categoryID)
	if err != nil {
		return model.MapPoint{}, err
	}
	isUMKM := slug == "umkm"

	var umkm *model.MapPointUMKMDetail
	if isUMKM {
		umkm = &model.MapPointUMKMDetail{
			Price:        req.Price,
			ContactPhone: req.ContactPhone,
			OwnerName:    req.OwnerName,
		}
		if existing.UMKMDetail != nil {
			if umkm.Price == nil {
				umkm.Price = existing.UMKMDetail.Price
			}
			if umkm.ContactPhone == nil {
				umkm.ContactPhone = existing.UMKMDetail.ContactPhone
			}
			if umkm.OwnerName == nil {
				umkm.OwnerName = existing.UMKMDetail.OwnerName
			}
		}
	}

	if err := s.repo.Update(ctx, existing, umkm, isUMKM); err != nil {
		return model.MapPoint{}, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *MapService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
