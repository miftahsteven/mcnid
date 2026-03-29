import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  Newspaper, Video, GraduationCap, Heart, Users,
  Eye, TrendingUp, ArrowUpRight, Clock, Plus,
  MessageSquare, BarChart2, Activity, Flame
} from 'lucide-react';
import { newsArticles, formatNumber, formatDate } from '@/lib/dummy-data';

export const metadata: Metadata = { title: 'Dashboard' };

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

async function getDashboardStats() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;

    const res = await fetch(`${BACKEND_URL}/api/admin/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    return null;
  }
}


const recentPosts = newsArticles.slice(0, 5);
const recentComments = [
  { author: 'Budi Santoso', content: 'Artikel yang sangat informatif, terima kasih...', post: 'KH Cholil Nafis Pimpin Rapat...', time: '5 menit lalu', avatar: 'BS' },
  { author: 'Siti Aminah', content: 'Semoga program ini bisa terus berlanjut...', post: 'Zakat Produktif Menjadi Solusi...', time: '23 menit lalu', avatar: 'SA' },
  { author: 'Ahmad Fauzi', content: 'Mohon penjelasan lebih lanjut...', post: 'Fatwa MUI Terbaru: Investasi Kripto...', time: '1 jam lalu', avatar: 'AF' },
];

export default async function AdminDashboard() {
  const statsData = await getDashboardStats();

  const stats = [
    { label: 'Total News', value: statsData ? formatNumber(statsData.totalNews) : '0', change: 'Semua Kategori', icon: Newspaper, color: 'bg-blue-500', href: '/admin-panel/posts' },
    { label: 'Total Video', value: statsData ? formatNumber(statsData.totalVideo) : '0', change: 'Semua Kategori', icon: Video, color: 'bg-red-500', href: '/admin-panel/videos' },
    { label: 'Pendaftar Academy', value: statsData ? formatNumber(statsData.totalAcademy) : '0', change: 'Segera Hadir', icon: GraduationCap, color: 'bg-purple-500', href: '/admin-panel/courses' },
    { label: 'Total Online Realtime', value: statsData ? formatNumber(statsData.onlineRealtime) : '0', change: 'Simulasi Langsung', icon: Activity, color: 'bg-yellow-500', href: '#' },
    { label: 'Berita Trending', value: statsData ? formatNumber(statsData.trendingNews) : '0', change: '> 20 Tayangan', icon: Flame, color: 'bg-green-600', href: '/admin-panel/posts' },
    { label: 'Total Global Views', value: statsData ? formatNumber(statsData.totalViews) : '0', change: 'Artikel & Video', icon: Eye, color: 'bg-indigo-500', href: '/admin-panel/media-monitoring' },
  ];

  return (
    <div className="space-y-6 font-[var(--font-sans)]">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Selamat datang kembali, Superadmin 👋</p>
        </div>
        <Link
          href="/admin-panel/posts/new"
          className="flex items-center gap-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> Tulis Berita Baru
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#1a4731]/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 font-serif">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp size={11} /> {stat.change}
                </p>
              </div>
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center bg-opacity-10 group-hover:scale-110 transition-transform`}
                style={{ backgroundColor: `${stat.color.replace('bg-', '')}20` }}>
                <stat.icon size={20} className={stat.color.replace('bg-', 'text-')} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main content: Recent Posts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Artikel Terbaru</h2>
            <Link href="/admin-panel/posts" className="text-xs text-[#1a4731] font-semibold hover:underline flex items-center gap-1">
              Lihat Semua <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={10} />{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1"><Eye size={10} />{formatNumber(post.views)}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.category}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" title="Published"></span>
                  <span className="text-[10px] text-gray-400">Published</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-bold text-gray-900 text-sm mb-3">Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Berita Baru', href: '/admin-panel/posts/new', icon: Newspaper, color: 'text-blue-600 bg-blue-50' },
                { label: 'Upload Video', href: '/admin-panel/videos/new', icon: Video, color: 'text-red-600 bg-red-50' },
                { label: 'Kursus Baru', href: '/admin-panel/courses/new', icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
                { label: 'Program ZIS', href: '/admin-panel/zis/new', icon: Heart, color: 'text-yellow-600 bg-yellow-50' },
                { label: 'Tambah User', href: '/admin-panel/users', icon: Users, color: 'text-green-600 bg-green-50' },
                { label: 'Lihat Analitik', href: '/admin-panel/media-monitoring', icon: BarChart2, color: 'text-indigo-600 bg-indigo-50' },
              ].map((action) => (
                <Link key={action.label} href={action.href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-center group">
                  <div className={`w-8 h-8 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon size={16} />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <MessageSquare size={14} className="text-gray-400" /> Komentar Terbaru
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {recentComments.map((c, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-[#1a4731] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {c.avatar}
                    </div>
                    <span className="text-xs font-semibold text-gray-900">{c.author}</span>
                    <span className="text-[10px] text-gray-400 ml-auto">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-1 ml-8">{c.content}</p>
                  <p className="text-[10px] text-[#1a4731] ml-8 mt-0.5 truncate">{c.post}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
