'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, KeyRound, LoaderCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function passwordLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: form.get('identifier'), password: form.get('password') }),
      });
      const payload = await response.json() as { error?: string; destination?: string };
      if (!response.ok) throw new Error(payload.error || 'Não foi possível entrar.');
      router.push(payload.destination || '/app');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível entrar.');
    } finally { setLoading(false); }
  }

  async function magicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email') }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Não foi possível enviar o link.');
      toast.success('Link seguro enviado. Verifique seu e-mail.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível enviar o link.');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-form-wrap">
      {!configured && <div className="configuration-notice"><strong>Modo de prévia</strong><span>Conecte o Supabase para ativar senha, link por e-mail e Google.</span></div>}
      <Tabs defaultValue="password">
        <TabsList><TabsTrigger value="password"><KeyRound size={14} /> Senha</TabsTrigger><TabsTrigger value="magic"><Mail size={14} /> Link por e-mail</TabsTrigger></TabsList>
        <TabsContent value="password">
          <form className="auth-form" onSubmit={passwordLogin}>
            <label><span>Usuário ou e-mail</span><Input name="identifier" autoComplete="username" placeholder="seu@email.com" required /></label>
            <label><span>Senha</span><Input name="password" type="password" autoComplete="current-password" placeholder="••••••••••••" required /></label>
            <Button size="lg" type="submit" disabled={loading || !configured}>{loading ? <LoaderCircle className="spin" size={18} /> : <>Entrar na plataforma <ArrowRight size={18} /></>}</Button>
          </form>
        </TabsContent>
        <TabsContent value="magic">
          <form className="auth-form" onSubmit={magicLink}>
            <label><span>E-mail autorizado</span><Input name="email" type="email" autoComplete="email" placeholder="seu@email.com" required /></label>
            <p className="auth-help">Enviaremos um link de acesso único. Apenas contas previamente aprovadas podem entrar.</p>
            <Button size="lg" type="submit" disabled={loading || !configured}>{loading ? <LoaderCircle className="spin" size={18} /> : <>Enviar link seguro <ArrowRight size={18} /></>}</Button>
          </form>
        </TabsContent>
      </Tabs>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="auth-divider"><span>ou</span></div>
      <Button asChild variant="ghost" size="lg"><Link aria-disabled={!configured} href={configured ? '/api/auth/oauth?provider=google' : '#'}>Continuar com Google</Link></Button>
      {!configured && <div className="preview-links"><Link href="/app">Ver área do criador</Link><Link href="/brand">Ver área da marca</Link><Link href="/admin">Ver administração Lucre</Link></div>}
    </div>
  );
}
