import type { LucideIcon } from 'lucide-react';
import {
  BarChart3, Bell, BriefcaseBusiness, CircleDollarSign, FileCheck2, GraduationCap,
  House, LayoutDashboard, Megaphone, MessageCircle, ReceiptText, Search, Settings,
  UserRound, UsersRound, WalletCards,
} from 'lucide-react';

export type ProductSurface = 'creator' | 'brand' | 'admin';
export type NavigationItem = { label: string; href: string; icon: LucideIcon; release?: 'V2' };

export const dashboardNavigation: Record<ProductSurface, NavigationItem[]> = {
  creator: [
    { label: 'Visão geral', href: '/app', icon: House },
    { label: 'Descobrir', href: '/app/opportunities', icon: Search },
    { label: 'Minhas campanhas', href: '/app/campaigns', icon: BriefcaseBusiness },
    { label: 'Análises', href: '/app/analytics', icon: BarChart3 },
    { label: 'Ganhos', href: '/app/earnings', icon: CircleDollarSign },
    { label: 'Indicações', href: '/app/referrals', icon: UsersRound },
    { label: 'Comunidade', href: '/app/community', icon: MessageCircle, release: 'V2' },
    { label: 'Academia', href: '/app/academy', icon: GraduationCap, release: 'V2' },
  ],
  brand: [
    { label: 'Visão geral', href: '/brand', icon: House },
    { label: 'Campanhas', href: '/brand/campaigns', icon: Megaphone },
    { label: 'Descobrir criadores', href: '/brand/creators', icon: Search },
    { label: 'Análises', href: '/brand/analytics', icon: BarChart3 },
    { label: 'Faturamento', href: '/brand/billing', icon: ReceiptText },
    { label: 'Configurações', href: '/brand/settings', icon: Settings },
  ],
  admin: [
    { label: 'Centro de controle', href: '/admin', icon: LayoutDashboard },
    { label: 'Criadores', href: '/admin/creators', icon: UsersRound },
    { label: 'Marcas', href: '/admin/brands', icon: BriefcaseBusiness },
    { label: 'Campanhas', href: '/admin/campaigns', icon: Megaphone },
    { label: 'Revisão de conteúdo', href: '/admin/content', icon: FileCheck2 },
    { label: 'Financeiro', href: '/admin/finance', icon: WalletCards },
    { label: 'Análises', href: '/admin/analytics', icon: BarChart3 },
  ],
};

export const creatorAccountNavigation: NavigationItem[] = [
  { label: 'Perfil', href: '/app/profile', icon: UserRound },
  { label: 'Notificações', href: '/app/notifications', icon: Bell },
  { label: 'Configurações', href: '/app/settings', icon: Settings, release: 'V2' },
];
