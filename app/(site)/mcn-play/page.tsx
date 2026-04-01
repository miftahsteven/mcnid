import type { Metadata } from 'next';
import MCNPlayClient from './MCNPlayClient';

export const metadata: Metadata = {
  title: 'MCN Play — Video Islam Berkualitas | MCNID.NET',
  description:
    'Tonton video kajian Islam, ceramah, dokumenter, dan konten keislaman berkualitas dari MCN Play. Portal video Islam terlengkap di Indonesia.',
  alternates: {
    canonical: 'https://mcnid.net/mcn-play',
  },
  openGraph: {
    title: 'MCN Play — Video Islam Berkualitas | MCNID.NET',
    description:
      'Tonton video kajian Islam, ceramah, dokumenter, dan konten keislaman berkualitas dari MCN Play.',
    url: 'https://mcnid.net/mcn-play',
    siteName: 'MCNID.NET',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: '/logomcnid.jpeg', width: 1200, height: 630, alt: 'MCN Play' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCN Play — Video Islam | MCNID.NET',
    description: 'Portal video Islam terlengkap di Indonesia.',
  },
};

export default function MCNPlayPage() {
  return <MCNPlayClient />;
}
