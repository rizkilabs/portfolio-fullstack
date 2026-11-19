# Portfolio Full Stack: M. Rizki

Website portfolio pribadi untuk Full Stack Developer, lengkap dengan REST API, database, autentikasi admin, dan dashboard untuk mengelola konten.

- **Website:** GANTI\_https://nama-project.vercel.app
- **API (health check):** GANTI\_https://nama-api.onrender.com/api/health

> Backend di paket gratis bisa "tidur" saat lama tidak ada traffic, jadi request pertama kadang terasa lambat.

## Screenshot

<!-- GANTI: taruh gambar di folder docs/ lalu tampilkan di sini -->
<!-- ![Homepage](docs/home.png) -->
<!-- ![Dashboard admin](docs/admin.png) -->

## Fitur

**Halaman publik**

- Home: nama, foto, jabatan, tombol Download CV dan Contact Me
- About Me: biodata, pendidikan, sertifikasi, pengalaman, tujuan karier
- Skills per kategori (Frontend, Backend, Database, Tools)
- Projects: thumbnail, deskripsi, teknologi, link GitHub dan Live Demo, diambil dari database
- Contact: form dengan validasi, pesan tersimpan ke database, proteksi spam (rate limit dan honeypot)

**Dashboard admin** (`/admin`)

- Login dengan JWT
- Ringkasan: jumlah project dan pesan masuk
- CRUD project, termasuk upload thumbnail (JPG, PNG, WebP, maksimal 2 MB)
- Kelola pesan: filter belum dibaca, tandai dibaca, balas via email, hapus, pagination

**Kualitas**

- Dark mode dan light mode (pilihan tersimpan, tanpa kedipan saat load)
- Responsive untuk HP, tablet, dan desktop
- Animasi saat scroll (menghormati pengaturan reduce motion)
- SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt`, structured data (JSON-LD)
- Loading state (skeleton) dan error handling di seluruh halaman

## Tech Stack

| Bagian         | Teknologi                                                            |
| -------------- | -------------------------------------------------------------------- |
| Frontend       | Next.js (App Router), React, TypeScript, Tailwind CSS                |
| Backend        | Node.js, Express, TypeScript                                         |
| Database       | PostgreSQL                                                           |
| ORM            | Prisma 7 (driver adapter `pg`)                                       |
| Validasi       | Zod                                                                  |
| Autentikasi    | JWT, bcryptjs                                                        |
| Storage gambar | Supabase Storage                                                     |
| API Testing    | Postman                                                              |
| Deployment     | Vercel (frontend), Render (backend), Supabase (database dan storage) |

## Struktur Project

```
portfolio-fullstack/
├── client/                 # Frontend Next.js
│   └── src/
│       ├── app/            # Halaman: (site) publik, admin
│       ├── components/     # Komponen UI
│       ├── data/           # Konten profil (edit di profile.ts)
│       └── lib/            # Helper API, auth, tema, SEO
└── server/                 # Backend Express
    ├── prisma/             # Schema, migrasi, seed
    └── src/
        ├── routes/         # auth, projects, messages, uploads
        ├── middleware/     # auth JWT, validasi
        ├── schemas/        # Skema Zod
        └── lib/            # Prisma client, JWT, Supabase
```

## Menjalankan di Lokal

**Prasyarat:** Node.js 20.19 atau lebih baru, database PostgreSQL (lokal atau Supabase/Neon), dan bucket Supabase Storage untuk fitur upload.

### 1. Clone repo

```bash
git clone https://github.com/rizkilabs/portfolio-fullstack.git
cd portfolio-fullstack
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env     # lalu isi nilainya (lihat tabel di bawah)
npx prisma migrate dev
npx prisma db seed       # isi project contoh dan akun admin dari .env
npm run dev              # http://localhost:5000
```

### 3. Frontend

```bash
cd client
npm install
cp .env.example .env.local   # lalu isi nilainya
npm run dev                  # http://localhost:3000
```

Halaman admin ada di `http://localhost:3000/admin/login`, login memakai `ADMIN_EMAIL` dan `ADMIN_PASSWORD` dari `server/.env`.

## Environment Variable

**`server/.env`**

