/**
 * Centralized backend URL configuration for Next.js API proxy routes.
 * 
 * Priority:
 * 1. BACKEND_URL env var (set this in .env.local on server)
 * 2. NEXT_PUBLIC_API_URL (fallback — converts http to https for safety)
 * 3. http://localhost:4000 (last resort for local dev)
 */
export const BACKEND_URL = 
  process.env.BACKEND_URL || 
  process.env.NEXT_PUBLIC_API_URL || 
  'http://localhost:4000';

export const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || '';

/**
 * Normalizes an image path or full URL.
 * Ensures that images pointing to our API are always loaded over HTTPS to avoid Mixed Content errors.
 */
export function getPublicImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-news.jpg";

  // Priority for image base URL:
  // 1. NEXT_PUBLIC_IMAGE_URL (allows pointing to prod images in dev)
  // 2. NEXT_PUBLIC_API_URL
  // 3. Fallback to production
  const rawBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.mcnid.net";
  
  // Clean the base URL (strip trailing slash and /public suffix)
  let baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  if (baseUrl.endsWith('/public')) {
    baseUrl = baseUrl.slice(0, -7);
  }

  // 1. If it's already a full URL pointing to any localhost or our api domain
  // we normalize it to our cleaned base URL and ensure /public is stripped
  if (path.includes("localhost:") || path.includes("api.mcnid.net")) {
    return path.replace(/https?:\/\/localhost:\d+/g, baseUrl)
               .replace(/https?:\/\/api\.mcnid\.net/g, baseUrl)
               .replace("/public/uploads/", "/uploads/");
  }

  // 2. If it's a relative path, prefix it with the cleaned base URL
  if (!path.startsWith("http")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    // Ensure we strip /public if the relative path contains it
    const finalCleanPath = cleanPath.replace("/public/uploads/", "/uploads/");
    return `${baseUrl}${finalCleanPath}`;
  }

  // 3. For any other absolute URL, check if it's our domain (case where it didn't match step 1)
  // and fix https/public issues
  return path.replace(/http:\/\/api\.mcnid\.net/g, "https://api.mcnid.net")
             .replace("/public/uploads/", "/uploads/");
}
