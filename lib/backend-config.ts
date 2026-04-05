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

  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.mcnid.net";
  
  // 1. If it's already a full URL pointing to localhost:4000 or http://api.mcnid.net
  // we normalize it to the official public API URL (which should be HTTPS in production)
  if (path.includes("localhost:4000") || path.includes("http://api.mcnid.net")) {
    return path.replace(/http:\/\/localhost:4000/g, publicApiUrl)
               .replace(/http:\/\/api\.mcnid\.net/g, publicApiUrl);
  }

  // 2. If it's a relative path, prefix it with the public API URL
  if (!path.startsWith("http")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${publicApiUrl}${cleanPath}`;
  }

  // 3. If it's another absolute URL (S3, external site), return as is
  // But still try to upgrade to https if it's our domain just in case of edge cases
  return path.replace("http://api.mcnid.net", "https://api.mcnid.net");
}
