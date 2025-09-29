import { z } from 'zod';
import { CAMPAIGN_STEP_READY, campaignStepReadyPayloadSchema } from './events/campaignStepReady.ts';
import { MESSAGE_SENT, messageSentPayloadSchema } from './events/messageSent.ts';
import { QUOTA_THRESHOLD_APPROACHING, quotaThresholdApproachingPayloadSchema } from './events/quotaThresholdApproaching.ts';

export const EventTypes = {
  CAMPAIGN_STEP_READY,
  MESSAGE_SENT,
  QUOTA_THRESHOLD_APPROACHING
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes];

// Event registry mapping type -> version -> Zod schema
// For now all start at version 1.
export const eventRegistry: Record<EventType, Record<number, z.ZodSchema<any>>> = {
  [CAMPAIGN_STEP_READY]: { 1: campaignStepReadyPayloadSchema },
  [MESSAGE_SENT]: { 1: messageSentPayloadSchema },
  [QUOTA_THRESHOLD_APPROACHING]: { 1: quotaThresholdApproachingPayloadSchema }
};

export function getPayloadSchema(type: EventType, version: number) {
  const versions = eventRegistry[type];
  if (!versions) return undefined;
  return versions[version];
}

export function listEvents() {
  return Object.entries(eventRegistry).flatMap(([type, versions]) =>
    Object.keys(versions).map(v => ({ type, version: Number(v) }))
  );
}
