import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { createAdminClient } from "./supabase/server"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "portfolio-admin-secret-key")

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function createToken(user: AdminUser): Promise<string> {
  return new SignJWT({ 
    id: user.id, 
    email: user.email, 
    name: user.name, 
    role: user.role 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    }
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

export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin_token")
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  const supabase = await createAdminClient()
  const { data: user, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .single()

  if (error || !user) return null

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name || "Admin",
    role: user.role || "admin",
  }
}
