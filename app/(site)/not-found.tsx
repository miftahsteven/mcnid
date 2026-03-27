import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="text-7xl mb-6">📰</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-serif">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Maaf, konten yang Anda cari tidak tersedia atau tautan tersebut sudah tidak aktif lagi.
        </p>
        <Link
          href="/"
          className="bg-[#1a4731] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1a4731]/90 transition-all shadow-lg hover:shadow-green-900/20 inline-block"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
