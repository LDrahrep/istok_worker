// Small metric block — port of iOS Components/Metric.swift. Serif value
// + optional unit + uppercase mono caption underneath. `dark` inverts
// colours for use on the gold hero card.

export function Metric({
  value,
  unit,
  label,
  dark = false,
}: {
  value: string;
  unit?: string;
  label: string;
  dark?: boolean;
}) {
  const primary = dark ? "text-accent-fg" : "text-fg";
  const secondary = dark ? "text-accent-fg/60" : "text-muted";
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex items-baseline gap-0.5 ${primary}`}>
        <span className="font-serif text-2xl tracking-tight">{value}</span>
        {unit && (
          <span className={`text-[13px] ${primary}/60`}>{unit}</span>
        )}
      </div>
      <span
        className={`font-mono text-[10px] uppercase tracking-wider ${secondary}`}
      >
        {label}
      </span>
    </div>
  );
}
