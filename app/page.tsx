import { redirect } from "next/navigation";
import { getCurrentEmployee } from "@/lib/auth";
import { isAdminRole, isWorkerRole } from "@/lib/roles";

// Root resolver. Mirrors the iOS `RootView` switch over `AppState.route`.
// For Module 0 we have only two terminal states wired up; the full state
// machine (welcome → invite → onboarding → waiting → main) lands in
// Module 5.
export default async function RootPage() {
  const me = await getCurrentEmployee();

  if (!me) {
    redirect("/login");
  }

  if (isAdminRole(me.role)) {
    redirect(
      process.env.NEXT_PUBLIC_ADMIN_URL || "https://istok-admin.vercel.app",
    );
  }

  if (!isWorkerRole(me.role)) {
    // Unrecognized role — bounce to login. Defensive; ENUM should keep us safe.
    redirect("/login");
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          ISTOK One
        </h1>
        <p className="mt-2 text-sm text-muted">
          Hi, {me.first_name}. The worker app is being built — modules will
          land one by one.
        </p>
        <p className="mt-6 text-xs text-subtle">
          Logged in as <span className="text-fg">{me.role}</span>.
        </p>
      </div>
    </main>
  );
}
