/**
 * @provenance
 * provider: date-fns
 * package: date-fns@4.1.0
 * distance: 0
 * risk: HIGH
 * policy: governed
 * boundary: canonical datetime utilities (Safe Noon pattern)
 * rationale: Wraps date-fns to enforce timezone safety per VITO_ARCHITECTURE_SPEC Part 2
 * replaced_by: none (canonical boundary)
 */

/**
 * CivilDate Utilities - Safe Noon Trick
 * 
 * Functions for parsing and manipulating CivilDate (date-only) values
 * without timezone issues.
 * 
 * @see docs/architecture/DATE_TIME_HANDLING_POSITION.md - Section E
 */

import type { CivilDate } from './types';

/**
 * Parse CivilDate to parts (year, month, day)
 * 
 * @example
 * civilDateToParts('2025-12-25')
 * // Returns: { year: 2025, month: 12, day: 25 }
 */
export function civilDateToParts(d: CivilDate): { year: number; month: number; day: number } {
  const [year, month, day] = d.split('-').map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error(`Invalid CivilDate format: ${d}. Expected YYYY-MM-DD`);
  }

  return { year, month, day };
}

/**
 * Convert CivilDate to safe Date object using Safe Noon Trick
 * 
 * Uses 12:00:00 UTC as "safe noon" to avoid DST edge cases.
 * This is the standard approach for date-only values.
 * 
 * ⚠️ CRITICAL: Never use `new Date("YYYY-MM-DD")` directly.
 * 
 * @example
 * civilDateToSafeDate('2025-01-01')
 * // Returns: Date object at 2025-01-01T12:00:00.000Z
 */
export function civilDateToSafeDate(civilDate: CivilDate): Date {
  const { year, month, day } = civilDateToParts(civilDate);

  // Safe Noon Trick: 12:00 UTC evita DST edge cases
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

/**
 * Format CivilDate using Intl with Safe Noon Trick
 * 
 * Always uses UTC timezone to ensure consistent rendering
 * regardless of user's timezone.
 * 
 * @example
 * formatCivilDate('2025-12-25', 'en-US')
 * // Returns: "Dec 25, 2025"
 * 
 * formatCivilDate('2025-12-25', 'es-ES')
 * // Returns: "25 dic 2025"
 */
export function formatCivilDate(
  civilDate: CivilDate,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const { year, month, day } = civilDateToParts(civilDate);

  // Safe Noon Trick: 12:00 UTC evita DST edge cases
  const safeDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC', // Siempre UTC para fechas civiles
    ...options,
  });

  return formatter.format(safeDate);
}

/**
 * Calculate difference between two CivilDates (by calendar, NOT with Date)
 * 
 * Returns the number of days between start and end (inclusive of start, exclusive of end).
 * 
 * @example
 * diffCivilDates('2025-12-25', '2025-12-27')
 * // Returns: 2 (2 nights)
 */
export function diffCivilDates(start: CivilDate, end: CivilDate): number {
  const startParts = civilDateToParts(start);
  const endParts = civilDateToParts(end);

  const startDate = new Date(Date.UTC(startParts.year, startParts.month - 1, startParts.day));
  const endDate = new Date(Date.UTC(endParts.year, endParts.month - 1, endParts.day));

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Calculate difference between two Instants (in hours)
 * 
 * @example
 * diffInstants('2025-12-25T10:00:00-05:00', '2025-12-25T14:00:00-05:00')
 * // Returns: 4 (4 hours)
 */
export function diffInstants(start: InstantISO, end: InstantISO): number {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  return diffHours;
}

// Re-export InstantISO type for convenience
import type { InstantISO } from './types';
export type { InstantISO };









