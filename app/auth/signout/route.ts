// Sign out route. POST → clears the Supabase session cookies and redirects
// back to /login. Used by the Profile screen's sign-out button (Module 11)
// and handy during dev for swapping accounts.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url), {
    // 303 ensures the browser follows up with a GET, not another POST.
    status: 303,
  });
}
