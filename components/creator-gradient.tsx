import { cn } from '@/lib/utils';

export function CreatorGradient({ as: Component = 'span', className, children }: { as?: 'span' | 'div'; className?: string; children?: React.ReactNode }) {
  return <Component className={cn('creator-gradient', className)}>{children}</Component>;
}
