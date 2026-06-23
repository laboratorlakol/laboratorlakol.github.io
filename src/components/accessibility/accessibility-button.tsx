"use client";

import { useState } from "react";
import { Accessibility, X, RotateCcw } from "lucide-react";
import { useAccessibility } from "@/lib/accessibility/accessibility-context";

const OPTIONS = [
  {
    key: "highContrast" as const,
    label: "Contrast mare",
    description: "Fundal complet negru, text mai alb, margini mai vizibile.",
  },
  {
    key: "colorblindFriendly" as const,
    label: "Mod daltonism",
    description: "Înlocuiește paleta verde/roșu cu albastru/galben, mai ușor de distins.",
  },
  {
    key: "dyslexiaFriendly" as const,
    label: "Prietenos cu dislexia",
    description: "Font simplu, spațiere mai mare între litere și rânduri.",
  },
  {
    key: "largeText" as const,
    label: "Text mai mare",
    description: "Crește dimensiunea textului pe tot site-ul.",
  },
];

export function AccessibilityButton() {
  const [open, setOpen] = useState(false);
  const { settings, update, reset } = useAccessibility();

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Meniu de accesibilitate"
        className="fixed bottom-5 left-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-signal text-void shadow-[0_0_24px_-4px_var(--glow)] hover:bg-signal-bright transition-colors"
      >
        <Accessibility size={22} />
      </button>

      {open && (
        <div className="fixed bottom-20 left-5 z-[60] w-80 panel border-glow rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="font-mono text-xs uppercase tracking-wider text-signal">
              Accesibilitate
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Închide"
              className="text-ink-faint hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-4 py-3 space-y-3">
            {OPTIONS.map((opt) => (
              <label
                key={opt.key}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={settings[opt.key]}
                  onChange={(e) => update({ [opt.key]: e.target.checked })}
                  className="mt-0.5 accent-[var(--signal)]"
                />
                <span>
                  <span className="text-sm text-ink group-hover:text-signal transition-colors">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-ink-faint mt-0.5">
                    {opt.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-t border-line text-xs text-ink-faint hover:text-signal transition-colors font-mono uppercase tracking-wider"
          >
            <RotateCcw size={13} />
            Resetează
          </button>
        </div>
      )}
    </>
  );
}
