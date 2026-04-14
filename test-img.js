const process = { env: { NEXT_PUBLIC_IMAGE_URL: "https://api.mcnid.net/public" } };

export function getPublicImageUrl(path) {
  if (!path) return "/placeholder-news.jpg";

  const rawBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://api.mcnid.net";
  
  let baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  if (baseUrl.endsWith('/public')) {
    baseUrl = baseUrl.slice(0, -7);
  }

  if (path.includes("localhost:") || path.includes("api.mcnid.net")) {
    return path.replace(/https?:\/\/localhost:\d+/g, baseUrl)
               .replace(/https?:\/\/api\.mcnid\.net/g, baseUrl)
               .replace("/public/uploads/", "/uploads/");
  }

  if (!path.startsWith("http")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  return path.replace(/http:\/\/api\.mcnid\.net/g, "https://api.mcnid.net")
             .replace("/public/uploads/", "/uploads/");
}

console.log(getPublicImageUrl("https://api.mcnid.net/public/uploads/2943b5dd-81f2-462f-948e-0d4aa730fadc.png"));
