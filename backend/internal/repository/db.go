package repository

import (
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	// "qr-buffet/internal/model"
)

func NewDataBase() (*gorm.DB, error) {

	db, err := gorm.Open(sqlite.Open("teeAof.db"), &gorm.Config{})
	if err != nil{
		return nil, fmt.Errorf("failed to connect databse: %w", err)
	}

	return db, nil
	//err = db.AutoMigrate(
	//	&model.Table{},
	//	&model.MenuItem{},
	//	&model.Order{},
	//	&model.OrderItem{},
	//)
	//
	// if err != nil {
	//	return nil, fmt.Errorf("failed to migrate: %w", err)
	//}
	//return db, nil

}