import { cookies } from "next/headers";

export const ACCESS_COOKIE = "faded_access";
export const REFRESH_COOKIE = "faded_refresh";

const isProd = process.env.NODE_ENV === "production";

export async function setAccessCookie(token: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes, mirrors the JWT's own expiry
  });
}

export async function setRefreshCookie(token: string) {
  const store = await cookies();
  store.set(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.set(REFRESH_COOKIE, "", { path: "/api/auth", maxAge: 0 });
}

export async function getAccessCookie() {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshCookie() {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}
