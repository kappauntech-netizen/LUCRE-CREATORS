import { z } from 'zod';
import { normalizeMultilineText, normalizePlainText } from '@/services/security/plain-text';

const plain = (min: number, max: number) => z.string().transform(normalizePlainText).pipe(z.string().min(min).max(max));

export const creatorApplicationSchema = z.object({
  fullName: plain(3, 120),
  email: z.string().trim().email().max(180).transform((value) => value.toLowerCase()),
  whatsapp: plain(8, 30),
  location: plain(2, 120),
  instagram: z.string().transform(normalizePlainText).pipe(z.string().max(120)).optional().default(''),
  tiktok: z.string().transform(normalizePlainText).pipe(z.string().max(120)).optional().default(''),
  primaryNiche: plain(2, 80),
  followersRange: z.enum(['up_to_10k', '10k_50k', '50k_250k', '250k_1m', 'over_1m']),
  experience: z.string().transform(normalizeMultilineText).pipe(z.string().min(20).max(2500)),
  consent: z.literal('true'),
  website: z.string().max(0).optional(),
});

export type CreatorApplicationInput = z.infer<typeof creatorApplicationSchema>;
