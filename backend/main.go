package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.ngrok.com/ngrok/v2"
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
	l, err := ngrok.Listen(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("endpoint url: ", l.URL())
	http.Serve(l, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello from your ngrok-delivered Go app!")
	}))
}
