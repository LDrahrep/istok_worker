# Rules — istok-worker

Hard rules. Break only with explicit user consent. Architecture context →
[AGENTS.md](AGENTS.md).

## Dependencies

- **Do not introduce** zod / yup / valibot / react-hook-form. Validation is
  manual in `_actions.ts` via `lib/form-helpers.ts` (mirror `istok-admin`).
- **Do not introduce** shadcn/ui, radix, headlessui. Build form/UI primitives
  by hand under `components/`.
- **Do not use** cn / clsx / classnames. Template strings in `className`.
- **Do not add** a light theme or toggle. Project is dark-only.
- Any new dependency in `package.json` requires explicit user approval.

## Server actions

- `create*` and `update*` end with `redirect("/<entity>")` to the list, **not**
  the form.
- After a mutation, call `revalidatePath()` for every relevant route (list +
  detail). Use a helper similar to `istok-admin`'s `logAndRevalidate`.
- No service-role client lives in this repo. Mutations operate within RLS.
- Each mutation that affects shared state should write an audit row through
  the Supabase admin app's audit pipeline — keep the contract aligned.

## Auth

- **Magic-link only.** Mirrors iOS exactly. Do **not** copy the OTP form
  from `istok-admin`.
- Callback at `/auth/callback` calls `exchangeCodeForSession`. Then re-fetch
  the employee row and route based on status (welcome → invite → onboarding
  → waiting → main).
- Only `tech` / `teamlead` reach the (app) layout. Admins redirect to
  `NEXT_PUBLIC_ADMIN_URL`.
- Don't store auth tokens anywhere outside `@supabase/ssr` cookies.

## DB and roles

- `employees.role` is a Postgres ENUM `public.user_role`. New value =
  `ALTER TYPE` migration **and** `ROLE_VALUES` update in `lib/roles.ts`. No
  CHECK/TEXT.
- This repo does **not** own schema migrations. Migrations live in
  `istok-admin/supabase/migrations/`. If a worker-only feature needs a new
  table or column, the migration goes there too.

## Forms and UI

- `useActionState` in `_form.tsx` (client component). Don't extract into
  custom hooks unless multiple forms share state shape.
- Inline errors: `state.fieldErrors?.[fieldName]`. No alternate formats.
- Color tokens: only via `@theme` in `app/globals.css` (`--color-*`). No
  hex/rgb directly in JSX.

## i18n (Module 3+)

- Every UI string must go through `L("key")` (see Module 3). Hardcoded
  Russian/English in views is forbidden.
- `Localization/{en,ru}/Localizable.strings` ports from iOS — keys must
  stay in sync with iOS counts.
- `LangToggle` switches at runtime; persist user choice in localStorage +
  cookie (cookie for SSR).

## Theme parity with iOS

- `app/globals.css` mirrors `iOS/Theme/ObsidianTheme.swift`. When iOS bumps
  a token, propagate here and to `istok-admin/app/globals.css` in the same
  change.
- `Components/IstokIcon` brand icons port to `components/icons/<name>.tsx`
  as inline SVG — same paths, no PNG.
- `TopBar`'s ZStack-centered title pattern translates to a 3-column CSS
  grid. The middle cell is the title; left and right cells host controls.
  HStack-with-Spacers visually drifts when only one side has a control —
  do not reproduce.

## Workflow

- Don't mark work done without `npm run lint && npm run typecheck`
  (both green) plus a manual browser pass for any UI change.
- Never run destructive git (`reset --hard`, `push --force`, `branch -D`)
  without explicit consent.
- Don't touch Supabase via Dashboard — go through `istok-admin/supabase/migrations/`.
- Don't commit `.env.local`, anon/service-role keys, or any secret.

## PWA-specific (Module 15)

- Service worker scope must be the whole app (`/sw.js` at root, scope `/`).
- Web Push subscription save goes into the same `device_tokens` table the
  iOS app uses, with `platform = 'web'`. Pair the admin push pipeline so
  one inbox-message event fans out to APNs (iOS) + Web Push (Android).
- `manifest.webmanifest` icons port from `iOS/Assets.xcassets` to
  `public/icons/`. Don't ship low-res sources.

## Architecture and debugging

- Respect layer boundaries: `app/` UI/routing, `components/` primitives,
  `lib/` domain logic, no cross-mixing.
- When chasing a bug, work from real logs and observed behavior in the
  browser preview. Don't fix hypothetical scenarios — reproduce first.
