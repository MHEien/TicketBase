import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");
  const isAdminRoute =
    req.nextUrl.pathname.startsWith("/(admin)") ||
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname === "/";

  // If the user is logged in and tries to access auth routes, redirect to admin
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // If user is not logged in and tries to access admin routes, redirect to login
  if (!isLoggedIn && isAdminRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  return NextResponse.next();
});

// Specify the routes this middleware should match
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
