"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            src="/logo/faded-wordmark.svg"
            alt="FADED Romania Roleplay"
            width={140}
            height={30}
            priority
          />
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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Conectează-te</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/register">Creează Cont</Link>
          </Button>
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
            <Button variant="outline" asChild>
              <Link href="/login">Conectează-te</Link>
            </Button>
            <Button variant="primary" asChild>
              <Link href="/register">Creează Cont</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
