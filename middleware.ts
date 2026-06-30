import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicPath, SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/verifySession";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" &&
    (request.nextUrl.searchParams.has("card") ||
      request.nextUrl.searchParams.has("shadow") ||
      request.nextUrl.searchParams.has("block") ||
      request.nextUrl.searchParams.get("view") === "exam")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/part1";
    return NextResponse.redirect(url);
  }

  const authed = await isAuthenticated(request);

  if (isPublicPath(pathname)) {
    if (pathname === "/login" && authed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|ico|mp3|webmanifest)$).*)",
  ],
};
