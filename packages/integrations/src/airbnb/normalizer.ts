/**
 * Airbnb Normalizer
 * 
 * Transforms raw Airbnb payloads to NormalizedWindow.
 * 
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md - PART 3.2
 */

import type { NormalizedWindow, CivilDate } from '@vibethink/utils/datetime';
import type { ResourceContext } from '@vibethink/utils/context';
import type { AirbnbRawBooking } from './types';
import { isValidCivilDate } from '@vibethink/utils/datetime';

/**
 * Normalize Airbnb booking to NormalizedWindow
 * 
 * Airbnb only provides dates (no time), so we use ResourceContext.timeZone
 * to anchor the truth. The dates become CivilDate (date-only).
 * 
 * @example
 * const airbnbPayload = {
 *   listing_id: "12345",
 *   check_in: "2025-12-25",
 *   check_out: "2025-12-27",
 * };
 * 
 * const resourceCtx: ResourceContext = {
 *   resourceId: "airbnb_12345",
 *   sourceSystem: 'airbnb',
 *   timeZone: 'America/Cancun',
 * };
 * 
 * const normalized = normalizeAirbnbBooking(airbnbPayload, resourceCtx);
 * // Returns: NormalizedWindow with kind='civil_range'
 */
export function normalizeAirbnbBooking(
  rawPayload: AirbnbRawBooking,
  resourceCtx: ResourceContext
): NormalizedWindow {
  // Validate dates
  if (!isValidCivilDate(rawPayload.check_in)) {
    throw new Error(`Invalid check_in date format: ${rawPayload.check_in}. Expected YYYY-MM-DD`);
  }
  
  if (!isValidCivilDate(rawPayload.check_out)) {
    throw new Error(`Invalid check_out date format: ${rawPayload.check_out}. Expected YYYY-MM-DD`);
  }
  
  // Create normalized window
  const normalized: NormalizedWindow = {
    kind: 'civil_range',
    domain: 'airbnb_like',
    unit: 'night',
    resourceId: resourceCtx.resourceId,
    venueTimezone: resourceCtx.timeZone, // Source of truth from ResourceContext
    checkInDate: rawPayload.check_in as CivilDate,
    checkOutDate: rawPayload.check_out as CivilDate,
  };
  
  return normalized;
}



