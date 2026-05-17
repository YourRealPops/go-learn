	package repository

import (
	"sync"
	"time"

	"github.com/YourRealPops/go-learn/backend/internal/model"
)

type ProgressRepository interface {
	Complete(userID, lessonSlug string) error
	GetProgress(userID string) ([]model.Progress, error)
	IsCompleted(userID, lessonSlug string) bool
}

type inMemoryProgressRepository struct {
	mu       sync.RWMutex
	progress map[string][]model.Progress // keyed by userID
}

func NewInMemoryProgressRepository() ProgressRepository {
	return &inMemoryProgressRepository{
		progress: make(map[string][]model.Progress),
	}
}

func (r *inMemoryProgressRepository) Complete(userID, lessonSlug string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Don't double-add
	for _, p := range r.progress[userID] {
		if p.LessonSlug == lessonSlug {
			return nil
		}
	}

	r.progress[userID] = append(r.progress[userID], model.Progress{
		UserID:      userID,
		LessonSlug:  lessonSlug,
		CompletedAt: time.Now(),
	})
	return nil
}

func (r *inMemoryProgressRepository) GetProgress(userID string) ([]model.Progress, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.progress[userID], nil
}

func (r *inMemoryProgressRepository) IsCompleted(userID, lessonSlug string) bool {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, p := range r.progress[userID] {
		if p.LessonSlug == lessonSlug {
			return true
		}
	}
	return false
}