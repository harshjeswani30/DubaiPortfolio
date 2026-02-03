import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            )
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPG, PNG, WebP, and GIF are allowed." },
                { status: 400 }
            )
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            )
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split(".").pop()
        const filename = `${timestamp}-${randomString}.${extension}`

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("project-images")
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            })

        if (error) {
            console.error("Supabase upload error:", error)

            // Check if bucket doesn't exist
            if (error.message.includes("not found") || error.message.includes("does not exist")) {
                // Try to create the bucket
                const { error: bucketError } = await supabase.storage.createBucket("project-images", {
                    public: true,
                    fileSizeLimit: MAX_FILE_SIZE,
                })

                if (bucketError) {
                    console.error("Bucket creation error:", bucketError)
                    return NextResponse.json(
                        { error: "Storage bucket not configured. Please contact administrator." },
                        { status: 500 }
                    )
                }

                // Retry upload after creating bucket
                const { data: retryData, error: retryError } = await supabase.storage
                    .from("project-images")
                    .upload(filename, buffer, {
                        contentType: file.type,
                        cacheControl: "3600",
                        upsert: false,
                    })

                if (retryError) {
                    console.error("Retry upload error:", retryError)
                    return NextResponse.json(
                        { error: "Failed to upload image" },
                        { status: 500 }
                    )
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from("project-images")
                    .getPublicUrl(retryData.path)

                return NextResponse.json({
                    url: urlData.publicUrl,
                    filename: retryData.path,
                })
            }

            return NextResponse.json(
                { error: "Failed to upload image" },
                { status: 500 }
            )
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(data.path)

        return NextResponse.json({
            url: urlData.publicUrl,
            filename: data.path,
        })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
