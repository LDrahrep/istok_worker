"use client";

// Web port of iOS App/State/ErrorBus.swift. Three buckets:
//   * toast — short auto-dismissing pill at the top
//   * banner — keyed (one per kind), persistent, optional retry
//   * modal — blocking sheet for hard errors (omitted in MVP; banners
//     cover the same incidents on web)
//
// Anything async in the worker shell should funnel into pushBanner
// instead of leaving a silent console.error.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ErrorEvent = {
  id: string;
  kind: string;
  title: string;
  body: string;
  timestamp: number;
  onRetry?: () => Promise<void> | void;
};

type Ctx = {
  toast: ErrorEvent | null;
  banners: ErrorEvent[];
  pushToast: (e: Omit<ErrorEvent, "id" | "timestamp">) => void;
  pushBanner: (e: Omit<ErrorEvent, "id" | "timestamp">) => void;
  clearToast: () => void;
  clearBanner: (kind: string) => void;
};

const ErrorBusCtx = createContext<Ctx | null>(null);

const TOAST_TTL_MS = 4000;

function freshId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ErrorBusProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ErrorEvent | null>(null);
  const [banners, setBanners] = useState<ErrorEvent[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = null;
    setToast(null);
  }, []);

  const pushToast = useCallback<Ctx["pushToast"]>((e) => {
    const event: ErrorEvent = { ...e, id: freshId(), timestamp: Date.now() };
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(event);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_TTL_MS);
  }, []);

  const pushBanner = useCallback<Ctx["pushBanner"]>((e) => {
    const event: ErrorEvent = { ...e, id: freshId(), timestamp: Date.now() };
    setBanners((prev) => {
      // Dedup by kind — newer wins.
      const without = prev.filter((b) => b.kind !== event.kind);
      return [...without, event];
    });
  }, []);

  const clearBanner = useCallback<Ctx["clearBanner"]>((kind) => {
    setBanners((prev) => prev.filter((b) => b.kind !== kind));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      toast,
      banners,
      pushToast,
      pushBanner,
      clearToast,
      clearBanner,
    }),
    [toast, banners, pushToast, pushBanner, clearToast, clearBanner],
  );

  return <ErrorBusCtx.Provider value={value}>{children}</ErrorBusCtx.Provider>;
}

export function useErrorBus(): Ctx {
  const ctx = useContext(ErrorBusCtx);
  if (!ctx) {
    // Tolerable fallback for previews — silent no-ops, never throws.
    return {
      toast: null,
      banners: [],
      pushToast: () => {},
      pushBanner: () => {},
      clearToast: () => {},
      clearBanner: () => {},
    };
  }
  return ctx;
}
