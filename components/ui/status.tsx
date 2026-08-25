import { cn } from '@/lib/utils';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export function Status({ tone = 'neutral', children, className }: { tone?: StatusTone; children: React.ReactNode; className?: string }) {
  return <span className={cn('ui-status', `ui-status--${tone}`, className)}><i />{children}</span>;
}
