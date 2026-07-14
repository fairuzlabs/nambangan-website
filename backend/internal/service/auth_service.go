package service

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/faza/rw18-nambangan-backend/internal/model"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
)

var (
	ErrInvalidCredentials = errors.New("username atau password salah")
	ErrInvalidToken       = errors.New("token tidak valid atau sudah kedaluwarsa")
)

// Claims adalah payload custom yang disisipkan ke dalam JWT.
type Claims struct {
	AdminID  string `json:"admin_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type AuthService struct {
	adminRepo *repository.AdminRepository
	jwtSecret []byte
	ttl       time.Duration
}

func NewAuthService(adminRepo *repository.AdminRepository, jwtSecret string, ttl time.Duration) *AuthService {
	return &AuthService{
		adminRepo: adminRepo,
		jwtSecret: []byte(jwtSecret),
		ttl:       ttl,
	}
}

// Login memvalidasi kredensial admin dan mengembalikan JWT jika berhasil.
func (s *AuthService) Login(ctx context.Context, username, password string) (model.LoginResponse, error) {
	admin, err := s.adminRepo.GetByUsername(ctx, username)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return model.LoginResponse{}, ErrInvalidCredentials
		}
		return model.LoginResponse{}, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password)); err != nil {
		return model.LoginResponse{}, ErrInvalidCredentials
	}

	expiresAt := time.Now().Add(s.ttl)
	claims := Claims{
		AdminID:  admin.ID,
		Username: admin.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   admin.ID,
			Issuer:    "rw18-nambangan-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return model.LoginResponse{}, err
	}

	resp := model.LoginResponse{
		Token:     signed,
		ExpiresAt: expiresAt.Unix(),
	}
	resp.Admin.ID = admin.ID
	resp.Admin.Username = admin.Username
	resp.Admin.DisplayName = admin.DisplayName

	return resp, nil
}

// ParseToken memvalidasi dan mem-parsing JWT, mengembalikan claims jika valid.
func (s *AuthService) ParseToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidToken
		}
		return s.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, ErrInvalidToken
	}
	return claims, nil
}
