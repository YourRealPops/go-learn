package handler

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/YourRealPops/go-learn/backend/internal/middleware"
	"github.com/YourRealPops/go-learn/backend/internal/service"
	"github.com/YourRealPops/go-learn/backend/pkg/response"
)

type LessonHandler struct {
	lessons *service.LessonService
}

func NewLessonHandler(lessons *service.LessonService) *LessonHandler {
	return &LessonHandler{lessons: lessons}
}

func (h *LessonHandler) ListLessons(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	lessons, err := h.lessons.ListLessons(userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "failed to load lessons")
		return
	}
	response.JSON(w, http.StatusOK, lessons)
}

func (h *LessonHandler) GetLesson(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	lesson, err := h.lessons.GetLesson(slug)
	if err != nil {
		response.Error(w, http.StatusNotFound, "lesson not found")
		return
	}
	response.JSON(w, http.StatusOK, lesson)
}

func (h *LessonHandler) CompleteLesson(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	slug := chi.URLParam(r, "slug")

	if err := h.lessons.CompleteLesson(userID, slug); err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"status": "completed"})
}

func (h *LessonHandler) GetProgress(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	progress, err := h.lessons.GetProgress(userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "failed to load progress")
		return
	}
	response.JSON(w, http.StatusOK, progress)
}