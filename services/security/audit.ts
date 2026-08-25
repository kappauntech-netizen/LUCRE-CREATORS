import 'server-only';
import { createSupabaseAdminClient } from '@/services/supabase/admin';

type AuditEvent = {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
};

/**
 * Best-effort immutable audit trail. Business actions remain available if the
 * audit service is temporarily unavailable, while database mutations on the
 * resulting records are blocked by migration 0002.
 */
export async function recordAuditEvent(event: AuditEvent) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return false;

  const { error } = await supabase.from('audit_logs').insert({
    actor_id: event.actorId ?? null,
    action: event.action,
    entity_type: event.entityType,
    entity_id: event.entityId ?? null,
    before_data: event.before ?? null,
    after_data: event.after ?? null,
  });

  return !error;
}
