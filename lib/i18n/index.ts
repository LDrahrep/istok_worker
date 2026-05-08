// i18n facade. Mirrors iOS `L(key, lang:)` and the language-switching
// behaviour of `AppState.lang` / `LangToggle`.
//
// Storage strategy:
//   * source of truth = the `istok-lang` cookie (so SSR sees the right value)
//   * client-side echo to `localStorage` for instant access pre-hydration
//   * the cookie is httpOnly=false so the LangToggle can bump it without a
//     server round-trip; a server action also exists for users hitting it
//     before any JS has loaded.
//
// API:
//   * `getServerLang()` — async, reads cookie inside a server component
//   * `t(key, lang, params?)` — pure interpolation; missing keys log + fall
//     back to the EN string.
//   * `useLang()` / `useT()` — client hooks (in ./client.ts to keep this
//     module server-safe).

import { en, ru, type LangKey } from "./strings";
import type { AppLanguage } from "@/lib/types";

export const COOKIE_NAME = "istok-lang";
export const DEFAULT_LANG: AppLanguage = "en";

const TABLES: Record<AppLanguage, Record<LangKey, string>> = { en, ru };

export type { LangKey } from "./strings";

/**
 * Server-side translator. Pass the user's chosen language explicitly —
 * server components should resolve it once via `getServerLang()` and
 * thread it down (or reach for `useT()` in client subtrees).
 */
export function t(
  key: LangKey,
  lang: AppLanguage,
  params?: Record<string, string | number>,
): string {
  const table = TABLES[lang] ?? TABLES[DEFAULT_LANG];
  const raw = table[key] ?? TABLES[DEFAULT_LANG][key];
  if (raw == null) {
    if (typeof console !== "undefined") {
      console.warn(`[i18n] missing key "${key}"`);
    }
    return key;
  }
  if (!params) return raw;
  return raw.replace(/%@|\{(\w+)\}/g, (match, name) => {
    if (match === "%@") {
      const first = Object.values(params)[0];
      return first == null ? match : String(first);
    }
    const v = params[name];
    return v == null ? match : String(v);
  });
}

/**
 * Resolve the user's chosen language from the request cookie. Falls back
 * to DEFAULT_LANG when nothing's set yet (first visit).
 */
export async function getServerLang(): Promise<AppLanguage> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (raw === "en" || raw === "ru") return raw;
  return DEFAULT_LANG;
}
