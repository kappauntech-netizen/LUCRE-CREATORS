import { ArrowLeft, BarChart3, Crosshair, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { BrandLockup } from '@/components/brand-lockup';
import { ThemeToggle } from '@/components/theme-toggle';
import { BrandLeadForm } from '@/components/forms/brand-lead-form';
import { LanguageSelector } from '@/components/language-selector';

export default function BrandsPage() {
  return (
    <main className="form-page form-page--brands">
      <header className="form-page-header"><BrandLockup /><div><LanguageSelector compact /><ThemeToggle /><Link href="/"><ArrowLeft size={16} /> Voltar</Link></div></header>
      <div className="form-page-grid">
        <aside className="form-page-intro">
          <span className="eyebrow"><Sparkles size={15} /> PARA MARCAS</span>
          <h1>Criadores certos.<br /><em>Resultado mensurável.</em></h1>
          <p>A Lucre transforma uma necessidade de campanha em curadoria, operação e aprendizado proprietário.</p>
          <ul>
            <li><Crosshair size={17} /> Compatibilidade orientada por aderência</li>
            <li><BarChart3 size={17} /> Desempenho acompanhado de ponta a ponta</li>
          </ul>
          <small>Na V1, a operação da marca é assistida pela equipe Lucre.</small>
        </aside>
        <section className="form-card"><BrandLeadForm /></section>
      </div>
    </main>
  );
}
