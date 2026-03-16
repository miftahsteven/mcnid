import Link from 'next/link';
import { Clock, Eye, ChevronRight, Play, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { newsArticles, opinArticles, videos, courses, zisPrograms, formatDate, formatNumber, formatCurrency, calcProgress } from '@/lib/dummy-data';

// Helper: Category color
function getCategoryColor(cat: string) {
  const map: Record<string, string> = {
    Nasional: 'bg-blue-600',
    Keislaman: 'bg-green-700',
    Kegiatan: 'bg-orange-500',
    Tokoh: 'bg-purple-600',
    Opini: 'bg-gray-700',
  };
  return map[cat] || 'bg-[#1a4731]';
}

export default function HomePage() {
  const hero = newsArticles[0];
  const secondaries = newsArticles.slice(1, 4);
  const latestNews = newsArticles.slice(1, 7);
  const trending = [...newsArticles].sort((a, b) => b.views - a.views).slice(0, 5);
  const featuredVideo = videos[0];
  const videoList = videos.slice(1, 5);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HERO SECTION ─────────────────── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Hero */}
          <div className="lg:col-span-2">
            <Link href={`/berita/${hero.slug}`} className="group block relative overflow-hidden rounded-xl bg-gray-900 aspect-[16/9] shadow-lg">
              <img
                src={hero.image}
                alt={hero.title}
                className="w-full h-full object-cover opacity-75 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
              />
              <div className="news-gradient absolute inset-0 flex flex-col justify-end p-6">
                <span className={`badge-primary mb-3 self-start ${getCategoryColor(hero.category)}`}>
                  {hero.category}
                </span>
                <h1 className="text-white font-bold text-xl md:text-2xl leading-tight group-hover:underline underline-offset-2 transition-all font-serif">
                  {hero.title}
                </h1>
                <p className="text-gray-200 text-sm mt-2 line-clamp-2 hidden md:block">{hero.excerpt}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-300">
                  <span>{hero.author}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{formatDate(hero.publishedAt)}</span>
                  <span className="flex items-center gap-1"><Eye size={12} />{formatNumber(hero.views)}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary News - 3 vertical */}
          <div className="flex flex-col gap-4">
            {secondaries.map((article) => (
              <Link key={article.id} href={`/berita/${article.slug}`} className="group flex gap-3 bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#1a4731]/30 hover:shadow-md transition-all duration-200">
                <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 py-2 pr-3">
                  <span className={`badge-primary text-[10px] ${getCategoryColor(article.category)}`}>{article.category}</span>
                  <h3 className="text-gray-800 text-sm font-semibold leading-tight mt-1 line-clamp-2 group-hover:text-[#1a4731] transition-colors font-serif">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Clock size={11} />{formatDate(article.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS + SIDEBAR ─────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* News Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title mb-0 pb-0 border-none text-xl font-bold font-serif text-gray-900 border-l-4 border-[#1a4731] pl-3">
                Berita Terkini
              </h2>
              <Link href="/berita" className="text-[#1a4731] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Lihat Semua <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {latestNews.map((article) => (
                <Link key={article.id} href={`/berita/${article.slug}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#1a4731]/25 card-hover hover:shadow-md transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                  </div>
                  <div className="p-4">
                    <span className={`badge-primary ${getCategoryColor(article.category)}`}>{article.category}</span>
                    <h3 className="text-gray-900 font-bold text-sm leading-snug mt-2 line-clamp-2 group-hover:text-[#1a4731] transition-colors font-serif">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{article.author}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-0.5"><Eye size={11} />{formatNumber(article.views)}</span>
                        <span className="flex items-center gap-0.5"><Clock size={11} />{article.readingTime}m</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Trending */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2 font-serif">
                <TrendingUp size={16} className="text-red-500" /> Trending
              </h3>
              <div>
                {trending.map((art, idx) => (
                  <Link key={art.id} href={`/berita/${art.slug}`} className="sidebar-news-item group">
                    <span className="text-2xl font-bold text-gray-200 font-serif leading-none w-6 shrink-0 mt-1">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-gray-800 text-xs font-semibold line-clamp-3 group-hover:text-[#1a4731] transition-colors leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <Eye size={10} />{formatNumber(art.views)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* KI.AI Promo */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a4731 0%, #4a2c82 100%)' }}>
              <div className="p-5 text-white text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-bold font-serif text-lg">KI.AI</h3>
                <p className="text-xs text-gray-200 mt-1.5 leading-relaxed">
                  Tanya tentang Islam berdasarkan pemikiran KH Cholil Nafis
                </p>
                <Link href="/konsultasi" className="mt-4 inline-block bg-white text-[#1a4731] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
                  Mulai Konsultasi
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── VIDEO HIGHLIGHT ──────────────── */}
      <section className="bg-[#0f2d1f] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-xl font-serif flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-500 rounded-full inline-block"></span>
              MCN Play
            </h2>
            <Link href="/mcn-play" className="text-gray-300 text-sm hover:text-white flex items-center gap-1 transition-colors">
              Lihat Semua <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured video */}
            <Link href="/mcn-play" className="group relative rounded-xl overflow-hidden aspect-video block">
              <img src={featuredVideo.thumbnail} alt={featuredVideo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-between p-5">
                <div className="self-start bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  {featuredVideo.category}
                </div>
                <div>
                  <div className="play-btn mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                    <Play size={24} fill="currentColor" className="text-[#1a4731] ml-1" />
                  </div>
                  <h3 className="text-white font-bold text-base font-serif line-clamp-2">{featuredVideo.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
                    <span className="bg-black/50 px-2 py-0.5 rounded">{featuredVideo.duration}</span>
                    <span>{formatNumber(featuredVideo.views)} views</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Video list */}
            <div className="flex flex-col gap-3">
              {videoList.map((vid) => (
                <Link key={vid.id} href="/mcn-play" className="group flex gap-3 bg-white/10 hover:bg-white/15 rounded-lg overflow-hidden transition-colors">
                  <div className="relative w-32 aspect-video flex-shrink-0 overflow-hidden">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play size={18} fill="white" className="text-white" />
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="flex-1 py-3 pr-3">
                    <span className="text-xs text-[#c9a227] font-semibold">{vid.category}</span>
                    <h4 className="text-white text-sm font-semibold leading-snug mt-1 line-clamp-2 group-hover:text-gray-200 transition-colors">
                      {vid.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">{formatNumber(vid.views)} tayangan</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OPINI ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900 font-bold text-xl font-serif border-l-4 border-[#4a2c82] pl-3">Opini Terbaru</h2>
          <Link href="/opini" className="text-[#4a2c82] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {opinArticles.map((art) => (
            <Link key={art.id} href={`/opini/${art.slug}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 card-hover hover:border-[#4a2c82]/30">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img src={art.authorImage} alt={art.author} className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-gray-500 font-medium">{art.author}</span>
                </div>
                <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-3 group-hover:text-[#4a2c82] transition-colors font-serif">
                  {art.title}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen size={11} />{art.readingTime} min baca</span>
                  <span className="flex items-center gap-1"><Eye size={11} />{formatNumber(art.views)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MCN ACADEMY HIGHLIGHT ───────── */}
      <section className="bg-gradient-to-br from-[#1a4731] to-[#311c58] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold text-xl font-serif">MCN Academy</h2>
              <p className="text-gray-300 text-sm mt-1">Platform e-learning Islam terpercaya</p>
            </div>
            <Link href="/mcn-academy" className="btn-outline border-white text-white hover:bg-white hover:text-[#1a4731] text-sm px-4 py-2 rounded-lg font-semibold transition-all">
              Semua Kursus
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.slice(0, 4).map((course) => (
              <Link key={course.id} href="/mcn-academy" className="group bg-white rounded-xl overflow-hidden card-hover">
                <div className="aspect-video overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#1a4731] bg-green-50 px-2 py-0.5 rounded-full">{course.category}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${course.isFree ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                      {course.isFree ? 'GRATIS' : formatCurrency(course.price)}
                    </span>
                  </div>
                  <h3 className="text-gray-900 text-sm font-bold leading-snug line-clamp-2 font-serif">{course.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{course.instructor}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <span>⭐ {course.rating}</span>
                    <span>·</span>
                    <span>{formatNumber(course.students)} siswa</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZIS CAMPAIGN HIGHLIGHT ──────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 font-bold text-xl font-serif border-l-4 border-[#c9a227] pl-3">ZIS Network</h2>
            <p className="text-gray-500 text-sm mt-1">Program penghimpunan dan penyaluran ZIS</p>
          </div>
          <Link href="/zis-network" className="text-[#1a4731] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {zisPrograms.slice(0, 3).map((prog) => {
            const pct = calcProgress(prog.collected, prog.target);
            return (
              <div key={prog.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 card-hover shadow-sm">
                <div className="aspect-video overflow-hidden">
                  <img src={prog.image} alt={prog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-400" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-[#c9a227] bg-yellow-50 px-2 py-0.5 rounded-full">{prog.category}</span>
                  <h3 className="text-gray-900 font-bold text-sm mt-2 leading-snug font-serif">{prog.title}</h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{prog.description}</p>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Terkumpul {pct}%</span>
                      <span>{formatCurrency(prog.target)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-[#c9a227] h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                    <p className="text-[#1a4731] font-bold text-sm mt-1.5">{formatCurrency(prog.collected)}</p>
                  </div>
                  <a
                    href="https://amanahzakat.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full block text-center bg-[#c9a227] hover:bg-yellow-600 text-white text-sm font-bold py-2.5 rounded-lg transition-colors"
                  >
                    Donasi Sekarang
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
