import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandLockup } from '@/components/brand-lockup';

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div>
        <BrandLockup />
        <p>Influência transformada em crescimento mensurável.</p>
      </div>
      <div className="footer-links">
        <Link href="/apply">Criadores <ArrowUpRight size={14} /></Link>
        <Link href="/brands">Marcas <ArrowUpRight size={14} /></Link>
        <Link href="/login">Entrar <ArrowUpRight size={14} /></Link>
      </div>
      <small>© 2026 Lucre Creators. Todos os direitos reservados.</small>
    </footer>
  );
}
