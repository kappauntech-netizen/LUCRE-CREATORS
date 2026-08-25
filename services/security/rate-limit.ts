import 'server-only';
import { createHash } from 'node:crypto';
import { getServerEnv } from '@/config/env';
import { createSupabaseAdminClient } from '@/services/supabase/admin';

type RateLimitResult = { allowed: boolean; retryAfter: number };

function getClientAddress(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

export async function consumeRateLimit(request: Request, scope: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const env = getServerEnv();
  const supabase = createSupabaseAdminClient();
  if (!env.success || !supabase) return { allowed: false, retryAfter: 60 };

  const fingerprint = createHash('sha256')
    .update(scope)
    .update(':')
    .update(getClientAddress(request))
    .update(':')
    .update(env.data.RATE_LIMIT_SALT)
    .digest('hex');

  const { data, error } = await supabase.rpc('consume_rate_limit', {
    p_key: fingerprint,
    p_scope: scope,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error || !data) return { allowed: false, retryAfter: 60 };
  const result = Array.isArray(data) ? data[0] : data;
  return {
    allowed: Boolean((result as { allowed?: boolean }).allowed),
    retryAfter: Number((result as { retry_after?: number }).retry_after ?? windowSeconds),
  };
}
