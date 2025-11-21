import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// const whitelist = (process.env.WHITELISTED_EMAILS ?? "").split(",");

export default async function middleware(req: Request) {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // Static CRON token
  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${process.env.CRON_SECRET_TOKEN}`) return NextResponse.next();

  const cookieKey =
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: cookieKey,
  });

  if (!token) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

//   if (!whitelist.includes(token.email!)) {
//     const res = new NextResponse("Unauthorized", { status: 401 });
//     res.cookies.set(cookieKey, "", { maxAge: -1 });
//     return res;
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!login).*)"],
};
