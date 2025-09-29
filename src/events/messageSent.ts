import { z } from 'zod';

export const MESSAGE_SENT = 'message.sent';

export const messageSentPayloadSchema = z.object({
  messageId: z.string().min(1),
  provider: z.string().min(1),
  channel: z.string().min(1),
  status: z.enum(['SENT', 'DELIVERED', 'QUEUED']),
  externalReference: z.string().min(1).optional(),
  sentAt: z.string().datetime(),
  businessId: z.string().min(1).optional(),
  campaignId: z.string().min(1).optional()
});

export type MessageSentPayload = z.infer<typeof messageSentPayloadSchema>;
