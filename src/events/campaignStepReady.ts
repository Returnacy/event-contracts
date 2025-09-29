import { z } from 'zod';

export const CAMPAIGN_STEP_READY = 'campaign.step.ready';

export const campaignStepReadyPayloadSchema = z.object({
  stepExecutionId: z.string().min(1),
  campaignId: z.string().min(1),
  businessId: z.string().min(1),
  channel: z.string().min(1),
  batchSize: z.number().int().positive(),
  // room for future optional fields
  metadata: z.record(z.any()).optional()
});

export type CampaignStepReadyPayload = z.infer<typeof campaignStepReadyPayloadSchema>;
