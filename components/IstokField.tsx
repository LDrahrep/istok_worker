// Labeled text input. Port of iOS Components/IstokField.swift. The label is
// uppercase tracking-wide muted; the input is a 16px-radius glass field
// that picks up an accent ring on focus.
//
// Accepts a `name` so it composes naturally with `<form action={server}>`
// flows we use elsewhere in the project.

"use client";

import { useId, type InputHTMLAttributes } from "react";

export function IstokField({
  label,
  hint,
  wrapperClassName = "",
  ...rest
}: {
  label: string;
  hint?: string;
  wrapperClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <label htmlFor={id} className={`flex flex-col ${wrapperClassName}`}>
      <span className="pb-2 text-xs font-semibold uppercase tracking-[0.5px] text-muted">
        {label}
      </span>
      <input
        id={id}
        {...rest}
        className="h-[50px] rounded-[16px] bg-white/[0.05] border border-white/14 px-3.5 text-base text-fg placeholder:text-subtle outline-none transition-colors focus:border-accent focus:ring-3 focus:ring-accent/20 backdrop-blur"
      />
      {hint && <span className="pt-1.5 text-xs text-subtle">{hint}</span>}
    </label>
  );
}
