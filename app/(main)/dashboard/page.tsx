// Worker Dashboard. Ports DashboardScreen.swift:
//   * header with logo + bell (unread badge) + initials avatar
//   * serif greeting + StatusPill
//   * status hero card with three metrics
//   * Today: schedule + active project tiles
//   * Shortcuts list: Inbox / Support / Schedule
//   * AppsSection 2×2 partner tiles
//
// iOS computes ResolvedShift from a richer schedule model
// (StoredEmployee.resolveShiftForToday). For MVP we render the literal
// `employee.shift` value — full schedule resolution lands when the
// project_schedule table is wired in.

import Link from "next/link";
import { ensureMain } from "@/lib/route-resolver";
import { loadDashboardData } from "@/lib/dashboard-data";
import { getServerLang, t } from "@/lib/i18n";
import type { LangKey } from "@/lib/i18n";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { ListRow } from "@/components/ListRow";
import { LogoMark } from "@/components/LogoMark";
import { Metric } from "@/components/Metric";
import { SectionLabel } from "@/components/SectionLabel";
import { StatusPill } from "@/components/StatusPill";
import { AppTile } from "@/components/AppTile";
import type { AppLanguage, WorkerStatus } from "@/lib/types";

type Shift = NonNullable<
  Awaited<ReturnType<typeof loadDashboardData>>["me"]["shift"]
>;

const SHIFT_LABEL_KEY: Record<Shift, LangKey> = {
  day: "shift_day",
  night: "shift_night",
  meltech_day: "shift_meltech_day",
  meltech_night: "shift_meltech_night",
};

const STATUS_LABEL_KEY: Record<WorkerStatus, LangKey> = {
  active: "dash_active",
  oncall: "dash_oncall",
  inactive: "dash_inactive",
  pending: "admin_filter_pending",
};

export default async function DashboardPage() {
  const meBase = await ensureMain();
  const data = await loadDashboardData(meBase);
  const lang = await getServerLang();

  const initials =
    `${data.me.first_name[0] ?? ""}${data.me.last_name[0] ?? ""}`.toUpperCase() ||
    "?";
  const primaryProject = data.assignedProjects[0];
  const shiftLabel = data.me.shift ? t(SHIFT_LABEL_KEY[data.me.shift], lang) : "—";

  return (
    <main className="px-5 pt-3 pb-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <LogoMark />
        <div className="flex items-center gap-3">
          <Link
            href="/inbox"
            aria-label={t("inbox_title", lang)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-fg"
          >
            <Icon name="bell" size={18} strokeWidth={2.2} />
            {data.unreadInbox > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full bg-accent text-accent-fg text-[10px] font-semibold inline-flex items-center justify-center px-1">
                {data.unreadInbox}
              </span>
            )}
          </Link>
          <Link href="/profile" aria-label={t("tab_profile", lang)}>
            <Avatar initials={initials} size={40} />
          </Link>
        </div>
      </header>

      {/* Greeting + status pill */}
      <section className="space-y-2">
        <h1 className="font-serif text-[34px] tracking-tight leading-tight text-fg">
          {greetingPrefix(lang)}, {data.me.first_name}
        </h1>
        <StatusPill
          status={data.me.status}
          label={t(STATUS_LABEL_KEY[data.me.status], lang)}
        />
      </section>

      {/* Hero status card */}
      <Card className="!bg-accent !border-0">
        <div className="space-y-4">
          <div className="text-accent-fg/80 font-mono text-[10px] uppercase tracking-[0.18em]">
            {t("dash_today", lang)}
          </div>
          <p className="font-serif text-2xl tracking-tight text-accent-fg">
            {primaryProject?.name ?? "—"}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Metric value={shiftLabel} label="Shift" dark />
            <Metric
              value={data.assignedProjects.length.toString()}
              label="Projects"
              dark
            />
            <Metric
              value={data.unreadInbox.toString()}
              label={t("inbox_title", lang)}
              dark
            />
          </div>
        </div>
      </Card>

      {/* Shortcuts */}
      <section className="space-y-2">
        <SectionLabel>{t("dash_shortcuts", lang)}</SectionLabel>
        <Card pad={0}>
          <div className="px-4">
            <ListRow
              icon={<Icon name="bell" size={18} />}
              title={t("inbox_title", lang)}
              detail={
                data.unreadInbox > 0
                  ? `${data.unreadInbox} ${t("inbox_now", lang)}`
                  : undefined
              }
              unread={data.unreadInbox > 0}
            />
            <ListRow
              icon={<Icon name="message" size={18} />}
              title={t("dash_support", lang)}
              detail={
                data.unreadFromAdmin > 0
                  ? `${data.unreadFromAdmin}`
                  : undefined
              }
              unread={data.unreadFromAdmin > 0}
            />
            <ListRow
              icon={<Icon name="calendar" size={18} />}
              title={t("dash_schedule", lang)}
              last
            />
          </div>
        </Card>
      </section>

      {/* Partner apps */}
      <section className="space-y-2">
        <SectionLabel>{t("apps_title", lang)}</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          <AppTile
            name={t("apps_carbot_name", lang)}
            description={t("apps_carbot_desc", lang)}
            icon={<Icon name="car" size={18} strokeWidth={2.4} />}
            tint="var(--color-tint-carbot)"
          />
          <AppTile
            name={t("apps_trunk_name", lang)}
            description={t("apps_trunk_desc", lang)}
            icon={<Icon name="scan" size={18} strokeWidth={2.4} />}
            tint="var(--color-tint-trunk)"
          />
          <AppTile
            name={t("apps_hours_name", lang)}
            description={t("apps_hours_desc", lang)}
            icon={<Icon name="clock" size={18} strokeWidth={2.4} />}
            tint="var(--color-tint-timesheet)"
          />
          <AppTile
            name={t("apps_safety_name", lang)}
            description={t("apps_safety_desc", lang)}
            icon={<Icon name="shield" size={18} strokeWidth={2.4} />}
            tint="var(--color-tint-safety)"
          />
        </div>
      </section>
    </main>
  );
}

function greetingPrefix(lang: AppLanguage): string {
  const h = new Date().getHours();
  return h < 12
    ? t("dash_greeting_am", lang)
    : t("dash_greeting_pm", lang);
}
