// Compact info tile — ports iOS Components/InfoTile.swift. Used in the
// Hotel screen as a 3-column grid (Room / Check-in / Check-out). Mono
// uppercase label on top, serif value below, glass background.

export function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.05] border border-border p-3 backdrop-blur">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        {label}
      </div>
      <div className="font-serif text-xl tracking-tight text-fg mt-1">
        {value}
      </div>
    </div>
  );
}
