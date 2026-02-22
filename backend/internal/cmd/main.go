package main

import (
	"fmt"
	"time"

	"TEE-AOF/internal/application/service"
	"TEE-AOF/internal/domain/buffet"
	"TEE-AOF/internal/domain/order"
)

// ----------------------------
// Mock Repository (test only)
// ----------------------------

type MockOrderRepository struct {
	store map[string]*order.Order
}

func NewMockRepo() *MockOrderRepository {
	return &MockOrderRepository{
		store: make(map[string]*order.Order),
	}
}

func (m *MockOrderRepository) Save(o *order.Order) error {
	m.store[o.ID] = o
	return nil
}

func (m *MockOrderRepository) Update(o *order.Order) error {
	m.store[o.ID] = o
	return nil
}

func (m *MockOrderRepository) FindByID(id string) (*order.Order, error) {
	return m.store[id], nil
}

func (m *MockOrderRepository) FindPending() ([]*order.Order, error) {
	var result []*order.Order
	for _, o := range m.store {
		if o.Status != order.StatusServed {
			result = append(result, o)
		}
	}
	return result, nil
}

// ----------------------------

func main() {

	repo := NewMockRepo()

	rules := []buffet.Rule{
		buffet.TimeLimitRule{},
	}

	orderService := service.NewOrderService(repo, rules)

	session := buffet.NewSession("T01", 2*time.Hour)

	item, _ := order.NewItem("MEAT001", 2)
	items := []order.Item{item}

	o, err := orderService.PlaceOrder(session, items)
	if err != nil {
		fmt.Println("error:", err)
		return
	}

	fmt.Println("Order created:", o.ID)

	orderService.MarkPreparing(o.ID)
	fmt.Println("Status:", o.Status)

	orderService.MarkServed(o.ID)
	fmt.Println("Status:", o.Status)
}
