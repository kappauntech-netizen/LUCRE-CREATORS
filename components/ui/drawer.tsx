'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './dialog';

export const Drawer = Dialog;
export const DrawerTrigger = DialogTrigger;
export const DrawerClose = DialogClose;

export function DrawerContent(props: React.ComponentProps<typeof DialogContent>) {
  return <DialogContent {...props} className={`ui-drawer-content ${props.className ?? ''}`} />;
}

export const DrawerTitle = DialogTitle;
export const DrawerDescription = DialogDescription;
