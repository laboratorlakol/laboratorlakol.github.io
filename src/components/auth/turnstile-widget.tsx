"use client";
import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";
declare global {
  interface Window {
    turnstile?: {
      render: (c: string | HTMLElement, o: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void; "error-callback"?: (code?: string) => void; theme?: "light"|"dark"|"auto" }) => string;
      reset: (id?: string) => void;
    };
  }
}
export function TurnstileWidget({ onVerify, onExpire }: { onVerify: (token: string) => void; onExpire?: () => void }) {
  const elementId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [siteKey, setSiteKey] = useState<string | null | undefined>(undefined);
  const [status, setStatus] = useState<"loading"|"ready"|"timeout"|"error">("loading");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => { fetch("/api/turnstile-config").then(r=>r.json()).then(d=>setSiteKey(d.siteKey??null)).catch(()=>setSiteKey(null)); }, 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!siteKey) return;
    function render() {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, { sitekey: siteKey!, theme: "dark", callback: (token) => { setStatus("ready"); onVerify(token); }, "expired-callback": onExpire, "error-callback": (code) => { setStatus("error"); setErrorDetail(code??null); } });
        setStatus("ready");
      } catch(e) { setStatus("error"); setErrorDetail(e instanceof Error ? e.message : String(e)); }
    }
    if (window.turnstile) { render(); } else {
      const interval = setInterval(() => { if (window.turnstile) { render(); clearInterval(interval); } }, 200);
      const timeout = setTimeout(() => { if (!window.turnstile) setStatus("timeout"); }, 6000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);
  if (siteKey === undefined) return null;
  if (!siteKey) return null;
  return (
    <div>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" onError={() => setStatus("timeout")} />
      <div ref={containerRef} id={`turnstile-${elementId}`} className="flex justify-center" />
      {status === "loading" && <p className="text-center text-[11px] text-ink-faint font-mono mt-1">Se încarcă verificarea anti-bot...</p>}
      {status === "timeout" && <p className="text-center text-[11px] text-red-400 font-mono mt-1">Scriptul Cloudflare nu s-a încărcat.</p>}
      {status === "error" && <p className="text-center text-[11px] text-red-400 font-mono mt-1">Eroare widget Turnstile: {errorDetail}</p>}
    </div>
  );
}
