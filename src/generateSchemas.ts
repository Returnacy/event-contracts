import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
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

// Deterministic hash across all schema files (envelope + payloads) so manifest only changes when schemas change.
const hash = createHash('sha256');
// Stable ordering
const schemaFiles = ['event-envelope.schema.json', ...Object.keys(payloadSchemas).map(k => `${k}.schema.json`)];
for (const f of schemaFiles.sort()) {
  const content = readFileSync(resolve(outDir, f));
  hash.update(f + '\n');
  hash.update(content);
}
const schemaHash = hash.digest('hex');

// Existing manifest (if any) to avoid unnecessary rewrite
const manifestPath = resolve(outDir, 'manifest.json');
let previousHash: string | undefined;
try {
  const prev = JSON.parse(readFileSync(manifestPath, 'utf8'));
  previousHash = prev.schemaHash;
} catch {}

// Only write if hash changed or file missing
if (previousHash !== schemaHash) {
  writeFileSync(
    manifestPath,
    JSON.stringify({
      schemaHash,
      envelope: 'event-envelope.schema.json',
      events: listEvents()
    }, null, 2)
  );
  console.log(`Schema manifest updated (hash=${schemaHash.slice(0,8)}).`);
} else {
  console.log('Schema manifest unchanged.');
}

console.log(`Generated ${Object.keys(payloadSchemas).length} payload schemas to ${outDir}`);
