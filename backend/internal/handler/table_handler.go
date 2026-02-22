package handler

import (

	"TEE-AOF/internal/service"

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
	c.JSON(200, gin.H{"data":table})
}