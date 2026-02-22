package order

import "errors"

type Item struct {
	menuID string
	quantity int
}

func NewItem(menuID string, quantity int) (Item, error) {
	if menuID == "" {
		return Item{}, errors.New("menuID is required")
	}
	if quantity <= 0 {
		return Item{}, errors.New("quantity must be greater than 0")
	}
	return Item{
		menuID: menuID,
		quantity: quantity,
	}, nil
}