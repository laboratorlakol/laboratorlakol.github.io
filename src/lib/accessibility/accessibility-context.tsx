"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AccessibilitySettings {
  highContrast: boolean;
  colorblindFriendly: boolean;
  dyslexiaFriendly: boolean;
  largeText: boolean;
  highlightLinks: boolean;
  textSpacing: boolean;
  reducedMotion: boolean;
  hideImages: boolean;
  textAlignLeft: boolean;
  reducedSaturation: boolean;
  bigCursor: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  colorblindFriendly: false,
  dyslexiaFriendly: false,
  largeText: false,
  highlightLinks: false,
  textSpacing: false,
  reducedMotion: false,
  hideImages: false,
  textAlignLeft: false,
  reducedSaturation: false,
  bigCursor: false,
};

const STORAGE_KEY = "faded-a11y-settings";

// Maps each setting to the data-attribute toggled on <html>. Kept as a
// table (not a hand-written list of toggleAttribute calls) so adding a new
// toggle later is a one-line change here + one CSS block in globals.css.
const ATTRIBUTE_MAP: Record<keyof AccessibilitySettings, string> = {
  highContrast: "data-a11y-contrast",
  colorblindFriendly: "data-a11y-colorblind",
  dyslexiaFriendly: "data-a11y-dyslexia",
  largeText: "data-a11y-large-text",
  highlightLinks: "data-a11y-highlight-links",
  textSpacing: "data-a11y-text-spacing",
  reducedMotion: "data-a11y-reduced-motion",
  hideImages: "data-a11y-hide-images",
  textAlignLeft: "data-a11y-text-align-left",
  reducedSaturation: "data-a11y-reduced-saturation",
  bigCursor: "data-a11y-big-cursor",
};

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  update: (patch: Partial<AccessibilitySettings>) => void;
  reset: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function applyToDocument(settings: AccessibilitySettings) {
  const root = document.documentElement;
  for (const key of Object.keys(ATTRIBUTE_MAP) as (keyof AccessibilitySettings)[]) {
    root.toggleAttribute(ATTRIBUTE_MAP[key], settings[key]);
  }
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
          applyToDocument({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch {
        // ignore — fall back to defaults
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function update(patch: Partial<AccessibilitySettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      applyToDocument(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage might be unavailable (private mode) — setting still
        // applies for this session via the DOM attribute.
      }
      return next;
    });
  }

  function reset() {
    update(DEFAULT_SETTINGS);
  }

  if (!hydrated) return <>{children}</>;

  return (
    <AccessibilityContext.Provider value={{ settings, update, reset }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    // Provider not hydrated yet (first paint) — return safe no-op defaults
    // rather than throwing, since this hook may render before hydration.
    return {
      settings: DEFAULT_SETTINGS,
      update: () => {},
      reset: () => {},
    };
  }
  return ctx;
}
