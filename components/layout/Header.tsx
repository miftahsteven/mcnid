"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { breakingNews } from "@/lib/dummy-data";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/berita", label: "Berita Update" },
  { href: "/mcn-play", label: "MCN Play" },
  { href: "/opini", label: "Opini" },
  { href: "/konsultasi", label: "Konsultasi" },
  { href: "/mcn-academy", label: "MCN Academy" },
  { href: "/zis-network", label: "ZIS Network" },
];

interface PrayerSchedule {
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [prayerTimes, setPrayerTimes] = useState<{ label: string; time: string }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch Prayer Times
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        // Jakarta city ID for MyQuran API is 1301
        const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1301/${year}/${month}/${day}`);
        const json = await res.json();
        
        if (json.status && json.data && json.data.jadwal) {
          const schedule: PrayerSchedule = json.data.jadwal;
          const timesArray = [
            { label: 'Imsak', time: schedule.imsak },
            { label: 'Subuh', time: schedule.subuh },
            { label: 'Terbit', time: schedule.terbit },
            { label: 'Dhuha', time: schedule.dhuha },
            { label: 'Dzuhur', time: schedule.dzuhur },
            { label: 'Ashar', time: schedule.ashar },
            { label: 'Maghrib', time: schedule.maghrib },
            { label: 'Isya', time: schedule.isya },
          ];
          setPrayerTimes(timesArray);
        }
      } catch (error) {
        console.error("Failed to fetch prayer times:", error);
      }
    };
    
    fetchPrayerTimes();
  }, []);

  // Ticker Logic
  useEffect(() => {
    if (prayerTimes.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % prayerTimes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <header className="sticky top-0 z-50">
      {/* Prayer Times Bar */}
      <div className="bg-red-600 text-white text-sm py-1.5 px-4 flex items-center justify-between md:justify-start gap-4 flex-wrap">
        <span className="font-bold text-[10px] md:text-xs bg-white text-red-600 px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap hidden sm:block">
          Jadwal Sholat Jakarta
        </span>
        <span className="font-bold text-[10px] bg-white text-red-600 px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap sm:hidden">
          Jadwal Sholat
        </span>
        
        <div className="flex-1 overflow-hidden relative h-5 min-w-[120px]">
          {prayerTimes.length > 0 ? (
            <p
              key={tickerIndex}
              className="absolute inset-0 flex items-center text-xs md:text-sm font-semibold tracking-wide"
              style={{ animation: "fadeInUp 0.5s ease both" }}
            >
              {prayerTimes[tickerIndex].label} <span className="text-red-200 ml-2">{prayerTimes[tickerIndex].time} WIB</span>
            </p>
          ) : (
            <p className="text-xs md:text-sm text-red-200 flex items-center h-full">Memuat jadwal...</p>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`bg-[#0f2d1f] transition-shadow duration-300 ${scrolled ? "shadow-xl" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2d6b4a] to-[#4a2c82] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm font-serif">M</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl font-serif tracking-wide">
                MCNID
              </span>
              <span className="text-[#c9a227] font-bold text-xl font-serif">
                .NET
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Mobile */}
          <div className="flex items-center gap-3">
            <button className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-white/10 transition-colors">
              <Search size={18} />
            </button>
            <button
              className="lg:hidden text-gray-300 hover:text-white p-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0f2d1f] px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-200 hover:text-white text-sm font-medium py-2.5 px-3 rounded-md hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Category Nav */}
      {/* Category Nav */}
      <div className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-0 overflow-x-auto no-scrollbar py-1">
            {[
              "Nasional",
              "Keislaman",
              "Tokoh",
              "Internasional",
              "Ekonomi",
              "Pendidikan",
              "Sosial",
              "Hukum",
              "MCN Play",
            ].map((cat) => (
              <Link
                key={cat}
                href={`/berita?kategori=${encodeURIComponent(cat)}`}
                className="text-[11px] font-bold text-gray-500 hover:text-[#1a4731] py-3.5 px-4 hover:bg-gray-50 transition-colors border-b-2 border-transparent hover:border-[#1a4731] whitespace-nowrap uppercase tracking-widest"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Date Display (Premium Style) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 py-2.5 px-4 bg-gray-50/50 border-x border-gray-100 h-full self-stretch">
            {mounted ? (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-[#1a4731] uppercase tracking-tighter leading-none mb-0.5">
                    {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())} M
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter leading-none">
                    {new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).replace(' Hijriah', ' H').replace(' H', '')} H
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                   <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] font-black text-red-600 uppercase">{new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date())}</span>
                      <span className="text-sm font-bold text-[#0f2d1f]">{new Date().getDate()}</span>
                   </div>
                </div>
              </>
            ) : (
              <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-lg"></div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
