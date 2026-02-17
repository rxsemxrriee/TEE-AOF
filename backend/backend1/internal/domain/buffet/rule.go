package buffet

import (
	"GO-learning-project/backend1/internal/domain/errors"
	"GO-learning-project/backend1/internal/domain/order"
)

type Rule interface {
	Validate(*Session, []order.Item) error
}

type TimeLimitRule struct{}

func (r TimeLimitRule) Validate(s *Session, _ []order.Item) error {
	if s.IsExpired() {
		return errors.ErrTimeExpired
	}
	return nil
}
