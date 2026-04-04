"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Trash2, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Calendar,
  UserX,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown,
  ShieldOff,
  UserCheck
} from "lucide-react";

interface ChatLog {
  id: string;
  sessionId: string;
  userId: string | null;
  userName?: string | null;
  userEmail?: string | null;
  question: string;
  answer: string;
  createdAt: string;
  feedbacks?: { isHelpful: boolean }[];
}

interface BlockedUser {
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  reason?: string | null;
  createdAt: string;
}

export default function QuestionsClient() {
  const [data, setData] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ki-ai/questions");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengambil data");
      setData(json.data || []);
      setBlockedUsers(json.blockedUsers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Hapus log pertanyaan ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      const res = await fetch(`/api/admin/ki-ai/questions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal menghapus data");
      }
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResetUser = async (userId: string | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!userId) {
      alert("Sesi ini anonim atau tidak terkait dengan akun (Guest). Penghapusan masal harian memerlukan UID.");
      return;
    }
    const isConfirm = window.confirm(
      `Mereset Limit Harian?\n\nAksi ini akan menghapus semua pertanyaan dari pengguna ini KHUSUS UNTUK HARI INI SAJA, dan mengembalikan kuota harian mereka ke 0/5.`
    );
    if (!isConfirm) return;
    
    try {
      const res = await fetch(`/api/admin/ki-ai/questions/reset/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal me-reset data harian user");
      }
      alert("Pertanyaan hari ini berhasil dihapus, kuota dikembalikan.");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleWipeUser = async (userId: string | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!userId) {
      alert("Sesi ini anonim atau tidak terkait dengan akun (Guest).");
      return;
    }
    const isConfirm = window.confirm(
      `PERINGATAN!\n\nAnda yakin ingin menghapus SELURUH rekam riwayat pengguna ini di sistem KI.AI?\n\nCatatan: Ini akan mengosongkan riwayat secara total namun tidak menghapus akun autentikasi Google pengguna.`
    );
    if (!isConfirm) return;
    
    try {
      const res = await fetch(`/api/admin/ki-ai/questions/wipe/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal menghapus total riwayat user");
      }
      alert("Seluruh riwayat pertanyaan user berhasil dihapus dari sistem.");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };
  
  const handleUnblock = async (userId: string | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!userId) return;
    
    if (!confirm("Buka blokir untuk pengguna ini?")) return;
    
    try {
      const res = await fetch(`/api/admin/ki-ai/questions/unblock/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal membuka blokir");
      }
      alert("Blokir berhasil dibuka.");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const groupedUsers = useMemo(() => {
    const map = new Map<string, { userId: string | null, userName: string, userEmail: string, logs: ChatLog[], isBlocked: boolean }>();
    
    // First, add all blocked users to the map to ensure they appear even without logs
    blockedUsers.forEach(bu => {
      map.set(bu.userId, {
        userId: bu.userId,
        userName: bu.userName || "Pengguna Terblokir",
        userEmail: bu.userEmail || bu.userId,
        logs: [],
        isBlocked: true
      });
    });

    // Then merge with chat logs
    data.forEach(log => {
      const key = log.userId || "GUEST";
      if (!map.has(key)) {
        map.set(key, { 
          userId: log.userId, 
          userName: log.userName || (log.userId ? "Pengguna Tanpa Nama" : "Pengguna Tamu"),
          userEmail: log.userEmail || (log.userId ? log.userId : "Guest"), 
          logs: [],
          isBlocked: false
        });
      }
      const existing = map.get(key)!;
      existing.logs.push(log);
      
      // Update name/email from log if it was previously missing (e.g. from an old block record)
      if (existing.userName === "Pengguna Terblokir" && log.userName) {
        existing.userName = log.userName;
      }
      if (existing.userEmail === key && log.userEmail) {
        existing.userEmail = log.userEmail;
      }
    });

    return Array.from(map.values()).filter((user) => {
      if (!search) return true;
      const lowerSearch = search.toLowerCase();
      return (
        user.userName.toLowerCase().includes(lowerSearch) ||
        user.userEmail.toLowerCase().includes(lowerSearch) ||
        (user.userId && user.userId.toLowerCase().includes(lowerSearch))
      );
    });
  }, [data, blockedUsers, search]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const toggleUserRow = (key: string) => {
    setExpandedUser(expandedUser === key ? null : key);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna KI.AI</h1>
        <p className="text-sm text-gray-500">
          Daftar pengguna yang berinteraksi dengan AI. Anda dapat mereset kuota per hari atau menghapus riwayat mereka secara total dari sistem.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau User ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4731] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-3" size={40} />
            <p>Memuat rekam riwayat pengguna...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 px-6 text-red-500">
            <AlertCircle className="mx-auto mb-3" size={40} />
            <p className="font-semibold">{error}</p>
            <button onClick={fetchData} className="mt-4 text-sm underline text-gray-500">Coba lagi</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nama Pengguna</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email / Identitas (UID)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total Sesi</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {groupedUsers.map((user) => {
                  const key = user.userId || "GUEST";
                  const isExpanded = expandedUser === key;

                  return (
                    <React.Fragment key={key}>
                      <tr 
                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                        onClick={() => toggleUserRow(key)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-[#1a4731] text-white flex items-center justify-center font-bold text-sm tracking-widest uppercase">
                               {user.userName.charAt(0)}
                             </div>
                             <span className="font-semibold text-gray-900">{user.userName}</span>
                             {user.isBlocked && (
                               <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded flex items-center gap-1">
                                 Terblokir
                               </span>
                             )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">{user.userEmail}</span>
                            {user.userId && (
                              <span className="text-[10px] text-gray-400 tracking-wider">UID: {user.userId}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold whitespace-nowrap border border-green-100">
                            {user.logs.length} Pertanyaan
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => toggleUserRow(key)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                              title="Tampilkan Detail Riwayat"
                            >
                              <MessageSquare size={14} /> Detail
                            </button>
                            
                            <button
                              onClick={(e) => handleResetUser(user.userId, e)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100"
                              title="Reset Limit (Hapus pertanyaan hari ini saja)"
                            >
                              <RefreshCcw size={14} /> Reset Limit
                            </button>
                            
                            {user.isBlocked ? (
                              <button
                                onClick={(e) => handleUnblock(user.userId, e)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-green-100"
                                title="Buka blokir akun ini"
                              >
                                <UserCheck size={14} /> Buka Blokir
                              </button>
                            ) : (
                              <button
                                onClick={(e) => handleWipeUser(user.userId, e)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                                title="Hapus total seluruh riwayat pertanyaan pengguna ini"
                              >
                                <Trash2 size={14} /> Hapus Data
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Section for User's Chat History */}
                      {isExpanded && (
                        <tr className="bg-gray-50/80">
                          <td colSpan={4} className="p-0">
                            <div className="border-l-4 border-l-[#1a4731] pl-6 pr-6 py-5 shadow-inner">
                              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <MessageSquare size={16} className="text-[#1a4731]" />
                                Histori Pertanyaan <span className="opacity-50">({user.logs.length})</span>
                              </h4>
                              
                              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {user.logs.map((log) => (
                                  <div key={log.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                        <Calendar size={14} />
                                        {formatDate(log.createdAt)}
                                      </div>
                                      <button 
                                        onClick={(e) => handleDelete(log.id, e)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        title="Hapus satuan"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                    <div className="mb-3">
                                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded mb-2 uppercase tracking-wide">
                                        Pertanyaan
                                      </span>
                                      <p className="text-gray-900 font-medium leading-relaxed">{log.question}</p>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                      <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="inline-block px-2 py-0.5 bg-[#1a4731] text-white text-[10px] font-bold rounded uppercase tracking-wide">
                                          Jawaban KI.AI
                                        </span>
                                        {log.feedbacks && log.feedbacks.length > 0 && (
                                          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${log.feedbacks[0].isHelpful ? 'text-green-600' : 'text-red-600'}`}>
                                            {log.feedbacks[0].isHelpful ? (
                                              <><ThumbsUp size={12} className="fill-current" /> Bermanfaat</>
                                            ) : (
                                              <><ThumbsDown size={12} className="fill-current" /> Kurang Bermanfaat</>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                        {log.answer || <span className="italic text-gray-400">Jawaban belum terekam di database.</span>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                
                {groupedUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-20 text-gray-400">
                      <HelpCircle className="mx-auto mb-2 opacity-20" size={48} />
                      <p>Tidak ada pengguna yang ditemukan.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
