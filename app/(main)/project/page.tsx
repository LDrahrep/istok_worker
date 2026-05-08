import { getServerLang, t } from "@/lib/i18n";
import { TopBar } from "@/components/TopBar";

export default async function ProjectPage() {
  const lang = await getServerLang();
  return (
    <div>
      <TopBar title={t("tab_project", lang)} />
      <div className="px-6 py-4">
        <p className="text-sm text-muted">
          Module 10 fills this in (project info, schedule, crew, hourly rate).
        </p>
      </div>
    </div>
  );
}
