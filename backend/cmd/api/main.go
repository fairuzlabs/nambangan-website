package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env file (abaikan error jika tidak ada, misal di production)
	if err := godotenv.Load(); err != nil {
		log.Println("Info: .env file tidak ditemukan, menggunakan environment variable sistem")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"rw18-nambangan-api"}`))
	})

	// TODO: daftarkan routes lain di sini
	// mux.Handle("/api/v1/news", handler.NewNewsHandler(...))
	// mux.Handle("/api/v1/umkm", handler.NewUMKMHandler(...))
	// mux.Handle("/api/v1/proklim", handler.NewProKlimHandler(...))
	// mux.Handle("/api/v1/podcast", handler.NewPodcastHandler(...))

	log.Printf("Server berjalan di port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}
