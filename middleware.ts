import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  const token = process.env.NOVANODE_ADMIN_TOKEN;
  if (!token) return false;

  const headerToken = request.headers.get("x-admin-token");
  const queryToken = request.nextUrl.searchParams.get("token");

  return headerToken === token || queryToken === token;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          hint: "Set NOVANODE_ADMIN_TOKEN and pass it via ?token=... or x-admin-token header",
        },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
