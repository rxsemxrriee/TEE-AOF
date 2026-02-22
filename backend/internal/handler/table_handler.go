package handler

import (
	"TEE-AOF/internal/service"
	"fmt"

	"github.com/gin-gonic/gin"
)

type TableHandler struct {
	service *service.TableService
}

func NewTableHandler(service *service.TableService) *TableHandler {
	return &TableHandler{service: service}
}

func (h *TableHandler) GetByToken(c *gin.Context) {
	token := c.Param("token")

	table, err := h.service.GetByToken(token)
	if err != nil {
		c.JSON(400, gin.H{"error": "table not found"})
		return
	}
	c.JSON(200, gin.H{"data": table})
}

func (h *TableHandler) GetTables(c *gin.Context) {
	tables, err := h.service.GetAllTables()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch tables"})
		return
	}
	c.JSON(200, gin.H{"data": tables})
}

func (h *TableHandler) CreateTable(c *gin.Context) {
	var req struct {
		TableNo string `json:"tableNo"` // kept as string for compatibility with older frontend if needed
	}
	c.ShouldBindJSON(&req)

	// Since older frontend sent tableNo as string "Table X", let's extract or parse int.
	// For simplicity in the new DB model, we'll try to parse it, but if it fails, default.
	var parsedNo int
	fmt.Sscanf(req.TableNo, "%d", &parsedNo)
	if parsedNo == 0 && req.TableNo != "" {
		fmt.Sscanf(req.TableNo, "Table %d", &parsedNo)
	}

	table, err := h.service.CreateTable(parsedNo)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create table"})
		return
	}
	c.JSON(200, gin.H{"data": table})
}

func (h *TableHandler) DeleteTable(c *gin.Context) {
	idParam := c.Param("id")
	var id uint
	if _, err := fmt.Sscan(idParam, &id); err != nil {
		c.JSON(400, gin.H{"error": "invalid table id"})
		return
	}

	err := h.service.DeleteTable(id)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to delete table"})
		return
	}
	c.JSON(200, gin.H{"message": "table deleted"})
}
