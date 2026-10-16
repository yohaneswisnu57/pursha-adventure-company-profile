# Pursha Adventure

Landing page statis Pursha Adventure untuk private trip pasangan. Halaman dilayani oleh Nginx Linux dalam Docker tanpa runtime aplikasi tambahan.

## Menjalankan proyek

1. Salin `.env.example` menjadi `.env`.
2. Isi `WHATSAPP_NUMBER` dengan format internasional tanpa tanda `+`, spasi, atau tanda hubung.
3. Isi harga resmi saat tersedia. Kolom harga boleh dibiarkan kosong.
4. Jalankan:

```powershell
docker compose up --build -d
```

Buka `http://localhost:8088`. Endpoint health tersedia di `http://localhost:8088/health`.

Hentikan container tanpa menghapus data atau image:

```powershell
docker compose down
```

## Verifikasi

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1
docker compose config --no-interpolate --no-env-resolution --quiet
docker compose exec web nginx -t
```

## Data bisnis yang belum tersedia

Implementasi sengaja tidak mengarang nomor WhatsApp, harga, testimoni, identitas legal, akun media sosial, atau kebijakan perjalanan. Jika nomor WhatsApp belum diisi, tombol Konsultasi menampilkan pesan konfigurasi dan tidak membuka nomor acak.

## Struktur

- `public/`: HTML, CSS, JavaScript, font lokal, dan gambar WebP.
- `nginx/`: konfigurasi Nginx.
- `docker/entrypoint.d/`: pengisian konfigurasi publik dari environment ketika container dimulai.
- `docs/PRD.md`: keputusan produk dan desain.
- `scripts/verify.ps1`: pemeriksaan statis dasar.
