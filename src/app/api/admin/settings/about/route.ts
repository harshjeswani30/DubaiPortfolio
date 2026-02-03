import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { defaultAboutData } from "@/lib/default-about-data"

export async function GET() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("about_page")
    .select(`
      *,
      sections:about_sections(*)
    `)
    .eq("is_active", true)
    .single()
  
  if (error) {
    // Return default sample data for admin panel
    return NextResponse.json({ 
      data: { 
        hero_image: defaultAboutData.hero_image, 
        main_title: defaultAboutData.main_title, 
        is_active: true, 
        sections: defaultAboutData.sections || [] 
      } 
    })
  }
  
  return NextResponse.json({ data })
}

export async function PUT(request: NextRequest) {
  const supabase = await createAdminClient()
  const body = await request.json().catch(() => null)
  
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // Check if record exists
  const { data: existing } = await supabase
    .from("about_page")
    .select("id")
    .eq("is_active", true)
    .single()

  let aboutPageId
  
  if (existing) {
    // Update existing record
    const { data: updated, error: updateError } = await supabase
      .from("about_page")
      .update({ 
        hero_image: body.hero_image, 
        main_title: body.main_title,
        is_active: body.is_active 
      })
      .eq("id", existing.id)
      .select("id")
      .single()
      
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    aboutPageId = updated.id
  } else {
    // Insert new record
    const { data: inserted, error: insertError } = await supabase
      .from("about_page")
      .insert({ 
        hero_image: body.hero_image, 
        main_title: body.main_title,
        is_active: body.is_active 
      })
      .select("id")
      .single()
      
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
    aboutPageId = inserted.id
  }

  // Delete existing sections
  await supabase
    .from("about_sections")
    .delete()
    .eq("about_page_id", aboutPageId)

  // Insert new sections
  if (body.sections && body.sections.length > 0) {
    const sectionsToInsert = body.sections.map((section: any) => ({
      about_page_id: aboutPageId,
      type: section.type,
      title: section.title || null,
      text: section.text || null,
      images: section.images || [],
      order: section.order,
    }))

    const { error: sectionsError } = await supabase
      .from("about_sections")
      .insert(sectionsToInsert)

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 })
    }
  }

  // Fetch updated data with sections
  const { data: finalData } = await supabase
    .from("about_page")
    .select(`
      *,
      sections:about_sections(*)
    `)
    .eq("id", aboutPageId)
    .single()
  
  return NextResponse.json({ data: finalData })
}

