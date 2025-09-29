import { z } from 'zod';

export const envelopeBaseFields = {
  id: z.string().uuid(),
  type: z.string().min(1),
  version: z.number().int().positive(),
  occurredAt: z.string().datetime(),
  producer: z.string().min(1),
  traceId: z.string().min(1).optional(),
  spanId: z.string().min(1).optional(),
  schemaVersion: z.literal(1)
};

export const eventEnvelopeSchema = z.object({
  ...envelopeBaseFields,
  payload: z.unknown()
});

export type EventEnvelope = z.infer<typeof eventEnvelopeSchema>;
