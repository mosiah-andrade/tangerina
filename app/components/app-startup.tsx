"use client";

import { useEffect, useState } from "react";
import { SeedLoading } from "@/components/seed-loading";

export function AppStartup({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setShowIntro(false), reducedMotion ? 450 : 1900);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      {children}
      {showIntro && (
        <div className="app-startup" aria-label="Inicializando Tangerina Financeiro">
          <SeedLoading fullScreen label="Cultivando sua organização financeira" />
        </div>
      )}
    </>
  );
}
