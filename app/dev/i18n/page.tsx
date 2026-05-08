"use client";

// Module 3 verification page. Tap the LangToggle and watch every line below
// re-render in the new language. 404 in production.

import { notFound } from "next/navigation";
import { useT, useLang } from "@/lib/i18n/client";
import { LangToggle } from "@/components/LangToggle";

const SAMPLE_KEYS = [
  "welcome_title",
  "welcome_subtitle",
  "welcome_cta",
  "tab_home",
  "tab_hotel",
  "tab_project",
  "tab_profile",
  "wait_title",
  "wait_sub",
  "save",
  "cancel",
  "continue",
  "back",
  "dash_active",
  "dash_oncall",
  "dash_inactive",
  "admin_filter_pending",
] as const;

export default function I18nPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const t = useT();
  const lang = useLang();

  return (
    <main className="min-h-dvh px-6 py-10 max-w-2xl mx-auto space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-fg tracking-tight">
            i18n
          </h1>
          <p className="mt-2 text-sm text-muted">
            Active language: <code className="font-mono text-fg">{lang}</code>.
            Tap the toggle to switch — server components are refreshed via{" "}
            <code className="font-mono">router.refresh()</code>.
          </p>
        </div>
        <LangToggle />
      </header>

      <section className="rounded-[18px] bg-surface border border-border p-4 space-y-3">
        {SAMPLE_KEYS.map((key) => (
          <div key={key} className="flex flex-col gap-1">
            <code className="font-mono text-[10px] uppercase tracking-wider text-subtle">
              {key}
            </code>
            <p className="text-sm text-fg whitespace-pre-line">{t(key)}</p>
          </div>
        ))}
      </section>

      <p className="text-xs text-subtle">
        236 keys total — see{" "}
        <code className="font-mono">lib/i18n/strings.ts</code>.
      </p>
    </main>
  );
}
