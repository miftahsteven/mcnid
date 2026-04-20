import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpen, Eye, Clock, Share2 } from 'lucide-react';
import { opinArticles, formatDate, formatNumber } from '@/lib/dummy-data';
import { getPublicImageUrl } from '@/lib/backend-config';

export const metadata: Metadata = {
  title: 'Opini | MCNID.NET',
  description:
    'Perspektif dan gagasan dari ulama, akademisi, dan tokoh Islam Indonesia. Kolom opini moderat dari MCNID.NET.',
  alternates: {
    canonical: 'https://mcnid.net/opini',
  },
  openGraph: {
    title: 'Opini — Perspektif Islam Moderat | MCNID.NET',
    description:
      'Perspektif dan gagasan dari ulama, akademisi, dan tokoh Islam Indonesia.',
    url: 'https://mcnid.net/opini',
    siteName: 'MCNID.NET',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Opini | MCNID.NET',
    description:
      'Perspektif dan gagasan dari ulama, akademisi, dan tokoh Islam Indonesia.',
  },
};

// --- Types ---
interface OpiniPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  viewCount: number;
  customAuthor: string | null;
  author: { name: string; image: string | null };
  categories: { category: { name: string; slug: string } }[];
}

// Shape yang dipakai UI — sama dengan Article di dummy-data
interface OpiniArticle {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorRole: string;
  authorImage: string;
  publishedAt: string;
  readingTime: number;
  views: number;
}

// --- Fetch dari backend ---
async function fetchOpiniPosts(): Promise<OpiniArticle[]> {
  const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

  try {
    const res = await fetch(`${BACKEND_URL}/api/posts?type=OPINION`, {
      next: { revalidate: 60 }, // ISR: revalidate setiap 60 detik
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const json = await res.json();
    const posts: OpiniPost[] = json.data ?? [];

    if (posts.length === 0) return [];

    return posts.map((p) => {
      const authorName = p.customAuthor || p.author.name;
      const authorImage =
        p.author.image
          ? getPublicImageUrl(p.author.image)
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=4a2c82&color=fff`;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? '',
        image: p.coverImage ? getPublicImageUrl(p.coverImage) : '/placeholder-news.jpg',
        author: authorName,
        authorRole: p.categories[0]?.category.name ?? 'Penulis',
        authorImage,
        publishedAt: p.publishedAt ?? new Date().toISOString(),
        readingTime: 5, // tidak ada di schema, gunakan default
        views: p.viewCount,
      };
    });
  } catch (err) {
    console.warn('[OpiniPage] Gagal fetch dari backend, pakai dummy data:', err);
    return opinArticles as unknown as OpiniArticle[];
  }
}

export default async function OpiniPage() {
  // Ambil data dari backend; fallback ke dummy jika kosong / error
  const backendArticles = await fetchOpiniPosts();
  const articles: OpiniArticle[] = backendArticles.length > 0 ? backendArticles : (opinArticles as unknown as OpiniArticle[]);

  const featured = articles[0];
  const rest = articles.slice(1);

  // Guard: jika articles benar-benar kosong, tampilkan empty state
  if (!featured) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-[#311c58] to-[#4a2c82] py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-white font-bold text-3xl font-serif">Opini</h1>
            <p className="text-gray-200 text-sm mt-2">Perspektif dan gagasan dari ulama, akademisi, dan tokoh Islam Indonesia</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-400 text-lg">Belum ada article opini yang tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#311c58] to-[#4a2c82] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-white font-bold text-3xl font-serif">Opini</h1>
          <p className="text-gray-200 text-sm mt-2">Perspektif dan gagasan dari ulama, akademisi, dan tokoh Islam Indonesia</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Opinion */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="badge-secondary self-start mb-4">OPINI PILIHAN</span>
              <h2 className="text-gray-900 font-bold text-2xl leading-tight font-serif">{featured.title}</h2>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{featured.excerpt}</p>

              {/* Author block */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <img src={featured.authorImage} alt={featured.author} className="w-12 h-12 rounded-full border-2 border-[#4a2c82]/20" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{featured.author}</p>
                  <p className="text-gray-500 text-xs">{featured.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><BookOpen size={12} />{featured.readingTime} menit baca</span>
                <span className="flex items-center gap-1"><Eye size={12} />{formatNumber(featured.views)} dibaca</span>
                <span className="flex items-center gap-1"><Clock size={12} />{formatDate(featured.publishedAt)}</span>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <Link href={`/opini/${featured.slug}`} className="btn-secondary text-sm px-6 py-2.5 rounded-lg">
                  Baca Selengkapnya
                </Link>
                <button className="p-2.5 rounded-lg border border-gray-200 hover:border-[#4a2c82] hover:text-[#4a2c82] transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Opinion Grid */}
        <h2 className="font-bold text-xl text-gray-900 font-serif border-l-4 border-[#4a2c82] pl-3 mb-6">Opini Lainnya</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rest.map((art) => (
            <Link key={art.id} href={`/opini/${art.slug}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 card-hover hover:border-[#4a2c82]/30 shadow-sm">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
              </div>
              <div className="p-5">
                {/* Author */}
                <div className="flex items-center gap-2 mb-3">
                  <img src={art.authorImage} alt={art.author} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">{art.author}</p>
                    <p className="text-[10px] text-gray-500">{art.authorRole}</p>
                  </div>
                </div>
                <h3 className="text-gray-900 font-bold text-base leading-snug line-clamp-2 group-hover:text-[#4a2c82] transition-colors font-serif">
                  {art.title}
                </h3>
                <p className="text-gray-500 text-xs mt-2 line-clamp-3 leading-relaxed">{art.excerpt}</p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen size={11} />{art.readingTime} min</span>
                  <span className="flex items-center gap-1"><Eye size={11} />{formatNumber(art.views)}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{formatDate(art.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
