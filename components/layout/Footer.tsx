import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a1f14] text-gray-300">
      {/* Top bar */}
      <div className="border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2d6b4a] to-[#4a2c82] flex items-center justify-center">
              <span className="text-white font-bold text-base font-serif">
                M
              </span>
            </div>
            <div>
              <span className="text-white font-bold text-2xl font-serif">
                MCN
              </span>
              <span className="text-[#c9a227] font-bold text-2xl font-serif">
                .ID
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center md:text-right max-w-md">
            Media Channel Network — Portal media Islam nasional modern yang
            menyajikan berita aktual, pemikiran moderat, dan edukasi Islam.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Twitter, href: "#", label: "Twitter/X" },
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Youtube, href: "#", label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2d6b4a] transition-colors duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Navigasi */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Navigasi
          </h4>
          <ul className="space-y-2">
            {[
              "Home",
              "Berita Update",
              "MCN Play",
              "Opini",
              "Konsultasi",
              "MCN Academy",
              "ZIS Network",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="/"
                  className="text-sm hover:text-white hover:translate-x-1 inline-flex transition-all duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kategori */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Kategori
          </h4>
          <ul className="space-y-2">
            {[
              "Nasional",
              "Keislaman",
              "Tokoh",
              "Ekonomi Syariah",
              "Pendidikan Islam",
              "Internasional",
            ].map((cat) => (
              <li key={cat}>
                <Link
                  href="/berita"
                  className="text-sm hover:text-white inline-flex transition-colors duration-200"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tentang */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Tentang Kami
          </h4>
          <ul className="space-y-2">
            {[
              "Profil MCN",
              "Redaksi",
              "Pedoman Media Siber",
              "Kebijakan Privasi",
              "Advertise",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-sm hover:text-white inline-flex transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Kontak
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <Mail size={15} className="mt-0.5 text-[#c9a227] shrink-0" />
              <span>redaksi@mcnid.net</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Phone size={15} className="mt-0.5 text-[#c9a227] shrink-0" />
              <span>+62 21 1234 5678</span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">
                Berlangganan newsletter:
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="bg-white/10 text-white text-xs px-3 py-2 rounded-l-md border border-white/20 focus:outline-none focus:border-[#2d6b4a] flex-1 placeholder-gray-500"
                />
                <button className="bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-xs px-3 py-2 rounded-r-md transition-colors">
                  Daftar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2026 MCNID.NET All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
