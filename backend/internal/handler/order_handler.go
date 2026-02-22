package handler

import (
	"fmt"
	"TEE-AOF/internal/model"
	"TEE-AOF/internal/service"

	"github.com/gin-gonic/gin"
	// "net/http"
)

type CreateOrderRequest struct {
	Token string `json:"token"`
	Items []struct {
		MenuItemID uint `json:"menu_item_id"`
		Quantity   int	`json:"quantity"`
	} `json:"items"`
}

type UpdateStatusRequest struct {
	Status string `json:"status"`
}
type OrderHandler struct {
	service *service.OrderService
	tableService *service.TableService
}

func NewOrderHandler (orderService *service.OrderService, tableService *service.TableService,) *OrderHandler {
	return &OrderHandler{
		service: orderService,
		tableService: tableService,
	}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req CreateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error":"invalid request"})
		return
	}
	var items []model.OrderItem
	for _, item := range req.Items{
		items = append(items, model.OrderItem{
			MenuItemID: item.MenuItemID,
			Quantity: item.Quantity,
		})
	}

	table, err := h.tableService.GetByToken(req.Token)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid table"})
		return
	}
	order, err := h.service.CreateOrder(table.ID, items)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create order"})
		return
	}

	c.JSON(200, gin.H{"order_id":order.ID,})
}

func (h *OrderHandler) GetOrders(c *gin.Context){
	orders, err := h.service.GetAllOrders()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch orders"})
		return
	}
	c.JSON(200, gin.H{"data":orders})
}

func (h *OrderHandler) UpdateStatus(c *gin.Context) {
	idParam := c.Param("id")

	var orderID uint
	fmt.Sscan(idParam, &orderID)

	var req UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error":"invalid request"})
	}

	err := h.service.UpdateOrderStatus(orderID, req.Status)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}

	c.JSON(200, gin.H{"message": "status updated"})
}
