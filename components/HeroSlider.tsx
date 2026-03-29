"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Clock, Eye, ChevronLeft, ChevronRight, Play } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.locale("id");

export interface HighlightItem {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  category: string;
  excerpt: string;
  author: string;
  publishedAt: string | null;
  type: "post" | "video";
  views: number;
}

interface HeroSliderProps {
  highlights: HighlightItem[];
}

function getCategoryColor(cat: string) {
  const map: Record<string, string> = {
    Nasional: "bg-blue-600",
    Keislaman: "bg-green-700",
    Kegiatan: "bg-orange-500",
    Tokoh: "bg-purple-600",
    Opini: "bg-gray-700",
    "MCN Play": "bg-red-600",
  };
  return map[cat] || "bg-[#1a4731]";
}

import { getPublicImageUrl } from "@/lib/backend-config";

export default function HeroSlider({ highlights }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === highlights.length - 1 ? 0 : prev + 1));
  }, [highlights.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? highlights.length - 1 : prev - 1));
  }, [highlights.length]);

  // Autoplay
  useEffect(() => {
    if (highlights.length <= 1) return;
    const interval = setInterval(nextSlide, 5000); // 5 seconds slide
    return () => clearInterval(interval);
  }, [nextSlide, highlights.length]);

  if (!highlights || highlights.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 shadow-inner">
        <p className="text-gray-400 font-medium">Tidak ada berita utama.</p>
      </div>
    );
  }

  const currentFocus = highlights[currentIndex];
  // Helper to resolve correct route
  const resolveLink = (item: HighlightItem) => {
    return item.type === "video" ? `/mcn-play/${item.slug}` : `/berita/${item.slug}`;
  };

  return (
    <div className="relative group block overflow-hidden rounded-xl bg-gray-900 aspect-[16/9] shadow-lg w-full">
      {/* Slides Container */}
      <div 
        className="w-full h-full flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {highlights.map((hero, idx) => (
          <div key={hero.id + idx} className="w-full h-full shrink-0 relative">
            <Link href={resolveLink(hero)} className="w-full h-full block">
              <img
                src={getPublicImageUrl(hero.image)}
                alt={hero.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="news-gradient absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <span
                  className={`badge-primary mb-3 self-start ${getCategoryColor(hero.category)} flex items-center gap-1`}
                >
                  {hero.type === "video" && <Play size={10} fill="currentColor" />}
                  {hero.category}
                </span>
                <h1 className="text-white font-bold text-xl md:text-3xl lg:text-4xl leading-tight hover:underline underline-offset-4 transition-all font-serif line-clamp-2 md:line-clamp-3 w-11/12 drop-shadow-md">
                  {hero.title}
                </h1>
                <p className="text-gray-200 text-sm mt-3 line-clamp-2 hidden md:block w-10/12 drop-shadow">
                  {hero.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-300 drop-shadow">
                  <span className="font-semibold text-white">{hero.author}</span>
                  <span className="flex items-center gap-1.5 opacity-80">
                    <Clock size={12} />
                    {dayjs(hero.publishedAt).fromNow()}
                  </span>
                  <span className="flex items-center gap-1.5 opacity-80">
                    <Eye size={12} />
                    {hero.views?.toLocaleString("id-ID") || 0}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {highlights.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-[#1a4731]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); nextSlide(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-[#1a4731]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-6 flex items-center gap-2">
            {highlights.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full 
                  ${
                    idx === currentIndex 
                    ? "w-6 h-1.5 bg-[#c9a227] shadow-[0_0_8px_rgba(201,162,39,0.8)]" 
                    : "w-2 h-2 bg-white/40 hover:bg-white/80"
                  }
                `}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
