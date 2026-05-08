// Worker shell. Anything inside the (main) route group sits behind this
// layout, which:
//   * gates access to recognized workers (ensureMain redirects others),
//   * mounts the floating BottomTabBar at the foot.
//
// Module 7 will add an ErrorBus host and per-table realtime subscriptions
// here. For Module 5 it's the bare gate + tab bar.

import { ensureMain } from "@/lib/route-resolver";
import { ShellTabBar } from "./_shell-tab-bar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureMain();

  return (
    <div className="relative min-h-dvh pb-28">
      {children}
      <div className="fixed bottom-4 left-2 right-2 z-30">
        <ShellTabBar />
      </div>
    </div>
  );
}
