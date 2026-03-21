import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MCNID.NET — Media Islam Nasional Modern",
    template: "%s | MCNID.NET",
  },
  description:
    "MCNID.NET adalah portal media Islam nasional modern yang menyajikan berita aktual, pemikiran moderat, edukasi Islam, dan konten video berkualitas.",
  keywords: [
    "MCN",
    "media Islam",
    "berita nasional",
    "KH Cholil Nafis",
    "Islam moderat",
    "MUI",
  ],
  authors: [{ name: "MCNID.NET Editorial Team" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mcnid.net",
    siteName: "MCNID",
    title: "MCNID.NET — Media Islam Nasional Modern",
    description:
      "Portal media Islam nasional modern yang menghadirkan perspektif keislaman moderat terhadap isu nasional.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCNID.NET — Media Islam Nasional Modern",
    description: "Portal media Islam nasional modern.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
