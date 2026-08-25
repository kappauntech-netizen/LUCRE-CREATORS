'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3, Bell, BriefcaseBusiness, HandCoins, House, Inbox, LogOut, Megaphone,
  PanelLeftClose, Plus, Search, ShieldCheck, Sparkles, UserRound, UsersRound,
} from 'lucide-react';
import { BrandLockup } from '@/components/brand-lockup';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { creatorAccountNavigation, dashboardNavigation, type ProductSurface } from '@/config/dashboard-navigation';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/language-selector';

const surfaceMeta: Record<ProductSurface, { root: string; eyebrow: string; title: string; aria: string; role: string }> = {
  creator: { root: '/app', eyebrow: 'ESPAÇO DO CRIADOR', title: 'Meu negócio', aria: 'Área do criador', role: 'Criador' },
  brand: { root: '/brand', eyebrow: 'ESPAÇO DA MARCA', title: 'Área de campanhas', aria: 'Área da marca', role: 'Equipe da marca' },
  admin: { root: '/admin', eyebrow: 'OPERAÇÕES LUCRE', title: 'Centro de controle', aria: 'Administração Lucre', role: 'Equipe Lucre' },
};

export function DashboardShell({ surface, identity, preview, children }: { surface: ProductSurface; identity: string; preview: boolean; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = dashboardNavigation[surface];
  const meta = surfaceMeta[surface];
  const initials = identity.slice(0, 2).toUpperCase();
  const isCurrent = (href: string) => pathname === href || (href !== meta.root && pathname.startsWith(`${href}/`));

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo"><BrandLockup href={meta.root} compact /><PanelLeftClose size={17} /></div>
        <div className="workspace-switcher">
          <span>{surface === 'creator' ? <Sparkles size={16} /> : <ShieldCheck size={16} />}</span>
          <div><small>{meta.eyebrow}</small><strong>{meta.title}</strong></div>
        </div>
        <nav className="dashboard-nav" aria-label={meta.aria}>
          <small>ÁREA DE TRABALHO</small>
          {navigation.map((item) => item.release === 'V2' ? (
            <span className="nav-item nav-item--disabled" key={item.label}><item.icon size={17} /><b>{item.label}</b><em>V2</em></span>
          ) : (
            <Link className={cn('nav-item', isCurrent(item.href) && 'nav-item--active')} href={item.href} key={item.label}><item.icon size={17} /><b>{item.label}</b></Link>
          ))}
          {surface === 'creator' && <><small>CONTA</small>{creatorAccountNavigation.map((item) => item.release === 'V2' ? <span className="nav-item nav-item--disabled" key={item.label}><item.icon size={17} /><b>{item.label}</b><em>V2</em></span> : <Link className={cn('nav-item', isCurrent(item.href) && 'nav-item--active')} href={item.href} key={item.label}><item.icon size={17} /><b>{item.label}</b></Link>)}</>}
        </nav>
        <div className="sidebar-profile">
          <Avatar><AvatarFallback>{initials}</AvatarFallback></Avatar>
          <div><strong>{identity}</strong><small>{preview ? 'Modo de prévia' : meta.role}</small></div>
          {!preview && <button onClick={logout} aria-label="Sair"><LogOut size={15} /></button>}
        </div>
      </aside>

      <div className="dashboard-content">
        <header className="dashboard-topbar">
          <div className="dashboard-context"><small>LUCRE CREATORS</small><strong>{meta.aria}</strong></div>
          <div className="dashboard-search"><Search size={16} /><span>Buscar na plataforma</span><kbd>⌘ K</kbd></div>
          <div className="dashboard-actions">
            {preview && <span className="demo-badge">PRÉVIA · SEM DADOS REAIS</span>}
            <LanguageSelector compact />
            <button className="icon-button icon-button--compact" aria-label="Notificações"><Bell size={17} /></button>
            <ThemeToggle compact />
            <Avatar className="dashboard-avatar"><AvatarFallback>{initials}</AvatarFallback></Avatar>
          </div>
        </header>
        <div className="dashboard-main">{children}</div>
      </div>

      <nav className="mobile-tabbar" aria-label="Navegação mobile">
        {surface === 'creator' && <>
          <Link className={cn(pathname === '/app' && 'active')} href="/app"><House /><span>Início</span></Link>
          <Link className={cn(pathname.includes('opportunities') && 'active')} href="/app/opportunities"><Search /><span>Descobrir</span></Link>
          <Link className="mobile-action" href="/app/opportunities"><Plus /></Link>
          <Link className={cn(pathname.includes('notifications') && 'active')} href="/app/notifications"><Inbox /><span>Caixa de entrada</span></Link>
          <Link className={cn(pathname.includes('profile') && 'active')} href="/app/profile"><UserRound /><span>Perfil</span></Link>
        </>}
        {surface === 'brand' && <>
          <Link className={cn(pathname === '/brand' && 'active')} href="/brand"><House /><span>Início</span></Link>
          <Link className={cn(pathname.includes('campaigns') && 'active')} href="/brand/campaigns"><Megaphone /><span>Campanhas</span></Link>
          <Link className="mobile-action" href="/brand/campaigns/new"><Plus /></Link>
          <Link className={cn(pathname.includes('creators') && 'active')} href="/brand/creators"><UsersRound /><span>Criadores</span></Link>
          <Link className={cn(pathname.includes('analytics') && 'active')} href="/brand/analytics"><BarChart3 /><span>Análises</span></Link>
        </>}
        {surface === 'admin' && <>
          <Link className={cn(pathname === '/admin' && 'active')} href="/admin"><House /><span>Início</span></Link>
          <Link className={cn(pathname.includes('creators') && 'active')} href="/admin/creators"><UsersRound /><span>Criadores</span></Link>
          <Link className="mobile-action" href="/admin/campaigns"><Plus /></Link>
          <Link className={cn(pathname.includes('campaigns') && 'active')} href="/admin/campaigns"><BriefcaseBusiness /><span>Campanhas</span></Link>
          <Link className={cn(pathname.includes('finance') && 'active')} href="/admin/finance"><HandCoins /><span>Financeiro</span></Link>
        </>}
      </nav>
    </div>
  );
}
