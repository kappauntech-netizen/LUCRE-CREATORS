import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from './empty-state';

export function WorkspacePage({ eyebrow, title, description, icon, emptyTitle, emptyDescription, v2 = false }: { eyebrow: string; title: string; description: string; icon: LucideIcon; emptyTitle: string; emptyDescription: string; v2?: boolean }) {
  return (
    <section className="workspace-page">
      <div className="dashboard-page-heading"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{v2 && <Badge>PLANO V2</Badge>}</div>
      <div className="workspace-panel"><EmptyState icon={icon} title={emptyTitle} description={emptyDescription} /></div>
    </section>
  );
}
