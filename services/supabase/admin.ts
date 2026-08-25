import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { getServerEnv } from '@/config/env';

export function createSupabaseAdminClient() {
  const parsed = getServerEnv();
  if (!parsed.success) return null;
  return createClient(parsed.data.NEXT_PUBLIC_SUPABASE_URL, parsed.data.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
