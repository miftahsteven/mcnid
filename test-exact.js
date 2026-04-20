const process = { env: { NEXT_PUBLIC_IMAGE_URL: "https://api.mcnid.net/uploads" } };

export function getPublicImageUrl(path) {
  if (!path) return "/placeholder-news.jpg";

  const rawBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://api.mcnid.net";
  
  let baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  if (baseUrl.endsWith('/public')) {
    baseUrl = baseUrl.slice(0, -7);
  } else if (baseUrl.endsWith('/uploads')) {
    baseUrl = baseUrl.slice(0, -8);
  }

  if (path.includes("localhost:") || path.includes("api.mcnid.net")) {
    return path.replace(/https?:\/\/localhost:\d+/g, baseUrl)
      .replace(/https?:\/\/api\.mcnid\.net/g, baseUrl)
      .replace("/public/uploads/", "/uploads/");
  }

  if (!path.startsWith("http")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const finalCleanPath = cleanPath.replace("/public/uploads/", "/uploads/");
    return `${baseUrl}${finalCleanPath}`;
  }

  return path.replace(/http:\/\/api\.mcnid\.net/g, "https://api.mcnid.net")
    .replace("/public/uploads/", "/uploads/");
}

console.log(getPublicImageUrl("https://api.mcnid.net/public/uploads/3cc2f246-77f9-4870-8c50-722e103f4f5e.jpg"));
console.log(getPublicImageUrl("/public/uploads/3cc2f246-77f9-4870-8c50-722e103f4f5e.jpg"));
