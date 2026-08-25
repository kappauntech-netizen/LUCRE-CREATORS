import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { requireSurface } from '@/features/auth/guard';

export const dynamic = 'force-dynamic';

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSurface('creator');

  const identity = session.profile?.full_name || session.profile?.username || 'Prévia do criador';
  return <DashboardShell surface="creator" identity={identity} preview={!session.configured}>{children}</DashboardShell>;
}
