# WasteLens

**WasteLens** adalah platform pelaporan dan pengelolaan sampah berbasis foto yang
menghubungkan warga, Dinas Lingkungan Hidup (DLH), dan petugas lapangan dalam
satu sistem terpadu. Warga memotret tumpukan sampah, AI mengklasifikasikan
ukuran dan merekomendasikan kendaraan penjemputan, petugas menerima rute
pengangkutan yang dioptimalkan, dan DLH memantau seluruh proses dari dasbor
terpusat — dari laporan masuk hingga verifikasi penjemputan.

Setiap laporan yang tervalidasi memberi warga koin yang dapat ditukarkan dengan
produk kebutuhan sehari-hari di koperasi desa (Kopdes) mitra.

---

## Teknologi yang Digunakan

| Lapisan          | Teknologi                                                      |
| ---------------- | -------------------------------------------------------------- |
| **Framework**    | Next.js 16 (App Router, standalone output)                     |
| **UI Library**   | React 19, Tailwind CSS 4                                       |
| **Bahasa**       | TypeScript 5.9                                                 |
| **Database**     | PostgreSQL 17                                                  |
| **ORM**          | Prisma 7 (PostgreSQL adapter)                                  |
| **Autentikasi**  | better-auth (email/password + Google OAuth)                    |
| **AI / Vision**  | Google Gemini, Groq, OpenRouter (klasifikasi gambar sampah)    |
| **Peta & Rute**  | Leaflet + React-Leaflet, OpenStreetMap, OSRM                  |
| **Real-time**    | Pusher (notifikasi & pembaruan status)                         |
| **Upload Gambar**| Cloudinary                                                     |
| **Form Handling**| React Hook Form + Zod                                           |
| **State Mgmt**   | TanStack React Query                                            |
| **Testing**      | Vitest, Playwright                                              |
| **Deploy**       | Docker + docker-compose, Vercel (standalone)                    |
| **QR Code**      | qrcode, jsQR                                                   |
| **Spreadsheet**  | xlsx (ekspor data)                                              |

---

## Cara Instalasi

### Prasyarat

- Node.js ≥ 20
- PostgreSQL ≥ 17 (dapat dijalankan via Docker)
- Akun Cloudinary (untuk upload gambar)
- API key Google Gemini / Groq / OpenRouter (untuk klasifikasi AI)

### 1. Clone repositori

```bash
git clone https://github.com/username/wastelens.git
cd wastelens
```

### 2. Konfigurasi environment

Salin template environment dan isi variabel yang diperlukan:

```bash
cp .env.example .env
```

### 3. Jalankan database PostgreSQL

Jika menggunakan Docker:

```bash
docker compose up -d postgres
```

Atau gunakan PostgreSQL lokal yang sudah berjalan.

### 4. Install dependensi

```bash
npm install
```

### 5. Terapkan migrasi database

```bash
npx prisma migrate deploy
```

### 6. (Opsional) Seed data awal

```bash
npx prisma db seed
```

Untuk data wilayah Tasikmalaya:

```bash
npm run tasik:seed
```

### 7. Jalankan server development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Cara Penggunaan

### Peran Pengguna

WasteLens memiliki lima peran utama:

- **Warga (`user`)** — Melaporkan sampah via foto, mengumpulkan koin, menukarkan
  koin di Kopdes.
- **Admin (`admin`)** — Mengelola pengguna, memantau transaksi koin, melihat
  laporan dan entitas.
- **Operator DLH (`dinas`)** — Dasbor DLH untuk memantau laporan, menugaskan
  petugas, mengelola rute pengangkutan, kendaraan, dan area cakupan.
- **Petugas Lapangan (`petugas`)** — Menerima tugas penjemputan, melihat rute
  teroptimasi, melakukan verifikasi pickup (foto sebelum & sesudah).
- **Kopdes (`kopdes`)** — Mengelola produk dan memproses penukaran koin warga.

### Alur Kerja Utama

1. **Warga** memotret tumpukan sampah melalui aplikasi.
2. **AI** (Gemini/Groq/OpenRouter) menganalisis foto: mendeteksi kategori
   ukuran sampah (small/medium/large), merekomendasikan kendaraan
   (pickup/tossa/truck), dan menilai risiko drainase serta akses.
3. **Laporan** masuk ke dasbor DLH dengan status `ANALYZED`.
4. **Operator DLH** meninjau laporan, mengoreksi jika perlu, dan menugaskan ke
   petugas + kendaraan melalui sistem dispatch.
5. **Sistem** membuat rute pengangkutan teroptimasi menggunakan OSRM.
6. **Petugas** menerima rute di aplikasi mobile, menjemput sampah, dan
   melakukan verifikasi pickup (foto sebelum & sesudah).
7. **Warga** menerima koin reward yang dapat ditukarkan di Kopdes.

### Menjalankan dengan Docker (Production)

```bash
docker compose up -d
```

Ini akan menjalankan PostgreSQL, menjalankan migrasi, seed, dan memulai aplikasi
di port 3000.

---

## Struktur Folder

