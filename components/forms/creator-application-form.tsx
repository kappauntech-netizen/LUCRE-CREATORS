'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const steps = ['Você', 'Presença', 'Negócio'];

export function CreatorApplicationForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setLoading(true);
    setMessage(null);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Não foi possível enviar sua candidatura.');
      setSuccess(true);
      setMessage('Candidatura recebida. A equipe Lucre entrará em contato após a análise.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Não foi possível enviar sua candidatura.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="form-success">
        <span><Check size={28} /></span>
        <p className="eyebrow">CANDIDATURA RECEBIDA</p>
        <h2>Agora é com a Lucre.</h2>
        <p>{message}</p>
        <Link href="/">Voltar ao início <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div className="form-progress" aria-label={`Etapa ${step + 1} de ${steps.length}`}>
        {steps.map((label, index) => (
          <div className={index <= step ? 'active' : ''} key={label}>
            <span>{String(index + 1).padStart(2, '0')}</span><small>{label}</small>
          </div>
        ))}
      </div>

      <div className={step === 0 ? 'form-step form-step--active' : 'form-step'}>
        <div className="form-grid">
          <label><span>Nome completo</span><Input name="fullName" placeholder="Como devemos chamar você?" required /></label>
          <label><span>E-mail profissional</span><Input name="email" type="email" placeholder="voce@email.com" required /></label>
          <label><span>WhatsApp</span><Input name="whatsapp" inputMode="tel" placeholder="(11) 99999-9999" required /></label>
          <label><span>Cidade / Estado</span><Input name="location" placeholder="São Paulo, SP" required /></label>
        </div>
      </div>

      <div className={step === 1 ? 'form-step form-step--active' : 'form-step'}>
        <div className="form-grid">
          <label><span>Instagram</span><Input name="instagram" placeholder="@seuusuario" /></label>
          <label><span>TikTok</span><Input name="tiktok" placeholder="@seuusuario" /></label>
          <label><span>Nicho principal</span><Select name="primaryNiche" required defaultValue=""><option value="" disabled>Selecione</option><option>Beleza</option><option>Moda</option><option>Estilo de vida</option><option>Negócios</option><option>Tecnologia</option><option>Condicionamento físico</option><option>Gastronomia</option><option>Outro</option></Select></label>
          <label><span>Maior audiência</span><Select name="followersRange" required defaultValue=""><option value="" disabled>Selecione</option><option value="up_to_10k">Até 10 mil</option><option value="10k_50k">10 a 50 mil</option><option value="50k_250k">50 a 250 mil</option><option value="250k_1m">250 mil a 1 milhão</option><option value="over_1m">Mais de 1 milhão</option></Select></label>
        </div>
      </div>

      <div className={step === 2 ? 'form-step form-step--active' : 'form-step'}>
        <label><span>Conte sobre sua experiência</span><Textarea name="experience" rows={6} placeholder="Campanhas, vendas ao vivo, formatos que domina e o que busca construir..." required /></label>
        <label className="checkbox-field"><input type="checkbox" name="consent" value="true" required /><span>Autorizo a Lucre a analisar as informações e perfis enviados para fins de seleção e contato.</span></label>
      </div>

      {message && <p className="form-error" role="alert">{message}</p>}
      <div className="form-navigation">
        {step > 0 && <Button type="button" variant="ghost" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Voltar</Button>}
        <Button type="submit" size="lg" disabled={loading}>{loading ? <LoaderCircle className="spin" size={18} /> : step === steps.length - 1 ? <>Enviar candidatura <ArrowRight size={18} /></> : <>Continuar <ArrowRight size={18} /></>}</Button>
      </div>
    </form>
  );
}
