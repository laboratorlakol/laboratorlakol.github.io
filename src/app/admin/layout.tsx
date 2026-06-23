"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  LayoutDashboard,
  Users,
  Contact,
  Newspaper,
  Settings,
  MessageSquare,
  ScrollText,
  Loader2,
  ExternalLink,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Utilizatori", icon: Users },
  { href: "/admin/forum", label: "Forum", icon: MessageSquare },
  { href: "/admin/regulament", label: "Regulament", icon: ScrollText },
  { href: "/admin/team", label: "Echipă", icon: Contact },
  { href: "/admin/news", label: "Noutăți", icon: Newspaper },
  { href: "/admin/settings", label: "Setări", icon: Settings },
];

// Mirrors PANEL_ACCESS_MIN_ROLE in lib/auth/rbac.ts — kept as a flat list
// here since this file can't import the Prisma-typed rbac helpers (client
// component); the real enforcement happens server-side on every API call.
const PANEL_ROLES = ["COMMUNITY_MANAGER", "CO_FOUNDER", "FOUNDER"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user || !PANEL_ROLES.includes(user.role)) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user || !PANEL_ROLES.includes(user.role)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-void">
        <Loader2 className="animate-spin text-signal" size={32} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-void flex">
      <aside className="w-60 shrink-0 border-r border-line flex flex-col">
        <div className="px-5 py-5 border-b border-line">
          <span className="font-display uppercase text-lg text-signal text-glow">
            FADED
          </span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            Admin
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-signal/10 text-signal border border-line"
                    : "text-ink-muted hover:text-ink hover:bg-panel"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-line">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-ink-faint hover:text-signal"
          >
            <ExternalLink size={14} />
            Înapoi pe site
          </Link>
        </div>
      </aside>

      <div className="flex-1 px-8 py-8 max-w-6xl">{children}</div>
    </div>
  );
}
