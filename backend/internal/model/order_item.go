package model

type OrderItem struct {
	ID         uint
	OrderID    uint
	MenuItemID uint
	Quantity   int

	MenuItem MenuItem `gorm:"foreignKey:MenuItemID"`
}
