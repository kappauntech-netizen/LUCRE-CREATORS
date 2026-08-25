import type { ProductSurface } from '@/config/dashboard-navigation';
import { roles, type AppRole } from '@/lib/roles';

export const permissions = [
  'creator:access', 'creator:read_self', 'creator:update_self', 'creator:manage',
  'brand:access', 'brand:read_self', 'brand:update_self', 'brand:manage',
  'campaign:read_public', 'campaign:apply', 'campaign:manage_self', 'campaign:manage_all',
  'content:submit', 'content:review', 'content:moderate',
  'payment:read_self', 'payment:manage',
  'referral:read_self', 'referral:manage',
  'analytics:read_self', 'analytics:read_brand', 'analytics:read_all',
  'community:participate', 'community:moderate',
  'academy:participate', 'academy:manage',
  'admin:access', 'settings:manage', 'roles:manage', 'audit:read',
] as const;

export type Permission = (typeof permissions)[number];

const creatorPermissions: Permission[] = [
  'creator:access', 'creator:read_self', 'creator:update_self', 'campaign:read_public',
  'campaign:apply', 'campaign:manage_self', 'content:submit', 'payment:read_self',
  'referral:read_self', 'analytics:read_self', 'community:participate', 'academy:participate',
];

const brandPermissions: Permission[] = [
  'brand:access', 'brand:read_self', 'brand:update_self', 'creator:read_self',
  'campaign:read_public', 'campaign:manage_self', 'content:review', 'analytics:read_brand',
];

export const rolePermissions: Record<AppRole, readonly Permission[]> = {
  SUPER_ADMIN: permissions,
  ADMIN: permissions.filter((permission) => permission !== 'roles:manage'),
  OPERATIONS: ['admin:access', 'creator:manage', 'brand:manage', 'campaign:manage_all', 'content:review', 'referral:manage', 'analytics:read_all'],
  CREATOR_MANAGER: ['admin:access', 'creator:manage', 'campaign:read_public', 'content:review', 'referral:manage', 'analytics:read_all'],
  CAMPAIGN_MANAGER: ['admin:access', 'brand:manage', 'campaign:manage_all', 'content:review', 'analytics:read_all'],
  FINANCE: ['admin:access', 'brand:read_self', 'campaign:read_public', 'payment:manage', 'referral:manage', 'analytics:read_all', 'audit:read'],
  MODERATOR: ['admin:access', 'content:moderate', 'community:moderate', 'academy:manage'],
  CREATOR: creatorPermissions,
  BRAND: brandPermissions,
};

export const surfacePermission: Record<ProductSurface, Permission> = {
  creator: 'creator:access', brand: 'brand:access', admin: 'admin:access',
};

export function hasPermission(role: AppRole | null | undefined, permission: Permission) {
  return Boolean(role && rolePermissions[role]?.includes(permission));
}

export function canAccessSurface(role: AppRole | null | undefined, surface: ProductSurface) {
  if (surface === 'brand' && role && hasPermission(role, 'admin:access')) return true;
  return hasPermission(role, surfacePermission[surface]);
}

export function getHomeForRole(role: AppRole | null | undefined) {
  if (role && hasPermission(role, 'admin:access')) return '/admin';
  if (role && hasPermission(role, 'brand:access')) return '/brand';
  return '/app';
}

export function validatePermissionMatrix() {
  return roles.every((role) => Array.isArray(rolePermissions[role]));
}
