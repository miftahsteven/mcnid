'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const suggestedQuestions = [
  'Bagaimana pandangan KH Cholil Nafis tentang ekonomi Islam?',
  'Apa hukumnya riba menurut KH Cholil Nafis?',
  'Bagaimana menjaga keharmonisan beragama di Indonesia?',
  'Apa pandangan KH Cholil Nafis tentang Pancasila dan Islam?',
  'Bagaimana cara berdakwah yang efektif di era digital?',
  'Apa hukum investasi saham di bursa efek menurut Islam?',
];

const aiResponses: Record<string, string> = {
  default: `Terima kasih atas pertanyaan Anda. Berdasarkan pemikiran dan kajian KH Cholil Nafis, beliau selalu menekankan pentingnya pendekatan *wasatiyyah* (moderat) dalam setiap persoalan keislaman. Islam yang rahmatan lil alamin harus menjadi landasan dalam menghadapi setiap tantangan zaman, dengan tetap berpegang pada Al-Qur'an dan Sunnah serta pendapat ulama yang mu'tabar.\n\nUntuk pertanyaan yang lebih spesifik, KI.AI akan memberikan jawaban berdasarkan tulisan, ceramah, dan fatwa beliau yang telah terhimpun dalam basis pengetahuan kami.`,
};

function getDemoResponse(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('ekonomi') || lower.includes('riba') || lower.includes('investasi') || lower.includes('saham')) {
    return `Menurut KH Cholil Nafis, ekonomi Islam bukan hanya soal menghindari riba, tapi membangun sistem ekonomi yang berkeadilan. Beliau menegaskan bahwa:\n\n1. **Riba dalam segala bentuknya hukumnya haram**, karena merusak keadilan ekonomi.\n2. **Investasi yang diperbolehkan** adalah yang berbasis bagi hasil (mudharabah/musyarakah), bukan bunga tetap.\n3. **Saham di perusahaan halal** pada prinsipnya diperbolehkan, selama bisnis perusahaan tersebut tidak bergerak di bidang yang diharamkan.\n\nBeliau juga menekankan pentingnya **literasi keuangan syariah** agar umat Islam tidak terjebak dalam produk-produk keuangan konvensional yang mengandung unsur riba.`;
  }
  if (lower.includes('pancasila') || lower.includes('kebangsaan') || lower.includes('nasionalis')) {
    return `KH Cholil Nafis adalah salah satu ulama yang konsisten memperjuangkan gagasan bahwa **Pancasila dan Islam bukan pertentangan, melainkan sinergi**.\n\nBeliau berpandangan:\n1. Para ulama pendiri bangsa sudah menetapkan bahwa Pancasila adalah *modus vivendi* yang terbaik bagi bangsa Indonesia yang majemuk.\n2. Sila Ketuhanan Yang Maha Esa secara substansi tidak bertentangan dengan tauhid dalam Islam.\n3. Umat Islam harus menjadi garda terdepan dalam menjaga Pancasila karena Islam mengajarkan kemaslahatan untuk seluruh umat manusia.\n\nBeliau juga sering mengutip pendapat Hadratus Syaikh Hasyim Asy'ari yang menetapkan bahwa membela NKRI adalah bagian dari kewajiban agama.`;
  }
  if (lower.includes('dakwah') || lower.includes('digital') || lower.includes('media sosial')) {
    return `Dalam berbagai ceramah dan tulisannya, KH Cholil Nafis memberikan beberapa panduan dakwah di era digital:\n\n1. **Dakwah harus bil hikmah** — sampaikan dengan kata-kata yang bijak, bukan provokatif.\n2. **Verifikasi sebelum share** — literasi digital bagi dai sangat penting untuk tidak menyebarkan hoaks.\n3. **Konten yang berkualitas** — lebih baik posting sedikit tapi berbobot daripada banyak tapi tidak bermutu.\n4. **Jaga akhlak digital** — adab di media sosial mencerminkan kualitas keislaman seseorang.\n\nBeliau juga mengingatkan bahwa dakwah yang benar harus berfokus pada **ukhuwah (persaudaraan)**, bukan perpecahan.`;
  }
  return aiResponses.default;
}

export default function KonsultasiClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'ai',
      text: 'Assalamu\'alaikum! Saya **KI.AI**, asisten cerdas berbasis pemikiran KH Cholil Nafis. Silakan ajukan pertanyaan Anda seputar keislaman, dan saya akan menjawab berdasarkan kajian, tulisan, ceramah, dan fatwa beliau.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1800));

    const aiMsg: Message = {
      id: Date.now() + 1,
      role: 'ai',
      text: getDemoResponse(text),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const formatText = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: formatted }} />;
      });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a4731 0%, #311c58 100%)' }} className="py-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
            <Sparkles size={28} className="text-[#c9a227]" />
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl font-serif">KI.AI</h1>
            <p className="text-gray-200 text-sm">Konsultasi Keislaman berbasis pemikiran KH Cholil Nafis</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse-soft"></span>
              <span className="text-green-400 text-xs font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-4" style={{ minHeight: '60vh' }}>

        {/* Suggested questions (only when no user messages) */}
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Pertanyaan Populer</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-left text-sm bg-white border border-gray-200 hover:border-[#1a4731] hover:text-[#1a4731] rounded-xl px-4 py-3 flex items-center gap-2 transition-all group"
                >
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-[#1a4731] shrink-0" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
              {msg.role === 'ai' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a4731] to-[#4a2c82] flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles size={16} className="text-[#c9a227]" />
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-user' : 'chat-ai'}>
                <div className="text-sm leading-relaxed">{formatText(msg.text)}</div>
                <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a4731] to-[#4a2c82] flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-[#c9a227]" />
              </div>
              <div className="chat-ai">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                  ))}
                  <span className="text-xs text-gray-400 ml-1">KI.AI sedang berpikir...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-end gap-3">
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
              title="Reset percakapan"
            >
              <RefreshCw size={18} />
            </button>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#1a4731] focus-within:ring-2 focus-within:ring-[#1a4731]/10 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Tanyakan sesuatu kepada KI.AI..."
                rows={1}
                className="w-full px-4 py-3 text-sm bg-transparent focus:outline-none resize-none"
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="p-3 bg-[#1a4731] hover:bg-[#2d6b4a] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl transition-all shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            KI.AI menggunakan basis pengetahuan pemikiran KH Cholil Nafis · Verifikasi tetap diperlukan
          </p>
        </div>
      </div>
    </div>
  );
}
