const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Returns true if the token is valid. If TURNSTILE_SECRET_KEY isn't set
 * yet, this is a no-op that always passes — register/login keep working
 * while you set up Cloudflare, and verification turns on the moment you
 * add the env var (no code change needed).
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  ip?: string | null
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  if (!token) return false;

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    // Cloudflare unreachable — fail closed (reject) rather than letting a
    // network blip silently disable the anti-bot check.
    return false;
  }
}
