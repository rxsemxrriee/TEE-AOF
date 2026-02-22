package buffet

import (
	"TEE-AOF/internal/domain/errors"
	"TEE-AOF/internal/domain/order"
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
