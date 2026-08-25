import { z } from 'zod';
import { normalizeMultilineText, normalizePlainText } from '@/services/security/plain-text';

const plain = (min: number, max: number) => z.string().transform(normalizePlainText).pipe(z.string().min(min).max(max));

export const brandLeadSchema = z.object({
  companyName: plain(2, 160), contactName: plain(3, 120),
  email: z.string().trim().email().max(180).transform((value) => value.toLowerCase()),
  whatsapp: plain(8, 30), objective: plain(2, 120),
  budgetRange: z.enum(['up_to_10k', '10k_30k', '30k_100k', 'over_100k', 'to_define']),
  brief: z.string().transform(normalizeMultilineText).pipe(z.string().min(20).max(3000)),
  website: z.string().max(0).optional(),
});

export type BrandLeadInput = z.infer<typeof brandLeadSchema>;
