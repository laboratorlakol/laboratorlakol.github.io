"use client";
import { useEffect, useId, useRef, useState, useImperativeHandle, forwardRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (c: string | HTMLElement, o: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

export interface TurnstileRef {
  reset: () => void;
}

interface Props {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileRef, Props>(function TurnstileWidget(
  { onVerify, onExpire },
  ref
) {
  const elementId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [siteKey, setSiteKey] = useState<string | null | undefined>(undefined);
  const [status, setStatus] = useState<"loading" | "ready" | "timeout" | "error">("loading");

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
      onExpire?.();
    },
  }));

  useEffect(() => {
    const t = setTimeout(() => {
      fetch("/api/turnstile-config")
        .then(r => r.json())
        .then(d => setSiteKey(d.siteKey ?? null))
        .catch(() => setSiteKey(null));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!siteKey) return;
    function render() {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          callback: (token: string) => { setStatus("ready"); onVerify(token); },
          "expired-callback": onExpire,
          "error-callback": () => setStatus("error"),
        });
        setStatus("ready");
      } catch { setStatus("error"); }
    }
    if (window.turnstile) {
      render();
    } else {
      const interval = setInterval(() => { if (window.turnstile) { render(); clearInterval(interval); } }, 200);
      const timeout = setTimeout(() => setStatus("timeout"), 6000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (siteKey === undefined || !siteKey) return null;

  return (
    <div>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div ref={containerRef} id={`turnstile-${elementId}`} className="flex justify-center" />
      {status === "loading" && (
        <p className="text-center text-[11px] text-ink-faint font-mono mt-1">Se încarcă verificarea...</p>
      )}
      {status === "timeout" && (
        <p className="text-center text-[11px] text-red-400 font-mono mt-1">Verificarea nu s-a încărcat. Reîncarcă pagina.</p>
      )}
    </div>
  );
});
