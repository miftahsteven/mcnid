import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Eye,
  ChevronRight,
  User,
  Play,
  Video as VideoIcon,
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import ViewTracker from "@/components/ViewTracker";
import JsonLd from "@/components/seo/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "mcn_secret_2026_dev";

import { getPublicImageUrl } from "@/lib/backend-config";

async function getVideo(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/videos/${slug}`, {
      headers: { "x-api-key": INTERNAL_API_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Error fetching video data:", err);
    return null;
  }
}

async function getLatestVideos(excludeId: string) {
  try {
    const res = await fetch(`${API_URL}/api/latest-videos`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).filter((v: any) => v.id !== excludeId).slice(0, 4);
  } catch (err) {
    console.error("Error fetching latest videos:", err);
    return [];
  }
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);

  if (!video) {
    return { title: "Not Found - MCN Play" };
  }

  const imageUrl = getPublicImageUrl(video.coverImage || video.thumbnail);

  const canonicalUrl = `https://mcnid.net/mcn-play/${video.slug}`;

  return {
    title: `${video.title} | MCN Play`,
    description: video.description?.substring(0, 160).replace(/<[^>]*>?/gm, ""),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: video.title,
      description: video.description
        ?.substring(0, 160)
        .replace(/<[^>]*>?/gm, ""),
      url: canonicalUrl,
      siteName: "MCNID.NET",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: video.title,
        },
      ],
      type: "video.movie",
      locale: "id_ID",
    },
    twitter: {
      card: "player",
      title: video.title,
      description: video.description
        ?.substring(0, 160)
        .replace(/<[^>]*>?/gm, ""),
      images: [imageUrl],
    },
  };
}

