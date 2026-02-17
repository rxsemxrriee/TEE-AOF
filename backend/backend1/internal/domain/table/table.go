package table

import "errors"

type Table struct {
	id string 
}

func New(id string) (*Table, error) {
	if id == "" {
		return nil, errors.New("table id cannot be empty")
	}
	return &Table{id: id}, nil
}

func (t *Table) ID() string {
	return t.id
}