import Link from 'next/link';
import { Plus, ExternalLink, Edit, Trash2, Heart } from 'lucide-react';
import { zisPrograms, formatCurrency, calcProgress } from '@/lib/dummy-data';

export default function ZISPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ZIS Network — Program</h1>
          <p className="text-sm text-gray-500 mt-0.5">{zisPrograms.length} program aktif</p>
        </div>
        <Link href="/admin-panel/zis/new"
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Program Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Program', value: '60+', color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Total Donatur', value: '125rb', color: 'text-green-600 bg-green-50' },
          { label: 'Dana Terkumpul', value: 'Rp 12,5M', color: 'text-blue-600 bg-blue-50' },
          { label: 'Dana Tersalur', value: 'Rp 10,2M', color: 'text-purple-600 bg-purple-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className={`text-xl font-bold font-serif ${s.color.split(' ')[0]}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Programs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {zisPrograms.map((prog) => {
          const pct = calcProgress(prog.collected, prog.target);
          return (
            <div key={prog.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-yellow-300 hover:shadow-sm transition-all group">
              <div className="relative aspect-video overflow-hidden">
                <img src={prog.image} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                  {prog.category}
                </span>
                <span className="absolute top-2 right-2 text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Aktif
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{prog.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prog.description}</p>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-bold text-yellow-600">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1.5">
                    <span className="text-green-600 font-semibold">{formatCurrency(prog.collected)}</span>
                    <span className="text-gray-400">{formatCurrency(prog.target)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg transition-colors">
                    <Edit size={13} /> Edit
                  </button>
                  <a href="https://amanahzakat.id" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-yellow-600 hover:bg-yellow-50 py-1.5 rounded-lg transition-colors">
                    <ExternalLink size={13} /> Lihat
                  </a>
                  <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
