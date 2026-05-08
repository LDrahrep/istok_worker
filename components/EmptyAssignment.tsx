// Full-screen empty state for Hotel/Project when nothing is assigned yet.
// Port of iOS Components/EmptyAssignmentView.swift.

import type { ReactNode } from "react";
import { TopBar } from "./TopBar";

export function EmptyAssignment({
  topBarTitle,
  icon,
  title,
  message,
  onBack,
}: {
  topBarTitle: string;
  /** Pass a sized <Icon name=... /> — typically size 38. */
  icon: ReactNode;
  title: string;
  message: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar title={topBarTitle} onBack={onBack} />
      <div className="flex flex-1 items-center justify-center px-10">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="relative grid h-24 w-24 place-items-center rounded-full bg-accent/12 ring-1 ring-accent/30">
            <span className="text-accent">{icon}</span>
          </div>
          <h2 className="font-serif text-[22px] tracking-tight text-fg">
            {title}
          </h2>
          <p className="text-sm text-muted">{message}</p>
        </div>
      </div>
    </div>
  );
}
