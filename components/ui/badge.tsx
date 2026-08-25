import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('ui-badge', className)}>{children}</span>;
}
