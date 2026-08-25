import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { z } from 'zod';
import { getHomeForRole } from '@/features/auth/permissions';
import type { AppRole } from '@/lib/roles';
import { consumeRateLimit } from '@/services/security/rate-limit';
import { getServerEnv } from '@/config/env';
import { getSupabasePublicConfig, isSupabaseConfigured } from '@/lib/supabase/config';
import { recordAuditEvent } from '@/services/security/audit';

const schema = z.object({
  identifier: z.string().trim().min(2).max(180),
  password: z.string().min(8).max(200),
});

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase ainda não configurado.' }, { status: 503 });
  }
  if (!getServerEnv().success) return NextResponse.json({ error: 'Autenticação ainda não configurada.' }, { status: 503 });

  const rate = await consumeRateLimit(request, 'password_login', 8, 900);
  if (!rate.allowed) return NextResponse.json({ error: 'Muitas tentativas. Aguarde antes de tentar novamente.' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 400 });

  const { identifier, password } = parsed.data;
  const email = identifier.includes('@')
    ? identifier.toLowerCase()
    : identifier.toLowerCase() === 'lucre'
      ? process.env.ADMIN_LOGIN_EMAIL
      : undefined;

  if (!email) return NextResponse.json({ error: 'Usuário ou e-mail inválido.' }, { status: 400 });

  const { url, anonKey } = getSupabasePublicConfig();
  const pendingCookies: Array<{ name: string; value: string; options: CookieOptions }> = [];
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        pendingCookies.push(...values);
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return NextResponse.json({ error: 'Credenciais incorretas.' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', data.user.id)
    .maybeSingle<{ role: string; status: string }>();

  if (!profile || profile.status !== 'ACTIVE') {
    await supabase.auth.signOut();
    return NextResponse.json({ error: 'Acesso aguardando liberação pela Lucre.' }, { status: 403 });
  }

  const response = NextResponse.json({ destination: getHomeForRole(profile.role as AppRole) });
  pendingCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options as Partial<ResponseCookie>));
  await recordAuditEvent({ actorId: data.user.id, action: 'auth.password_login', entityType: 'profile', entityId: data.user.id });
  return response;
}
