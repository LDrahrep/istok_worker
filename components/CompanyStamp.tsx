// Dashed-border legal-looking block on Welcome. Port of iOS
// Components/CompanyStamp.swift. Three lines of mono caps text. Caller
// passes the lines (Module 3 wires up L() keys: company_stamp_line1..3).

export function CompanyStamp({
  lines,
}: {
  lines: [string, string, string];
}) {
  return (
    <div className="rounded-[14px] border border-dashed border-border p-3.5 text-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted space-y-1">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
