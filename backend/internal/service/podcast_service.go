package service

import (
	"context"

	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
	"github.com/faza/rw18-nambangan-backend/internal/util"
)

type PodcastService struct {
	repo *repository.PodcastRepository
}

func NewPodcastService(repo *repository.PodcastRepository) *PodcastService {
	return &PodcastService{repo: repo}
}

func (s *PodcastService) List(ctx context.Context, categorySlug string, featuredOnly bool, page, limit, offset int) ([]model.PodcastEpisode, model.Pagination, error) {
	items, total, err := s.repo.List(ctx, categorySlug, featuredOnly, limit, offset)
	if err != nil {
		return nil, model.Pagination{}, err
	}
	pagination := model.Pagination{
		Page:       page,
		Limit:      limit,
		TotalItems: total,
		TotalPages: util.TotalPages(total, limit),
	}
	return items, pagination, nil
}

func (s *PodcastService) GetBySlug(ctx context.Context, slug string) (model.PodcastEpisode, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *PodcastService) GetByID(ctx context.Context, id string) (model.PodcastEpisode, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PodcastService) ListCategories(ctx context.Context) ([]model.PodcastCategory, error) {
	return s.repo.ListCategories(ctx)
}

func (s *PodcastService) ListGuests(ctx context.Context) ([]model.PodcastGuest, error) {
	return s.repo.ListGuests(ctx)
}

func (s *PodcastService) Create(ctx context.Context, req model.PodcastEpisodeCreateRequest) (model.PodcastEpisode, error) {
	if req.Title == "" || req.YoutubeURL == "" {
		return model.PodcastEpisode{}, ErrValidation
	}

	slug := req.Slug
	if slug == "" {
		slug = util.Slugify(req.Title)
	} else {
		slug = util.Slugify(slug)
	}

	isFeatured := false
	if req.IsFeatured != nil {
		isFeatured = *req.IsFeatured
	}

	e := model.PodcastEpisode{
		Title:           req.Title,
		Slug:            slug,
		Description:     req.Description,
		YoutubeURL:      req.YoutubeURL,
		YoutubeVideoID:  req.YoutubeVideoID,
		CategoryID:      req.CategoryID,
		DurationSeconds: req.DurationSeconds,
		PublishedAt:     req.PublishedAt,
		IsFeatured:      isFeatured,
	}

	id, err := s.repo.Create(ctx, e, req.GuestIDs)
	if err != nil {
		return model.PodcastEpisode{}, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *PodcastService) Update(ctx context.Context, id string, req model.PodcastEpisodeUpdateRequest) (model.PodcastEpisode, error) {
	existing, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return model.PodcastEpisode{}, err
	}

	if req.Title != nil {
		existing.Title = *req.Title
	}
	if req.Slug != nil {
		existing.Slug = util.Slugify(*req.Slug)
	} else if req.Title != nil {
		existing.Slug = util.Slugify(*req.Title)
	}
	if req.Description != nil {
		existing.Description = req.Description
	}
	if req.YoutubeURL != nil {
		existing.YoutubeURL = *req.YoutubeURL
	}
	if req.YoutubeVideoID != nil {
		existing.YoutubeVideoID = req.YoutubeVideoID
	}
	if req.CategoryID != nil {
		existing.CategoryID = req.CategoryID
	}
	if req.DurationSeconds != nil {
		existing.DurationSeconds = req.DurationSeconds
	}
	if req.PublishedAt != nil {
		existing.PublishedAt = req.PublishedAt
	}
	if req.IsFeatured != nil {
		existing.IsFeatured = *req.IsFeatured
	}

	replaceGuests := req.GuestIDs != nil
	if err := s.repo.Update(ctx, existing, req.GuestIDs, replaceGuests); err != nil {
		return model.PodcastEpisode{}, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *PodcastService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
