import type { Metadata } from 'next';
import MCNAcademyClient from './MCNAcademyClient';

export const metadata: Metadata = {
  title: 'MCN Academy — Platform E-Learning Islam | MCNID.NET',
  description:
    'Platform e-learning Islam terpercaya. Belajar fiqh, syariah, akhlak, dan Al-Qur\'an dari ulama dan akademisi terbaik Indonesia bersama MCN Academy.',
  alternates: {
    canonical: 'https://mcnid.net/mcn-academy',
  },
  openGraph: {
    title: 'MCN Academy — Platform E-Learning Islam Terpercaya',
    description:
      'Belajar fiqh, syariah, akhlak, dan Al-Qur\'an dari ulama dan akademisi terbaik Indonesia.',
    url: 'https://mcnid.net/mcn-academy',
    siteName: 'MCNID.NET',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: '/logomcnid.jpeg', width: 1200, height: 630, alt: 'MCN Academy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCN Academy | MCNID.NET',
    description: 'Platform e-learning Islam terpercaya di Indonesia.',
  },
};

export default function MCNAcademyPage() {
  return <MCNAcademyClient />;
}
