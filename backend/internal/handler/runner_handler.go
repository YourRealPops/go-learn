package handler

import (
	"encoding/json"
	"net/http"

	"github.com/YourRealPops/go-learn/backend/internal/service"
	"github.com/YourRealPops/go-learn/backend/pkg/response"
)

type RunnerHandler struct {
	runner *service.RunnerService
}

func NewRunnerHandler(runner *service.RunnerService) *RunnerHandler {
	return &RunnerHandler{runner: runner}
}

type runRequest struct {
	Code       string `json:"code"`
	LessonSlug string `json:"lessonSlug"`
}

func (h *RunnerHandler) Run(w http.ResponseWriter, r *http.Request) {
	var req runRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	result, err := h.runner.Run(req.Code)
	if err != nil {
		response.Error(w, http.StatusServiceUnavailable, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, result)
}