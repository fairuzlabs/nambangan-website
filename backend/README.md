# RW 18 Nambangan – Backend API (Go)

REST API untuk website RW 18 Nambangan (berita, peta interaktif, podcast, arsip dokumen),
dibangun dengan Go standar (`net/http`), PostgreSQL (`pgx/v5`), dan JWT untuk autentikasi admin.

## Struktur Proyek

```
cmd/api/main.go            # entrypoint, wiring & routing
internal/config             # load environment variable
internal/db                  # koneksi pgxpool ke PostgreSQL
internal/model               # struct/DTO
internal/repository          # akses database (SQL murni via pgx)
internal/service              # logika bisnis (validasi, slug, JWT, dsb)
internal/handler               # HTTP handler (net/http)
internal/middleware            # auth (JWT), CORS, logging
internal/httpx                  # helper response & decode JSON
internal/util                    # helper pagination & slug
migrations/                       # migration SQL (sudah ada sebelumnya)
```

## Menjalankan Secara Lokal

1. **Siapkan database PostgreSQL**, lalu jalankan migration (pakai [golang-migrate](https://github.com/golang-migrate/migrate) atau tool migration lain) dari folder `migrations/`.

2. **Copy environment variable:**
   ```bash
   cp .env.example .env
   ```
   Sesuaikan `DATABASE_URL` dan `JWT_SECRET`.

3. **Install dependency Go** (butuh koneksi internet penuh, karena sandbox pembuatan kode ini punya akses jaringan terbatas sehingga `go.sum` sengaja tidak disertakan):
   ```bash
   go mod tidy
   ```

4. **Jalankan server:**
   ```bash
   go run ./cmd/api
   ```
   Server berjalan di `http://localhost:8080` (atau sesuai `PORT`).

5. **Buat admin pertama** (karena tabel `admins` butuh `password_hash` ber-bcrypt, seed data di migration `000008` memakai hash dummy yang TIDAK valid untuk login). Generate hash bcrypt lalu update manual:
   ```bash
   go run -exec "" <<'EOF'
   EOF
   ```
   Cara paling gampang: buat file kecil `hashpw.go` sekali pakai:
   ```go
   package main

   import (
       "fmt"
       "golang.org/x/crypto/bcrypt"
   )

   func main() {
       hash, _ := bcrypt.GenerateFromPassword([]byte("password-anda"), bcrypt.DefaultCost)
       fmt.Println(string(hash))
   }
   ```
   Lalu:
   ```sql
   UPDATE admins SET password_hash = '<hash-hasil-generate>' WHERE username = 'admin';
   ```

## Autentikasi Admin

```
POST /api/v1/admin/login
Body: { "username": "admin", "password": "..." }
Response: { "success": true, "data": { "token": "...", "expires_at": ..., "admin": {...} } }
```

Gunakan token pada header `Authorization: Bearer <token>` untuk mengakses endpoint `/api/v1/admin/*`.

## Daftar Endpoint

### Publik (tanpa token)

| Method | Path | Keterangan |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/v1/news?category=&search=&page=&limit=` | List berita (status `published` saja) |
| GET | `/api/v1/news/{slug}` | Detail berita |
| GET | `/api/v1/news-categories` | List kategori berita |
| GET | `/api/v1/map-points?category=` | List titik peta aktif |
| GET | `/api/v1/map-points/{id}` | Detail titik peta |
| GET | `/api/v1/map-categories` | List kategori peta |
| GET | `/api/v1/podcast-episodes?category=&featured=true&page=&limit=` | List episode podcast |
| GET | `/api/v1/podcast-episodes/{slug}` | Detail episode podcast |
| GET | `/api/v1/podcast-categories` | List kategori podcast |
| GET | `/api/v1/podcast-guests` | List narasumber podcast |
| GET | `/api/v1/archive-documents?doc_type=&program_type=&tag=&page=&limit=` | List dokumen arsip |
| GET | `/api/v1/archive-documents/{id}` | Detail dokumen arsip |
| GET | `/api/v1/tags` | List tag |
| POST | `/api/v1/admin/login` | Login admin |

### Admin (butuh header `Authorization: Bearer <token>`)

| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/v1/admin/news?status=&category=&search=` | List semua berita (termasuk draft) |
| GET | `/api/v1/admin/news/{id}` | Detail berita by ID |
| POST | `/api/v1/admin/news` | Buat berita |
| PUT | `/api/v1/admin/news/{id}` | Update berita (partial) |
| DELETE | `/api/v1/admin/news/{id}` | Hapus berita |
| GET | `/api/v1/admin/map-points?category=` | List semua titik peta (termasuk non-aktif) |
| POST | `/api/v1/admin/map-points` | Buat titik peta |
| PUT | `/api/v1/admin/map-points/{id}` | Update titik peta (partial) |
| DELETE | `/api/v1/admin/map-points/{id}` | Hapus titik peta |
| POST | `/api/v1/admin/podcast-episodes` | Buat episode podcast |
| PUT | `/api/v1/admin/podcast-episodes/{id}` | Update episode podcast (partial) |
| DELETE | `/api/v1/admin/podcast-episodes/{id}` | Hapus episode podcast |
| POST | `/api/v1/admin/archive-documents` | Buat dokumen arsip |
| PUT | `/api/v1/admin/archive-documents/{id}` | Update dokumen arsip (partial) |
| DELETE | `/api/v1/admin/archive-documents/{id}` | Hapus dokumen arsip |

Contoh body `POST /api/v1/admin/news`:
```json
{
  "title": "Judul Berita",
  "excerpt": "Ringkasan singkat...",
  "content": "Isi lengkap berita...",
  "image_url": "https://...",
  "category_id": "31111111-1111-1111-1111-111111111111",
  "status": "published",
  "published_at": "2026-07-14T08:00:00+07:00"
}
```
`slug` bersifat opsional — jika tidak dikirim, akan dibuat otomatis dari `title`.

Contoh body `POST /api/v1/admin/map-points` (kategori UMKM otomatis menyimpan `price`, `contact_phone`, `owner_name`):
```json
{
  "category_id": "41111111-1111-1111-1111-111111111112",
  "name": "Keripik Tempe Original",
  "subtitle": "Rp 15.000",
  "latitude": -7.470789,
  "longitude": 110.218012,
  "price": 15000,
  "contact_phone": "081234567890",
  "owner_name": "Ibu Sri Wahyuni"
}
```

## Response Format

Sukses:
```json
{ "success": true, "data": { ... }, "meta": { "page": 1, "limit": 10, "total_items": 4, "total_pages": 1 } }
```
`meta` hanya muncul pada endpoint list yang dipaginasi.

Error:
```json
{ "success": false, "error": "pesan error" }
```

## Catatan

- ID seluruh entitas menggunakan UUID (native PostgreSQL `uuid`, di-generate via `pgcrypto`).
- Semua endpoint list mendukung `page` & `limit` (kecuali `map-points`, `news-categories`, `map-categories`, `podcast-categories`, `podcast-guests`, `tags` yang mengembalikan seluruh data langsung).
- Endpoint `PUT` bersifat partial update — hanya field yang dikirim yang akan diubah.
- Build sudah divalidasi dengan `go build ./...`, `go vet ./...`, dan `gofmt` selama proses pembuatan.
