import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { createClient } from "@/lib/supabase/server"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "portfolio-admin-secret-key-2025"
)

export interface AdminUser {
  id: string
  email: string
  name: string
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

export async function createToken(user: AdminUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.user as AdminUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token) return null
  return verifyToken(token)
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const supabase = await createClient()
  const { data: user, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .single()

  if (error || !user) {
    return { success: false, error: "Invalid credentials" }
  }

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) {
    return { success: false, error: "Invalid credentials" }
  }

  const adminUser: AdminUser = {
    id: user.id,
    email: user.email,
    name: user.name || "Admin",
  }

  const token = await createToken(adminUser)
  const cookieStore = await cookies()
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return { success: true, user: adminUser }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin_token")
}
