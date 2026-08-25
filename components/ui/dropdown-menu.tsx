'use client';

import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;

export function DropdownMenuContent({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Content>) {
  return <DropdownPrimitive.Portal><DropdownPrimitive.Content sideOffset={8} className={cn('ui-dropdown-content', className)} {...props} /></DropdownPrimitive.Portal>;
}

export function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Item>) {
  return <DropdownPrimitive.Item className={cn('ui-dropdown-item', className)} {...props} />;
}

export function DropdownMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof DropdownPrimitive.CheckboxItem>) {
  return <DropdownPrimitive.CheckboxItem className={cn('ui-dropdown-item', className)} {...props}><span className="ui-dropdown-check"><DropdownPrimitive.ItemIndicator><Check size={13} /></DropdownPrimitive.ItemIndicator></span>{children}</DropdownPrimitive.CheckboxItem>;
}

export const DropdownMenuSeparator = DropdownPrimitive.Separator;
export const DropdownMenuLabel = DropdownPrimitive.Label;
