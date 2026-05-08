// Status chip. Port of iOS Components/StatusPill.swift. Background colour
// is driven by the WorkerStatus enum.
//
// Module 3 (i18n) replaces the inline label map with `L(localizationKey)`.

import type { WorkerStatus } from "@/lib/types";

const BG: Record<WorkerStatus, string> = {
  active: "bg-success",
  oncall: "bg-warning",
  inactive: "bg-subtle",
  pending: "bg-accent",
};

const LABEL_FALLBACK: Record<WorkerStatus, string> = {
  active: "Active",
  oncall: "On call",
  inactive: "Inactive",
  pending: "Pending",
};

export function StatusPill({
  status,
  label,
}: {
  status: WorkerStatus;
  /** Optional override; defaults to English fallback until Module 3 lands. */
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-tight text-white ${BG[status]}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
      {label ?? LABEL_FALLBACK[status]}
    </span>
  );
}
