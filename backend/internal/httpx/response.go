package httpx

import (
	"encoding/json"
	"log"
	"net/http"
)

// envelope adalah bentuk baku response sukses.
type envelope struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
}

// errEnvelope adalah bentuk baku response error.
type errEnvelope struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

// JSON menulis response sukses berformat JSON.
func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(envelope{Success: true, Data: data}); err != nil {
		log.Printf("httpx: gagal encode response: %v", err)
	}
}

// JSONWithMeta menulis response sukses dengan tambahan meta (mis. pagination).
func JSONWithMeta(w http.ResponseWriter, status int, data interface{}, meta interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(envelope{Success: true, Data: data, Meta: meta}); err != nil {
		log.Printf("httpx: gagal encode response: %v", err)
	}
}

// Error menulis response error berformat JSON.
func Error(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(errEnvelope{Success: false, Error: message}); err != nil {
		log.Printf("httpx: gagal encode error response: %v", err)
	}
}

// DecodeJSON membaca body request dan mem-parsing-nya sebagai JSON ke dalam dst.
func DecodeJSON(r *http.Request, dst interface{}) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(dst)
}
