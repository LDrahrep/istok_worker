// Three CTAs ported from iOS Components/{Primary,Secondary,Ghost}Button.swift.
// PrimaryButton — gold fill with top inset highlight + soft accent shadow.
// SecondaryButton — translucent glass with bordered top/bottom edge highlights.
// GhostButton — same shape as Secondary but the lightest fill.
//
// All three share the `ButtonSize` ramp (sm 40 / md 52 / lg 58) and accept an
// optional `icon` ReactNode (typically <Icon name="..." />).

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonSize = "sm" | "md" | "lg";

const HEIGHT: Record<ButtonSize, string> = {
  sm: "h-10",
  md: "h-[52px]",
  lg: "h-[58px]",
};

const TEXT: Record<ButtonSize, string> = {
  sm: "text-[15px]",
  md: "text-base",
  lg: "text-[17px]",
};

type CommonProps = {
  icon?: ReactNode;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

function shellClasses(
  size: ButtonSize,
  fullWidth: boolean,
  extra: string,
): string {
  const width = fullWidth ? "w-full" : "";
  return [
    "relative inline-flex items-center justify-center gap-2 px-5 font-semibold tracking-tight",
    "transition-all duration-150 active:scale-[0.965] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
    "disabled:opacity-45 disabled:cursor-not-allowed",
    HEIGHT[size],
    TEXT[size],
    width,
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function PrimaryButton({
  icon,
  size = "md",
  fullWidth = true,
  children,
  ...rest
}: CommonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={shellClasses(
        size,
        fullWidth,
        "bg-accent text-accent-fg rounded-[18px] shadow-[0_8px_12px_-2px_rgba(233,201,120,0.25)] overflow-hidden",
      )}
    >
      {/* Top inset highlight gradient — mirrors iOS PrimaryButton overlay. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-b from-white/35 to-transparent to-55%"
      />
      <span className="relative inline-flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </span>
    </button>
  );
}

export function SecondaryButton({
  icon,
  size = "md",
  fullWidth = true,
  children,
  ...rest
}: CommonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={shellClasses(
        size,
        fullWidth,
        "bg-white/[0.10] text-fg rounded-[18px] backdrop-blur shadow-[0_6px_10px_rgba(0,0,0,0.25)] border border-white/18 overflow-hidden",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-b from-white/14 to-transparent to-50%"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-white/22"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-black/20"
      />
      <span className="relative inline-flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </span>
    </button>
  );
}

export function GhostButton({
  icon,
  size = "md",
  fullWidth = true,
  children,
  ...rest
}: CommonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={shellClasses(
        size,
        fullWidth,
        "bg-white/[0.04] text-fg rounded-[18px] backdrop-blur shadow-[0_6px_10px_rgba(0,0,0,0.25)] border border-white/18 overflow-hidden",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-b from-white/14 to-transparent to-50%"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-white/22"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-black/20"
      />
      <span className="relative inline-flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </span>
    </button>
  );
}
