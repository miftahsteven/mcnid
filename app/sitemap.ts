import type { MetadataRoute } from "next";

const SITE_URL = "https://mcnid.net";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.mcnid.net";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";

// Static public routes
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/berita`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/mcn-play`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/mcn-academy`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/zis-network`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/opini`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/konsultasi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  },
];

async function fetchPostSlugs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, {
      headers: { "x-api-key": INTERNAL_API_KEY },
      next: { revalidate: 3600 }, // revalidate hourly
    });
    if (!res.ok) return [];
    const json = await res.json();
    const posts: Array<{ slug: string; publishedAt?: string; createdAt?: string }> =
      json.data || [];

    return posts.map((post) => ({
      url: `${SITE_URL}/berita/${post.slug}`,
      lastModified: new Date(post.publishedAt || post.createdAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error("[sitemap] Failed to fetch posts:", err);
    return [];
  }
}

async function fetchVideoSlugs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/api/videos`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const videos: Array<{ slug: string; publishedAt?: string; createdAt?: string }> =
      json.data || [];

    return videos.map((video) => ({
      url: `${SITE_URL}/mcn-play/${video.slug}`,
      lastModified: new Date(video.publishedAt || video.createdAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("[sitemap] Failed to fetch videos:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postEntries, videoEntries] = await Promise.all([
    fetchPostSlugs(),
    fetchVideoSlugs(),
  ]);

  return [...staticRoutes, ...postEntries, ...videoEntries];
}
