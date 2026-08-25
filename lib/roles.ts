export const roles = [
  'SUPER_ADMIN',
  'ADMIN',
  'OPERATIONS',
  'CREATOR_MANAGER',
  'CAMPAIGN_MANAGER',
  'FINANCE',
  'MODERATOR',
  'CREATOR',
  'BRAND',
] as const;

export type AppRole = (typeof roles)[number];

export const adminRoles = new Set<AppRole>([
  'SUPER_ADMIN',
  'ADMIN',
  'OPERATIONS',
  'CREATOR_MANAGER',
  'CAMPAIGN_MANAGER',
  'FINANCE',
  'MODERATOR',
]);

export function isAdminRole(role: string | null | undefined): role is AppRole {
  return Boolean(role && adminRoles.has(role as AppRole));
}
