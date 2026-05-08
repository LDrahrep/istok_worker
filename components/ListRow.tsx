// Generic list row — port of iOS Components/ListRow.swift. Designed to live
// inside a parent <Card>. Renders an optional 34px square icon badge, a
// title + optional detail, an optional unread dot, and a trailing chevron.

import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function ListRow({
  icon,
  title,
  detail,
  showChevron = true,
  unread = false,
  last = false,
  onClick,
}: {
  icon?: ReactNode;
  title: string;
  detail?: string;
  showChevron?: boolean;
  unread?: boolean;
  last?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 py-2.5 min-h-[52px] text-left transition-opacity active:opacity-80 ${
        last ? "" : "border-b border-border/100"
      }`}
    >
      {icon && (
        <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-white/[0.06] text-fg shrink-0">
          {icon}
        </span>
      )}

      <span className="flex flex-1 flex-col items-start gap-0.5 min-w-0">
        <span className="text-[15px] font-medium text-fg truncate w-full">
          {title}
        </span>
        {detail && (
          <span className="text-[13px] text-muted truncate w-full">
            {detail}
          </span>
        )}
      </span>

      {unread && (
        <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-accent shrink-0" />
      )}

      {showChevron && (
        <span className="text-subtle shrink-0">
          <Icon name="chevron-right" size={14} strokeWidth={2.5} />
        </span>
      )}
    </Tag>
  );
}
