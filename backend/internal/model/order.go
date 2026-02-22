package model

import "time"

type Order struct {
	ID			uint		
	TableID		uint		
	Status		string		
	CreateAt	time.Time	
}