// Screen-top navigation bar. Port of iOS Components/TopBar.swift. Layout
// uses a 3-column CSS grid so the centered title doesn't drift when only
// one side has a control (the iOS code uses ZStack for the same reason —
// HStack+Spacers visually shifts).

import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function TopBar({
  title,
  onBack,
  right,
  horizontalInset = 20,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  horizontalInset?: number;
}) {
  return (
    <div
      className="grid grid-cols-[44px_1fr_auto] items-center gap-3 py-2.5 min-h-[44px]"
      style={{ paddingLeft: horizontalInset, paddingRight: horizontalInset }}
    >
      {/* Left slot — back button or empty spacer */}
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/18 text-accent ring-1 ring-accent/30 transition-transform active:scale-90 hover:bg-accent/24"
        >
          <Icon name="arrow-left" size={17} strokeWidth={2.5} />
        </button>
      ) : (
        <span aria-hidden />
      )}

      {/* Center title — single line, ellipsizes when long */}
      <span className="text-center text-[15px] font-semibold tracking-tight text-fg truncate">
        {title}
      </span>

      {/* Right slot — flexible */}
      <span className="inline-flex min-w-[44px] min-h-[44px] items-center justify-end">
        {right}
      </span>
    </div>
  );
}
