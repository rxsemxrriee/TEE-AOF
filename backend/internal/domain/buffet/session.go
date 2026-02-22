package buffet

import "time"

type Session struct {
	TableID string
	EndTime time.Time
}

func NewSession(tableID string, duration time.Duration) *Session {
	return &Session{
		TableID: tableID,
		EndTime: time.Now().Add(duration),
	}
}

func (s *Session) IsExpired() bool {
	return time.Now().After(s.EndTime)
}
