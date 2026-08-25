import { z } from 'zod';

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  RATE_LIMIT_SALT: z.string().min(24),
});

export function getPublicEnv() {
  return publicSchema.safeParse(process.env);
}

export function getServerEnv() {
  return serverSchema.safeParse(process.env);
}
