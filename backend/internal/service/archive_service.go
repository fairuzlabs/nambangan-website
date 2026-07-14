package service

import (
	"context"

	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
	"github.com/faza/rw18-nambangan-backend/internal/util"
)

type ArchiveService struct {
	repo *repository.ArchiveRepository
}

func NewArchiveService(repo *repository.ArchiveRepository) *ArchiveService {
	return &ArchiveService{repo: repo}
}

func (s *ArchiveService) List(ctx context.Context, docType, programType, tagSlug string, page, limit, offset int) ([]model.ArchiveDocument, model.Pagination, error) {
	items, total, err := s.repo.List(ctx, docType, programType, tagSlug, limit, offset)
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

func (s *ArchiveService) GetByID(ctx context.Context, id string) (model.ArchiveDocument, error) {
	return s.repo.GetByID(ctx, id)
}

func toFileInputs(req []struct {
	FileURL   string  `json:"file_url"`
	FileType  *string `json:"file_type"`
	FileName  *string `json:"file_name"`
	SortOrder int     `json:"sort_order"`
}) []repository.ArchiveFileInput {
	files := make([]repository.ArchiveFileInput, 0, len(req))
	for _, f := range req {
		files = append(files, repository.ArchiveFileInput{
			FileURL:   f.FileURL,
			FileType:  f.FileType,
			FileName:  f.FileName,
			SortOrder: f.SortOrder,
		})
	}
	return files
}

func (s *ArchiveService) Create(ctx context.Context, req model.ArchiveDocumentCreateRequest) (model.ArchiveDocument, error) {
	if req.Title == "" || req.DocType == "" {
		return model.ArchiveDocument{}, ErrValidation
	}

	d := model.ArchiveDocument{
		Title:        req.Title,
		Description:  req.Description,
		DocType:      req.DocType,
		ProgramType:  req.ProgramType,
		ActivityDate: req.ActivityDate,
	}

	id, err := s.repo.Create(ctx, d, toFileInputs(req.Files), req.TagIDs)
	if err != nil {
		return model.ArchiveDocument{}, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *ArchiveService) Update(ctx context.Context, id string, req model.ArchiveDocumentUpdateRequest) (model.ArchiveDocument, error) {
	existing, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return model.ArchiveDocument{}, err
	}

	if req.Title != nil {
		existing.Title = *req.Title
	}
	if req.Description != nil {
		existing.Description = req.Description
	}
	if req.DocType != nil {
		existing.DocType = *req.DocType
	}
	if req.ProgramType != nil {
		existing.ProgramType = req.ProgramType
	}
	if req.ActivityDate != nil {
		existing.ActivityDate = req.ActivityDate
	}

	replaceFiles := req.Files != nil
	replaceTags := req.TagIDs != nil

	if err := s.repo.Update(ctx, existing, toFileInputs(req.Files), replaceFiles, req.TagIDs, replaceTags); err != nil {
		return model.ArchiveDocument{}, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *ArchiveService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
