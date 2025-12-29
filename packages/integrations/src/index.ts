/**
 * Integrations Module - ViTo Architecture Spec v3.0.0
 *
 * External data normalization (Airbnb, PMS, Google Calendar, etc.)
 */

import type { NormalizedWindow } from '@vibethink/utils/datetime';
import type { ResourceContext } from '@vibethink/utils/context';

// Airbnb
export type { AirbnbRawBooking, AirbnbRawListing } from './airbnb/types';
import { normalizeAirbnbBooking as normalizeAirbnbBookingImpl } from './airbnb/normalizer';
export { normalizeAirbnbBookingImpl as normalizeAirbnbBooking };

// Google Calendar
export type { GoogleCalendarRawEvent } from './google_calendar/normalizer';
import { normalizeGoogleCalendarEvent as normalizeGoogleCalendarEventImpl } from './google_calendar/normalizer';
export { normalizeGoogleCalendarEventImpl as normalizeGoogleCalendarEvent };

// PMS
export type { PMSRawBooking } from './pms/normalizer';
import { normalizePMSBooking as normalizePMSBookingImpl } from './pms/normalizer';
export { normalizePMSBookingImpl as normalizePMSBooking };

/**
 * Unified normalizer function
 *
 * Routes to the appropriate normalizer based on sourceSystem.
 */
export function normalizeExternalBooking(
  rawPayload: unknown,
  resourceCtx: ResourceContext
): NormalizedWindow {
  switch (resourceCtx.sourceSystem) {
    case 'airbnb':
      return normalizeAirbnbBookingImpl(rawPayload as any, resourceCtx);

    case 'google_calendar':
      return normalizeGoogleCalendarEventImpl(rawPayload as any, resourceCtx);

    case 'pms':
      return normalizePMSBookingImpl(rawPayload as any, resourceCtx);

    default:
      throw new Error(`Unsupported source system: ${resourceCtx.sourceSystem}`);
  }
}











