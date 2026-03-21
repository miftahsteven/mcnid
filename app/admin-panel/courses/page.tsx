"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Search, Star, Users, Edit, Trash2, GraduationCap,
  Globe, BookOpen, RefreshCcw, EyeOff, BookMarked,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.locale("id");

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  price: number;
  hasCertificate: boolean;
  status: string;
  durationHours: number | null;
  coverImage: string | null;
  createdAt: string;
  author: { name: string };
  _count: { modules: number; enrollments: number };
}

const LEVELS = ["Semua Level", "Pemula", "Menengah", "Mahir"];
const CATEGORIES = ["Semua", "Fiqh", "Aqidah", "Akhlak", "Syariah", "Quran", "Sirah", "Umum"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/courses", { cache: "no-store" });
      const data = await res.json();
      setCourses(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus kursus "${title}" secara permanen? Semua modul dan lesson akan ikut terhapus.`)) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Gagal menghapus"); }
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  const handleTogglePublish = async (c: Course) => {
    const newStatus = c.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const label = newStatus === "PUBLISHED" ? "Publikasikan" : "Turunkan ke Draft";
    if (!confirm(`${label} kursus "${c.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/courses/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      fetchCourses();
    } catch (err: any) { alert(err.message); }
  };

  const filtered = courses.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Semua" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  const totalEnrollments = courses.reduce((a, c) => a + (c._count?.enrollments || 0), 0);
  const freeCourses = courses.filter((c) => c.price === 0).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">MCN Academy — Kursus</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} kursus terdaftar</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchCourses} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
            <RefreshCcw size={16} />
          </button>
          <Link href="/admin-panel/courses/new"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Plus size={15} /> Tambah Kursus
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Kursus", value: courses.length, icon: GraduationCap, color: "text-purple-600 bg-purple-50" },
          { label: "Total Siswa", value: totalEnrollments.toLocaleString("id"), icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Kursus Gratis", value: freeCourses, icon: Star, color: "text-green-600 bg-green-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kursus..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === c ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Memuat data kursus...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">{search || activeCategory !== "Semua" ? "Tidak ada kursus yang cocok." : "Belum ada kursus. Silakan tambah kursus baru."}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kursus</th>
                <th className="hidden md:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instruktur</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="hidden sm:table-cell text-right px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Siswa</th>
                <th className="hidden lg:table-cell text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {c.coverImage ? (
                        <img src={c.coverImage.startsWith("http") ? c.coverImage : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${c.coverImage}`}
                          alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 hidden sm:block">
                          <BookOpen size={18} className="text-purple-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs">{c.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">{c.category}</span>
                          <span className="text-[10px] text-gray-400">{c._count?.modules || 0} modul</span>
                          {c.hasCertificate && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">🎓 Sertifikat</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 py-3 text-xs text-gray-600">{c.author.name}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.price === 0 ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                      {c.price === 0 ? "Gratis" : `Rp ${c.price.toLocaleString("id")}`}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-3 text-xs text-gray-500 text-right">
                    <span className="flex items-center gap-1 justify-end"><Users size={11} />{c._count?.enrollments || 0}</span>
                  </td>
                  <td className="hidden lg:table-cell px-3 py-3 text-center">
                    {c.status === "PUBLISHED" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <Globe size={9} /> Published
                      </span>
                    ) : c.status === "ARCHIVED" ? (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Archived</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Draft</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin-panel/courses/${c.id}/modules`}
                        title="Kelola Modul" className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-500 transition-colors">
                        <BookMarked size={14} />
                      </Link>
                      <Link href={`/admin-panel/courses/${c.id}`}
                        title="Edit" className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors">
                        <Edit size={14} />
                      </Link>
                      <button onClick={() => handleTogglePublish(c)} title={c.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors">
                        {c.status === "PUBLISHED" ? <EyeOff size={14} /> : <Globe size={14} />}
                      </button>
                      <button onClick={() => handleDelete(c.id, c.title)} title="Hapus"
                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
