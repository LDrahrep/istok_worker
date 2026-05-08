// Mono uppercase mini-header — "TODAY", "SHORTCUTS". Port of iOS
// Components/SectionLabel.swift. Caller controls surrounding spacing.

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
      {children}
    </span>
  );
}
