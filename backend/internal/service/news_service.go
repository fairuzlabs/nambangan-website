package service

import (
	"context"
	"errors"

	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
	"github.com/faza/rw18-nambangan-backend/internal/util"
)

var ErrValidation = errors.New("data yang dikirim tidak valid")

type NewsService struct {
	repo *repository.NewsRepository
}

func NewNewsService(repo *repository.NewsRepository) *NewsService {
	return &NewsService{repo: repo}
}

func (s *NewsService) List(ctx context.Context, categorySlug, status, search string, page, limit, offset int) ([]model.News, model.Pagination, error) {
	items, total, err := s.repo.List(ctx, categorySlug, status, search, limit, offset)
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

func (s *NewsService) GetBySlug(ctx context.Context, slug string) (model.News, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *NewsService) GetByID(ctx context.Context, id string) (model.News, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *NewsService) Create(ctx context.Context, req model.NewsCreateRequest, authorID string) (model.News, error) {
	if req.Title == "" || req.Content == "" || req.Excerpt == "" {
		return model.News{}, ErrValidation
	}

	slug := req.Slug
	if slug == "" {
		slug = util.Slugify(req.Title)
	} else {
		slug = util.Slugify(slug)
	}

	status := req.Status
	if status == "" {
		status = "published"
	}

	n := model.News{
		Title:       req.Title,
		Slug:        slug,
		Excerpt:     req.Excerpt,
		Content:     req.Content,
		ImageURL:    req.ImageURL,
		CategoryID:  req.CategoryID,
		AuthorID:    &authorID,
		Status:      status,
		PublishedAt: req.PublishedAt,
	}

	id, err := s.repo.Create(ctx, n)
	if err != nil {
		return model.News{}, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *NewsService) Update(ctx context.Context, id string, req model.NewsUpdateRequest) (model.News, error) {
	existing, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return model.News{}, err
	}

	if req.Title != nil {
		existing.Title = *req.Title
	}
	if req.Slug != nil {
		existing.Slug = util.Slugify(*req.Slug)
	} else if req.Title != nil {
		existing.Slug = util.Slugify(*req.Title)
	}
	if req.Excerpt != nil {
		existing.Excerpt = *req.Excerpt
	}
	if req.Content != nil {
		existing.Content = *req.Content
	}
	if req.ImageURL != nil {
		existing.ImageURL = req.ImageURL
	}
	if req.CategoryID != nil {
		existing.CategoryID = req.CategoryID
	}
	if req.Status != nil {
		existing.Status = *req.Status
	}
	if req.PublishedAt != nil {
		existing.PublishedAt = req.PublishedAt
	}

	if err := s.repo.Update(ctx, existing); err != nil {
		return model.News{}, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *NewsService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *NewsService) ListCategories(ctx context.Context) ([]model.NewsCategory, error) {
	return s.repo.ListCategories(ctx)
}
