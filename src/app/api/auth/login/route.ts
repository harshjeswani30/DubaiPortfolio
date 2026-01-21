import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Authentication is disabled in frontend-only mode" },
    { status: 403 }
  )
}
