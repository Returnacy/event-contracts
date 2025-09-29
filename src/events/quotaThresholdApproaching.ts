import { z } from 'zod';

export const QUOTA_THRESHOLD_APPROACHING = 'quota.threshold.approaching';

export const quotaThresholdApproachingPayloadSchema = z.object({
  businessId: z.string().min(1),
  planCode: z.string().min(1),
  periodKey: z.string().regex(/^[0-9]{8}$/), // YYYYMMDD
  usage: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  percent: z.number().min(0).max(1),
  threshold: z.number().min(0).max(1)
});

export type QuotaThresholdApproachingPayload = z.infer<typeof quotaThresholdApproachingPayloadSchema>;
