# Story App

Story App adalah aplikasi web berbasis Single Page Application (SPA) yang memungkinkan pengguna untuk membagikan momen melalui foto, deskripsi, dan lokasi geografis. Aplikasi ini dibangun dengan Vite dan dirancang sebagai Progressive Web App (PWA) agar dapat diakses dengan performa yang baik dan tetap berfungsi saat offline.

Aplikasi ini menggunakan layanan API Story Dicoding untuk autentikasi, pengelolaan cerita, serta notifikasi push. Fitur favorit disimpan secara lokal di IndexedDB, sementara UI menggunakan interaksi map dengan Leaflet.

## Fitur Utama

- Autentikasi pengguna (login dan register)
- Tampilan daftar cerita terbaru
- Detail cerita dengan foto dan lokasi
- Tambah cerita baru dengan:
  - kamera langsung
  - pilihan foto dari galeri
  - marker lokasi di peta
- Favorit cerita yang disimpan di IndexedDB
- Pencarian cerita favorit
- Notifikasi push
- PWA support untuk pengalaman offline dan installable app
- Responsive layout untuk desktop dan mobile

## Teknologi yang Digunakan

- Vite
- JavaScript ES Modules
- Leaflet.js untuk peta interaktif
- IndexedDB untuk data favorit lokal
- Workbox untuk service worker dan caching
- REST API dari story-api.dicoding.dev

## Struktur Proyek

```bash
story-app/
├── src/
│   ├── index.html
│   ├── public/
│   ├── scripts/
│   │   ├── config.js
│   │   ├── index.js
│   │   ├── sw.js
│   │   ├── data/
│   │   │   ├── auth-api.js
│   │   │   ├── auth-model.js
│   │   │   ├── story-api.js
│   │   │   ├── story-model.js
│   │   │   └── favorite-story-idb.js
│   │   ├── pages/
│   │   │   ├── about/
│   │   │   ├── add/
│   │   │   ├── detail/
│   │   │   ├── favorite/
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── app.js
│   │   ├── routes/
│   │   ├── styles/
│   │   └── utils/
│   └── styles/
├── dist/
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
├── STUDENT.txt
└── README.md
```

## Prasyarat

Sebelum menjalankan proyek, pastikan perangkat Anda sudah memiliki:

- Node.js (versi terbaru yang didukung oleh Vite)
- npm atau package manager lain yang kompatibel

## Instalasi

1. Clone repositori ini
2. Masuk ke folder proyek
3. Jalankan perintah berikut:

```bash
npm install
```

## Menjalankan Aplikasi

Untuk menjalankan aplikasi dalam mode development:

```bash
npm run dev
```

Aplikasi biasanya dapat dibuka di browser pada URL yang diberikan oleh Vite, misalnya:

```bash
http://localhost:5173
```

## Build untuk Produksi

Untuk membuat build produksi:

```bash
npm run build
```

Hasil build akan disimpan di folder `dist/`.

## Preview Build Produksi

```bash
npm run preview
```

## Konfigurasi API

Aplikasi ini terhubung ke API utama:

```js
https://story-api.dicoding.dev/v1
```

Konfigurasi API dan VAPID key berada di file:

```bash
src/scripts/config.js
```

Jika Anda ingin mengembangkan atau mengubah endpoint API, perbarui value `BASE_URL` dan key notifikasi push sesuai kebutuhan proyek.

## Alur Aplikasi

Secara umum, alur aplikasi adalah:

1. Pengguna login atau mendaftar
2. Aplikasi menyimpan token autentikasi di `localStorage`
3. Pengguna melihat daftar cerita terbaru di halaman beranda
4. Pengguna dapat membuka detail cerita, menandai favorit, atau melihat lokasi di peta
5. Pengguna dapat menambah cerita baru dengan foto dan koordinat lokasi
6. Story App menggunakan service worker untuk caching dan notifikasi push

## Catatan Penting

- Halaman yang memerlukan autentikasi akan otomatis mengarahkan pengguna ke halaman login jika token belum ada.
- Cerita favorit bersifat lokal, sehingga data akan tersimpan pada browser pengguna dan tidak bergantung pada API backend.
- Fitur notifikasi push hanya akan aktif bila browser mendukung Service Worker dan pengguna memberikan izin notifikasi.

## Demo / Link Terkait

Project ini juga memiliki URL demo yang tercatat dalam file `STUDENT.txt`:

```bash
https://story-app-pwa.netlify.app
```

## Lisensi

Proyek ini dibuat untuk pembelajaran dan pengembangan aplikasi web intermediate di Dicoding Indonesia. Silakan sesuaikan lisensi jika Anda akan menggunakannya untuk kebutuhan produksi atau publikasi.
