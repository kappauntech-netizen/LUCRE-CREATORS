import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandLockup } from '@/components/brand-lockup';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/language-selector';

export function PublicHeader() {
  return (
    <header className="public-header">
      <BrandLockup />
      <nav className="header-nav" aria-label="Navegação principal">
        <Link href="/#como-funciona">Como funciona</Link>
        <Link href="/#marcas">Para marcas</Link>
        <Link href="/login">Entrar</Link>
      </nav>
      <div className="header-actions">
        <LanguageSelector compact />
        <ThemeToggle />
        <Link href="/apply" className="header-cta">Quero ser criador <ArrowUpRight size={16} /></Link>
      </div>
    </header>
  );
}
