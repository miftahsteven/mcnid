import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET ?? "Zi2pi4sD3guktXngbY2NP9ZrohLWUGP8Abw16tziEqE=";
const secret = new TextEncoder().encode(JWT_SECRET);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya proses route admin-panel
  if (!pathname.startsWith("/admin-panel")) {
    return NextResponse.next();
  }

  // Izinkan akses ke login page
  if (pathname === "/admin-panel/login") {
    return NextResponse.next();
  }

  // Cek token
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    const loginUrl = new URL("/admin-panel/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // RBAC logic for frontend routes
    const role = payload.role as string;
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      let isAllowed = pathname === "/admin-panel";

      if (role === "PENGAJAR") {
        // Pengajar only allowed to access MCN Academy / Courses
        const allowedPrefixes = ["/admin-panel/courses"];
        isAllowed = isAllowed || allowedPrefixes.some((p) => pathname.startsWith(p));
      } else {
        // Writer/Content Manager/Editor allowed on posts, videos, courses
        const allowedPrefixes = [
          "/admin-panel/posts",
          "/admin-panel/videos",
          "/admin-panel/courses",
        ];
        isAllowed = isAllowed || allowedPrefixes.some((p) => pathname.startsWith(p));
      }

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/admin-panel", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    // Token expired atau invalid
    const loginUrl = new URL("/admin-panel/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: ["/admin-panel/:path*"],
};
