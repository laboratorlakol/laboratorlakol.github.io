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
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  colorblindFriendly: false,
  dyslexiaFriendly: false,
  largeText: false,
};

const STORAGE_KEY = "faded-a11y-settings";

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  update: (patch: Partial<AccessibilitySettings>) => void;
  reset: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function applyToDocument(settings: AccessibilitySettings) {
  const root = document.documentElement;
  root.toggleAttribute("data-a11y-contrast", settings.highContrast);
  root.toggleAttribute("data-a11y-colorblind", settings.colorblindFriendly);
  root.toggleAttribute("data-a11y-dyslexia", settings.dyslexiaFriendly);
  root.toggleAttribute("data-a11y-large-text", settings.largeText);
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
