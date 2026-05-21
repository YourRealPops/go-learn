package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"

	"github.com/YourRealPops/go-learn/backend/internal/handler"
	apimiddleware "github.com/YourRealPops/go-learn/backend/internal/middleware"
	"github.com/YourRealPops/go-learn/backend/internal/repository"
	"github.com/YourRealPops/go-learn/backend/internal/service"
)

func main() {
	// Load .env file (local dev only — Render injects env vars directly)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is required")
	}

	// --- Repositories ---
	// Use Postgres if DATABASE_URL is set, otherwise fall back to in-memory (local dev)
	var userRepo repository.UserRepository
	var progressRepo repository.ProgressRepository

	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		db, err := repository.NewDB()
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}
		defer db.Close()
		userRepo = repository.NewPostgresUserRepository(db)
		progressRepo = repository.NewPostgresProgressRepository(db)
		log.Println("Using PostgreSQL repositories")
	} else {
		userRepo = repository.NewInMemoryUserRepository()
		progressRepo = repository.NewInMemoryProgressRepository()
		log.Println("Using in-memory repositories (no DATABASE_URL set)")
	}

    

	// --- Services ---
	authService := service.NewAuthService(userRepo, jwtSecret)
	lessonService := service.NewLessonService(progressRepo)
	runnerService := service.NewRunnerService()

	// --- Handlers ---
	authHandler := handler.NewAuthHandler(authService)
	lessonHandler := handler.NewLessonHandler(lessonService)
	runnerHandler := handler.NewRunnerHandler(runnerService)

	// --- Router ---
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(apimiddleware.CORS)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

	// Public routes
	r.Post("/api/auth/signup", authHandler.Signup)
	r.Post("/api/auth/login", authHandler.Login)
	r.Post("/api/run", runnerHandler.Run)

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(apimiddleware.RequireAuth(jwtSecret))
		r.Get("/api/auth/me", authHandler.Me)
		r.Get("/api/lessons", lessonHandler.ListLessons)
		r.Get("/api/lessons/{slug}", lessonHandler.GetLesson)
		r.Post("/api/lessons/{slug}/complete", lessonHandler.CompleteLesson)
		r.Get("/api/progress", lessonHandler.GetProgress)
	})

	fmt.Printf("GoLearn API running on http://localhost:%s\n", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}