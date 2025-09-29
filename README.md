# @returnacy/event-contracts

Shared, versioned event envelope + Zod schemas + validation utilities for all services.

## Goals

- Decouple internal domain models from cross-service event contracts.
- Provide a stable, versioned envelope and per-event schema.
- Allow JSON Schema generation for language-agnostic consumers and contract tests.
- Enforce validation at publish & consume time.

## Event Envelope

```
{
  id: string;              // UUID v4
  type: string;            // e.g. campaign.step.ready
  version: number;         // semantic version of the *payload* schema (major only here)
  occurredAt: string;      // ISO timestamp
  producer: string;        // logical service name (e.g. campaign-service.scheduler)
  traceId?: string;        // correlation / tracing id
  spanId?: string;         // optional span id
  schemaVersion: 1;        // envelope schema version
  payload: unknown;        // validated against registry schema for (type, version)
}
```

## Usage

### Publishing

```ts
import { createEvent, EventTypes } from '@returnacy/event-contracts';

const evt = createEvent({
  type: EventTypes.CAMPAIGN_STEP_READY,
  version: 1,
  producer: 'campaign-service.scheduler',
  payload: {
    stepExecutionId: 'se_123',
    campaignId: 'c_456',
    businessId: 'b_789',
    channel: 'EMAIL',
    batchSize: 100
  },
  traceId: 'trace-xyz'
});

// publish evt (JSON.stringify(evt)) to broker / outbox
```

### Consuming

```ts
import { validateEvent } from '@returnacy/event-contracts';

const parsed = validateEvent(JSON.parse(raw));
// parsed.payload is now typed for that event type
```

### JSON Schemas

Generate JSON Schema artifacts (for registry / docs / contract tests):

```
pnpm generate:schemas
```

Outputs to `schemas/` one file per event + `event-envelope.schema.json`.
`manifest.json` now contains a deterministic `schemaHash` (SHA-256 over all schema files) so rebuilds without schema changes do not alter git state.

## Versioning Strategy

- Payload `version` is incremented on breaking changes (major). Additive, backward-compatible additions do **not** increment version; instead keep same version and add optional fields.
- Deprecations: mark in README and keep at least one version overlap window before removal.

## Adding a New Event

1. Create a new file in `src/events/<eventName>.ts` exporting:
   - `EVENT_TYPE` constant
   - `eventPayloadSchema` (Zod) & `EventPayload` type
   - Add to `src/registry.ts` registry map
2. Re-run `pnpm generate:schemas`
3. Bump package patch version (or minor if additive) / major only on breaking change.

## Testing / Contract Integration

Downstream services can:
1. Import types at compile time.
2. Or pull JSON schemas and validate dynamically (language agnostic).

## License

MIT
