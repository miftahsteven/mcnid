"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Play,
  Edit,
  Trash2,
  EyeOff,
  Globe,
  Star,
  RefreshCcw,
  Youtube,
  UploadCloud,
  X,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.locale("id");

interface Video {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sourceType: string;
  videoUrl: string | null;
  coverImage: string | null;
  duration: string | null;
  isHighlight: boolean;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  author: { name: string };
  categories: { category: { name: string } }[];
}

const getImageUrl = (coverImage: string | null) => {
  if (!coverImage) return "/placeholder-video.jpg"; // Placeholder if no cover
  if (coverImage.startsWith("http")) return coverImage;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${coverImage}`;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isScraping, setIsScraping] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/videos", { cache: "no-store" });
      const data = await res.json();
      setVideos(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleScrape = async () => {
    if (!confirm("Buka koneksi untuk menarik video terbaru dari YouTube? Proses ini mungkin membutuhkan waktu beberapa saat.")) return;
    try {
      setIsScraping(true);
      const res = await fetch("/api/admin/scraper/play-run", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Gagal menarik video");
      alert(json.message);
      fetchVideos();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsScraping(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus video "${title}" secara permanen?`)) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Gagal menghapus");
      }
      setVideos(videos.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUnpublish = async (id: string) => {
    if (!confirm(`Turunkan (Unpublish) video ini ke Draft?`)) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DRAFT" }),
      });
      if (!res.ok) throw new Error("Gagal unpublish");
      fetchVideos();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Derive active categories from data
  const availableCategories = ["Semua", ...Array.from(new Set(videos.flatMap(v => v.categories.map(c => c.category.name))))];

  const filtered = videos.filter((v) => {
    const matchSearch =
      !search || v.title.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "Semua" ||
      v.categories.some((c) => c.category.name === activeCategory);
    return matchSearch && matchCat;
  });

  const getYoutubeId = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) return shortMatch[1];
    return null;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">MCN Play — Video</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {videos.length} total video
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVideos}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCcw size={16} />
          </button>
          <button
            onClick={handleScrape}
            disabled={isScraping}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {isScraping ? <Loader2 size={15} className="animate-spin" /> : <RefreshCcw size={15} />}
            Tarik Video
          </button>
          <Link
            href="/admin-panel/videos/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Tambah Video
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-40">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul video..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a4731]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {availableCategories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === c
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading videos...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          <Play size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">
            {search || activeCategory !== "Semua"
              ? "Tidak ada video yang cocok dengan pencarian"
              : "Belum ada video. Silakan tambah video baru."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all group flex flex-col"
            >
              <div 
                className="relative aspect-video overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => setSelectedVideo(vid)}
              >
                <img
                  src={getImageUrl(vid.coverImage)}
                  alt={vid.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play
                      size={18}
                      fill="#1a4731"
                      className="text-[#1a4731] ml-1"
                    />
                  </div>
                </div>

                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                  {vid.status === "PUBLISHED" ? (
                    <span className="bg-green-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <Globe size={10} /> Published
                    </span>
                  ) : (
                    <span className="bg-yellow-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      Draft
                    </span>
                  )}
                  {vid.isHighlight && (
                    <span className="bg-purple-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <Star size={10} fill="currentColor" /> Highlight
                    </span>
                  )}
                  {vid.sourceType === "YOUTUBE" ? (
                    <span className="bg-red-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <Youtube size={10} /> YT
                    </span>
                  ) : (
                    <span className="bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <UploadCloud size={10} /> Upload
                    </span>
                  )}
                </div>

                {vid.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded font-mono shadow-sm">
                    {vid.duration}
                  </span>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1 mb-2">
                  {vid.categories.map((c) => (
                    <span
                      key={c.category.name}
                      className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {c.category.name}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug flex-1">
                  {vid.title}
                </h3>
                
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 pb-3 border-b border-gray-100">
                  <span className="truncate">{vid.author.name}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="truncate">{dayjs(vid.createdAt).fromNow()}</span>
                </div>
                
                <div className="flex items-center justify-between gap-2 mt-3">
                  <Link
                    href={`/admin-panel/videos/${vid.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg transition-colors border border-blue-100"
                  >
                    <Edit size={13} /> Edit
                  </Link>
                  
                  {vid.status === "PUBLISHED" ? (
                    <button
                      onClick={() => handleUnpublish(vid.id)}
                      title="Unpublish"
                      className="p-1.5 text-orange-500 hover:bg-orange-50 border border-transparent hover:border-orange-100 rounded-lg transition-colors"
                    >
                      <EyeOff size={14} />
                    </button>
                  ) : (
                    <div className="w-[30px]" /> // Spacer
                  )}
                  
                  <button
                    onClick={() => handleDelete(vid.id, vid.title)}
                    title="Hapus"
                    className="p-1.5 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] md:h-[80vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-[110] p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
              {/* Player Side */}
              <div className="w-full lg:w-2/3 bg-black relative flex items-center justify-center shrink-0 min-h-[40vh] lg:min-h-0">
                {selectedVideo.sourceType === "YOUTUBE" ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.videoUrl)}?autoplay=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={getImageUrl(selectedVideo.videoUrl)} 
                    controls 
                    autoPlay 
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  />
                )}
              </div>

              {/* Info Side */}
              <div className="w-full lg:w-1/3 flex flex-col h-full bg-gray-50 border-l border-gray-200 overflow-hidden">
                {/* Header Info */}
                <div className="p-6 pb-4 border-b border-gray-100 bg-white shrink-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedVideo.categories.map((c) => (
                      <span
                        key={c.category.name}
                        className="text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-500 px-2.5 py-1 rounded"
                      >
                        {c.category.name}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3 line-clamp-3">
                    {selectedVideo.title}
                  </h2>

                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                        {selectedVideo.author.name.charAt(0)}
                     </div>
                     <div className="truncate">
                        <p className="text-xs font-bold text-gray-900 truncate">{selectedVideo.author.name}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{dayjs(selectedVideo.createdAt).format('DD MMMM YYYY')}</p>
                     </div>
                  </div>
                </div>

                {/* SCROLLABLE DESCRIPTION */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                   <div 
                      className="p-6 text-sm text-gray-600 prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                      dangerouslySetInnerHTML={{ __html: selectedVideo.description || "<i>Tidak ada deskripsi.</i>" }} 
                   />
                </div>

                {/* Footer Badges */}
                <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                   <div className="flex items-center gap-2">
                       {selectedVideo.sourceType === "YOUTUBE" ? <Youtube size={16} className="text-red-500" /> : <UploadCloud size={16} className="text-blue-500" />}
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{selectedVideo.sourceType}</span>
                   </div>
                   {selectedVideo.duration && (
                      <span className="text-xs font-mono font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                        {selectedVideo.duration}
                      </span>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

