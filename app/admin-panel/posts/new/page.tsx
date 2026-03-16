'use client';
import { useState } from 'react';
import { ArrowLeft, Eye, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const categories = ['Nasional', 'Keislaman', 'Kegiatan', 'Tokoh', 'Ekonomi', 'Pendidikan', 'Internasional'];

export default function NewPostPage() {
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Nasional',
    type: 'news',
    status: 'draft',
    author: '',
    tags: '',
    featuredImage: '',
  });

  const handleChange = (k: string, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin-panel/posts" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Tambah Artikel Baru</h1>
          <p className="text-sm text-gray-500 mt-0.5">Buat dan publikasikan artikel berita atau opini</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => handleChange('status', 'published')}
            className="flex items-center gap-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Save size={14} /> Publikasikan
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* Main editor */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Judul artikel..."
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-2xl font-bold font-serif border-0 outline-none text-gray-900 placeholder-gray-300"
              />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <textarea
                placeholder="Ringkasan/excerpt artikel (untuk preview di listing)..."
                value={form.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={2}
                className="w-full text-sm text-gray-700 border-0 outline-none resize-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Content area */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              {['B', 'I', 'U', '—', 'H1', 'H2', '—', '"', '🔗', '📷'].map((btn, i) => (
                btn === '—' ? (
                  <span key={i} className="w-px h-4 bg-gray-200 mx-1"></span>
                ) : (
                  <button key={i} className="w-7 h-7 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    {btn}
                  </button>
                )
              ))}
            </div>
            <textarea
              placeholder="Tulis konten artikel di sini..."
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={20}
              className="w-full p-5 text-sm text-gray-700 border-0 outline-none resize-none placeholder-gray-300 leading-relaxed"
            />
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="xl:w-72 shrink-0 space-y-4">
          {/* Publish settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">Publikasi</h3>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
              <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]">
                <option value="draft">Draft</option>
                <option value="review">Butuh Review</option>
                <option value="published">Publikasikan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Tipe Konten</label>
              <select value={form.type} onChange={(e) => handleChange('type', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]">
                <option value="news">Berita</option>
                <option value="opinion">Opini</option>
                <option value="article">Artikel</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Penulis</label>
              <input type="text" value={form.author} onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Nama penulis..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]" />
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 py-2 rounded-lg transition-colors">
                Simpan Draft
              </button>
              <button className="flex-1 text-xs font-semibold bg-[#1a4731] text-white hover:bg-[#2d6b4a] py-2 rounded-lg transition-colors">
                Publikasikan
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">Kategori</h3>
            <div className="space-y-1.5">
              {categories.map((c) => (
                <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="category" value={c} checked={form.category === c}
                    onChange={() => handleChange('category', c)}
                    className="accent-[#1a4731]" />
                  <span className="text-sm text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <h3 className="font-bold text-sm text-gray-900">Tags</h3>
            <input type="text" value={form.tags} onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="MUI, Islam, Moderasi..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]" />
            <p className="text-xs text-gray-400">Pisahkan dengan koma</p>
          </div>

          {/* Featured image */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <h3 className="font-bold text-sm text-gray-900">Gambar Utama</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1a4731] hover:bg-green-50 transition-all">
              <ImageIcon size={28} className="text-gray-300" />
              <span className="text-xs text-gray-400 font-medium">Klik untuk upload gambar</span>
              <span className="text-[10px] text-gray-300">JPG, PNG, WebP (maks 5MB)</span>
            </div>
            <input type="url" value={form.featuredImage} onChange={(e) => handleChange('featuredImage', e.target.value)}
              placeholder="Atau masukkan URL gambar..." className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]" />
          </div>
        </div>
      </div>
    </div>
  );
}
