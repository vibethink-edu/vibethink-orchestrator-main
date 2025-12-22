/**
 * Integrations Module - ViTo Architecture Spec v3.0.0
 * 
 * External data normalization (Airbnb, PMS, Google Calendar, etc.)
 */

// Airbnb
export type { AirbnbRawBooking, AirbnbRawListing } from './airbnb/types';
export { normalizeAirbnbBooking } from './airbnb/normalizer';

// Google Calendar
export type { GoogleCalendarRawEvent } from './google_calendar/normalizer';
export { normalizeGoogleCalendarEvent } from './google_calendar/normalizer';

// PMS
export type { PMSRawBooking } from './pms/normalizer';
export { normalizePMSBooking } from './pms/normalizer';

/**
 * Unified normalizer function
 * 
 * Routes to the appropriate normalizer based on sourceSystem.
 */
import type { NormalizedWindow } from '@vibethink/utils/datetime';
import type { ResourceContext } from '@vibethink/utils/context';

export function normalizeExternalBooking(
  rawPayload: unknown,
  resourceCtx: ResourceContext
): NormalizedWindow {
  switch (resourceCtx.sourceSystem) {
    case 'airbnb':
      return normalizeAirbnbBooking(rawPayload as any, resourceCtx);
    
    case 'google_calendar':
      return normalizeGoogleCalendarEvent(rawPayload as any, resourceCtx);
    
    case 'pms':
      return normalizePMSBooking(rawPayload as any, resourceCtx);
    
    default:
      throw new Error(`Unsupported source system: ${resourceCtx.sourceSystem}`);
  }
}

