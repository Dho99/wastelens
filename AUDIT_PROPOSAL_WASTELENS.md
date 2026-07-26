# NASKAH AUDIT MULTIDISIPLIN PROPOSAL WASTELENS

**Versi:** 1.0  
**Tanggal audit:** 24 Juli 2026  
**Tim reviewer:** Proposal kompetisi, Software Architect, Product Manager, AI Engineer, Backend/DB, GIS/Routing, Cybersecurity, UI/UX & Accessibility, QA, Metodologi Riset, Editor ilmiah ID  
**Status kode:** tidak diubah pada siklus audit ini (read-only)

## Dokumen yang diaudit

| No | Dokumen | Identitas | Catatan |
|---|---|---|---|
| 1 | Proposal utama | SOFTDEV-Gas Amikom-Proposal.pdf (66 halaman) | Naskah kompetisi Gas Amikom |
| 2 | Paket Revisi | Paket_Revisi_Realignment_Proposal_WasteLens.docx | Realignment ke Photo-to-Priority; menyarankan mempersempit MVP |
| 3 | Draft awal | proposal amikom.docx | Latar belakang; masih YOLO/mikroservis |
| 4 | Plans | Plans.pdf (2 halaman) | Pedoman fokususan proposal kompetisi |
| 5 | Bukti implementasi | Repositori D:\projects\wastelens | Digunakan hanya untuk membedakan klaim vs realitas |

**Acuan wajib:** alur inti 31 langkah (foto → AI multi-provider → prioritas → DLH → kolektif/rute → assign → pickup → verifikasi manusia → koin → QR → stok → audit → iterasi data).

---

# 1. Kesimpulan eksekutif

## 1.1 Keselarasan dengan ide proyek

Proposal **belum sepenuhnya selaras** dengan alur inti 31 langkah. Bab tujuan, novelty, dan kompetitor masih berpusat pada YOLO, AHP, heatmap, dan “optimasi rute”, sementara bab teknologi dan batasan sudah mulai mengakui Gemini, klasifikasi ukuran relatif, dan verifikasi manusia. Implementasi kode justru lebih dekat ke alur closed-loop (termasuk reward, QR, dan stok) daripada narasi novelty pada halaman 22–29.

Paket Revisi berhasil mendiagnosis masalah fokus, tetapi rekomendasinya untuk **membuang Kopdes/QR/koin dari MVP** bertentangan dengan (a) alur inti yang ditetapkan tim dan (b) bukti implementasi yang sudah ada. Putusan audit ini: **pertahankan closed-loop di MVP**, tetapi **rapikan klaim** agar jujur.

## 1.2 Konsistensi antardokumen

**Rendah hingga sedang.** Draft awal, proposal utama, Paket Revisi, dan kode membentuk empat “versi kebenaran” yang berbeda untuk AI, arsitektur, scope, dan killer feature.

## 1.3 Tiga kekuatan utama

1. **Alur produk end-to-end bernilai kompetisi:** foto warga → keputusan operasional DLH → reward → penukaran koperasi merupakan diferensiasi yang konkret, bukan sekadar kanal aduan.
2. **Fondasi teknis aktual relatif kuat:** Next.js modular monolith, Prisma/PostgreSQL, Better Auth, multi-provider AI + Zod schema, priority weighted score, auto-collective/OSRM, reward idempotent, QR opaque token + transaksi stok/saldo.
3. **Paket Revisi menyediakan kerangka editorial yang baik:** problem statement tunggal, Definition of Done, release gate, storyboard demo, dan koreksi istilah (volume→ukuran relatif, mikroservis→modular monolith).

## 1.4 Sepuluh kelemahan paling kritis

1. Klaim **YOLO** pada tujuan/novelty bertentangan dengan stack **Gemini** (dan kode multi-provider).
2. Klaim **AHP** sebagai inti novelty tanpa matriks pairwise, CR, atau implementasi runtime.
3. Urutan AI di ide inti (**Gemini primary**) ≠ kode (**Groq → Gemini → OpenRouter**); proposal hampir tidak menjelaskan OpenRouter/Groq.
4. Field nalysis_provider dapat tersimpan sebagai GEMINI meski provider lain yang sukses.
5. Inkonsistensi **volume vs ukuran relatif**; tabel kompetitor mencentang “Klasifikasi volume via AI”.
6. Centang **“Optimasi rute armada dinas”** tanpa klaim algoritma yang akurat; ada heuristik OSRM+NN+2-opt di kode, bukan solver VRP penuh.
7. Klaim **AI before-after verification** tidak didukung modul perbandingan citra; verify hanya menyimpan foto sesudah.
8. **Enum status** proposal ≠ Prisma (ANALYZED/WAITING/PENDING/DIJEMPUT/SELESAI/DITOLAK).
9. **Tim:** sampul 5 anggota vs metodologi “dua developer”; PIC stream kosong.
10. **Naskah belum selesai:** abstrak, Related Work, UI/UX, pustaka, progress […] kosong; komentar editorial (“spok perhatikan”); ~30 halaman hampir kosong.

## 1.5 Risiko terbesar jika dikumpulkan tanpa revisi

Juri menilai proposal **tidak dapat dipercaya secara teknis**: novelty yang ditulis tidak dapat didemonstrasikan, bagian wajib kompetisi kosong, dan demo closed-loop justru lebih kuat daripada klaim yang salah—sehingga nilai inovasi, metodologi, dan kesiapan turun bersamaan.

## 1.6 Tingkat revisi

**Revisi substansial** (bukan minor, bukan realignment total produk). Produk dan kode tidak perlu dibongkar; naskah, klaim, status fitur, dan konsistensi AI/priority/routing/status harus diganti secara luas.

## 1.7 Skor proposal

| No | Dimensi | Skor | Dasar pemberian skor |
|---|---|---:|---|
| 1 | Kejelasan masalah | 55 | Empat akar masalah diposisikan setara; data nasional kuat, tetapi gap operasional lokal (triase DLH) belum menjadi satu pernyataan tunggal yang konsisten di seluruh bab. |
| 2 | Kesesuaian solusi | 72 | Solusi closed-loop cocok dengan masalah operasional+partisipasi; naskah masih mencampur solusi yang tidak diimplementasikan (YOLO custom, heatmap penuh). |
| 3 | Kebaruan | 60 | Kebaruan terletak pada integrasi alur, bukan pada pemanggilan API AI. Klaim novelty komponen (YOLO/AHP) melemahkan kredibilitas. |
| 4 | Konsistensi teknis | 35 | Konflik YOLO/Gemini, AHP/weighted, volume/ukuran, rute, status, provider order, mikroservis/monolith. |
| 5 | Kelayakan implementasi | 78 | Banyak modul inti sudah ada di kode; hutang pada keselarasan klaim, ageScore, AI verify, AuditLog, E2E. |
| 6 | Kualitas metodologi | 40 | Agile Hybrid disebut generik; pembagian peran tidak akurat; tidak ada instrumen riset pengguna terlampir. |
| 7 | Kualitas pengujian | 30 | Hanya strategi generik + contoh skenario; bukti unit terbatas (dispatch, mock eksternal); tidak ada hasil E2E/security/a11y. |
| 8 | Kualitas UI/UX | 25 | Bab UI/UX kosong; caption screenshot ada, tetapi prinsip aksesibilitas dan state failure tidak ditulis. |
| 9 | Kualitas dokumentasi | 28 | Placeholder masif, duplikasi batasan, API masih memuat instruksi lomba, pustaka kosong. |
| 10 | Kesiapan proposal | 32 | Belum layak dikumpulkan tanpa siklus revisi substansial dan consistency pass. |

**Rata-rata tertimbang sederhana:** ≈ 47/100.

---

# 2. Matriks kesesuaian alur proyek (31 tahap)

Legenda status: COMPLETE | PARTIAL | PLANNED | ROADMAP | CLAIM ONLY | NOT DOCUMENTED | CONTRADICTORY

