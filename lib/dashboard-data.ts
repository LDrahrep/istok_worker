import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CurrentEmployee } from "@/lib/auth";

// Shape that DashboardScreen consumes. Mirrors the iOS DashboardScreen
// view-model — same fields, different transport (PostgREST instead of
// SwiftData).

export type DashboardData = {
  me: CurrentEmployee & {
    middle_name: string | null;
    phone: string | null;
    email: string | null;
    shift: "day" | "night" | "meltech_day" | "meltech_night" | null;
    hotel_id: string | null;
  };
  assignedProjects: { id: string; name: string; status: string }[];
  unreadInbox: number;
  unreadFromAdmin: number;
};

export async function loadDashboardData(
  meBase: CurrentEmployee,
): Promise<DashboardData> {
  const supabase = await createClient();

  // Re-fetch full employee row (auth.requireWorker hands us only the
  // narrow set it needs) plus projects + inbox counts in parallel.
  const [{ data: full }, { data: projectLinks }, { count: inboxUnread }, { count: adminUnread }] =
    await Promise.all([
      supabase
        .from("employees")
        .select("middle_name, phone, email, shift, hotel_id")
        .eq("id", meBase.id)
        .maybeSingle(),
      supabase
        .from("employee_projects")
        .select("project:project_id (id, name, status)")
        .eq("employee_id", meBase.id),
      supabase
        .from("inbox_messages")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", meBase.id)
        .is("read_at", null),
      supabase
        .from("employee_messages")
        .select("id", { count: "exact", head: true })
        .eq("employee_id", meBase.id)
        .eq("author_role", "admin")
        .is("read_by_employee_at", null),
    ]);

  type Link = { project: { id: string; name: string; status: string } | null };
  const links = (projectLinks ?? []) as unknown as Link[];

  return {
    me: {
      ...meBase,
      middle_name: (full?.middle_name as string | null) ?? null,
      phone: (full?.phone as string | null) ?? null,
      email: (full?.email as string | null) ?? null,
      shift: (full?.shift as DashboardData["me"]["shift"]) ?? null,
      hotel_id: (full?.hotel_id as string | null) ?? null,
    },
    assignedProjects: links
      .map((l) => l.project)
      .filter((p): p is NonNullable<Link["project"]> => p != null),
    unreadInbox: inboxUnread ?? 0,
    unreadFromAdmin: adminUnread ?? 0,
  };
}
