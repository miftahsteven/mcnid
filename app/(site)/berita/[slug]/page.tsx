import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Clock, Eye, ChevronRight, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";
import ViewTracker from "@/components/ViewTracker";

// Server-side: use BACKEND_URL for internal SSR fetching (correct port on production)
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";
// Client-side cdn: used only for building image src attributes in HTML
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

import * as jose from "jose";
import { getPublicImageUrl } from "@/lib/backend-config";

async function getPost(slug: string) {
  try {
    const urlsToTry = [
      `${BACKEND_URL}/api/posts/by-slug?slug=${encodeURIComponent(slug)}`,
      `${BACKEND_URL}/api/posts/${encodeURIComponent(slug)}`,
      `${PUBLIC_API_URL}/api/posts/by-slug?slug=${encodeURIComponent(slug)}`,
      `${PUBLIC_API_URL}/api/posts/${encodeURIComponent(slug)}`
    ];

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url, {
          headers: { "x-api-key": INTERNAL_API_KEY },
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) return json.data;
        }
      } catch (e) {
        // Silently ignore connection errors and try the next fallback URL
      }
    }

    // --- FALLBACK 5: Deep extraction (For un-deployed production backends) ---
    // Fastify throws 404 for slugs > 100 chars natively. If the backend route /by-slug
    // has not been deployed yet, we bypass it by fetching the ID from the public list
    // and using an on-the-fly Server-Side Admin JWT to read the content.
    try {
      const listRes = await fetch(`${PUBLIC_API_URL}/api/posts`, { cache: "no-store", headers: { "x-api-key": INTERNAL_API_KEY } });
      if (listRes.ok) {
        const listJson = await listRes.json();
        const target = listJson.data?.find((p: any) => p.slug === slug);
        if (target && target.id) {
          const secretStr = process.env.JWT_SECRET || "Zi2pi4sD3guktXngbY2NP9ZrohLWUGP8Abw16tziEqE=";
          const secret = new TextEncoder().encode(secretStr);
          const adminToken = await new jose.SignJWT({ sub: "system", email: "system@mcnid.net", role: "ADMIN" })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("5m")
            .sign(secret);
          
          const adminRes = await fetch(`${PUBLIC_API_URL}/api/posts/admin/${target.id}`, {
            headers: { "Authorization": `Bearer ${adminToken}` },
            cache: "no-store"
          });
          if (adminRes.ok) {
            const adminJson = await adminRes.json();
            if (adminJson.data) return adminJson.data;
          }
        }
      }
    } catch (fallbackErr) {
      console.error("Deep extraction fallback failed:", fallbackErr);
    }
    
    return null;
  } catch (err) {
    console.error("Error fetching post data:", err);
    return null;
  }
}

