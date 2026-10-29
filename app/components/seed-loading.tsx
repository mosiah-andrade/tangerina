import { AppBrand } from "@/components/app-brand";

const seeds = [
  { angle: 0, color: "green" },
  { angle: 45, color: "gold" },
  { angle: 90, color: "cream" },
  { angle: 135, color: "green" },
  { angle: 180, color: "gold" },
  { angle: 225, color: "cream" },
  { angle: 270, color: "green" },
  { angle: 315, color: "gold" },
];

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
      <div className="seed-loader" aria-hidden="true">
        {seeds.map((seed, index) => (
          <span
            className={`seed-loader__seed seed-loader__seed--${seed.color}`}
            key={seed.angle}
            style={{
              transform: `rotate(${seed.angle}deg) translateY(-34px)`,
              animationDelay: `${index * -0.12}s`,
            }}
          />
        ))}
        <span className="seed-loader__core" />
      </div>
      <AppBrand linked={false} />
      <p className="seed-loading__label">{label}<span className="seed-loading__dots" aria-hidden="true">...</span></p>
    </div>
  );
}
