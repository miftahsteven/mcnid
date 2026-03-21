"use client";
import {
  Bell,
  Search,
  ExternalLink,
  ChevronDown,
  Plus,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AdminTopbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      text: "Artikel baru menunggu review",
      time: "5 menit lalu",
      dot: "bg-blue-500",
    },
    {
      id: 2,
      text: 'Komentar baru di "Fatwa MUI"',
      time: "12 menit lalu",
      dot: "bg-green-500",
    },
    {
      id: 3,
      text: "Program ZIS baru ditambahkan",
      time: "1 jam lalu",
      dot: "bg-yellow-500",
    },
    {
      id: 4,
      text: "Pengguna baru terdaftar di Academy",
      time: "2 jam lalu",
      dot: "bg-purple-500",
    },
  ];

  return (
    <header className="bg-[#1d2327] border-b border-white/10 px-4 h-12 flex items-center justify-between z-30 shrink-0">
      {/* Left: Quick actions + search */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1">
          {/* <Link
            href="/admin-panel"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/mcnid_horizontal.png"
              alt="MCNID"
              className="h-6 w-auto rounded shadow-sm"
            />
          </Link> */}
          <Link
            href="/admin-panel/posts/new"
            className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-white/10 rounded transition-colors flex items-center gap-1"
          >
            <Plus size={12} /> Berita
          </Link>
          <Link
            href="/admin-panel/videos/new"
            className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-white/10 rounded transition-colors flex items-center gap-1"
          >
            <Plus size={12} /> Video
          </Link>
        </div>

        <div className="relative hidden md:block">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="search"
            placeholder="Cari di admin..."
            className="bg-white/5 border border-white/10 text-gray-300 text-xs rounded-md pl-8 pr-3 py-1.5 w-48 focus:outline-none focus:border-[#2d6b4a] focus:bg-white/10 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-2">
        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-white/10 rounded transition-colors"
        >
          <ExternalLink size={12} /> Lihat Website
        </a>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#1d2327]"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="font-bold text-sm text-gray-900">Notifikasi</p>
                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  4 baru
                </span>
              </div>
              <div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`}
                    ></div>
                    <div>
                      <p className="text-xs text-gray-800">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs text-[#1a4731] font-semibold hover:underline">
                  Lihat semua
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#1a4731] flex items-center justify-center text-white text-xs font-bold">
              SA
            </div>
            <span className="hidden sm:block text-xs font-medium">
              Superadmin
            </span>
            <ChevronDown size={12} className="hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">Superadmin</p>
                <p className="text-[10px] text-gray-400">admin@mcnid.net</p>
              </div>
              <Link
                href="/admin-panel/settings"
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Pengaturan
              </Link>
              <a
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Lihat Website
              </a>
              <div className="border-t border-gray-100 mt-1">
                <button
                  onClick={async () => {
                    await fetch("/api/admin/auth/logout", { method: "POST" });
                    window.location.href = "/admin-panel/login";
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={12} /> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
