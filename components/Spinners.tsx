// Loading indicators — ports of iOS Components/{LoadingSpinner,PulsingDots}.swift.
//
// Both honor `prefers-reduced-motion`. iOS uses a 0.9s linear rotation;
// matched here via Tailwind animate-[spin_0.9s_linear_infinite] equivalent.
// PulsingDots: three dots, scale 1→1.4 + opacity 0.25→1, 0.7s easeInOut,
// staggered 0.2s.

export function LoadingSpinner({ size = 36 }: { size?: number }) {
  const stroke = 3;
  const r = size / 2 - stroke / 2;
  const c = 2 * Math.PI * r;
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className="relative inline-flex items-center justify-center motion-reduce:hidden"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-[spin_0.9s_linear_infinite]"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * 0.25} ${c}`}
        />
      </svg>
    </span>
  );
}

export function PulsingDots({
  dotSize = 8,
  spacing = 10,
}: {
  dotSize?: number;
  spacing?: number;
}) {
  // Three dots; CSS keyframes defined inline. Reduced-motion users see static.
  return (
    <span
      aria-hidden
      className="inline-flex items-center motion-reduce:opacity-60"
      style={{ gap: spacing }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={
            {
              width: dotSize,
              height: dotSize,
              animationDelay: `${i * 0.2}s`,
            } as React.CSSProperties
          }
          className="block rounded-full bg-subtle motion-safe:animate-[istok-pulse_1.4s_ease-in-out_infinite]"
        />
      ))}
      <style>{`
        @keyframes istok-pulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50%      { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </span>
  );
}
