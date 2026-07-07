# Website RW 18 Nambangan

Website komunitas RW 18 Nambangan, Kelurahan Rejowinangun Utara, Kota Magelang.
Dibangun sebagai program kerja KKN — mencakup sistem berita, peta interaktif ProKlim & UMKM,
podcast edukasi, arsip digital, dan dashboard admin.

## Stack

- **Backend:** Go 1.26 (net/http, pgx, JWT)
- **Frontend:** Next.js 16.2 (App Router, TypeScript, Tailwind CSS, TanStack Query), React 19.2
- **Database:** PostgreSQL
- **Storage:** Cloudflare R2 (gambar, arsip, file podcast)
- **Deployment:** Oracle Cloud Free Tier

> Catatan: Next.js 16 butuh Node.js versi 20 ke atas. Cek dengan `node --version`, dan pakai `nvm install 22 && nvm use 22` kalau perlu upgrade.

## Struktur Folder

```
rw18-nambangan/
├── backend/       # REST API (Go)
├── frontend/      # Aplikasi web (Next.js)
├── docs/          # SRS, ERD, use case diagram, API spec
└── docker-compose.yml
```

## Setup Awal

### 1. Clone repositori
```bash
git clone <url-repo-anda>
cd rw18-nambangan
```

### 2. Jalankan database lokal
```bash
docker compose up -d
```

### 3. Setup backend
```bash
cd backend
cp .env.example .env
go mod tidy
go run cmd/api/main.go
```
Backend akan jalan di `http://localhost:8080`. Cek dengan `curl http://localhost:8080/health`.

### 4. Setup frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Frontend akan jalan di `http://localhost:3000`.

## Migrasi Database

Menggunakan [golang-migrate](https://github.com/golang-migrate/migrate):
```bash
migrate -path backend/migrations -database "$DATABASE_URL" up
```

## Kontribusi

- `main` — production-ready, di-deploy ke Oracle Cloud
- `dev` — branch integrasi
- `feature/nama-fitur` — branch kerja per fitur

## Dokumentasi

Lihat folder `docs/` untuk SRS (FR-22 dst.), ERD, use case diagram, dan spesifikasi REST API.
