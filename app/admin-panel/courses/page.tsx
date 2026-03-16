'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Star, Users, Edit, Trash2, GraduationCap } from 'lucide-react';
import { courses, formatCurrency, formatNumber } from '@/lib/dummy-data';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const categories = ['Semua', 'Fiqh', 'Aqidah', 'Akhlak', 'Syariah', 'Quran', 'Sirah'];

  const filtered = courses.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Semua' || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">MCN Academy — Kursus</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} kursus aktif</p>
        </div>
        <Link href="/admin-panel/courses/new"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Tambah Kursus
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Kursus', value: courses.length, icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
          { label: 'Total Siswa', value: '35.8rb', icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Kursus Gratis', value: courses.filter(c => c.isFree).length, icon: Star, color: 'text-green-600 bg-green-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 font-serif">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kursus..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
        </div>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === c ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kursus</th>
              <th className="hidden md:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instruktur</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
              <th className="hidden sm:table-cell text-right px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Siswa</th>
              <th className="hidden lg:table-cell text-right px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                      <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs">{c.title}</p>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">{c.category}</span>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-3 py-3 text-xs text-gray-600">{c.instructor}</td>
                <td className="px-3 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isFree ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                    {c.isFree ? 'Gratis' : formatCurrency(c.price)}
                  </span>
                </td>
                <td className="hidden sm:table-cell px-3 py-3 text-xs text-gray-500 text-right">
                  <span className="flex items-center gap-1 justify-end"><Users size={11} />{formatNumber(c.students)}</span>
                </td>
                <td className="hidden lg:table-cell px-3 py-3 text-xs text-right">
                  <span className="flex items-center gap-1 justify-end text-yellow-500 font-semibold">⭐ {c.rating}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"><Edit size={14} /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
