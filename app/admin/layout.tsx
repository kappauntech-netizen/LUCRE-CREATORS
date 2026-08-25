import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { requireSurface } from '@/features/auth/guard';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSurface('admin');

  const identity = session.profile?.full_name || session.profile?.username || 'Administração Lucre';
  return <DashboardShell surface="admin" identity={identity} preview={!session.configured}>{children}</DashboardShell>;
}
