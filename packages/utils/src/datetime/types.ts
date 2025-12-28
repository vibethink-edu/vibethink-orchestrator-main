/**
 * DateTime Types - ViTo Architecture Spec v3.0.0
 * 
 * Canonical types for date/time handling with strict timezone safety.
 * 
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md
 * @see docs/architecture/DATE_TIME_HANDLING_POSITION.md
 */

/**
 * Calendar date only. NO time, NO timezone info attached to the string.
 * Format: 'YYYY-MM-DD'
 * 
 * Example: "2025-12-25"
 * 
 * Used for: Hotel check-in/check-out, Airbnb bookings (nights)
 * 
 * ⚠️ CRITICAL: Never use `new Date("YYYY-MM-DD")` directly.
 * Use `civilDateToSafeDate()` instead to avoid DST issues.
 */
export type CivilDate = string;

/**
 * Point in time. MUST include offset or Z.
 * Format: ISO 8601 with timezone offset
 * 
 * Example: "2025-12-25T14:30:00-05:00" or "2025-12-25T14:30:00Z"
 * 
 * Used for: Studio bookings (hours), Cowork slots, Google Calendar events
 */
export type InstantISO = string;

/**
 * Booking unit type
 */
export type BookingUnit = 'night' | 'hour' | 'day';

/**
 * Resource domain (logic domain for normalization)
 */
export type ResourceDomain = 
  | 'hotel' 
  | 'coliving' 
  | 'airbnb_like'  // Airbnb, Booking.com, etc.
  | 'studio' 
  | 'cowork';

/**
 * Discriminated Union for Normalized Booking Windows
 * 
 * This type ensures type safety: you cannot have unit='night' with startAt/endAt,
 * or unit='hour' with checkInDate/checkOutDate.
 * 
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md - PART 2.2
 */
export type NormalizedWindow =
  | {
      kind: 'civil_range';
      domain: 'hotel' | 'coliving' | 'airbnb_like';
      unit: 'night';
      resourceId: string;
      venueTimezone: string; // IANA timezone: 'America/Cancun'
      checkInDate: CivilDate;
      checkOutDate: CivilDate;
    }
  | {
      kind: 'instant_range';
      domain: 'studio' | 'cowork';
      unit: 'hour' | 'day';
      resourceId: string;
      venueTimezone: string; // IANA timezone: 'America/Bogota'
      startAt: InstantISO;
      endAt: InstantISO;
    };

/**
 * Legacy BookingWindow type (for backward compatibility during migration)
 * 
 * @deprecated Use NormalizedWindow instead
 * This will be removed once all code is migrated to NormalizedWindow
 */
export type BookingWindow =
  | {
      context: 'hotel' | 'coliving' | 'airbnb';
      unit: 'night';
      venueTimezone: string;
      checkInDate: CivilDate;
      checkOutDate: CivilDate;
    }
  | {
      context: 'studio';
      unit: 'hour';
      venueTimezone: string;
      startAt: InstantISO;
      endAt: InstantISO;
    }
  | {
      context: 'cowork';
      unit: 'hour' | 'day';
      venueTimezone: string;
      startAt: InstantISO;
      endAt: InstantISO;
    };

/**
 * Type guard: Check if a NormalizedWindow is a civil_range
 */
export function isCivilRange(window: NormalizedWindow): window is Extract<NormalizedWindow, { kind: 'civil_range' }> {
  return window.kind === 'civil_range';
}

/**
 * Type guard: Check if a NormalizedWindow is an instant_range
 */
export function isInstantRange(window: NormalizedWindow): window is Extract<NormalizedWindow, { kind: 'instant_range' }> {
  return window.kind === 'instant_range';
}

/**
 * Validate CivilDate format
 */
export function isValidCivilDate(date: string): date is CivilDate {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  
  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

/**
 * Validate InstantISO format
 */
export function isValidInstantISO(instant: string): instant is InstantISO {
  try {
    const date = new Date(instant);
    return !isNaN(date.getTime()) && instant.includes('T');
  } catch {
    return false;
  }
}









