"use client";

// Top-of-screen overlay rendering toast + keyed banners from the
// ErrorBus. Mounted once in the worker shell layout. Mirrors iOS
// Components/Error/ErrorBannerHost.swift.

import { useState } from "react";
import { useErrorBus, type ErrorEvent } from "@/lib/error-bus";
import { useT } from "@/lib/i18n/client";
import { Icon } from "./Icon";

export function ErrorBannerHost() {
  const bus = useErrorBus();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex flex-col items-stretch gap-2 px-4 pt-2">
      {bus.toast && (
        <ToastView event={bus.toast} onDismiss={bus.clearToast} />
      )}
      {bus.banners.map((b) => (
        <BannerView
          key={b.id}
          event={b}
          onDismiss={() => bus.clearBanner(b.kind)}
        />
      ))}
    </div>
  );
}

function ToastView({
  event,
  onDismiss,
}: {
  event: ErrorEvent;
  onDismiss: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      className="pointer-events-auto flex items-start gap-3 rounded-[18px] bg-surface border border-danger/40 px-3.5 py-3 text-left shadow-[0_6px_12px_rgba(0,0,0,0.25)] backdrop-blur"
    >
      <span className="text-danger pt-0.5">
        <Icon name="alert-triangle" size={18} strokeWidth={2.4} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-fg">
          {event.title}
        </span>
        <span className="block text-[13px] text-muted line-clamp-2">
          {event.body}
        </span>
      </span>
    </button>
  );
}

function BannerView({
  event,
  onDismiss,
}: {
  event: ErrorEvent;
  onDismiss: () => void;
}) {
  const t = useT();
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    if (!event.onRetry) return;
    setRetrying(true);
    try {
      await event.onRetry();
      onDismiss();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-[18px] bg-surface border border-danger/40 px-3.5 py-3 shadow-[0_6px_12px_rgba(0,0,0,0.25)] backdrop-blur">
      <span className="text-danger pt-0.5">
        <Icon name="wifi" size={18} strokeWidth={2.4} />
      </span>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div>
          <p className="text-sm font-semibold text-fg">{event.title}</p>
          <p className="text-[13px] text-muted">{event.body}</p>
        </div>
        <div className="flex gap-3 pt-0.5">
          {event.onRetry && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              className="text-[13px] font-semibold text-accent disabled:opacity-50"
            >
              {t("error_retry_button")}
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            className="text-[13px] text-muted"
          >
            {t("error_dismiss_button")}
          </button>
        </div>
      </div>
    </div>
  );
}
