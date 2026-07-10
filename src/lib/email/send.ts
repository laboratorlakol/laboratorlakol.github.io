import { Resend } from "resend";
const FROM = process.env.EMAIL_FROM ?? "FADED Romania Roleplay <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
function getClient() { const k = process.env.RESEND_API_KEY; if (!k) return null; return new Resend(k); }
export async function sendVerificationEmail(to: string, token: string) {
  const url = `${SITE_URL}/verify-email?token=${token}`;
  const c = getClient();
  if (!c) { console.warn(`[email] RESEND_API_KEY not set. Verify link: ${url}`); return; }
  await c.emails.send({ from: FROM, to, subject: "Confirmă-ți adresa de email — FADED Romania Roleplay", html: `<div style="font-family:Inter,Arial,sans-serif;background:#0a0a0a;color:#fff;padding:32px"><h1 style="color:#4EFF3A">FADED ROMANIA ROLEPLAY</h1><p>Confirmă adresa de email pentru a-ți activa contul.</p><p style="margin:24px 0"><a href="${url}" style="background:#4EFF3A;color:#0a0a0a;padding:12px 20px;text-decoration:none;font-weight:600">Confirmă email</a></p><p style="color:#999;font-size:13px">Link: ${url}</p><p style="color:#666;font-size:12px">Expiră în 24 de ore.</p></div>` });
}
export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${SITE_URL}/reset-password?token=${token}`;
  const c = getClient();
  if (!c) { console.warn(`[email] Reset link: ${url}`); return; }
  await c.emails.send({ from: FROM, to, subject: "Resetare parolă — FADED Romania Roleplay", html: `<div style="font-family:Inter,Arial,sans-serif;background:#0a0a0a;color:#fff;padding:32px"><h1 style="color:#4EFF3A">FADED ROMANIA ROLEPLAY</h1><p>Cerere de resetare parolă.</p><p style="margin:24px 0"><a href="${url}" style="background:#4EFF3A;color:#0a0a0a;padding:12px 20px;text-decoration:none;font-weight:600">Resetează parola</a></p><p style="color:#666;font-size:12px">Expiră în 1 oră.</p></div>` });
}
