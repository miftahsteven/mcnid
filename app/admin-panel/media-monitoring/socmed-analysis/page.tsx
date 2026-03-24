"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  BarChart3,
  TrendingUp,
  PieChart,
  Search,
  Plus,
  X,
  Instagram,
  Twitter,
  Facebook,
  Video,
  ArrowUpRight,
  MessageCircle,
  Heart,
  Calendar,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Lock,
  Loader2,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper: cn
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper: formatNumber
function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num != null ? num.toString() : "0";
}

// Component: SparklineChart (Stock Market Style - High Res & Interactive)
// Component: SparklineChart (Stock Market Style - High Res & Interactive)
function SparklineChart({
  data,
  dates = [],
  color = "#ef4444",
  height = 160,
  id,
  compact = false,
}: {
  data: number[];
  dates?: string[];
  color?: string;
  height?: number;
  id: string;
  compact?: boolean;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const trend = data && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const chartDates =
    dates && dates.length > 0 ? dates : ["-", "-", "-", "-", "-", "-", "-"];

  const max = Math.max(...trend);
  const min = Math.min(...trend);

  // High Res Coordinate System (1000 x 400)
  const vw = 1000;
  const vh = 400;

  const rawRange = max - min;
  const range = rawRange || max * 0.2 || 0.1;
  const topPadding = compact ? 20 : 60;
  const bottomPadding = compact ? 20 : 80;
  const leftPadding = 20;
  const rightPadding = 20;
  const effectiveHeight = vh - topPadding - bottomPadding;
  const effectiveWidth = vw - leftPadding - rightPadding;

  const getP = (v: number, i: number) => {
    const x = leftPadding + (i * effectiveWidth) / (trend.length - 1);
    const y = vh - bottomPadding - ((v - min) / range) * effectiveHeight;
    return { x, y };
  };

  const getPath = () => {
    if (trend.length < 2) return "";
    let path = `M ${getP(trend[0], 0).x},${getP(trend[0], 0).y}`;
    for (let i = 0; i < trend.length - 1; i++) {
      const p1 = getP(trend[i], i);
      const p2 = getP(trend[i + 1], i + 1);
      const cp1x = p1.x + (p2.x - p1.x) * 0.4;
      const cp1y = p1.y;
      const cp2x = p1.x + (p2.x - p1.x) * 0.6;
      const cp2y = p2.y;
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const smoothPath = getPath();
  const areaPath = `${smoothPath} L ${vw - rightPadding},${vh - bottomPadding} L ${leftPadding},${vh - bottomPadding} Z`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const idx = Math.min(
      Math.max(Math.round(percent * (trend.length - 1)), 0),
      trend.length - 1,
    );
    setHoverIdx(idx);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group/chart w-full h-full cursor-crosshair select-none",
        compact ? "h-16" : "h-32",
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${vw} ${vh}`}
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter
            id={`glow-${id}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Professional Grid */}
        {[0, 0.5, 1].map((v) => (
          <line
            key={v}
            x1={leftPadding}
            y1={topPadding + (1 - v) * effectiveHeight}
            x2={vw - rightPadding}
            y2={topPadding + (1 - v) * effectiveHeight}
            stroke="rgba(0,0,0,0.03)"
            strokeWidth="2"
          />
        ))}

        {/* Vertical Day Lines */}
        {trend.map((_, i) => (
          <line
            key={i}
            x1={getP(0, i).x}
            y1={topPadding}
            x2={getP(0, i).x}
            y2={vh - (compact ? topPadding : bottomPadding)}
            stroke="rgba(0,0,0,0.02)"
            strokeWidth="1"
          />
        ))}

        {/* Smooth Area */}
        <path d={areaPath} fill={`url(#grad-${id})`} />

        {/* Main Line */}
        <path
          d={smoothPath}
          fill="none"
          stroke={color}
          strokeWidth={compact ? "8" : "6"}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${id})`}
          className="transition-all duration-500 ease-out"
        />

        {/* X-Axis Labels (Professional Dates) */}
        {!compact &&
          trend.map((_, i) => {
            const { x } = getP(0, i);
            return (
              <text
                key={i}
                x={x}
                y={vh - 20}
                textAnchor="middle"
                className="text-[28px] font-black fill-gray-300 uppercase tracking-tight"
              >
                {chartDates[i]}
              </text>
            );
          })}

        {/* Crosshair & Active Point */}
        {hoverIdx !== null && (
          <>
            {/* Vertical Crosshair Line */}
            <line
              x1={getP(0, hoverIdx).x}
              y1={topPadding}
              x2={getP(0, hoverIdx).x}
              y2={vh - (compact ? topPadding : bottomPadding)}
              stroke={color}
              strokeWidth="3"
              strokeDasharray="10,10"
              className="opacity-40"
            />
            {/* Active Point Circle */}
            <circle
              cx={getP(trend[hoverIdx], hoverIdx).x}
              cy={getP(trend[hoverIdx], hoverIdx).y}
              r={compact ? "16" : "12"}
              fill={color}
              stroke="white"
              strokeWidth="4"
              className="shadow-xl"
            />
          </>
        )}
      </svg>

      {/* Tooltip (Float above point) */}
      {hoverIdx !== null && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${(getP(0, hoverIdx).x / vw) * 100}%`,
            top: `${(getP(trend[hoverIdx], hoverIdx).y / vh) * 100}%`,
          }}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
            <div className="bg-gray-900/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-2xl flex flex-col items-center">
              <span className="text-[8px] text-gray-400 font-bold uppercase">
                {chartDates[hoverIdx]}
              </span>
              <span className="text-sm">
                {trend[hoverIdx].toFixed(2)}
                {id.includes("followers") ? "" : "%"}
              </span>
            </div>
            {/* Arrow */}
            {!compact && (
              <div className="mx-auto w-3 h-3 bg-gray-900 rotate-45 -mt-1.5" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Component: ProfileCard
function ProfileCard({
  profile,
  isAnalyzing,
  onRegenerate,
}: {
  profile: any;
  isAnalyzing: boolean;
  onRegenerate: () => void;
}) {
  if (profile.isError) {
    return (
      <div className="bg-white rounded-[32px] border border-red-100 shadow-sm overflow-hidden flex flex-col border-b-8 border-b-red-500">
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="font-black text-gray-900">{profile.handle}</h4>
            <p className="text-sm text-red-500 mt-1">{profile.error}</p>
          </div>
          <button
            onClick={onRegenerate}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            {isAnalyzing ? (
              <RotateCw size={14} className="animate-spin" />
            ) : (
              <RotateCw size={14} />
            )}{" "}
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all border-b-8 border-b-green-500/10 group h-full">
      {/* Profile Header */}
      <div className="p-6 bg-gradient-to-br from-[#1a4731]/5 to-transparent flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1a4731] p-0.5 shadow-lg overflow-hidden shrink-0 relative">
            <img
              src={
                profile.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.handle}`
              }
              alt={profile.name}
              className="w-full h-full object-cover rounded-[14px]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.handle}`;
              }}
            />
            {profile.isPrivate && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-[14px]">
                <Lock size={20} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-black text-gray-900 text-lg leading-tight flex items-center gap-2">
              {profile.name}
              {profile.isPrivate && (
                <Lock size={14} className="text-gray-400" />
              )}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Instagram size={12} className="text-pink-600" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {profile.handle}
              </span>
              {!profile.isPrivate && (
                <CheckCircle2
                  size={12}
                  className="text-blue-500 fill-blue-50"
                />
              )}
            </div>
          </div>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">
            ER
          </p>
          <p className="text-sm font-black text-[#1a4731]">
            {profile.er.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="px-6 pb-4">
        {profile.isPrivate ? (
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-amber-700 leading-tight">
              Akun ini bersifat private. Data yang bisa diambil sangat terbatas.
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic line-clamp-2 leading-relaxed">
            "{profile.bio || "Tidak ada bio."}"
          </p>
        )}
      </div>

      {/* Main Stats */}
      <div className="px-6 py-6 border-y border-gray-50 grid grid-cols-3 gap-4 bg-gray-50/30">
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Followers
          </p>
          <p className="text-lg font-black text-gray-900">
            {formatNumber(profile.followers)}
          </p>
          {profile.followersTrend && profile.followersTrend.length >= 2 && (
            <span className={cn(
              "text-[9px] font-bold flex items-center justify-center gap-0.5",
              (profile.followersTrend[profile.followersTrend.length-1] - profile.followersTrend[profile.followersTrend.length-2]) >= 0 
                ? "text-green-600" : "text-red-500"
            )}>
              <TrendingUp size={8} className={cn((profile.followersTrend[profile.followersTrend.length-1] - profile.followersTrend[profile.followersTrend.length-2]) < 0 && "rotate-180")} />
              {((profile.followersTrend[profile.followersTrend.length-1] - profile.followersTrend[profile.followersTrend.length-2]) / (profile.followersTrend[profile.followersTrend.length-2] || 1) * 100).toFixed(2)}%
            </span>
          )}
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Following
          </p>
          <p className="text-lg font-black text-gray-900">
            {formatNumber(profile.following)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Total Posts
          </p>
          <p className="text-lg font-black text-gray-900">
            {formatNumber(profile.posts)}
          </p>
        </div>
      </div>

      {/* Averages & Trends */}
      <div className="p-6 space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 text-red-500 rounded-lg">
              <Heart size={14} />
            </div>
            <span className="text-xs font-bold text-gray-600">Avg. Likes</span>
          </div>
          <span className="text-sm font-black text-gray-900">
            {formatNumber(profile.avgLikes)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg">
              <MessageCircle size={14} />
            </div>
            <span className="text-xs font-bold text-gray-600">
              Avg. Comments
            </span>
          </div>
          <span className="text-sm font-black text-gray-900">
            {formatNumber(profile.avgComments)}
          </span>
        </div>

        {!profile.isPrivate && (
          <div className="pt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
              <TrendingUp size={10} /> 7 Days Engagement Trend
            </p>
            <div className="h-32 w-full px-1">
              <SparklineChart
                data={profile.recentTrend}
                dates={profile.trendDates}
                height={120}
                id={`card-er-${profile.handle.replace(/[^a-zA-Z0-9]/g, "")}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Followers Growth Section */}
      {!profile.isPrivate && profile.followersTrend && (
        <div className="px-6 pb-6 pt-2 bg-gray-50/20">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
            <Users size={10} /> 7 Days Followers Growth
          </p>
          <div className="h-24 w-full px-1">
            <SparklineChart
              data={profile.followersTrend}
              dates={profile.trendDates}
              color="#1a4731"
              height={90}
              id={`card-followers-${profile.handle.replace(/[^a-zA-Z0-9]/g, "")}`}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
        <button
          onClick={onRegenerate}
          disabled={isAnalyzing}
          className="flex-1 bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#1a4731] hover:border-[#1a4731] transition-all flex items-center justify-center gap-1.5 py-3 rounded-xl shadow-sm"
        >
          {isAnalyzing ? (
            <RotateCw className="animate-spin" size={12} />
          ) : (
            <RotateCw size={12} />
          )}{" "}
          Regenerate
        </button>
        <Link 
          href={`/admin-panel/media-monitoring/socmed-analysis/${encodeURIComponent(profile.handle)}`}
          className="flex-1 bg-[#1a4731]/5 text-[10px] font-black uppercase tracking-widest text-[#1a4731] hover:bg-[#1a4731] hover:text-white transition-all flex items-center justify-center gap-1.5 py-3 rounded-xl"
        >
          Detail Report <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// Main Page Component
export default function SocmedAnalysisPage() {
  const [handles, setHandles] = useState(["@cholilnafis"]);
  const [newHandle, setNewHandle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [analyzingHandle, setAnalyzingHandle] = useState<string | null>(null);

  const addHandle = () => {
    if (newHandle && handles.length < 3) {
      const formatted = newHandle.startsWith("@") ? newHandle : `@${newHandle}`;
      if (!handles.includes(formatted)) {
        setHandles([...handles, formatted]);
      }
      setNewHandle("");
    }
  };

  const removeHandle = (index: number) => {
    const updated = handles.filter((_, i) => i !== index);
    setHandles(updated);
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setShowResults(true);
    setProfiles([]);

    for (const h of handles) {
      setAnalyzingHandle(h);
      try {
        const res = await fetch("/api/admin/scraper/socmed-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ handle: h, platform: "instagram" }),
        });
        const data = await res.json();
        if (res.ok) {
          setProfiles((prev) => [...prev, data]);
        } else {
          setProfiles((prev) => [
            ...prev,
            {
              handle: h,
              error: data.error || "Gagal mengambil data",
              isError: true,
            },
          ]);
        }
      } catch (e: any) {
        setProfiles((prev) => [
          ...prev,
          { handle: h, error: "Kesalahan jaringan", isError: true },
        ]);
      } finally {
        setAnalyzingHandle(null);
      }
    }
    setIsAnalyzing(false);
  };

  const regenerate = async (handle: string, platform: string) => {
    setAnalyzingHandle(handle);
    try {
      const res = await fetch("/api/admin/scraper/socmed-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ handle, platform, forceRegenerate: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfiles((prev) =>
          prev.map((p) => (p.handle === handle ? data : p)),
        );
      } else {
        alert(data.error || "Gagal memperbarui data");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingHandle(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-[#1a4731] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="text-[#1a4731] w-8 h-8" />
            Social Media Analysis Dashboard
          </h1>
          <p className="mt-2 text-gray-500 max-w-2xl">
            Bandingkan performa akun media sosial tokoh atau publik figur secara
            mendalam. Analisis Engagement Rate, Pertumbuhan Followers, dan
            Efektifitas Konten dalam satu layar.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-3 space-y-4">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Akun yang Ingin Dianalisa (Maksimal 3)
            </label>
            <div className="flex flex-wrap gap-3">
              {handles.map((handle, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-2xl group transition-all hover:shadow-sm"
                >
                  <span className="text-sm font-black text-[#1a4731]">
                    {handle}
                  </span>
                  <button
                    onClick={() => removeHandle(idx)}
                    className="text-green-300 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {handles.length < 3 && (
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Masukkan username (e.g. @tokoh)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1a4731]/10 focus:border-[#1a4731] outline-none transition-all"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHandle()}
                  />
                  <button
                    onClick={addHandle}
                    className="absolute right-2 top-1.5 p-1.5 bg-[#1a4731] text-white rounded-lg hover:bg-[#2d6b4a] transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={startAnalysis}
              disabled={handles.length === 0 || isAnalyzing}
              className="w-full bg-[#1a4731] text-white font-black py-4 rounded-2xl shadow-lg shadow-green-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="animate-spin w-5 h-5" /> Menganalisis...
                </>
              ) : (
                <>
                  <BarChart3 size={20} /> Mulai Analisa
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showResults && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, idx) => (
              <ProfileCard
                key={idx}
                profile={profile}
                isAnalyzing={analyzingHandle === profile.handle}
                onRegenerate={() =>
                  regenerate(profile.handle, profile.platform || "instagram")
                }
              />
            ))}

            {/* Skeleton Loading Card */}
            {analyzingHandle &&
              !profiles.find((p) => p.handle === analyzingHandle) && (
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col animate-pulse border-b-8 border-b-gray-100 h-[500px]">
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-100 rounded"></div>
                      <div className="w-20 h-3 bg-gray-50 rounded"></div>
                    </div>
                  </div>
                  <div className="px-6 py-10 flex flex-col items-center justify-center text-gray-300 flex-1">
                    <RotateCw className="animate-spin w-8 h-8 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Sedang Mengambil Data...
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Detailed Comparison Table */}
          {profiles.length > 1 && profiles.every((p) => !p.isError) && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-black text-gray-900 flex items-center gap-2">
                  <PieChart className="text-[#1a4731]" /> Full Metric Comparison
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Parameter
                      </th>
                      {profiles.map((p, i) => (
                        <th
                          key={i}
                          className="px-8 py-4 text-[10px] font-black text-gray-900 uppercase tracking-widest"
                        >
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { label: "Followers", key: "followers" },
                      { label: "Following", key: "following" },
                      { label: "Total Posts", key: "posts" },
                      { label: "Engagement Rate", key: "er", suffix: "%" },
                      {
                        label: "7 Days Growth",
                        key: "followersTrend",
                        isChart: true,
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-8 py-4 text-sm font-bold text-gray-500">
                          {row.label}
                        </td>
                        {profiles.map((p, j) => (
                          <td
                            key={j}
                            className="px-8 py-4 text-sm font-black text-[#1a4731]"
                          >
                            {row.isChart ? (
                              <div className="w-40 h-16">
                                <SparklineChart
                                  data={p[row.key]}
                                  dates={p.trendDates}
                                  color="#1a4731"
                                  height={64}
                                  id={`table-${p.handle}-${j}`}
                                  compact={true}
                                />
                              </div>
                            ) : (
                              <>
                                {typeof p[row.key] === "number"
                                  ? row.key === "er"
                                    ? p[row.key].toFixed(2)
                                    : formatNumber(p[row.key])
                                  : p[row.key]}
                                {row.suffix}
                              </>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Placeholder for no data */}
      {!showResults && !isAnalyzing && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200">
            <BarChart3 size={40} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">Belum Ada Analisa</p>
            <p className="text-sm text-gray-500">
              Masukkan handle sosial media di atas untuk memulai perbandingan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
