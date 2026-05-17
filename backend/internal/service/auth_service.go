package service

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/YourRealPops/go-learn/backend/internal/model"
	"github.com/YourRealPops/go-learn/backend/internal/repository"
)

type AuthService struct {
	users     repository.UserRepository
	jwtSecret []byte
}

func NewAuthService(users repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{users: users, jwtSecret: []byte(jwtSecret)}
}

// Signup creates a new user and returns a signed JWT
func (s *AuthService) Signup(email, password string) (string, *model.User, error) {
	if len(password) < 8 {
		return "", nil, errors.New("password must be at least 8 characters")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", nil, err
	}

	user := &model.User{
		Email:        email,
		PasswordHash: string(hash),
	}

	if err := s.users.Create(user); err != nil {
		return "", nil, err
	}

	token, err := s.issueToken(user)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

// Login validates credentials and returns a signed JWT
func (s *AuthService) Login(email, password string) (string, *model.User, error) {
	user, err := s.users.FindByEmail(email)
	if err != nil {
		return "", nil, errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", nil, errors.New("invalid email or password")
	}

	token, err := s.issueToken(user)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

// ValidateToken parses and validates a JWT, returns the user ID claim
func (s *AuthService) ValidateToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return s.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return "", errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("invalid claims")
	}

	userID, ok := claims["sub"].(string)
	if !ok {
		return "", errors.New("invalid subject claim")
	}

	return userID, nil
}

func (s *AuthService) GetUserByID(id string) (*model.User, error) {
	return s.users.FindByID(id)
}

// issueToken creates a signed JWT valid for 7 days
func (s *AuthService) issueToken(user *model.User) (string, error) {
	claims := jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(7 * 24 * time.Hour).Unix(),
		"iat": time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}