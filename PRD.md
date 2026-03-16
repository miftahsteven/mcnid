MCN.ID — Media Channel Network

Product Requirement Document
Version: 1.0

Owner: PT Mscode Inovasi Digital
Product: MCN.ID
Type: Islamic National News Portal

1. Product Overview
   MCN.ID adalah portal media digital yang menghadirkan berita nasional, opini keislaman, edukasi Islam, serta konten video yang berorientasi pada pemikiran dan gagasan KH Cholil Nafis, namun dikemas dalam bentuk media network (MCN) sehingga tidak langsung tampil sebagai website personal.
   Pendekatan ini bertujuan agar publik mengenal pemikiran KH Cholil Nafis melalui:

- berita
- opini
- diskursus intelektual
- video
- pembelajaran Islam
- konsultasi AI berbasis pemikiran beliau

Website ini akan menjadi media Islam nasional modern yang menghadirkan perspektif keislaman moderat terhadap isu nasional.

2. Product Vision
   Membangun portal media Islam nasional modern yang:

- menyajikan berita aktual
- menyebarkan pemikiran Islam moderat
- menjadi pusat edukasi Islam digital
- menjadi kanal media resmi jaringan pemikiran KH Cholil Nafis

3. Target Audience
   Primary Audience:

- Muslim usia 20 — 50 tahun
- Akademisi
- Mahasiswa
- Profesional
- Aktivis organisasi Islam
- Pengamat sosial dan keislaman

Secondary Audience:

- Masyarakat umum yang mencari perspektif Islam terhadap isu nasional

4. Content Composition Strategy
   Komposisi konten di MCN.ID:

Content Type | Percentage
Konten tentang KH Cholil Nafis | 60%
Konten umum keislaman & nasional | 40%
Jenis konten meliputi:

- Berita kegiatan
- Artikel opini
- Analisis keislaman
- Video ceramah
- Diskusi keislaman
- Opini tokoh lain yang sejalan secara pemikiran

5. Platform Architecture
   Sistem terdiri dari 2 layer utama

MCN Platform
│
├── Backend (API Layer)
│
└── Frontend (Web Portal)

6. Technology Stack
   Backend

Tetap menggunakan teknologi existing.

Stack:

- NodeJS
- Express / API Routes
- Prisma ORM
- PostgreSQL
- REST API
  Notes:
- Tidak ada perubahan struktur database
- Semua model existing tetap digunakan
- Backend dipisahkan dari frontend

Struktur baru:
mcn-platform/

backend/
src/
prisma/
routes/
controllers/
server.js

frontend/
admin-panel/
nextjs-app

Frontend
Framework:

- Next.js
- TailwindCSS
- Responsive Layout
  UI Library (optional):
- Shadcn UI
- Hero UI

Frontend akan dibangun ulang sepenuhnya dengan konsep portal berita nasional.

7. UI/UX Concept
   Konsep visual website:

"Modern Islamic News Portal"

Referensi style:

- detik.com
- metrotvnews.com
- tvone
- kompas

Karakter desain:

- Megah
- Editorial
- News-oriented
- Profesional

Color Palette

- Primary Color
- Deep Green
- Secondary Color
- Royal Purple
- Neutral

Dark Gray
Light Gray
White

Karakter warna:

- Hijau tidak dominan
- Lebih elegan
- Tidak terlihat seperti website organisasi

8. Website Structure
   Main Navigation
   Menu utama:

- Home
- Berita Update
- MCN Play
- Opini
- Konsultasi
- MCN Academy
- ZIS Network

9. Page Features
   Home Page

Homepage adalah portal news layout.

Struktur homepage:

- Hero Headline
- Breaking News
- Latest News
- Video Highlight
- Opini Terbaru
- Artikel Islam
- MCN Academy Highlight
- ZIS Campaign Highlight

LAYOUT:

- Headline News
- Grid Berita
- Sidebar
- Trending
- Video

