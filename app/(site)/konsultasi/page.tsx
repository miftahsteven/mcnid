import type { Metadata } from 'next';
import KonsultasiClient from './KonsultasiClient';

export const metadata: Metadata = {
  title: 'Konsultasi Keislaman — KI.AI | MCNID.NET',
  description:
    'Ajukan pertanyaan seputar keislaman dan dapatkan jawaban berbasis pemikiran KH Cholil Nafis. KI.AI — asisten konsultasi Islam cerdas dari MCNID.NET.',
  alternates: {
    canonical: 'https://mcnid.net/konsultasi',
  },
  openGraph: {
    title: 'KI.AI — Konsultasi Keislaman Berbasis KH Cholil Nafis',
    description:
      'Ajukan pertanyaan seputar fiqh, aqidah, dan isu keislaman kontemporer. Dijawab berdasarkan kajian KH Cholil Nafis.',
    url: 'https://mcnid.net/konsultasi',
    siteName: 'MCNID.NET',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: '/logomcnid.jpeg', width: 1200, height: 630, alt: 'KI.AI Konsultasi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KI.AI Konsultasi Keislaman | MCNID.NET',
    description: 'Konsultasi Islam berbasis pemikiran KH Cholil Nafis.',
  },
};

export default function KonsultasiPage() {
  const whatsappStatus = process.env.NEXT_PUBLIC_WHATSAPP_KONSULTASI_BUTTON || 'disactive';
  
  return <KonsultasiClient whatsappStatus={whatsappStatus} />;
}
