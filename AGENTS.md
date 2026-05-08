# istok-worker — agent context

PWA mirror of the **ISTOK One** iOS app for workers on Android (and any
browser). Same Supabase backend (`pjjttziuikhspfjgfnux`) shared with the
iOS app and `istok-admin`. **Admins do not belong here** — they use
desktop `istok-admin`. iOS workers stay on the native app; this repo is
for everyone else.

Hard rules → [rules.md](rules.md). This file is the orientation map.

## Stack

- **Next.js 16.2.4** App Router, React 19.2.4, server actions, route groups
- **TypeScript 5** strict; paths `@/*` → repo root
- **Tailwind CSS v4** (dark-only). Tokens mirror iOS `Theme/ObsidianTheme.swift`
  (kept in sync — when iOS bumps, web bumps).
- **Supabase** `@supabase/ssr` 0.10 + `@supabase/supabase-js` 2.104 with
  **magic-link** auth (matches iOS, **not** the OTP flow used by `istok-admin`).
- **No** zod / shadcn / radix / clsx. Matches `istok-admin/rules.md`.

## Module roadmap

15 modules planned. See [docs/MODULES.md](docs/MODULES.md) for the table
mapping each module to its iOS source files and acceptance criteria.

| # | Module | iOS source |
|---|---|---|
| 0 | Scaffolding (this) | — |
| 1 | Theme + design tokens | `Theme/` |
| 2 | Component library (37 widgets) | `Components/` |
| 3 | i18n (236 keys × RU/EN) | `Localization/` |
| 4 | Auth + middleware (magic-link, role gate) | `Services/SupabaseService.swift` |
| 5 | Routing state machine | `App/AppRoute.swift`, `App/State/RoutingState.swift` |
| 6 | Onboarding (5 steps) | `Screens/Onboarding/`, `Screens/Worker/Onboarding/` |
| 7 | Main shell + tab bar | `MainTabs/`, `Components/TabBar/` |
| 8 | Dashboard | `Screens/Worker/DashboardScreen.swift`, `Components/Dashboard/` |
| 9 | Hotel | `Screens/Worker/HotelScreen.swift`, `Components/Hotel/` |
| 10 | Project | `Screens/Worker/ProjectScreen.swift`, `Components/Project/` |
| 11 | Profile | `Screens/Worker/ProfileScreen.swift`, `Components/Profile/` |
| 12 | Inbox | `Screens/Worker/InboxScreen.swift` |
| 13 | Invite Friend / My Invitations | `Screens/Worker/{InviteFriend,MyInvitations}Screen.swift` |
| 14 | Support Chat | `Screens/Worker/SupportChatScreen.swift` |
| 15 | PWA + Web Push + Telemetry | `Services/Push/`, `Services/Telemetry/` |

## Commands

```bash
npm install
npm run dev         # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

No tests yet. Verification = lint + typecheck + manual check in browser.

## Layout (current scaffold)

```
app/
  layout.tsx          # Root layout, Inter cyrillic
  globals.css         # Tailwind v4 + @theme tokens (mirrors ObsidianTheme.swift)
  page.tsx            # Module 0 placeholder; Module 5 turns this into the
                      # AppRoute resolver (welcome → invite → onboarding → ...)
  login/page.tsx      # Module 0 placeholder; Module 4 wires magic-link
  auth/callback/      # Module 0 stub; Module 4 wires session exchange

lib/
  supabase/
    client.ts         # browser (createBrowserClient, ANON_KEY)
    server.ts         # server components/actions (createServerClient + cookie sync)
    middleware.ts     # auth-only check, role check is layout-level
  auth.ts             # getCurrentEmployee + requireWorker
  roles.ts            # ROLE_VALUES, isWorkerRole / isAdminRole

middleware.ts         # delegates to lib/supabase/middleware.updateSession
```

As modules land, expect new top-level pieces: `lib/i18n.ts`, `components/`,
`app/(app)/*` route group for the main shell, `app/onboarding/*`, etc.

## Auth

- **Magic-link** to mirror iOS exactly. The user submits an email at `/login`,
  Supabase emails them a link, the link returns to `/auth/callback?code=...`,
  we `exchangeCodeForSession`, and the cookie persists.
- Role gate: only `tech` / `teamlead`. Admins land on
  `NEXT_PUBLIC_ADMIN_URL` (default `https://istok-admin.vercel.app`).
- Middleware enforces "must be signed in"; layout enforces role. Avoids
  N×SELECTs per request. Module 4 confirms this split.

## Theme tokens

`globals.css` is a **direct mirror** of `istok-admin/app/globals.css`,
which is itself a direct mirror of `iOS/Theme/ObsidianTheme.swift`. Treat
the iOS file as source of truth; if you tweak a token here, propagate to
the admin repo and the iOS file in the same PR.

## Gotchas

- **No service-role key in this repo.** Workers operate within RLS.
  Anything that needs elevated access must go through `istok-admin` or a
  Supabase Edge Function — it does **not** belong here.
- **Magic-link, not OTP.** Don't copy the OTP form from `istok-admin`.
- **PWA work lives in Module 15.** Until then, `manifest.webmanifest` and
  `sw.js` are absent; the middleware matcher already excludes them so
  adding them later is one-file change.
- **Per-feature realtime:** every list/detail must subscribe to the
  matching Supabase table and `router.refresh()` on changes (Module 7
  centralizes the helper). The iOS app uses the "fetch + subscribe +
  2-second reconcile" pattern — Module 7 ports it.
- **Domain models in iOS are versioned in `SchemaVN.swift` (V1–V5).** Web
  doesn't have local persistence in MVP, so we don't replicate that
  versioning — DTOs talk straight to PostgREST. If we later add IndexedDB
  caching, mirror the iOS schema versions.
