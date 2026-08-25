import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getHomeForRole } from '@/features/auth/permissions';
import type { AppRole } from '@/lib/roles';
import { getPublicEnv } from '@/config/env';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const publicEnv = getPublicEnv();
  const destinationOrigin = publicEnv.success ? publicEnv.data.NEXT_PUBLIC_SITE_URL : requestUrl.origin;
  const code = requestUrl.searchParams.get('code');
  if (!code) return NextResponse.redirect(new URL('/login?error=callback', destinationOrigin));

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(new URL('/login?error=session', destinationOrigin));

  const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', data.user.id).maybeSingle<{ role: AppRole; status: string }>();
  if (!profile || profile.status !== 'ACTIVE') {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login?error=pending', destinationOrigin));
  }
  return NextResponse.redirect(new URL(getHomeForRole(profile.role), destinationOrigin));
}
