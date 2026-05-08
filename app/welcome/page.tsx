// Welcome / hero screen. Port of iOS Screens/Onboarding/WelcomeScreen.swift.
// Two-tone hero title ("Welcome to ISTOK One" with "One" in gold italic
// serif), subtitle, CompanyStamp, and a "Sign in with email" CTA that
// routes to /login.
//
// iOS uses New York serif + ss01 stylistic alternate for the "One" word —
// on the web we lean on the system serif chain (--font-serif) and italic;
// the ss01 decorative `e` is iOS-only until we ship a custom font.

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentEmployee } from "@/lib/auth";
import { resolveWorkerRoute } from "@/lib/route-resolver";
import { getServerLang, t } from "@/lib/i18n";
import { LogoMark } from "@/components/LogoMark";
import { LangToggle } from "@/components/LangToggle";
import { CompanyStamp } from "@/components/CompanyStamp";

export default async function WelcomePage() {
  // If already routed somewhere meaningful, don't show Welcome.
  const me = await getCurrentEmployee();
  if (me) {
    const target = resolveWorkerRoute(me);
    if (typeof target === "object") redirect(target.href);
    redirect(target);
  }

  const lang = await getServerLang();

  return (
    <main className="min-h-dvh px-6 pt-2 pb-7 max-w-md mx-auto flex flex-col">
      <header className="flex items-center justify-between pt-2">
        <LogoMark />
        <LangToggle />
      </header>

      <section className="flex-1 flex flex-col justify-center gap-10">
        <div>
          <h1 className="font-serif text-[44px] leading-[1.05] tracking-[-1px] text-fg">
            {t("welcome_title", lang)}{" "}
            <span className="italic text-accent">One</span>
          </h1>
          <p className="mt-4 whitespace-pre-line text-base text-muted leading-relaxed">
            {t("welcome_subtitle", lang)}
          </p>
        </div>

        <CompanyStamp
          lines={[
            t("company_stamp_line1", lang),
            t("company_stamp_line2", lang),
            t("company_stamp_line3", lang),
          ]}
        />
      </section>

      <Link
        href="/login"
        className="relative inline-flex items-center justify-center h-[52px] w-full rounded-[18px] bg-accent text-accent-fg text-base font-semibold tracking-tight transition-transform active:scale-[0.965] shadow-[0_8px_12px_-2px_rgba(233,201,120,0.25)] overflow-hidden"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-b from-white/35 to-transparent to-55%"
        />
        <span className="relative">{t("welcome_cta", lang)}</span>
      </Link>
    </main>
  );
}
