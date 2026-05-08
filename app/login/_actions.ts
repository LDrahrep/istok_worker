"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { type LangKey } from "@/lib/i18n";

export type LoginFormState = {
  /** i18n key for an inline error message, or null when nothing to show. */
  errorKey?: LangKey | null;
  /** Email we just sent the link to — used to render the "check your inbox" view. */
  sentTo?: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMagicLink(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = (formData.get("email")?.toString() ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { errorKey: "invite_error_invalid_email" };
  }

  // Build the absolute URL the magic-link should bring the user back to.
  // headers() is request-scoped, so this works even on a Vercel preview URL.
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const redirectTo = `${proto}://${host}/auth/callback`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      // Workers must already exist in `employees` — we don't auto-create
      // Supabase users for unknown emails. Admin-side onboarding is the
      // gatekeeper.
      shouldCreateUser: false,
    },
  });

  if (error) {
    // Supabase returns a generic message for "user not found" — surface our
    // friendlier i18n string instead.
    if (/not found|signups not allowed/i.test(error.message)) {
      return { errorKey: "invite_error_not_found", sentTo: null };
    }
    return { errorKey: "invite_error_send_failed", sentTo: null };
  }

  return { sentTo: email, errorKey: null };
}
