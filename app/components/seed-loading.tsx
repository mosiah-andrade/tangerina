type SeedLoadingProps = {
  label?: string;
  fullScreen?: boolean;
};

const seeds = Array.from({ length: 8 }, (_, index) => ({
  angle: index * 45,
  color: ["green", "gold", "cream", "green", "gold", "cream", "green", "gold"][index],
}));

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
        <span className="seed-loader__soil" />
        {seeds.map((seed, index) => (
          <span
            className={`seed-loader__seed seed-loader__seed--${seed.color}`}
            key={seed.angle}
            style={{
              transform: `rotate(${seed.angle}deg) translateY(-32px)`,
              animationDelay: `${index * -0.14}s`,
            }}
          />
        ))}
        <span className="seed-loader__core" />
      </div>
      <p className="seed-loading__label">{label}<span className="seed-loading__dots" aria-hidden="true">...</span></p>
    </div>
  );
}
