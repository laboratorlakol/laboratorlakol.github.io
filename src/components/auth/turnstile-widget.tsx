"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (errorCode?: string) => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function TurnstileWidget({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const elementId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "timeout" | "error">("loading");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;

    function render() {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY!,
          theme: "dark",
          callback: (token) => {
            setStatus("ready");
            onVerify(token);
          },
          "expired-callback": onExpire,
          "error-callback": (code) => {
            console.error("[Turnstile] error-callback:", code);
            setStatus("error");
            setErrorDetail(code ?? "necunoscută");
          },
        });
        setStatus("ready");
      } catch (err) {
        console.error("[Turnstile] render() threw:", err);
        setStatus("error");
        setErrorDetail(err instanceof Error ? err.message : String(err));
      }
    }

    if (window.turnstile) {
      render();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          render();
          clearInterval(interval);
        }
      }, 200);

      // If the script itself never loads (blocked, network, CSP) within
      // 6s, say so explicitly instead of leaving a silent empty gap.
      const timeout = setTimeout(() => {
        if (!window.turnstile) {
          console.error("[Turnstile] api.js never loaded window.turnstile after 6s");
          setStatus("timeout");
        }
      }, 6000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!SITE_KEY) {
    console.warn("[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set in this build — widget disabled.");
    return null;
  }

  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onError={() => {
          console.error("[Turnstile] <Script> failed to load api.js (network/CSP/ad-blocker?)");
          setStatus("timeout");
        }}
      />
      <div ref={containerRef} id={`turnstile-${elementId}`} className="flex justify-center" />

      {status === "loading" && (
        <p className="text-center text-[11px] text-ink-faint font-mono mt-1">
          Se încarcă verificarea anti-bot...
        </p>
      )}
      {status === "timeout" && (
        <p className="text-center text-[11px] text-red-400 font-mono mt-1">
          Scriptul Cloudflare nu s-a încărcat (blocat de rețea/extensie sau Cloudflare nu răspunde).
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-[11px] text-red-400 font-mono mt-1">
          Eroare widget Turnstile: {errorDetail}
        </p>
      )}
    </div>
  );
}
