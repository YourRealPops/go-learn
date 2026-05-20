package repository

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

// NewDB opens a Postgres connection and runs migrations
func NewDB() (*sql.DB, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL environment variable is required")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)

	if err := runMigrations(db); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("Database connected and migrations complete")
	return db, nil
}

func runMigrations(db *sql.DB) error {
	migration := `
		CREATE TABLE IF NOT EXISTS users (
			id            TEXT PRIMARY KEY,
			email         TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);

		CREATE TABLE IF NOT EXISTS progress (
			user_id      TEXT NOT NULL,
			lesson_slug  TEXT NOT NULL,
			completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			PRIMARY KEY (user_id, lesson_slug)
		);

		CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
	`

	_, err := db.Exec(migration)
	return err
}