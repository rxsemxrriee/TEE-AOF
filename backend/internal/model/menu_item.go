package model

import "time"

type MenuItem struct {
	ID			uint		
	Name		string		
	Available	bool		
	CreateAt	time.Time	
	Category	string		 
}