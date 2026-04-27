'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, ChevronRight, History, Info, Menu, X, Plus, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { auth, googleProvider } from '../../../lib/firebase';
import { signInWithPopup, signInWithRedirect, onAuthStateChanged, User } from 'firebase/auth';

interface Message {
  id: number;
  chatId?: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  sources?: any[];
  mode?: string;
  confidence?: number;
  feedback?: boolean | null;
}

interface SessionData {
  sessionId: string;
  question: string;
  createdAt: string;
}

const suggestedQuestions = [
  'Bagaimana pandangan KH Cholil Nafis tentang ekonomi Islam?',
  'Apa hukumnya riba menurut KH Cholil Nafis?',
  'Bagaimana menjaga keharmonisan beragama di Indonesia?',
  'Apa pandangan KH Cholil Nafis tentang Pancasila dan Islam?',
  'Bagaimana cara berdakwah yang efektif di era digital?',
  'Apa hukum investasi saham di bursa efek menurut Islam?',
];

export default function KonsultasiClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'ai',
      text: 'Assalamu\'alaikum! Saya **KI.AI**, asisten cerdas berbasis pemikiran KH Cholil Nafis. Silakan ajukan pertanyaan Anda seputar keislaman.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pastSessions, setPastSessions] = useState<SessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [containerHeight, setContainerHeight] = useState('80vh');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureHeight = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setContainerHeight(`${window.innerHeight - rect.top}px`);
      }
    };
    // Use a short delay and also schedule after fonts/layout settle
    const t1 = setTimeout(measureHeight, 50);
    const t2 = setTimeout(measureHeight, 300);
    window.addEventListener('resize', measureHeight);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measureHeight);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setMessages([
          {
            id: 0,
            role: 'ai',
            text: `Assalamu'alaikum, **${currentUser.displayName || 'Sahabat'}**! Saya **KI.AI**, asisten cerdas berbasis pemikiran KH Cholil Nafis. Silakan ajukan pertanyaan Anda.`,
            timestamp: new Date(),
          },
        ]);
        fetchSessions(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSessions = async (userId: string) => {
    try {
      const res = await fetch(`/api/ki-ai/sessions?user_id=${userId}`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) setPastSessions(body.data);
        if (typeof body.dailyCount === 'number') setDailyUsage(Math.min(body.dailyCount, 5));
        if (body.isBlocked) setIsBlocked(true);
      }
    } catch (e) { console.error('Failed to fetch sessions', e); }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.warn("Popup login failed, mencoba dialihkan (redirect)...", error.message);
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError: any) {
        alert("Gagal memanggil Google Login: " + redirectError.message);
      }
    }
  };

  const continueSession = async (sessionData: SessionData) => {
    setLoading(true);
    setActiveSessionId(sessionData.sessionId);
    setSidebarOpen(false); // Close on mobile
    try {
      const res = await fetch(`/api/ki-ai/sessions/${sessionData.sessionId}`);
      if (res.ok) {
        const body = await res.json();
        if (body.data && Array.isArray(body.data)) {
          const loadedMessages: Message[] = [
            {
              id: 0,
              role: 'ai',
              text: `Melanjutkan sesi riwayat terdahulu. Berikut rangkuman percakapan sebelumnya:`,
              timestamp: new Date(sessionData.createdAt),
            },
          ];

          body.data.forEach((log: any, idx: number) => {
            loadedMessages.push({
              id: Date.now() + idx * 10,
              role: 'user',
              text: log.question,
              timestamp: new Date(log.createdAt),
            });
            loadedMessages.push({
              id: Date.now() + idx * 10 + 1,
              chatId: log.id,
              role: 'ai',
              text: log.answer,
              timestamp: new Date(log.createdAt),
              sources: log.sources?.map((s: any) => ({ type: s.sourceType, url: s.sourceUrl })),
              mode: log.mode,
              confidence: log.confidence,
              feedback: log.feedbacks?.[0]?.isHelpful ?? null,
            });
          });
          setMessages(loadedMessages);
        }
      }
    } catch (e) { console.error("Failed to load session details", e); }
    finally { setLoading(false); }
  };

  const startNewSession = () => {
    if (loading) return;
    setActiveSessionId(Math.random().toString(36).substring(2, 15));
    setSidebarOpen(false); // Close on mobile
    setMessages([
      {
        id: 0,
        role: 'ai',
        text: `Assalamu'alaikum, **${user?.displayName || 'Sahabat'}**! Silakan ajukan topik konsultasi baru Anda.`,
        timestamp: new Date(),
      },
    ]);
  };

  useEffect(() => {
    if (messages.length > 1 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || !user) return;
    let sessionIdInfo = activeSessionId || Math.random().toString(36).substring(2, 15);
    if (!activeSessionId) setActiveSessionId(sessionIdInfo);

    const userMsg: Message = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ki-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionIdInfo, user_id: user.uid, user_name: user.displayName, user_email: user.email }),
      });
      if (!response.ok) throw new Error('Network response was not ok');

      setLoading(false);
      const aiMsgId = Date.now() + 1;
      setMessages((prev) => [...prev, { id: aiMsgId, role: 'ai', text: '', timestamp: new Date() }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      if (!reader) return;

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data:')) {
            const dataStr = trimmedLine.substring(5).trim();
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                const newText = data.text;
                setMessages((prev) => prev.map((msg) => msg.id === aiMsgId ? { ...msg, text: msg.text + newText } : msg));

                // Detect if the response indicates a block
                if (newText.includes("diblokir secara permanen") || newText.includes("akun Anda telah kami BLOKIR PERMANEN")) {
                  setIsBlocked(true);
                }
              }
              if (data.metadata) {
                setMessages((prev) => prev.map((msg) => msg.id === aiMsgId ? {
                  ...msg,
                  chatId: data.metadata.chat_id,
                  sources: data.metadata.sources,
                  mode: data.metadata.mode,
                  confidence: data.metadata.confidence
                } : msg));
              }
            } catch (e) { }
          }
        }
      }
      fetchSessions(user.uid);
    } catch (error) {
      setLoading(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: 'Maaf, kuota harian Anda mungkin sudah habis (Maks 5) atau terjadi gangguan jaringan.', timestamp: new Date() }]);
    }
  };

  const handleFeedback = async (chatId: string | undefined, isHelpful: boolean) => {
    if (!chatId) return;

    // Update local state immediately
    setMessages(prev => prev.map(msg => msg.chatId === chatId ? { ...msg, feedback: isHelpful } : msg));

    try {
      await fetch('/api/ki-ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, isHelpful }),
      });
    } catch (e) {
      console.error("Failed to send feedback", e);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-[#c9a227] border-t-[#1a4731] rounded-full animate-spin"></div></div>;

  if (!user) return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-gray-100">
        <div className="w-20 h-20 bg-gradient-to-br from-[#1a4731] to-[#311c58] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"><Sparkles size={40} className="text-[#c9a227]" /></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-serif">Selamat Datang di KI.AI</h1>
        <p className="text-sm text-gray-500 mb-8">Konsultasi Keislaman Cerdas berbasis kajian KH Cholil Nafis. Silakan masuk untuk memulai tanya jawab.</p>
        <button onClick={loginWithGoogle} className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.86 16.81 15.69 17.59V20.34H19.26C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" /><path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.69 17.59C14.71 18.25 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.86 14.18H2.18V17.03C4.01 20.65 7.7 23 12 23Z" fill="#34A853" /><path d="M5.86 14.18C5.62 13.46 5.49 12.7 5.49 11.91C5.49 11.12 5.62 10.36 5.86 9.64V6.79H2.18C1.43 8.28 1 9.98 1 11.91C1 13.84 1.43 15.54 2.18 17.03L5.86 14.18Z" fill="#FBBC05" /><path d="M12 5.16C13.62 5.16 15.08 5.71 16.22 6.8L19.34 3.68C17.46 1.93 14.97 1 12 1C7.7 1 4.01 3.35 2.18 6.79L5.86 9.64C6.78 7.07 9.17 5.16 12 5.16Z" fill="#EA4335" />
          </svg> Masuk dengan Google
        </button>
        <button
          onClick={() => window.open('https://wa.me/628558876544?text=Assalamu%27alaikum%20saya%20mau%20tanya%20ki..', '_blank')}
          className="w-full bg-[#25d366] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#22c35e] transition-all shadow-md mt-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Konsultasi via WhatsApp
        </button>
      </div>
    </div>
  );

  const hasHistory = pastSessions.length > 0;
  const isLimitReached = dailyUsage >= 5;

  return (
    <>
      <style>{`
        /* Override layout.tsx min-h-screen to remove white gap above footer */
        main { min-height: auto !important; }
      `}</style>
      <div ref={wrapperRef} className="flex flex-row w-full bg-gray-50 overflow-hidden" style={{ height: containerHeight, minHeight: '500px' }}>

        {/* Sidebar - Desktop Persisten, Mobile Drawer */}
        <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1a4731] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <Sparkles size={20} className="text-[#c9a227]" />
                </div>
                <div>
                  <h2 className="font-bold text-lg font-serif">KI.AI v1.2</h2>
                  <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Mcnid.net</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <button
              onClick={startNewSession}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-start gap-3 transition-all mb-8 border border-white/10"
            >
              <Plus size={18} />
              Sesi Baru
            </button>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 px-2">Riwayat Konsultasi</p>
              <div className="flex flex-col gap-2">
                {hasHistory ? pastSessions.map((session) => (
                  <button
                    key={session.sessionId}
                    onClick={() => continueSession(session)}
                    className={`
                    w-full text-left p-3 rounded-xl transition-all group flex flex-col gap-1 border
                    ${activeSessionId === session.sessionId
                        ? 'bg-white/15 border-white/20'
                        : 'bg-transparent border-transparent hover:bg-white/5'}
                  `}
                  >
                    <div className={`text-[12px] font-medium line-clamp-1 ${activeSessionId === session.sessionId ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {session.question}
                    </div>
                    <div className="text-[10px] text-white/40 font-mono uppercase">
                      {new Date(session.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </div>
                  </button>
                )) : (
                  <p className="text-xs text-white/30 italic px-2">Belum ada riwayat.</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="bg-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-[11px] text-white truncate max-w-[140px] font-bold">{user.displayName}</p>
                  <button onClick={() => auth.signOut()} className="text-[10px] text-white/40 hover:text-white text-left">Keluar</button>
                </div>
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <History size={18} className="text-white/60" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div id="kiai-content-area" className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header - Fixed Height */}
          <header className="bg-white border-b border-gray-100 py-4 px-4 lg:px-8 flex items-center justify-between shrink-0 h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                <Menu size={24} />
              </button>
              <h1 className="font-bold text-gray-800 font-serif hidden lg:block">Panel Konsultasi</h1>
              <h1 className="font-bold text-gray-800 font-serif lg:hidden">KI.AI v1.2</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className={`text-[11px] font-bold uppercase tracking-widest ${isLimitReached ? 'text-red-500' : 'text-gray-400'}`}>{dailyUsage}/5 Pertanyaan</span>
                <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isLimitReached ? 'bg-red-500' : 'bg-[#1a4731]'}`}
                    style={{ width: `${(dailyUsage / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLimitReached ? 'bg-red-50' : 'bg-green-50'}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${isLimitReached ? 'bg-red-500' : 'bg-green-500'}`}></span>
              </div>
            </div>
          </header>

          {/* Chat Area - Scroll Container */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative scroll-smooth custom-scrollbar-light">
            <div className="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-8">

              {/* Welcome Dashboard */}
              {messages.length === 1 && (
                <div className="flex flex-col gap-8 mb-4 w-full animate-in fade-in duration-700">
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl flex items-start gap-3 shadow-sm">
                    <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-blue-800 leading-[1.6] font-medium">
                      <strong>PEMBERITAHUAN PRIVASI:</strong> Seluruh percakapan otomatis tersimpan demi kenyamanan Anda untuk dirujuk kembali di sidebar kiri.
                      Data ini akan otomatis dibersihkan setiap 7 hari sekali.
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-gray-400 mb-5 uppercase tracking-widest px-1">Topik Populer</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {suggestedQuestions.map((q, i) => (
                        <button key={i} onClick={() => sendMessage(q)} className="text-left text-[12px] leading-relaxed bg-white border border-gray-100 hover:border-[#1a4731] hover:bg-[#1a4731]/5 rounded-2xl px-5 py-4 flex items-start gap-3 transition-all shadow-sm group">
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#1a4731] shrink-0 mt-0.5" />
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex flex-col gap-10">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-4 w-full group`}>
                    {msg.role === 'ai' && (
                      <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4731]/5 to-[#4a2c82]/5" />
                        <Sparkles size={18} className="text-[#c9a227] relative z-10" />
                      </div>
                    )}
                    <div className={`${msg.role === 'user' ? 'chat-user' : 'chat-ai'} max-w-[85%] shadow-sm px-6 py-5 rounded-[2rem] ${msg.role === 'user' ? 'bg-[#1a4731] text-white rounded-tr-none' : 'bg-white border border-gray-100 rounded-tl-none'}`}>
                      <div className="text-[14px] leading-relaxed whitespace-pre-wrap">{formatText(msg.text)}</div>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Rujukan Basis Pengetahuan:</p>
                          <div className="flex flex-col gap-2">
                            {msg.sources.map((src: any, idx: number) => {
                              const linkHref = src.url || src.sourceUrl || '#';
                              const linkType = src.type || src.sourceType || 'system';
                              const linkLabel = src.title ? src.title : (linkType === 'internal' ? 'Pemikiran K.H. Cholil Nafis (mcnid.net)' : 'Dokumen Rujukan');
                              return (
                                <a key={idx} href={linkHref} target={linkHref !== '#' ? '_blank' : '_self'} rel="noopener noreferrer" className={`text-[11px] bg-gray-50 text-gray-600 px-4 py-3 rounded-xl border border-gray-200 transition-all truncate block shadow-sm ${linkHref !== '#' ? 'hover:border-[#1a4731] cursor-pointer' : 'cursor-default'}`}>
                                  <span className="font-bold text-[#1a4731] uppercase mr-2">[{linkType}]</span>{linkLabel}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <p className={`text-[9px] font-mono uppercase tracking-widest opacity-40`}>
                          {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>

                        {msg.role === 'ai' && msg.chatId && (
                          <div className="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleFeedback(msg.chatId, true)}
                              className={`p-1.5 rounded-lg transition-all ${msg.feedback === true ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                              title="Bermanfaat"
                            >
                              <ThumbsUp size={14} fill={msg.feedback === true ? 'currentColor' : 'none'} />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.chatId, false)}
                              className={`p-1.5 rounded-lg transition-all ${msg.feedback === false ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                              title="Kurang Bermanfaat"
                            >
                              <ThumbsDown size={14} fill={msg.feedback === false ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {loading && (
                <div className="flex justify-start gap-4 w-full animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a4731]/5 to-[#4a2c82]/5" />
                    <Sparkles size={18} className="text-[#c9a227] relative z-10" />
                  </div>
                  <div className="bg-white px-8 py-5 rounded-[2rem] rounded-tl-none border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#1a4731]/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#1a4731]/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-[#1a4731]/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="h-10" />
            </div>
          </div>

          {/* Input Area */}
          <div className="shrink-0 bg-white border-t border-gray-100 pt-4 pb-6 px-4 lg:px-8 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <div className="max-w-4xl mx-auto w-full">
              {isBlocked && (
                <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-2xl text-center flex items-center justify-center gap-3">
                  <Info size={14} className="text-red-500" />
                  <p className="text-[11px] text-red-600 font-bold uppercase tracking-widest">Akun Anda Telah Diblokir Permanen</p>
                </div>
              )}
              {isLimitReached && !isBlocked && (
                <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-2xl text-center flex items-center justify-center gap-3">
                  <Info size={14} className="text-red-500" />
                  <p className="text-[11px] text-red-600 font-bold uppercase tracking-widest">Batas Quota Harian Tercapai (5/5)</p>
                </div>
              )}
              <div className={`flex items-end gap-3 p-1 px-1 bg-gray-50 border border-gray-200 rounded-[2rem] transition-all shadow-inner ${(isLimitReached || isBlocked) ? 'opacity-40 grayscale pointer-events-none' : 'focus-within:border-[#1a4731] focus-within:ring-4 focus-within:ring-[#1a4731]/5 focus-within:bg-white'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={isLimitReached || loading || isBlocked}
                  maxLength={500}
                  placeholder={isBlocked ? "Akses diblokir" : isLimitReached ? "Kouta harian Anda sudah habis" : "Tanyakan sesuatu (Maks. 500 karakter)..."}
                  rows={1}
                  className="flex-1 px-5 py-2.5 text-[14px] bg-transparent focus:outline-none resize-none min-h-[44px]"
                  style={{ maxHeight: '160px' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading || isLimitReached || isBlocked}
                  className="m-1 p-2.5 bg-[#1a4731] hover:bg-[#143625] disabled:opacity-30 disabled:grayscale text-white rounded-full transition-all shadow-lg active:scale-95"
                >
                  <Send size={20} strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 px-4">
                <div className="flex items-center gap-3">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">KI.AI Platform Gratis</p>
                  {!isBlocked && !isLimitReached && (
                    <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${input.length >= 500 ? 'text-red-500' : 'text-gray-400'} border-l border-gray-200 pl-3`}>
                      {input.length}/500 Karakter
                    </p>
                  )}
                </div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">{dailyUsage}/5 Kuota Harian</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        
        .custom-scrollbar-light::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `}</style>
      </div>
    </>
  );
}
