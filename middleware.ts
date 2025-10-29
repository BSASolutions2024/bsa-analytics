import { auth } from "@/auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const whitelist = process.env.WHITELISTED_EMAILS!.split(",");

export default auth(async (req) => {

    const cookieKey =
        process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token";

    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
    });


    if (!token) {
        const signInUrl = new URL("/api/auth/signin", req.url);
        // Optionally, include callbackUrl so user is redirected back after login
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

        return NextResponse.redirect(signInUrl);
    }

    if (!whitelist.includes(token.email!)) {
        const res = new NextResponse("Unauthorized", { status: 401 });

        // ❌ Clear the session cookie (logs out the user)
        res.cookies.set(cookieKey, "", { maxAge: -1 });

        return res;
    }

    return NextResponse.next();
})

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/login",
        "/offboarding"
    ]
}