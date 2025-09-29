import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildEnvelopeJsonSchema, buildEventPayloadSchemas } from './utils/jsonSchema.ts';
import { listEvents } from './registry.ts';

const outDir = resolve(process.cwd(), 'schemas');
mkdirSync(outDir, { recursive: true });

// Envelope
const envelope = buildEnvelopeJsonSchema();
writeFileSync(resolve(outDir, 'event-envelope.schema.json'), JSON.stringify(envelope, null, 2));

// Payloads
const payloadSchemas = buildEventPayloadSchemas();
for (const [key, schema] of Object.entries(payloadSchemas)) {
  writeFileSync(resolve(outDir, `${key}.schema.json`), JSON.stringify(schema, null, 2));
}

// Index manifest
writeFileSync(
  resolve(outDir, 'manifest.json'),
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    envelope: 'event-envelope.schema.json',
    events: listEvents()
  }, null, 2)
);

console.log(`Generated ${Object.keys(payloadSchemas).length} payload schemas to ${outDir}`);
