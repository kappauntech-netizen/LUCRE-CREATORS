import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { consumeRateLimit } from '@/services/security/rate-limit';
import { getServerEnv } from '@/config/env';

const schema = z.object({ email: z.string().trim().email().max(180) });

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase ainda não configurado.' }, { status: 503 });
  const env = getServerEnv();
  if (!env.success) return NextResponse.json({ error: 'Autenticação ainda não configurada.' }, { status: 503 });
  const rate = await consumeRateLimit(request, 'magic_link', 4, 900);
  if (!rate.allowed) return NextResponse.json({ error: 'Muitas tentativas. Aguarde antes de solicitar outro link.' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email.toLowerCase(),
    options: { emailRedirectTo: env.data.NEXT_PUBLIC_SITE_URL + '/auth/callback', shouldCreateUser: false },
  });
  if (error) return NextResponse.json({ error: 'Conta não encontrada ou não autorizada.' }, { status: 403 });
  return NextResponse.json({ ok: true });
}
