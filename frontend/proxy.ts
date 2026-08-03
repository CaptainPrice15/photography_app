import { NextResponse } from "next/server";

export function proxy() {
  // Auth handled client-side for now; proxy will be enhanced with JWT verification later.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|images).*)"],
};