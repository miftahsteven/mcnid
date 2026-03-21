import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const p = await params;
  return handleProxyRequest(request, "GET", p.path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const p = await params;
  return handleProxyRequest(request, "POST", p.path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const p = await params;
  return handleProxyRequest(request, "PUT", p.path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const p = await params;
  return handleProxyRequest(request, "DELETE", p.path);
}

async function handleProxyRequest(request: NextRequest, method: string, pathParams?: string[]) {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
  const token = request.cookies.get("admin_token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pathname = request.nextUrl.pathname;
    const backendPath = pathname.replace(/^\/api\/admin\/proxy-users/, "/api/admin/users");
    const searchParams = request.nextUrl.searchParams.toString();
    const query = searchParams ? `?${searchParams}` : "";
    const backendEndpoint = `${BACKEND_URL}${backendPath}${query}`;

    const headers = new Headers();
    headers.set("Authorization", `Bearer ${token}`);
    
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    let body = undefined;
    if (["POST", "PUT"].includes(method)) {
      const text = await request.text();
      body = text || undefined;
    }

    const response = await fetch(backendEndpoint, {
      method,
      headers,
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
