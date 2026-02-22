package service

import (
	"fmt"
	"time"

	"TEE-AOF/internal/domain/buffet"
	domainOrder "TEE-AOF/internal/domain/order"
	"TEE-AOF/internal/model"
	"TEE-AOF/internal/repository"

	"gorm.io/gorm"
)

type OrderService struct {
	repo  repository.OrderRepository
	rules []buffet.Rule
}

func NewOrderService(
	repo repository.OrderRepository,
	rules []buffet.Rule,
) *OrderService {
	return &OrderService{
		repo:  repo,
		rules: rules,
	}
}

func (s *OrderService) CreateOrder(
	tableID uint,
	items []model.OrderItem,
) (*model.Order, error) {

	// mock session 2 ชั่วโมง
	session := buffet.NewSession(fmt.Sprintf("%d", tableID), 2*time.Hour)

	// convert to domain item
	var domainItems []domainOrder.Item
	for _, i := range items {
		item, err := domainOrder.NewItem(fmt.Sprintf("%d", i.MenuItemID), i.Quantity)
		if err != nil {
			return nil, err
		}
		domainItems = append(domainItems, item)
	}

	// run rules
	for _, rule := range s.rules {
		if err := rule.Validate(session, domainItems); err != nil {
			return nil, err
		}
	}

	returnOrder := &model.Order{}

	err := s.repo.WithTransaction(func(tx *gorm.DB) error {

		var existing model.Order
		if err := tx.
			Where("table_id = ? AND status = ?", tableID, "pending").
			First(&existing).Error; err == nil {
			return fmt.Errorf("pending order already exists")
		}

		order := model.Order{
			TableID: tableID,
			Status:  "pending",
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		for i := range items {
			items[i].OrderID = order.ID
		}

		if err := tx.Create(&items).Error; err != nil {
			return err
		}

		*returnOrder = order
		return nil
	})

	if err != nil {
		return nil, err
	}

	return returnOrder, nil
}

func (s *OrderService) GetAllOrders() ([]model.Order, error) {
	return s.repo.FindAll()
}

func (s *OrderService) UpdateOrderStatus(orderID uint, status string) error {
	if status != "pending" && status != "preparing" && status != "served" {
		return fmt.Errorf("invalid status")
	}
	return s.repo.UpdateStatus(orderID, status)
}
