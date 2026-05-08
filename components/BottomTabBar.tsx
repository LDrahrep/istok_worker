// Floating glass tab bar. Port of iOS Components/TabBar/BottomTabBar.swift.
// 64px tall, 22px corner radius, 8px side padding inside the bar; mounted
// by the worker shell with bottom inset of 18px and 10px outer side gutter.
//
// Active tab gets a 4px gold dot above the icon and accent-coloured
// label/icon. Inactive tabs use textMuted. The shell drives selection via
// URL routing — this component is presentational only.

"use client";

import type { MainTabKey } from "@/lib/types";
import { Icon, type IconName } from "./Icon";

export type TabSpec = {
  key: MainTabKey;
  label: string;
  icon: IconName;
  href: string;
};

export const DEFAULT_TABS: readonly TabSpec[] = [
  { key: "home", label: "Home", icon: "home", href: "/dashboard" },
  { key: "hotel", label: "Hotel", icon: "bed", href: "/hotel" },
  { key: "project", label: "Project", icon: "tool", href: "/project" },
  { key: "profile", label: "Profile", icon: "user", href: "/profile" },
] as const;

export function BottomTabBar({
  current,
  onSelect,
  tabs = DEFAULT_TABS,
}: {
  current: MainTabKey;
  onSelect: (tab: TabSpec) => void;
  tabs?: readonly TabSpec[];
}) {
  return (
    <nav
      aria-label="Primary"
      className="flex items-stretch h-16 px-2 rounded-[22px] bg-white/[0.055] border border-white/12 backdrop-blur-md shadow-[0_12px_16px_rgba(0,0,0,0.35)]"
    >
      {tabs.map((tab) => {
        const active = tab.key === current;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab)}
            aria-current={active ? "page" : undefined}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-transform active:scale-[0.965]"
          >
            <span className="relative inline-flex w-6 h-6 items-center justify-center">
              {active && (
                <span
                  aria-hidden
                  className="absolute -top-2 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-accent"
                />
              )}
              <span
                className={
                  active
                    ? "text-accent"
                    : "text-muted"
                }
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  strokeWidth={active ? 2.4 : 2}
                />
              </span>
            </span>
            <span
              className={`text-[10px] tracking-[0.02em] ${
                active ? "font-semibold text-accent" : "font-medium text-muted"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
