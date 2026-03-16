'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Clock, Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { newsArticles, opinArticles, formatDate, formatNumber } from '@/lib/dummy-data';

const allArticles = [...newsArticles, ...opinArticles];
const categories = ['Semua', 'Nasional', 'Keislaman', 'Kegiatan', 'Tokoh'];
const sorts = ['Terbaru', 'Populer'];

function getCategoryColor(cat: string) {
  const map: Record<string, string> = {
    Nasional: 'bg-blue-600', Keislaman: 'bg-green-700', Kegiatan: 'bg-orange-500', Tokoh: 'bg-purple-600', Opini: 'bg-gray-700',
  };
  return map[cat] || 'bg-[#1a4731]';
}

const PER_PAGE = 6;

export default function BeritaPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeSort, setActiveSort] = useState('Terbaru');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  let filtered = allArticles.filter((a) => {
    const matchCat = activeCategory === 'Semua' || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (activeSort === 'Populer') {
    filtered = [...filtered].sort((a, b) => b.views - a.views);
  } else {
    filtered = [...filtered].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-[#0f2d1f] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-white font-bold text-3xl font-serif">Berita Update</h1>
          <p className="text-gray-300 text-sm mt-2">Berita nasional dan keislaman terkini dari MCN.ID</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari berita..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a4731]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === cat ? 'bg-[#1a4731] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Urutkan:</span>
            {sorts.map((s) => (
              <button
                key={s}
                onClick={() => { setActiveSort(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeSort === s ? 'border-[#1a4731] text-[#1a4731] bg-green-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-40" />
            <p>Tidak ada berita yang ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
            {paginated.map((article) => (
              <Link key={article.id} href={`/berita/${article.slug}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#1a4731]/25 card-hover hover:shadow-md transition-all">
                <div className="aspect-video overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <span className={`badge-primary ${getCategoryColor(article.category)}`}>{article.category}</span>
                  <h2 className="text-gray-900 font-bold text-sm leading-snug mt-2 line-clamp-2 group-hover:text-[#1a4731] transition-colors font-serif">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">{article.author}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-0.5"><Eye size={11} />{formatNumber(article.views)}</span>
                      <span className="flex items-center gap-0.5"><Clock size={11} />{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="page-btn disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`page-btn ${page === p ? 'active' : ''}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="page-btn disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
