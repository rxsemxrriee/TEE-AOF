package repository

import (
	"TEE-AOF/internal/model"
	"gorm.io/gorm"
)

type MenuRepository struct {
	db *gorm.DB
}

func NewMenuRepository (db *gorm.DB) *MenuRepository {
	return &MenuRepository{db: db}
}

func (r *MenuRepository) FindAllAvailable() ([]model.MenuItem, error) {
	var menus []model.MenuItem
	err := r.db.
		Where("available = ?", true).
		Find(&menus).Error

	return menus, err
}