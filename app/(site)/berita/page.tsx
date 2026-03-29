"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Eye, ChevronLeft, ChevronRight, Search, Calendar, Filter, X } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

interface IndeksItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  categorySlug: string;
  publishedAt: string;
  type: "post" | "video";
  views: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

import { getPublicImageUrl } from "@/lib/backend-config";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const categories = ["Semua", "Nasional", "Keislaman", "Kegiatan", "Tokoh", "MCN Play"];

function IndeksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState<IndeksItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  // States based on search params
  const activeCategory = searchParams.get("kategori") || "Semua";
  const activeDate = searchParams.get("tanggal") || "";
  const searchQuery = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("p") || "1");

  const [tempSearch, setTempSearch] = useState(searchQuery);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "Semua") params.append("kategori", activeCategory);
      if (activeDate) params.append("tanggal", activeDate);
      if (searchQuery) params.append("q", searchQuery);
      params.append("page", page.toString());
      params.append("limit", "20");

      const res = await fetch(`${API_URL}/api/indeks?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      const json = await res.json();
      if (json.data) {
        setItems(json.data);
        setPagination(json.pagination);
      }
    } catch (error: any) {
      console.error("Error fetching indeks:", error);
      setError(error.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchItems();
  }, [activeCategory, activeDate, searchQuery, page]);

  const updateParams = (newParams: Record<string, string | number | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "" || value === "Semua") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value.toString());
      }
    });
    // Reset page on filter change
    if (!newParams.p) nextParams.delete("p");
    
    router.push(`/berita?${nextParams.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: tempSearch });
  };

  const clearFilters = () => {
    setTempSearch("");
    router.push("/berita");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-[#0f2d1f] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-white font-bold text-4xl font-serif tracking-tight">
                Indeks Berita & Video
              </h1>
              <p className="text-green-200/70 text-base mt-3 max-w-2xl">
                Telusuri arsip berita nasional, konten keislaman, dan video eksklusif MCN Play secara lengkap.
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 w-fit">
              <Calendar size={14} className="text-green-400" />
              <span>{dayjs().format("dddd, D MMMM YYYY")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Advanced Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-6 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            
            {/* Search Input */}
            <div className="lg:col-span-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pencarian</label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                  placeholder="Cari judul atau topik..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all"
                />
              </form>
            </div>

            {/* Date Input */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tanggal Berita</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={activeDate}
                  onChange={(e) => updateParams({ tanggal: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all uppercase text-sm"
                />
              </div>
            </div>

            {/* Category Piling */}
            <div className="lg:col-span-5 flex flex-col">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParams({ kategori: cat })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      activeCategory === cat 
                      ? "bg-[#1a4731] text-white border-[#1a4731] shadow-lg shadow-green-900/20" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {(activeCategory !== "Semua" || activeDate || searchQuery) && (
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <X size={14} /> Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="mb-12">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border-b border-gray-100 animate-pulse">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-1">Koneksi Gagal</h3>
              <p className="text-red-600 text-sm max-w-sm mx-auto mb-6">{error}</p>
              <button 
                onClick={() => fetchItems()}
                className="bg-[#1a4731] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#123524] transition-all"
              >
                Coba Lagi
              </button>
            </div>
          ) : items.length === 0 ? (

            <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-3xl">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Data tidak ditemukan</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Kami tidak dapat menemukan berita atau video dengan kriteria yang Anda cari.</p>
              <button 
                onClick={clearFilters}
                className="mt-6 font-bold text-[#1a4731] hover:underline"
              >
                Lihat Semua Berita
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden shadow-sm">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/${item.type === "video" ? "mcn-play" : "berita"}/${item.slug}`}
                  className="group flex flex-col sm:flex-row gap-4 p-5 hover:bg-gray-50 transition-all items-center sm:items-start"
                >
                  {/* Small Image Overlay Design */}
                  <div className="relative w-full sm:w-40 md:w-48 aspect-video sm:aspect-square md:aspect-video rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img
                      src={getPublicImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        item.type === "video" ? "bg-red-100 text-red-700" : "bg-green-100 text-[#1a4731]"
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {item.type === "video" ? "MCN Play" : "Berita"}
                      </span>
                    </div>
                    
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#1a4731] transition-colors leading-tight mb-3 font-serif">
                      {item.title}
                    </h2>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mt-auto">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {dayjs(item.publishedAt).format("D MMMM YYYY")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-gray-400" />
                        {dayjs(item.publishedAt).format("HH:mm")} WIB
                      </span>
                      {item.views > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Eye size={13} className="text-gray-400" />
                          {item.views.toLocaleString()} View
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center justify-center self-stretch pr-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <ChevronRight className="text-[#1a4731]" size={24} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pb-20">
            <button
              onClick={() => updateParams({ p: page - 1 })}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-600 hover:border-[#1a4731] hover:text-[#1a4731] disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination!.totalPages || (p >= page - 1 && p <= page + 1))
                .map((p, i, arr) => (
                  <div key={p} className="flex items-center gap-2">
                    {i > 0 && arr[i-1] !== p - 1 && <span className="text-gray-400">...</span>}
                    <button
                      onClick={() => updateParams({ p })}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all border ${
                        page === p 
                        ? "bg-[#1a4731] text-white border-[#1a4731] shadow-lg shadow-green-900/10" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#1a4731] hover:text-[#1a4731]"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                ))
              }
            </div>

            <button
              onClick={() => updateParams({ p: page + 1 })}
              disabled={page === pagination.totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-600 hover:border-[#1a4731] hover:text-[#1a4731] disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BeritaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a4731]"></div>
      </div>
    }>
      <IndeksContent />
    </Suspense>
  );
}
