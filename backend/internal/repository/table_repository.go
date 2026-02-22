package repository

import (
	"TEE-AOF/internal/model"
	"gorm.io/gorm"
)

type TableRepository struct{
	db *gorm.DB
}

func NewTableRepository(db *gorm.DB) *TableRepository {
	return &TableRepository{db: db}

}

func (r *TableRepository) FindByToken(token string) (*model.Table, error){
	var table model.Table
	err := r.db.Where("token = ?", token).First(&table).Error
	if err != nil {
		return nil, err
	}
	return &table, nil
}