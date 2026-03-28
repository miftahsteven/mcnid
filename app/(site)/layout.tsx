import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-94PR12JYPW"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-94PR12JYPW');
        `}
      </Script>

      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
