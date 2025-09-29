import { zodToJsonSchema } from 'zod-to-json-schema';
import { eventEnvelopeSchema } from '../envelope.ts';
import { eventRegistry } from '../registry.ts';

export function buildEnvelopeJsonSchema() {
  return zodToJsonSchema(eventEnvelopeSchema, {
    name: 'EventEnvelope'
  });
}

export function buildEventPayloadSchemas() {
  const result: Record<string, any> = {};
  for (const [type, versions] of Object.entries(eventRegistry)) {
    for (const [version, schema] of Object.entries(versions)) {
      const name = `${type.replace(/\./g, '_')}_v${version}`;
      result[`${type}-v${version}`] = zodToJsonSchema(schema, { name });
    }
  }
  return result;
}
