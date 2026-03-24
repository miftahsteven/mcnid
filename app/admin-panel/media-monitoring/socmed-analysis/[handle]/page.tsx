"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Instagram, 
  Heart, 
  MessageCircle, 
  Share2, 
  Repeat, 
  TrendingUp, 
  Hash, 
  Calendar,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num != null ? num.toString() : "0";
}

export default function SocmedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const handle = decodeURIComponent(params.handle as string);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [handle]);

  const fetchPosts = async (forceRegenerate = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/scraper/socmed-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ handle, platform: "instagram", forceRegenerate }),
      });
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || "Gagal mengambil data detail.");
      }
    } catch (e) {
      setError("Kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-[#1a4731] animate-spin" />
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">
          {data ? "Memperbarui Data Postingan..." : "Mengambil Data Postingan..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-8 bg-white rounded-3xl border border-red-100 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
          <AlertCircle size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Oops! Terjadi Kesalahan</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="px-8 py-3 bg-[#1a4731] text-white rounded-2xl font-black shadow-lg hover:shadow-xl transition-all"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-[#1a4731] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Instagram className="text-pink-600" size={20} />
              <h1 className="text-3xl font-black text-gray-900">{handle}</h1>
            </div>
            <p className="text-gray-500 font-medium">Detail Report - Latest 20 Posts Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchPosts(false)}
              className="px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              Check DB
            </button>
            <button 
              onClick={() => fetchPosts(true)}
              className="px-6 py-3 bg-amber-50 text-amber-600 rounded-2xl font-black text-sm hover:bg-amber-100 transition-all flex items-center gap-2"
            >
              Regenerate Data
            </button>
            <button className="px-6 py-3 bg-[#1a4731] text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              Export PDF
            </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
              { label: 'Total Views', value: formatNumber(data?.posts?.reduce((acc: number, p: any) => acc + (p.viewsCount || 0), 0) || 0), icon: <TrendingUp size={20}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Avg. ER per Post', value: (data?.posts?.reduce((acc: number, p: any) => acc + p.er, 0) / (data?.posts?.length || 1)).toFixed(2) + '%', icon: <TrendingUp size={20}/>, color: 'text-[#1a4731]', bg: 'bg-green-50' },
              { label: 'Total Likes', value: formatNumber(data?.posts?.reduce((acc: number, p: any) => acc + p.likesCount, 0) || 0), icon: <Heart size={20}/>, color: 'text-red-500', bg: 'bg-red-50' },
              { label: 'Total Comments', value: formatNumber(data?.posts?.reduce((acc: number, p: any) => acc + p.commentsCount, 0) || 0), icon: <MessageCircle size={20}/>, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>{stat.icon}</div>
                  <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-black text-gray-900">{stat.value}</p>
                  </div>
              </div>
          ))}
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-16">No</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[300px]">Post & Caption</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-32">Likes</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-32">Views</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-24">Repost</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-24">Shared</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-24">ER</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hashtag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.posts?.map((post: any, idx: number) => (
                <tr key={post.postId || post.id || idx} className="hover:bg-gray-50/80 transition-all group">
                  <td className="px-6 py-6 text-center text-sm font-black text-gray-300 group-hover:text-[#1a4731]">{idx + 1}</td>
                  <td className="px-6 py-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={post.displayUrl} 
                          alt="Post Cover" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <a 
                          href={post.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <ExternalLink className="text-white" size={20} />
                        </a>
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-medium italic">
                          "{post.caption || 'No caption.'}"
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                               <MessageCircle size={10}/> {formatNumber(post.commentsCount)} Comments
                           </span>
                           {post.type === 'Video' && (
                               <span className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                                   Reel
                               </span>
                           )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center">
                        <Calendar size={14} className="text-gray-300 mb-1" />
                        <span className="text-xs font-bold text-gray-500">
                            {new Date(post.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="text-sm font-black text-gray-900 flex items-center justify-end gap-1.5">
                      {formatNumber(post.likesCount)} <Heart size={14} className="text-red-500 fill-red-500" />
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="text-sm font-black text-blue-600 flex items-center justify-end gap-1.5">
                      {formatNumber(post.viewsCount || 0)} <TrendingUp size={14} />
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="text-xs font-bold text-gray-400 flex items-center justify-end gap-1.5">
                      {post.reposts ?? 0} <Repeat size={14} />
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="text-xs font-bold text-gray-400 flex items-center justify-end gap-1.5">
                      {post.shared ?? 0} <Share2 size={14} />
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs",
                      post.er > 5 ? "bg-green-50 text-green-700" : 
                      post.er > 2 ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-700"
                    )}>
                      {post.er.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {post.hashtags?.length > 0 ? post.hashtags.slice(0, 5).map((tag: string, i: number) => (
                        <span key={i} className="text-[9px] font-bold text-[#1a4731] bg-[#1a4731]/5 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                          <Hash size={8} /> {tag}
                        </span>
                      )) : (
                        <span className="text-[10px] text-gray-300 italic">No hashtags</span>
                      )}
                      {post.hashtags?.length > 5 && (
                          <span className="text-[9px] font-bold text-gray-400">+{post.hashtags.length - 5} more</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data?.posts || data.posts.length === 0) && (
              <div className="py-20 flex flex-col items-center justify-center text-gray-300">
                  <Instagram size={48} className="mb-4 opacity-20" />
                  <p className="font-black uppercase tracking-widest text-sm">Tidak ada postingan ditemukan</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
