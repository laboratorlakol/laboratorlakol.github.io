import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { AccessibilityProvider } from "@/lib/accessibility/accessibility-context";
import { AccessibilityButton } from "@/components/accessibility/accessibility-button";

const SITE_URL = "https://faded.ro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "FADED ROMANIA ROLEPLAY", template: "%s | FADED ROMANIA ROLEPLAY" },
  description: "Experiența roleplay premium din România. Economie realistă, facțiuni, mafii, business-uri și evenimente pe un server FiveM construit pentru roleplay serios.",
  keywords: ["FiveM","roleplay","server romania","FADED","GTA RP","QBox"],
  openGraph: { title: "FADED ROMANIA ROLEPLAY", description: "Experiența roleplay premium din România.", url: SITE_URL, siteName: "FADED Romania Roleplay", locale: "ro_RO", type: "website" },
  twitter: { card: "summary_large_image", title: "FADED ROMANIA ROLEPLAY", description: "Experiența roleplay premium din România." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AccessibilityProvider>
          <AuthProvider>{children}</AuthProvider>
          <AccessibilityButton />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