| Variable                                      | Keterangan                                                         |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `PORT`                                        | Port server (default 5000)                                         |
| `CLIENT_URL`                                  | Origin frontend untuk CORS, boleh beberapa dipisah koma            |
| `DATABASE_URL`                                | Connection string PostgreSQL                                       |
| `JWT_SECRET`                                  | Secret acak, minimal 32 karakter                                   |
| `JWT_EXPIRES_IN`                              | Masa berlaku token, misal `1d`                                     |
| `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` | Akun admin untuk seed (password minimal 12 karakter di production) |
| `SUPABASE_URL`                                | URL project Supabase                                               |
| `SUPABASE_SERVICE_ROLE_KEY`                   | Secret key Supabase, **hanya untuk backend**                       |
| `SUPABASE_BUCKET`                             | Nama bucket publik, default `project-images`                       |

**`client/.env.local`**

| Variable               | Keterangan                                           |
| ---------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | URL backend, misal `http://localhost:5000`           |
| `NEXT_PUBLIC_SITE_URL` | URL website, dipakai untuk SEO (sitemap, Open Graph) |

> Jangan pernah meng-commit file `.env`. Hanya `.env.example` yang masuk repo.

## API Endpoints

Base URL: `/api`. Endpoint bertanda 🔒 butuh header `Authorization: Bearer <token>`.

| Method | Endpoint                | Keterangan                                          |
| ------ | ----------------------- | --------------------------------------------------- |
| GET    | `/health`, `/health/db` | Cek server dan koneksi database                     |
| POST   | `/auth/login`           | Login admin, mengembalikan token JWT                |
| GET    | `/auth/me` 🔒           | Data admin yang sedang login                        |
| GET    | `/projects`             | Daftar project                                      |
| GET    | `/projects/:id`         | Detail project                                      |
| POST   | `/projects` 🔒          | Tambah project                                      |
| PUT    | `/projects/:id` 🔒      | Ubah project                                        |
| DELETE | `/projects/:id` 🔒      | Hapus project                                       |
| POST   | `/messages`             | Kirim pesan dari form Contact                       |
| GET    | `/messages` 🔒          | Daftar pesan (`?page=`, `?limit=`, `?isRead=`)      |
| GET    | `/messages/:id` 🔒      | Detail pesan                                        |
| PATCH  | `/messages/:id` 🔒      | Tandai dibaca atau belum dibaca                     |
| DELETE | `/messages/:id` 🔒      | Hapus pesan                                         |
| POST   | `/uploads` 🔒           | Upload gambar (`multipart/form-data`, field `file`) |

## Keamanan

- Password di-hash dengan bcrypt, token JWT dengan masa berlaku
- Validasi input di backend dengan Zod (frontend hanya untuk kenyamanan)
- Rate limit pada login dan pengiriman pesan, honeypot untuk bot
- Upload gambar divalidasi dari isi file (bukan hanya ekstensi), nama file diacak
- Header keamanan lewat Helmet, CORS dibatasi ke origin frontend
- Halaman `/admin` tidak diindeks mesin pencari

## Deployment

1. **Database dan storage:** buat project Supabase, lalu pakai _Session pooler_ (port 5432) sebagai `DATABASE_URL`. Buat bucket publik `project-images`.
2. **Backend:** deploy folder `server` ke Render (Root Directory `server`).
   - Build command: `npm install && npm run db:deploy && npm run db:seed-admin`
   - Start command: `npm start`
   - Isi semua environment variable dari tabel di atas.
3. **Frontend:** deploy folder `client` ke Vercel (Root Directory `client`), isi `NEXT_PUBLIC_API_URL` dan `NEXT_PUBLIC_SITE_URL`.
4. Setelah URL frontend jadi, isi `CLIENT_URL` di backend dengan URL tersebut.

Setiap push ke branch `main` men-deploy ulang secara otomatis.

## Alur Kerja Git

Project dikerjakan bertahap: satu branch per fitur (`feature/...`), lalu Pull Request ke `main`.

## Penulis

**M. **, Full Stack Developer

- Portfolio: https://www.rizkiskey.vercel.app
- Email: rizkiskey@gmail.com
- GitHub: https://github.com/rizkilabs