| No | Tahap proses | Ada di proposal? | Lokasi dokumen | Status implementasi | Bukti implementasi | Inkonsistensi | Risiko | Koreksi yang diperlukan | Prioritas |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Warga ambil/pindai foto | Ya | Hlm. 37, 52–54; caption Gambar 4.3 | COMPLETE | pp/user/scan/*, upload API | — | RENDAH | Pastikan bahasa “foto/laporan”, bukan scan barcode sampah | P1 |
| 2 | Validasi foto, akun, geolokasi | Ya parsial | Hlm. 48 validasi laporan | PARTIAL | location-verification.service, validate-location API, MIME/size checks | Tujuan hlm. 13/17 klaim metadata EXIF sebagai sumber utama | TINGGI | Tetapkan Browser Geolocation primer; EXIF sebagai sinyal/flag | P0 |
| 3 | Analisis Gemini multimodal primer | Parsial/kontradiksi | Hlm. 32 Gemini; hlm. 13/23 YOLO | CONTRADICTORY | Ada client Gemini, tetapi urutan kode Groq-first | YOLO vs Gemini vs Google Vision | KRITIS | Naskah: Gemini primary; hapus YOLO MVP; (kode belakangan) | P0 |
| 4 | Fallback OpenRouter & Groq | Hampir tidak | Tidak eksplisit di proposal | PARTIAL | i.service.ts Groq→Gemini→OpenRouter | Ide inti Gemini-first ≠ kode; proposal diam | KRITIS | Dokumentasikan urutan Gemini→OpenRouter→Groq + kondisi fallback | P0 |
| 5 | Normalisasi JSON schema | Tidak eksplisit | — | PARTIAL | Zod waste-analysis.schema + sanitizer | Proposal tidak menjelaskan schema | TINGGI | Cantumkan schema dan validator | P0 |
| 6 | Laporan sampah terstruktur | Ya | Hlm. 52, ERD tersirat | COMPLETE | model Laporan + field AI/priority | Enum status beda | TINGGI | Samakan nama field/status dengan DB | P0 |
| 7 | Risiko & skor prioritas | Ya, salah istilah | Hlm. 13, 23 AHP | PARTIAL | priority.service weighted; geScore=0 | AHP diklaim; kepadatan/TPS tidak ada | KRITIS | Weighted score berversi; jelaskan variabel aktual | P0 |
| 8 | Tampil dashboard DLH | Ya | Hlm. 52–53, caption dinas | PARTIAL→COMPLETE | pp/dinas/**, dashboard APIs | Heatmap diklaim, marker yang ada | TINGGI | Ganti heatmap→daftar prioritas+peta marker | P0 |
| 9 | Operator memeriksa laporan | Ya | Hlm. 53 pengelolaan laporan | COMPLETE | report panel/detail dinas | Label “AI Verified” menyesatkan | SEDANG | Relabel UI; naskah: diperiksa operator | P1 |
| 10 | Kolektifkan/kelompokkan laporan | Parsial | Clustering hlm. 29, 34 | PARTIAL | auto-collective neighbors/group by assignment | “Clustering” sebagai pencegahan duplikat diklaim ✅ | TINGGI | Bedakan grouping operasional vs clustering ML | P0 |
| 11 | Rekomendasi petugas, kendaraan, urutan, rute | Parsial | Hlm. 29 optimasi rute ✅; hlm. 37 rekomendasi kendaraan | PARTIAL | OSRM+Haversine+NN+2-opt+capacity | Istilah optimasi berlebihan | KRITIS | Heuristic route recommendation + konfirmasi operator | P0 |
| 12 | Operator konfirmasi assignment | Parsial | assign endpoint hlm. 47 | PARTIAL | auto-collective confirm + assign services | Dual path auto/manual kurang dijelaskan | SEDANG | Dokumentasikan preview→confirm | P1 |
| 13 | Tugas diterima petugas | Ya | Hlm. 52–54 | COMPLETE | pp/petugas/tasks | — | RENDAH | — | P2 |
| 14 | Navigasi ke pickup | Ya | Hlm. 37 Leaflet | COMPLETE | detail tugas + navigasi | Bukan multi-stop navigation otomatis di petugas | SEDANG | Jangan samakan navigasi titik dengan optimasi armada | P1 |
| 15 | Petugas ambil sampah | Tersirat | status workflow | PARTIAL | status DIJEMPUT/SELESAI | Status naming inkonsisten | TINGGI | State machine + permission matrix | P0 |
| 16 | Unggah foto sesudah | Ya | Hlm. 38, 54 Gambar 4.7 | COMPLETE | verify API oto_sesudah | — | RENDAH | — | P2 |
| 17 | Bandingkan before-after (AI bantu) | Ya klaim | Hlm. 38–40 | CLAIM ONLY | Tidak ada image-diff AI | Klaim AI-assisted compare | KRITIS | Hapus/perlemah hingga ada modul; keputusan manusia | P0 |
| 18 | Validasi akhir manusia | Ya | Hlm. 38–40 | PARTIAL | verify oleh petugas; reward setelahnya | “AI Verified” di UI dinas | TINGGI | Tekankan human final decision | P0 |
| 19 | Laporan ditutup | Ya | status selesai | PARTIAL | status SELESAI | Mapping CLOSED vs SELESAI | SEDANG | Mapping eksplisit | P1 |
| 20 | Koin otomatis idempoten | Ya | Hlm. 37, 61 skenario 2 | COMPLETE | grantVerificationReward + cek existing | KOIN_PER_LAPORAN unused di route lama | SEDANG | Dokumentasikan rumus+idempotency key/unique | P1 |
| 21 | Koin masuk saldo | Ya | saldo di caption dashboard | COMPLETE | user.saldo_koin + TransaksiKoin | Bukan model Wallet terpisah | RENDAH | Jelaskan saldo+ledger, bukan hanya angka UI | P1 |
| 22 | Pilih produk katalog | Ya | Hlm. 54 Gambar 4.8 | COMPLETE | Kopdes/Produk APIs | Paket Revisi ingin membuang | TINGGI | Pertahankan; posisikan sebagai partisipasi ekonomi MVP | P1 |
| 23 | Buat permintaan penukaran | Ya | Hlm. 47 POST /redemptions | COMPLETE | 
edemption.service create | — | RENDAH | — | P2 |
| 24 | QR sekali pakai | Ya | Hlm. 37, 54 | COMPLETE | opaque token + expiry | Detail keamanan kurang di proposal | TINGGI | Jelaskan token opaque, bukan sumber kebenaran produk | P0 |
| 25 | QR membawa token aman | Parsial | hlm. 49 validasi kode | PARTIAL | URL+token; hash SHA-256 at-rest | Jangan sebut SHA-256 sebagai signature | KRITIS | Bedakan hash penyimpanan vs tanda tangan digital | P0 |
| 26 | Koperasi pindai QR | Ya | Hlm. 52–54 | COMPLETE | pp/kopdes/scan | — | RENDAH | — | P2 |
| 27 | Server validasi multi-cek | Ya parsial | Hlm. 48–49 | PARTIAL | status, expiry, stok, saldo, koperasi | Concurrent/race perlu ditegaskan di naskah+test | TINGGI | Cantumkan checklist validasi + error code | P0 |
| 28 | Kurangi saldo+stok 1 transaksi | Tersirat | transaction testing hlm. 61 | COMPLETE | $transaction reserve stok+koin | Timing deduct vs confirm perlu dijelaskan jujur | TINGGI | Jelaskan reserve-on-create vs redeem-on-confirm sesuai kode | P0 |
| 29 | Serah produk + catat | Parsial | confirm endpoint | PARTIAL | confirm marks REDEEMED | AuditLog entitas tidak ada | TINGGI | Jangan klaim AuditLog lengkap; sebut riwayat transaksi | P1 |
| 30 | Audit log seluruh aktivitas | Klaim lemah | admin riwayat hlm. 53 | PARTIAL / CLAIM ONLY | CSV/export; no AuditLog model | Paket Revisi mensyaratkan AuditLog | TINGGI | Roadmap AuditLog; MVP: ledger+riwayat | P1 |
| 31 | Data untuk iterasi model/kebijakan | Tersirat moat | hlm. 24 moat kosong | ROADMAP | koreksi AI fields ada; belum pipeline evaluasi formal | Moat kosong di proposal | SEDANG | Moat = data loop operasional lokal (rencana) | P2 |

---

# 3. Daftar kontradiksi antardokumen

| Isu | Dokumen/bagian pertama | Dokumen/bagian bertentangan | Risiko | Dampak | Keputusan final | Teks yang harus diganti |
|---|---|---|---|---|---|---|
| Problem statement | Proposal hlm. 8–9: empat akar setara | Paket Revisi §3.1: satu gap triase DLH | KRITIS | Fokus juri pecah | Satu masalah utama: triase laporan DLH | Ganti pembuka Bab latar dengan pernyataan Paket Revisi yang diperluas ke closed-loop sebagai solusi, bukan empat tujuan setara |
| Target pengguna | Hlm. 14–18 warga/DLH/UMKM setara | Paket: DLH primer | TINGGI | Value prop kabur | DLH primer; warga & petugas sekunder; Kopdes supporting MVP | Susun hierarki pengguna |
| Jumlah role | Hlm. 33 lima peran | Paket: tiga role inti | TINGGI | Scope vs demo | Lima role tetap (kode ada); bedakan inti vs supporting | “Tiga role alur operasi inti + admin + kopdes” |
| Killer feature | Hlm. 54 foto+CV+lokasi; hlm. 23 AHP/YOLO; tabel rute | Paket: Photo-to-Priority | KRITIS | Inovasi tidak fokus | Photo-to-Verified-Reward Pipeline dalam platform closed-loop | Ganti bab novelty |
| Scope MVP | Hlm. 37 mencakup koin/QR/leaderboard | Paket buang Kopdes/QR | KRITIS | Konflik arah tim | **MVP Alternatif 2: closed-loop tetap** | Tolak penghapusan Kopdes; terima peringatan klaim |
| Scope roadmap | Draft YOLO custom/PostGIS | Proposal stack Gemini | TINGGI | Roadmap kabur | YOLO custom, heatmap densitas, AI image-diff, AHP formal → roadmap | Tabel MVP vs roadmap |
| Teknologi AI | Hlm. 13/23 YOLO | Hlm. 32 Gemini; hlm. 37 Google Vision | KRITIS | Demo ≠ teks | Gemini multimodal primer | Hapus YOLO MVP & Google Vision jika tidak dipakai |
| Gemini | Hlm. 32 dipilih pengganti YOLO | Kode multi-provider | TINGGI | Oversimplifikasi | Gemini primary + fallback | Tambah subbab fallback |
| OpenRouter | Ide inti wajib | Proposal NOT DOCUMENTED | KRITIS | Arsitektur AI tidak lengkap | Wajib didokumentasikan sebagai fallback | Tambah paragraf provider |
| Groq | Ide inti wajib | Proposal NOT DOCUMENTED; kode justru first | KRITIS | Urutan salah | Groq = fallback terakhir | Samakan narasi; koreksi kode belakangan |
| Fallback AI | Batasan confidence hlm. 38 | Tidak ada orkestrasi multi-provider | KRITIS | Kegagalan AI tidak dijelaskan | Orkestrator + kondisi fallback eksplisit | Subbab AI Orchestrator |
| Priority scoring | Hlm. 23 multi-kriteria inkl. kepadatan & jarak TPS | Kode: size/risk/repeat/age | KRITIS | Variabel fiktif | Hanya variabel yang dihitung di kode | Tabel variabel aktual |
| AHP | Novelty hlm. 23 | Kode weighted; Paket §4.2 offline AHP | KRITIS | Klaim metodologis palsu | Jangan klaim AHP implemented | “Configurable weighted priority scoring (bobot v1)” |
| Estimasi ukuran/volume/berat | Tujuan volume; kompetitor volume | Batasan hlm. 37 tidak 3D/berat | KRITIS | Self-contradiction | Ukuran relatif | Global replace istilah |
| Geolokasi & EXIF | Tujuan metadata foto | Implementasi izin perangkat; kode flags EXIF | TINGGI | Kegagalan lokasi | Geolocation API primer | Koreksi tujuan khusus no.1 |
| Heatmap | Hlm. 17, 23, 34 | Kode marker/map; Paket buang heatmap kompleks | KRITIS | Fitur fiktif | Marker + sort priority | Hapus heatmap dari MVP claims |
| Clustering | Tabel hlm. 29 ✅ | Grouping operasional auto-collective | TINGGI | Overclaim | Operational grouping / auto-collective | Ganti “clustering anti-duplikat” |
| Duplikat laporan | Validasi hlm. 48 | Tidak ada klaim algoritma jelas di progress | SEDANG | Ambigu | Cooldown lokasi / flags; jujurkan batas | Jelaskan mekanisme aktual |
| Assignment | Hlm. 37 otomatis | Manual+auto di kode | SEDANG | — | Auto-rekomendasi + konfirmasi operator | — |
| Rekomendasi kendaraan | Ada | — | RENDAH | — | Pertahankan | — |
| Route optimization | Tabel ✅ | Heuristik bukan VRP exact | KRITIS | Overclaim | Heuristic recommendation | Ganti istilah di tabel kompetitor |
| OSRM | Tidak disebut jelas di proposal | Ada di auto-collective | TINGGI | Teknologi tersembunyi | Cantumkan OSRM (+fallback Haversine) | Stack + routing section |
| Foto before-after | Hlm. 38 AI compare | Store-only | KRITIS | Klaim palsu | Human verification + bukti foto | Hapus AI compare |
| Verifikasi AI | AI-assisted hlm. 38 | Tidak ada modul | KRITIS | Reward risk | Decision support only jika nanti ada; sekarang human-only compare | — |
| Reward/koin | Ada di scope | Paket ingin buang | TINGGI | — | Pertahankan MVP | — |
| Katalog koperasi | Ada | Paket buang | TINGGI | — | Supporting MVP | — |
| QR redemption | Ada | Detail token kurang | TINGGI | Security narrative lemah | Opaque token + server validation | Subbab keamanan QR |
| Pengurangan stok | Transaction testing disebut | Perlu penjelasan reserve | TINGGI | — | Dokumentasikan transaksi aktual | — |
| Arsitektur | Hlm. 15 mikroservis | Hlm. 32 Next fullstack; kode monolith | KRITIS | — | Modular monolith | Hapus mikroservis |
| Status implementasi | Tabel hlm. 52 […] | Kode banyak COMPLETE | KRITIS | Tidak bisa dinilai | Isi dengan DoD | Tabel progress aktual |
| Hasil testing | Strategi hlm. 61 | Hanya unit bermock | KRITIS | Overclaim risk | Rencana+bukti terpisah | Jangan tulis “lulus semua” |
| Timeline | 20 hari disebut hlm. 32 | Tabel timeline kosong | TINGGI | — | Timeline 20 hari Paket Revisi diadaptasi ke closed-loop | Isi Bab metodologi |
| Pembagian tugas | Dua developer shared ownership | Sampul 5 anggota | KRITIS | Kredabilitas tim | 5 anggota + PIC stream | — |
| Klaim riset pengguna | Tidak ada N/survei di proposal | Draft metrik “blm di cari” | TINGGI | — | Rencana evaluasi, bukan hasil fiktif | — |
| Daftar pustaka | Hlm. 65 kosong | Sitasi [1]–[54] di badan | KRITIS | Akademis gagal | Lengkapi atau kurangi sitasi | — |


---

# 4. Audit fondasi masalah, killer feature, dan scope

## 4.1 Validasi fondasi masalah

**Temuan:** Proposal belum memiliki satu masalah utama yang spesifik dan konsisten.  
**Bukti dokumen:** Hlm. 8–9 menempatkan empat akar (data real-time, armada, partisipasi, fragmentasi) secara setara; hlm. 13–18 menambahkan banjir, ekonomi mikro, ESG. Plans menuntut satu titik kritis.  
**Tingkat risiko:** KRITIS  
**Mengapa bermasalah:** Juri kesulitan menilai apakah WasteLens menyelesaikan triase DLH, partisipasi warga, VRP, atau ekonomi koperasi.  
**Dampak:** Novelty dan metrik menjadi kabur; scope mengembang.  
**Keputusan:** Masalah utama = ketidakkonsistenan dan keterlambatan triase laporan lapangan DLH. Partisipasi, routing, reward adalah mekanisme pendukung dalam closed-loop.  
**Koreksi:** Gunakan problem statement final di bawah.  
**Teks pengganti:** lihat §11.Y.4–Y.6.

Evaluasi poin demi poin:

1. Fokus triase DLH: **seharusnya ya; saat ini belum konsisten.**
2. Cakupan partisipasi/routing/reward: **ada, tetapi diposisikan terlalu setara.**
3. Terlalu banyak masalah setara: **ya.**
4. Hubungan masalah–penyebab–dampak–solusi: **longgar; lompatan dari data nasional ke AHP/YOLO.**
5. Statistik mendukung problem statement: **mendukung konteks sampah nasional, lemah untuk gap operasional lokal DLH.**
6. Data nasional vs lokal: **terlalu jauh bila tidak diikat ke proses triase.**
7. Lompatan logika: YOLO akurasi literatur → akurasi sistem WasteLens; mikroplastik → urgensi fitur prioritas.
8. Urgensi: **ada (Permen LHK, smartphone, CV), tetapi digantungkan pada YOLO.**
9. Solusi vs akar: **Photo-to-Priority cocok untuk akar fragmentasi/prioritas; closed-loop cocok untuk partisipasi.**
10. Sebab-akibat belum terbukti: penghematan BBM, penurunan banjir, akurasi 85% — **harus diperlemah.**

### Teks final siap tempel

**Problem statement:**  
Dinas Lingkungan Hidup belum memiliki mekanisme yang konsisten untuk mengubah laporan foto warga menjadi antrean penanganan yang terverifikasi dan terurut berdasarkan urgensi. Laporan lapangan cenderung tersebar, berformat tidak seragam, dan memerlukan pemeriksaan manual sebelum petugas menentukan lokasi, skala relatif tumpukan, serta urutan penanganan. Keterbatasan ini memperlambat triase dan meningkatkan risiko alokasi petugas serta kendaraan yang tidak sesuai kebutuhan.

**Research question:**  
Bagaimana merancang dan mengevaluasi sistem closed-loop berbasis foto dan geolokasi yang mengekstraksi atribut sampah melalui AI multimodal multi-provider, menghitung skor prioritas yang dapat dijelaskan, mendukung pengelompokan serta rekomendasi rute penanganan bagi DLH, memastikan verifikasi penyelesaian oleh manusia, lalu memberikan reward koin yang dapat ditukarkan secara aman pada koperasi mitra?

**Product thesis:**  
WasteLens adalah platform closed-loop waste response yang mengubah foto dan koordinat warga menjadi objek kerja prioritas bagi DLH, menuntaskan penanganan hingga verifikasi lapangan, dan menutup siklus partisipasi melalui reward koin serta penukaran produk koperasi yang tervalidasi server.

**Value proposition:**  
Bagi DLH: antrean kerja terurut, dapat dijelaskan, dan dapat ditugaskan. Bagi warga: pelaporan cepat dengan umpan balik status dan reward setelah verifikasi. Bagi petugas: tugas jelas, navigasi, dan bukti penyelesaian. Bagi koperasi: penukaran terkontrol dengan QR sekali pakai.

**Tujuan umum:**  
Mengembangkan dan mengevaluasi MVP web mobile-first WasteLens yang menerima laporan foto dan geolokasi, menganalisisnya melalui AI multimodal dengan fallback multi-provider, menghitung skor prioritas transparan, mendukung operasi DLH hingga verifikasi pickup, serta menjalankan siklus reward dan penukaran koperasi secara aman dan idempoten.

**Tujuan khusus:**  
1. Menyediakan alur pelaporan foto+geolokasi dengan validasi file, akun, dan koordinat.  
2. Mengorkestrasi Gemini sebagai provider utama, dengan fallback OpenRouter dan Groq, serta normalisasi keluaran ke JSON schema tunggal.  
3. Menghitung skor prioritas explainable (ukuran relatif, risiko, pengulangan, usia laporan) dengan bobot berversi.  
4. Menyediakan dashboard DLH, pengelompokan laporan operasional, rekomendasi petugas/kendaraan/urutan/rute heuristik, dan assignment terkonfirmasi.  
5. Menyediakan alur petugas: terima tugas, navigasi, unggah foto sesudah, verifikasi manusia, penutupan laporan.  
6. Memberikan koin secara otomatis dan idempoten setelah verifikasi final.  
7. Menyediakan katalog, penukaran, QR sekali pakai, dan pengurangan saldo serta stok dalam transaksi basis data yang konsisten.  
8. Mengevaluasi latensi AI, schema-valid rate, fallback rate, alur E2E, otorisasi, serta keberhasilan penukaran pada skenario uji terkontrol.

**Batasan masalah:**  
Sistem tidak mengklaim pengukuran volume/berat 3D, tidak menjadikan AI sebagai keputusan final kebersihan, tidak menjamin rute global-optimal VRP, tidak mencakup aplikasi native/offline/push notification, dan tidak mencairkan koin menjadi uang.

## 4.2 Killer feature dan novelty

| Lapisan | Isi | Bukan novelty utama jika berdiri sendiri |
|---|---|---|
| Core intelligence | Photo-to-Priority (foto+geo → AI schema → skor explainable) | Pemanggilan Gemini API |
| Core operational workflow | Auto-collective, rekomendasi rute heuristik, assignment | Marker map saja |
| Participation mechanism | Crowdsourcing + status transparan | Form aduan biasa |
| Economic extension | Verified reward + QR redemption + stok | Gamifikasi generik |
| Long-term data moat | Foto before/after, koreksi manusia, waktu selesai, pola repeat, bobot DLH | Dataset generik luar negeri |

**Putusan killer feature:** **Photo-to-Verified-Reward Pipeline** di dalam **Closed-Loop Waste Response Platform**.  
Photo-to-Priority tetap menjadi inti intelijen; diferensiasi demo adalah loop sampai reward/penukaran yang aman.

**Research gap (final):**  
Belum tersedia sistem terintegrasi pada konteks operasional DLH lokal yang menggabungkan (1) crowdsourcing foto+geolokasi, (2) analisis visual terstruktur dengan orkestrasi multi-provider, (3) skor prioritas explainable, (4) workflow penugasan dan rekomendasi rute heuristik, serta (5) penutupan siklus melalui verifikasi manusia dan penukaran reward yang transaksional—bukan sekadar kanal aduan atau smart bin unit.

**Novelty (final):**  
Kebaruan terletak pada **integrasi operasional closed-loop** dan **explainable priority yang terhubung ke assignment**, bukan pada kepemilikan model AI tersendiri.

**Moat (final):**  
Data loop lokal: pasangan bukti sebelum/sesudah, keputusan verifikasi manusia, durasi penyelesaian, pola laporan berulang, konfigurasi bobot yang disepakati DLH, dan jejak penukaran koperasi. API model dapat ditiru; integrasi workflow dan data tervalidasi lebih sulit ditiru cepat.

**Keunggulan teknis / operasional / sosial:**  
- Teknis: schema-valid multimodal + fallback + priority berversi + transaksi reward/redeem.  
- Operasional: antrean terurut, grouping, rekomendasi rute/kendaraan, assignment.  
- Sosial: partisipasi berinsentif setelah verifikasi, ekonomi mikro koperasi terkendali.

**Tabel kompetitor yang disarankan (centang jujur):**

| Fitur | WasteLens | TrashOut | JAKI/JakLapor | Rekosistem/Octopus |
|---|---|---|---|---|
| Crowdsource titik sampah liar | Ya | Ya | Ya (aduan umum) | Terbatas/tidak fokus |
| Klasifikasi ukuran relatif via AI | Ya | Tidak | Tidak | Tidak |
| Priority score explainable | Ya | Tidak | Tidak | Tidak |
| Assignment petugas/kendaraan | Ya | Terbatas | Ya operasional Pemda | Berbeda model |
| Rekomendasi rute heuristik | Ya (bukan VRP exact) | Tidak | Tidak fokus | Pickup model berbeda |
| Verifikasi manusia + bukti foto | Ya | Bervariasi | Bervariasi | Berbeda |
| Reward setelah verifikasi | Ya | Tidak | Tidak | Poin model berbeda |
| QR redeem + stok transaksi | Ya | Tidak | Tidak | Berbeda |

Hapus centang “Optimasi rute armada” dan “Klasifikasi volume” serta klaim “Satu-satunya platform…”.

## 4.3 Scope MVP vs roadmap

### Alternatif 1 — MVP berhenti pada verifikasi pickup
- Inovasi: Photo-to-Priority jelas; kompetisi fokus.  
- Kompleksitas: lebih rendah.  
- Risiko implementasi: rendah.  
- Testing: lebih pendek.  
- Cocok waktu kompetisi: tinggi.  
- Cocok implementasi aktual: **rendah** (membuang modul yang sudah ada).  
- Risiko proposal terlalu luas: rendah.  
- Risiko kehilangan diferensiasi: **tinggi** (loop ekonomi hilang dari demo).

### Alternatif 2 — MVP mencakup reward, QR, koperasi, stok (**DIPILIH**)
- Inovasi: closed-loop penuh; sesuai ide inti 31 langkah.  
- Kompleksitas: tinggi, tetapi sebagian besar sudah di kode.  
- Risiko implementasi: sedang (hutang AI order, status, E2E, audit).  
- Testing: wajib dua critical path.  
- Waktu kompetisi: ketat, tetapi realistis bila klaim dibersihkan.  
- Cocok implementasi aktual: **tinggi**.  
- Risiko terlihat terlalu luas: sedang — diatasi dengan hierarki Core/Supporting/Demo/Roadmap.  
- Risiko kehilangan diferensiasi bila dipersempit: dihindari.

### Pemetaan fitur

**Core MVP:** foto+validasi; AI Gemini→OpenRouter→Groq+schema; priority explainable; dashboard DLH; grouping/auto-collective; rekomendasi rute heuristik; assignment; tugas petugas; foto sesudah; verifikasi manusia; reward idempotent; katalog; QR; validasi redeem; transaksi saldo+stok.

**Supporting MVP:** notifikasi in-app; leaderboard sederhana; koreksi hasil AI; reverse geocode; rekomendasi jenis kendaraan.

**Demo enhancement:** kartu alasan prioritas; before-after side-by-side; sinkron daftar-peta; tampilan fallback AI.

**Roadmap:** custom YOLO; AHP formal+CR; heatmap densitas; AI image-diff; AuditLog append-only; circuit breaker metrik penuh; push/SMS; native; SIPSN/ESG dashboard.

---

# 5. Audit teknis AI, priority, routing, status

## 5.1 Audit arsitektur AI multi-provider

**Temuan:** Proposal tidak mendeskripsikan orkestrasi multi-provider; kode punya fallback sekuensial tetapi urutan tidak sesuai ide inti; tidak ada circuit breaker.  
**Bukti dokumen:** Hlm. 32–34 hanya Gemini; hlm. 37 menyebut Gemini atau Google Vision.  
**Bukti kode:** server/integrations/ai/ai.service.ts urutan Groq→Gemini→OpenRouter; Zod schema ada.  
**Tingkat risiko:** KRITIS  
**Keputusan:** Dokumentasikan arsitektur di bawah sebagai target naskah; koreksi kode dilakukan terpisah (tidak pada siklus ini).

### Diagram tekstual

`	ext
[Input Validator]
   |  MIME, size, auth, lat/lng, account status
   v
[AI Orchestrator]
   |-- try Primary: Gemini (timeout, retry terbatas)
   |       v
   |  [Output Validator: JSON + schema + konsistensi atribut]
   |       | valid & confidence OK -> lanjut
   |       | else fallback reason dicatat
   |-- try Fallback-1: OpenRouter
   |-- try Fallback-2: Groq
   v
[Output Normalizer] -> skema kanonik WasteAnalysis
   v
[Confidence Evaluation]
   |-- pass -> Priority Engine
   |-- low / fail all -> NEEDS_REVIEW / manual review (tanpa data loss)
   v
[AiAttempt / Provider Log] + model/version/latency/failureReason
`

### Kondisi fallback eksplisit
1. Timeout  
2. HTTP error  
3. Rate limit  
4. Response kosong  
5. JSON tidak valid  
6. Schema tidak sesuai  
7. Gambar tidak dapat dianalisis  
8. Confidence rendah  
9. Output antaratribut tidak konsisten  

### Pseudocode orkestrasi

`	ext
function analyze(image):
  attempts = []
  for provider in [Gemini, OpenRouter, Groq]:
    try:
      raw = call(provider, image, timeout=T)
      parsed = parseJson(raw)
      valid = schema.validate(parsed)
      attempts.append({provider, ok: valid, latency, model})
      if valid and parsed.confidence >= THRESHOLD:
        return normalize(parsed, attempts)
      if valid and parsed.confidence < THRESHOLD:
        mark_low_confidence(parsed, attempts); continue_or_review()
    catch e:
      attempts.append({provider, ok:false, reason:e})
  return needs_manual_review(attempts)
`

### JSON schema hasil AI (kanonik)

`json
{
  isWastePresent: true,
  sizeClass: SMALL|MEDIUM|LARGE|UNCERTAIN,
  wasteTypes: [plastic, organic],
  drainageRisk: false,
  accessObstructionRisk: false,
  visualIndicators: [string],
  confidence: 0.0,
  rationale: string,
  provider: gemini|openrouter|groq,
  modelName: string,
  schemaVersion: 1
}
`

### Struktur data disarankan

**AiAnalysis (dapat tertanam di Laporan saat MVP):** reportId, provider, modelName, sizeClass, wasteTypes, risk flags, confidence, rawRef, schemaVersion, createdAt.

**AiAttempt / AiProviderLog:** id, reportId, provider, modelName, startedAt, endedAt, latencyMs, success, failureReason, httpStatus, schemaValid, confidence.

**Belum ada di kode sebagai tabel terpisah** → status dokumentasi: PARTIAL; jangan diklaim COMPLETE.

### Test case AI minimum
Gemini gagal; OpenRouter gagal; Groq gagal; semua gagal; invalid JSON; confidence rendah; schema mismatch; gambar bukan sampah; latency dicatat; provider tersimpan benar.

### Teks proposal siap salin (AI)

> WasteLens menggunakan Gemini multimodal sebagai provider utama untuk mengekstraksi atribut terstruktur dari foto laporan. Apabila terjadi timeout, galat HTTP, rate limit, respons kosong, JSON tidak valid, ketidaksesuaian schema, confidence rendah, atau ketidakkonsistenan atribut, orkestrator melakukan fallback ke OpenRouter kemudian Groq. Seluruh keluaran dinormalisasi ke JSON schema tunggal sebelum masuk ke mesin prioritas. Jika seluruh provider gagal, laporan tidak dihapus dan diarahkan ke tinjauan manual. OpenRouter dan Groq diposisikan sebagai inference gateway/provider, bukan agen pengambil keputusan.

## 5.2 Audit priority scoring

**Temuan:** Runtime adalah weighted score; AHP tidak diimplementasikan; geScore dinolkan.  
**Bukti kode:** priority.service.ts bobot 0.4/0.3/0.2/0.1, geScore = 0.  
**Bukti dokumen:** Hlm. 13, 23 klaim AHP; kepadatan penduduk & jarak TPS disebut tanpa sumber data.  
**Risiko:** KRITIS  

### Formula final (jujur terhadap kode + target perbaikan)

`	ext
priorityScore = wSize·sizeScore + wRisk·riskScore + wRepeat·repeatScore + wAge·ageScore
weightVersion = v1
(wSize, wRisk, wRepeat, wAge) = (0.4, 0.3, 0.2, 0.1)
`

| Variabel | Definisi | Normalisasi | Catatan |
|---|---|---|---|
| sizeScore | SMALL=25, MEDIUM=50, LARGE=100, UNCERTAIN=0 | 0–100 | dari AI sizeClass |
| riskScore | drainage +40, access obstruction +30 | 0–70 (saat ini) | bukan probabilitas |
| repeatScore | min(repeatCount·10, 100) | 0–100 | radius/aturan repeat harus dijelaskan |
| ageScore | fungsi usia laporan | 0–100 | **saat ini 0 di kode — wajib diakui atau diperbaiki sebelum klaim** |
| level | CRITICAL≥80, HIGH≥60, MEDIUM≥40, else LOW | — | threshold konfigurasi |

**AHP:** hanya boleh disebut jika ada matriks pairwise ahli + consistency ratio secara offline untuk memperoleh bobot. Runtime tetap weighted scoring. Saat ini: **jangan klaim AHP**.

### Contoh perhitungan
MEDIUM (50), drainage saja (40), repeatCount=2 (20), ageScore=0  
score = 0.4·50 + 0.3·40 + 0.2·20 + 0.1·0 = 20+12+4+0 = **36 → LOW**

### Explainability
Simpan komponen skor, bobot, weightVersion, dan alasan ringkas (“ukuran sedang”, “risiko drainase”, “laporan berulang”).

### Test case
missing size → UNCERTAIN; risk kombinasi; repeat cap 100; tie-break createdAt; override manusia tercatat; ageScore bila diaktifkan monoton terhadap usia.

## 5.3 Audit pengelompokan dan routing

**Pembedaan istilah (wajib di naskah):**

| Istilah | Makna | Status WasteLens |
|---|---|---|
| Marker map | titik di peta | Ada |
| Navigasi satu titik | arah ke satu lokasi | Ada |
| Clustering | pengelompokan densitas/ML | Tidak sebagai klaim MVP |
| Grouping operasional | kumpulkan laporan layak satu tugas/rute | Ada (auto-collective) |
| Route recommendation | usulan urutan/rute | Ada heuristik |
| Route optimization | perbaikan heuristik (2-opt) | Ada terbatas |
| VRP / multi-vehicle exact | solver optimal | Tidak |

**Putusan istilah:** boleh menulis **“rekomendasi rute heuristik dengan perbaikan lokal (nearest neighbor + 2-opt) berbasis matriks OSRM/Haversine dan constraint kapasitas”**. Tidak boleh menulis seolah solver VRP optimal atau “optimasi rute” tanpa kualifikasi.

### Definisi algoritma (siap salin)
**Input:** himpunan laporan terpilih (koordinat, load unit, prioritas), petugas, kendaraan (kapasitas/status), parameter jarak/durasi.  
**Constraint:** kapasitas kendaraan, ketersediaan petugas/kendaraan, laporan eligible, batas jarak/durasi bila dikonfigurasi.  
**Objective (heuristik):** meminimalkan jarak/durasi estimasi sambil menghormati kapasitas dan memprioritaskan laporan penting dalam pengelompokan.  
**Output:** draft route stops berurut, estimasi jarak/durasi, assignment usulan.  
**Batasan:** tidak menjamin optimum global; titik tak terjangkau ditandai; operator wajib konfirmasi.  
**Flow:** preview → operator review → confirm → assignment mengikat.

## 5.4 Audit workflow status dan assignment

**Enum Prisma aktual:** ANALYZED, WAITING, PENDING, DIJEMPUT, SELESAI, DITOLAK.  
**Enum proposal/Paket:** DRAFT/WAITING/ANALYZING/…/CLOSED — **tidak identik**.

**Keputusan:** Dokumentasikan enum aktual + label UI. Jangan menulis state machine fiktif tanpa mapping.

### Matriks ringkas permission (target naskah)

| Transisi | Warga | DLH | Petugas | Admin | Catatan |
|---|---|---|---|---|---|
| Buat laporan → WAITING/ANALYZED | Ya | — | — | — | setelah AI |
| NEEDS_REVIEW / koreksi AI | — | Ya | Ya terbatas | — | fields correction* |
| Assign | — | Ya | — | — | |
| Start / DIJEMPUT | — | — | Ya (milik sendiri) | — | IDOR guard |
| Verify + SELESAI | — | Ya/override | Ya (tugas sendiri) | — | reward hanya sekali |
| DITOLAK / batal | — | Ya | — | Ya | audit alasan |
| Baca laporan orang lain | tidak | sesuai wilayah | hanya tugasnya | Ya | RBAC |

**Aturan emas:** reward tidak diberikan sebelum verifikasi final; verifikasi ulang tidak menambah koin.


---

# 6. Audit teknis reward, QR, stok, data, API, keamanan

## 6.1 Audit foto before-after

**Temuan:** Klaim AI membandingkan before-after tidak terbukti di kode.  
**Bukti dokumen:** Hlm. 38–40 AI-assisted verification.  
**Bukti kode:** POST /api/petugas/tasks/[id]/verify menyimpan oto_sesudah; tidak ada image-diff. UI dinas menampilkan label “AI Verified”.  
**Risiko:** KRITIS  

| Aspek | Status | Catatan |
|---|---|---|
| Kualitas foto | PARTIAL | validasi ukuran/MIME ada; kualitas visual terbatas |
| Lokasi/waktu foto sesudah | PARTIAL | perlu ditegaskan di naskah+validasi |
| Kesesuaian assignment | PARTIAL | petugas hanya tugas sendiri |
| Perbandingan AI | CLAIM ONLY | tidak ada |
| Human review | PARTIAL→inti | keputusan akhir manusia |
| Fake GPS / metadata | PARTIAL | flags lokasi; bukan bukti anti-spoof sempurna |
| Retensi media | NOT DOCUMENTED | wajib kebijakan |

**Klaim aman:** *AI-assisted classification pada laporan awal; verifikasi kebersihan merupakan keputusan petugas/operator berdasarkan bukti foto before-after. AI tidak menjadi pengambil keputusan final.*

## 6.2 Audit reward dan koin

**Bukti kode:** grantVerificationReward dalam transaksi; cek existing reward per laporan; rumus base+sizeBonus+riskBonus; update saldo_koin; TransaksiKoin / CoinTransaction untuk redeem.

| Aspek | Putusan |
|---|---|
| Kapan reward | Setelah verifikasi final |
| Penerima | Pelapor (user_id laporan) |
| Rumus | base + bonus ukuran + bonus risiko (lihat REWARD_CONFIG) |
| Max reward | ikuti config; dokumentasikan |
| Idempotency | cek existing sebelum create |
| Wallet | saldo pada User + ledger transaksi; bukan hanya angka UI |
| Transfer/cash-out | tidak (sesuai batasan hlm. 37) — pertahankan |
| Reversal | belum matang — jangan diklaim lengkap |
| Expiry koin | tidak ditemukan sebagai kebijakan inti — jangan diklaim |

**Model konseptual untuk naskah:** CoinWallet (saldo user), CoinLedger (TransaksiKoin/CoinTransaction), RewardGrant (transaksi jenis reward terikat laporan), RewardPolicy (config versi).

## 6.3 Audit QR redemption dan keamanan

**Bukti kode:** opaque random token (
andomBytes), disimpan sebagai **SHA-256 hash**; QR membawa URL+token mentah sekali; validasi server-side; stok+saldo di-reserve saat create.

**Temuan penting terminologi:** SHA-256 di sini adalah **hash penyimpanan token** (setara password hashing sederhana untuk lookup), **bukan tanda tangan digital** dan bukan HMAC/Ed25519 signature atas payload produk.

| Ancaman | Mitigasi aktual/diharapkan |
|---|---|
| QR sebagai sumber kebenaran produk | Hindari; baca ulang DB |
| Replay / double scan | status + once redeem |
| Expired | expires_at |
| Wrong cooperative | cek kopdes pemindai |
| Insufficient balance/stock | dicek di transaksi |
| Concurrent redemption | butuh penegasan locking/unique/idempotency (ada idempotency key) |
| Token tampering | token opaque acak; hash at-rest |
| Rate limit | perlu disebut sebagai kontrol |

### Payload yang disarankan untuk narasi (jika evolusi signed payload)

edemptionId, cooperativeId, issuedAt, expiresAt, nonce, version, signature — **tetapi implementasi saat ini adalah opaque token URL**, dan itu **sah** bila dijelaskan benar. Jangan memaksakan Ed25519 di proposal jika belum ada.

### Teks siap salin
> QR penukaran memuat token acak sekali pakai yang hanya menjadi penunjuk transaksi. Data produk, harga koin, stok, status, dan kepemilikan koperasi selalu dibaca ulang dari basis data. Token disimpan dalam bentuk hash SHA-256 di server untuk keperluan pencarian dan verifikasi kepemilikan token, bukan sebagai tanda tangan digital atas rincian produk. Pemindaian kedua, token kedaluwarsa, koperasi salah, stok/saldo tidak cukup, atau status tidak valid ditolak dengan kode galat terstruktur.

## 6.4 Audit transaksi stok dan saldo

Alur aktual yang harus ditulis jujur: pada **create redemption**, sistem dalam satu $transaction memeriksa produk/koperasi/saldo/stok, mengurangi stok dan saldo (reserve), membuat Penukaran + ledger REDEMPTION_RESERVE, menerbitkan token/QR. Pada **confirm**, status menjadi REDEEMED setelah validasi pemindaian.

Pseudocode konseptual:

`	ext
BEGIN
  lock/find redemption by token hash
  assert status, expiry, cooperative, product active
  # pada create:
  assert stock >= qty AND balance >= cost
  update stock; update balance; insert ledger; insert redemption
  # pada confirm:
  assert pending; mark REDEEMED; audit/history
COMMIT
-- any failure -> ROLLBACK
`

Sebutkan kebutuhan: unique constraint token_hash, idempotency key, check stok/saldo, isolasi transaksi. Jangan mengklaim inventory ledger terpisah jika belum ada model InventoryLedger.

## 6.5 Audit data model / ERD

| Entitas usulan | Di kode? | MVP? | Catatan |
|---|---|---|---|
| User/Role | Ya | Ya | role string |
| CitizenProfile | Tidak terpisah | Tidak wajib | cukup User |
| OfficerProfile | Petugas | Ya | |
| DlhOperator | Dinas / user dinas | Ya | |
| Cooperative | Kopdes | Ya | |
| Report | Laporan | Ya | |
| ReportMedia | Foto | Ya | |
| AiAnalysis | tertanam di Laporan | Ya (embedded OK) | |
| AiAttempt | Tidak | Supporting | tambah atau roadmap |
| PriorityAssessment | tertanam | Ya | |
| PriorityWeightConfig | konstanta kode | Supporting | jadikan config DB bila klaim versi kuat |
| ReportCluster | Tidak eksplisit | Tidak wajib | grouping via route |
| RoutePlan/Stop | DispatchRoute + 
oute_order | Ya | |
| Vehicle | Kendaraan | Ya | |
| Assignment | field di Laporan + route | Ya | |
| TaskVerification | VerifikasiPickup | Ya | |
| CoinWallet | saldo_koin | Ya | |
| CoinLedger | TransaksiKoin, CoinTransaction | Ya | |
| RewardGrant | via TransaksiKoin | Ya | |
| RewardPolicy | config kode | Supporting | |
| Product | Produk | Ya | |
| InventoryLedger | Tidak | Roadmap | |
| Redemption | Penukaran | Ya | |
| QrToken | field token pada Penukaran | Ya | |
| Notification | Notifikasi | Supporting | |
| AuditLog | Tidak | Roadmap | jangan klaim COMPLETE |

Entitas berlebihan untuk MVP bila dipaksakan semua tabel normalisasi AI/priority terpisah tanpa migrasi — embedded fields pada Laporan dapat diterima asal dijelaskan.

## 6.6 Audit API

Proposal hlm. 46–47 masih berisi **instruksi lomba** (“Tidak perlu mencantumkan seluruh endpoint”) dan path generik /auth/login “mendapatkan token”, padahal Better Auth memakai session cookie.

Domain yang perlu dikontrak sesuai implementasi aktual (pp/api/**): auth, laporan/upload/classify/validate-location, dinas dashboard/reports/auto-collective/routes, petugas tasks/verify, rewards, products, redemptions verify/confirm, admin, notifikasi.

Tandai sebagai **kontrak disebutkan tetapi belum lengkap** bila request/response/error/idempotency/audit event tidak ditulis. Ganti contoh response agar memuat iAnalysis dan priority.

## 6.7 Audit security dan privacy

| Risiko | Severity | Mitigasi |
|---|---|---|
| IDOR tugas petugas / laporan | Tinggi | Guard ownership di API; uji negatif |
| File upload MIME spoof/size | Tinggi | Validasi server, batasi 5MB, simpan aman |
| Fake GPS | Sedang | Flags akurasi/EXIF; jangan klaim anti-spoof sempurna |
| EXIF privacy | Sedang | Dokumentasikan strip/retain policy |
| QR replay/double scan | Tinggi | status+expiry+once |
| Privilege escalation role | Tinggi | RBAC layout+API; keluarkan path publik yang keliru |
| AI prompt injection via image/metadata | Sedang | schema validation; manual review |
| Secret management / demo password | Tinggi | jangan cetak password demo di proposal publik tanpa kontrol |
| Logging data sensitif | Sedang | redaksi log |
| Audit log integrity | Sedang | roadmap append-only |
| Rate limiting API/AI/QR | Sedang | sebutkan rencana/kontrol |
| Transaksi stok/saldo race | Tinggi | transaksi+constraint; uji concurrency |

---

# 7. Audit testing, metrik, metodologi, referensi

## 7.1 Audit testing

**Temuan:** Proposal hlm. 61 hanya strategi generik. Kode: Vitest pada uto-collective.test.ts dan 
oute-append.test.ts dengan mock Prisma/spatial. **Bukan** integration/E2E suite.

Jangan menyamakan unit bermock dengan integration/E2E.

### Critical path operasional (wajib)
Login warga → Report → Analyze → Prioritize → Dashboard → Group → Route → Assign → Start → Upload after → Verify → Close → Reward

### Critical path redemption (wajib)
Login warga → Select product → Create redemption → Generate QR → Cooperative scan → Validate → Confirm → saldo↓ stok↓ → second scan rejected

### 20 test case wajib disebut (sebagai rencana/bukti terpisah)
1 Gemini gagal 2 OpenRouter gagal 3 Groq gagal 4 semua gagal 5 invalid JSON 6 confidence rendah 7 duplicate/cooldown report 8 double assignment 9 double reward 10 double QR scan 11 concurrent stock 12 insufficient stock 13 insufficient balance 14 wrong cooperative 15 expired QR 16 invalid status transition 17 unauthorized role 18 network failure 19 OSRM failure 20 DB rollback

## 7.2 Audit metrik keberhasilan

Untuk setiap metrik: definisi ada; baseline/target **“harus diukur”** bila belum ada data. Jangan mengarang angka.

| Metrik | Definisi ringkas | Baseline | Target | Metode | Klaim |
|---|---|---|---|---|---|
| Task completion pelaporan | % pengguna uji menyelesaikan laporan | harus diukur | ≥90% (usulan) | UAT | setelah uji |
| Report success rate | laporan valid tersimpan | harus diukur | ≥95% | log/API test | pisahkan validasi vs server error |
| AI latency median/p95 | waktu classify | harus diukur | median≤5s; p95≤12s | server log | cantumkan kondisi jaringan |
| Schema-valid rate | % respons lolos schema | harus diukur | harus diukur | AiAttempt | — |
| Fallback rate/provider | % memakai fallback | harus diukur | informatif | log | bukan KPI “rendah selalu baik” |
| Agreement AI vs label manusia | kesesuaian sizeClass/risk | harus diukur | ≥80% usulan | dataset lokal | jangan pakai 85% literatur YOLO |
| Waktu triase operator | waktu urutkan+assign | harus diukur | turun vs manual simulasi | A/B tugas | butuh baseline |
| Route distance/utilization | estimasi OSRM | harus diukur | informatif | route plan | bukan penghematan BBM pasti |
| Verification success | % verify valid | harus diukur | harus diukur | log | — |
| Reward duplication rate | reward ganda / total | harus diukur | 0 | DB constraint test | — |
| QR success / fail rate | redeem sukses vs ditolak | harus diukur | harus diukur | log | — |
| Stock inconsistency | selisih ledger vs stok | harus diukur | 0 | audit query | — |
| Unauthorized access defect | temuan kritis RBAC | harus diukur | 0 | security test | release gate |
| Accessibility score | Lighthouse/axe | harus diukur | harus diukur | tool | jangan klaim WCAG penuh |

Hapus/perlemah metrik “volume sampah berhasil ditangani” sebagai angka tepat; gunakan jumlah laporan terselesaikan + distribusi sizeClass.

## 7.3 Audit metodologi dan riset pengguna

| Klaim | Status |
|---|---|
| Jumlah responden/survei/wawancara DLH/koperasi | **tidak dapat diverifikasi** di proposal; tidak ada instrumen/lampiran |
| Observasi truk / persona numerik | **tidak ditemukan** sebagai hasil formal |
| “Tim hanya dua developer” | **bertentangan** dengan sampul 5 anggota |
| Usability numerik | **belum ada** |
| Draft “Ini masih blm di cari” | **placeholder** — hapus dari jalur final |

**Metodologi jujur siap salin:**  
Pengembangan menggunakan pendekatan iteratif feature-based pada repositori Git dengan integrasi berkelanjutan ke lingkungan deployment. Evaluasi MVP dilakukan melalui (1) pengujian unit fungsi murni, (2) pengujian API/transaksi pada basis data uji, (3) pengujian alur kritis end-to-end, (4) evaluasi AI terhadap set label manusia, dan (5) uji penerimaan berskrip pada peran warga, operator DLH, petugas, dan koperasi. Apabila studi lapangan formal belum dilaksanakan, bagian ini dinyatakan sebagai **rencana evaluasi**, bukan hasil riset yang telah selesai.

## 7.4 Audit referensi dan klaim akademis

| Jenis klaim | Putusan |
|---|---|
| Statistik SIPSN/World Bank di latar | **butuh verifikasi eksternal** + entri pustaka; boleh dipertahankan jika sumber primer valid |
| Akurasi YOLO literatur sebagai akurasi WasteLens | **harus diperlemah/dihapus dari klaim sistem** |
| “Satu-satunya platform…” | **hapus** |
| Penghematan BBM/emisi angka pasti | **hapus**; potensi diukur pilot OK |
| Skalabilitas 514 kab/kota sebagai kesiapan sistem | **perlemah** menjadi aspirasi replikasi |
| Daftar pustaka kosong dengan sitasi [1]–[54] | **KRITIS — lengkapi atau kurangi sitasi** |
| DOI/judul | belumberverifikasi satu per satu pada siklus ini — **wajib pass terpisah sebelum submit** |

---

# 8. Audit UI/UX, tim, editorial

## 8.1 UI/UX dan accessibility

Bab hlm. 57–58 **kosong**. Caption screenshot hlm. 53–54 menunjukkan halaman ada, tetapi bukan bukti aksesibilitas.

| Role | Bukti UI di kode/caption | Celah naskah |
|---|---|---|
| Warga | scan, dashboard, katalog | empty/error/GPS/camera states belum ditulis |
| DLH | dashboard, map, auto-collective | outdoor readability/a11y kosong; label AI Verified menyesatkan |
| Petugas | tasks, verify | offline/GPS failure belum dibahas |
| Koperasi | scan QR | success/fail QR states perlu naskah |
| Admin | kelola akun | — |

Wajib disebut: mobile-first, touch ≥44px, kontras, focus state, keyboard, alternatif daftar vs peta, loading/empty/error, low-confidence AI, permission denied, konfirmasi penukaran.

## 8.2 Tim, timeline, progres

| Isu | Bukti | Putusan |
|---|---|---|
| Anggota | 5 nama hlm. 2 | Pertahankan 5 |
| “Dua developer” hlm. 43 | Konflik | Hapus/revisi |
| PIC stream | kosong | Wajib diisi nama nyata |
| Progress tabel […] | hlm. 52–56 | Isi dengan DoD jujur |
| Definition of Done | Paket Revisi bagus | Adopsi |

**DoD:** UI + backend + DB + validasi + authz + test + integrasi + dokumentasi. Jangan Completed jika hanya UI atau pure function.

## 8.3 Audit editorial (daftar koreksi per area)

| Lokasi | Masalah | Tindakan |
|---|---|---|
| Hlm. 1–7, 11–12, 20–21, 25–27, 30–31, 35–36, 41–42, 44–45, 50–51, 57–60, 63–66 | Halaman judul/kosong berlebih | Gabungkan; hapus slide kosong |
| Hlm. 13 | (spok perhatikan)\ | Hapus |
| Hlm. 24 | “Teknologi stzck yg unik”, Moat kosong | Isi/perbaiki ejaan |
| Hlm. 28 | “(harus sitasi/a pk/ web )” | Hapus instruksi; isi sitasi |
| Hlm. 34 | “(gaya penulisan)” | Hapus |
| Hlm. 37 & 39 | Duplikasi Batasan | Satu versi final |
| Hlm. 46 | Instruksi lomba API | Hapus; tulis kontrak aktual |
| Hlm. 52–56 | […] progress | Isi angka/status |
| Hlm. 3–5, 65–66 | Abstrak & pustaka kosong | Isi |
| Istilah | WASTELENS/WasteLens, volume/ukuran, scan/foto, optimasi/rekomendasi | Glosarium + consistency pass |
| Draft awal | “Ini masih blm di cari”, YOLO, mikroservis | Jangan masuk final tanpa filter |


---

# 9. Teks revisi siap salin (Y)

> Catatan: bagian yang sudah baik (batasan volume 3D, koin non-cashable, human final verification pada prinsipnya) dipertahankan dan digeneralisasi.

## Y.1 Judul
**WasteLens: Platform Closed-Loop untuk Triase Prioritas dan Penanganan Terverifikasi Titik Sampah Pinggir Jalan Berbasis Foto Crowdsourced**

## Y.2 Abstrak
Dinas Lingkungan Hidup membutuhkan data lapangan yang cepat dan terstruktur untuk menangani titik sampah pinggir jalan, sementara laporan warga masih tersebar dan memerlukan triase manual. WasteLens dikembangkan sebagai MVP web mobile-first yang mengubah foto dan geolokasi warga menjadi antrean penanganan terurut, penugasan operasional, verifikasi penyelesaian, serta siklus reward yang dapat ditukarkan pada koperasi mitra. Sistem memvalidasi foto dan koordinat, menganalisis citra melalui Gemini multimodal sebagai provider utama dengan fallback ke OpenRouter dan Groq, menormalisasi keluaran ke JSON schema tunggal, lalu menghitung skor prioritas yang dapat dijelaskan. Operator DLH dapat mengelompokkan laporan, memperoleh rekomendasi petugas, kendaraan, urutan, dan rute secara heuristik, serta mengonfirmasi assignment. Petugas menuntaskan pickup dengan bukti foto, sedangkan keputusan akhir kebersihan dilakukan oleh manusia. Setelah verifikasi, koin diberikan secara idempoten; warga menukarkan koin melalui QR sekali pakai yang divalidasi server hingga stok dan saldo berkurang dalam transaksi basis data. Implementasi menggunakan Next.js, TypeScript, Better Auth, PostgreSQL, Prisma, Leaflet, object storage, dan deployment berbasis Vercel. Evaluasi difokuskan pada schema-valid rate dan latensi AI, fallback rate, keberhasilan alur end-to-end operasional dan penukaran, kontrol akses, serta metrik triase pada uji terkontrol. Kebaruan terletak pada Photo-to-Verified-Reward Pipeline dalam platform closed-loop waste response, bukan pada kepemilikan model AI tersendiri.

**Kata kunci:** crowdsourcing, multimodal AI, priority scoring, geolocation, route recommendation, reward redemption, waste management, civic technology.

## Y.3 Latar belakang
Pertahankan data nasional SIPSN/World Bank sebagai **konteks**, kemudian turun eksplisit ke celah operasional: ketiadaan antrean prioritas terstruktur dari laporan foto warga untuk keputusan penugasan DLH. Hindari menyimpulkan langsung bahwa akurasi YOLO literatur menjadi kapabilitas WasteLens.

## Y.4–Y.6 Problem, akar, urgensi
Gunakan problem statement pada §4.1.  
**Akar masalah (hierarkis):** (1) laporan tidak terstruktur/tervalidasi; (2) absennya skor prioritas transparan; (3) penugasan dan pengelompokan masih manual; (4) lemahnya penutupan loop verifikasi dan insentif setelah kerja selesai.  
**Urgensi:** kebutuhan data granular kebijakan sampah terkelola, kesiapan saluran digital warga, dan ketersediaan AI multimodal API yang mempercepat MVP tanpa pelatihan model custom pada fase kompetisi.

## Y.7–Y.8 Tujuan
Lihat tujuan umum/khusus §4.1.

## Y.9 Target pengguna
- Primer: operator/dispatcher DLH  
- Sekunder: warga pelapor; petugas lapangan  
- Supporting MVP: koperasi mitra (Kopdes)  
- Pendukung sistem: admin  

## Y.10–Y.11 Manfaat dan dampak
Manfaat langsung per role tanpa menjanjikan penurunan banjir/BBM sebagai angka pasti. Dampak lingkungan/ekonomi/sosial dinyatakan sebagai **potensi yang diukur pada pilot**. SDG 11 utama; SDG 12 terkait reward sirkular; SDG 13 hanya sebagai potensi tidak langsung.

## Y.12–Y.15 Research gap, novelty, killer feature, moat
Lihat §4.2.

## Y.16 Scope MVP
Lihat pemetaan Core/Supporting pada §4.3 Alternatif 2.

## Y.17 Scope roadmap
Custom model/YOLO, AHP formal, heatmap densitas, AI before-after decision support, AuditLog append-only, push notification, native apps, integrasi SIPSN/ESG.

## Y.18 Batasan sistem
Gabungkan satu versi hlm. 37–40: non-native, no offline, koin non-cashable, registrasi mandiri hanya warga, notifikasi in-app, AI tidak mengukur volume/berat 3D, AI bukan final verifier, rute bersifat heuristik, ketergantungan internet dan ketersediaan dinas/petugas terdaftar.

## Y.19 Arsitektur
> WasteLens menggunakan arsitektur modular monolith pada Next.js. UI dan Route Handlers berada dalam satu aplikasi. Backend memvalidasi input, menyimpan media, mengorkestrasi AI multi-provider, menghitung prioritas, mengelola assignment/rute, reward, dan penukaran melalui Prisma/PostgreSQL. Layanan eksternal meliputi AI providers, OSRM/peta, object storage, dan basis data terkelola. Pendekatan ini dipilih untuk kecepatan pengembangan dan konsistensi tipe, bukan mikroservis.

## Y.20–Y.27 AI fallback, priority, routing, assignment, verification, reward, QR, inventory
Gunakan teks §5.1–5.3 dan §6.1–6.4.

## Y.28 Testing
Cantumkan jenis uji, tools (Vitest, koleksi API, Playwright atau setara, axe/Lighthouse), dua critical path, 20 skenario negatif, dan pernyataan jujur: *hasil numerik hanya dicantumkan setelah dijalankan; layanan eksternal pada sebagian unit test masih di-mock.*

## Y.29 Metrik
Tabel §7.2 dengan baseline “harus diukur”.

## Y.30 Metodologi
Paragraf metodologi jujur §7.3 + Agile feature-based tanpa klaim “hanya dua developer”.

## Y.31 Timeline (20 hari, adaptasi closed-loop)
1–2 scope freeze & kontrak; 3–5 auth/report/storage; 6–8 AI orchestrator+schema; 9–10 priority; 11–12 DLH+grouping+route preview; 13–14 petugas+verify+reward; 15–16 redemption/QR/stok tests; 17 UAT/a11y; 18 AI eval+bugfix; 19 proposal/video; 20 freeze+deploy verify.

## Y.32 Pembagian tugas
Satu PIC accountable per stream: Product/Integrasi; Backend-DB-Auth; Frontend-Map; AI-Priority; Dispatch-Routing; Reward-Redeem; UI/UX-a11y; QA-Release; Proposal-Referensi; Video. Nama diisi tim; kontributor boleh plural, PIC tunggal.

## Y.33 Kesimpulan
WasteLens menargetkan penutupan celah triase operasional DLH melalui pipeline foto-ke-prioritas yang dilanjutkan hingga penanganan terverifikasi dan siklus reward aman. Versi kompetisi menekankan kejujuran klaim, keselarasan dengan implementasi, dan kelengkapan uji pada dua critical path, sementara model custom, heatmap kompleks, dan verifikasi AI otomatis ditempatkan pada roadmap.

---

# 10. Action plan prioritas revisi

## 10.1 Wajib sebelum proposal dikumpulkan

| Masalah | Tindakan | PIC | Usaha | Dependency | Bukti selesai | Risiko jika ditunda |
|---|---|---|---|---|---|---|
| Placeholder & instruksi lomba | Hapus slide kosong, komentar editorial, instruksi API | Proposal | Sedang | — | PDF tanpa “spok/harus sitasi/[…]” | Penilaian kelengkapan gagal |
| Abstrak & pustaka kosong | Isi abstrak Y.2; lengkapi/kurangi sitasi | Proposal | Besar | Verifikasi sumber | Hlm. abstrak & pustaka terisi | Gugur akademis |
| YOLO/AHP/volume/mikroservis | Global replace sesuai putusan | Proposal+AI PIC | Sedang | Scope freeze | Tidak ada klaim YOLO MVP/AHP implemented | Demo ≠ naskah |
| OpenRouter/Groq tidak tertulis | Tambah subbab orkestrasi | AI PIC | Sedang | Keputusan urutan | Diagram+kondisi fallback | Arsitektur dinilai sempit/salah |
| Status fitur […] | Isi Completed/Partial dengan DoD | QA+PM | Besar | Inventaris kode | Tabel progress terisi | Overclaim |
| Tim 5 vs 2 | Samakan anggota & PIC | PM | Kecil | Kesepakatan tim | Tabel PIC | Kredibilitas |
| Tabel kompetitor overclaim | Ganti centang rute/volume/clustering | Proposal | Kecil | — | Tabel jujur | Novelty diragukan |
| Enum status | Dokumentasikan enum aktual+mapping | Backend | Sedang | — | Subbab state machine | Bingungkan juri/demo |
| QR/SHA-256 istilah | Perjelas opaque token vs signature | Backend+Security | Kecil | — | Paragraf keamanan | Salah istilah kritis |
| Duplikasi Bab batasan | Satu versi | Editor | Kecil | — | Satu Bab 8 | Naskah tidak rapi |

## 10.2 Wajib sebelum demo

| Masalah | Tindakan | PIC | Usaha | Dependency | Bukti | Risiko |
|---|---|---|---|---|---|---|
| Critical path E2E | Jalankan 2 path + rekam | QA | Besar | Deploy stabil | Checklist lulus | Demo putus |
| Provider fallback | Siapkan skenario gagal Gemini | AI | Sedang | Key providers | Rekaman/log | Single-point failure |
| Label AI Verified | Relabel UI/naskah | Frontend | Kecil | — | Tidak menyesatkan | Klaim verifikasi palsu |
| Double reward/QR | Uji negatif live | QA | Sedang | — | Ditolak benar | Fraud demo |
| OSRM failure fallback | Tunjukkan Haversine/graceful | Routing | Sedang | — | Tidak crash | Demo map gagal |

## 10.3 Wajib sebelum pilot

| Masalah | Tindakan | PIC | Usaha |
|---|---|---|---|
| Dataset label manusia | Kumpulkan ≥100 foto lokal | AI+DLH | Besar |
| Baseline waktu triase | Ukur proses manual | PM+DLH | Sedang |
| ageScore & policy reward | Aktifkan/kalibrasi | Backend | Sedang |
| Kebijakan retensi media & consent | Draft+implementasi | Security | Sedang |
| AuditLog append-only | Desain+migrasi | Backend | Besar |

## 10.4 Roadmap
Custom YOLO; AHP formal+CR; heatmap; AI image-diff decision support; circuit breaker metrics; InventoryLedger; push notif; native; SIPSN/ESG.

---

# 11. Keputusan final mengenai scope

**Dipilih: Alternatif 2 — MVP Closed-Loop hingga stok berkurang.**

Alasan utama: (1) sesuai ide inti 31 langkah; (2) modul reward/QR/stok sudah terimplementasi secara substansial; (3) diferensiasi kompetisi lebih kuat daripada Photo-to-Priority saja; (4) risiko “terlalu luas” dikendalikan dengan klaim jujur dan hierarki fitur, bukan dengan menghapus fitur yang sudah berjalan.

Paket Revisi tetap dipakai untuk: problem statement tunggal, DoD, release gate, koreksi istilah, storyboard, dan kebersihan naskah — **bukan** untuk membuang Kopdes dari MVP.

**Istilah produk final:** Closed-Loop Waste Response Platform dengan killer feature Photo-to-Verified-Reward Pipeline (inti intelijen: Photo-to-Priority).

---

# 12. Checklist final submission

- [ ] Abstrak terisi dan selaras demo
- [ ] Tidak ada placeholder/instruksi lomba/komentar editorial
- [ ] Satu problem statement; hierarki pengguna jelas
- [ ] YOLO custom tidak diklaim sebagai MVP
- [ ] Gemini primary + OpenRouter + Groq terdokumentasi
- [ ] AHP tidak diklaim implemented tanpa matriks+CR
- [ ] Istilah ukuran relatif (bukan volume/berat presisi)
- [ ] Routing disebut heuristik/rekomendasi, bukan VRP optimal
- [ ] Before-after: human final; tanpa AI compare fiktif
- [ ] Modular monolith, bukan mikroservis
- [ ] Enum status = aktual + mapping UI
- [ ] Tabel progress diisi dengan DoD
- [ ] Testing: rencana + bukti terpisah; tidak mengklaim E2E lulus tanpa artefak
- [ ] Metrik tanpa angka fiktif
- [ ] Daftar pustaka lengkap untuk setiap sitasi yang dipertahankan
- [ ] PIC stream terisi; jumlah anggota konsisten
- [ ] Screenshot ber-caption; diagram terbaca
- [ ] Link deploy, akun demo, tanggal uji
- [ ] Consistency pass istilah WasteLens / foto / prioritas / verifikasi / redemption
- [ ] Video storyboard mengikuti alur closed-loop

---

# 13. Daftar klaim akhir

## A. Klaim yang aman dipertahankan
1. Pelaporan foto + geolokasi warga untuk titik sampah pinggir jalan.  
2. Analisis multimodal untuk atribut terstruktur (ukuran relatif, risiko, material dominan) dengan schema validation.  
3. Skor prioritas weighted explainable berversi (dengan catatan variabel aktual).  
4. Dashboard DLH dan assignment petugas/kendaraan.  
5. Pengelompokan operasional / auto-collective serta rekomendasi rute heuristik berbasis OSRM/Haversine + NN + 2-opt + kapasitas.  
6. Verifikasi penyelesaian oleh petugas dengan bukti foto sesudah.  
7. Pemberian koin setelah verifikasi secara idempoten; koin tidak diuangkan.  
8. Katalog koperasi, QR sekali pakai berbasis token, validasi server, pengurangan saldo dan stok dalam transaksi.  
9. Arsitektur modular monolith Next.js + Prisma + PostgreSQL + Better Auth.  
10. Lima role aplikasi: warga, dinas, petugas, admin, kopdes.

## B. Klaim yang harus diperlemah
1. “Optimasi rute” → rekomendasi rute heuristik berconstraint.  
2. “AHP” → configurable weighted scoring; AHP hanya offline jika bukti ada.  
3. “Estimasi volume” → klasifikasi ukuran relatif.  
4. “AI-assisted before-after verification” → human verification dengan bukti foto (AI compare belum ada).  
5. “Akurasi ≥85%” → target evaluasi agreement yang harus diukur.  
6. Dampak BBM/emisi/banjir → potensi tidak langsung, diukur pilot.  
7. Skalabilitas nasional 514 kab/kota → aspirasi replikasi, bukan kesiapan saat ini.  
8. Clustering pencegahan duplikat sebagai fitur selesai → mekanisme terbatas/flags/cooldown apa adanya.  
9. Heatmap → peta marker + antrean prioritas.  
10. “Satu-satunya platform…” → hapus superlatif; gunakan tabel pembeda terbatas.

## C. Klaim yang harus dihapus sampai ada bukti
1. YOLO/YOLOv8/YOLOv9 sebagai komponen MVP WasteLens.  
2. Google Vision sebagai provider setara tanpa implementasi.  
3. Mesin AHP runtime / matriks pairwise yang telah dihitung.  
4. Mikroservis.  
5. AI image-diff sebelum/sesudah sebagai fitur berjalan.  
6. Circuit breaker AI (belum ada).  
7. AuditLog enterprise lengkap (baru export/riwayat parsial).  
8. Hasil survei/wawancara/UAT numerik tanpa instrumen dan data.  
9. Seluruh jenis pengujian telah lulus / coverage tinggi tanpa artefak.  
10. Pengukuran volume/berat presisi dari satu foto.  
11. Penghematan bahan bakar numerik.  
12. Daftar pustaka “lengkap” saat halaman pustaka masih kosong.

---

# 14. Temuan berformat (contoh induk yang mewakili pola koreksi)

## Temuan T-01 — Konflik YOLO vs Gemini
**Temuan:** Novelty dan tujuan mengklaim YOLO, sementara stack memilih Gemini.  
**Bukti dokumen:** Hlm. 10, 13, 23 vs hlm. 32–33; draft awal juga YOLO.  
**Tingkat risiko:** KRITIS  
**Mengapa bermasalah:** Demo tidak dapat menunjukkan custom YOLO; novelty menjadi klaim kosong.  
**Dampak:** Penilaian inovasi dan konsistensi teknis turun tajam.  
**Keputusan:** MVP = Gemini multimodal API; YOLO = roadmap setelah data lokal.  
**Koreksi:** Hapus YOLO dari tujuan/novelty/kompetitor MVP.  
**Teks pengganti:** “WasteLens pada MVP menggunakan Gemini multimodal API untuk mengekstraksi atribut terstruktur dari foto laporan warga. Pengembangan model custom ditempatkan pada roadmap setelah tersedia dataset lokal tervalidasi.”

## Temuan T-02 — AHP tidak diimplementasikan
**Temuan:** AHP diklaim sebagai pilar novelty.  
**Bukti dokumen:** Hlm. 13, 23, 24.  
**Bukti kode:** calculatePriority weighted sum; tanpa pairwise/CR.  
**Tingkat risiko:** KRITIS  
**Mengapa bermasalah:** Klaim metodologis akademis tanpa artefak.  
**Dampak:** Kerentanan pada sesi tanya juri.  
**Keputusan:** Sebut configurable weighted priority scoring; AHP offline hanya jika ada bukti.  
**Koreksi:** Ganti seluruh frasa “berbasis AHP” pada runtime.  
**Teks pengganti:** “Skor prioritas dihitung sebagai jumlah terbobot berversi atas ukuran relatif, risiko, pengulangan, dan usia laporan. Bobot awal v1 ditetapkan tim dan dapat dikalibrasi bersama DLH.”

## Temuan T-03 — Overclaim optimasi rute
**Temuan:** Tabel kompetitor mencentang optimasi rute armada.  
**Bukti dokumen:** Hlm. 29.  
**Bukti kode:** OSRM + NN + 2-opt + capacity assign.  
**Tingkat risiko:** KRITIS  
**Keputusan:** Centang “rekomendasi rute heuristik” atau setara; jangan VRP exact.  
**Teks pengganti:** “Sistem menyusun usulan pengelompokan dan urutan pickup menggunakan matriks jarak OSRM (fallback Haversine), konstruksi nearest neighbor, perbaikan 2-opt, serta pembatasan kapasitas kendaraan, yang baru mengikat setelah konfirmasi operator.”

## Temuan T-04 — AI before-after fiktif
**Temuan:** Batasan menyebut AI membandingkan before-after.  
**Bukti dokumen:** Hlm. 38–40.  
**Bukti kode:** verify menyimpan foto; tanpa model compare.  
**Tingkat risiko:** KRITIS  
**Keputusan:** Hapus klaim compare AI.  
**Teks pengganti:** “Petugas mengunggah foto sesudah penanganan. Keputusan bahwa lokasi telah bersih ditetapkan oleh petugas atau operator berwenang. Sistem mencatat bukti dan baru kemudian memberikan reward.”

## Temuan T-05 — Naskah belum selesai
**Temuan:** Abstrak, UI/UX, pustaka, progress kosong; komentar editorial.  
**Bukti dokumen:** Hlm. 3–5, 13, 24, 28, 52–66.  
**Tingkat risiko:** KRITIS  
**Keputusan:** Completion pass editorial sebelum submit.  
**Teks pengganti:** tidak berupa satu paragraf; ikuti checklist §12.

## Temuan T-06 — Paket Revisi vs ide inti soal Kopdes
**Temuan:** Paket Revisi menyarankan membuang koin/QR/Kopdes dari MVP.  
**Bukti dokumen:** Paket Revisi §5.2; ide inti langkah 20–29; kode redemption COMPLETE.  
**Tingkat risiko:** TINGGI (arah produk)  
**Keputusan:** Tolak penghapusan; terima peringatan agar ekonomi tidak menyaingi problem statement triase.  
**Koreksi:** Kopdes = supporting MVP dalam closed-loop; masalah utama tetap triase DLH.  
**Teks pengganti:** “Ekosistem penukaran koin pada koperasi mitra merupakan bagian penutup siklus partisipasi MVP, bukan masalah utama yang sejajar dengan triase DLH.”

---

# 15. Lampiran ringkas bukti kode (untuk konsistensi naskah)

| Area | Lokasi utama |
|---|---|
| AI fallback | server/integrations/ai/ai.service.ts |
| Schema AI | server/integrations/ai/waste-analysis.schema.ts |
| Priority | server/modules/priority/priority.service.ts |
| Lokasi | server/modules/location/location-verification.service.ts |
| Auto-collective / OSRM / NN / 2-opt | server/modules/dispatch/auto-collective.service.ts |
| Reward | server/modules/rewards/reward.service.ts |
| Redemption / QR token | server/modules/redemption/* |
| Verify pickup | `app/api/petugas/tasks/[id]/verify/route.ts` |
| Schema DB | prisma/schema.prisma |
| Unit tests (mock) | server/modules/dispatch/*.test.ts |

---

**Penutup naskah audit.**  
Dokumen ini bersifat preskriptif untuk revisi proposal. Tidak ada perubahan kode pada siklus penerbitan naskah ini. Koreksi urutan provider AI dan label UI “AI Verified” direkomendasikan sebagai tindak lanjut teknis terpisah sebelum demo.
