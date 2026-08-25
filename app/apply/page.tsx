import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { BrandLockup } from '@/components/brand-lockup';
import { ThemeToggle } from '@/components/theme-toggle';
import { CreatorApplicationForm } from '@/components/forms/creator-application-form';
import { LanguageSelector } from '@/components/language-selector';

export default function ApplyPage() {
  return (
    <main className="form-page">
      <header className="form-page-header"><BrandLockup /><div><LanguageSelector compact /><ThemeToggle /><Link href="/"><ArrowLeft size={16} /> Voltar</Link></div></header>
      <div className="form-page-grid">
        <aside className="form-page-intro">
          <span className="eyebrow"><Sparkles size={15} /> CANDIDATURA À REDE FUNDADORA</span>
          <h1>Sua influência pode<br /><em>se tornar um negócio.</em></h1>
          <p>Queremos conhecer sua identidade, sua audiência e o que você está pronto para construir.</p>
          <ul>
            <li><CheckCircle2 size={17} /> Oportunidades alinhadas ao seu perfil</li>
            <li><CheckCircle2 size={17} /> Operação e acompanhamento profissional</li>
            <li><CheckCircle2 size={17} /> Crescimento baseado em desempenho</li>
          </ul>
          <small>A candidatura não garante aprovação. A rede Lucre é curada.</small>
        </aside>
        <section className="form-card"><CreatorApplicationForm /></section>
      </div>
    </main>
  );
}
