import { AppBrand } from "@/components/app-brand";

const petals = Array.from({ length: 8 }, (_, index) => index);
const leaves = [0, 120, 240];

type SeedLoadingProps = {
  label?: string;
  fullScreen?: boolean;
};

export function SeedLoading({
  label = "Preparando suas finanças",
  fullScreen = false,
}: SeedLoadingProps) {
  return (
    <div
      className={`seed-loading${fullScreen ? " seed-loading--screen" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg className="citrus-bloom" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id="petalIvory" cx="35%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#FFFDF3" />
            <stop offset="72%" stopColor="#F3F0E6" />
            <stop offset="100%" stopColor="#D9CDAA" />
          </radialGradient>
          <linearGradient id="petalGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E5C05B" />
            <stop offset="100%" stopColor="#9A771C" />
          </linearGradient>
        </defs>
        {leaves.map((angle) => (
          <path
            key={angle}
            className="citrus-bloom__leaf"
            style={{ "--petal-angle": `${angle}deg` } as React.CSSProperties}
            d="M100 116 C72 110 58 88 62 66 C85 73 101 91 100 116Z"
            fill="#0B3C2A"
          />
        ))}
        {petals.map((angle) => (
          <g
            key={angle}
            className="citrus-bloom__petal"
            style={{ "--petal-angle": `${angle * 45}deg`, "--petal-delay": `${angle * 0.09}s` } as React.CSSProperties}
          >
            <path d="M100 105 C78 89 76 61 100 30 C124 61 122 89 100 105Z" fill="url(#petalIvory)" stroke="#D8C99E" strokeWidth=".8" />
            <path d="M100 99 C99 78 100 57 100 38" fill="none" stroke="#D6C69B" strokeWidth=".8" opacity=".75" />
          </g>
        ))}
        {Array.from({ length: 12 }, (_, index) => (
          <g
            key={index}
            className="citrus-bloom__stamen"
            style={{ "--stamen-angle": `${index * 30}deg`, "--stamen-delay": `${0.8 + index * 0.045}s` } as React.CSSProperties}
          >
            <path d="M100 104 L100 79" stroke="#C59B27" strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="100" cy="77" r="2.5" fill="url(#petalGold)" />
          </g>
        ))}
        <circle cx="100" cy="103" r="8" fill="#C59B27" />
        <circle cx="100" cy="103" r="3" fill="#F9F8F3" />
      </svg>
      <AppBrand linked={false} />
      <p className="seed-loading__label">{label}<span className="seed-loading__dots" aria-hidden="true">...</span></p>
    </div>
  );
}
