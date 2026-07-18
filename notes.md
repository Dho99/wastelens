**Perlu perubahan kecil, bukan perubahan arsitektur utama.**

React Query tidak mengganti API Routes, Prisma, PostgreSQL, atau service layer. React Query hanya mengatur **server state di sisi client**, termasuk loading, error, cache, refetch, retry, dan sinkronisasi data. Route Handler tetap menjadi endpoint backend. TanStack Query memang dirancang untuk mengelola lifecycle dan cache data asinkron, sedangkan Next.js Route Handlers tetap menangani request HTTP pada sisi server. ([TanStack][1])

Implementasi Anda masih mengikuti alur:

```text
Client Component
→ TanStack Query
→ apiFetch
→ Next.js Route Handler
→ Service/Repository
→ Prisma
→ PostgreSQL
```

Proposal saat ini sudah menyatakan frontend mengirim permintaan melalui API Routes dan backend mengakses PostgreSQL melalui Prisma. Jadi, penambahan React Query tidak bertentangan dengan arsitektur proposal. Implementasi yang Anda tunjukkan juga tetap memanggil `/api/user/dashboard` melalui `useQuery`, bukan mengakses database langsung dari komponen.

## Bagian proposal yang perlu diperbarui

### 1. Daftar teknologi

Tambahkan satu baris:

| Layer                    | Teknologi      | Fungsi                                                                                                                               |
| ------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Client-side Server State | TanStack Query | Mengelola pengambilan data dari API, cache client, status loading dan error, refetch, retry, serta invalidasi data setelah perubahan |

Jangan menulis React Query sebagai pengganti `fetch`. Keduanya memiliki fungsi berbeda:

- `fetch` atau `apiFetch` menjalankan HTTP request.
- React Query mengatur lifecycle, cache, dan status request tersebut.

### 2. Alasan pemilihan teknologi

Gunakan pembahasan berikut:

> TanStack Query dipilih untuk mengelola server state pada antarmuka pengguna. Library ini memusatkan proses pengambilan data, caching, loading state, error state, refetch, dan invalidasi cache sehingga komponen tidak perlu mengelola proses tersebut secara manual melalui kombinasi `useEffect` dan `useState`. Pendekatan ini mengurangi duplikasi logika pengambilan data dan menjaga konsistensi data setelah proses mutasi.

### 3. Arsitektur teknologi

Revisi bagian frontend menjadi:

> **Frontend dan Client Data Layer:** Next.js, TypeScript, shadcn/ui, dan TanStack Query menangani antarmuka pengguna serta pengelolaan server state pada client. TanStack Query memanggil Next.js Route Handlers melalui fungsi `apiFetch`, menyimpan respons dalam cache berdasarkan query key, serta mengelola status loading, error, dan refetch.

Bagian backend tetap:

> **Backend:** Next.js Route Handlers menerima request, memeriksa autentikasi dan otorisasi, memvalidasi input, serta memanggil service layer. Service layer menjalankan aturan bisnis dan mengakses PostgreSQL melalui Prisma.

Diagramnya menjadi:

```text
UI Components
      ↓
TanStack Query Hooks
      ↓
apiFetch
      ↓
Next.js Route Handlers
      ↓
Service Layer
      ↓
Repository / Prisma
      ↓
PostgreSQL
```

### 4. Implementasi teknis

Tambahkan pembahasan singkat:

> Pengambilan data dashboard menggunakan custom hook `useDashboard` yang membungkus `useQuery`. Query key `["user-dashboard"]` digunakan sebagai identitas cache, sedangkan query function memanggil endpoint `/api/user/dashboard`. React Query secara otomatis memperbarui komponen ketika status request atau data cache berubah.

## Bagian yang tidak perlu diubah

Tidak perlu mengubah:

- tujuan dan manfaat;
- scope MVP;
- rancangan API;
- ERD dan database;
- autentikasi;
- alur bisnis laporan;
- algoritma prioritas dan routing;
- batasan perangkat lunak.

React Query merupakan keputusan implementasi frontend, bukan perubahan fungsi bisnis.

## Catatan penting pada klaim implementasi

Ringkasan implementasi menyebut:

> Cache 30 detik, auto-refetch, retry 1x.

Namun, kode `useDashboard` yang ditampilkan hanya berisi:

```typescript
useQuery({
    queryKey: ["user-dashboard"],
    queryFn: () => apiFetch<DashboardData>("/api/user/dashboard"),
});
```

Kode tersebut belum menunjukkan konfigurasi `staleTime: 30_000` atau `retry: 1`. Klaim tersebut hanya benar apabila konfigurasi tersedia pada `defaultOptions` di `QueryClient`.

Contoh konfigurasi eksplisit:

```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
```

Apabila konfigurasi tersebut belum ada, jangan menulis “cache 30 detik dan retry satu kali” dalam proposal atau dokumentasi.

## Putusan akhir

**React Query boleh dipertahankan dan tidak mengubah konsep utama proposal.** Anda hanya perlu menambahkannya pada bagian teknologi, alasan pemilihan, arsitektur frontend, dan implementasi teknis.

Redaksi paling ringkas:

> WasteLens menggunakan TanStack Query sebagai client-side server-state management untuk mengelola pengambilan data dari Next.js Route Handlers, caching, loading state, error handling, refetch, dan invalidasi data. Penggunaan TanStack Query tidak mengubah lapisan backend karena seluruh akses database tetap dilakukan melalui Route Handlers, service layer, dan Prisma.

[1]: https://tanstack.com/query/latest/docs/framework/react/overview?utm_source=chatgpt.com "Overview | TanStack Query React Docs"
