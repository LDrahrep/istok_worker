import { notFound } from "next/navigation";

// Design-token kitchen sink. Mirrors iOS `Theme/ObsidianTheme.swift` +
// `Theme/AppTints.swift` + `Theme/Typography.swift`. Used during Module 1
// to verify visual parity. Returns 404 in production.

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-dvh px-6 py-10 max-w-3xl mx-auto space-y-12">
      <header>
        <h1 className="font-serif text-4xl text-fg tracking-tight">
          Design tokens
        </h1>
        <p className="mt-2 text-sm text-muted font-sans">
          Mirror of iOS <code className="font-mono">Theme/ObsidianTheme</code>{" "}
          + <code className="font-mono">Theme/AppTints</code> +{" "}
          <code className="font-mono">Theme/Typography</code>. Use this page
          to spot drift after a token change.
        </p>
      </header>

      <Section title="Background & surfaces">
        <Swatch name="bg" varName="--color-bg" />
        <Swatch name="bg-top" varName="--color-bg-top" />
        <Swatch name="bg-bottom" varName="--color-bg-bottom" />
        <Swatch name="surface" varName="--color-surface" />
        <Swatch name="surface-alt" varName="--color-surface-alt" />
        <Swatch name="surface-solid" varName="--color-surface-solid" />
      </Section>

      <Section title="Text">
        <Swatch name="fg" varName="--color-fg" />
        <Swatch name="muted" varName="--color-muted" />
        <Swatch name="subtle" varName="--color-subtle" />
      </Section>

      <Section title="Borders">
        <Swatch name="border" varName="--color-border" />
        <Swatch name="border-strong" varName="--color-border-strong" />
      </Section>

      <Section title="Accent & semantic">
        <Swatch name="accent" varName="--color-accent" />
        <Swatch name="accent-fg" varName="--color-accent-fg" />
        <Swatch name="success" varName="--color-success" />
        <Swatch name="warning" varName="--color-warning" />
        <Swatch name="danger" varName="--color-danger" />
      </Section>

      <Section title="App tints (partner accents)">
        <Swatch name="tint-carbot" varName="--color-tint-carbot" />
        <Swatch name="tint-trunk" varName="--color-tint-trunk" />
        <Swatch name="tint-timesheet" varName="--color-tint-timesheet" />
        <Swatch name="tint-safety" varName="--color-tint-safety" />
      </Section>

      <Section title="Radii">
        <Radius name="sm" varName="--radius-sm" />
        <Radius name="md" varName="--radius-md" />
        <Radius name="lg" varName="--radius-lg" />
        <Radius name="card" varName="--radius-card" />
        <Radius name="xl" varName="--radius-xl" />
        <Radius name="pill" varName="--radius-pill" />
      </Section>

      <Section title="Typography">
        <div className="space-y-3">
          <p className="font-serif text-4xl text-fg leading-tight">
            Serif display 36 — Hero title
          </p>
          <p className="font-serif text-2xl text-fg">
            Serif display 24 — Section heading
          </p>
          <p className="font-serif text-xl text-accent">
            Serif display 20 — Metric value
          </p>
          <p className="font-sans text-base text-fg">
            Sans body 16 — paragraph copy. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
          <p className="font-sans text-sm text-muted">
            Sans body 14 muted — secondary copy and labels.
          </p>
          <p className="font-sans text-xs uppercase tracking-wider text-subtle">
            Sans body 12 subtle uppercase — eyebrow / kicker
          </p>
          <p className="font-mono text-sm text-fg">
            Mono 14 — EMP-7549bcec-f0a4-4455-afb2-fd896d6b1f7f
          </p>
        </div>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-sans text-xs uppercase tracking-wider text-subtle">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{children}</div>
    </section>
  );
}

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="rounded-md border border-border overflow-hidden bg-surface">
      <div
        className="h-14 w-full"
        style={{ background: `var(${varName})` }}
      />
      <div className="px-2.5 py-2 text-xs">
        <div className="font-mono text-fg">{name}</div>
        <div className="font-mono text-subtle">{varName}</div>
      </div>
    </div>
  );
}

function Radius({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="rounded-md border border-border overflow-hidden bg-surface p-3 flex items-center gap-3">
      <div
        className="h-12 w-12 bg-accent shrink-0"
        style={{ borderRadius: `var(${varName})` }}
      />
      <div className="text-xs">
        <div className="font-mono text-fg">{name}</div>
        <div className="font-mono text-subtle">{varName}</div>
      </div>
    </div>
  );
}
