package service

import (
	"fmt"
	"math/rand"
	"time"

	"TEE-AOF/internal/model"
	"TEE-AOF/internal/repository"
)

type TableService struct {
	repo *repository.TableRepository
}

func NewTableService(repo *repository.TableRepository) *TableService {
	return &TableService{repo: repo}
}

func (s *TableService) GetByToken(token string) (*model.Table, error) {
	return s.repo.FindByToken(token)
}

func (s *TableService) GetAllTables() ([]model.Table, error) {
	return s.repo.FindAll()
}

func generateToken() string {
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

func (s *TableService) CreateTable(tableNo int) (*model.Table, error) {
	table := &model.Table{
		Number:   tableNo,
		Status:   "occupied",
		Token:    generateToken(),
		CreateAt: time.Now(),
	}

	err := s.repo.Create(table)
	if err != nil {
		return nil, err
	}
	return table, nil
}

func (s *TableService) DeleteTable(id uint) error {
	return s.repo.Delete(id)
}
