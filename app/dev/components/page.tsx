"use client";

// Module 2 kitchen-sink. Renders one example of each ported primitive so
// designers/devs can spot drift after changes. 404 in production, like
// /dev/tokens. Mark as client component because LangToggle, BottomTabBar
// take callbacks and own local state for the demo.

import { notFound } from "next/navigation";
import { useState } from "react";
import { AppTile } from "@/components/AppTile";
import { Avatar } from "@/components/Avatar";
import { BottomTabBar, DEFAULT_TABS, type TabSpec } from "@/components/BottomTabBar";
import {
  GhostButton,
  PrimaryButton,
  SecondaryButton,
} from "@/components/Button";
import { Card } from "@/components/Card";
import { CompanyStamp } from "@/components/CompanyStamp";
import { EmptyAssignment } from "@/components/EmptyAssignment";
import { Icon } from "@/components/Icon";
import { InfoTile } from "@/components/InfoTile";
import { IstokField } from "@/components/IstokField";
import { LangToggle } from "@/components/LangToggle";
import { ListRow } from "@/components/ListRow";
import { LoadingSpinner, PulsingDots } from "@/components/Spinners";
import { LogoMark } from "@/components/LogoMark";
import { Metric } from "@/components/Metric";
import { SectionLabel } from "@/components/SectionLabel";
import { StatusPill } from "@/components/StatusPill";
import { TopBar } from "@/components/TopBar";
import type { AppLanguage, MainTabKey } from "@/lib/types";

export default function ComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const [lang, setLang] = useState<AppLanguage>("en");
  const [tab, setTab] = useState<MainTabKey>("home");

  return (
    <main className="min-h-dvh px-6 py-10 max-w-3xl mx-auto space-y-12">
      <header>
        <h1 className="font-serif text-4xl text-fg tracking-tight">
          Components
        </h1>
        <p className="mt-2 text-sm text-muted">
          Each primitive ported from iOS{" "}
          <code className="font-mono">Components/</code>. Drift here is a
          regression — keep this page green.
        </p>
      </header>

      <Block title="TopBar">
        <Card pad={0} className="!p-0 overflow-visible">
          <TopBar
            title="Hotel"
            onBack={() => {}}
            right={<LangToggle lang={lang} onChange={setLang} />}
          />
        </Card>
      </Block>

      <Block title="LogoMark">
        <LogoMark />
      </Block>

      <Block title="Buttons">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <PrimaryButton size="md">Primary</PrimaryButton>
          <SecondaryButton size="md">Secondary</SecondaryButton>
          <GhostButton size="md">Ghost</GhostButton>
          <PrimaryButton size="sm" icon={<Icon name="plus" size={14} />}>
            Small w/ icon
          </PrimaryButton>
          <SecondaryButton size="sm" disabled>
            Disabled
          </SecondaryButton>
          <GhostButton size="lg">Large ghost</GhostButton>
        </div>
      </Block>

      <Block title="Card + ListRow">
        <Card>
          <ListRow
            icon={<Icon name="bell" size={18} />}
            title="Inbox"
            detail="2 unread"
            unread
          />
          <ListRow
            icon={<Icon name="user" size={18} />}
            title="Profile"
            detail="Tap to edit"
          />
          <ListRow
            icon={<Icon name="settings" size={18} />}
            title="Preferences"
            last
          />
        </Card>
      </Block>

      <Block title="StatusPill (4 states)">
        <div className="flex flex-wrap gap-2">
          <StatusPill status="active" />
          <StatusPill status="oncall" />
          <StatusPill status="inactive" />
          <StatusPill status="pending" />
        </div>
      </Block>

      <Block title="Avatar (small / medium / hero / tinted)">
        <div className="flex items-end gap-3">
          <Avatar initials="MN" size={32} />
          <Avatar initials="MN" size={48} />
          <Avatar initials="MN" size={72} />
          <Avatar initials="MN" size={48} tint="var(--color-accent)" />
        </div>
      </Block>

      <Block title="Metric">
        <div className="grid grid-cols-3 gap-4">
          <Metric value="42" unit="h" label="This week" />
          <Metric value="3" label="Open shifts" />
          <Card pad={14} className="bg-accent border-0">
            <Metric value="$1240" label="Pay this period" dark />
          </Card>
        </div>
      </Block>

      <Block title="InfoTile (Hotel grid)">
        <div className="grid grid-cols-3 gap-2.5">
          <InfoTile label="Room" value="206" />
          <InfoTile label="Check-in" value="Jul 20" />
          <InfoTile label="Check-out" value="Aug 17" />
        </div>
      </Block>

      <Block title="IstokField">
        <Card>
          <IstokField label="First name" defaultValue="Mingiian" />
          <div className="h-3" />
          <IstokField
            label="Email"
            type="email"
            placeholder="you@istok.app"
            hint="Magic-link will be sent to this address."
          />
        </Card>
      </Block>

      <Block title="SectionLabel">
        <div className="flex gap-6">
          <SectionLabel>Today</SectionLabel>
          <SectionLabel>Shortcuts</SectionLabel>
          <SectionLabel>Crew</SectionLabel>
        </div>
      </Block>

      <Block title="Spinners">
        <div className="flex items-center gap-8">
          <LoadingSpinner />
          <PulsingDots />
        </div>
      </Block>

      <Block title="CompanyStamp">
        <CompanyStamp
          lines={["LLC ISTOK GROUP", "Headquarters · Memphis, TN", "EIN 00-0000000"]}
        />
      </Block>

      <Block title="App tiles (partner accents)">
        <div className="grid grid-cols-2 gap-2.5">
          <AppTile
            name="CarBot"
            description="Ride to site"
            icon={<Icon name="car" size={18} strokeWidth={2.4} />}
            tint="var(--color-tint-carbot)"
          />
          <AppTile
            name="Trunk"
            description="Pick a ride"
            icon={<Icon name="scan" size={18} strokeWidth={2.4} />}
            tint="var(--color-tint-trunk)"
          />
          <AppTile
            name="Hours"
            description="Log timesheet"
            icon={<Icon name="clock" size={18} strokeWidth={2.4} />}
            tint="var(--color-tint-timesheet)"
          />
          <AppTile
            name="Safety"
            description="Site safety briefing"
            icon={<Icon name="shield" size={18} strokeWidth={2.4} />}
            tint="var(--color-tint-safety)"
          />
        </div>
      </Block>

      <Block title="Empty assignment state">
        <div className="rounded-[18px] border border-border overflow-hidden">
          <EmptyAssignment
            topBarTitle="Hotel"
            icon={<Icon name="bed" size={38} strokeWidth={1.8} />}
            title="No hotel assigned"
            message="Contact your manager to receive a hotel placement."
            onBack={() => {}}
          />
        </div>
      </Block>

      <Block title="BottomTabBar (floating)">
        <div className="rounded-[24px] bg-bg-bottom p-4 pt-32">
          <BottomTabBar
            current={tab}
            onSelect={(t: TabSpec) => setTab(t.key)}
            tabs={DEFAULT_TABS}
          />
        </div>
      </Block>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
