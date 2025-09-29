import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { envelopeBaseFields, EventEnvelope } from '../envelope.ts';
import { getPayloadSchema, EventType } from '../registry.ts';

const createEventInputSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string(),
  version: z.number().int().positive().default(1),
  producer: z.string().min(1),
  traceId: z.string().optional(),
  spanId: z.string().optional(),
  payload: z.unknown()
});

export type CreateEventInput = z.input<typeof createEventInputSchema> & { type: EventType };

export function createEvent(input: CreateEventInput): EventEnvelope {
  const parsed = createEventInputSchema.parse(input);
  const schema = getPayloadSchema(parsed.type as EventType, parsed.version);
  if (!schema) {
    throw new Error(`No schema registered for event type ${parsed.type} v${parsed.version}`);
  }
  const payload = schema.parse(parsed.payload);
  return {
    id: parsed.id ?? randomUUID(),
    type: parsed.type,
    version: parsed.version,
    occurredAt: new Date().toISOString(),
    producer: parsed.producer,
    traceId: parsed.traceId,
    spanId: parsed.spanId,
    schemaVersion: 1,
    payload
  } satisfies EventEnvelope;
}
