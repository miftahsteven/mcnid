'use client';

import React, { useState } from 'react';
import {
  Search,
  BarChart2,
  MessageSquare,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Video,
  Hash,
  Loader2,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Activity,
  Heart,
  Repeat,
  MessageCircle,
  X,
  RefreshCcw,
  BadgeCheck,
  Star,
  Calendar
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MonitorItem {
  title: string;
  link: string;
  snippet: string;
  sentiment: 'Positif' | 'Netral' | 'Negatif' | 'Marah';
  commentSentiment?: { Positif: number, Netral: number, Negatif: number, Marah: number };
  comments?: {
    text: string,
    sentiment: string,
    sentimentData?: {
      overall_sentiment: string;
      summary: string;
      distribution: { positive: number, neutral: number, negative: number, marah?: number };
    },
    username?: string,
    isVerified?: boolean,
    likes?: number,
    profileUrl?: string,
    profileImageUrl?: string
  }[];
  commentError?: string;
  stats?: { likes: number, retweets: number, replies: number };
  mediaName?: string;
  mediaLogo?: string;
  postUsername?: string;
  postIsVerified?: boolean;
  matchRelevance?: string;
  publishedAt?: string;
  overallCommentAnalysis?: {
    overall_sentiment: string;
    summary: string;
    distribution: { positive: number, neutral: number, negative: number, marah: number };
  };
}

interface PlatformData {
  name: string;
  quantity: number;
  items: MonitorItem[];
  error?: string;
}

interface MonitorResults {
  [key: string]: PlatformData;
}

export default function MediaMonitoringPage() {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MonitorResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'web' | 'social'>('social');
  const [selectedPlatformForModal, setSelectedPlatformForModal] = useState<PlatformData & { key: string } | null>(null);

  const handleSearch = async (e?: React.FormEvent, forceRegenerate: boolean = false) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    if (!forceRegenerate) {
      setResults(null);
    }

    try {
      // Call the local proxy route instead of backend directly
      const response = await fetch(`/api/admin/scraper/monitor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          forceRegenerate,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal melakukan monitoring media. Silakan coba lagi.');
      }

      setResults(data.results);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses data.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalMentions = results ? Object.values(results).reduce((acc, curr) => acc + (curr.quantity || 0), 0) : 0;

  const sentimentStats = results
    ? Object.values(results).flatMap(p => p.items).reduce((acc, curr) => {
      acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
    : {};

  const totalSentimentCount = (Object.values(sentimentStats)).reduce((acc, curr) => acc + curr, 0) || 1;

  // Find max quantity for scaling charts
  const maxQty = results ? Math.max(...Object.values(results).map(p => p.quantity || 0), 1) : 1;
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  };

  if (!results && !isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#1a4731] to-[#2d6b4a] sm:text-6xl">
            Media Monitoring
          </h1>
          <p className="max-w-[600px] text-gray-500 text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
            Pantau pergerakan keyword dan sentimen di berbagai platform media nasional dan media sosial dalam satu dashboard.
          </p>
        </div>
        <form onSubmit={handleSearch} className="w-full max-w-2xl px-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none group-focus-within:text-[#1a4731] transition-colors">
              <Search className="w-6 h-6 text-gray-400 group-focus-within:text-[#1a4731]" />
            </div>
            <input
              type="text"
              className="block w-full p-6 pl-12 text-lg text-gray-900 border-2 border-gray-200 rounded-2xl bg-white focus:ring-[#1a4731]/20 focus:border-[#1a4731] hover:border-gray-300 transition-all outline-none shadow-sm hover:shadow-md"
              placeholder="Masukkan keyword yang ingin dimonitoring"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button
              type="submit"
              className="absolute right-3 top-3 bottom-3 px-6 text-sm font-bold text-white bg-[#1a4731] rounded-xl hover:bg-[#2d6b4a] focus:ring-4 focus:outline-none focus:ring-[#1a4731]/30 transition-all active:scale-95"
            >
              Mulai Monitoring
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 w-full justify-center">
            <div className="flex flex-col gap-1.5 min-w-[140px] flex-1 max-w-[200px]">
              <label className="text-xs text-gray-500 font-bold ml-1 text-left">Mulai Tanggal (Opsional)</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all outline-none shadow-sm hover:border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1.5 min-w-[140px] flex-1 max-w-[200px]">
              <label className="text-xs text-gray-500 font-bold ml-1 text-left">Sampai Tanggal (Opsional)</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all outline-none shadow-sm hover:border-gray-300"
              />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500 italic text-center px-4">
            💡 <strong>Tips:</strong> Gunakan tanda kutip (contoh: <code className="bg-gray-100 px-1 rounded">"Isu Terkini"</code>) untuk mencari frasa persis (Exact Match). Tanpa kutip Google akan mencocokkan setiap kata secara terpisah.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span>Platform:</span>
            <span className="bg-gray-100 px-2 py-1 rounded">Semua Website (Web)</span>
            <span className="bg-gray-100 px-2 py-1 rounded">Facebook</span>
            <span className="bg-gray-100 px-2 py-1 rounded">Instagram</span>
            <span className="bg-gray-100 px-2 py-1 rounded">X</span>
            <span className="bg-gray-100 px-2 py-1 rounded">TikTok</span>
            <span className="bg-gray-100 px-2 py-1 rounded">Threads</span>
          </div>
        </form>
        {error && (
          <div className="w-full max-w-2xl px-4 mt-6 animate-in slide-in-from-bottom-2">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start gap-3 shadow-sm">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-red-800">Ups! Terjadi Kendala</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header / Search Again */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-b-4 border-b-[#1a4731]">
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#1a4731]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              className="block w-full p-3 pl-10 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-[#1a4731]/10 focus:border-[#1a4731] transition-all outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari keyword lain..."
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <Loader2 className="w-4 h-4 animate-spin text-[#1a4731]" />
              </div>
            )}
          </form>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSearch(undefined, true)}
            disabled={isLoading || !results}
            title="Dapatkan data terbaru langsung dari server Apify (Abaikan Cache)"
            className="hidden md:flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-wide font-black text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-green-50 hover:text-[#1a4731] hover:border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} /> Regenerate Data
          </button>
          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-0.5">Monitoring Media</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-[#1a4731] font-serif leading-none">{isLoading ? '...' : totalMentions.toLocaleString()}</p>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Mentions</span>
            </div>
            {(dateFrom || dateTo) ? (
              <p className="text-[9px] font-bold text-gray-400 mt-1.5 flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                <Calendar size={10} className="text-gray-400" />
                <span>
                  {dateFrom && dateTo ? (
                    <>Dari <span className="text-[#1a4731]">{formatDateDisplay(dateFrom)}</span> s/d <span className="text-[#1a4731]">{formatDateDisplay(dateTo)}</span></>
                  ) : dateFrom ? (
                    <>Sejak <span className="text-[#1a4731]">{formatDateDisplay(dateFrom)}</span></>
                  ) : (
                    <>Hingga <span className="text-[#1a4731]">{formatDateDisplay(dateTo)}</span></>
                  )}
                </span>
              </p>
            ) : (
              <p className="text-[9px] font-bold text-gray-400 mt-1.5 flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                <Calendar size={10} className="text-gray-400" />
                <span>Periode: <span className="text-[#1a4731]">7 Hari Terakhir</span></span>
              </p>
            )}
          </div>
          <div className="h-10 w-px bg-gray-200 hidden md:block" />
          <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-inner">
            <button
              type="button"
              onClick={() => setFilterMode('web')}
              className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ease-out", filterMode === 'web' ? "bg-white text-[#1a4731] shadow-sm transform scale-105" : "text-gray-500 hover:text-gray-700")}
            >
              Web Media Online (Semua Internet)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('social')}
              className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ease-out", filterMode === 'social' ? "bg-white text-[#1a4731] shadow-sm transform scale-105" : "text-gray-500 hover:text-gray-700")}
            >
              Sosial Media
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-[#1a4731] rounded-full animate-spin" />
            <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1a4731] w-6 h-6 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-bold text-gray-900">Menganalisis Media & Sentimen...</p>
            <p className="text-sm text-gray-500 italic">Ini mungkin memakan waktu 30-60 detik tergantung response platform.</p>
          </div>
        </div>
      ) : results && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Positif</span>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={16} /></div>
              </div>
              <p className="text-2xl font-bold font-serif">{(sentimentStats['Positif'] as number) || 0}</p>
              <div className="mt-2 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: `${(((sentimentStats['Positif'] as number) || 0) / totalSentimentCount) * 100}%` }} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Netral</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MessageSquare size={16} /></div>
              </div>
              <p className="text-2xl font-bold font-serif">{(sentimentStats['Netral'] as number) || 0}</p>
              <div className="mt-2 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${(((sentimentStats['Netral'] as number) || 0) / totalSentimentCount) * 100}%` }} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Negatif</span>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingDown size={16} /></div>
              </div>
              <p className="text-2xl font-bold font-serif">{(sentimentStats['Negatif'] as number) || 0}</p>
              <div className="mt-2 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full" style={{ width: `${(((sentimentStats['Negatif'] as number) || 0) / totalSentimentCount) * 100}%` }} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <p className="text-xs text-gray-500 font-medium">Berdasarkan data 1 minggu terakhir across all platforms.</p>
              <button className="mt-4 text-xs font-bold text-[#1a4731] flex items-center gap-1 hover:underline">
                Generate Report <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Quantity Chart (Modern Bar) */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
              <BarChart2 className="text-[#1a4731]" /> Kuantitas Mentorship per Platform
            </h3>
            <div className="space-y-6">
              {Object.entries(results).map(([key, data]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 font-semibold text-gray-700 capitalize">
                      {key === 'web' && <Globe size={14} className="text-blue-500" />}
                      {key === 'facebook' && <Facebook size={14} className="text-blue-700" />}
                      {key === 'instagram' && <Instagram size={14} className="text-pink-600" />}
                      {key === 'x' && <Twitter size={14} className="text-blue-400" />}
                      {key === 'tiktok' && <Video size={14} className="text-black" />}
                      {key === 'threads' && <Hash size={14} className="text-gray-900" />}
                      {data.name}
                    </div>
                    <span className="font-mono font-bold text-[#1a4731]">{data.quantity.toLocaleString()}</span>
                  </div>
                  <div className="relative w-full h-8 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <div
                      className={cn(
                        "h-full rounded-r-lg transition-all duration-1000 ease-out",
                        key === 'web' && "bg-blue-400/20 border-r-4 border-blue-500",
                        key === 'facebook' && "bg-blue-700/20 border-r-4 border-blue-700",
                        key === 'instagram' && "bg-pink-600/20 border-r-4 border-pink-600",
                        key === 'x' && "bg-blue-400/20 border-r-4 border-blue-400",
                        key === 'tiktok' && "bg-gray-900/20 border-r-4 border-gray-900",
                        key === 'threads' && "bg-gray-900/20 border-r-4 border-gray-900"
                      )}
                      style={{ width: `${(data.quantity / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality List (Detailed Top 5 with Sentiment) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 px-2">
              <MessageSquare className="text-[#1a4731]" /> Kualitas Berita & Konten (Top 5 Hasil)
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {Object.entries(results).filter(([key]) => filterMode === 'all' ? true : filterMode === 'web' ? key === 'web' : key !== 'web').map(([key, data]) => (
                <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                  <div className={cn(
                    "px-5 py-4 flex items-center justify-between border-b border-gray-50",
                    key === 'web' && "bg-blue-50/50",
                    key === 'facebook' && "bg-blue-700/5",
                    key === 'instagram' && "bg-pink-500/5",
                    key === 'x' && "bg-blue-400/5",
                    key === 'tiktok' && "bg-gray-900/5",
                    key === 'threads' && "bg-gray-100"
                  )}>
                    <div className="flex items-center gap-2">
                      {key === 'web' && <Globe size={18} className="text-blue-500" />}
                      {key === 'facebook' && <Facebook size={18} className="text-blue-700" />}
                      {key === 'instagram' && <Instagram size={18} className="text-pink-600" />}
                      {key === 'x' && <Twitter size={18} className="text-blue-400" />}
                      {key === 'tiktok' && <Video size={18} className="text-black" />}
                      {key === 'threads' && <Hash size={18} className="text-gray-900" />}
                      <span className="font-bold text-gray-900">{data.name}</span>
                    </div>
                    {data.error ? (
                      <span className="text-[10px] bg-red-50 text-red-500 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <AlertCircle size={10} /> {data.error}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold">
                        Top Results
                      </span>
                    )}
                  </div>

                  <div className="p-1">
                    {data.items.length > 0 ? (
                      <div className="flex flex-col divide-y divide-gray-50">
                        <div className="flex-1">
                          {data.items.slice(0, 1).map((item, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 transition-colors group rounded-xl">
                              {(item.mediaName || item.postUsername) && (
                                <div className="flex items-center gap-2 mb-2">
                                  {item.mediaLogo && <img src={item.mediaLogo} alt={item.mediaName} className="w-4 h-4 rounded object-contain bg-white" />}
                                  {item.mediaName && <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.mediaName}</span>}
                                  {item.postUsername && (
                                    <span className="text-[10px] font-bold text-[#1a4731] flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                                      {item.postUsername}
                                      {item.postIsVerified && <BadgeCheck size={12} className="text-blue-500" />}
                                    </span>
                                  )}
                                  {item.publishedAt && (
                                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-auto bg-gray-50 px-1.5 py-0.5 rounded border">
                                      🗓️ {isNaN(new Date(item.publishedAt).getTime()) ? item.publishedAt : new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h4 className={cn(
                                  "text-sm font-bold line-clamp-2 leading-snug group-hover:text-[#1a4731] transition-colors",
                                  item.commentSentiment && item.commentSentiment.Negatif > 0 ? "text-red-600" : "text-gray-900"
                                )}>
                                  {i + 1}. {item.title}
                                </h4>
                                <div className="flex flex-col items-end gap-1">
                                  <span className={cn(
                                    "shrink-0 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tight",
                                    item.sentiment === 'Positif' && "bg-green-100 text-green-700 border border-green-200",
                                    item.sentiment === 'Netral' && "bg-blue-100 text-blue-700 border border-blue-200",
                                    item.sentiment === 'Negatif' && "bg-red-100 text-red-700 border border-red-200",
                                    item.sentiment === 'Marah' && "bg-red-900 text-white border border-red-950"
                                  )}>
                                    Konten: {item.sentiment}
                                  </span>
                                  {item.commentSentiment && (
                                    <div className="flex gap-1">
                                      <span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">+{item.commentSentiment.Positif}</span>
                                      <span className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100">{item.commentSentiment.Netral}</span>
                                      <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">-{item.commentSentiment.Negatif}</span>
                                      {item.commentSentiment.Marah > 0 && (
                                        <span className="text-[9px] bg-red-900 text-white px-1.5 py-0.5 rounded border border-red-950">😡 {item.commentSentiment.Marah}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">{item.snippet}</p>

                              {item.matchRelevance && (
                                <div className="mb-3">
                                  <span className={cn(
                                    "inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm",
                                    item.matchRelevance.includes("Utuh")
                                      ? "bg-purple-50 text-purple-700 border-purple-200"
                                      : item.matchRelevance.includes("Tidak ada")
                                        ? "bg-gray-50 text-gray-500 border-gray-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                  )}>
                                    {item.matchRelevance.includes("Utuh") && <Star size={10} className="mr-1 fill-purple-700" />}
                                    {item.matchRelevance}
                                  </span>
                                </div>
                              )}

                              {/* Comment Section */}
                              {item.comments && item.comments.length > 0 && (
                                <div className="mb-3 space-y-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <MessageSquare size={10} /> Sampel Komentar & Sentimen
                                  </p>
                                  <div className="space-y-2">
                                    {item.comments.slice(0, 20).map((comment, ci) => (
                                      <div key={ci} className="text-[11px] leading-relaxed border-l-2 pl-2 flex flex-col gap-0.5"
                                        style={{ borderLeftColor: comment.sentiment === 'Positif' ? '#22c55e' : comment.sentiment === 'Negatif' ? '#ef4444' : '#94a3b8' }}>
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 mb-0.5">
                                          {comment.profileImageUrl && <img src={comment.profileImageUrl} alt="avatar" className="w-3 h-3 rounded-full object-cover" />}
                                          {comment.profileUrl ? (
                                            <a href={comment.profileUrl} target="_blank" rel="noreferrer" className="text-gray-800 hover:underline">{comment.username || "Pengguna"}</a>
                                          ) : (
                                            <span className="text-gray-800">{comment.username || "Pengguna"}</span>
                                          )}
                                          {comment.isVerified && <BadgeCheck size={10} className="text-blue-500" />}
                                          {comment.likes ? <span className="flex items-center text-gray-400 gap-0.5 ml-1"><Heart size={8} /> {comment.likes}</span> : null}
                                        </div>
                                        <p className="text-gray-700 italic">"{comment.text}"</p>
                                        <span className={cn(
                                          "text-[9px] font-bold uppercase",
                                          comment.sentiment === 'Positif' && "text-green-600",
                                          comment.sentiment === 'Netral' && "text-gray-400",
                                          comment.sentiment === 'Negatif' && "text-red-500"
                                        )}>{comment.sentiment}</span>
                                      </div>
                                    ))}
                                    {item.comments.length > 20 && (
                                      <p className="text-[9px] text-gray-400 italic">+{item.comments.length - 20} komentar lainnya dianalisis</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {item.commentError && (
                                <p className="text-[10px] text-orange-500 font-medium italic mb-3 flex items-center gap-1">
                                  <AlertCircle size={10} /> {item.commentError}
                                </p>
                              )}

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-black text-[#1a4731] hover:underline bg-green-50 px-3 py-2 rounded-lg transition-colors border border-green-100 w-fit"
                                >
                                  Kunjungi Konten <ExternalLink size={10} />
                                </a>

                                {item.stats && (
                                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                    <span className="flex items-center gap-1"><Heart size={12} className="text-red-500" /> {item.stats.likes}</span>
                                    <span className="flex items-center gap-1"><Repeat size={12} className="text-green-500" /> {item.stats.retweets}</span>
                                    <span className="flex items-center gap-1"><MessageCircle size={12} className="text-blue-500" /> {item.stats.replies}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {data.items.length > 1 && (
                          <div className="pt-2 pb-3 flex justify-center border-t border-gray-50 mt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedPlatformForModal({ key, ...data })}
                              className="text-[10px] font-black text-[#1a4731] hover:text-white hover:bg-[#1a4731] border border-[#1a4731]/20 px-4 py-2 rounded-full transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                            >
                              Lihat Semua {data.items.length} Hasil
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center text-center">
                        <p className="text-[11px] text-gray-400 font-medium italic">Data tidak ditemukan.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-bold text-red-800">Ups! Terjadi Kendala</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Modal for All Results */}
      {selectedPlatformForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className={cn(
              "px-6 py-5 flex items-center justify-between border-b border-gray-100 rounded-t-3xl",
              selectedPlatformForModal.key === 'web' && "bg-blue-50/80",
              selectedPlatformForModal.key === 'facebook' && "bg-blue-700/5",
              selectedPlatformForModal.key === 'instagram' && "bg-pink-500/5",
              selectedPlatformForModal.key === 'x' && "bg-blue-400/5",
              selectedPlatformForModal.key === 'tiktok' && "bg-gray-900/5",
              selectedPlatformForModal.key === 'threads' && "bg-gray-100"
            )}>
              <h3 className="font-black text-xl flex items-center gap-3 text-gray-900">
                {selectedPlatformForModal.key === 'web' && <Globe size={24} className="text-blue-500" />}
                {selectedPlatformForModal.key === 'facebook' && <Facebook size={24} className="text-blue-700" />}
                {selectedPlatformForModal.key === 'instagram' && <Instagram size={24} className="text-pink-600" />}
                {selectedPlatformForModal.key === 'x' && <Twitter size={24} className="text-blue-400" />}
                {selectedPlatformForModal.key === 'tiktok' && <Video size={24} className="text-black" />}
                {selectedPlatformForModal.key === 'threads' && <Hash size={24} className="text-gray-900" />}
                Semua Hasil ({selectedPlatformForModal.name})
              </h3>
              <button
                onClick={() => setSelectedPlatformForModal(null)}
                className="p-2.5 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full text-gray-500 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 divide-y divide-gray-100 bg-gray-50/30">
              {selectedPlatformForModal.items.map((item, i) => (
                <div key={i} className="py-6 first:pt-2 last:pb-2 hover:bg-gray-50/80 transition-colors px-2 md:px-4 rounded-2xl">
                  {(item.mediaName || item.postUsername) && (
                    <div className="flex items-center gap-2 mb-3">
                      {item.mediaLogo && <img src={item.mediaLogo} alt={item.mediaName} className="w-5 h-5 rounded object-contain bg-white shadow-sm border border-gray-100" />}
                      {item.mediaName && <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.mediaName}</span>}
                      {item.postUsername && (
                        <span className="text-xs font-bold text-[#1a4731] flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded border border-green-100">
                          {item.postUsername}
                          {item.postIsVerified && <BadgeCheck size={14} className="text-blue-500" />}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <h4 className={cn(
                      "text-base font-bold leading-snug hover:text-[#1a4731] transition-colors flex-1",
                      item.commentSentiment && item.commentSentiment.Negatif > 0 ? "text-red-700" : "text-gray-900"
                    )}>
                      {i + 1}. {item.title}
                    </h4>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
                      {item.publishedAt && (
                        <span className="text-[11px] text-[#1a4731] font-bold whitespace-nowrap bg-green-50 px-2.5 py-1 rounded-full border border-green-100 mb-1 flex items-center gap-1.5 shadow-sm">
                          <Calendar size={12} className="text-green-600" />
                          {(() => {
                            try {
                              const d = new Date(item.publishedAt);
                              if (isNaN(d.getTime())) return item.publishedAt;
                              return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                            } catch (e) {
                              return item.publishedAt;
                            }
                          })()}
                        </span>
                      )}
                      <span className={cn(
                        "shrink-0 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide shadow-sm border",
                        item.sentiment === 'Positif' && "bg-green-100 text-green-700 border-green-200",
                        item.sentiment === 'Netral' && "bg-blue-100 text-blue-700 border-blue-200",
                        item.sentiment === 'Negatif' && "bg-red-100 text-red-700 border-red-200",
                        item.sentiment === 'Marah' && "bg-red-900 text-white border border-red-950"
                      )}>
                        Konten: {item.sentiment}
                      </span>
                      {item.commentSentiment && (
                        <div className="flex gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                          <span className="text-[10px] font-bold text-green-600 flex items-center gap-0.5">+{item.commentSentiment.Positif}</span>
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-0.5">{item.commentSentiment.Netral}</span>
                          <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">-{item.commentSentiment.Negatif}</span>
                          {item.commentSentiment.Marah > 0 && (
                            <span className="text-[10px] font-bold text-red-900 flex items-center gap-0.5">😡 {item.commentSentiment.Marah}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.overallCommentAnalysis && (
                    <div className="mb-6 bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <BarChart2 size={80} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            item.overallCommentAnalysis.overall_sentiment === 'POSITIVE' && "bg-green-500/20 text-green-400 border-green-500/30",
                            item.overallCommentAnalysis.overall_sentiment === 'NEGATIVE' && "bg-red-500/20 text-red-400 border-red-500/30",
                            item.overallCommentAnalysis.overall_sentiment === 'MARAH' && "bg-red-700 text-white border-red-800",
                            item.overallCommentAnalysis.overall_sentiment === 'NEUTRAL' && "bg-gray-500/20 text-gray-400 border-gray-500/30",
                            !item.overallCommentAnalysis.overall_sentiment && "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          )}>
                            Kesimpulan Komentar: {item.overallCommentAnalysis.overall_sentiment || 'AUTO'}
                          </div>
                        </div>
                        <p className="text-sm font-medium leading-relaxed mb-4 text-gray-200 italic">
                          "{typeof item.overallCommentAnalysis === 'string' ? item.overallCommentAnalysis : (item.overallCommentAnalysis.summary || 'Analisis ringkasan sedang diproses...')}"
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="block text-[8px] text-gray-400 font-bold uppercase">Positif</span>
                            <span className="text-sm font-black text-green-400">{item.overallCommentAnalysis?.distribution?.positive || 0}%</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="block text-[8px] text-gray-400 font-bold uppercase">Netral</span>
                            <span className="text-sm font-black text-gray-300">{item.overallCommentAnalysis?.distribution?.neutral || 0}%</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="block text-[8px] text-gray-400 font-bold uppercase">Negatif</span>
                            <span className="text-sm font-black text-red-400">{item.overallCommentAnalysis?.distribution?.negative || 0}%</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="block text-[8px] text-gray-400 font-bold uppercase">Marah</span>
                            <span className="text-sm font-black text-red-600">{item.overallCommentAnalysis?.distribution?.marah || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{item.snippet}</p>

                  {item.matchRelevance && (
                    <div className="mb-4">
                      <span className={cn(
                        "inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm",
                        item.matchRelevance.includes("Utuh")
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : item.matchRelevance.includes("Tidak ada")
                            ? "bg-gray-50 text-gray-500 border-gray-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {item.matchRelevance.includes("Utuh") && <Star size={12} className="mr-1.5 fill-purple-700" />}
                        {item.matchRelevance}
                      </span>
                    </div>
                  )}

                  {item.comments && item.comments.length > 0 && (
                    <div className="mb-4 space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-200 to-gray-300" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 ml-2">
                        <MessageSquare size={12} /> Sampel Analisis Sentimen Komentar
                      </p>
                      <div className="space-y-3 ml-2">
                        {item.comments.slice(0, 20).map((comment, ci) => (
                          <div key={ci} className="text-xs leading-relaxed border-l-2 pl-3 py-0.5 flex flex-col gap-1"
                            style={{ borderLeftColor: comment.sentiment === 'Positif' ? '#22c55e' : comment.sentiment === 'Negatif' ? '#ef4444' : '#e2e8f0' }}>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                              {comment.profileImageUrl && <img src={comment.profileImageUrl} alt="avatar" className="w-4 h-4 rounded-full object-cover shadow-sm" />}
                              {comment.profileUrl ? (
                                <a href={comment.profileUrl} target="_blank" rel="noreferrer" className="text-gray-800 hover:underline">{comment.username || "Pengguna"}</a>
                              ) : (
                                <span className="text-gray-800">{comment.username || "Pengguna"}</span>
                              )}
                              {comment.isVerified && <BadgeCheck size={12} className="text-blue-500" />}
                              {comment.likes ? <span className="flex items-center text-gray-400 gap-0.5 ml-1"><Heart size={10} /> {comment.likes}</span> : null}
                            </div>
                            <p className="text-gray-800 italic">"{comment.text}"</p>
                            <div className={cn(
                              "text-[10px] font-black uppercase tracking-wider",
                              comment.sentiment === 'Positif' && "text-green-600",
                              comment.sentiment === 'Netral' && "text-gray-400",
                              comment.sentiment === 'Negatif' && "text-red-500",
                              comment.sentiment === 'Marah' && "text-red-900 font-bold"
                            )}>
                              {comment.sentiment}
                              {comment.sentimentData?.summary && (
                                <span className="ml-1 font-normal normal-case text-gray-500 italic block mt-0.5 line-clamp-2">💡 Ringkasan AI: "{comment.sentimentData.summary}"</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {item.comments.length > 20 && (
                          <p className="text-[10px] font-bold text-gray-400 bg-gray-50 inline-block px-2 py-1 rounded-md">+{item.comments.length - 20} komentar lainnya turut dianalisis</p>
                        )}
                      </div>
                    </div>
                  )}

                  {item.commentError && (
                    <div className="mb-4 bg-orange-50/50 p-2.5 rounded-lg border border-orange-100">
                      <p className="text-[11px] text-orange-600 font-bold flex items-center gap-1.5">
                        <AlertCircle size={12} /> {item.commentError}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 bg-gray-50/50 px-3 py-2.5 rounded-xl border border-gray-100">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black text-[#1a4731] hover:text-[#2d6b4a] hover:underline bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow"
                    >
                      Kunjungi Konten / Post <ExternalLink size={12} />
                    </a>

                    {item.stats && (
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="flex items-center gap-1.5"><Heart size={14} className="text-red-500" /> {item.stats.likes.toLocaleString()}</span>
                        <span className="flex items-center gap-1.5"><Repeat size={14} className="text-green-500" /> {item.stats.retweets.toLocaleString()}</span>
                        <span className="flex items-center gap-1.5"><MessageCircle size={14} className="text-blue-500" /> {item.stats.replies.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
