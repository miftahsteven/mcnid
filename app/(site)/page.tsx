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
  ArrowUpRight
} from "lucide-react";
import {
  newsArticles,
  opinArticles,
  videos,
  courses,
  formatDate,
  formatNumber,
  formatCurrency,
  calcProgress,
} from "@/lib/dummy-data";
import { getZisPrograms, ZisProgram } from "@/lib/zis-api";
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

// Helper: Category text color (detik style)
function getCategoryTextColor(cat: string) {
  const map: Record<string, string> = {
    Nasional: "text-blue-600",
    Keislaman: "text-green-700",
    Kegiatan: "text-orange-600",
    Tokoh: "text-purple-600",
    Opini: "text-gray-700",
  };
  return map[cat] || "text-[#1a4731]";
}

export default async function HomePage() {
  let highlights: HighlightItem[] = [];
  let latestItems: HighlightItem[] = [];
  let latestPostsItems: HighlightItem[] = [];
  let latestVideosItems: any[] = [];
  let trending: any[] = [];
  let opiniItems: any[] = [];

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


    // Fetch highlights, latest mixed, latest pure posts, latest videos, trending, and opini in parallel
    const [hlRes, latestRes, lpRes, lvRes, trendRes, opiniRes] = await Promise.all([
      fetch(`${API_URL}/api/highlights`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/latest`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/latest-posts`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/latest-videos`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/trending`, { next: { revalidate: 5 } }),
      fetch(`${API_URL}/api/posts?type=OPINION&limit=4`, { next: { revalidate: 60 } })
    ]);

    if (hlRes.ok) highlights = (await hlRes.json()).data || [];
    if (latestRes.ok) latestItems = (await latestRes.json()).data || [];
    if (lpRes.ok) latestPostsItems = (await lpRes.json()).data || [];
    if (lvRes.ok) latestVideosItems = (await lvRes.json()).data || [];
    if (trendRes.ok) trending = (await trendRes.json()).data || [];
    if (opiniRes.ok) opiniItems = (await opiniRes.json()).data || [];

  } catch (err) {
    console.error("Failed to fetch public api data:", err);
  }

  // Fetch ZIS live data
  const liveZis = await getZisPrograms(0, 4);

  // Filter out duplicates that are already in latestItems (Secondary list)
  const usedIds = new Set(latestItems.map(item => item.id));
  const beritaTerkini = latestPostsItems.filter(item => !usedIds.has(item.id)).slice(0, 6);


  // MCN Play API Logic
  const validVideos = latestVideosItems.length > 0 ? latestVideosItems : videos;
  const featuredVideo = validVideos[0];
  const videoList = validVideos.slice(1, 5);

  // Use real opini data or fallback to dummy
  const finalOpini = opiniItems.length > 0 ? opiniItems : opinArticles;

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
                  href={
                    article.type === "video"
                      ? `/mcn-play/${article.slug}`
                      : (article.type === "OPINION" ? `/opini/${article.slug}` : `/berita/${article.slug}`)
                  }
                  className="group flex gap-3 flex-1 bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#1a4731]/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-24 md:w-28 flex-shrink-0 relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Absolutely positioned category badge on the image */}
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-sm text-white ${getCategoryColor(article.category)}`}
                      >
                        {article.category}
                      </span>
                    </div>
                    {article.type === "video" && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                        <Play size={16} fill="currentColor" className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 py-2 pr-3 flex flex-col justify-center">
                    <h3
                      title={article.title}
                      className="text-gray-800 text-xs md:text-[13px] font-semibold leading-snug group-hover:text-[#1a4731] transition-colors font-serif"
                    >
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
                    href={article.type === "OPINION" ? `/opini/${article.slug}` : `/berita/${article.slug}`}
                    className="group flex flex-col w-full bg-transparent transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 relative mb-3">
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className={`text-[11px] sm:text-xs font-semibold ${getCategoryTextColor(article.category)}`}>
                        {article.category}
                      </span>
                      <h3
                        title={article.title}
                        className="text-neutral-800 font-medium sm:font-semibold text-[13.5px] sm:text-[14.5px] leading-snug group-hover:text-[#1a4731] transition-colors font-sans mt-0.5"
                      >
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] sm:text-[11px] mt-1 font-medium">
                        <span>{formatDate(article.publishedAt || "")}</span>
                        {article.views > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Eye size={10} />
                              {formatNumber(article.views)}
                            </span>
                          </>
                        )}
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
                      <h4
                        title={art.title}
                        className="text-gray-800 text-xs font-semibold line-clamp-3 group-hover:text-[#1a4731] transition-colors leading-snug"
                      >
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
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[600px] scrollbar-thin">
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
          {finalOpini.map((art) => {
            const artImage = art.image || getPublicImageUrl(art.coverImage);
            const authorName = art.author?.name || art.author || "Redaksi MCN";
            const authorImg = art.authorImage || getPublicImageUrl(art.author?.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

            return (
              <Link
                key={art.id}
                href={`/opini/${art.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 card-hover hover:border-[#4a2c82]/30"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={artImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {/* <img
                      src={authorImg}
                      alt={authorName}
                      className="w-6 h-6 rounded-full object-cover"
                    /> */}
                    <span className="text-xs text-gray-500 font-medium">
                      {authorName}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#4a2c82] transition-colors font-serif mb-2">
                    {art.title}
                  </h3>
                  {art.excerpt && (
                    <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mb-4">
                      {art.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-auto text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} />
                      {art.readingTime || 5} min baca
                    </span>
                    {(art.views > 0 || art.viewCount > 0) && (
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {formatNumber(art.views || art.viewCount || 0)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
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
              Program penghimpunan dan penyaluran ZIS bekerjasama dengan amanahzakat.id
            </p>
          </div>
          <Link
            href="/zis-network"
            className="text-[#1a4731] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Lihat Semua <ArrowRight size={15} />
          </Link>
        </div>

        {liveZis.length === 0 ? (
          <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-2xl p-10 text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-4xl">🤲</span>
            </div>
            <h3 className="text-gray-900 font-bold text-xl font-serif">Akses Donasi Langsung</h3>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed max-w-lg mx-auto">
              Saat ini data ZIS Network sedang dalam pembaharuan sistem. Anda dapat melihat program donasi dan menyalurkan zakat secara langsung melalui portal utama mitra kami di <strong>amanahzakat.id</strong>.
            </p>
            <a
              href="https://amanahzakat.id"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-[#c9a227] hover:bg-yellow-600 text-white font-bold py-3.5 px-10 rounded-full transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              Klik untuk Berdonasi <ArrowUpRight size={18} />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {liveZis.map((prog) => {
              const pct = calcProgress(prog.collected, prog.target);
              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 card-hover shadow-sm flex flex-col"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-white bg-[#c9a227] px-2 py-0.5 rounded shadow-sm">
                        {prog.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-gray-900 font-bold text-sm leading-snug font-serif line-clamp-2 h-10 group-hover:text-[#c9a227] transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-gray-500 text-[11px] mt-2 line-clamp-2 leading-relaxed flex-1">
                      {prog.description}
                    </p>
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1.5 font-medium">
                        <span>Terkumpul {pct}%</span>
                        <span>{formatCurrency(prog.target)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                        <div
                          className="bg-gradient-to-r from-[#c9a227] to-[#e4bc3c] h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <p className="text-[#1a4731] font-bold text-sm">
                        {formatCurrency(prog.collected)}
                      </p>
                    </div>
                    <a
                      href={prog.donationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full block text-center bg-white hover:bg-[#c9a227] border border-[#c9a227] text-[#c9a227] hover:text-white text-[11px] font-bold py-2 rounded-lg transition-all"
                    >
                      Donasi Sekarang
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
