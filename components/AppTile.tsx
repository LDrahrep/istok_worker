// Partner-app launcher tile — port of iOS Components/Apps/AppTile.swift.
// Tapping opens the partner URL in a new browser tab. Tints come from the
// AppTints token group in globals.css.

import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function AppTile({
  name,
  description,
  icon,
  /** CSS color, typically `var(--color-tint-carbot)` etc. */
  tint,
  href,
}: {
  name: string;
  description: string;
  icon: ReactNode;
  tint: string;
  href?: string;
}) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className="block rounded-[18px] bg-surface border border-border p-3.5 min-h-[100px] transition-transform active:scale-[0.985]"
    >
      <div className="flex items-start justify-between">
        <span
          className="grid h-9 w-9 place-items-center rounded-[11px]"
          style={{ background: `${tint}2D`, color: tint }}
        >
          {icon}
        </span>
        <span className="text-subtle pt-1">
          <Icon name="external" size={14} strokeWidth={2.5} />
        </span>
      </div>
      <div className="mt-3">
        <div className="text-sm font-semibold text-fg">{name}</div>
        <div className="text-[11px] text-muted line-clamp-2">{description}</div>
      </div>
    </Tag>
  );
}