```
wastelens/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Halaman login & register
│   ├── admin/                    # Dasbor & panel admin
│   │   ├── entities/             # Kelola entitas (dinas, kopdes)
│   │   ├── reports/              # Lihat laporan detail
│   │   ├── transactions/         # Transaksi koin & produk
│   │   └── users/                # Manajemen pengguna
│   ├── api/                      # Route handlers API
│   │   ├── admin/                # Endpoint admin
│   │   ├── auth/                 # Endpoint autentikasi
│   │   ├── dinas/                # Endpoint operator DLH
│   │   ├── internal/             # Internal API (non-publik)
│   │   ├── kopdes/               # Endpoint koperasi desa
│   │   ├── laporan/              # CRUD laporan sampah
│   │   ├── leaderboard/          # Peringkat warga
│   │   ├── notifikasi/           # Push notification
│   │   ├── penukaran/            # Penukaran koin → produk
│   │   ├── petugas/              # Endpoint petugas lapangan
│   │   ├── pusher/               # Real-time event auth
│   │   ├── redemptions/          # Status penukaran
│   │   ├── regions/              # Data wilayah
│   │   └── user/                 # Endpoint warga
│   ├── components/               # Komponen landing page
│   │   └── landing/              # Hero, Comparison, HowItWorks, dll.
│   ├── dinas/                    # Portal operator DLH
│   │   ├── accounts/             # Kelola akun petugas
│   │   ├── assignments/          # Penugasan laporan
│   │   ├── logistics/            # Kendaraan & rute
│   │   ├── reports/              # Pantau laporan
│   │   └── settings/             # Konfigurasi dinas
│   ├── kopdes/                   # Portal koperasi desa
│   ├── petugas/                  # Aplikasi petugas lapangan
│   │   ├── tasks/                # Tugas penjemputan
│   │   └── history/              # Riwayat tugas
│   ├── user/                     # Aplikasi warga
│   │   ├── exchange/             # Penukaran koin
│   │   ├── scan/                 # Scan QR penukaran
│   │   ├── history/              # Riwayat laporan
│   │   ├── profile/              # Profil & saldo koin
│   │   └── community/            # Komunitas
│   ├── hooks/                    # React hooks (Pusher, notifikasi)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Shared components
│   ├── nav/                      # Sidebar, tab-bar
│   ├── notifications/            # Komponen notifikasi
│   ├── leaflet-location-map.tsx  # Peta lokasi
│   ├── leaflet-routing-map.tsx   # Peta rute
│   └── query-provider.tsx        # React Query provider
├── lib/                          # Library & utility
│   ├── services/                 # Business logic
│   │   ├── vision.ts             # Klasifikasi AI (Gemini/Groq/OpenRouter)
│   │   ├── qr.ts                 # Generate & decode QR code
│   │   ├── spatial.ts            # Geocoding & jarak
│   │   ├── route-optimization.ts # Optimasi rute OSRM
│   │   ├── assignment.ts         # Logika penugasan
│   │   └── user-notifications.ts # Push notifikasi
│   ├── generated/prisma/         # Generated Prisma client
│   ├── auth.ts                   # Konfigurasi better-auth
│   ├── auth-client.ts            # Client auth hooks
│   ├── prisma.ts                 # Prisma client singleton
│   ├── api-client.ts             # API client utilities
│   └── constants/                # Konstanta aplikasi
├── server/                       # Server-side modules
│   ├── integrations/             # Integrasi eksternal
│   │   ├── ai/                   # Router AI (Gemini/Groq/OpenRouter)
│   │   ├── cloudinary/           # Upload & manajemen gambar
│   │   ├── gemini/               # Google Gemini integration
│   │   ├── groq/                 # Groq integration
│   │   ├── openrouter/           # OpenRouter integration
│   │   ├── osm/                  # OpenStreetMap / OSRM
│   │   └── supabase/             # Supabase integration
│   ├── modules/                  # Domain modules
│   │   ├── dispatch/             # Dispatch & routing
│   │   ├── location/             # Geocoding & lokasi
│   │   ├── priority/             # Prioritas laporan
│   │   ├── redemption/           # Logika penukaran
│   │   ├── reports/              # Pipeline laporan
│   │   ├── rewards/              # Sistem koin reward
│   │   └── upload/               # Upload pipeline
│   └── websocket/                # Pusher service & events
├── prisma/                       # Database
│   ├── schema.prisma             # Schema Prisma
│   ├── seed.ts                   # Data seed
│   ├── tasik-seed.ts             # Seed data Tasikmalaya
│   └── migrations/               # Migration history
├── public/                       # Static assets
│   ├── sw.js                     # Service worker (PWA)
│   └── icons/                    # App icons
├── docker-compose.yml            # Docker Compose (postgres + app)
├── Dockerfile                    # Multi-stage Docker build
├── entrypoint.sh                 # Container entrypoint
├── vitest.config.ts              # Konfigurasi Vitest
├── tsconfig.json                 # Konfigurasi TypeScript
├── next.config.ts                # Konfigurasi Next.js
├── package.json                  # Dependensi & script
└── README.md                     # Dokumen ini
```

---

## Lisensi

Proyek ini bersifat privat. Hak cipta dilindungi.
