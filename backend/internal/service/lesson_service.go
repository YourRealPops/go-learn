package service

import (
	"errors"

	"github.com/YourRealPops/go-learn/backend/internal/model"
	"github.com/YourRealPops/go-learn/backend/internal/repository"
)

type LessonService struct {
	progress repository.ProgressRepository
}

func NewLessonService(progress repository.ProgressRepository) *LessonService {
	return &LessonService{progress: progress}
}

func (s *LessonService) ListLessons(userID string) ([]model.Lesson, error) {
	return lessons, nil
}

func (s *LessonService) GetLesson(slug string) (*model.Lesson, error) {
	for _, l := range lessons {
		if l.Slug == slug {
			return &l, nil
		}
	}
	return nil, errors.New("lesson not found")
}

func (s *LessonService) CompleteLesson(userID, slug string) error {
	// Verify lesson exists
	if _, err := s.GetLesson(slug); err != nil {
		return err
	}
	return s.progress.Complete(userID, slug)
}

func (s *LessonService) GetProgress(userID string) ([]model.Progress, error) {
	return s.progress.GetProgress(userID)
}

// Lessons data — mirrors lib/lessons.ts on the frontend
// Move to DB when you add the Postgres repository
var lessons = []model.Lesson{
	{
		Slug:        "why-go",
		Title:       "Why Go?",
		Description: "Understand what problems Go solves and why it's designed the way it is.",
		Chapter:     1,
		Duration:    8,
		Challenge:   "Print your name and why you want to learn Go using fmt.Println. Run it.",
		Hints: []string{
			"Use fmt.Println(\"...\") — Go's print function is in the fmt package.",
			"Every Go program starts with package main and a func main() entry point.",
		},
		StarterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, Go!\")\n}\n",
	},
	{
		Slug:        "variables-and-types",
		Title:       "Variables & types",
		Description: "Learn Go's type system, zero values, and the := short declaration syntax.",
		Chapter:     2,
		Duration:    12,
		Challenge:   "Declare variables for a user's name, age, and balance. Print them all.",
		Hints: []string{
			"Use := for short variable declaration inside functions.",
			"var declares at package level or when you want to be explicit about the type.",
			"Go initialises all variables to their zero value.",
		},
		StarterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// your code here\n}\n",
	},
	{
		Slug:        "functions",
		Title:       "Functions & multiple returns",
		Description: "Go functions can return multiple values — this is idiomatic, not a quirk.",
		Chapter:     2,
		Duration:    15,
		Challenge:   "Write a divide(a, b float64) function that returns (float64, error).",
		Hints: []string{
			"Use errors.New(\"message\") from the errors package to create an error value.",
			"Check the error with: result, err := divide(10, 2); if err != nil { ... }",
		},
		StarterCode: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nfunc divide(a, b float64) (float64, error) {\n\treturn a / b, nil\n}\n\nfunc main() {\n\tresult, err := divide(10, 2)\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\tfmt.Println(result)\n}\n",
	},
}