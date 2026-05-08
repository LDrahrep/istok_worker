"use client";

// Picks the active tab from the current pathname and navigates on tap.
// The BottomTabBar primitive itself stays presentational; this thin
// client component wires it to next/navigation. Lives next to the
// layout that mounts it.

import { usePathname, useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/client";
import { BottomTabBar, DEFAULT_TABS, type TabSpec } from "@/components/BottomTabBar";
import type { MainTabKey } from "@/lib/types";

function pathToTab(pathname: string): MainTabKey {
  if (pathname.startsWith("/hotel")) return "hotel";
  if (pathname.startsWith("/project")) return "project";
  if (pathname.startsWith("/profile")) return "profile";
  return "home";
}

export function ShellTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();

  // i18n labels — DEFAULT_TABS is hardcoded to English so the kitchen
  // sink renders without a provider; here we localize.
  const tabs = DEFAULT_TABS.map((tab) => ({
    ...tab,
    label: t(`tab_${tab.key}` as
      | "tab_home"
      | "tab_hotel"
      | "tab_project"
      | "tab_profile"),
  }));

  return (
    <BottomTabBar
      current={pathToTab(pathname)}
      onSelect={(tab: TabSpec) => router.push(tab.href)}
      tabs={tabs}
    />
  );
}
