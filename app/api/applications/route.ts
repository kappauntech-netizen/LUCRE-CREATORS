import { NextResponse } from 'next/server';
import { creatorApplicationSchema } from '@/features/applications/schema';
import { submitCreatorApplication } from '@/features/applications/service';
import { consumeRateLimit } from '@/services/security/rate-limit';
import { getServerEnv } from '@/config/env';
import { recordAuditEvent } from '@/services/security/audit';

export async function POST(request: Request) {
  if (!getServerEnv().success) return NextResponse.json({ error: 'A candidatura estará disponível após a conexão segura com o Supabase.' }, { status: 503 });
  const rate = await consumeRateLimit(request, 'creator_application', 4, 3600);
  if (!rate.allowed) return NextResponse.json({ error: 'Muitas tentativas. Aguarde antes de enviar novamente.' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } });

  const parsed = creatorApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Revise os campos obrigatórios.' }, { status: 400 });

  const result = await submitCreatorApplication(parsed.data);
  if (!result.ok && result.reason === 'configuration') return NextResponse.json({ error: 'A candidatura estará disponível após a conexão segura com o Supabase.' }, { status: 503 });
  if (!result.ok) return NextResponse.json({ error: 'Não foi possível salvar a candidatura agora.' }, { status: 500 });
  await recordAuditEvent({ action: 'creator_application.submitted', entityType: 'creator_application', entityId: result.id, after: { source: 'public_website' } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
