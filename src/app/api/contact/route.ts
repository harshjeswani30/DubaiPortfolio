import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    console.log("Contact submission received:", { name, email, subject, message })
    // In a real frontend-only site, you might use a service like Formspree or just log it.
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
