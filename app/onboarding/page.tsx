// Onboarding flow stub. Module 6 will replace this with the 5-step wizard
// (mirrors iOS OnboardingDraft state machine). For Module 5 we only need
// the route to resolve so the resolver doesn't 404.

import { redirect } from "next/navigation";
import { getCurrentEmployee } from "@/lib/auth";
import { resolveWorkerRoute } from "@/lib/route-resolver";
import { getServerLang, t } from "@/lib/i18n";
import { LogoMark } from "@/components/LogoMark";
import { LangToggle } from "@/components/LangToggle";

export default async function OnboardingPage() {
  // Bounce if the user already belongs elsewhere.
  const me = await getCurrentEmployee();
  const target = resolveWorkerRoute(me);
  if (target !== "/onboarding") {
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
        <h1 className="font-serif text-3xl tracking-tight text-fg">
          Onboarding
        </h1>
        <p className="mt-3 text-sm text-muted">
          Module 6 ports the 5-step wizard from iOS. For now this page just
          confirms the route resolver routes you here when you have no
          employees row yet.
        </p>
        <p className="mt-2 text-xs text-subtle">
          ({t("invite_help", lang)})
        </p>
      </div>
    </main>
  );
}
