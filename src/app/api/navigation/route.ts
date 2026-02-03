import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("navigation_menu")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    // Return default menu if database query fails
    return NextResponse.json({
      data: [
        { id: "1", label: "Home", href: "/", display_order: 0, is_active: true },
        { id: "2", label: "About", href: "/about", display_order: 1, is_active: true },
        { id: "3", label: "Projects", href: "/projects", display_order: 2, is_active: true },
        { id: "4", label: "Skills", href: "/skills", display_order: 3, is_active: true },
        { id: "5", label: "Resume", href: "/resume", display_order: 4, is_active: true },
        { id: "6", label: "Blog", href: "/blog", display_order: 5, is_active: true },
        { id: "7", label: "Contact", href: "/contact", display_order: 6, is_active: true },
      ],
    })
  }

  return NextResponse.json({ data })
}
