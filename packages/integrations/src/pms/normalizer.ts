/**
 * PMS (Property Management System) Normalizer
 * 
 * Transforms raw PMS payloads to NormalizedWindow.
 * 
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md - PART 3.2
 */

import type { NormalizedWindow, CivilDate } from '@vibethink/utils/datetime';
import type { ResourceContext } from '@vibethink/utils/context';
import { isValidCivilDate } from '@vibethink/utils/datetime';

/**
 * Raw PMS booking payload (generic structure)
 * 
 * Different PMS systems may have different structures.
 * This is a common structure that covers most cases.
 */
export interface PMSRawBooking {
  booking_id: string;
  property_id: string;
  check_in: string; // Format: "YYYY-MM-DD" or ISO 8601
  check_out: string;
  guest_count?: number;
  total_amount?: number;
  currency?: string;
  status?: string;
  // ... otros campos específicos del PMS
}

/**
 * Normalize PMS booking to NormalizedWindow
 * 
 * Most PMS systems provide dates only (no time), similar to Airbnb.
 * 
 * @example
 * const pmsPayload = {
 *   booking_id: "BK001",
 *   property_id: "PROP123",
 *   check_in: "2025-12-25",
 *   check_out: "2025-12-27",
 * };
 * 
 * const resourceCtx: ResourceContext = {
 *   resourceId: "pms_PROP123",
 *   sourceSystem: 'pms',
 *   timeZone: 'America/Cancun',
 * };
 * 
 * const normalized = normalizePMSBooking(pmsPayload, resourceCtx);
 * // Returns: NormalizedWindow with kind='civil_range'
 */
export function normalizePMSBooking(
  rawPayload: PMSRawBooking,
  resourceCtx: ResourceContext
): NormalizedWindow {
  // Extract date part if it's ISO format
  const checkInDate = rawPayload.check_in.split('T')[0];
  const checkOutDate = rawPayload.check_out.split('T')[0];
  
  // Validate dates
  if (!isValidCivilDate(checkInDate)) {
    throw new Error(`Invalid check_in date format: ${checkInDate}. Expected YYYY-MM-DD`);
  }
  
  if (!isValidCivilDate(checkOutDate)) {
    throw new Error(`Invalid check_out date format: ${checkOutDate}. Expected YYYY-MM-DD`);
  }
  
  // Create normalized window
  const normalized: NormalizedWindow = {
    kind: 'civil_range',
    domain: 'hotel', // PMS is typically for hotels
    unit: 'night',
    resourceId: resourceCtx.resourceId,
    venueTimezone: resourceCtx.timeZone, // Source of truth
    checkInDate: checkInDate as CivilDate,
    checkOutDate: checkOutDate as CivilDate,
  };
  
  return normalized;
}










