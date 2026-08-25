import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { requireSurface } from '@/features/auth/guard';

export const dynamic = 'force-dynamic';

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSurface('brand');
  const identity = session.organization?.name || session.profile?.full_name || 'Prévia da marca';
  return <DashboardShell surface="brand" identity={identity} preview={!session.configured}>{children}</DashboardShell>;
}
