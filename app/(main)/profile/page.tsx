import { ensureMain } from "@/lib/route-resolver";
import { getServerLang, t } from "@/lib/i18n";
import { TopBar } from "@/components/TopBar";
import { Avatar } from "@/components/Avatar";
import { LangToggle } from "@/components/LangToggle";

export default async function ProfilePage() {
  const me = await ensureMain();
  const lang = await getServerLang();
  const initials =
    `${me.first_name[0] ?? ""}${me.last_name[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div>
      <TopBar title={t("tab_profile", lang)} right={<LangToggle />} />
      <div className="px-6 py-4 flex flex-col items-center gap-3 text-center">
        <Avatar initials={initials} size={72} />
        <div>
          <p className="font-serif text-2xl tracking-tight text-fg">
            {me.first_name} {me.last_name}
          </p>
          <p className="text-xs text-subtle">{me.role}</p>
        </div>

        <p className="mt-4 text-sm text-muted max-w-xs">
          Module 11 fills this in (personal data, preferences,
          DashboardLayoutPicker).
        </p>

        <form action="/auth/signout" method="post" className="mt-6">
          <button
            type="submit"
            className="text-sm text-muted hover:text-fg underline-offset-4 hover:underline"
          >
            {t("profile_signout", lang)}
          </button>
        </form>
      </div>
    </div>
  );
}
