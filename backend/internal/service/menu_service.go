package service

import (
	"TEE-AOF/internal/model"
	"TEE-AOF/internal/repository"
)

type MenuService struct {
	repo *repository.MenuRepository
}

func NewMenuService(repo *repository.MenuRepository) *MenuService{
	return &MenuService{repo: repo}
}

func (s *MenuService) GetAvailableMenu() ([]model.MenuItem, error) {
	return s.repo.FindAllAvailable()
}