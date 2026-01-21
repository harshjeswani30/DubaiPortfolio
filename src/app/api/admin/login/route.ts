import { NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth"

const FIXED_ADMIN_EMAIL = "harshjeswani30@gmail.com"
const FIXED_ADMIN_PASSWORD = "Harsh0000.."

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const email = body?.email
    const password = body?.password

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    if (email.toLowerCase() !== FIXED_ADMIN_EMAIL.toLowerCase() || password !== FIXED_ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession("admin")
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

