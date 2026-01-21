import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "portfolio-secret-key"
const key = new TextEncoder().encode(secretKey)

async function isValidSessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] })
    const expiresAt = payload.expiresAt
    if (!expiresAt) return false
    const expMs =
      typeof expiresAt === "string"
        ? Date.parse(expiresAt)
        : typeof expiresAt === "number"
          ? expiresAt
          : NaN
    if (!Number.isFinite(expMs)) return false
    return expMs > Date.now()
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPage = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin")

  const allowList =
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"

  if ((isAdminPage || isAdminApi) && !allowList) {
    const sessionToken = request.cookies.get("session")?.value
    const ok = sessionToken ? await isValidSessionToken(sessionToken) : false
    if (!ok) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

