'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { newsArticles, opinArticles, formatDate, formatNumber } from '@/lib/dummy-data';

const allPosts = [
  ...newsArticles.map(a => ({ ...a, status: 'published' })),
  ...opinArticles.map(a => ({ ...a, status: 'published' })),
];

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  review: 'bg-yellow-100 text-yellow-700',
};

export default function PostsPage() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('Semua');

  const types = ['Semua', 'Berita', 'Opini'];

  const filtered = allPosts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === 'Semua' || (activeType === 'Opini' ? p.type === 'opinion' : p.type === 'news');
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allPosts.length} total artikel</p>
        </div>
        <Link href="/admin-panel/posts/new"
          className="flex items-center gap-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Tambah Baru
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a4731]" />
        </div>
        <div className="flex items-center gap-1">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeType === t ? 'bg-[#1a4731] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
          <Filter size={13} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="hidden md:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Penulis</th>
              <th className="hidden sm:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="hidden lg:table-cell text-right px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="hidden md:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                      <img src={post.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{post.type === 'opinion' ? 'Opini' : 'Berita'}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-3 py-3 text-xs text-gray-600">{post.author}</td>
                <td className="hidden sm:table-cell px-3 py-3">
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.category}</span>
                </td>
                <td className="hidden lg:table-cell px-3 py-3 text-xs text-gray-500 text-right">
                  <span className="flex items-center gap-1 justify-end"><Eye size={11} />{formatNumber(post.views)}</span>
                </td>
                <td className="px-3 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[post.status]}`}>
                    {post.status}
                  </span>
                </td>
                <td className="hidden md:table-cell px-3 py-3 text-xs text-gray-400">{formatDate(post.publishedAt)}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-500 transition-colors" title="View">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Tidak ada artikel ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
