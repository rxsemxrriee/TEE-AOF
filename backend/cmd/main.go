package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"TEE-AOF/internal/domain/buffet"
	"TEE-AOF/internal/handler"
	"TEE-AOF/internal/model"
	"TEE-AOF/internal/repository"
	"TEE-AOF/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.ngrok.com/ngrok/v2"
)

// Legacy Session Memory Store
type OrderItem struct {
	Name string `json:"name"`
	Qty  int    `json:"qty"`
}

type OrderMemory struct {
	ID        string      `json:"order_id"`
	SessionID string      `json:"session_id"`
	TableNo   string      `json:"table_no"`
	Items     []OrderItem `json:"items"`
	Timestamp string      `json:"timestamp"`
	Status    string      `json:"status"`
}

type Session struct {
	ID        string        `json:"id"`
	TableNo   string        `json:"tableNo"`
	Users     []string      `json:"users"`
	Orders    []OrderMemory `json:"orders"`
	IsActive  bool          `json:"isActive"`
	CreatedAt string        `json:"createdAt"`
}

type JoinRequest struct {
	Username string `json:"username"`
}

var (
	sessions = make(map[string]*Session)
	mu       sync.RWMutex
)

// Legacy Handlers
func createSession(c *gin.Context) {
	id := fmt.Sprintf("%06d", rand.Intn(1000000))

	var req struct {
		TableNo string `json:"tableNo"`
	}
	c.ShouldBindJSON(&req)

	session := &Session{
		ID:        id,
		TableNo:   req.TableNo,
		Users:     []string{},
		Orders:    []OrderMemory{},
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

	for _, user := range session.Users {
		if user == req.Username {
			c.JSON(http.StatusOK, session) // Already joined
			return
		}
	}

	session.Users = append(session.Users, req.Username)
	c.JSON(http.StatusOK, session)
}

func deleteSession(c *gin.Context) {
	id := c.Param("id")
	mu.Lock()
	defer mu.Unlock()

	if _, exists := sessions[id]; !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	delete(sessions, id)
	c.JSON(http.StatusOK, gin.H{"message": "Session deleted"})
}

func addOrder(c *gin.Context) {
	id := c.Param("id")
	var order OrderMemory
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

	if order.ID == "" {
		order.ID = fmt.Sprintf("%d", time.Now().UnixNano())
	}
	order.SessionID = id
	if session.TableNo != "" {
		order.TableNo = session.TableNo
	}

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

	var allOrders []OrderMemory
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

func main() {

	db, err := repository.NewDataBase()
	if err != nil {
		log.Fatal(err)
	}

	db.AutoMigrate(
		&model.MenuItem{},
		&model.Order{},
		&model.OrderItem{},
		&model.Table{},
	)

	// --- SEEDER ---
	var menuCount int64
	db.Model(&model.MenuItem{}).Count(&menuCount)
	if menuCount == 0 {
		defaultMenu := []model.MenuItem{
			{Name: "Sliced Pork", Category: "meat", Available: true},
			{Name: "Bacon", Category: "meat", Available: true},
			{Name: "Pork Liver", Category: "meat", Available: true},
			{Name: "Beef", Category: "meat", Available: true},
			{Name: "Dory Fish", Category: "fish", Available: true},
			{Name: "Salmon", Category: "fish", Available: true},
			{Name: "Jellyfish", Category: "fish", Available: true},
			{Name: "Squid", Category: "fish", Available: true},
			{Name: "Shrimp", Category: "fish", Available: true},
			{Name: "Morning Glory", Category: "veg", Available: true},
			{Name: "Cabbage", Category: "veg", Available: true},
			{Name: "Carrot", Category: "veg", Available: true},
			{Name: "Golden Needle Mushroom", Category: "veg", Available: true},
			{Name: "White Shimeji", Category: "veg", Available: true},
			{Name: "King Oyster Mushroom", Category: "veg", Available: true},
			{Name: "Snow Fungus", Category: "veg", Available: true},
			{Name: "Cheese", Category: "app", Available: true},
			{Name: "Pork Bounce", Category: "app", Available: true},
			{Name: "Fried Pork", Category: "app", Available: true},
			{Name: "Fried Chicken", Category: "app", Available: true},
			{Name: "Nugget", Category: "app", Available: true},
			{Name: "Water", Category: "drink", Available: true},
			{Name: "Pepsi", Category: "drink", Available: true},
			{Name: "Pandan", Category: "drink", Available: true},
			{Name: "Roselle", Category: "drink", Available: true},
			{Name: "Chrysanthemum", Category: "drink", Available: true},
		}
		for _, m := range defaultMenu {
			m.CreateAt = time.Now()
			db.Create(&m)
		}
		log.Println("Seeded default menu items.")
	}
	// --------------

	tableRepo := repository.NewTableRepository(db)
	tableService := service.NewTableService(tableRepo)
	tableHandler := handler.NewTableHandler(tableService)

	menuRepo := repository.NewMenuRepository(db)
	menuService := service.NewMenuService(menuRepo)
	menuHandler := handler.NewMenuHandler(menuService)

	rules := []buffet.Rule{
		buffet.TimeLimitRule{},
	}

	orderRepo := repository.NewOrderRepository(db)
	orderService := service.NewOrderService(orderRepo, rules)
	orderHandler := handler.NewOrderHandler(orderService, tableService)

	r := gin.Default()

	// Enable CORS
	r.Use(cors.Default())

	r.GET("/api/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello from Golang!",
		})
	})

	// Legacy endpoints Memory APIs
	r.POST("/api/sessions", createSession)
	r.GET("/api/sessions", getAllSessions)
	r.GET("/api/sessions/:id", getSession)
	r.POST("/api/sessions/:id/join", joinSession)
	r.DELETE("/api/sessions/:id", deleteSession)

	r.POST("/api/sessions/:id/orders", addOrder)
	r.GET("/api/orders", getAllOrders)
	r.PUT("/api/sessions/:id/orders/:orderId", updateOrderStatus)

	// Clean Architecture APIs
	r.GET("/menu", menuHandler.GetMenu)
	r.POST("/orders", orderHandler.CreateOrder)
	r.GET("/orders", orderHandler.GetOrders)
	r.DELETE("/orders/served", orderHandler.ClearServedOrders)
	r.PATCH("/orders/:id", orderHandler.UpdateStatus)
	r.GET("/tables", tableHandler.GetTables)
	r.POST("/tables", tableHandler.CreateTable)
	r.GET("/tables/:token", tableHandler.GetByToken)
	r.DELETE("/tables/:id", tableHandler.DeleteTable)

	// Expose via ngrok
	go func() {
		l, err := ngrok.Listen(context.Background())
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("endpoint url: ", l.URL())
		http.Serve(l, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			fmt.Fprintln(w, "Hello from your ngrok-delivered Go app!")
		}))
	}()

	r.Run(":8080")
}
