"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface AccessibilitySettings {
  highContrast: boolean; colorblindFriendly: boolean; dyslexiaFriendly: boolean; largeText: boolean;
  highlightLinks: boolean; textSpacing: boolean; reducedMotion: boolean; hideImages: boolean;
  textAlignLeft: boolean; reducedSaturation: boolean; bigCursor: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast:false, colorblindFriendly:false, dyslexiaFriendly:false, largeText:false,
  highlightLinks:false, textSpacing:false, reducedMotion:false, hideImages:false,
  textAlignLeft:false, reducedSaturation:false, bigCursor:false,
};

const ATTR_MAP: Record<keyof AccessibilitySettings, string> = {
  highContrast:"data-a11y-contrast", colorblindFriendly:"data-a11y-colorblind", dyslexiaFriendly:"data-a11y-dyslexia",
  largeText:"data-a11y-large-text", highlightLinks:"data-a11y-highlight-links", textSpacing:"data-a11y-text-spacing",
  reducedMotion:"data-a11y-reduced-motion", hideImages:"data-a11y-hide-images", textAlignLeft:"data-a11y-text-align-left",
  reducedSaturation:"data-a11y-reduced-saturation", bigCursor:"data-a11y-big-cursor",
};

interface Ctx { settings: AccessibilitySettings; update: (p: Partial<AccessibilitySettings>) => void; reset: () => void; }
const AccessibilityContext = createContext<Ctx | null>(null);

function apply(s: AccessibilitySettings) {
  const r = document.documentElement;
  for (const k of Object.keys(ATTR_MAP) as (keyof AccessibilitySettings)[]) r.toggleAttribute(ATTR_MAP[k], s[k]);
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try { const s = localStorage.getItem("faded-a11y"); if (s) { const p = { ...DEFAULT_SETTINGS, ...JSON.parse(s) }; setSettings(p); apply(p); } } catch {}
      finally { setHydrated(true); }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function update(patch: Partial<AccessibilitySettings>) {
    setSettings(prev => { const next = { ...prev, ...patch }; apply(next); try { localStorage.setItem("faded-a11y", JSON.stringify(next)); } catch {} return next; });
  }
  function reset() { update(DEFAULT_SETTINGS); }
  if (!hydrated) return <>{children}</>;
  return <AccessibilityContext.Provider value={{ settings, update, reset }}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) return { settings: DEFAULT_SETTINGS, update: () => {}, reset: () => {} };
  return ctx;
}
