// Magic-link landing route. Supabase's email link comes back as
//   /auth/callback?code=<one-time-code>
// We exchange the code for a session (sets the auth cookies) and then
// drop the user at `/` — the root resolver decides whether to send them
// to onboarding/waiting/main based on their employee row.
//
// Errors (`?error_description=...`) are surfaced as a query param the
// login page can render; we keep them out of the URL we redirect to so
// no PII leaks if the user copies it.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const errorDescription = url.searchParams.get("error_description");
  const next = url.searchParams.get("next") || "/";

  if (errorDescription) {
    const back = new URL("/login", url.origin);
    back.searchParams.set("error", errorDescription);
    return NextResponse.redirect(back);
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const back = new URL("/login", url.origin);
    back.searchParams.set("error", error.message);
    return NextResponse.redirect(back);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
