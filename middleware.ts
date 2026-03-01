import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  const token = process.env.NOVANODE_ADMIN_TOKEN;
  if (!token) return false;

  const headerToken = request.headers.get("x-admin-token");
  const queryToken = request.nextUrl.searchParams.get("token");
  const cookieToken = request.cookies.get("novanode_admin_token")?.value;

  return headerToken === token || queryToken === token || cookieToken === token;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }

  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        hint: "Login at /admin/login or provide x-admin-token",
      },
      { status: 401 },
    );
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
