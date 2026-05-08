import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isWorkerRole, type EmployeeRole } from "@/lib/roles";

export type CurrentEmployee = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: EmployeeRole;
  status: "active" | "oncall" | "inactive" | "pending";
};

export async function getCurrentEmployee(): Promise<CurrentEmployee | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("employees")
    .select("id, user_id, first_name, last_name, role, status")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as CurrentEmployee | null) ?? null;
}

/**
 * Layout-level guard for the worker (app) group. Redirects:
 *  - no session → /login (middleware already handles unauth, but this
 *    is defense-in-depth for direct server-component renders)
 *  - admin role → external admin app
 *  - no employee row → /onboarding (covers fresh sign-up)
 */
export async function requireWorker(): Promise<CurrentEmployee> {
  const me = await getCurrentEmployee();
  if (!me) {
    redirect("/login");
  }
  if (!isWorkerRole(me.role)) {
    // Admins/teamleads belong on the desktop admin tool.
    redirect(process.env.NEXT_PUBLIC_ADMIN_URL || "https://istok-admin.vercel.app");
  }
  return me;
}
