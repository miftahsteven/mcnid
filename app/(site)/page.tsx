import Link from "next/link";
import HeroSlider, { HighlightItem } from "@/components/HeroSlider";
import {
  Clock,
  Eye,
  ChevronRight,
  Play,
  ArrowRight,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import {
  newsArticles,
  opinArticles,
  videos,
  courses,
  zisPrograms,
  formatDate,
  formatNumber,
  formatCurrency,
  calcProgress,
} from "@/lib/dummy-data";
import { getPublicImageUrl } from "@/lib/backend-config";

// Helper: Category color
function getCategoryColor(cat: string) {
  const map: Record<string, string> = {
    Nasional: "bg-blue-600",
    Keislaman: "bg-green-700",
    Kegiatan: "bg-orange-500",
    Tokoh: "bg-purple-600",
    Opini: "bg-gray-700",
  };
  return map[cat] || "bg-[#1a4731]";
}

export default async function HomePage() {
  let highlights: HighlightItem[] = [];
  let latestItems: HighlightItem[] = [];
  let latestPostsItems: HighlightItem[] = [];
  let latestVideosItems: any[] = [];
  let trending: any[] = [];
  
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    

    // Fetch highlights, latest mixed, latest pure posts, latest videos, and trending in parallel
    const [hlRes, latestRes, lpRes, lvRes, trendRes] = await Promise.all([
      fetch(`${API_URL}/api/highlights`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/latest`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/latest-posts`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/latest-videos`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/trending`, { next: { revalidate: 5 } })
    ]);

    if (hlRes.ok) highlights = (await hlRes.json()).data || [];
    if (latestRes.ok) latestItems = (await latestRes.json()).data || [];
    if (lpRes.ok) latestPostsItems = (await lpRes.json()).data || [];
    if (lvRes.ok) latestVideosItems = (await lvRes.json()).data || [];
    if (trendRes.ok) trending = (await trendRes.json()).data || [];
    
  } catch (err) {
    console.error("Failed to fetch public api data:", err);
  }

  // Filter out duplicates that are already in latestItems (Secondary list)
  const usedIds = new Set(latestItems.map(item => item.id));
  const beritaTerkini = latestPostsItems.filter(item => !usedIds.has(item.id)).slice(0, 6);

    
  // MCN Play API Logic
  const validVideos = latestVideosItems.length > 0 ? latestVideosItems : videos;
  const featuredVideo = validVideos[0];
  const videoList = validVideos.slice(1, 5);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero */}
          <div className="lg:col-span-2">
            <HeroSlider highlights={highlights} />
          </div>

          {/* Secondary News - 4 vertical */}
          <div className="flex flex-col justify-between h-full gap-3 overflow-hidden">
            {latestItems.map((article) => {
              const imageUrl = getPublicImageUrl(article.image);
                
              return (
                <Link
                  key={article.id}
                  href={article.type === "video" ? `/mcn-play/${article.slug}` : `/berita/${article.slug}`}
                  className="group flex gap-3 flex-1 bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#1a4731]/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-24 md:w-32 flex-shrink-0 relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    {article.type === "video" && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play size={16} fill="currentColor" className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 py-1.5 pr-3 flex flex-col justify-center">
                    <span
                      className={`badge-primary text-[9px] w-fit ${getCategoryColor(article.category)}`}
                    >
                      {article.category}
                    </span>
                    <h3 className="text-gray-800 text-sm font-semibold leading-tight mt-1 line-clamp-2 group-hover:text-[#1a4731] transition-colors font-serif">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-gray-400 text-[10px] mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatDate(article.publishedAt || "")}
                      </span>
                      {article.views > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye size={10} />
                          {formatNumber(article.views)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
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
              <Link
                href="/berita"
                className="text-[#1a4731] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Lihat Semua <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {beritaTerkini.map((article) => {
                const imageUrl = getPublicImageUrl(article.image);
                  
                return (
                  <Link
                    key={article.id}
                    href={`/berita/${article.slug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#1a4731]/30 card-hover hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span
                        className={`absolute bottom-3 left-3 badge-primary text-[10px] shadow-sm ${getCategoryColor(article.category)}`}
                      >
                        {article.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-gray-900 font-bold text-base leading-snug line-clamp-2 group-hover:text-[#1a4731] transition-colors font-serif">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                            <span className="text-[10px] font-bold text-gray-500">{article.author.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-medium text-gray-400">
                          {article.views > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye size={12} className="text-gray-400" />
                              {formatNumber(article.views)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" />
                            {formatDate(article.publishedAt || "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
                {trending.map((art: any, idx: number) => (
                  <Link
                    key={art.id}
                    href={art.type === 'video' ? `/mcn-play/${art.slug}` : `/berita/${art.slug}`}
                    className="sidebar-news-item group"
                  >
                    <span className="text-2xl font-bold text-gray-200 font-serif leading-none w-6 shrink-0 mt-1">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-gray-800 text-xs font-semibold line-clamp-3 group-hover:text-[#1a4731] transition-colors leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <Eye size={10} />
                        {formatNumber(art.views)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* KI.AI Promo */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1a4731 0%, #4a2c82 100%)",
              }}
            >
              <div className="p-5 text-white text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-bold font-serif text-lg">KI.AI</h3>
                <p className="text-xs text-gray-200 mt-1.5 leading-relaxed">
                  Tanya tentang Islam berdasarkan pemikiran KH Cholil Nafis
                </p>
                <Link
                  href="/konsultasi"
                  className="mt-4 inline-block bg-white text-[#1a4731] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Mulai Konsultasi
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── VIDEO HIGHLIGHT ──────────────── */}
      <section className="bg-[#0f2d1f] py-16 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a4731] rounded-full blur-[120px] opacity-30 mix-blend-screen pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white font-bold text-2xl font-serif flex items-center gap-3">
              <span className="w-1.5 h-7 bg-red-600 rounded-full inline-block shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
              MCN Play
            </h2>
            <Link
              href="/mcn-play"
              className="text-gray-300 text-sm hover:text-white flex items-center gap-1.5 transition-colors group"
            >
              <span className="group-hover:underline underline-offset-4">Lihat Semua Kumpulan Video</span> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured video */}
            <div className="lg:col-span-7 xl:col-span-8">
              <Link
                href={featuredVideo.slug ? `/mcn-play/${featuredVideo.slug}` : "/mcn-play"}
                className="group relative rounded-2xl overflow-hidden aspect-video block shadow-2xl ring-1 ring-white/10"
              >
                <img
                  src={getPublicImageUrl(featuredVideo.thumbnail)}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
                
                {/* Dark gradient mapping from bottom up */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                  {/* Category Badge positioned absolutely at top */}
                  <div className="absolute top-5 left-5 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-lg">
                    {featuredVideo.category || "MCN Play"}
                  </div>
                  
                  {/* Play Button Center Overlay */}
                  <div
                    className="play-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <Play
                      size={32}
                      fill="currentColor"
                      className="text-[#1a4731] ml-1.5"
                    />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-xl md:text-3xl font-serif line-clamp-2 leading-tight drop-shadow-md group-hover:text-red-400 transition-colors">
                      {featuredVideo.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-300 mt-3 font-medium">
                      <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded flex items-center gap-1.5 border border-white/10">
                        <Play size={10} fill="currentColor" /> {featuredVideo.duration || "Bermain"}
                      </span>
                      {featuredVideo.views > 0 && (
                        <span className="flex items-center gap-1.5 drop-shadow-md">
                          <Eye size={14} className="opacity-80" /> {formatNumber(featuredVideo.views)} tayangan
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Video list */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
              {videoList.map((vid: any) => (
                <Link
                  key={vid.id || vid.slug}
                  href={vid.slug ? `/mcn-play/${vid.slug}` : "/mcn-play"}
                  className="group flex gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all duration-300 border border-white/5 hover:border-white/20 hover:shadow-lg"
                >
                  <div className="relative w-36 md:w-40 aspect-video flex-shrink-0 overflow-hidden rounded-lg shadow-inner ring-1 ring-black/20">
                    <img
                      src={getPublicImageUrl(vid.thumbnail)}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <Play size={14} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      {vid.duration || "00:00"}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <span className="text-[10px] text-[#c9a227] font-bold tracking-wider uppercase mb-1">
                      {vid.category || "Berita"}
                    </span>
                    <h4 className="text-white text-sm font-semibold leading-snug line-clamp-3 group-hover:text-red-400 transition-colors font-serif">
                      {vid.title}
                    </h4>
                    {vid.views > 0 && (
                      <p className="text-gray-400 text-xs mt-2 flex items-center gap-1 font-medium">
                        <Eye size={12} className="opacity-70" />
                        {formatNumber(vid.views)}
                      </p>
                    )}
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
          <h2 className="text-gray-900 font-bold text-xl font-serif border-l-4 border-[#4a2c82] pl-3">
            Opini Terbaru
          </h2>
          <Link
            href="/opini"
            className="text-[#4a2c82] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Lihat Semua <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {opinArticles.map((art) => (
            <Link
              key={art.id}
              href={`/opini/${art.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 card-hover hover:border-[#4a2c82]/30"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={art.authorImage}
                    alt={art.author}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-gray-500 font-medium">
                    {art.author}
                  </span>
                </div>
                <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-3 group-hover:text-[#4a2c82] transition-colors font-serif">
                  {art.title}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <BookOpen size={11} />
                    {art.readingTime} min baca
                  </span>
                  {art.views > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      {formatNumber(art.views)}
                    </span>
                  )}
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
              <h2 className="text-white font-bold text-xl font-serif">
                MCN Academy
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                Platform e-learning Islam terpercaya
              </p>
            </div>
            <Link
              href="/mcn-academy"
              className="btn-outline border-white text-white hover:bg-white hover:text-[#1a4731] text-sm px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Semua Kursus
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.slice(0, 4).map((course) => (
              <Link
                key={course.id}
                href="/mcn-academy"
                className="group bg-white rounded-xl overflow-hidden card-hover"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#1a4731] bg-green-50 px-2 py-0.5 rounded-full">
                      {course.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${course.isFree ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}
                    >
                      {course.isFree ? "GRATIS" : formatCurrency(course.price)}
                    </span>
                  </div>
                  <h3 className="text-gray-900 text-sm font-bold leading-snug line-clamp-2 font-serif">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {course.instructor}
                  </p>
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
            <h2 className="text-gray-900 font-bold text-xl font-serif border-l-4 border-[#c9a227] pl-3">
              ZIS Network
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Program penghimpunan dan penyaluran ZIS
            </p>
          </div>
          <Link
            href="/zis-network"
            className="text-[#1a4731] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Lihat Semua <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {zisPrograms.slice(0, 3).map((prog) => {
            const pct = calcProgress(prog.collected, prog.target);
            return (
              <div
                key={prog.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 card-hover shadow-sm"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-400"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-[#c9a227] bg-yellow-50 px-2 py-0.5 rounded-full">
                    {prog.category}
                  </span>
                  <h3 className="text-gray-900 font-bold text-sm mt-2 leading-snug font-serif">
                    {prog.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {prog.description}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Terkumpul {pct}%</span>
                      <span>{formatCurrency(prog.target)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#c9a227] h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <p className="text-[#1a4731] font-bold text-sm mt-1.5">
                      {formatCurrency(prog.collected)}
                    </p>
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
