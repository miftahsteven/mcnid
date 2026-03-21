"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Eye, Youtube, UploadCloud, Search, Image as ImageIcon, X, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import FreeRichTextEditor from "@/components/admin/FreeRichTextEditor";

export default function NewVideoPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    sourceType: "YOUTUBE",
    videoUrl: "",
    duration: "",
    coverImage: "",
    status: "DRAFT",
    isHighlight: false,
  });

  const [scheduleType, setScheduleType] = useState("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [isUnsplashOpen, setIsUnsplashOpen] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState<any[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch(console.error);
  }, []);

  const handleChange = (k: keyof typeof form, v: any) =>
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
      const accessKey = "tVlXb-n5I82_4k59Zxuov_aCnyPNWrDLoR_NmK6RPmw"; // Public restricted key
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          unsplashQuery
        )}&client_id=${accessKey}`
      );
      const data = await res.json();
      setUnsplashImages(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingUnsplash(false);
    }
  };

  const handleFetchYoutubeCover = async () => {
    if (!form.videoUrl.trim() || !form.videoUrl.includes("youtu")) {
      alert("Masukkan URL YouTube yang valid terlebih dahulu.");
      return;
    }
    try {
      const res = await fetch("/api/admin/videos/youtube-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.videoUrl }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        handleChange("coverImage", data.url);
      } else {
        alert(data.error || "Gagal menarik cover image dari YouTube");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat memproses permintaan.");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 500MB frontend check)
    if (file.size > 500 * 1024 * 1024) {
      setUploadError("Ukuran video melebihi batas 500MB");
      return;
    }

    setUploadError("");
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && response.data?.url) {
          // Success! Fastify backend stores full URL usually, let's keep it
          handleChange("videoUrl", response.data.url);
          setUploadProgress(100);
        } else {
          setUploadError(response.error || "Gagal upload video");
        }
      } catch (err) {
        setUploadError("Terjadi kesalahan respons server.");
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setUploadError("Koneksi terputus saat upload video.");
    };

    xhr.send(formData);
  };

  const handleSave = async (statusOverride?: string) => {
    if (!form.title) return alert("Judul video wajib diisi!");
    if (!form.videoUrl) return alert("Video (URL/File) wajib diisi!");
    
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
        slug:
          form.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `video-${Date.now()}`,
        description: form.description,
        sourceType: form.sourceType,
        videoUrl: form.videoUrl,
        duration: form.duration,
        coverImage: form.coverImage,
        isHighlight: form.isHighlight,
        status: statusOverride || form.status,
        categoryId: form.categoryId || undefined,
        publishedAt,
      };

      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error?.map
            ? data.error.map((e: any) => e.message).join(", ")
            : data.error || "Terjadi kesalahan"
        );

      alert("Video berhasil disimpan!");
      window.location.href = "/admin-panel/videos";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 relative">
      <div className="flex items-center gap-3">
        <Link
          href="/admin-panel/videos"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Tambah Video MCN Play</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Publikasikan video dari YouTube atau unggah file langsung.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            {isSaving ? "Menyimpan..." : "Publikasikan"}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* Main Form */}
        <div className="flex-1 space-y-4">
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-100 pb-2">Informasi Dasar</h3>
            <div>
              <input
                type="text"
                placeholder="Judul video..."
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full text-2xl font-bold font-serif border-0 outline-none text-gray-900 placeholder-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
              {/* Media Type Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 block">
                  Sumber Video
                </label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => {
                        handleChange("sourceType", "YOUTUBE");
                        handleChange("videoUrl", "");
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
                      form.sourceType === "YOUTUBE"
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Youtube size={14} className={form.sourceType === "YOUTUBE" ? "text-red-500" : ""} /> YouTube
                  </button>
                  <button
                    onClick={() => {
                        handleChange("sourceType", "UPLOAD");
                        handleChange("videoUrl", "");
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
                      form.sourceType === "UPLOAD"
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <UploadCloud size={14} className={form.sourceType === "UPLOAD" ? "text-blue-500" : ""} /> Upload Sendiri
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-semibold text-gray-500 block">
                  Durasi Video
                </label>
                <input
                    type="text"
                    placeholder="Contoh: 12:45"
                    value={form.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]"
                  />
                  <p className="text-[10px] text-gray-400">Diisi manual untuk keperluan SEO dan UI.</p>
              </div>
            </div>

            {/* Video Input Source */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
               {form.sourceType === "YOUTUBE" ? (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-900 block">URL Video YouTube</label>
                    <div className="flex gap-2">
                       <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={form.videoUrl}
                        onChange={(e) => handleChange("videoUrl", e.target.value)}
                        className="flex-1 text-sm border border-gray-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]"
                       />
                       <button 
                         onClick={handleFetchYoutubeCover}
                         className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                        >
                         Tarik Data Cover
                       </button>
                    </div>
                  </div>
               ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-900 block">Upload File Video</label>
                    {!form.videoUrl && !isUploading ? (
                      <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors bg-white">
                        <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm font-semibold text-gray-700">Pilih file video MP4/WebM</p>
                        <p className="text-xs text-gray-400 mt-1">Maksimal resolusi 4K (Max 500MB)</p>
                        <input 
                           type="file" 
                           ref={fileInputRef} 
                           className="hidden" 
                           accept="video/mp4,video/webm,video/quicktime"
                           onChange={handleVideoUpload}
                        />
                      </div>
                    ) : isUploading ? (
                       <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex justify-between text-sm mb-1 font-semibold text-gray-700">
                             <span>Mengunggah Video...</span>
                             <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                             <div className="bg-[#1a4731] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                       </div>
                    ) : (
                       <div className="bg-white rounded-xl border border-green-200 p-4 flex justify-between items-center bg-green-50">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex justify-center items-center">
                                <Play size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-green-900">Video Berhasil Diunggah</p>
                                <p className="text-xs text-green-700 truncate max-w-[200px] sm:max-w-md">{form.videoUrl}</p>
                             </div>
                          </div>
                          <button onClick={() => handleChange("videoUrl", "")} className="text-xs text-red-500 font-bold hover:underline">
                             Hapus & Ganti
                          </button>
                       </div>
                    )}
                    {uploadError && <p className="text-xs text-red-500 font-semibold">{uploadError}</p>}
                  </div>
               )}
            </div>
            
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
             <h3 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-100 pb-2">Deskripsi Video</h3>
            {/* Description area */}
            <div className="rounded-xl overflow-hidden min-h-[400px]">
              <FreeRichTextEditor
                content={form.description}
                setContent={(newContent: string) => handleChange("description", newContent)}
              />
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="xl:w-72 shrink-0 space-y-4">

          {/* Publikasi */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">Publikasi</h3>
            
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100 mt-2">
               <input 
                 type="checkbox" 
                 id="isHighlight" 
                 checked={form.isHighlight} 
                 onChange={(e) => handleChange("isHighlight", e.target.checked)}
                 className="accent-purple-600 w-4 h-4 rounded cursor-pointer"
               />
               <label htmlFor="isHighlight" className="text-xs font-bold text-purple-900 cursor-pointer">
                 Jadikan Highlight
               </label>
            </div>

            <div className="mt-3">
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
                  <span className="text-sm text-gray-700">Terjadwal</span>
                </label>
              </div>
              {scheduleType === "schedule" && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">Cover Video</h3>
            </div>
            {form.coverImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden group">
                <img
                  src={
                    form.coverImage.startsWith("http")
                      ? form.coverImage
                      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${form.coverImage}`
                  }
                  alt="Cover Image"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleChange("coverImage", "")}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsUnsplashOpen(true)}
              >
                <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-xs font-semibold text-gray-600 block">
                  Cari Gambar Cover 
                </span>
                <span className="text-[10px] text-gray-400 mt-1 block px-2">
                   Atau gunakan tombol Tarik Data URL untuk cover YT otomatis.
                </span>
              </div>
            )}
          </div>

          {/* Categories */}
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
                  <span className="text-sm text-gray-600">{c.name}</span>
                </label>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Kategori baru"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-[#1a4731]"
              />
              <button
                onClick={handleAddCategory}
                className="px-2 py-1.5 text-xs font-semibold text-[#1a4731] hover:bg-[#1a4731]/10 rounded-md transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unsplash Modal */}
      {isUnsplashOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-gray-400" /> Pilih dari
                Unsplash
              </h3>
              <button
                onClick={() => setIsUnsplashOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto min-h-0">
              <form onSubmit={handleUnsplashSearch} className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Cari gambar (contoh: podcast, lecture, mosque)..."
                    value={unsplashQuery}
                    onChange={(e) => setUnsplashQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a4731]"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingUnsplash}
                  className="px-4 py-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  {isSearchingUnsplash ? "Mencari..." : "Cari"}
                </button>
              </form>

              {unsplashImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {unsplashImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer border border-gray-100"
                      onClick={() => {
                        handleChange("coverImage", img.urls.regular);
                        setIsUnsplashOpen(false);
                      }}
                    >
                      <img
                        src={img.urls.small}
                        alt={img.alt_description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <ImageIcon size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">
                    {unsplashQuery
                      ? "Gagal menemukan gambar"
                      : "Mulai pencarian di atas untuk melihat foto"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
