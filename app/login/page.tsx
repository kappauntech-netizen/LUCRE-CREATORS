import Link from 'next/link';
import { ArrowLeft, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLockup } from '@/components/brand-lockup';
import { ThemeToggle } from '@/components/theme-toggle';
import { LoginForm } from '@/components/forms/login-form';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { LanguageSelector } from '@/components/language-selector';

export default function LoginPage() {
  const configured = isSupabaseConfigured();
  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="auth-story-top"><BrandLockup /><Link href="/"><ArrowLeft size={16} /> Voltar</Link></div>
        <div className="auth-story-copy">
          <span className="eyebrow"><Sparkles size={15} /> SEU NEGÓCIO COMO CRIADOR</span>
          <h1>Uma infraestrutura<br /><em>para a sua carreira.</em></h1>
          <p>Oportunidades, campanhas, conteúdo, desempenho e ganhos organizados em uma experiência profissional.</p>
        </div>
        <div className="auth-story-features">
          <span><Layers3 size={17} /> Operação centralizada</span>
          <span><ShieldCheck size={17} /> Dados e acesso protegidos</span>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-panel-top"><LanguageSelector compact /><ThemeToggle /></div>
        <div className="auth-panel-inner">
          <span className="eyebrow">BEM-VINDO DE VOLTA</span>
          <h2>Entre na Lucre.</h2>
          <p>Use suas credenciais para acessar o ambiente correto.</p>
          <LoginForm configured={configured} />
        </div>
        <small>Rede de comércio com criadores · Acesso protegido</small>
      </section>
    </main>
  );
}
