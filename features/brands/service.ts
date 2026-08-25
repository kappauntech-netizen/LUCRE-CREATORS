import 'server-only';
import type { BrandLeadInput } from './schema';
import { createSupabaseAdminClient } from '@/services/supabase/admin';

export async function submitBrandLead(data: BrandLeadInput) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { ok: false as const, reason: 'configuration' as const };
  const { data: lead, error } = await supabase.from('brand_leads').insert({
    company_name: data.companyName, contact_name: data.contactName, email: data.email,
    whatsapp: data.whatsapp, objective: data.objective, budget_range: data.budgetRange,
    brief: data.brief, source: 'public_website',
  }).select('id').single<{ id: string }>();
  return error || !lead
    ? { ok: false as const, reason: 'database' as const }
    : { ok: true as const, id: lead.id };
}
