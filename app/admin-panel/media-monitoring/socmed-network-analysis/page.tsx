"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Network, 
  Search, 
  History, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Loader2,
  Calendar,
  Layers
} from "lucide-react";
import dayjs from "dayjs";

export default function SnaDashboardPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState(500);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/sna", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (e) {
      console.error("Failed to fetch history");
    } finally {
      setFetching(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    setLoading(true);
    try {
      const res = await fetch("/api/sna/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ keyword, limit }),
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin-panel/media-monitoring/socmed-network-analysis/${data.id}`);
      } else {
        const errorData = await res.json();
        alert(errorData.message || errorData.error || "Gagal menjalankan analisis. Pastikan query benar.");
      }
    } catch (e: any) {
      console.error("Analysis Error:", e);
      alert(`Kesalahan jaringan: ${e.message || "Unknown error"}. Silakan periksa koneksi backend.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <section className="relative overflow-hidden p-12 bg-gradient-to-br from-[#020617] to-[#0f172a] rounded-[3rem] border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Network size={320} className="text-blue-500" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <TrendingUp size={14} />
            Social Network Analysis
          </div>
          
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
            Discover Influence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Inside the Discourse
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Analyze interactions, detect community clusters, and identify top influencers on X/Twitter in real-time using high-performance graph algorithms.
          </p>

          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4 p-3 bg-slate-900/50 backdrop-blur-md rounded-[2rem] border border-slate-700 shadow-xl mt-8">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-5 text-slate-500" size={20} />
              <input 
                type="text"
                placeholder="Enter Keyword or Tweet URL..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent pl-14 pr-6 py-4 text-white font-bold focus:outline-none placeholder:text-slate-600"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  Start Analysis
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          
          <div className="flex items-center gap-6 text-xs font-bold text-slate-500 px-2 mt-4">
              <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Keyword search
              </span>
              <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Tweet Context
              </span>
              <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Cluster Detection
              </span>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-blue-500">
              <History size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Analysis History</h2>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-0.5">Your recent research results</p>
            </div>
          </div>
          <button 
            onClick={fetchHistory}
            className="px-4 py-2 text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            Refresh
          </button>
        </div>

        {fetching ? (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-slate-700" size={40} />
            </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item: any) => (
              <div 
                key={item.id}
                onClick={() => router.push(`/admin-panel/media-monitoring/socmed-network-analysis/${item.id}`)}
                className="group relative p-8 bg-slate-900/40 rounded-[2.5rem] border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer overflow-hidden shadow-lg shadow-black/50"
              >
                <div className="absolute top-0 right-0 p-8 text-blue-500/5 group-hover:text-blue-500/10 transition-colors pointer-events-none">
                  <Network size={120} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Calendar size={12} />
                      {dayjs(item.createdAt).format("DD MMM YYYY")}
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors line-clamp-1 leading-tight">
                    {item.keyword}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Users size={12} /> Nodes
                      </div>
                      <div className="text-lg font-black text-white">{item.totalNodes}</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Layers size={12} /> Edges
                      </div>
                      <div className="text-lg font-black text-white">{item.totalEdges}</div>
                    </div>
                  </div>

                  {item.analytics?.topInfluencers?.[0] && (
                    <div className="pt-4 border-t border-slate-800">
                      <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Primary Influencer</div>
                      <div className="font-bold text-slate-300 text-sm truncate">@{item.analytics.topInfluencers[0].username}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[3rem] space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700">
                <Network size={40} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-300">No Analysis Results Yet</h3>
                <p className="text-slate-500 text-sm mt-1">Start by entering a keyword above to discover the network interaction.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
