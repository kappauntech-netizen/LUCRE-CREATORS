'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

export function Progress({ value = 0, className, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const normalized = Math.max(0, Math.min(100, value ?? 0));
  return <ProgressPrimitive.Root className={cn('ui-progress', className)} value={normalized} {...props}><ProgressPrimitive.Indicator className="ui-progress-indicator" style={{ transform: `translateX(-${100 - normalized}%)` }} /></ProgressPrimitive.Root>;
}
