package middleware

import (
	"log"
	"net/http"
	"strings"
	"time"
)

// CORS menambahkan header Cross-Origin Resource Sharing agar API bisa diakses dari frontend.
// allowedOrigins bisa berisi "*" (izinkan semua), satu origin, atau beberapa dipisah koma,
// contoh: "https://rw18.vercel.app,https://rw18-git-dev.vercel.app"
func CORS(allowedOrigins string) func(http.Handler) http.Handler {
	wildcard := strings.TrimSpace(allowedOrigins) == "*"

	origins := strings.Split(allowedOrigins, ",")
	originSet := make(map[string]bool, len(origins))
	for _, o := range origins {
		o = strings.TrimSpace(o)
		if o != "" {
			originSet[o] = true
		}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")

			switch {
			case wildcard:
				w.Header().Set("Access-Control-Allow-Origin", "*")
			case originSet[origin]:
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
			}

			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// responseWriter membungkus http.ResponseWriter untuk menangkap status code.
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// Logging mencatat setiap request masuk beserta status code dan durasinya.
func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(rw, r)

		log.Printf("%s %s %d %s", r.Method, r.URL.Path, rw.statusCode, time.Since(start))
	})
}
