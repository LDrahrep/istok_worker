import "server-only";

import { redirect } from "next/navigation";
import { getCurrentEmployee, type CurrentEmployee } from "@/lib/auth";
import { isAdminRole, isWorkerRole } from "@/lib/roles";

// Mirror of iOS App/AppRoute.swift:
//   launch | welcome | invite | onboarding | waiting | main
//
// On the web `welcome` and `invite` collapse to `/login`, `launch` is just
// the SSR cold-start (no animation in MVP), and `onboarding` lives at
// `/onboarding/*` (Module 6). The router-resolver below picks one of these
// terminal routes based on the signed-in user's row.

export type WorkerRoute =
  | "/welcome"
  | "/login"
  | "/onboarding"
  | "/waiting"
  | "/dashboard";

/**
 * Decide where the user should land. Returns the path; callers either
 * `redirect()` to it directly (server components) or render the matching
 * UI inline.
 */
export function resolveWorkerRoute(
  me: CurrentEmployee | null,
): WorkerRoute | { kind: "external"; href: string } {
  // Unauthenticated → marketing-style welcome (Module 6). The "Sign in with
  // email" CTA there sends them to /login (Module 4).
  if (!me) return "/welcome";
  if (isAdminRole(me.role)) {
    return {
      kind: "external",
      href:
        process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://istok-admin.vercel.app",
    };
  }
  if (!isWorkerRole(me.role)) {
    // Defensive — unknown role values should never reach this.
    return "/login";
  }
  if (me.status === "pending") return "/waiting";
  // active / oncall / inactive — let them in. `inactive` workers might still
  // need access to read-only screens (their own profile, last shift, etc.).
  return "/dashboard";
}

/**
 * One-shot helper for server components that just want to bounce the user
 * to the right place. Returns the employee row when nothing else matches
 * (the caller renders the page inline).
 */
export async function ensureMain(): Promise<CurrentEmployee> {
  const me = await getCurrentEmployee();
  const target = resolveWorkerRoute(me);
  if (typeof target === "object") {
    redirect(target.href);
  }
  if (target !== "/dashboard") {
    redirect(target);
  }
  // me is guaranteed non-null when target === "/dashboard".
  return me!;
}
