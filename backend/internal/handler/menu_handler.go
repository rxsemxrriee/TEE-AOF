package handler

import (
	"net/http"
	"TEE-AOF/internal/service"
	"github.com/gin-gonic/gin"
)

type MenuHandler struct {
	service *service.MenuService
}

func NewMenuHandler(service *service.MenuService) *MenuHandler {
	return &MenuHandler{service: service}
}

func (h *MenuHandler) GetMenu(c *gin.Context) {
	menus, err := h.service.GetAvailableMenu()
	if err!=nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": menus})
}
