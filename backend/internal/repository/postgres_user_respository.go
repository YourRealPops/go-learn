package repository

import (
	"database/sql"
	"errors"
	"time"

	"github.com/YourRealPops/go-learn/backend/internal/model"
)

type postgresUserRepository struct {
	db *sql.DB
}

func NewPostgresUserRepository(db *sql.DB) UserRepository {
	return &postgresUserRepository{db: db}
}

func (r *postgresUserRepository) Create(user *model.User) error {
	user.ID = generateID()
	user.CreatedAt = time.Now()

	_, err := r.db.Exec(
		`INSERT INTO users (id, email, password_hash, created_at)
		 VALUES ($1, $2, $3, $4)`,
		user.ID, user.Email, user.PasswordHash, user.CreatedAt,
	)
	if err != nil {
		// Postgres unique violation error code
		if err.Error() != "" && contains(err.Error(), "unique") {
			return errors.New("email already registered")
		}
		return err
	}
	return nil
}

func (r *postgresUserRepository) FindByEmail(email string) (*model.User, error) {
	user := &model.User{}
	err := r.db.QueryRow(
		`SELECT id, email, password_hash, created_at
		 FROM users WHERE email = $1`,
		email,
	).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)

	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *postgresUserRepository) FindByID(id string) (*model.User, error) {
	user := &model.User{}
	err := r.db.QueryRow(
		`SELECT id, email, password_hash, created_at
		 FROM users WHERE id = $1`,
		id,
	).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)

	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsHelper(s, substr))
}

func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}