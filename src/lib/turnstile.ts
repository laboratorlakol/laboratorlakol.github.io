export async function verifyTurnstileToken(token: string | undefined | null, ip?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }) });
    const d = await res.json();
    return d.success === true;
  } catch { return false; }
}
