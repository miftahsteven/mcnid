"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter, 
  Loader2, 
  X, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle,
  MoreVertical,
  Calendar,
  User,
  Share2,
  Tag
} from "lucide-react";

interface KiAiKnowledge {
  id: string;
  category: string;
  title: string | null;
  description: string | null;
  content: string;
  keywords: string | null;
  status: string;
  sharing: string;
  author: string | null;
  sourceLink: string | null;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ["Umum", "Fiqh", "Tauhid", "Akhlak", "Sejarah", "Syariat", "Sosial"];

export default function KiAiDataPage() {
  const [data, setData] = useState<KiAiKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<KiAiKnowledge> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ki-ai");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengambil data");
      setData(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data knowledge ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      const res = await fetch(`/api/admin/ki-ai/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal menghapus data");
      }
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOpenModal = (entry: Partial<KiAiKnowledge> | null = null) => {
    setCurrentEntry(entry || {
      category: "Umum",
      status: "PUBLISHED",
      sharing: "PUBLIC",
      author: "K.H. Cholil Nafis",
      content: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEntry?.content) {
      alert("Isi/Konten wajib diisi");
      return;
    }
    try {
      setSubmitting(true);
      const method = currentEntry.id ? "PUT" : "POST";
      const url = currentEntry.id ? `/api/admin/ki-ai/${currentEntry.id}` : "/api/admin/ki-ai";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentEntry),
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan data");
      
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = !search || 
      (item.title?.toLowerCase().includes(search.toLowerCase())) ||
      (item.content?.toLowerCase().includes(search.toLowerCase())) ||
      (item.category?.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "Semua" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge KI.AI</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manajemen database internal untuk jawaban AI seputar keislaman.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
        >
          <Plus size={18} /> Tambah Pengetahuan
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul, konten, atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {["Semua", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? "bg-[#1a4731] text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-3" size={40} />
            <p>Memuat data knowledge...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 px-6 text-red-500">
            <AlertCircle className="mx-auto mb-3" size={40} />
            <p className="font-semibold">{error}</p>
            <button onClick={fetchData} className="mt-4 text-sm underline text-gray-500">Coba lagi</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Topik / Judul</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Sharing</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Update Terakhir</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-gray-900 line-clamp-1">
                          {item.title || "Tanpa Judul"}
                        </span>
                        <span className="text-xs text-gray-400 line-clamp-1">{item.description || "Tidak ada deskripsi singkat"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${
                        item.status === "PUBLISHED" ? "text-green-600" : "text-amber-600"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.status === "PUBLISHED" ? "bg-green-500" : "bg-amber-500"}`} />
                        {item.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        item.sharing === "PUBLIC" ? "border-blue-200 text-blue-600 bg-blue-50" : "border-gray-200 text-gray-600 bg-gray-50"
                      }`}>
                        {item.sharing}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(item.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400">
                      <HelpCircle className="mx-auto mb-2 opacity-20" size={48} />
                      <p>Data tidak ditemukan.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {currentEntry?.id ? "Edit Knowledge" : "Tambah Knowledge Baru"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Top Row: Category & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kategori</label>
                  <select
                    value={currentEntry?.category}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                  <select
                    value={currentEntry?.status}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sharing</label>
                  <select
                    value={currentEntry?.sharing}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, sharing: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] outline-none"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="INTERNAL">Internal Only</option>
                  </select>
                </div>
              </div>

              {/* Title & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                    <HelpCircle size={12} /> Topik / Pertanyaan
                  </label>
                  <input
                    type="text"
                    value={currentEntry?.title || ""}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                    placeholder="Contoh: Hukum Shalat Jamak"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                    <Tag size={12} /> Keywords (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={currentEntry?.keywords || ""}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, keywords: e.target.value })}
                    placeholder="fiqh, shalat, musafir"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ringkasan / Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={currentEntry?.description || ""}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] outline-none resize-none"
                  placeholder="Penjelasan singkat mengenai topik ini..."
                />
              </div>

              {/* Main Content */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> Isi Pengetahuan / Jawaban Lengkap
                </label>
                <textarea
                  rows={8}
                  required
                  value={currentEntry?.content || ""}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] outline-none font-sans leading-relaxed"
                  placeholder="Tuliskan jawaban atau penjelasan ilmu syariat secara detail di sini..."
                />
                <p className="mt-1.5 text-[10px] text-gray-400 italic">* Konten ini akan dipelajari oleh AI untuk menjawab pertanyaan pengguna.</p>
              </div>

              {/* Author & Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                    <User size={12} /> Penulis / Narasumber
                  </label>
                  <input
                    type="text"
                    value={currentEntry?.author || ""}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#1a4731] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                    <Share2 size={12} /> Link Sumber (Opsional)
                  </label>
                  <input
                    type="text"
                    value={currentEntry?.sourceLink || ""}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, sourceLink: e.target.value })}
                    placeholder="https://cholilnafis.id/..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#1a4731] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-8 py-2.5 bg-[#1a4731] hover:bg-[#2d6b4a] disabled:opacity-50 text-white rounded-lg font-semibold shadow-lg shadow-green-900/10 transition-all"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
