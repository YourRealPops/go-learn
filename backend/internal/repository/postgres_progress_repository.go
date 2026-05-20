package repository

import (
	"database/sql"
	"time"

	"github.com/YourRealPops/go-learn/backend/internal/model"
)

type postgresProgressRepository struct {
	db *sql.DB
}

func NewPostgresProgressRepository(db *sql.DB) ProgressRepository {
	return &postgresProgressRepository{db: db}
}

func (r *postgresProgressRepository) Complete(userID, lessonSlug string) error {
	_, err := r.db.Exec(
		`INSERT INTO progress (user_id, lesson_slug, completed_at)
		 VALUES ($1, $2, $3)
		 ON CONFLICT (user_id, lesson_slug) DO NOTHING`,
		userID, lessonSlug, time.Now(),
	)
	return err
}

func (r *postgresProgressRepository) GetProgress(userID string) ([]model.Progress, error) {
	rows, err := r.db.Query(
		`SELECT user_id, lesson_slug, completed_at
		 FROM progress WHERE user_id = $1
		 ORDER BY completed_at ASC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var progress []model.Progress
	for rows.Next() {
		var p model.Progress
		if err := rows.Scan(&p.UserID, &p.LessonSlug, &p.CompletedAt); err != nil {
			return nil, err
		}
		progress = append(progress, p)
	}
	return progress, rows.Err()
}

func (r *postgresProgressRepository) IsCompleted(userID, lessonSlug string) bool {
	var exists bool
	r.db.QueryRow(
		`SELECT EXISTS(
			SELECT 1 FROM progress
			WHERE user_id = $1 AND lesson_slug = $2
		)`,
		userID, lessonSlug,
	).Scan(&exists)
	return exists
}