import type { Metadata } from 'next';
import { Suspense } from 'react';
import IndeksContent from './IndeksContent';

export const metadata: Metadata = {
  title: 'Berita & Indeks | MCNID.NET',
  description:
    'Telusuri arsip berita nasional, konten keislaman, opini moderat, dan video eksklusif MCN Play secara lengkap.',
  alternates: {
    canonical: 'https://mcnid.net/berita',
  },
  openGraph: {
    title: 'Indeks Berita & Video | MCNID.NET',
    description:
      'Telusuri arsip berita nasional, konten keislaman, dan video eksklusif MCN Play secara lengkap.',
    url: 'https://mcnid.net/berita',
    siteName: 'MCNID.NET',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indeks Berita & Video | MCNID.NET',
    description: 'Arsip lengkap berita dan video MCN.',
  },
};

export default function BeritaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a4731]"></div>
      </div>
    }>
      <IndeksContent />
    </Suspense>
  );
}
