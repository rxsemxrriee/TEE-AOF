package model

import "time"

type Table struct {
	ID		  uint		
	Number    int		
	Status	  string   	// occupied / free
	Token	  string	
	CreateAt  time.Time 
}