async function getLatestPosts(excludeId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/latest-posts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).filter((p: any) => p.id !== excludeId).slice(0, 4);
  } catch (err) {
    console.error("Error fetching latest posts:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Not Found - MCN" };

    const imageUrl = getPublicImageUrl(post.coverImage);

  const description =
    post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>?/gm, "");

  const canonicalUrl = `https://mcnid.net/berita/${post.slug}`;

  return {
    title: `${post.title} | MCN`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      siteName: "MCNID.NET",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      authors: [post.author?.name || "MCN Redaksi"],
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const latestPosts = await getLatestPosts(post.id);
  const imageUrl = getPublicImageUrl(post.coverImage);

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://mcnid.net"}/berita/${post.slug}`;
  const publishDate = new Date(post.publishedAt || post.createdAt);

  // ── JSON-LD Structured Data (NewsArticle) ──────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description:
      post.excerpt ||
      post.content?.substring(0, 160).replace(/<[^>]*>?/gm, ""),
    image: [imageUrl],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: [
      {
        "@type": "Person",
        name: post.customAuthor || post.author?.name || "Redaksi MCN",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "MCNID.NET",
      logo: {
        "@type": "ImageObject",
        url: "https://mcnid.net/logomcnid.jpeg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://mcnid.net/berita/${post.slug}`,
    },
    url: `https://mcnid.net/berita/${post.slug}`,
    inLanguage: "id-ID",
    isPartOf: {
      "@type": "WebSite",
      name: "MCNID.NET",
      url: "https://mcnid.net",
    },
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker type="post" slug={post.slug} />

      {/* Hero Cover */}
      <div className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-0 md:px-4 mt-0 md:mt-4">
          <div className="relative w-full aspect-video sm:aspect-video lg:max-h-[550px] overflow-hidden md:rounded-2xl shadow-sm md:shadow-lg border-b md:border border-gray-100 bg-gray-900">
            <img
              src={getPublicImageUrl(post.coverImage)}
              alt={post.title}
              className="h-full w-full object-contain md:object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main article wrapper */}
      <div className="max-w-[720px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-gray-500 pt-6 pb-3 font-medium">
          <Link href="/" className="hover:text-[#1a4731] transition-colors">
            Beranda
          </Link>
          <ChevronRight size={13} className="mx-1.5 opacity-60" />
          <Link
            href="/berita"
            className="hover:text-[#1a4731] transition-colors"
          >
            Berita
          </Link>
          <ChevronRight size={13} className="mx-1.5 opacity-60" />
          <span className="text-gray-400 line-clamp-1">{post.title}</span>
        </nav>

        {/* Categories & Status */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.status !== "PUBLISHED" && (
            <span className="text-[10px] font-bold text-white bg-orange-500 px-2.5 py-1 rounded uppercase tracking-wider">
              {post.status}
            </span>
          )}
          {post.categories?.length > 0 &&
            post.categories.map((catObj: any) => (
              <span
                key={catObj.category.id}
                className="text-[10px] font-bold text-white bg-[#1a4731] px-2.5 py-1 rounded uppercase tracking-wider"
              >
                {catObj.category.name}
              </span>
            ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-serif leading-[1.25] mb-5 tracking-tight">
          {post.title}
        </h1>

        {/* Excerpt / Lead */}
        {post.excerpt && (
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 pb-6 border-b border-gray-200 font-medium">
            {post.excerpt}
          </p>
        )}

        {/* Author + Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {post.author?.image ? (
              <img
                src={getPublicImageUrl(post.author.image)}
                alt={post.author.name}
                className="w-10 h-10 rounded-full ring-2 ring-gray-100 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1a4731]/10 flex items-center justify-center ring-2 ring-[#1a4731]/20">
                <User size={18} className="text-[#1a4731]" />
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none mb-1">
                {post.customAuthor || post.author?.name || "Redaksi MCN"}
              </p>
              <p className="text-xs text-gray-500">Tim Redaksi</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {publishDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              ·{" "}
              {publishDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              WIB
            </span>
            {post.viewCount > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye size={13} />
                {post.viewCount.toLocaleString("id-ID")} tayangan
              </span>
            )}
          </div>
        </div>

        {/* ── Article Body ─────────────────────── */}
        <article
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-gray-200">
            <Tag size={14} className="text-gray-400 shrink-0" />
            {post.tags.map((tagObj: any) => (
              <span
                key={tagObj.tag.id}
                className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium hover:bg-[#1a4731]/10 hover:text-[#1a4731] cursor-pointer transition-colors"
              >
                {tagObj.tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <ShareButtons title={post.title} url={shareUrl} />
      </div>

      {/* "Berita Lainnya" Section */}
      <section className="bg-white border-t border-gray-200 mt-10 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-1 h-6 bg-[#1a4731] rounded-full" />
            <h2 className="text-xl font-bold font-serif text-gray-900">
              Berita Lainnya
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {latestPosts.map((related: any) => {
              const relImg = getPublicImageUrl(related.image || related.coverImage);
              return (
                <Link
                  key={related.id}
                  href={`/berita/${related.slug}`}
                  className="group flex flex-col gap-2"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm relative bg-gray-100">
                    <img
                      src={relImg}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[9px] font-bold text-white bg-[#1a4731] px-1.5 py-0.5 rounded">
                      {related.category || "Berita"}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-3 group-hover:text-[#1a4731] transition-colors leading-snug">
                    {related.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
