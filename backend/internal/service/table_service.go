package service

import (
	"TEE-AOF/internal/model"
	"TEE-AOF/internal/repository"
)

type TableService struct {
	repo *repository.TableRepository
}

func NewTableService(repo *repository.TableRepository) *TableService {
	return &TableService{repo: repo}

}

func (s *TableService) GetByToken(token string) (*model.Table, error){
	return s.repo.FindByToken(token)
}