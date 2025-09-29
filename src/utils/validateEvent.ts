import { eventEnvelopeSchema, EventEnvelope } from '../envelope.ts';
import { getPayloadSchema } from '../registry.ts';

export interface ValidationResult<TPayload = unknown> {
  ok: boolean;
  error?: string;
  event?: EventEnvelope & { payload: TPayload };
}

export function validateEvent(raw: unknown): ValidationResult<any> {
  const baseParse = eventEnvelopeSchema.safeParse(raw);
  if (!baseParse.success) {
    return { ok: false, error: baseParse.error.message };
  }
  const env = baseParse.data;
  const schema = getPayloadSchema(env.type as any, env.version);
  if (!schema) {
    return { ok: false, error: `Unknown event schema for ${env.type} v${env.version}` };
  }
  const payloadParse = schema.safeParse(env.payload);
  if (!payloadParse.success) {
    return { ok: false, error: payloadParse.error.message };
  }
  return { ok: true, event: { ...env, payload: payloadParse.data } };
}
