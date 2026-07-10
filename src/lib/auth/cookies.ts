import { cookies } from "next/headers";
export const ACCESS_COOKIE = "faded_access";
export const REFRESH_COOKIE = "faded_refresh";
const isProd = process.env.NODE_ENV === "production";
export async function setAccessCookie(token: string) { const s = await cookies(); s.set(ACCESS_COOKIE, token, { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 15*60 }); }
export async function setRefreshCookie(token: string) { const s = await cookies(); s.set(REFRESH_COOKIE, token, { httpOnly: true, secure: isProd, sameSite: "lax", path: "/api/auth", maxAge: 30*24*60*60 }); }
export async function clearAuthCookies() { const s = await cookies(); s.delete(ACCESS_COOKIE); s.set(REFRESH_COOKIE,"",{path:"/api/auth",maxAge:0}); }
export async function getAccessCookie() { const s = await cookies(); return s.get(ACCESS_COOKIE)?.value ?? null; }
export async function getRefreshCookie() { const s = await cookies(); return s.get(REFRESH_COOKIE)?.value ?? null; }
