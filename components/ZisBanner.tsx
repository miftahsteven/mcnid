import Link from "next/link";
import React from "react";
import { Heart } from "lucide-react";

export default function ZisBanner() {
  return (
    <Link 
      href="/zis-network" 
      className="group block relative w-full overflow-hidden rounded-2xl shadow-md border border-gray-100 bg-[#0f2e20] transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* On desktop: vertical aspect ratio, On mobile: more horizontal/square */}
      <div className="relative aspect-[4/3] sm:aspect-[21/9] lg:aspect-[3/4] w-full">
        {/* Background Image */}
        <img 
          src="/zis-banner.png" 
          alt="Zakat Infaq Shodaqoh" 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#0f2e20]/60 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091f16] via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6 text-white text-left z-10">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4 lg:mb-6 shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <Heart size={20} className="text-white fill-white" />
          </div>
          
          <h3 className="text-xl lg:text-2xl font-bold font-serif leading-tight mb-2 text-emerald-50 drop-shadow-md">
            Wujudkan <span className="text-emerald-400">Senyum</span> Mereka Hari Ini
          </h3>
          
          <p className="text-xs lg:text-sm text-gray-200 mb-4 lg:mb-6 leading-relaxed opacity-90 line-clamp-3">
            Salurkan Zakat, Infaq, dan Shodaqoh Anda melalui layanan ZIS Network MCN dengan mudah, aman, dan tepat sasaran.
          </p>

          <button className="self-start px-5 py-2.5 lg:w-full lg:text-center text-sm font-semibold bg-emerald-500 text-white rounded-xl shadow-md hover:bg-emerald-400 hover:shadow-lg transition-all duration-300 group-active:scale-95">
            Tunaikan Sekarang
          </button>
        </div>
      </div>
    </Link>
  );
}
