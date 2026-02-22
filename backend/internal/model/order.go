package model

import "time"

type Order struct {
	ID       uint
	TableID  uint
	Status   string
	CreateAt time.Time

	Items []OrderItem `gorm:"foreignKey:OrderID"`
	Table Table       `gorm:"foreignKey:TableID"`
}
