'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Newspaper, Video, GraduationCap, Heart,
  Users, Settings, ChevronDown, ChevronRight, Globe,
  FileText, BarChart2, Image, Tag, MessageSquare, X, Menu
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin-panel',
    icon: LayoutDashboard,
  },
  {
    label: 'Posts',
    icon: Newspaper,
    children: [
      { label: 'Semua Berita', href: '/admin-panel/posts' },
      { label: 'Tambah Baru', href: '/admin-panel/posts/new' },
      { label: 'Kategori', href: '/admin-panel/posts/categories' },
      { label: 'Opini', href: '/admin-panel/posts/opinions' },
    ],
  },
  {
    label: 'MCN Play',
    icon: Video,
    children: [
      { label: 'Semua Video', href: '/admin-panel/videos' },
      { label: 'Tambah Video', href: '/admin-panel/videos/new' },
      { label: 'Kategori', href: '/admin-panel/videos/categories' },
    ],
  },
  {
    label: 'MCN Academy',
    icon: GraduationCap,
    children: [
      { label: 'Semua Kursus', href: '/admin-panel/courses' },
      { label: 'Tambah Kursus', href: '/admin-panel/courses/new' },
      { label: 'Siswa', href: '/admin-panel/courses/students' },
    ],
  },
  {
    label: 'ZIS Network',
    icon: Heart,
    children: [
      { label: 'Program', href: '/admin-panel/zis' },
      { label: 'Tambah Program', href: '/admin-panel/zis/new' },
      { label: 'Donatur', href: '/admin-panel/zis/donors' },
    ],
  },
  {
    label: 'Komentar',
    href: '/admin-panel/comments',
    icon: MessageSquare,
  },
  {
    label: 'Media',
    href: '/admin-panel/media',
    icon: Image,
  },
  {
    label: 'Pengguna',
    href: '/admin-panel/users',
    icon: Users,
  },
  {
    label: 'Statistik',
    href: '/admin-panel/analytics',
    icon: BarChart2,
  },
  {
    label: 'Pengaturan',
    icon: Settings,
    children: [
      { label: 'Umum', href: '/admin-panel/settings' },
      { label: 'SEO', href: '/admin-panel/settings/seo' },
      { label: 'Keamanan', href: '/admin-panel/settings/security' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGroup = (label: string) => {
    setCollapsed((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (children: { href: string }[]) =>
    children.some((c) => pathname.startsWith(c.href));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Site header */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d6b4a] to-[#4a2c82] flex items-center justify-center">
            <span className="text-white font-bold text-sm font-serif">M</span>
          </div>
          <div>
            <span className="text-white font-bold text-base font-serif">MCN</span>
            <span className="text-[#c9a227] font-bold text-base font-serif">.ID</span>
            <p className="text-gray-400 text-[10px] leading-none mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* View site link */}
      <a
        href="/"
        target="_blank"
        className="mx-3 mt-3 flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
      >
        <Globe size={13} />
        Lihat Website
      </a>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map((item) => {
          if (!item.children) {
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all ${
                  isActive(item.href!)
                    ? 'bg-[#2d6b4a] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          }

          const groupActive = isGroupActive(item.children);
          const isOpen = !collapsed.includes(item.label);

          return (
            <div key={item.label} className="mb-0.5">
              <button
                onClick={() => toggleGroup(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  groupActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
              {isOpen && (
                <div className="ml-8 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-2 py-1.5 text-xs rounded-md transition-all ${
                        isActive(child.href)
                          ? 'text-white font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div className="border-t border-white/10 p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1a4731] flex items-center justify-center text-white text-xs font-bold">
          SA
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate">Superadmin</p>
          <p className="text-gray-500 text-[10px] truncate">admin@mcn.id</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#1d2327] shrink-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9 bg-[#1d2327] rounded-lg flex items-center justify-center text-white shadow-lg"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-[#1d2327] flex flex-col overflow-hidden">
            <SidebarContent />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-black/50 flex items-start justify-end p-3"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      )}
    </>
  );
}
