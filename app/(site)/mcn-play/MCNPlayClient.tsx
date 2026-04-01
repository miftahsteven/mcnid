"use client";
import React, { useState, useEffect } from "react";
import { 
  Play, 
  Search, 
  TrendingUp, 
  Clock, 
  Home, 
  Layers, 
  ThumbsUp, 
  ThumbsDown,
  X,
  Menu,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import VideoCard from "@/components/video/VideoCard";

export default function MCNPlayClient() {
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("latest");
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Debounced search logic if needed, but for now simple state
  
  useEffect(() => {
    // Fetch categories
    fetch(`${API_URL}/api/videos/categories/active`)
      .then(res => res.json())
      .then(data => setCategories(data.data || []))
      .catch(err => console.error("Error fetching categories:", err));
  }, [API_URL]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      categoryId: activeCategory,
      sort: activeSort
    });
    
    fetch(`${API_URL}/api/videos?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setVideos(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, [search, activeCategory, activeSort, API_URL]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col font-sans">
      {/* Top Search Bar */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-4 justify-between transition-all">
        <div className="flex items-center gap-4">
          <div className="flex items-center group cursor-pointer" onClick={() => (window.location.href = '/')}>
            <div className="relative flex items-center bg-[#1a1a1a] px-3 py-1.5 rounded-sm shadow-2xl overflow-hidden border border-white/5 ring-1 ring-white/10">
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              
              <div className="w-1.5 h-6 bg-red-600 mr-2 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
              
              <span className="text-white font-black tracking-tight text-xl font-serif">
                 MCN<span className="text-red-600 ml-0.5 uppercase italic tracking-widest text-lg font-sans underline decoration-white/20 underline-offset-4">Play</span>
              </span>
              
              {/* Subtle periodic shine (Live TV feel) */}
              <div className="absolute inset-0 z-10 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-glimmer pointer-events-none"></div>
            </div>
            
            {/* Live Indicator (Desktop only) */}
            <div className="hidden sm:flex items-center gap-1.5 ml-4 px-2 py-0.5 rounded bg-red-600/10 border border-red-600/30">
               <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">HD</span>
            </div>
          </div>
          <style jsx global>{`
            @keyframes glimmer {
              0% { transform: translateX(-150%) skewX(-20deg); }
              20% { transform: translateX(150%) skewX(-20deg); }
              100% { transform: translateX(150%) skewX(-20deg); }
            }
            .animate-glimmer {
              animation: glimmer 6s infinite ease-in-out;
            }
          `}</style>
        </div>

        <div className={`flex-1 max-w-2xl mx-6 ${showMobileSearch ? 'fixed inset-0 z-[60] bg-[#0f0f0f] px-4 flex items-center h-16 animate-in slide-in-from-right duration-200' : 'hidden md:block'}`}>
          <div className="relative group w-full">
            {showMobileSearch && (
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="absolute left-[-8px] top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full md:hidden"
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
            )}
            <input 
              type="text" 
              placeholder="Cari video..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-[#121212] border border-white/10 rounded-full py-2 ${showMobileSearch ? 'pl-10' : 'px-12'} focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-gray-600`}
              autoFocus={showMobileSearch}
            />
            {!showMobileSearch && (
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
            )}
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 bg-red-600/10 px-3 py-1.5 rounded-full border border-red-600/20">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Now</span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full md:hidden" onClick={() => setShowMobileSearch(true)}>
            <Search size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/20 shadow-inner"></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* YouTube Style Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex bg-[#0f0f0f] border-r border-white/5 transition-all duration-300 flex flex-col overflow-y-auto overflow-x-hidden pt-4 shrink-0`}>
          <div className="px-3 space-y-1">
             <SidebarItem 
               icon={<Home size={20} />} 
               label="Beranda" 
               active={activeCategory === 'all' && activeSort === 'latest'} 
               collapsed={!sidebarOpen}
               onClick={() => { setActiveCategory('all'); setActiveSort('latest'); }}
             />
             <SidebarItem 
               icon={<TrendingUp size={20} />} 
               label="Terviral" 
               active={activeSort === 'viral'} 
               collapsed={!sidebarOpen}
               onClick={() => setActiveSort('viral')}
             />
             <SidebarItem 
               icon={<Clock size={20} />} 
               label="Terbaru" 
               active={activeSort === 'latest' && activeCategory === 'all'} 
               collapsed={!sidebarOpen}
               onClick={() => { setActiveCategory('all'); setActiveSort('latest'); }}
             />
          </div>

          <div className="my-4 border-t border-white/5 mx-3"></div>

          {sidebarOpen && (
            <div className="px-6 mb-2">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Kategori</h3>
            </div>
          )}

          <div className="px-3 space-y-1">
            {categories.map((cat) => (
              <SidebarItem 
                key={cat.id}
                icon={<Layers size={20} />} 
                label={cat.name} 
                active={activeCategory === cat.id} 
                collapsed={!sidebarOpen}
                onClick={() => setActiveCategory(cat.id)}
              />
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
           {/* Mobile Search Overlay Placeholder */}
           
           <div className="max-w-[1800px] mx-auto px-0 md:px-8 py-4 md:py-8">
              {/* Category Pills (YouTube sub-nav) */}
              <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0">
                 <button 
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === 'all' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/15'}`}
                 >
                   Semua
                 </button>
                 {categories.map(cat => (
                   <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === cat.id ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/15'}`}
                   >
                     {cat.name}
                   </button>
                 ))}
              </div>

              {/* Video Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse flex flex-col gap-3 p-2">
                       <div className="aspect-video bg-white/5 rounded-2xl w-full"></div>
                       <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 shrink-0"></div>
                          <div className="flex-1 space-y-2 py-1">
                             <div className="h-4 bg-white/5 rounded w-3/4"></div>
                             <div className="h-3 bg-white/5 rounded w-1/2"></div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center">
                   <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500">
                      <Search size={40} />
                   </div>
                   <h2 className="text-xl font-bold font-serif mb-2">Video tidak ditemukan</h2>
                   <p className="text-gray-500 text-sm max-w-xs mx-auto">
                     Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.
                   </p>
                   <button 
                    onClick={() => { setSearch(""); setActiveCategory("all"); }}
                    className="mt-6 text-red-500 font-bold text-sm hover:underline"
                   >
                     Reset Pencarian
                   </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-4">
                  {videos.map((vid) => (
                    <VideoCard 
                      key={vid.id} 
                      video={vid} 
                      onPlay={(v) => setPlaying(v)} 
                    />
                  ))}
                </div>
              )}
           </div>
        </main>
      </div>

      {/* Consistent Video Modal (YouTube Theater Mode / Popup) */}
      {playing && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-start sm:items-center justify-center backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300 overflow-y-auto"
          onClick={() => setPlaying(null)}
        >
          <div 
            className="w-full max-w-5xl bg-[#0f0f0f] sm:rounded-2xl overflow-hidden shadow-2xl border-x border-b sm:border border-white/10 ring-1 ring-white/5 my-0 sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Player */}
            <div className="aspect-video bg-black relative shadow-inner overflow-hidden">
               {/* Embed YouTube or Source */}
                {playing.sourceType === 'YOUTUBE' ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${playing.videoUrl?.split('v=')[1]?.split('&')[0] || playing.videoUrl?.split('/').pop()}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                ) : playing.videoUrl ? (
                  <video 
                    src={playing.videoUrl.startsWith('http') ? playing.videoUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${playing.videoUrl.startsWith('/') ? '' : '/'}${playing.videoUrl}`}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                   <Play size={64} className="text-red-600 mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" fill="currentColor" />
                   <p className="text-gray-300 font-serif text-lg mb-2">{playing.title}</p>
                   <p className="text-gray-500 text-sm italic">Video dalam pemrosesan server MCN Play...</p>
                 </div>
                )}
               {/* Controls/Close Overlay */}
               <button 
                onClick={() => setPlaying(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-all border border-white/10"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Info Section */}
            <div className="p-6">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded-sm border border-red-500/20 mb-2 inline-block">
                      {playing.categories?.[0]?.category?.name || "MCN Play"}
                    </span>
                    <h2 className="text-white font-bold text-2xl font-serif leading-tight">
                      {playing.title}
                    </h2>
                    
                    {/* Mobile Only: Like/Dislike under title */}
                    <div className="flex md:hidden items-center gap-2 mt-4">
                       <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all font-bold text-xs border border-white/5">
                          <ThumbsUp size={14} /> Like
                       </button>
                       <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all font-bold text-xs border border-white/5">
                          <ThumbsDown size={14} /> Dislike
                       </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="text-right">
                        <p className="text-xl font-bold text-white font-serif">{playing.viewCount || 0}</p>
                        <p className="text-[9px] text-gray-500 uppercase tracking-tighter">Penayangan Berjalan</p>
                     </div>
                  </div>
               </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center text-lg font-bold shadow-lg">M</div>
                    <div>
                      <p className="text-white font-bold">{playing.author?.name || 'MCNid Staff'}</p>
                      <p className="text-xs text-gray-500 tracking-tight">Kanal Resmi MCNid.net</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-2">
                     <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all font-bold text-sm">
                        <ThumbsUp size={16} /> Like
                     </button>
                     <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all font-bold text-sm">
                        <ThumbsDown size={16} /> Dislike
                     </button>
                  </div>
               </div>
               
               <div className="mt-4 md:mt-6 bg-[#1a1a1a] p-4 rounded-xl text-gray-400 text-sm leading-relaxed max-h-48 overflow-y-auto scrollbar-thin">
                  {playing.description ? (
                    <div 
                      className="prose prose-invert prose-sm max-w-none prose-a:text-red-500 prose-p:mb-2 prose-ul:list-disc prose-ul:pl-4"
                      dangerouslySetInnerHTML={{ __html: playing.description }} 
                    />
                  ) : (
                    "Tidak ada deskripsi untuk video ini."
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon, label, active, collapsed, onClick }: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  collapsed?: boolean,
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-xl transition-all duration-200 group ${active ? 'bg-red-600/10 text-red-500 shadow-inner' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
    >
      <div className={`shrink-0 ${active ? 'text-red-500' : 'group-hover:text-red-500'} transition-colors`}>
        {icon}
      </div>
      {!collapsed && (
        <span className={`text-[13px] font-bold tracking-tight transition-all truncate`}>
          {label}
        </span>
      )}
      {active && !collapsed && (
        <div className="ml-auto w-1.5 h-1.5 bg-red-600 rounded-full"></div>
      )}
    </button>
  );
}
