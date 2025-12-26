/**
 * Google Calendar Normalizer
 * 
 * Transforms raw Google Calendar events to NormalizedWindow.
 * 
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md - PART 3.2
 */

import type { NormalizedWindow, InstantISO } from '@vibethink/utils/datetime';
import type { ResourceContext } from '@vibethink/utils/context';
import { isValidInstantISO } from '@vibethink/utils/datetime';

/**
 * Raw Google Calendar event (simplified)
 */
export interface GoogleCalendarRawEvent {
  id?: string;
  summary?: string;
  start: {
    dateTime?: string; // ISO 8601 with timezone
    date?: string; // Date only (all-day events)
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  // ... otros campos
}

/**
 * Normalize Google Calendar event to NormalizedWindow
 * 
 * Google Calendar events have timezone in the ISO string.
 * We validate that it matches the ResourceContext.timeZone.
 * 
 * @example
 * const calendarEvent = {
 *   start: { dateTime: "2025-12-25T10:00:00-05:00" },
 *   end: { dateTime: "2025-12-25T14:00:00-05:00" },
 * };
 * 
 * const resourceCtx: ResourceContext = {
 *   resourceId: "calendar_studio_1",
 *   sourceSystem: 'google_calendar',
 *   timeZone: 'America/Bogota',
 * };
 * 
 * const normalized = normalizeGoogleCalendarEvent(calendarEvent, resourceCtx);
 * // Returns: NormalizedWindow with kind='instant_range'
 */
export function normalizeGoogleCalendarEvent(
  rawEvent: GoogleCalendarRawEvent,
  resourceCtx: ResourceContext
): NormalizedWindow {
  // Check if it's an all-day event (date only)
  if (rawEvent.start.date && rawEvent.end.date) {
    // All-day event: treat as civil_range
    return {
      kind: 'civil_range',
      domain: 'studio', // Assume studio for calendar events
      unit: 'night',
      resourceId: resourceCtx.resourceId,
      venueTimezone: resourceCtx.timeZone,
      checkInDate: rawEvent.start.date,
      checkOutDate: rawEvent.end.date,
    };
  }
  
  // Timed event: use dateTime
  if (!rawEvent.start.dateTime || !rawEvent.end.dateTime) {
    throw new Error('Google Calendar event must have dateTime for start and end');
  }
  
  // Validate ISO format
  if (!isValidInstantISO(rawEvent.start.dateTime)) {
    throw new Error(`Invalid start dateTime format: ${rawEvent.start.dateTime}`);
  }
  
  if (!isValidInstantISO(rawEvent.end.dateTime)) {
    throw new Error(`Invalid end dateTime format: ${rawEvent.end.dateTime}`);
  }
  
  // Create normalized window
  const normalized: NormalizedWindow = {
    kind: 'instant_range',
    domain: 'studio', // Default to studio for calendar events
    unit: 'hour',
    resourceId: resourceCtx.resourceId,
    venueTimezone: resourceCtx.timeZone, // Source of truth
    startAt: rawEvent.start.dateTime as InstantISO,
    endAt: rawEvent.end.dateTime as InstantISO,
  };
  
  return normalized;
}








