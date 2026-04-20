// MCN.ID Dummy Data

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  authorImage: string;
  image: string;
  publishedAt: string;
  readingTime: number;
  views: number;
  type: "news" | "opinion" | "article";
}

export interface Video {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  views: number;
  publishedAt: string;
  videoUrl: string;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  instructorRole: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  category: string;
  duration: string;
  lessons: number;
  rating: number;
  students: number;
}

export interface ZISProgram {
  id: number;
  title: string;
  description: string;
  image: string;
  target: number;
  collected: number;
  category: string;
}

// --- NEWS ARTICLES ---
export const newsArticles: Article[] = [
  {
    id: 1,
    slug: "kh-cholil-nafis-rapat-koordinasi-mui-nasional",
    title:
      "KH Cholil Nafis Pimpin Rapat Koordinasi MUI Nasional Bahas Isu Kebangsaan",
    excerpt:
      "Ketua Komisi Dakwah MUI Pusat KH Cholil Nafis memimpin rapat koordinasi nasional yang membahas berbagai isu kebangsaan dan keislaman terkini di Indonesia.",
    content: "",
    category: "Kegiatan",
    author: "Tim Redaksi MCN",
    authorRole: "Editor",
    authorImage:
      "https://ui-avatars.com/api/?name=Tim+Redaksi&background=1a4731&color=fff",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    publishedAt: "2026-03-16T09:00:00Z",
    readingTime: 4,
    views: 12540,
    type: "news",
  },
  {
    id: 2,
    slug: "fatwa-mui-investasi-kripto-dalam-perspektif-syariah",
    title: "Fatwa MUI Terbaru: Investasi Kripto dalam Perspektif Syariah Islam",
    excerpt:
      "MUI mengeluarkan fatwa terbaru mengenai hukum investasi aset kripto dalam tinjauan syariah Islam, menegaskan beberapa kategori yang diperbolehkan dan dilarang.",
    content: "",
    category: "Keislaman",
    author: "Ahmad Fauzi",
    authorRole: "Analis Ekonomi Islam",
    authorImage:
      "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=4a2c82&color=fff",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    publishedAt: "2026-03-15T14:30:00Z",
    readingTime: 6,
    views: 8920,
    type: "news",
  },
  {
    id: 3,
    slug: "moderasi-beragama-fondasi-kesatuan-indonesia",
    title:
      "Moderasi Beragama Jadi Fondasi Utama Kesatuan Indonesia di Era Digital",
    excerpt:
      "Diskusi nasional tentang pentingnya moderasi beragama sebagai pilar utama menjaga kesatuan Indonesia di tengah arus informasi digital yang massif.",
    content: "",
    category: "Nasional",
    author: "Siti Rahmawati",
    authorRole: "Wartawan Senior",
    authorImage:
      "https://ui-avatars.com/api/?name=Siti+Rahmawati&background=1a4731&color=fff",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
    publishedAt: "2026-03-15T10:00:00Z",
    readingTime: 5,
    views: 7650,
    type: "news",
  },
  {
    id: 4,
    slug: "pesantren-digital-solusi-pendidikan-islam-abad-21",
    title: "Pesantren Digital: Solusi Pendidikan Islam untuk Generasi Abad 21",
    excerpt:
      "Transformasi pesantren menuju era digital membuka peluang baru dalam pendidikan Islam yang inklusif dan menjangkau seluruh pelosok Indonesia.",
    content: "",
    category: "Keislaman",
    author: "Dr. Muhamad Aziz",
    authorRole: "Pengamat Pendidikan Islam",
    authorImage:
      "https://ui-avatars.com/api/?name=Muhamad+Aziz&background=4a2c82&color=fff",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    publishedAt: "2026-03-14T16:00:00Z",
    readingTime: 7,
    views: 6340,
    type: "news",
  },
  {
    id: 5,
    slug: "rapat-dengar-pendapat-dpr-pengesahan-uu-pesantren",
    title: "DPR Gelar Rapat Dengar Pendapat Bahas Revisi UU Pesantren",
    excerpt:
      "Komisi VIII DPR RI mengadakan rapat dengar pendapat dengan berbagai pihak terkait rencana revisi Undang-Undang tentang Pondok Pesantren.",
    content: "",
    category: "Nasional",
    author: "Budi Hartono",
    authorRole: "Koresponden DPR",
    authorImage:
      "https://ui-avatars.com/api/?name=Budi+Hartono&background=1a4731&color=fff",
    image:
      "https://images.unsplash.com/photo-1523875194681-bedd468c58bf?w=800&q=80",
    publishedAt: "2026-03-14T09:30:00Z",
    readingTime: 3,
    views: 5200,
    type: "news",
  },
  {
    id: 6,
    slug: "zakat-produktif-solusi-kemiskinan-umat",
    title: "Zakat Produktif Menjadi Solusi Nyata Pengentasan Kemiskinan Umat",
    excerpt:
      "Program zakat produktif yang dikelola secara profesional terbukti berhasil meningkatkan taraf hidup ribuan mustahik di berbagai wilayah Indonesia.",
    content: "",
    category: "Kegiatan",
    author: "Fatimah Zahra",
    authorRole: "Reporter ZIS",
    authorImage:
      "https://ui-avatars.com/api/?name=Fatimah+Zahra&background=c9a227&color=111",
    image:
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
    publishedAt: "2026-03-13T11:00:00Z",
    readingTime: 5,
    views: 4800,
    type: "news",
  },
  {
    id: 7,
    slug: "kh-cholil-nafis-ceramah-kebangsaan-untag",
    title:
      "KH Cholil Nafis Sampaikan Ceramah Kebangsaan di Universitas 17 Agustus",
    excerpt:
      "Dalam rangka memperkuat nasionalisme di kalangan mahasiswa, KH Cholil Nafis menyampaikan ceramah kebangsaan yang memadukan nilai Islam dan Pancasila.",
    content: "",
    category: "Tokoh",
    author: "Tim Redaksi MCN",
    authorRole: "Editor",
    authorImage:
      "https://ui-avatars.com/api/?name=Tim+Redaksi&background=1a4731&color=fff",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
    publishedAt: "2026-03-13T08:00:00Z",
    readingTime: 4,
    views: 9100,
    type: "news",
  },
  {
    id: 8,
    slug: "ekonomi-syariah-tumbuh-12-persen-2025",
    title:
      "Ekonomi Syariah Indonesia Tumbuh 12% di 2025, Terbesar di Asia Tenggara",
    excerpt:
      "Perkembangan industri keuangan syariah Indonesia mencatatkan rekor pertumbuhan 12% pada tahun 2025, menempatkan Indonesia sebagai pemimpin kawasan.",
    content: "",
    category: "Nasional",
    author: "Rizki Prayoga",
    authorRole: "Analis Ekonomi",
    authorImage:
      "https://ui-avatars.com/api/?name=Rizki+Prayoga&background=4a2c82&color=fff",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    publishedAt: "2026-03-12T13:00:00Z",
    readingTime: 6,
    views: 7300,
    type: "news",
  },
];

