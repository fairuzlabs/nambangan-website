package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"github.com/faza/rw18-nambangan-backend/internal/config"
	"github.com/faza/rw18-nambangan-backend/internal/db"
	"github.com/faza/rw18-nambangan-backend/internal/handler"
	appmw "github.com/faza/rw18-nambangan-backend/internal/middleware"
	"github.com/faza/rw18-nambangan-backend/internal/repository"
	"github.com/faza/rw18-nambangan-backend/internal/service"
)

func main() {
	// Load .env file (abaikan error jika tidak ada, misal di production).
	if err := godotenv.Load(); err != nil {
		log.Println("Info: .env file tidak ditemukan, menggunakan environment variable sistem")
	}

	cfg := config.Load()
	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET wajib diset")
	}

	pool, err := db.NewPool(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("gagal terhubung ke database: %v", err)
	}
	defer pool.Close()
	log.Println("Berhasil terhubung ke database")

	// Repositories
	newsRepo := repository.NewNewsRepository(pool)
	mapRepo := repository.NewMapRepository(pool)
	podcastRepo := repository.NewPodcastRepository(pool)
	archiveRepo := repository.NewArchiveRepository(pool)
	adminRepo := repository.NewAdminRepository(pool)
	tagRepo := repository.NewTagRepository(pool)
	orgRepo := repository.NewOrganizationRepository(pool)

	// Services
	authSvc := service.NewAuthService(adminRepo, cfg.JWTSecret, cfg.JWTTTL)
	newsSvc := service.NewNewsService(newsRepo)
	mapSvc := service.NewMapService(mapRepo)
	podcastSvc := service.NewPodcastService(podcastRepo)
	archiveSvc := service.NewArchiveService(archiveRepo)

	// Handlers
	adminHandler := handler.NewAdminHandler(authSvc)
	newsHandler := handler.NewNewsHandler(newsSvc)
	mapHandler := handler.NewMapHandler(mapSvc)
	podcastHandler := handler.NewPodcastHandler(podcastSvc)
	archiveHandler := handler.NewArchiveHandler(archiveSvc)
	tagHandler := handler.NewTagHandler(tagRepo)
	orgHandler := handler.NewOrganizationHandler(orgRepo)

	requireAuth := appmw.RequireAuth(authSvc)

	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok","service":"rw18-nambangan-api"}`))
	})

	// ---------- Public routes ----------
	mux.HandleFunc("POST /api/v1/admin/login", adminHandler.Login)

	mux.HandleFunc("GET /api/v1/news", newsHandler.List)
	mux.HandleFunc("GET /api/v1/news/{slug}", newsHandler.GetBySlug)
	mux.HandleFunc("GET /api/v1/news-categories", newsHandler.ListCategories)

	mux.HandleFunc("GET /api/v1/map-points", mapHandler.List)
	mux.HandleFunc("GET /api/v1/map-points/{id}", mapHandler.GetByID)
	mux.HandleFunc("GET /api/v1/map-categories", mapHandler.ListCategories)

	mux.HandleFunc("GET /api/v1/podcast-episodes", podcastHandler.List)
	mux.HandleFunc("GET /api/v1/podcast-episodes/{slug}", podcastHandler.GetBySlug)
	mux.HandleFunc("GET /api/v1/podcast-categories", podcastHandler.ListCategories)
	mux.HandleFunc("GET /api/v1/podcast-guests", podcastHandler.ListGuests)

	mux.HandleFunc("GET /api/v1/archive-documents", archiveHandler.List)
	mux.HandleFunc("GET /api/v1/archive-documents/{id}", archiveHandler.GetByID)

	mux.HandleFunc("GET /api/v1/tags", tagHandler.List)
	mux.HandleFunc("GET /api/v1/organization-members", orgHandler.List)

	// ---------- Admin routes (dilindungi JWT) ----------
	mux.Handle("GET /api/v1/admin/news", requireAuth(http.HandlerFunc(newsHandler.AdminList)))
	mux.Handle("GET /api/v1/admin/news/{id}", requireAuth(http.HandlerFunc(newsHandler.AdminGetByID)))
	mux.Handle("POST /api/v1/admin/news", requireAuth(http.HandlerFunc(newsHandler.Create)))
	mux.Handle("PUT /api/v1/admin/news/{id}", requireAuth(http.HandlerFunc(newsHandler.Update)))
	mux.Handle("DELETE /api/v1/admin/news/{id}", requireAuth(http.HandlerFunc(newsHandler.Delete)))

	mux.Handle("GET /api/v1/admin/map-points", requireAuth(http.HandlerFunc(mapHandler.AdminList)))
	mux.Handle("POST /api/v1/admin/map-points", requireAuth(http.HandlerFunc(mapHandler.Create)))
	mux.Handle("PUT /api/v1/admin/map-points/{id}", requireAuth(http.HandlerFunc(mapHandler.Update)))
	mux.Handle("DELETE /api/v1/admin/map-points/{id}", requireAuth(http.HandlerFunc(mapHandler.Delete)))

	mux.Handle("POST /api/v1/admin/podcast-episodes", requireAuth(http.HandlerFunc(podcastHandler.Create)))
	mux.Handle("PUT /api/v1/admin/podcast-episodes/{id}", requireAuth(http.HandlerFunc(podcastHandler.Update)))
	mux.Handle("DELETE /api/v1/admin/podcast-episodes/{id}", requireAuth(http.HandlerFunc(podcastHandler.Delete)))

	mux.Handle("POST /api/v1/admin/archive-documents", requireAuth(http.HandlerFunc(archiveHandler.Create)))
	mux.Handle("PUT /api/v1/admin/archive-documents/{id}", requireAuth(http.HandlerFunc(archiveHandler.Update)))
	mux.Handle("DELETE /api/v1/admin/archive-documents/{id}", requireAuth(http.HandlerFunc(archiveHandler.Delete)))
	mux.Handle("PUT /api/v1/admin/organization-members", requireAuth(http.HandlerFunc(orgHandler.UpdateBulk)))

	var rootHandler http.Handler = mux
	rootHandler = appmw.CORS(cfg.CORSOrigin)(rootHandler)
	rootHandler = appmw.Logging(rootHandler)

	log.Printf("Server berjalan di port %s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, rootHandler); err != nil {
		log.Fatal(err)
	}
}
