// Language picker — port of iOS Components/LangToggle.swift. Reads/writes
// the global i18n store; pass `lang`/`onChange` to override (used in the
// kitchen sink). Without props it auto-wires to `useI18n()`.

"use client";

import { useState } from "react";
import type { AppLanguage } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { Icon } from "./Icon";

const ENDONYM: Record<AppLanguage, string> = {
  en: "English",
  ru: "Русский",
};

export function LangToggle({
  lang: langProp,
  onChange,
  options = ["en", "ru"],
}: {
  lang?: AppLanguage;
  onChange?: (lang: AppLanguage) => void;
  options?: readonly AppLanguage[];
}) {
  const i18n = useI18n();
  const lang = langProp ?? i18n.lang;
  const setLang = onChange ?? i18n.setLang;
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-full bg-surface-alt border border-border px-3 py-1.5 text-xs font-semibold tracking-tight text-fg backdrop-blur"
      >
        <span>{ENDONYM[lang]}</span>
        <Icon name="chevron-down" size={9} strokeWidth={2.5} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 min-w-[140px] z-20 rounded-lg bg-surface-solid border border-border shadow-lg overflow-hidden"
        >
          {options.map((opt) => {
            const active = opt === lang;
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLang(opt);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm text-fg hover:bg-white/[0.04]"
                >
                  <span>{ENDONYM[opt]}</span>
                  {active && (
                    <Icon name="check" size={14} strokeWidth={2.5} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
