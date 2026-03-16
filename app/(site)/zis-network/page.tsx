import { ExternalLink, Heart } from 'lucide-react';
import { zisPrograms, formatCurrency, calcProgress } from '@/lib/dummy-data';

const categoryColors: Record<string, string> = {
  Pendidikan: 'bg-blue-100 text-blue-700',
  Wakaf: 'bg-green-100 text-green-700',
  Kemanusiaan: 'bg-red-100 text-red-700',
  Zakat: 'bg-yellow-100 text-yellow-700',
  Kesehatan: 'bg-purple-100 text-purple-700',
};

export default function ZISNetworkPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#c9a227] via-[#b8891f] to-[#1a4731] py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-white text-sm mb-4">
            <Heart size={14} fill="currentColor" className="text-red-300" />
            <span>Bersama Amanahzakat.id</span>
          </div>
          <h1 className="text-white font-bold text-4xl font-serif">ZIS Network</h1>
          <p className="text-white/80 text-base mt-3 max-w-xl mx-auto">
            Program Zakat, Infaq, dan Sedekah untuk membangun ummat. Setiap donasi Anda adalah amal jariyah yang terus mengalir.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { label: 'Program Aktif', value: '60+' },
              { label: 'Total Donatur', value: '125rb+' },
              { label: 'Dana Tersalur', value: 'Rp 12,5 M' },
              { label: 'Mustahik', value: '45rb+' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-2xl font-serif">{value}</p>
                <p className="text-white/70 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Info Banner */}
        <div className="bg-white border border-[#c9a227]/30 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 font-serif text-lg">Program dari Amanahzakat.id</h3>
            <p className="text-gray-500 text-sm mt-1">
              Seluruh program donasi dikelola secara profesional dan transparan oleh Amanahzakat.id. Klik tombol donasi untuk menyalurkan bantuan Anda.
            </p>
          </div>
          <a
            href="https://amanahzakat.id"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-[#c9a227] hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Kunjungi Amanahzakat.id <ExternalLink size={16} />
          </a>
        </div>

        <h2 className="font-bold text-xl text-gray-900 font-serif border-l-4 border-[#c9a227] pl-3 mb-6">Program Aktif</h2>

        {/* ZIS Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {zisPrograms.map((prog) => {
            const pct = calcProgress(prog.collected, prog.target);
            const colorClass = categoryColors[prog.category] || 'bg-gray-100 text-gray-700';

            return (
              <div key={prog.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover shadow-sm hover:shadow-lg hover:border-[#c9a227]/30 transition-all">
                {/* Photo */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={prog.image} alt={prog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${colorClass} backdrop-blur-sm`}>
                      {prog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-gray-900 font-bold text-sm leading-snug font-serif">{prog.title}</h3>
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{prog.description}</p>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-gray-500">Terkumpul</span>
                      <span className="font-bold text-[#c9a227]">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full transition-all duration-1000"
                        style={{
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, #c9a227 0%, #f0c040 100%)',
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <div>
                        <p className="font-bold text-[#1a4731] text-sm">{formatCurrency(prog.collected)}</p>
                        <p className="text-gray-400">terkumpul</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-700 text-sm">{formatCurrency(prog.target)}</p>
                        <p className="text-gray-400">target</p>
                      </div>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <a
                    href="https://amanahzakat.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-[#c9a227] hover:bg-yellow-600 text-white text-sm font-bold py-3 rounded-xl transition-all hover:gap-3 group"
                  >
                    <Heart size={16} fill="currentColor" />
                    Donasi Sekarang
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bottom */}
        <div className="mt-12 text-center py-12 bg-gradient-to-br from-[#1a4731] to-[#311c58] rounded-3xl text-white px-6">
          <h3 className="font-bold text-2xl font-serif">Jadilah Bagian dari Kebermanfaatan</h3>
          <p className="text-gray-200 text-sm mt-2 max-w-md mx-auto">
            Setiap rupiah yang Anda donasikan dikelola secara amanah untuk kemaslahatan umat. Bersama kita membangun Indonesia yang lebih baik.
          </p>
          <a
            href="https://amanahzakat.id"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-[#c9a227] hover:bg-yellow-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            Mulai Berdonasi <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
