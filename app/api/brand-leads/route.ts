import { NextResponse } from 'next/server';
import { brandLeadSchema } from '@/features/brands/schema';
import { submitBrandLead } from '@/features/brands/service';
import { consumeRateLimit } from '@/services/security/rate-limit';
import { getServerEnv } from '@/config/env';
import { recordAuditEvent } from '@/services/security/audit';

export async function POST(request: Request) {
  if (!getServerEnv().success) return NextResponse.json({ error: 'O formulário estará disponível após a conexão segura com o Supabase.' }, { status: 503 });
  const rate = await consumeRateLimit(request, 'brand_lead', 6, 3600);
  if (!rate.allowed) return NextResponse.json({ error: 'Muitas tentativas. Aguarde antes de enviar novamente.' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } });

  const parsed = brandLeadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Revise os campos obrigatórios.' }, { status: 400 });

  const result = await submitBrandLead(parsed.data);
  if (!result.ok && result.reason === 'configuration') return NextResponse.json({ error: 'O formulário estará disponível após a conexão segura com o Supabase.' }, { status: 503 });
  if (!result.ok) return NextResponse.json({ error: 'Não foi possível salvar o planejamento agora.' }, { status: 500 });
  await recordAuditEvent({ action: 'brand_lead.submitted', entityType: 'brand_lead', entityId: result.id, after: { source: 'public_website' } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
