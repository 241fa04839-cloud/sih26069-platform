"use client";

import { useEffect, useState } from "react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (!saved) {
      setVisible(true);
    } else {
      const parsed = JSON.parse(saved);
      setPreferences(parsed);
    }
  }, []);

  const acceptAll = () => {
    const all: CookiePreferences = { necessary: true, analytics: true, marketing: true };
    setPreferences(all);
    localStorage.setItem("cookie_consent", JSON.stringify(all));
    setVisible(false);
    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible("cookie_consent", { props: { accepted: true } });
    }
  };

  const acceptNecessary = () => {
    const necessary: CookiePreferences = { necessary: true, analytics: false, marketing: false };
    setPreferences(necessary);
    localStorage.setItem("cookie_consent", JSON.stringify(necessary));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-tactical-border bg-tactical-panel/98 p-4 backdrop-blur-sm"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h2 className="text-sm font-bold text-white">Cookie Consent</h2>
            <p className="mt-1 text-xs text-gray-400">
              We use cookies to ensure the best experience on our platform.
              By DPDP Act 2023 and GDPR requirements, we require your consent.
              Necessary cookies are always active for platform operation.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={acceptNecessary}
              className="rounded border border-tactical-border px-4 py-2 text-xs font-mono text-gray-300 transition-colors hover:border-tactical-amber hover:text-tactical-amber"
            >
              Necessary Only
            </button>
            <button
              onClick={acceptAll}
              className="rounded border border-tactical-cyan bg-tactical-cyan/10 px-4 py-2 text-xs font-mono text-tactical-cyan transition-colors hover:bg-tactical-cyan/20"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
