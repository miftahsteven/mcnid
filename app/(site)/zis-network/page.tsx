import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Heart, ShieldCheck, Globe, Users } from "lucide-react";
import { getZisPrograms } from "@/lib/zis-api";
import { formatCurrency, calcProgress } from "@/lib/dummy-data";

export const metadata = {
  title: 'ZIS Network — Zakat, Infaq & Sedekah | MCNID.NET',
  description:
    'Program penghimpunan dan penyaluran Zakat, Infaq, dan Sedekah yang transparan, bekerjasama dengan Amanah Zakat. Bantu sesama melalui ZIS Network MCNID.NET.',
  alternates: {
    canonical: 'https://mcnid.net/zis-network',
  },
  openGraph: {
    title: 'ZIS Network — Donasi & ZIS Transparan | MCNID.NET',
    description:
      'Program ZIS yang transparan bersama Amanah Zakat. Bantu sesama melalui ZIS Network MCNID.NET.',
    url: 'https://mcnid.net/zis-network',
    siteName: 'MCNID.NET',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: '/logomcnid.jpeg', width: 1200, height: 630, alt: 'ZIS Network MCN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZIS Network | MCNID.NET',
    description: 'Program ZIS transparan bersama Amanah Zakat.',
  },
};

export default async function ZisNetworkPage() {
  const programs = await getZisPrograms(0, 40); // Ambil 40 program terbaru

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-[#1a4731] text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors text-sm font-medium group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
                ZIS <span className="text-[#c9a227]">Network</span>
              </h1>
              <p className="text-gray-300 mt-4 text-lg leading-relaxed">
                Menghubungkan kebaikan Anda dengan mereka yang membutuhkan. Platform transparansi penyaluran Zakat, Infaq, dan Sedekah.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pb-1">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <ShieldCheck size={16} className="text-[#c9a227]" />
                <span className="text-xs font-bold uppercase tracking-wider">Terpercaya</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Globe size={16} className="text-[#c9a227]" />
                <span className="text-xs font-bold uppercase tracking-wider">Nasional</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {programs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-5xl">🌱</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-serif">Penyelarasan Data Sedang Berlangsung</h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
              Kami sedang menyinkronkan daftar program kebaikan terbaru dari <strong>amanahzakat.id</strong>. Akses donasi tetap tersedia langsung melalui portal mitra kami.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://amanahzakat.id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#c9a227] hover:bg-yellow-600 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/30 flex items-center gap-3"
              >
                Kunjungi AmanahZakat.id <ArrowUpRight size={20} />
              </a>
              <Link 
                href="/"
                className="text-gray-500 hover:text-[#1a4731] font-bold py-4 px-10 rounded-xl transition-all"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#1a4731]">
                  <Heart size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Program</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{programs.length}+</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-[#c9a227]">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Penerima Manfaat</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">Ribuan</p>
                </div>
              </div>
              <div className="bg-[#c9a227] p-6 rounded-2xl shadow-lg border border-[#c9a227] flex items-center gap-5 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ArrowUpRight size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Mitra Portal</p>
                  <p className="text-xl font-bold mt-0.5">Amanah Zakat</p>
                </div>
              </div>
            </div>

            {/* Program Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {programs.map((prog) => {
                const pct = calcProgress(prog.collected, prog.target);
                return (
                  <div
                    key={prog.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={prog.image}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold text-white bg-[#1a4731] px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
                          {prog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-gray-900 font-bold text-base leading-snug font-serif line-clamp-2 h-12 group-hover:text-[#c9a227] transition-colors">
                        {prog.title}
                      </h3>
                      <div className="mt-4 space-y-3 flex-1">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#c9a227] to-[#e4bc3c] h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Terkumpul</p>
                            <p className="text-[#1a4731] font-bold text-sm">
                              {formatCurrency(prog.collected)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target</p>
                            <p className="text-gray-700 font-semibold text-xs">
                              {formatCurrency(prog.target)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <a
                        href={prog.donationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 w-full py-3 bg-[#c9a227] hover:bg-yellow-600 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-yellow-500/20 text-center"
                      >
                        Donasi Sekarang
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Partnership Footer */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 grayscale opacity-50">
                    <img src="https://amanahzakat.id/assets/img/logo/logo-fix.png" alt="Amanah Zakat" className="w-full h-full object-contain" />
                 </div>
                 <div className="max-w-md">
                   <h4 className="text-gray-900 font-bold font-serif italic text-lg">Kerjasama MCNID & Amanah Zakat</h4>
                   <p className="text-gray-500 text-xs mt-1">
                     Seluruh program donasi dikelola oleh AMANAH ZAKAT LAZIA sebagai mitra resmi transparansi ZIS nasional.
                   </p>
                 </div>
               </div>
               <a 
                 href="https://amanahzakat.id" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-[#1a4731] font-bold text-sm flex items-center gap-2 hover:underline"
               >
                 Pelajari Lebih Lanjut <ArrowUpRight size={16} />
               </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
