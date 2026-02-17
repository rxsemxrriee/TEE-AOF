package order

import (
	"errors"
	"time"
)

type Order struct {
	id string
	tableID	string
	items []Item
	createdAT time.Time
}

func NewOrder(id, tableID string, items []Item) (*Order, error) {
	if len(items) == 0 {
		return nil, errors.New("Order must have at aleast one item")
	}
	return &Order{
		id: id,
		tableID: tableID,
		items: items,
		createdAT: time.Now(),
	}, nil
}

