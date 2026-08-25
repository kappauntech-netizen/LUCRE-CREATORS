import 'server-only';
import type { CreatorApplicationInput } from './schema';
import { createSupabaseAdminClient } from '@/services/supabase/admin';

export async function submitCreatorApplication(data: CreatorApplicationInput) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { ok: false as const, reason: 'configuration' as const };
  const { data: application, error } = await supabase.from('creator_applications').insert({
    full_name: data.fullName, email: data.email, whatsapp: data.whatsapp, location: data.location,
    instagram_handle: data.instagram || null, tiktok_handle: data.tiktok || null,
    primary_niche: data.primaryNiche, followers_range: data.followersRange,
    experience: data.experience, consent_at: new Date().toISOString(), source: 'public_website',
  }).select('id').single<{ id: string }>();
  return error || !application
    ? { ok: false as const, reason: 'database' as const }
    : { ok: true as const, id: application.id };
}
