'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Play, Edit, Trash2, Eye } from 'lucide-react';
import { videos, formatNumber } from '@/lib/dummy-data';

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const categories = ['Semua', 'Ceramah', 'Diskusi', 'Wawancara', 'Kegiatan'];

  const filtered = videos.filter((v) => {
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Semua' || v.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">MCN Play — Video</h1>
          <p className="text-sm text-gray-500 mt-0.5">{videos.length} total video</p>
        </div>
        <Link href="/admin-panel/videos/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Upload Video
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari video..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a4731]" />
        </div>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === c ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vid) => (
          <div key={vid.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all group">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Play size={18} fill="#1a4731" className="text-[#1a4731] ml-1" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {vid.duration}
              </span>
              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {vid.category}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{vid.title}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Eye size={11} />{formatNumber(vid.views)}</span>
                <span>{vid.publishedAt}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg transition-colors">
                  <Edit size={13} /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition-colors">
                  <Trash2 size={13} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          <Play size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Tidak ada video ditemukan</p>
        </div>
      )}
    </div>
  );
}
