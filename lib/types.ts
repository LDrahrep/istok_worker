// Shared domain types. Mirror of iOS Models/* — keep names aligned so we
// can grep both repos. This file holds plain enums; richer types like
// ResolvedShift, OnboardingDraft, InboxMessage land with their respective
// modules.

export const WORKER_STATUSES = ["active", "oncall", "inactive", "pending"] as const;
export type WorkerStatus = (typeof WORKER_STATUSES)[number];

export const APP_LANGUAGES = ["en", "ru"] as const;
export type AppLanguage = (typeof APP_LANGUAGES)[number];

export const MAIN_TABS = ["home", "hotel", "project", "profile"] as const;
export type MainTabKey = (typeof MAIN_TABS)[number];
