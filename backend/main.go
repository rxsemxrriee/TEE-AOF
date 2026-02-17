package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

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

	// Session management
	r.POST("/api/sessions", createSession)
	r.GET("/api/sessions", getAllSessions)
	r.GET("/api/sessions/:id", getSession)
	r.POST("/api/sessions/:id/join", joinSession)

	// Order management
	r.POST("/api/sessions/:id/orders", addOrder)
	r.GET("/api/orders", getAllOrders)
	r.PUT("/api/sessions/:id/orders/:orderId", updateOrderStatus)

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

// Order structs
type OrderItem struct {
	Name string `json:"name"`
	Qty  int    `json:"qty"`
}

type Order struct {
	ID        string      `json:"order_id"`
	SessionID string      `json:"session_id"`
	TableNo   string      `json:"table_no"`
	Items     []OrderItem `json:"items"`
	Timestamp string      `json:"timestamp"`
	Status    string      `json:"status"`
}

// Session struct
type Session struct {
	ID        string   `json:"id"`
	Users     []string `json:"users"`
	Orders    []Order  `json:"orders"`
	IsActive  bool     `json:"isActive"`
	CreatedAt string   `json:"createdAt"`
}

type JoinRequest struct {
	Username string `json:"username"`
}

// In-memory session store
var (
	sessions = make(map[string]*Session)
	mu       sync.RWMutex
)

func createSession(c *gin.Context) {
	// Generate a simple random ID (in production use UUID)
	// For simplicity, we'll use a 6-digit random number
	id := fmt.Sprintf("%06d", rand.Intn(1000000))

	session := &Session{
		ID:        id,
		Users:     []string{},
		Orders:    []Order{},
		IsActive:  true,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	mu.Lock()
	sessions[id] = session
	mu.Unlock()

	c.JSON(http.StatusOK, session)
}

func getAllSessions(c *gin.Context) {
	mu.RLock()
	defer mu.RUnlock()

	var activeSessions []*Session
	for _, s := range sessions {
		if s.IsActive {
			activeSessions = append(activeSessions, s)
		}
	}
	c.JSON(http.StatusOK, activeSessions)
}

func getSession(c *gin.Context) {
	id := c.Param("id")
	mu.RLock()
	session, exists := sessions[id]
	mu.RUnlock()

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}
	c.JSON(http.StatusOK, session)
}

func joinSession(c *gin.Context) {
	id := c.Param("id")
	var req JoinRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	mu.Lock()
	defer mu.Unlock()

	session, exists := sessions[id]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	// Add user if not already in session (simple logic)
	for _, user := range session.Users {
		if user == req.Username {
			c.JSON(http.StatusOK, session) // Already joined
			return
		}
	}

	session.Users = append(session.Users, req.Username)
	c.JSON(http.StatusOK, session)
}

func addOrder(c *gin.Context) {
	id := c.Param("id")
	var order Order
	if err := c.BindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order data"})
		return
	}

	mu.Lock()
	defer mu.Unlock()

	session, exists := sessions[id]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	// Assign ID and timestamp if missing (though frontend might send them)
	if order.ID == "" {
		order.ID = fmt.Sprintf("%d", time.Now().UnixNano())
	}
	// Ensure SessionID is set
	order.SessionID = id
	if order.Timestamp == "" {
		order.Timestamp = time.Now().Format("15:04:05")
	}
	if order.Status == "" {
		order.Status = "pending"
	}

	session.Orders = append(session.Orders, order)
	c.JSON(http.StatusOK, session)
}

func getAllOrders(c *gin.Context) {
	mu.RLock()
	defer mu.RUnlock()

	var allOrders []Order
	for _, s := range sessions {
		if s.IsActive {
			allOrders = append(allOrders, s.Orders...)
		}
	}
	c.JSON(http.StatusOK, allOrders)
}

func updateOrderStatus(c *gin.Context) {
	sessionId := c.Param("id")
	orderId := c.Param("orderId")

	var req struct {
		Status string `json:"status"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status data"})
		return
	}

	mu.Lock()
	defer mu.Unlock()

	session, exists := sessions[sessionId]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	found := false
	for i, order := range session.Orders {
		if order.ID == orderId {
			session.Orders[i].Status = req.Status
			found = true
			break
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order status updated"})
}
