import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { createClient } from "@/lib/supabase/server"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "admin-secret-key-change-in-production"
)

export interface AdminUser {
  id: string
  email: string
  name: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createAdminToken(user: AdminUser): Promise<string> {
  return new SignJWT({ userId: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyAdminToken(
  token: string
): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      id: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string | null,
    }
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function setAdminSession(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin_token")
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .single()

  if (error || !data) return null

  const isValid = await verifyPassword(password, data.password_hash)
  if (!isValid) return null

  return {
    id: data.id,
    email: data.email,
    name: data.name,
  }
}

export async function createAdminUser(
  email: string,
  password: string,
  name: string
): Promise<AdminUser | null> {
  const supabase = await createClient()
  const passwordHash = await hashPassword(password)

  const { data, error } = await supabase
    .from("admin_users")
    .insert({ email, password_hash: passwordHash, name })
    .select()
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    email: data.email,
    name: data.name,
  }
}
