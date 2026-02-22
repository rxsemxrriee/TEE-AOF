package repository

import (
	"TEE-AOF/internal/model"

	"gorm.io/gorm"
)

type OrderRepository interface {
	WithTransaction(func(tx *gorm.DB) error) error
	FindAll() ([]model.Order, error)
	UpdateStatus(orderID uint, status string) error
	ClearServedOrders() error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) CreateOrder(order *model.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) CreateOrderItem(items []model.OrderItem) error {
	return r.db.Create(&items).Error
}

func (r *orderRepository) FindPendingByTableID(tableId uint) (*model.Order, error) {
	var order model.Order

	err := r.db.
		Where("table_id = ? AND status = ?", tableId, "pending").
		First(&order).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err

	}
	return &order, nil
}

func (r *orderRepository) WithTransaction(fn func(tx *gorm.DB) error) error {
	return r.db.Transaction(fn)
}

func (r *orderRepository) FindAll() ([]model.Order, error) {
	var orders []model.Order
	err := r.db.Preload("Items").Preload("Items.MenuItem").Preload("Table").Find(&orders).Error
	return orders, err
}

func (r *orderRepository) UpdateStatus(orderID uint, status string) error {
	return r.db.
		Model(&model.Order{}).
		Where("id = ?", orderID).
		Update("status", status).Error
}

func (r *orderRepository) ClearServedOrders() error {
	return r.db.Where("status = ?", "served").Delete(&model.Order{}).Error
}