// --- OPINION ARTICLES ---
export const opinArticles: Article[] = [
  {
    id: 101,
    slug: "pancasila-dan-islam-bukan-pertentangan",
    title: "Pancasila dan Islam: Bukan Pertentangan, Melainkan Sinergi",
    excerpt:
      "Diskursus tentang hubungan Pancasila dan Islam sebenarnya sudah selesai dari awal bangsa ini berdiri. Keduanya bukan hanya kompatibel, tapi saling menguatkan.",
    content: "",
    category: "Opini",
    author: "KH Cholil Nafis",
    authorRole: "Ketua Komisi Dakwah MUI Pusat",
    authorImage:
      "https://ui-avatars.com/api/?name=KH+Cholil+Nafis&background=1a4731&color=fff",
    image:
      "https://suaramuslim.net/wp-content/uploads/2020/02/Islam-dan-Pancasila-1-1024x611.jpg",
    publishedAt: "2026-03-16T07:00:00Z",
    readingTime: 8,
    views: 14200,
    type: "opinion",
  },
  {
    id: 102,
    slug: "tantangan-dakwah-era-media-sosial",
    title:
      "Tantangan Dakwah di Era Media Sosial yang Penuh Hoaks dan Polarisasi",
    excerpt:
      "Para dai modern harus membekali diri bukan hanya dengan ilmu agama, tapi juga literasi digital untuk melawan arus hoaks dan narasi provokatif.",
    content: "",
    category: "Opini",
    author: "Prof. Dr. Azyumardi Azra",
    authorRole: "Guru Besar UIN Jakarta",
    authorImage:
      "https://ui-avatars.com/api/?name=Azyumardi+Azra&background=4a2c82&color=fff",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    publishedAt: "2026-03-15T08:00:00Z",
    readingTime: 9,
    views: 10800,
    type: "opinion",
  },
  {
    id: 103,
    slug: "membangun-peradaban-islam-dari-desa",
    title: "Membangun Peradaban Islam Dimulai dari Desa dan Pesantren",
    excerpt:
      "Peradaban Islam yang besar selalu lahir dari akar yang kuat. Di Indonesia, pesantren dan komunitas desa adalah fondasi utama yang perlu terus diperkuat.",
    content: "",
    category: "Opini",
    author: "Dr. Din Syamsuddin",
    authorRole: "Mantan Ketua PP Muhammadiyah",
    authorImage:
      "https://ui-avatars.com/api/?name=Din+Syamsuddin&background=c9a227&color=111",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    publishedAt: "2026-03-14T08:30:00Z",
    readingTime: 10,
    views: 8900,
    type: "opinion",
  },
  {
    id: 104,
    slug: "hukum-riba-perspektif-kontemporer",
    title: "Hukum Riba dalam Perspektif Kontemporer: Antara Teks dan Konteks",
    excerpt:
      "Pembahasan riba tidak bisa hanya tekstual semata. Dibutuhkan pendekatan kontekstual yang mempertimbangkan realitas ekonomi global saat ini.",
    content: "",
    category: "Opini",
    author: "KH Cholil Nafis",
    authorRole: "Ketua Komisi Dakwah MUI Pusat",
    authorImage:
      "https://ui-avatars.com/api/?name=KH+Cholil+Nafis&background=1a4731&color=fff",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
    publishedAt: "2026-03-13T09:00:00Z",
    readingTime: 12,
    views: 12000,
    type: "opinion",
  },
];

