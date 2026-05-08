// Module 8 will fully render the dashboard (ScheduleToday, BriefingStats,
// CrewStrip, PayWeekCard, AppsSection). For Module 5 it's a placeholder
// confirming the shell + tab bar work end-to-end.

import { ensureMain } from "@/lib/route-resolver";
import { getServerLang, t } from "@/lib/i18n";
import { TopBar } from "@/components/TopBar";
import { LangToggle } from "@/components/LangToggle";

export default async function DashboardPage() {
  const me = await ensureMain();
  const lang = await getServerLang();

  return (
    <div>
      <TopBar title={t("tab_home", lang)} right={<LangToggle />} />
      <div className="px-6 py-4 space-y-2">
        <p className="font-serif text-3xl tracking-tight text-fg">
          {me.first_name}
        </p>
        <p className="text-sm text-muted">
          Module 5 placeholder. Full dashboard lands in Module 8.
        </p>
      </div>
    </div>
  );
}
