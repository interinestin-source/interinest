import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get("authToken")?.value;
  const role = request.cookies.get("role")?.value;
  const uid = request.cookies.get("uid")?.value;

  const isLoggedIn = !!(authToken && uid && role);

  // Redirect logged-in users away from auth pages
  if (pathname === "/dashboard/login" || pathname === "/dashboard/register") {
    if (isLoggedIn) {
      let redirectPath = "/";
      if (role === "designer") redirectPath = "/dashboard/designer-dashboard";
      else if (role === "admin" || role === "administratorrr") redirectPath = "/dashboard/admin";
      else if (role === "user") redirectPath = "/dashboard/user-dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  const protectedRoutes: Record<string, string> = {
    "/dashboard/designer-dashboard": "designer",
    "/dashboard/admin": "admin",
    "/dashboard/user-dashboard": "user",
  };

  for (const [route, requiredRole] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      if (!isLoggedIn) {
        const loginUrl = new URL("/dashboard/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (role !== requiredRole && !(requiredRole === "admin" && role === "administratorrr")) {
        let redirectPath = "/dashboard/login";
        if (role === "designer") redirectPath = "/dashboard/designer-dashboard";
        else if (role === "admin" || role === "administratorrr") redirectPath = "/dashboard/admin";
        else if (role === "user") redirectPath = "/dashboard/user-dashboard";
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/login",
    "/dashboard/register",
    "/dashboard/designer-dashboard/:path*",
    "/dashboard/admin/:path*",
    "/dashboard/user-dashboard/:path*",
  ],
};
