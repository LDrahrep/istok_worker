"use client";

// Client-side i18n. Reads the language from a React context populated at
// the root layout and sets the cookie + localStorage when the user toggles.
//
// We bump the cookie client-side (it's not httpOnly) so the toggle is
// instant; a `router.refresh()` then re-renders any server components with
// the new language.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { COOKIE_NAME, DEFAULT_LANG, t as serverT, type LangKey } from "./index";
import type { AppLanguage } from "@/lib/types";

type Ctx = {
  lang: AppLanguage;
  setLang: (next: AppLanguage) => void;
  t: (key: LangKey, params?: Record<string, string | number>) => string;
  pending: boolean;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({
  initialLang,
  children,
}: {
  initialLang: AppLanguage;
  children: ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setLang = useCallback(
    (next: AppLanguage) => {
      if (typeof document !== "undefined") {
        // Persist for ~1 year. SameSite=Lax is enough for a personal
        // preference cookie; not Secure on localhost (dev).
        const oneYear = 60 * 60 * 24 * 365;
        document.cookie = `${COOKIE_NAME}=${next}; Path=/; Max-Age=${oneYear}; SameSite=Lax`;
        try {
          localStorage.setItem(COOKIE_NAME, next);
        } catch {
          /* private mode / quota — non-fatal */
        }
      }
      // Re-render server tree with the new lang.
      startTransition(() => router.refresh());
    },
    [router],
  );

  const value = useMemo<Ctx>(
    () => ({
      lang: initialLang,
      setLang,
      t: (key, params) => serverT(key, initialLang, params),
      pending,
    }),
    [initialLang, setLang, pending],
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nCtx);
  if (!ctx) {
    // Tolerable fallback for unwrapped previews / dev pages — returns the
    // default language instead of throwing.
    return {
      lang: DEFAULT_LANG,
      setLang: () => {
        /* no-op */
      },
      t: (key, params) => serverT(key, DEFAULT_LANG, params),
      pending: false,
    };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}

export function useLang() {
  return useI18n().lang;
}
