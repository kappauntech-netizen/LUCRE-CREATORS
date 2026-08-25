import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <article className={cn('ui-card', className)} {...props} />;
}
