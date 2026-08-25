import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: string }) {
  return (
    <div className="empty-state">
      <span><Icon size={22} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <button type="button">{action}</button>}
    </div>
  );
}
