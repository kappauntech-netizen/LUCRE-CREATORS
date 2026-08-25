import { redirect } from 'next/navigation';
import type { ProductSurface } from '@/config/dashboard-navigation';
import { getSessionContext } from '@/lib/auth/session';
import { canAccessSurface, getHomeForRole } from './permissions';

export async function requireSurface(surface: ProductSurface) {
  const session = await getSessionContext();
  if (!session.configured) return session;
  if (!session.user) redirect('/login');
  if (!canAccessSurface(session.profile?.role, surface)) redirect(getHomeForRole(session.profile?.role));
  return session;
}
