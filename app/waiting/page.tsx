// "Waiting for admin approval" screen. Reached when employees.status =
// 'pending'. Mirrors iOS Screens/Onboarding/WaitingScreen.swift.

import { redirect } from "next/navigation";
import { getCurrentEmployee } from "@/lib/auth";
import { resolveWorkerRoute } from "@/lib/route-resolver";
import { getServerLang, t } from "@/lib/i18n";
import { LogoMark } from "@/components/LogoMark";
import { PulsingDots } from "@/components/Spinners";
import { LangToggle } from "@/components/LangToggle";

export default async function WaitingPage() {
  const me = await getCurrentEmployee();
  const target = resolveWorkerRoute(me);
  // If status changed under us (admin approved while we were on this page),
  // bounce out. Same for any unauth case.
  if (target !== "/waiting") {
    if (typeof target === "object") {
      redirect(target.href);
    }
    redirect(target);
  }

  const lang = await getServerLang();

  return (
    <main className="min-h-dvh px-6 py-10 max-w-sm mx-auto flex flex-col">
      <header className="flex items-center justify-between mb-12">
        <LogoMark />
        <LangToggle />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <PulsingDots />
        <h1 className="mt-6 font-serif text-3xl tracking-tight text-fg">
          {t("wait_title", lang)}
        </h1>
        <p className="mt-3 text-sm text-muted">{t("wait_sub", lang)}</p>
        <form action="/auth/signout" method="post" className="mt-10">
          <button
            type="submit"
            className="text-xs text-muted hover:text-fg underline-offset-4 hover:underline"
          >
            {t("profile_signout", lang)}
          </button>
        </form>
      </div>
    </main>
  );
}
