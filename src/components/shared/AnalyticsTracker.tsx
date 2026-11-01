"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ── Helpers ────────────────────────────────────────────────────────────────
function extractHost(referrer: string): string {
  if (!referrer) return "";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    // Same-site referrer? treat as internal
    if (typeof window !== "undefined" && host === window.location.hostname) return "";
    return host;
  } catch {
    return "";
  }
}

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return "";
  try {
    let vid = localStorage.getItem("hf_vid");
    if (!vid) {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        vid = crypto.randomUUID();
      } else {
        vid = "vid_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      }
      localStorage.setItem("hf_vid", vid);
    }
    return vid;
  } catch {
    return "";
  }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    // Opt-out: admin has toggled "tracking off for this device"
    if (typeof localStorage !== "undefined" && localStorage.getItem("hf_no_track") === "1") return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (pathname === lastPathRef.current) return;
      lastPathRef.current = pathname;

      // ── Referrer / session logic ───────────────────────────────────────
      // On the FIRST page of a session: use real document.referrer.
      // On subsequent pages: the "referrer" is the previous in-site page
      // (Internal), which is NOT counted as an external traffic source.
      let referrer = "";
      let referrerHost = "";

      const sessionStarted = sessionStorage.getItem("hf_session_started");

      if (!sessionStarted) {
        // First page of session — real external referrer
        referrer = document.referrer || "";
        referrerHost = extractHost(referrer);
        sessionStorage.setItem("hf_session_started", "1");
        sessionStorage.setItem("hf_prev_path", pathname);
      } else {
        // Subsequent pages — mark as internal
        const prevPath = sessionStorage.getItem("hf_prev_path") || "";
        referrer = prevPath ? `${window.location.origin}${prevPath}` : "";
        referrerHost = ""; // internal — no external host
        sessionStorage.setItem("hf_prev_path", pathname);
      }

      // ── UTM source & Persistent Visitor ID ────────────────────────────
      const utmSource = new URLSearchParams(window.location.search).get("utm_source") || "";
      const visitorId = getOrCreateVisitorId();

      // ── Send to API ───────────────────────────────────────────────────
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname, referrer, referrerHost, utmSource, visitorId }),
      }).catch(() => {});
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname]);

  return null;
}
