import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServerEnv } from '@/config/env';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  if (!isSupabaseConfigured()) return NextResponse.redirect(new URL('/login?error=configuration', requestUrl.origin));
  if (requestUrl.searchParams.get('provider') !== 'google') return NextResponse.redirect(new URL('/login?error=provider', requestUrl.origin));
  const env = getServerEnv();
  if (!env.success) return NextResponse.redirect(new URL('/login?error=configuration', requestUrl.origin));

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: env.data.NEXT_PUBLIC_SITE_URL + '/auth/callback', skipBrowserRedirect: true },
  });
  if (error || !data.url) return NextResponse.redirect(new URL('/login?error=oauth', requestUrl.origin));
  return NextResponse.redirect(data.url);
}
