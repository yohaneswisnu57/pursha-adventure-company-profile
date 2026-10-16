# PRD Pursha Adventure

## Tujuan

Membantu pasangan muda memahami karakter private trip Pursha Adventure, melihat empat inspirasi perjalanan, dan memulai konsultasi WhatsApp tanpa melalui alur booking yang kompleks.

## Audiens dan konversi

- Audiens utama: pasangan muda.
- Konversi utama: konsultasi WhatsApp.
- Bahasa: Indonesia.
- Harga: estimasi awal setelah data resmi tersedia.
- V1 tidak mencakup akun, CMS, pencarian, pembayaran, kalender ketersediaan, atau pengelolaan booking.

## Arah desain

Tema Ijen After Rain memakai kanvas `#E9EDEB`, permukaan `#D3DCD7`, teks `#1F2927`, teks sekunder `#52655F`, dan aksen tunggal `#315C9D`. Mode gelap memakai kanvas `#121A18`, permukaan `#1C2825`, teks `#E9EDEB`, dan aksen `#8DAEF0`.

Tipografi memakai Bricolage Grotesque untuk display dan Plus Jakarta Sans untuk body serta UI. Twin Horizon menjadi elemen khas melalui pasangan foto lanskap dan momen intim.

## Alur halaman

1. Navigasi dan CTA Konsultasi.
2. Hero asimetris dengan Twin Horizon.
3. Bukti nilai.
4. Empat inspirasi perjalanan.
5. Narasi perjalanan fleksibel.
6. Proses Ceritakan, Rancang, Berangkat.
7. Jaminan transparansi perjalanan.
8. FAQ.
9. CTA penutup dan footer.

Testimoni tidak ditampilkan sampai materi terverifikasi tersedia.

## Kontrak data paket

Setiap paket membutuhkan `slug`, `name`, `location`, `duration`, `summary`, `price_from`, `price_unit`, `activity_level`, `highlights`, `inclusions`, `hero_image`, `supporting_image`, `image_alt`, dan `whatsapp_message`.

Pada implementasi statis saat ini, harga dan nomor WhatsApp dimasukkan melalui environment container. Event yang tersedia adalah `view_package`, `click_package`, `click_whatsapp`, `click_whatsapp_package`, dan `open_faq`.

## Kriteria penerimaan

- Seluruh teks dan kontrol memenuhi WCAG 2.2 AA.
- Touch target utama sedikitnya 44 x 44 CSS px.
- Keyboard, focus ring, pembesaran teks, reduced motion, dan preferensi mode gelap didukung.
- Tampilan diuji pada lebar 320, 375, 768, 1024, dan 1440 px.
- Target lapangan: LCP tidak lebih dari 2,5 detik, INP tidak lebih dari 200 ms, dan CLS tidak lebih dari 0,1 pada persentil ke-75.
- Tidak ada harga, testimoni, sertifikasi, atau klaim keselamatan yang dibuat tanpa data resmi.

## Referensi riset

- [Indonesia Travel: Kawah Ijen](https://www.indonesia.travel/id/id/travel-ideas/adventure/the-magic-of-kawah-ijen-a-journey-to-indonesias-blue-fire)
- [Indonesia Travel: Bromo](https://www.indonesia.travel/id/id/travel-ideas/adventure/bromo-huge-adventures-cool-things-to-do-around-bromo-volcano)
- [W3C: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [W3C: Non-text Contrast](https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html)
- [W3C: Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
