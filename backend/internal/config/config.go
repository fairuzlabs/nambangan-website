package config

import (
	"os"
	"time"
)

// Config menampung semua konfigurasi aplikasi yang diambil dari environment variable.
type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	JWTTTL      time.Duration
	R2AccessKey string
	R2SecretKey string
	R2Bucket    string
	CORSOrigin  string
}

// Load membaca konfigurasi dari environment variable, dengan nilai default fallback.
func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", ""),
		JWTSecret:   getEnv("JWT_SECRET", ""),
		JWTTTL:      24 * time.Hour,
		R2AccessKey: getEnv("R2_ACCESS_KEY", ""),
		R2SecretKey: getEnv("R2_SECRET_KEY", ""),
		R2Bucket:    getEnv("R2_BUCKET_NAME", ""),
		CORSOrigin:  getEnv("CORS_ORIGIN", "*"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
