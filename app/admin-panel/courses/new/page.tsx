"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Globe, GraduationCap, Loader2, Image as ImageIcon, X, Search } from "lucide-react";
import dynamic from "next/dynamic";

const FreeRichTextEditor = dynamic(() => import("@/components/admin/FreeRichTextEditor"), { ssr: false });

const CATEGORIES = ["Umum", "Fiqh", "Aqidah", "Akhlak", "Syariah", "Quran", "Sirah", "Tasawuf"];
const LEVELS = ["Pemula", "Menengah", "Mahir"];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function NewCoursePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Umum",
    level: "Pemula",
    price: "0",
    durationHours: "",
    hasCertificate: false,
    coverImage: "",
    status: "DRAFT",
  });

  const [isUnsplashOpen, setIsUnsplashOpen] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState<any[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);

  const handleChange = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) handleChange("coverImage", data.url);
    } catch (err) {
      alert("Gagal upload cover");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleUnsplashSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsplashQuery.trim()) return;
    setIsSearchingUnsplash(true);
    try {
      const accessKey = "tVlXb-n5I82_4k59Zxuov_aCnyPNWrDLoR_NmK6RPmw";
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashQuery)}&client_id=${accessKey}`,
      );
      const data = await res.json();
      setUnsplashImages(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingUnsplash(false);
    }
  };

  const handleSave = async (status: string) => {
    if (!form.title.trim()) { alert("Judul kursus wajib diisi."); return; }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status, price: parseFloat(form.price) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      router.push(`/admin-panel/courses/${data.data.id}/modules`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin-panel/courses" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tambah Kursus Baru</h1>
            <p className="text-xs text-gray-400 mt-0.5">MCN Academy</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave("DRAFT")} disabled={isSaving}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-60">
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Simpan Draft
          </button>
          <button onClick={() => handleSave("PUBLISHED")} disabled={isSaving}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-60">
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Globe size={15} />}
            {isSaving ? "Menyimpan..." : "Publikasikan"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2">Informasi Dasar</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Judul Kursus *</label>
              <input value={form.title} onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Fiqh Ibadah: Panduan Lengkap"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
                <select value={form.category} onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Level</label>
                <select value={form.level} onChange={(e) => handleChange("level", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white">
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Harga (Rp, 0 = Gratis)</label>
                <input type="number" min="0" value={form.price} onChange={(e) => handleChange("price", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Durasi (jam)</label>
                <input type="number" min="0" step="0.5" value={form.durationHours} onChange={(e) => handleChange("durationHours", e.target.value)}
                  placeholder="e.g. 2.5"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="cert" checked={form.hasCertificate} onChange={(e) => handleChange("hasCertificate", e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600" />
              <label htmlFor="cert" className="text-sm text-gray-700 font-medium cursor-pointer flex items-center gap-1.5">
                <GraduationCap size={15} className="text-purple-500" /> Kursus ini menyediakan Sertifikat
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3">Deskripsi Kursus</h3>
            <div className="min-h-[400px]">
              <FreeRichTextEditor content={form.description}
                setContent={(val: string) => handleChange("description", val)}
                placeholder="Jelaskan apa yang akan dipelajari, prasyarat, dan manfaat kursus ini..." />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Cover Image */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3">Gambar Cover</h3>
            {form.coverImage ? (
              <div className="relative">
                <img src={form.coverImage.startsWith("http") ? form.coverImage : `${API_URL}${form.coverImage}`}
                  alt="cover" className="w-full aspect-video object-cover rounded-lg border border-gray-100" />
                <button onClick={() => handleChange("coverImage", "")}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 transition-colors">
                {isUploadingCover ? (
                  <Loader2 size={24} className="animate-spin text-purple-400" />
                ) : (
                  <>
                    <ImageIcon size={24} className="text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-medium">Upload Cover</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">PNG, JPG, WEBP</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={isUploadingCover} />
              </label>
            )}
            <button
              onClick={() => setIsUnsplashOpen(true)}
              className="w-full mt-3 flex items-center justify-center gap-2 text-xs font-semibold border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search size={14} /> Cari di Unsplash
            </button>
          </div>

          {/* Info */}
          <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
            <h4 className="text-xs font-bold text-purple-800 mb-2">📌 Langkah Selanjutnya</h4>
            <p className="text-xs text-purple-600 leading-relaxed">
              Setelah menyimpan, Anda akan diarahkan ke halaman <strong>Kelola Modul</strong> untuk menambahkan modul dan lesson ke kursus ini.
            </p>
          </div>
        </div>
      </div>

      {/* Unsplash Modal */}
      {isUnsplashOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">
                Cari Gambar (Unsplash)
              </h2>
              <button
                onClick={() => setIsUnsplashOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 border-b border-gray-100">
              <form onSubmit={handleUnsplashSearch} className="flex gap-2">
                <input
                  type="text"
                  value={unsplashQuery}
                  onChange={(e) => setUnsplashQuery(e.target.value)}
                  placeholder="Contoh: studies, quran, mosque, islamic..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isSearchingUnsplash}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSearchingUnsplash ? "Mencari..." : "Cari"}
                </button>
              </form>
            </div>
            <div className="p-4 overflow-y-auto flex-1 h-[400px]">
              {unsplashImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {unsplashImages.map((img: any) => (
                    <div
                      key={img.id}
                      onClick={() => {
                        handleChange("coverImage", img.urls.regular);
                        setIsUnsplashOpen(false);
                      }}
                      className="aspect-video relative rounded-lg overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={img.urls.small}
                        alt={img.alt_description || "Unsplash Image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <p className="absolute bottom-1 left-1.5 text-[10px] text-white opacity-0 group-hover:opacity-100 drop-shadow-md truncate w-[90%]">
                        By {img.user.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  {unsplashQuery
                    ? "Tidak ada hasil ditemukan"
                    : "Ketik kata kunci untuk mencari gambar"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
