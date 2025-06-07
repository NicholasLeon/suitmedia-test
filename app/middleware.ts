// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/ideas")) {
    try {
      const response = await fetch(
        `https://suitmedia-backend.suitdev.com/api/ideas${request.nextUrl.search}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const jsonResponse = NextResponse.json(await response.json());
      jsonResponse.headers.set("Content-Type", "application/json");
      return jsonResponse;
    } catch (error) {
      return NextResponse.json(
        { error: "API request failed" },
        { status: 500 }
      );
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/proxy-image")) {
    try {
      const imageUrl = request.nextUrl.searchParams.get("url");
      if (!imageUrl) return new NextResponse("Missing URL", { status: 400 });

      const imageResponse = await fetch(imageUrl);
      return new NextResponse(imageResponse.body, {
        status: imageResponse.status,
        headers: {
          "Content-Type":
            imageResponse.headers.get("Content-Type") || "image/jpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (error) {
      return new NextResponse("Image proxy failed", { status: 502 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/ideas/:path*", "/api/proxy-image"],
};
