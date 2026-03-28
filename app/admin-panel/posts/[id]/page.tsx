"use client";
import { useState, useEffect, useRef } from "react";
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Type,
  Calendar,
  Clock,
  Layout,
  Tag,
  Plus,
  X,
  Search,
  Loader2,
  RefreshCw,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import FreeRichTextEditor from "@/components/admin/FreeRichTextEditor";

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string;
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    type: "NEWS",
    status: "DRAFT",
    author: "",
    tags: "",
    featuredImage: "",
    slug: "",
  });

  const [scheduleType, setScheduleType] = useState("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [isUnsplashOpen, setIsUnsplashOpen] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState<any[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah gambar");

      if (data.data?.url) {
        handleChange("featuredImage", data.data.url);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/posts/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setLoadError(`Gagal memuat (${res.status}): ${data.error || 'Unknown error'}`);
          return;
        }
        if (data.data) {
          const post = data.data;
          setForm({
            title: post.title || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            categoryId: post.categories?.[0]?.categoryId || "",
            type: post.type?.toUpperCase() || "NEWS",
            status: post.status || "DRAFT",
            author: post.customAuthor || "",
            tags:
              post.tags
                ?.map((t: any) => t.tag?.name)
                .filter(Boolean)
                .join(", ") || "",
            featuredImage: post.coverImage || "",
            slug: post.slug || "",
          });
          if (post.publishedAt) {
            const d = new Date(post.publishedAt);
            if (d > new Date()) {
              setScheduleType("schedule");
              setScheduledDate(d.toISOString().split("T")[0]);
              setScheduledTime(d.toISOString().split("T")[1].substring(0, 5));
            }
          }
        } else {
          setLoadError("Data artikel tidak ditemukan.");
        }
      })
      .catch((err) => {
        console.error(err);
        setLoadError(`Koneksi ke backend gagal: ${err.message}`);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (k: string, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setCategories([...categories, data.data]);
        handleChange("categoryId", data.data.id);
        setNewCatName("");
      } else {
        alert(
          data.error?.map
            ? data.error.map((e: any) => e.message).join(", ")
            : data.error,
        );
      }
    } catch (err) {
      console.error(err);
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

  const handleSyncSlug = () => {
    const newSlug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 80); // Limit to 80 chars for safety
    handleChange("slug", newSlug);
  };

  const handleSave = async (statusOverride?: string) => {
    if (!form.title) return alert("Judul artikel wajib diisi!");
    setIsSaving(true);
    try {
      let publishedAt = undefined;
      if (scheduleType === "schedule") {
        const today = new Date().toISOString().split("T")[0];
        const d = scheduledDate || today;
        if (scheduledTime) {
          publishedAt = new Date(`${d}T${scheduledTime}:00`).toISOString();
        } else if (scheduledDate) {
          publishedAt = new Date(`${d}T00:00:00`).toISOString();
        }
      }

      const payload = {
        title: form.title,
        slug: form.slug || `post-${Date.now()}`,
        content: form.content,
        excerpt: form.excerpt,
        coverImage: form.featuredImage,
        status: statusOverride || form.status,
        type: form.type.toUpperCase(),
        customAuthor: form.author,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        categoryId: form.categoryId || undefined,
        publishedAt,
      };

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error?.map
            ? data.error.map((e: any) => e.message).join(", ")
            : data.error || "Terjadi kesalahan",
        );

      alert("Perubahan berhasil disimpan!");
      window.location.href = "/admin-panel/posts";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 font-semibold mb-2">Gagal Memuat Artikel</div>
        <p className="text-gray-500 text-sm mb-4">{loadError}</p>
        <p className="text-xs text-gray-400">Pastikan konfigurasi <code>BACKEND_URL</code> di server sudah benar dan backend berjalan. Lihat panduan di <code>.env.production</code>.</p>
        <a href="/admin-panel/posts" className="mt-4 inline-block text-sm text-[#1a4731] hover:underline">← Kembali ke Daftar Berita</a>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Memuat data artikel...</div>;
  }

  return (
    <div className="space-y-5 relative">
      <div className="flex items-center gap-3">
        <Link
          href="/admin-panel/posts"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Edit Berita</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Edit konten dan pengaturan publikasi artikel
          </p>
        </div>
        <div className="flex items-center gap-2">
          {form.status === "PUBLISHED" && (
            <a
              href={`/berita/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Eye size={14} /> Lihat
            </a>
          )}
          <button
            onClick={() => handleSave("PUBLISHED")}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isSaving ? "Updating..." : "Perbarui"}
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
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full text-2xl font-bold font-serif border-0 outline-none text-gray-900 placeholder-gray-300"
              />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <textarea
                placeholder="Ringkasan/excerpt artikel (untuk preview di listing)..."
                value={form.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                rows={2}
                className="w-full text-sm text-gray-700 border-0 outline-none resize-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Content area */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[600px]">
            <FreeRichTextEditor
              content={form.content}
              setContent={(newContent: string) => handleChange("content", newContent)}
            />
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="xl:w-72 shrink-0 space-y-4">
          {/* Publish settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">Publikasi</h3>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]"
              >
                <option value="DRAFT">Draft</option>
                <option value="REVIEW">Butuh Review</option>
                <option value="PUBLISHED">Publikasikan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Waktu Posting
              </label>
              <div className="flex gap-3 mb-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    value="now"
                    checked={scheduleType === "now"}
                    onChange={() => setScheduleType("now")}
                    className="accent-[#1a4731]"
                  />
                  <span className="text-sm text-gray-700">Sekarang</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    value="schedule"
                    checked={scheduleType === "schedule"}
                    onChange={() => setScheduleType("schedule")}
                    className="accent-[#1a4731]"
                  />
                  <span className="text-sm text-gray-700">Schedule</span>
                </label>
              </div>
              {scheduleType === "schedule" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-[55%] text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#1a4731]"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-[45%] text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#1a4731]"
                  />
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-500">
                  URL Slug
                </label>
                <button
                  onClick={handleSyncSlug}
                  className="text-[10px] text-[#1a4731] hover:underline flex items-center gap-0.5"
                  title="Generate from title"
                >
                  <RefreshCw size={10} /> Sync
                </button>
              </div>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="url-slug-berita"
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731] font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Tipe Konten
              </label>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]"
              >
                <option value="HIGHLIGHT">Highlight</option>
                <option value="NEWS">Berita</option>
                <option value="OPINION">Opini</option>
                <option value="ARTICLE">Artikel</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Penulis
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Nama penulis..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleSave("DRAFT")}
                disabled={isSaving}
                className="flex-1 text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? "..." : "Simpan Draft"}
              </button>
              <button
                onClick={() => handleSave("PUBLISHED")}
                disabled={isSaving}
                className="flex-1 text-xs font-semibold bg-[#1a4731] text-white hover:bg-[#2d6b4a] py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isSaving && <Loader2 size={10} className="animate-spin" />}
                {isSaving ? "Proses..." : "Perbarui"}
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">Kategori</h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {categories.map((c: any) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={c.id}
                    checked={form.categoryId === c.id}
                    onChange={() => handleChange("categoryId", c.id)}
                    className="accent-[#1a4731]"
                  />
                  <span className="text-sm text-gray-700">{c.name}</span>
                </label>
              ))}
              {categories.length === 0 && (
                <p className="text-xs text-gray-400">Belum ada kategori</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
              <input
                type="text"
                placeholder="Kategori baru..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none"
              />
              <button
                onClick={handleAddCategory}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <h3 className="font-bold text-sm text-gray-900">Tags</h3>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="MUI, Islam, Moderasi..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]"
            />
            <p className="text-xs text-gray-400">Pisahkan dengan koma</p>
          </div>

          {/* Featured image */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <h3 className="font-bold text-sm text-gray-900">Gambar Utama</h3>
            {form.featuredImage ? (
              <div className="relative rounded-xl overflow-hidden aspect-video border border-gray-200">
                <img
                  src={form.featuredImage}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleChange("featuredImage", "")}
                  className="absolute top-1.5 right-1.5 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                >
                  <X size={14} className="text-gray-600" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1a4731] hover:bg-green-50 transition-all relative"
              >
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={28} className="text-[#1a4731] animate-spin" />
                    <span className="text-xs text-gray-500 font-medium">Mengunggah...</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={28} className="text-gray-300" />
                    <span className="text-xs text-gray-400 font-medium">
                      Klik untuk upload gambar
                    </span>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={() => setIsUnsplashOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold border border-gray-200 text-gray-700 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search size={14} /> Cari di Unsplash
            </button>
            <input
              type="url"
              value={form.featuredImage}
              onChange={(e) => handleChange("featuredImage", e.target.value)}
              placeholder="Atau masukkan URL gambar..."
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]"
            />
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
                  placeholder="Contoh: mosque, nature, meeting..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a4731]"
                />
                <button
                  type="submit"
                  disabled={isSearchingUnsplash}
                  className="bg-[#1a4731] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2d6b4a] disabled:opacity-50"
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
                        handleChange("featuredImage", img.urls.regular);
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
