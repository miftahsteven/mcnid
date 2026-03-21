"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Globe, GraduationCap, Loader2, Image as ImageIcon, X, BookMarked } from "lucide-react";
import dynamic from "next/dynamic";

const FreeRichTextEditor = dynamic(() => import("@/components/admin/FreeRichTextEditor"), { ssr: false });

const CATEGORIES = ["Umum", "Fiqh", "Aqidah", "Akhlak", "Syariah", "Quran", "Sirah", "Tasawuf"];
const LEVELS = ["Pemula", "Menengah", "Mahir"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "Umum", level: "Pemula",
    price: "0", durationHours: "", hasCertificate: false, coverImage: "", status: "DRAFT",
  });

  const handleChange = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/admin/courses/${id}`);
        const data = await res.json();
        if (data.data) {
          const c = data.data;
          setForm({
            title: c.title || "",
            description: c.description || "",
            category: c.category || "Umum",
            level: c.level || "Pemula",
            price: String(c.price ?? 0),
            durationHours: c.durationHours != null ? String(c.durationHours) : "",
            hasCertificate: c.hasCertificate || false,
            coverImage: c.coverImage || "",
            status: c.status || "DRAFT",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

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
    } catch { alert("Gagal upload cover"); }
    finally { setIsUploadingCover(false); }
  };

  const handleSave = async (status?: string) => {
    if (!form.title.trim()) { alert("Judul kursus wajib diisi."); return; }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: status || form.status, price: parseFloat(form.price) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      router.push("/admin-panel/courses");
    } catch (err: any) { alert(err.message); }
    finally { setIsSaving(false); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-purple-500" />
        <p className="text-sm text-gray-500">Memuat data kursus...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin-panel/courses" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{form.title || "Edit Kursus"}</h1>
            <p className="text-xs text-gray-400 mt-0.5">MCN Academy</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin-panel/courses/${id}/modules`}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors">
            <BookMarked size={14} /> Kelola Modul
          </Link>
          <button onClick={() => handleSave()} disabled={isSaving}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-60">
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2">Informasi Dasar</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Judul Kursus *</label>
              <input value={form.title} onChange={(e) => handleChange("title", e.target.value)}
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
                <label className="block text-xs font-semibold text-gray-600 mb-1">Harga (Rp)</label>
                <input type="number" min="0" value={form.price} onChange={(e) => handleChange("price", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Durasi (jam)</label>
                <input type="number" min="0" step="0.5" value={form.durationHours} onChange={(e) => handleChange("durationHours", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="cert" checked={form.hasCertificate} onChange={(e) => handleChange("hasCertificate", e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600" />
              <label htmlFor="cert" className="text-sm text-gray-700 font-medium cursor-pointer flex items-center gap-1.5">
                <GraduationCap size={15} className="text-purple-500" /> Kursus menyediakan Sertifikat
              </label>
            </div>
          </div>
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3">Deskripsi Kursus</h3>
            <div className="min-h-[400px]">
              <FreeRichTextEditor content={form.description}
                setContent={(val: string) => handleChange("description", val)} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
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
                {isUploadingCover ? <Loader2 size={24} className="animate-spin text-purple-400" /> : (
                  <><ImageIcon size={24} className="text-gray-300 mb-2" /><p className="text-xs text-gray-400">Upload Cover</p></>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={isUploadingCover} />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
