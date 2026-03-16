'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { breakingNews } from '@/lib/dummy-data';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/berita', label: 'Berita Update' },
  { href: '/mcn-play', label: 'MCN Play' },
  { href: '/opini', label: 'Opini' },
  { href: '/konsultasi', label: 'Konsultasi' },
  { href: '/mcn-academy', label: 'MCN Academy' },
  { href: '/zis-network', label: 'ZIS Network' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % breakingNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Breaking News Bar */}
      <div className="bg-red-600 text-white text-sm py-1.5 px-4 flex items-center gap-3 overflow-hidden">
        <span className="font-bold text-xs bg-white text-red-600 px-2 py-0.5 rounded shrink-0 uppercase tracking-wider">
          Breaking
        </span>
        <div className="overflow-hidden flex-1 relative h-5">
          <p
            key={tickerIndex}
            className="absolute inset-0 flex items-center"
            style={{ animation: 'fadeInUp 0.4s ease both' }}
          >
            {breakingNews[tickerIndex]}
          </p>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`bg-[#0f2d1f] transition-shadow duration-300 ${scrolled ? 'shadow-xl' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2d6b4a] to-[#4a2c82] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm font-serif">M</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl font-serif tracking-wide">MCN</span>
              <span className="text-[#c9a227] font-bold text-xl font-serif">.ID</span>
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
      <div className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-0 overflow-x-auto">
          {['Nasional', 'Keislaman', 'Tokoh', 'Ekonomi', 'Pendidikan', 'Internasional', 'Sosial', 'Hukum'].map((cat) => (
            <Link
              key={cat}
              href={`/berita?kategori=${cat.toLowerCase()}`}
              className="text-xs font-semibold text-gray-600 hover:text-[#1a4731] py-2.5 px-4 hover:bg-gray-50 transition-colors border-b-2 border-transparent hover:border-[#1a4731] whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
