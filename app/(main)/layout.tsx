// Worker shell. Anything inside the (main) route group sits behind this
// layout, which:
//   * gates access to recognized workers (ensureMain redirects others),
//   * mounts the floating BottomTabBar at the foot,
//   * provides ErrorBus context + a banner host overlay,
//   * subscribes to realtime updates on the employee's own row so a
//     status change (pending → active, etc.) re-routes them automatically.
//
// Per-screen realtime (projects, hotels, inbox_messages) lives next to
// the screen that consumes the data — Modules 8–14 plug in.

import { ErrorBusProvider } from "@/lib/error-bus";
import { ErrorBannerHost } from "@/components/ErrorBannerHost";
import { ensureMain } from "@/lib/route-resolver";
import { ShellRealtime } from "./_realtime";
import { ShellTabBar } from "./_shell-tab-bar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await ensureMain();

  return (
    <ErrorBusProvider>
      <ErrorBannerHost />
      <ShellRealtime employeeId={me.id} />
      <div className="relative min-h-dvh pb-28">
        {children}
        <div className="fixed bottom-4 left-2 right-2 z-30">
          <ShellTabBar />
        </div>
      </div>
    </ErrorBusProvider>
  );
}
