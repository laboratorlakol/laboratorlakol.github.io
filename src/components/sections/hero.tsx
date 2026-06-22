"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag, BookOpenText } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-void">
      {/* Ambient glow + smoke layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(78,255,58,0.14),transparent_60%)]" />
        <div
          aria-hidden
          className="smoke-drift absolute -top-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-signal/10 blur-[120px]"
        />
        <div
          aria-hidden
          className="smoke-drift absolute bottom-0 right-0 w-[45vw] h-[45vw] rounded-full bg-signal-dim/10 blur-[140px]"
          style={{ animationDelay: "6s" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,var(--void)_92%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-signal border border-line rounded-full px-4 py-1.5 mb-8"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          Server Online
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display uppercase text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] tracking-tight text-ink text-glow"
        >
          FADED
          <span className="block text-signal">ROMANIA ROLEPLAY</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-ink-muted"
        >
          Experiența roleplay premium din România.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/login">Conectează-te</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/register">Creează Cont</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-xs uppercase tracking-wider text-ink-faint"
        >
          <Link
            href="https://discord.gg/faded"
            className="inline-flex items-center gap-1.5 hover:text-signal transition-colors"
          >
            <MessageCircle size={14} /> Discord
          </Link>
          <Link
            href="/magazin"
            className="inline-flex items-center gap-1.5 hover:text-signal transition-colors"
          >
            <ShoppingBag size={14} /> Magazin
          </Link>
          <Link
            href="/forum"
            className="inline-flex items-center gap-1.5 hover:text-signal transition-colors"
          >
            <BookOpenText size={14} /> Forum
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
