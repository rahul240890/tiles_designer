import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";

export function middleware(req: NextRequest) {
    const token = getCookie("token", { req });

    if (!token && req.nextUrl.pathname !== "/auth/login") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/admin/:path*", "/sellers/:path*"],
};
