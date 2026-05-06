"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  Loader2,
  EyeOff,
  Globe,
  RefreshCw,
} from "lucide-react";

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-gray-100 text-gray-600",
  REVIEW: "bg-yellow-100 text-yellow-700",
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

interface Post {
  id: string;
  title: string;
  slug: string;
  type: string;
  subContent: string;
  status: string;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  author: { name: string };
  categories: { category: { name: string } }[];
  tags: { tag: { name: string } }[];
}

const getImageUrl = (coverImage: string | null) => {
  if (!coverImage) return null;
  let raw = coverImage;
  try {
    if (coverImage.startsWith("[") && coverImage.endsWith("]")) {
      const parsed = JSON.parse(coverImage);
      if (Array.isArray(parsed) && parsed.length > 0) raw = parsed[0];
    }
  } catch (e) {
    /* ignore */
  }

  if (raw.startsWith("http")) return raw.replace(/^http:/, "https:");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/^http:/, "https:");
  return `${baseUrl}/uploads/${raw.startsWith("/") ? raw.slice(1) : raw}`;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [activeType, setActiveType] = useState("Semua");

  const types = ["Semua", "Berita", "Opini"];

  const POSTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/posts");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengambil data");
      setPosts(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    const keyword = window.prompt("Masukkan keyword/topik berita yang ingin ditarik otomatis dari internet:", "");
    if (!keyword) return;
    if (
      !confirm(
        `Menarik berita dengan keyword "${keyword}"? Proses ini mungkin membutuhkan waktu beberapa saat.`
      )
    )
      return;
    try {
      setIsScraping(true);
      const res = await fetch("/api/admin/scraper/run", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: keyword })
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || json.message || "Gagal menarik berita");
      alert(json.message);
      fetchPosts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsScraping(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Apakah Anda yakin ingin menghapus artikel ini secara permanen?")
    )
      return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || data.message || "Gagal menghapus artikel",
        );
      fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const msg =
      currentStatus === "PUBLISHED"
        ? "Tarik kembali (Unpublish) artikel ini menjadi draft?"
        : "Publikasikan kembali artikel ini sekarang?";
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Gagal mengubah status");
      fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = posts.filter((p) => {
    const matchSearch =
      !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchType =
      activeType === "Semua" ||
      (activeType === "Opini"
        ? p.categories.some((c) => c.category.name.toLowerCase() === "opini")
        : activeType === "Berita"
          ? p.categories.some((c) => c.category.name.toLowerCase() === "berita")
          : true);
    return matchSearch && matchType;
  });

  // Reset to first page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeType]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginatedPosts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const getPaginationGroup = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("..");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("..");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {posts.length} total artikel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleScrape}
            disabled={isScraping}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {isScraping ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            Tarik Berita
          </button>
          <Link
            href="/admin-panel/posts/new"
            className="flex items-center gap-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Tambah Baru
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-40">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a4731]"
          />
        </div>
        <div className="flex items-center gap-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeType === t ? "bg-[#1a4731] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-nowrap">
          <Filter size={13} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-sm">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 px-4 text-red-500">
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-2 text-xs underline text-gray-500 hover:text-gray-700"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="hidden md:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Penulis
                  </th>
                  <th className="hidden sm:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tipe & Kategori
                  </th>
                  <th className="hidden lg:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sub Kontent
                  </th>
                  {/* <th className="hidden sm:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tag
                  </th> */}
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden md:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tanggal Posting
                  </th>
                  <th className="px-3 py-3 text-right pr-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 hidden sm:block bg-gray-100">
                          {post.coverImage ? (
                            <img
                              src={getImageUrl(post.coverImage) || ""}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[200px] lg:max-w-xs xl:max-w-sm truncate">
                            {post.title}
                          </p>
                          {/* <p className="text-xs text-gray-400 mt-0.5">
                            {post.categories[0]?.category.name ||
                              "Tanpa Kategori"}
                          </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {post.author.name}
                    </td>
                    <td className="hidden sm:table-cell px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase whitespace-nowrap ${
                            post.type?.toUpperCase() === "HIGHLIGHT"
                              ? "bg-purple-100 text-purple-700"
                              : post.type?.toUpperCase() === "NEWS"
                                ? "bg-blue-100 text-blue-700"
                                : post.type?.toUpperCase() === "OPINION"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {post.type?.toUpperCase() || "BERITA"}
                        </span>
                        {post.categories.slice(0, 1).map((c) => (
                          <span
                            key={c.category.name}
                            className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap"
                          >
                            {c.category.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {post.subContent || "Nasional"}
                    </td>
                    {/* <td className="hidden sm:table-cell px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.map((t) => (
                          <span
                            key={t.tag.name}
                            className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {t.tag.name}
                          </span>
                        ))}
                      </div>
                    </td> */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[post.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {post.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td className="px-3 py-3 pr-5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin-panel/posts/${post.id}`}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </Link>
                        {post.status === "PUBLISHED" ? (
                          <button
                            onClick={() =>
                              handleToggleStatus(post.id, post.status)
                            }
                            className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors"
                            title="Unpublish (Jadikan Draft)"
                          >
                            <EyeOff size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleToggleStatus(post.id, post.status)
                            }
                            className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                            title="Publikasikan"
                          >
                            <Globe size={14} />
                          </button>
                        )}
                        {post.status === "PUBLISHED" && (
                          <a
                            href={`/berita/${post.slug}`}
                            target="_blank"
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                            title="Lihat di Web"
                          >
                            <Eye size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors ml-1"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-24 text-gray-400">
                <Search size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Tidak ada artikel ditemukan</p>
              </div>
            )}

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="text-xs text-gray-500">
                  Menampilkan{" "}
                  <span className="font-semibold">
                    {(currentPage - 1) * POSTS_PER_PAGE + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold">
                    {Math.min(currentPage * POSTS_PER_PAGE, filtered.length)}
                  </span>{" "}
                  dari <span className="font-semibold">{filtered.length}</span>{" "}
                  artikel
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-[10px] font-bold">{"<<"}</span>
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-[10px] font-bold">{"<"}</span>
                  </button>

                  {getPaginationGroup().map((page, index) =>
                    page === ".." ? (
                      <span
                        key={`dots-${index}`}
                        className="px-2 text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-all ${
                          currentPage === page
                            ? "bg-[#1a4731] text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-[10px] font-bold">{">"}</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-[10px] font-bold">{">>"}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