// --- VIDEOS ---
export const videos: Video[] = [
  {
    id: 1,
    slug: "ceramah-moderasi-islam-indonesia",
    title: "KH Cholil Nafis: Moderasi Islam sebagai Jalan Tengah Ummat",
    description:
      "Ceramah komprehensif tentang pentingnya moderasi Islam dalam konteks Indonesia yang majemuk.",
    thumbnail:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    duration: "45:32",
    category: "Ceramah",
    views: 52000,
    publishedAt: "2026-03-10",
    videoUrl: "#",
  },
  {
    id: 2,
    slug: "diskusi-ekonomi-syariah-indonesia",
    title: "Diskusi Panel: Ekonomi Syariah dan Masa Depan Ekonomi Indonesia",
    description:
      "Panel diskusi para ahli membahas potensi dan tantangan pengembangan ekonomi syariah.",
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    duration: "1:12:00",
    category: "Diskusi",
    views: 38000,
    publishedAt: "2026-03-08",
    videoUrl: "#",
  },
  {
    id: 3,
    slug: "wawancara-khusus-kh-cholil-nafis",
    title: "Wawancara Khusus: Visi KH Cholil Nafis untuk Islam Indonesia 2030",
    description:
      "Wawancara mendalam bersama KH Cholil Nafis tentang visi Islam Indonesia di masa depan.",
    thumbnail:
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&q=80",
    duration: "58:15",
    category: "Wawancara",
    views: 67000,
    publishedAt: "2026-03-05",
    videoUrl: "#",
  },
  {
    id: 4,
    slug: "kajian-tafsir-al-quran-kontemporer",
    title: "Kajian Tafsir Al-Qur'an Kontemporer: Menyikapi Isu Modern",
    description:
      "Seri kajian mendalam tentang tafsir Al-Quran dalam konteks kehidupan modern.",
    thumbnail:
      "https://images.unsplash.com/photo-1584036553516-bf83210aa16c?w=800&q=80",
    duration: "35:48",
    category: "Ceramah",
    views: 44000,
    publishedAt: "2026-03-03",
    videoUrl: "#",
  },
  {
    id: 5,
    slug: "kegiatan-pelantikan-pengurus-mui",
    title: "Dokumentasi: Pelantikan Pengurus MUI Periode 2025-2030",
    description:
      "Liputan lengkap acara pelantikan pengurus MUI Pusat periode 2025-2030.",
    thumbnail:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    duration: "28:10",
    category: "Kegiatan",
    views: 29000,
    publishedAt: "2026-02-28",
    videoUrl: "#",
  },
  {
    id: 6,
    slug: "diskusi-fiqh-milenial",
    title: "Fiqh Milenial: Menjawab Pertanyaan Islam Generasi Z",
    description:
      "Sesi diskusi interaktif menjawab pertanyaan-pertanyaan keagamaan dari generasi muda.",
    thumbnail:
      "https://images.unsplash.com/photo-1523875194681-bedd468c58bf?w=800&q=80",
    duration: "52:20",
    category: "Diskusi",
    views: 35000,
    publishedAt: "2026-02-25",
    videoUrl: "#",
  },
];

