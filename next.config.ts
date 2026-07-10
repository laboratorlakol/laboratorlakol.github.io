import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://faded.ro";

const securityHeaders = [
  // Prevent clickjacking — site cannot be embedded in an iframe on another domain
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Prevent MIME-type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Control how much referrer info is sent when navigating away
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict access to browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Prevent cross-origin opener attacks (XS-Leaks)
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  // Remove server fingerprinting info added by some reverse proxies
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Content-Security-Policy: tuned for Next.js + Google Fonts + Cloudflare Turnstile.
  // 'unsafe-inline' is required for Next.js hydration inline scripts.
  // 'unsafe-eval' is required for some Framer Motion + React dev internals.
  // For production hardening with nonces, see: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "frame-src https://challenges.cloudflare.com",
      "connect-src 'self' https://challenges.cloudflare.com",
      "worker-src blob:",
      `frame-ancestors 'self' ${SITE_URL}`,
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
