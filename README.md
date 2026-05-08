# istok-worker

PWA-mirror of the **ISTOK One** iOS app, for workers on Android (and any
other browser-equipped device). Same Supabase backend, same design system,
feature parity with the worker side of iOS.

Admins use [istok-admin](https://github.com/headlinerten/ISTOK-admin) on
desktop. iOS users keep the native app at [headlinerten/ISTOK-One].

## Stack

- Next.js 16 App Router · React 19 · TypeScript strict
- Tailwind CSS v4 (dark-only), tokens mirroring `iOS/Theme/ObsidianTheme`
- Supabase (`@supabase/ssr` + `@supabase/supabase-js`) — magic-link auth
- No zod, no shadcn, no clsx (matching `istok-admin` rules)

## Commands

```bash
npm install
npm run dev         # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

## Roadmap

15 modules, see `docs/MODULES.md`. Module 0 (this commit) is the bare
scaffold; auth/onboarding/main shell follow.

## Environment

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ADMIN_URL=https://istok-admin.vercel.app   # optional
```

The service-role key is **not** used here — the worker app reads/writes
through anon + RLS only. If a server action ever needs elevated access,
introduce it explicitly behind a server-only module.
