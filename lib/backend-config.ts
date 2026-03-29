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
 * Replaces localhost:4000 with the actual production API URL to avoid Mixed Content errors.
 */
export function getPublicImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-news.jpg";

  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  
  // 1. If it's already a full URL pointing to localhost:4000, swap it
  if (path.includes("localhost:4000")) {
    return path.replace(/http:\/\/localhost:4000/g, publicApiUrl);
  }

  // 2. If it's another absolute URL (e.g. S3, external site), return as is
  if (path.startsWith("http")) {
    return path;
  }

  // 3. If it's a relative path, prefix it
  // Ensure we don't have double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${publicApiUrl}${cleanPath}`;
}
