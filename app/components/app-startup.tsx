"use client";

import { useEffect, useState } from "react";
import { AppBrand } from "@/components/app-brand";

const petals = Array.from({ length: 8 }, (_, index) => index);
const leaves = [0, 120, 240];
const stamens = Array.from({ length: 12 }, (_, index) => index);

export function AppStartup({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setShowIntro(false), reducedMotion ? 0 : 3200);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      {children}
      {showIntro && (
        <div className="app-startup" role="status" aria-label="Tangerina Financeiro está iniciando">
          <div className="startup-scene">
            <svg className="startup-flower" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <radialGradient id="startup-petal" cx="30%" cy="20%" r="85%">
                  <stop offset="0%" stopColor="#FFFEF8" />
                  <stop offset="72%" stopColor="#F3F0E6" />
                  <stop offset="100%" stopColor="#D8C99E" />
                </radialGradient>
                <linearGradient id="startup-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E5C05B" />
                  <stop offset="100%" stopColor="#9A771C" />
                </linearGradient>
              </defs>
              {leaves.map((angle) => (
                <g key={angle} transform={`rotate(${angle} 100 132)`}>
                  <path className="startup-flower__leaf"
                    d="M100 132 C67 128 52 100 61 78 C84 84 101 105 100 132Z" fill="#0B3C2A" />
                </g>
              ))}
              <g className="startup-bud">
                <path d="M100 134 C79 113 81 83 100 58 C119 83 121 113 100 134Z" fill="#0B3C2A" />
                <path d="M100 127 C86 109 91 86 100 73 C109 86 114 109 100 127Z" fill="#C59B27" />
              </g>
              {petals.map((index) => (
                <g key={index} transform={`rotate(${index * 45} 100 105)`}>
                  <g className="startup-flower__petal"
                    style={{ "--delay": `${0.45 + index * 0.11}s` } as React.CSSProperties}>
                    <path d="M100 108 C78 91 76 62 100 31 C124 62 122 91 100 108Z"
                      fill="url(#startup-petal)" stroke="#D8C99E" strokeWidth=".8" />
                    <path d="M100 101 L100 42" stroke="#D6C69B" strokeWidth=".8" opacity=".8" />
                  </g>
                </g>
              ))}
              {stamens.map((index) => (
                <g key={index} transform={`rotate(${index * 30} 100 105)`}>
                  <g className="startup-flower__stamen"
                    style={{ "--delay": `${1.5 + index * 0.035}s` } as React.CSSProperties}>
                    <path d="M100 106 L100 82" stroke="#C59B27" strokeWidth="1.7" strokeLinecap="round" />
                    <circle cx="100" cy="80" r="2.6" fill="url(#startup-gold)" />
                  </g>
                </g>
              ))}
              <circle cx="100" cy="105" r="7" fill="#C59B27" />
              <circle cx="100" cy="105" r="2.6" fill="#F9F8F3" />
            </svg>
            <div className="startup-brand">
              <AppBrand linked={false} />
              <p>PLANEJANDO SUAS FINANÇAS</p>
              <span className="startup-brand__line" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