export default async function MCNPlayDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = await getVideo(slug);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Video Tidak Ditemukan</h1>
          <Link
            href="/mcn-play"
            className="text-red-500 hover:text-red-400 underline"
          >
            Kembali ke MCN Play
          </Link>
        </div>
      </div>
    );
  }

  const latestVideos = await getLatestVideos(video.id);
  const imageUrl = getPublicImageUrl(video.coverImage || video.thumbnail);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://mcnid.net"}/mcn-play/${video.slug}`;

  // Render Video Player
  const embedUrl =
    video.sourceType === "YOUTUBE"
      ? getYouTubeEmbedUrl(video.videoUrl || "")
      : null;
  const isDirectVideo = video.sourceType === "UPLOAD" && video.videoUrl;

  // ── JSON-LD Structured Data (VideoObject) ────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description?.replace(/<[^>]*>?/gm, "") || video.title,
    thumbnailUrl: [imageUrl],
    uploadDate: video.publishedAt || video.createdAt,
    duration: video.duration || undefined,
    contentUrl:
      video.sourceType === "UPLOAD" && video.videoUrl
        ? `${API_URL}${video.videoUrl}`
        : undefined,
    embedUrl:
      video.sourceType === "YOUTUBE" && video.videoUrl
        ? `https://www.youtube.com/embed/${video.videoUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?#]+)/)?.[1] || ""}`
        : undefined,
    author: {
      "@type": "Person",
      name: video.author?.name || "MCN Play",
    },
    publisher: {
      "@type": "Organization",
      name: "MCNID.NET",
      logo: {
        "@type": "ImageObject",
        url: "https://mcnid.net/logomcnid.jpeg",
      },
    },
    url: `https://mcnid.net/mcn-play/${video.slug}`,
    inLanguage: "id-ID",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": "https://mcnid.net"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "MCN Play",
        "item": "https://mcnid.net/mcn-play"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": video.title,
        "item": `https://mcnid.net/mcn-play/${video.slug}`
      }
    ]
  };

  return (
    <div className="bg-[#0b1912] min-h-screen pb-16 text-gray-200">
      {/* JSON-LD for Google Rich Results */}
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Silent view tracker */}
      <ViewTracker type="video" slug={video.slug} />

      {/* Video Hero Section */}
      <section className="bg-black border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="aspect-video w-full bg-black relative flex items-center justify-center group overflow-hidden">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isDirectVideo ? (
              <video
                src={`${API_URL}${video.videoUrl}`}
                controls
                className="w-full h-full absolute inset-0 object-contain"
                poster={
                  getPublicImageUrl(video.coverImage || video.thumbnail)
                }
              />
            ) : (
              // Fallback if no valid URL
              <div className="relative w-full h-full">
                <img
                  src={getPublicImageUrl(video.coverImage || video.thumbnail)}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600/80 p-4 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play size={40} className="text-white ml-2" fill="white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (Details) */}
        <div className="lg:col-span-2">
          <nav className="flex items-center text-xs text-gray-400 mb-4 font-medium uppercase tracking-widest">
            <Link href="/" className="hover:text-red-400">
              Beranda
            </Link>
            <ChevronRight size={14} className="mx-2 opacity-50" />
            <Link href="/mcn-play" className="hover:text-red-400">
              MCN Play
            </Link>
          </nav>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-serif leading-tight mb-4 drop-shadow-sm">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-800 mb-6 bg-[#0f2d1f]/50 px-4 rounded-lg">
            <div className="flex items-center gap-4">
              {video.author?.image ? (
                <img
                  src={getPublicImageUrl(video.author.image)}
                  alt="Author"
                  className="w-10 h-10 rounded-full ring-2 ring-gray-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-gray-700">
                  <User size={18} className="text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-100 text-sm">
                  {video.author?.name || "MCN Play"}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />{" "}
                    {new Date(
                      video.publishedAt || video.createdAt,
                    ).toLocaleDateString("id-ID")}
                  </span>
                  {video.duration && (
                    <span className="flex items-center gap-1.5">
                      <Play size={10} fill="currentColor" /> {video.duration}
                    </span>
                  )}
                  {video.viewCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Eye size={12} /> {video.viewCount.toLocaleString("id-ID")} tayangan
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <article className="video-description mb-8">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  video.description || "<p>Tidak ada deskripsi tersedia.</p>",
              }}
            />
          </article>

          {/* Tags / Categories */}
          {video.categories && video.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {video.categories.map((catObj: any) => (
                <span
                  key={catObj.category.id}
                  className="text-xs font-bold bg-white/10 text-gray-200 px-3 py-1.5 rounded hover:bg-white/20 hover:text-white transition cursor-pointer"
                >
                  {catObj.category.name}
                </span>
              ))}
            </div>
          )}

          <ShareButtons title={video.title} url={shareUrl} />
        </div>

        {/* Right Column (Video Lainnya) */}
        <div className="lg:col-span-1">
          <div className="bg-[#0f2d1f] rounded-xl border border-gray-800 p-5 sticky top-24 shadow-2xl">
            <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2 mb-6 pb-4 border-b border-gray-700/50">
              <VideoIcon size={20} className="text-red-500" /> Video Lainnya
            </h3>

            <div className="flex flex-col gap-5">
              {latestVideos.map((relVid: any) => {
                const relImg = getPublicImageUrl(relVid.thumbnail || relVid.coverImage);

                return (
                  <Link
                    key={relVid.id}
                    href={`/mcn-play/${relVid.slug}`}
                    className="group flex gap-3"
                  >
                    <div className="relative w-32 shrink-0 aspect-video rounded overflow-hidden shadow-md ring-1 ring-white/10">
                      <img
                        src={relImg}
                        alt={relVid.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center">
                        <Play
                          size={16}
                          className="text-white drop-shadow-md group-hover:scale-125 transition-transform"
                          fill="currentColor"
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-bold text-white">
                        {relVid.duration || "Bermain"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-gray-200 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                        {relVid.title}
                      </h4>
                      {relVid.views > 0 && (
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                          <Eye size={10} /> {relVid.views} tayangan
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
