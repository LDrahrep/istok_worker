# Module roadmap — istok-worker

15 modules toward feature parity with the worker-side of `headlinerten/ISTOK-One`
(iOS). Each row maps the iOS source, the web equivalent, and the deliverable.

| # | Name | iOS source | Web deliverable | Acceptance |
|---|---|---|---|---|
| 0 | Scaffolding | — | Next.js 16 + Tailwind v4 + Supabase SSR skeleton, magic-link stubs, role-aware middleware, mirror `istok-admin` patterns. | `npm run dev` boots; signed-in worker sees a placeholder welcome message; admin redirects out. |
| 1 | Theme + tokens | `Theme/{ObsidianTheme,Color+Hex,Typography,AppTints}.swift` | Already in place via `globals.css` mirror; this module adds typography utilities + `AppTints` partner accents. | Color/spacing visual parity vs iOS screenshots. |
| 2 | Component library | `Components/` (37 widgets) | `components/` + `components/{Apps,Dashboard,Hotel,Profile,Project,TabBar,Error}/` — port one-by-one. | `/_kitchen-sink` page renders all primitives identical to iOS Reference. |
| 3 | i18n | `Localization/{en,ru}.lproj/Localizable.strings` (236 keys × 2) | `lib/i18n.ts` with key-map + cookie/localStorage persistence + `LangToggle`. | `LangToggle` flips RU/EN live; no hardcoded strings remain. |
| 4 | Auth + middleware | `Services/SupabaseService.swift`, `App/State/AuthCoordinator.swift` | Full `/login` magic-link form; `/auth/callback` → `exchangeCodeForSession`; role enforcement in `(app)` layout. | Worker can sign in with magic-link; admins bounce out. |
| 5 | Routing state machine | `App/AppRoute.swift`, `App/State/RoutingState.swift` | Server resolver in `app/page.tsx` decides among welcome / invite / onboarding / waiting / main based on `auth + employees.status`. | Five terminal states render correct UIs. |
| 6 | Onboarding | `Screens/Onboarding/`, `Screens/Worker/Onboarding/`, `Models/OnboardingDraft.swift` | 5-step wizard with `OnboardingDraft` (localStorage + server save), Welcome/Invite/Waiting screens, Web Push permission primer. | New user completes 5 steps → moves to waiting. |
| 7 | Main shell + tab bar | `MainTabs/MainShell.swift`, `Components/TabBar/` | App layout with floating bottom tab bar (Dashboard / Hotel / Project / Inbox / Profile) + realtime employee subscription + ErrorBus toast host. | Tabs route correctly; ErrorBus surfaces a real error from a forced repo call. |
| 8 | Dashboard | `Screens/Worker/DashboardScreen.swift`, `Components/Dashboard/`, `Models/{ResolvedShift,ScheduleResolutionState,DashboardLayout,ShiftSchedule}.swift` | ResolvedShift logic, ScheduleToday, BriefingStats, CrewStrip, PayWeekCard, HubQuickActions, AppsSection, draggable layout picker. | Real shift renders + layout reorders persist. |
| 9 | Hotel | `Screens/Worker/HotelScreen.swift`, `Components/Hotel/`, `Services/Hotel/HotelImageService.swift` | HotelImageView with priority chain (`photo_url` → Leaflet/MapTiler snapshot → fallback icon), roommates, address. | Worker sees their hotel + roommates + map. |
| 10 | Project | `Screens/Worker/ProjectScreen.swift`, `Components/Project/HourlyRateCard.swift`, `Models/ProjectStatus.swift`, `Services/Repositories/{Project,EmployeeProjects}*` | Project info, schedule, crew list, hourly-rate card. | All assigned projects accessible with status, rate, crew. |
| 11 | Profile | `Screens/Worker/ProfileScreen.swift`, `Components/Profile/`, `Models/Person.swift` | Personal data view + limited self-edit, language toggle, sign out, dashboard layout picker, vibration toggle (web `navigator.vibrate`). | Self-edits persist; sign-out clears cookies. |
| 12 | Inbox | `Screens/Worker/{Inbox,InboxMessageDetail}*.swift`, `Models/InboxMessage.swift`, `Services/Repositories/InboxRepository.swift` | Messages list, detail sheet, unread badge, mark-as-read, realtime new arrivals, system notification badge sync. | Admin push lands in inbox; badge updates live. |
| 13 | Invite Friend | `Screens/Worker/{InviteFriend,MyInvitations}Screen.swift`, `Models/Roommate.swift`, `Services/Repositories/FriendApplicationRepository.swift` | Generate invite link with token, list own invites + statuses. | Friend receives URL → completes onboarding → admin sees in `applications`. |
| 14 | Support Chat | `Screens/Worker/SupportChatScreen.swift`, `Services/Repositories/EmployeeMessageRepository.swift` | Two-way chat worker ↔ admin. Pairs with the `requests` UI already in `istok-admin` (commit `4499c82`). Realtime + optimistic send. | Worker can chat with admin; messages land both ways realtime. |
| 15 | PWA + Push + Telemetry | `Services/Push/`, `Services/Telemetry/Telemetry.swift` | Service worker, `manifest.webmanifest`, Add-to-Home prompt, Web Push subscription + save into `device_tokens`, Sentry + PostHog browser SDKs. Pair admin's APNs send to also fan out Web Push. | "Add to Home Screen" works on Android; push lands; Sentry catches synthetic error. |

## Dependency graph

```
0 ──┬─→ 1 ──→ 2 ──┬─→ 4 ──→ 5 ──→ 6 ──→ 7 ──┬─→ 8  Dashboard
    │              │                          ├─→ 9  Hotel
    └─→ 3 (i18n) ──┘                          ├─→ 10 Project
                                              ├─→ 11 Profile
                                              ├─→ 12 Inbox
                                              ├─→ 13 Invite
                                              └─→ 14 Chat
                                                     │
                                                     └─→ 15 PWA + Push + Telemetry
```

8–14 parallelize after 7 lands.

## Open decisions

- **Repo owner / name** — `headlinerten/istok-worker` (consistent with admin)
  vs separate fork. Default assumption: `headlinerten/istok-worker`.
- **Domain** — `worker.istok.app` (separate hostname, clean cookies) vs
  sub-path of admin. Default: subdomain.
- **Push pairing** — extend the existing `device_tokens` table with a
  `platform = 'web'` row vs new `web_push_subscriptions` table. Default:
  the existing table; less schema noise.
