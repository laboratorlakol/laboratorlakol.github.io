"use client";
import { useState } from "react";
import { Accessibility, X, RotateCcw, Contrast, Glasses, BookOpen, Type, Link2, MoveHorizontal, PauseCircle, ImageOff, AlignLeft, Droplet, MousePointer2 } from "lucide-react";
import { useAccessibility, type AccessibilitySettings } from "@/lib/accessibility/accessibility-context";
import { cn } from "@/lib/utils";
const OPTIONS: { key: keyof AccessibilitySettings; label: string; icon: typeof Contrast }[] = [
  { key: "highContrast", label: "Contrast Mare", icon: Contrast },
  { key: "colorblindFriendly", label: "Daltonism", icon: Glasses },
  { key: "dyslexiaFriendly", label: "Dislexie", icon: BookOpen },
  { key: "largeText", label: "Text Mare", icon: Type },
  { key: "highlightLinks", label: "Evidențiază Linkuri", icon: Link2 },
  { key: "textSpacing", label: "Spațiere Text", icon: MoveHorizontal },
  { key: "reducedMotion", label: "Reduce Animații", icon: PauseCircle },
  { key: "hideImages", label: "Ascunde Imagini", icon: ImageOff },
  { key: "textAlignLeft", label: "Aliniere Stânga", icon: AlignLeft },
  { key: "reducedSaturation", label: "Saturație Redusă", icon: Droplet },
  { key: "bigCursor", label: "Cursor Mare", icon: MousePointer2 },
];
export function AccessibilityButton() {
  const [open, setOpen] = useState(false);
  const { settings, update, reset } = useAccessibility();
  return (
    <>
      <button onClick={() => setOpen(v=>!v)} aria-label="Meniu de accesibilitate" className="fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-signal text-void shadow-[0_0_24px_-4px_var(--glow)] hover:bg-signal-bright transition-colors">
        <Accessibility size={22} />
      </button>
      {open && (
        <div className="fixed bottom-20 right-5 z-[60] w-[330px] max-h-[70vh] flex flex-col panel border-glow rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal"><Accessibility size={15} />Accesibilitate</span>
            <button onClick={() => setOpen(false)} aria-label="Închide" className="text-ink-faint hover:text-ink"><X size={16} /></button>
          </div>
          <div className="px-3 py-3 overflow-y-auto grid grid-cols-3 gap-2">
            {OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = settings[opt.key];
              return (
                <button key={opt.key} onClick={() => update({ [opt.key]: !active })} aria-pressed={active} className={cn("flex flex-col items-center justify-center gap-2 rounded-md border px-2 py-3.5 text-center transition-colors", active ? "border-signal bg-signal/10 text-signal" : "border-line text-ink-muted hover:border-line-strong hover:text-ink")}>
                  <Icon size={20} />
                  <span className="text-[10px] leading-tight font-mono uppercase tracking-wide">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <button onClick={reset} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-t border-line bg-panel-raised text-xs text-ink-faint hover:text-signal transition-colors font-mono uppercase tracking-wider shrink-0"><RotateCcw size={13} />Resetează tot</button>
        </div>
      )}
    </>
  );
}
