"use client";

// Magic-link login. Mirrors iOS Screens/Onboarding/InviteScreen.swift
// (subtitle + email field + "Send sign-in link" CTA, with an after-state
// that says "we sent it to <email>"). Module 6 will wrap this inside the
// proper Welcome → Invite shell; for Module 4 it stands alone at /login.

import { useActionState } from "react";
import { sendMagicLink, type LoginFormState } from "./_actions";
import { useT, useLang } from "@/lib/i18n/client";
import { IstokField } from "@/components/IstokField";
import { PrimaryButton } from "@/components/Button";
import { LangToggle } from "@/components/LangToggle";
import { LogoMark } from "@/components/LogoMark";

export function LoginForm() {
  const t = useT();
  const lang = useLang();
  const [state, formAction, pending] = useActionState<LoginFormState, FormData>(
    sendMagicLink,
    {},
  );

  if (state.sentTo) {
    return (
      <Shell>
        <h1 className="font-serif text-3xl tracking-tight text-fg">
          {t("invite_sent_title")}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {t("invite_sent_subtitle")}{" "}
          <span className="text-fg">{state.sentTo}</span>.
        </p>
        <p className="mt-2 text-xs text-subtle">{t("invite_help")}</p>

        <form action={formAction} className="mt-8 space-y-3">
          <input type="hidden" name="email" value={state.sentTo} />
          <PrimaryButton type="submit" disabled={pending}>
            {pending ? t("invite_sending") : t("invite_sent_resend")}
          </PrimaryButton>
        </form>

        <button
          type="button"
          onClick={() => window.location.assign("/login")}
          className="mt-2 w-full h-11 text-sm text-muted hover:text-fg"
        >
          {t("invite_sent_back")}
        </button>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="font-serif text-3xl tracking-tight text-fg">
        {t("invite_title")}
      </h1>
      <p className="mt-2 text-sm text-muted whitespace-pre-line">
        {t("invite_subtitle")}
      </p>

      <form
        action={formAction}
        className="mt-8 space-y-4"
        suppressHydrationWarning
      >
        <IstokField
          label={t("invite_email_label")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          required
          placeholder={t("invite_email_placeholder")}
        />
        {state.errorKey && (
          <p className="text-xs text-danger" role="alert">
            {t(state.errorKey)}
          </p>
        )}
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? t("invite_sending") : t("invite_verify")}
        </PrimaryButton>
        <p className="text-xs text-subtle text-center">{t("invite_help")}</p>
      </form>

      {/* Language picker out-of-the-way at the foot — matches iOS Welcome. */}
      <div className="mt-10 flex justify-center">
        <LangToggle lang={lang} />
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh px-6 py-10 max-w-sm mx-auto flex flex-col">
      <header className="flex justify-center mb-12">
        <LogoMark />
      </header>
      {children}
    </main>
  );
}
