'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function BrandLeadForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch('/api/brand-leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Não foi possível enviar os dados.');
      setSuccess(true);
      setMessage('Recebemos o seu planejamento inicial. Nossa equipe entrará em contato.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Não foi possível enviar os dados.');
    } finally { setLoading(false); }
  }

  if (success) return <div className="form-success"><span><Check size={28} /></span><h2>Conversa iniciada.</h2><p>{message}</p><Link href="/">Voltar ao início <ArrowRight size={16} /></Link></div>;

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label><span>Marca / empresa</span><Input name="companyName" required placeholder="Nome da empresa" /></label>
        <label><span>Seu nome</span><Input name="contactName" required placeholder="Nome e sobrenome" /></label>
        <label><span>E-mail profissional</span><Input name="email" type="email" required placeholder="voce@empresa.com" /></label>
        <label><span>WhatsApp</span><Input name="whatsapp" required placeholder="(11) 99999-9999" /></label>
        <label><span>Objetivo principal</span><Select name="objective" required defaultValue=""><option value="" disabled>Selecione</option><option>Vendas / conversão</option><option>Lançamento</option><option>Reconhecimento de marca</option><option>Conteúdo gerado pelo público</option><option>Vendas ao vivo</option><option>Outro</option></Select></label>
        <label><span>Faixa de investimento</span><Select name="budgetRange" required defaultValue=""><option value="" disabled>Selecione</option><option value="up_to_10k">Até R$ 10 mil</option><option value="10k_30k">R$ 10 a 30 mil</option><option value="30k_100k">R$ 30 a 100 mil</option><option value="over_100k">Acima de R$ 100 mil</option><option value="to_define">A definir</option></Select></label>
      </div>
      <label><span>Conte sobre a oportunidade</span><Textarea name="brief" rows={5} required placeholder="Produto, prazo, perfil de criador e resultado esperado..." /></label>
      {message && <p className="form-error" role="alert">{message}</p>}
      <div className="form-navigation"><Button type="submit" size="lg" disabled={loading}>{loading ? <LoaderCircle className="spin" size={18} /> : <>Enviar planejamento <ArrowRight size={18} /></>}</Button></div>
    </form>
  );
}
