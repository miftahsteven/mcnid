'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Clock, BookOpen, Star, Users, GraduationCap } from 'lucide-react';
import { courses, formatCurrency, formatNumber } from '@/lib/dummy-data';

const categories = ['Semua', 'Fiqh', 'Aqidah', 'Akhlak', 'Syariah', 'Quran', 'Sirah'];
const levels = ['Semua', 'Gratis', 'Berbayar'];

export default function MCNAcademyClient() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeLevel, setActiveLevel] = useState('Semua');

  const filtered = courses.filter((c) => {
    const matchCat = activeCategory === 'Semua' || c.category === activeCategory;
    const matchLevel = activeLevel === 'Semua' || (activeLevel === 'Gratis' ? c.isFree : !c.isFree);
    return matchCat && matchLevel;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a4731] via-[#2d6b4a] to-[#311c58] py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <GraduationCap size={32} className="text-[#c9a227]" />
          </div>
          <h1 className="text-white font-bold text-4xl font-serif">MCN Academy</h1>
          <p className="text-gray-200 text-base mt-3 max-w-xl mx-auto">
            Platform e-learning Islam terpercaya. Belajar fiqh, syariah, akhlak, dan Al-Qur'an dari ulama dan akademisi terbaik.
          </p>
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { label: 'Kursus Aktif', value: '50+' },
              { label: 'Total Siswa', value: '35rb+' },
              { label: 'Instruktur', value: '25' },
              { label: 'Sertifikat', value: '10rb+' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-2xl font-serif">{value}</p>
                <p className="text-gray-300 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 flex flex-wrap items-center gap-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Kategori</p>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === cat ? 'bg-[#1a4731] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="border-l border-gray-200 pl-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Level Harga</p>
            <div className="flex items-center gap-2">
              {levels.map((l) => (
                <button key={l} onClick={() => setActiveLevel(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeLevel === l ? 'bg-[#4a2c82] text-white border-[#4a2c82]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Link key={course.id} href="#" className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover hover:border-[#1a4731]/30 shadow-sm hover:shadow-md transition-all">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm ${course.isFree ? 'bg-green-500 text-white' : 'bg-[#4a2c82] text-white'}`}>
                    {course.isFree ? '✓ GRATIS' : formatCurrency(course.price)}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 text-[#1a4731] text-[10px] font-bold px-2 py-1 rounded-md">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#1a4731] transition-colors font-serif">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{course.description}</p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a4731] to-[#4a2c82] flex items-center justify-center text-white text-xs font-bold">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{course.instructor}</p>
                    <p className="text-[10px] text-gray-400">{course.instructorRole}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen size={11} />{course.lessons} lesson</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                    <Star size={11} fill="currentColor" />
                    <span>{course.rating}</span>
                    <span className="text-gray-400 font-normal">({formatNumber(course.students)})</span>
                  </div>
                </div>

                <button className="mt-4 w-full bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  {course.isFree ? 'Mulai Belajar Gratis' : 'Daftar Sekarang'}
                </button>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
            <p>Tidak ada kursus ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
