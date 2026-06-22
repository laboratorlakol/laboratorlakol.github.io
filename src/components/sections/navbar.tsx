"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

const PANEL_ROLES = ["COMMUNITY_MANAGER", "CO_FOUNDER", "FOUNDER"];

const NAV_LINKS = [
  { label: "Despre", href: "#despre" },
  { label: "Features", href: "#features" },
  { label: "Galerie", href: "#galerie" },
  { label: "Echipă", href: "#echipa" },
  { label: "Noutăți", href: "#noutati" },
  { label: "Forum", href: "/forum" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-void/90 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo/faded-logo.png"
            alt="FADED Romania Roleplay"
            width={40}
            height={40}
            priority
            className="rounded-full"
          />
          <span className="font-display uppercase text-lg tracking-wide text-ink leading-none">
            FADED
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-7 font-mono text-xs uppercase tracking-wider text-ink-muted">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:text-signal"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              {PANEL_ROLES.includes(user.role) && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin" className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="inline-flex items-center gap-1.5">
                  <UserIcon size={14} /> {user.username}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut size={14} /> Deconectare
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Conectează-te</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/register">Creează Cont</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-void border-t border-line px-6 py-6 flex flex-col gap-5 font-mono text-sm uppercase tracking-wider">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-ink-muted hover:text-signal"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <>
                {PANEL_ROLES.includes(user.role) && (
                  <Button variant="outline" asChild>
                    <Link href="/admin" onClick={() => setOpen(false)}>
                      Admin Panel
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    {user.username}
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Deconectare
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Conectează-te
                  </Link>
                </Button>
                <Button variant="primary" asChild>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Creează Cont
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