// --- COURSES ---
export const courses: Course[] = [
  {
    id: 1,
    slug: "ilmu-fiqh-dasar-lengkap",
    title: "Ilmu Fiqh Dasar: Panduan Ibadah Sehari-hari",
    description:
      "Kursus komprehensif tentang fiqh ibadah sehari-hari berdasarkan mazhab yang mu'tabar.",
    instructor: "KH Cholil Nafis",
    instructorRole: "Ketua Komisi Dakwah MUI Pusat",
    thumbnail:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80",
    price: 0,
    isFree: true,
    category: "Fiqh",
    duration: "12 jam",
    lessons: 24,
    rating: 4.9,
    students: 8420,
  },
  {
    id: 2,
    slug: "aqidah-islam-modern",
    title: "Aqidah Islam Modern: Memperkuat Fondasi Keimanan",
    description:
      "Membahas aqidah Islam secara mendalam dan kontekstual untuk menghadapi tantangan modernitas.",
    instructor: "Prof. Dr. Umar Shihab",
    instructorRole: "Guru Besar UIN Makassar",
    thumbnail:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&q=80",
    price: 199000,
    isFree: false,
    category: "Aqidah",
    duration: "18 jam",
    lessons: 36,
    rating: 4.8,
    students: 3150,
  },
  {
    id: 3,
    slug: "akhlak-tasawuf-kehidupan",
    title: "Akhlak & Tasawuf: Membangun Karakter Muslim Sejati",
    description:
      "Kursus tentang pembentukan akhlak mulia dan pendalaman tasawuf untuk kehidupan sehari-hari.",
    instructor: "Habib Husein Ja'far Al Hadar",
    instructorRole: "Dai & Penulis",
    thumbnail:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=80",
    price: 149000,
    isFree: false,
    category: "Akhlak",
    duration: "10 jam",
    lessons: 20,
    rating: 4.9,
    students: 5670,
  },
  {
    id: 4,
    slug: "ekonomi-syariah-praktis",
    title: "Ekonomi Syariah Praktis: Keuangan Halal di Era Modern",
    description:
      "Panduan praktis mengelola keuangan, investasi, dan bisnis sesuai prinsip syariah.",
    instructor: "Dr. Muhammad Cholil Nafis",
    instructorRole: "Analis Ekonomi Syariah",
    thumbnail:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80",
    price: 299000,
    isFree: false,
    category: "Syariah",
    duration: "15 jam",
    lessons: 30,
    rating: 4.7,
    students: 2890,
  },
  {
    id: 5,
    slug: "tahsin-al-quran-online",
    title: "Tahsin Al-Qur'an: Belajar Membaca dengan Tartil",
    description:
      "Program tahsin Al-Qur'an online dengan metode mudah dan menyenangkan bagi segala usia.",
    instructor: "Ust. Ali Zainal Abidin",
    instructorRole: "Hafizh Al-Quran",
    thumbnail:
      "https://images.unsplash.com/photo-1584036553516-bf83210aa16c?w=600&q=80",
    price: 0,
    isFree: true,
    category: "Quran",
    duration: "20 jam",
    lessons: 40,
    rating: 4.9,
    students: 12300,
  },
  {
    id: 6,
    slug: "sirah-nabawi-komprehensif",
    title: "Sirah Nabawi: Perjalanan Hidup Nabi Muhammad SAW",
    description:
      "Menelusuri perjalanan hidup Nabi Muhammad SAW secara komprehensif dan mengambil pelajaran.",
    instructor: "Dr. Ahsin Sakho Muhammad",
    instructorRole: "Sejarawan Islam",
    thumbnail:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    price: 99000,
    isFree: false,
    category: "Sirah",
    duration: "22 jam",
    lessons: 44,
    rating: 4.8,
    students: 4200,
  },
];

