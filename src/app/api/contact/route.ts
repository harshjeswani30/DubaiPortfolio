import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Rate limiting map: email -> last submission timestamp
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_MINUTES = 5 // 5 minutes between submissions

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Rate limiting check
    const now = Date.now()
    const lastSubmission = rateLimitMap.get(email.toLowerCase())
    
    if (lastSubmission) {
      const timeDiff = now - lastSubmission
      const minutesPassed = timeDiff / (1000 * 60)
      
      if (minutesPassed < RATE_LIMIT_MINUTES) {
        const waitMinutes = Math.ceil(RATE_LIMIT_MINUTES - minutesPassed)
        return NextResponse.json(
          { error: `Please wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before sending another message` },
          { status: 429 }
        )
      }
    }

    // Check for duplicate messages in last hour
    const supabase = await createClient()
    const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString()
    
    const { data: recentMessages } = await supabase
      .from("contact_submissions")
      .select("message")
      .eq("email", email.toLowerCase())
      .gte("created_at", oneHourAgo)
      .limit(1)
    
    if (recentMessages && recentMessages.length > 0) {
      if (recentMessages[0].message === message) {
        return NextResponse.json(
          { error: "Duplicate message detected. Please wait before sending the same message again" },
          { status: 429 }
        )
      }
    }

    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
    })

    if (error) {
      console.error("Contact submission error:", error)
      return NextResponse.json(
        { error: "Failed to submit contact form" },
        { status: 500 }
      )
    }
    
    // Update rate limit map
    rateLimitMap.set(email.toLowerCase(), now)
    
    // Clean up old entries (older than 1 hour)
    for (const [key, timestamp] of rateLimitMap.entries()) {
      if (now - timestamp > 60 * 60 * 1000) {
        rateLimitMap.delete(key)
      }
    }
    
    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch (error) {
    console.error("Contact submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
