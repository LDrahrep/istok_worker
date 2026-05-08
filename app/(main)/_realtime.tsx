"use client";

// Realtime-sync glue for the worker shell. iOS uses the
// "fetch + subscribe + 2-second reconcile" pattern (stage-5b) per
// table; for the web MVP we only need to re-fetch the server tree
// when something changes, so router.refresh() suffices.
//
// Subscribed tables (extend as more screens land):
//   * employees (own row)        — covers status flips (pending → active)
//                                  and self-edits done elsewhere.
//
// More tables (employee_projects, projects, hotels, inbox_messages,
// employee_messages, friend_applications) plug in here as their
// screens come online (Modules 8–14).

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useErrorBus } from "@/lib/error-bus";
import { useT } from "@/lib/i18n/client";
import { createClient } from "@/lib/supabase/client";

export function ShellRealtime({ employeeId }: { employeeId: string }) {
  const router = useRouter();
  const bus = useErrorBus();
  const t = useT();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`employees-self-${employeeId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "employees",
          filter: `id=eq.${employeeId}`,
        },
        () => router.refresh(),
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          bus.pushBanner({
            kind: "realtime-employees",
            title: t("error_realtime_dropped_title"),
            body: t("error_realtime_dropped_body"),
            onRetry: async () => {
              await channel.unsubscribe();
              router.refresh();
            },
          });
        }
      });

    return () => {
      void channel.unsubscribe();
    };
  }, [employeeId, router, bus, t]);

  return null;
}
