package repository

import (
	"errors"
	"sync"
	"time"

	"github.com/YourRealPops/go-learn/backend/internal/model"
)

// UserRepository defines the interface — swap implementation for Postgres later
type UserRepository interface {
	Create(user *model.User) error
	FindByEmail(email string) (*model.User, error)
	FindByID(id string) (*model.User, error)
}

type inMemoryUserRepository struct {
	mu    sync.RWMutex
	users map[string]*model.User // keyed by ID
}

func NewInMemoryUserRepository() UserRepository {
	return &inMemoryUserRepository{
		users: make(map[string]*model.User),
	}
}

func (r *inMemoryUserRepository) Create(user *model.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check email uniqueness
	for _, u := range r.users {
		if u.Email == user.Email {
			return errors.New("email already registered")
		}
	}

	user.ID = generateID()
	user.CreatedAt = time.Now()
	r.users[user.ID] = user
	return nil
}

func (r *inMemoryUserRepository) FindByEmail(email string) (*model.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, u := range r.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, errors.New("user not found")
}

func (r *inMemoryUserRepository) FindByID(id string) (*model.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	u, ok := r.users[id]
	if !ok {
		return nil, errors.New("user not found")
	}
	return u, nil
}