import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "FADED Romania Roleplay <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${SITE_URL}/verify-email?token=${token}`;
  const client = getClient();

  if (!client) {
    // RESEND_API_KEY not configured yet — don't block registration, just
    // surface the link so it's still usable while developing locally.
    console.warn(
      `[email] RESEND_API_KEY not set. Verification link for ${to}: ${verifyUrl}`
    );
    return;
  }

  await client.emails.send({
    from: FROM,
    to,
    subject: "Confirmă-ți adresa de email — FADED Romania Roleplay",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#0a0a0a;color:#fff;padding:32px">
        <h1 style="color:#4EFF3A;font-size:20px;">FADED ROMANIA ROLEPLAY</h1>
        <p>Salut! Confirmă adresa de email pentru a-ți activa complet contul.</p>
        <p style="margin:24px 0">
          <a href="${verifyUrl}" style="background:#4EFF3A;color:#0a0a0a;padding:12px 20px;text-decoration:none;font-weight:600;border-radius:4px;">
            Confirmă email
          </a>
        </p>
        <p style="color:#999;font-size:13px;">
          Dacă linkul nu funcționează, copiază această adresă în browser:<br/>${verifyUrl}
        </p>
        <p style="color:#666;font-size:12px;">Linkul expiră în 24 de ore.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${SITE_URL}/reset-password?token=${token}`;
  const client = getClient();

  if (!client) {
    console.warn(
      `[email] RESEND_API_KEY not set. Password reset link for ${to}: ${resetUrl}`
    );
    return;
  }

  await client.emails.send({
    from: FROM,
    to,
    subject: "Resetare parolă — FADED Romania Roleplay",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#0a0a0a;color:#fff;padding:32px">
        <h1 style="color:#4EFF3A;font-size:20px;">FADED ROMANIA ROLEPLAY</h1>
        <p>Am primit o cerere de resetare a parolei pentru contul tău.</p>
        <p style="margin:24px 0">
          <a href="${resetUrl}" style="background:#4EFF3A;color:#0a0a0a;padding:12px 20px;text-decoration:none;font-weight:600;border-radius:4px;">
            Resetează parola
          </a>
        </p>
        <p style="color:#666;font-size:12px;">
          Dacă nu ai cerut tu asta, ignoră acest email. Linkul expiră în 1 oră.
        </p>
      </div>
    `,
  });
}
