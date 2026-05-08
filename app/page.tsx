import { redirect } from "next/navigation";
import { getCurrentEmployee } from "@/lib/auth";
import { resolveWorkerRoute } from "@/lib/route-resolver";

// Root resolver. Mirrors iOS RootView's switch over AppState.route. Always
// terminates in a redirect — the actual screens live at /login, /onboarding,
// /waiting, /dashboard.
export default async function RootPage() {
  const me = await getCurrentEmployee();
  const target = resolveWorkerRoute(me);
  if (typeof target === "object") {
    redirect(target.href);
  }
  redirect(target);
}