// --- ZIS PROGRAMS ---
export const zisPrograms: ZISProgram[] = [
  {
    id: 1,
    title: "Beasiswa Yatim Dhuafa 2026",
    description:
      "Program beasiswa komprehensif bagi anak yatim dan dhuafa berprestasi untuk mengakses pendidikan berkualitas.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
    target: 100000000,
    collected: 67000000,
    category: "Pendidikan",
  },
  {
    id: 2,
    title: "Wakaf Masjid Pelosok Indonesia",
    description:
      "Membangun dan merenovasi masjid di daerah terpencil agar masyarakat memiliki tempat ibadah yang layak.",
    image:
      "https://digital-api.dompetdhuafa.org/storage/content-image/EXnXWsNQvcGcBCpCMTwvpsl1zqCErtjnFd6zDjZc.jpg",
    target: 500000000,
    collected: 312000000,
    category: "Wakaf",
  },
  {
    id: 3,
    title: "Bantuan Kemanusiaan Gaza & Palestina",
    description:
      "Donasi kemanusiaan untuk saudara Muslim di Gaza dan Palestina yang membutuhkan bantuan mendesak.",
    image:
      "https://api.dtpeduli.org/assets/web/2024-10/memijarkan-harapan-di-tanah-palestina-1.jpg",
    target: 1000000000,
    collected: 845000000,
    category: "Kemanusiaan",
  },
  {
    id: 4,
    title: "Rumah Quran Nusantara",
    description:
      "Mendirikan rumah Quran di seluruh pelosok Indonesia untuk mencetak generasi hafizh yang berkualitas.",
    image:
      "https://images.unsplash.com/photo-1584036553516-bf83210aa16c?w=600&q=80",
    target: 250000000,
    collected: 178000000,
    category: "Pendidikan",
  },
  {
    id: 5,
    title: "Zakat Produktif untuk UMKM Muslim",
    description:
      "Program pengembangan UMKM berbasis syariah melalui penyaluran zakat produktif kepada mustahik potensial.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    target: 300000000,
    collected: 156000000,
    category: "Zakat",
  },
  {
    id: 6,
    title: "Ambulance Gratis untuk Dhuafa",
    description:
      "Pengadaan armada ambulance gratis untuk melayani masyarakat dhuafa yang membutuhkan layanan kesehatan darurat.",
    image:
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&q=80",
    target: 400000000,
    collected: 89000000,
    category: "Kesehatan",
  },
];

// --- BREAKING NEWS ---
export const breakingNews = [
  "KH Cholil Nafis: Umat Islam harus bersatu dalam menjaga persatuan bangsa",
  "MUI Pusat keluarkan fatwa terbaru tentang penggunaan teknologi AI dalam ibadah",
  "Indonesia jadi tuan rumah Konferensi Islam Internasional 2026 di Jakarta",
  "Program beasiswa MCN Academy berhasil luluskan 500 penghafal Quran",
  "KH Cholil Nafis hadiri forum G20 Religion mewakili ulama Indonesia",
];

// Utility: Format number
export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "jt";
  if (n >= 1000) return (n / 1000).toFixed(1) + "rb";
  return n.toString();
}

// Utility: Format date
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Utility: Format currency
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

// Utility: Calculate progress percentage
export function calcProgress(collected: number, target: number): number {
  return Math.min(Math.round((collected / target) * 100), 100);
}
