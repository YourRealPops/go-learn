package model

import "time"

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // never serialised to JSON
	CreatedAt    time.Time `json:"createdAt"`
}

type Progress struct {
	UserID      string    `json:"userId"`
	LessonSlug  string    `json:"lessonSlug"`
	CompletedAt time.Time `json:"completedAt"`
}

type Lesson struct {
	Slug        string `json:"slug"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Chapter     int    `json:"chapter"`
	Duration    int    `json:"duration"`
	StarterCode string `json:"starterCode"`
	Challenge   string `json:"challenge"`
	Hints       []string `json:"hints"`
}