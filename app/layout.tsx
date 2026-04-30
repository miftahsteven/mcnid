import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mcnid.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MCNID.NET — Media Islam Nasional Modern",
    template: "%s | MCNID.NET",
  },
  description:
    "MCNID.NET adalah portal media Islam nasional modern yang menyajikan berita aktual, pemikiran moderat, edukasi Islam, dan konten video berkualitas.",
  keywords: [
    "MCN",
    "MCNID",
    "media Islam",
    "berita nasional",
    "KH Cholil Nafis",
    "Islam moderat",
    "MUI",
    "berita Islam terkini",
    "pendidikan Islam",
  ],
  authors: [{ name: "MCNID.NET Editorial Team" }],
  creator: "MCNID.NET",
  publisher: "MCNID.NET",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Replace with your actual verification codes from GSC/Bing
    google: "google-site-verification-placeholder",
    // yandex: 'yandex-verification-code',
    // me: 'your-email@example.com',
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "MCNID",
    title: "MCNID.NET — Media Islam Nasional Modern",
    description:
      "Portal media Islam nasional modern yang menghadirkan perspektif keislaman moderat terhadap isu nasional.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MCNID.NET — Media Islam Nasional Modern",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCNID.NET — Media Islam Nasional Modern",
    description: "Portal media Islam nasional modern.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MCNID.NET",
    "url": SITE_URL,
    "logo": `${SITE_URL}/favicon.ico`,
    "sameAs": [
      "https://facebook.com/mcnid.net",
      "https://twitter.com/mcnid_net",
      "https://instagram.com/mcnid_net"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service"
    }
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MCNID.NET",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="id">
      <head>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        {/* Google Analytics - Placed in head as per Google's instruction */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PL660TV5Z3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-PL660TV5Z3');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
