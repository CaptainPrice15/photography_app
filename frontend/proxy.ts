import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/profile", "/favourites", "/collections", "/cart", "/checkout"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For now, we'll let the client-side handle auth checks
  // Proxy will be enhanced with JWT verification later
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|images).*)",
  ],
};
