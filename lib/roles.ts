// Mirror of `istok-admin/lib/roles.ts` and the iOS `Models/UserRole.swift`.
// Keep in sync — `employees.role` is a Postgres ENUM, source of truth is the
// `public.user_role` type.

export const ROLE_VALUES = ["tech", "admin", "teamlead"] as const;

export type EmployeeRole = (typeof ROLE_VALUES)[number];

export function isWorkerRole(role: string | null | undefined): boolean {
  return role === "tech" || role === "teamlead";
}

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin";
}
