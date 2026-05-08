import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Worker app: only `tech` employees should reach the (app) layout. The
// auth-only check lives here to avoid extra SELECTs on every request; role
// enforcement happens in the (app) layout via `requireWorker()`.
//
// Public routes that bypass the auth gate:
// - /login              → magic-link form
// - /auth               → Supabase OAuth/magic-link callback
// - /apply              → friend-invite acceptance flow (no session yet)
// - /dev                → design-system kitchen sink; pages 404 in production
const PUBLIC_PATHS = ["/login", "/auth", "/apply", "/dev"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not insert code between createServerClient and getUser —
  // cookies must be flushed before we read auth state.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
