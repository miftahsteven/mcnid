"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Network, 
  Users, 
  Share2, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  Download
} from "lucide-react";
import dynamic from "next/dynamic";
import { transformSnaToGraph } from "@/lib/graph/transform";

const GraphView = dynamic(() => import("@/components/sna/GraphView").then(mod => mod.GraphView), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-[#020617] rounded-[2.5rem] border border-slate-800">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  )
});

export default function SnaResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sna/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || "Gagal mengambil data analisis.");
      }
    } catch (e) {
      setError("Kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  const graph = useMemo(() => {
    if (!data?.graphData) return null;
    return transformSnaToGraph(data.graphData);
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] space-y-6">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Generating Network Graph</h2>
          <p className="text-slate-400 mt-2">Processing nodes and calculating community clusters...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-slate-900 rounded-3xl border border-red-900/30 text-center space-y-6">
        <AlertCircle size={48} className="text-red-500 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold text-white">Oops! Terjadi Kesalahan</h2>
          <p className="text-slate-400 mt-2">{error || "Data tidak ditemukan."}</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="px-8 py-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all font-semibold"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              <Network size={20} className="text-blue-500" />
              SNA Analysis: {data.keyword}
            </h1>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-0.5">
              ID: {id.slice(0, 8)} • Directed Actor Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700 text-xs font-bold text-slate-300">
            {data.totalNodes} Nodes
          </div>
          <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700 text-xs font-bold text-slate-300">
            {data.totalEdges} Edges
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all">
            <Download size={16} />
            Export Image
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Graph Container */}
        <div className="flex-1 p-6">
          {graph && <GraphView graph={graph} />}
        </div>

        {/* Info Sidebar */}
        <aside className="w-96 border-l border-slate-800 bg-slate-900/30 backdrop-blur-3xl p-8 overflow-y-auto space-y-8">
          {/* Top Influencers */}
          <section>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Users size={14} className="text-blue-500" />
              Top Influencers
            </h3>
            <div className="space-y-3">
              {(data.analytics?.topInfluencers || []).map((inf: any, idx: number) => (
                <div key={idx} className="group p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white tracking-tight">@{inf.username}</span>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                      {(inf.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${inf.score * 100 * 5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Clusters */}
          <section>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Share2 size={14} className="text-rose-500" />
              Community Detection
            </h3>
            <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50 text-center">
              <div className="text-4xl font-black text-white mb-1">{data.analytics?.mainClusters || 0}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Distinct Clusters Found</div>
            </div>
          </section>

          {/* Quick Info */}
          <section className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-blue-400">Analysis Summary</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on the interaction graph for <span className="text-slate-200 font-bold">"{data.keyword}"</span>, 
              we detected strong clustering around {data.analytics?.mainClusters} core conversations.
            </p>
            <button className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-500/30 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={12} />
              View Full Dataset
            </button>
          </section>
        </aside>
      </main>
    </div>
  );
}
