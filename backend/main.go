package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Enable CORS so React can connect
	r.Use(cors.Default())

	r.GET("/api/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello from Golang!",
		})
	})

	r.Run(":8080") // Backend runs on localhost:8080
}