Berita Update
Halaman ini menampilkan semua berita.

Filter:

- Nasional
- Keislaman
- Kegiatan
- Tokoh

Sort:

- terbaru
- populer

Layout:
News Grid
Pagination

MCN Play
MCN Play adalah halaman video portal.

Berisi:

- ceramah
- kegiatan
- diskusi
- wawancara

Video disimpan di server sendiri.

Tujuan:

- menghindari pencurian konten
- menjaga ownership konten

Format halaman:

- Video Highlight
- Video Grid
- Categories

Opini
Halaman artikel opini.

Isi konten:

- tulisan pengamat
- tulisan ulama
- tulisan akademisi
- tulisan KH Cholil Nafis

Layout:
Editorial Layout
Author Profile
Reading Time
Share Button

Konsultasi
Halaman konsultasi keislaman berbasis AI.
Bot bernama: "KI.AI"

KI.AI adalah AI yang dilatih dari:

- tulisan KH Cholil Nafis
- ceramah
- artikel
- fatwa
- kajian

User dapat bertanya seperti:
"Bagaimana pandangan KH Cholil Nafis tentang ekonomi Islam?"
"Apa hukumnya riba menurut KH Cholil Nafis?"
"Bagaimana cara menjaga keharmonisan beragama menurut KH Cholil Nafis?"
"Apa pandangan KH Cholil Nafis tentang Pancasila?"
"Bagaimana cara berdakwah yang efektif menurut KH Cholil Nafis?"

UI mirip:

- Google Search
  atau
- ChatGPT Interface

Flow:
User Question
→ KI.AI
→ LLM
→ Database Knowledge
→ Response

MCN Academy
MCN Academy adalah elearning platform.
Fitur:

- Kursus Islam
- Video Learning
- Kajian tematik
- Webinar

Flow:

- Banyak Pilihan Video kursus seperti Fiqh, Syariah, Akhlak, dll
- User Register
- User Login
- Pilih Kursus
- Video + Materi
- Quiz
- Sertifikat Digital

Course dapat:
Free dan Paid

Setiap course memiliki:

- price
- instructor
- duration
- lesson list

ZIS Network

Menu ini menampilkan program:
Semua Program yang diambil secara API Rest dari website amanahzakat.id. buatkan dulu secara dummy. Program ada photo dan ada caption text. dan ada tombol donasi. Saat tombol donasi di klik maka akan mengarah ke website amanahzakat.id

10. Content Types
    Jenis konten dalam sistem:

- News
- Video
- Opinion
- Course
- ZIS Program

Semua menggunakan backend existing.
Frontend hanya melakukan API consumption.

11. API Strategy
    Frontend hanya menggunakan API dari backend.
    Contoh:

GET /api/posts
GET /api/posts?type=news
GET /api/posts?type=video
GET /api/posts?type=opinion

Detail:
GET /api/posts/:slug

12. SEO Strategy
    SEO sangat penting karena website ini adalah portal berita.
    Optimasi:

- Structured Data
- Open Graph
- Sitemap
- Fast Loading
- SSR Next.js

13. Performance Target
    Target performance:

- TTFB < 500ms
- Page Load < 2s
- Lighthouse > 90

14. Security
    Security layer:

- Rate limit API
- Video protection
- CORS protection
- Token authentication (academy)

15. Future Roadmap
    Fitur yang dapat dikembangkan:
    Mobile App

- MCN Mobile

16. Success Metrics
    Parameter keberhasilan platform:

- Monthly Visitors
- Time on Site
- Article Read
- Video Watch Time
- Academy Enrollment
- ZIS Conversion

17. Project Goal
    MCN.ID diharapkan menjadi:
    "Media Islam Nasional Modern"

yang mampu:

- menyebarkan gagasan Islam moderat
- memperkenalkan pemikiran KH Cholil Nafis
- menjadi pusat edukasi Islam digital
