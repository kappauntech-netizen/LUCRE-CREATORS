import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AppRole } from '@/lib/roles';

export type SessionProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  role: AppRole;
};

export type SessionContext = {
  configured: boolean;
  user: User | null;
  profile: SessionProfile | null;
  organization: { id: string; name: string; slug: string; member_role: string } | null;
};

export async function getSessionContext(): Promise<SessionContext> {
  if (!isSupabaseConfigured()) {
    return { configured: false, user: null, profile: null, organization: null };
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { configured: true, user: null, profile: null, organization: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, full_name, role')
    .eq('id', data.user.id)
    .maybeSingle<SessionProfile>();

  const { data: membership } = await supabase
    .from('organization_memberships')
    .select('member_role, organization:organizations(id, name, slug)')
    .eq('profile_id', data.user.id)
    .eq('status', 'ACTIVE')
    .limit(1)
    .maybeSingle();

  const rawOrganization = membership?.organization as unknown as { id: string; name: string; slug: string } | null;
  const organization = rawOrganization ? { ...rawOrganization, member_role: String(membership?.member_role ?? 'MEMBER') } : null;

  return { configured: true, user: data.user, profile: profile ?? null, organization };
}
