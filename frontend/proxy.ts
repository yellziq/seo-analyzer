import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/analyze", "/history", "/reports", "/settings"];

export function proxy(request: NextRequest): NextResponse {
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("seo-auth");

  if (authCookie?.value === "true") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/analyze/:path*",
    "/history/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
