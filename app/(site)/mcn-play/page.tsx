"use client";
import { useState } from "react";
import Link from "next/link";
import { Play, Eye, Clock } from "lucide-react";
import { videos, formatNumber } from "@/lib/dummy-data";

const categories = ["Semua", "Ceramah", "Diskusi", "Wawancara", "Kegiatan"];

export default function MCNPlayPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [playing, setPlaying] = useState<number | null>(null);

  const filtered = videos.filter(
    (v) => activeCategory === "Semua" || v.category === activeCategory,
  );
  const featuredVideo = videos[0];

  return (
    <div className="bg-[#0a0f0d] min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f2d1f] to-[#1a1a2e] py-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Play size={20} fill="white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-3xl font-serif">
              MCN Play
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Portal video ceramah, diskusi, dan wawancara eksklusif
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Video */}
        <div
          className="mb-10 rounded-2xl overflow-hidden relative"
          style={{ aspectRatio: "16/7" }}
        >
          <img
            src={featuredVideo.thumbnail}
            alt={featuredVideo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
            <div className="p-8 max-w-lg">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {featuredVideo.category}
              </span>
              <h2 className="text-white font-bold text-2xl md:text-3xl font-serif mt-3 leading-tight">
                {featuredVideo.title}
              </h2>
              <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                {featuredVideo.description}
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {formatNumber(featuredVideo.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {featuredVideo.duration}
                </span>
              </div>
              <button
                onClick={() => setPlaying(featuredVideo.id)}
                className="mt-5 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                <Play size={18} fill="white" /> Tonton Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? "bg-red-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/15"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((vid) => (
            <div
              key={vid.id}
              className="group bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden card-hover border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => setPlaying(vid.id)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className="play-btn"
                    style={{ width: "56px", height: "56px" }}
                  >
                    <Play size={22} fill="#1a4731" className="ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                  {vid.duration}
                </span>
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {vid.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-gray-200 transition-colors font-serif">
                  {vid.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {formatNumber(vid.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {vid.publishedAt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {playing !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setPlaying(null)}
          >
            <div
              className="bg-gray-900 rounded-2xl w-full max-w-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-black flex items-center justify-center">
                <div className="text-center text-white">
                  <Play size={60} className="mx-auto text-red-500 mb-3" />
                  <p className="text-gray-400 text-sm">
                    Video player — Konten dilindungi MCNID.NET
                  </p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <h3 className="text-white font-semibold text-sm font-serif">
                  {videos.find((v) => v.id === playing)?.title}
                </h3>
                <button
                  onClick={() => setPlaying(null)}
                  className="text-gray-400 hover:text-white text-xs bg-white/10 px-3 py-1.5 rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
