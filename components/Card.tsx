// Glass surface block — port of iOS Components/Card.swift. Wraps arbitrary
// content in an 18px-radius rounded panel with an inset top highlight + soft
// drop shadow. Used as the base for Dashboard widgets, hotel/project info
// blocks, list-row containers.

import type { ReactNode } from "react";

export function Card({
  pad = 18,
  onClick,
  className = "",
  children,
}: {
  pad?: number;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{ padding: pad }}
      className={`relative w-full text-left rounded-[18px] bg-white/[0.055] border border-white/10 backdrop-blur shadow-[0_10px_15px_rgba(0,0,0,0.28)] overflow-hidden transition-transform ${
        onClick ? "active:scale-[0.985]" : ""
      } ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/10 to-transparent"
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
