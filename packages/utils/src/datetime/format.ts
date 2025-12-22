/**
 * DateTime Formatting - ViTo Architecture Spec v3.0.0
 * 
 * Unified formatters for booking windows with timezone safety.
 * 
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md - PART 2
 * @see docs/architecture/DATE_TIME_HANDLING_POSITION.md
 */

import type { NormalizedWindow, BookingWindow } from './types';
import { isCivilRange, isInstantRange } from './types';
import { formatCivilDate, diffCivilDates, diffInstants } from './civil';
import { formatMessage } from '../i18n/message-formatter';

/**
 * Format a range of civil dates (for hotel/coliving/airbnb)
 * 
 * @example
 * formatCivilRange('2025-12-25', '2025-12-27', 'en-US')
 * // Returns: "Dec 25 – 27, 2025"
 * 
 * formatCivilRange('2025-12-25', '2025-12-27', 'es-ES')
 * // Returns: "25-27 dic 2025"
 */
export function formatCivilRange(
  start: string,
  end: string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const startParts = start.split('-').map(Number);
  const endParts = end.split('-').map(Number);
  
  const startDate = new Date(Date.UTC(startParts[0], startParts[1] - 1, startParts[2], 12, 0, 0));
  const endDate = new Date(Date.UTC(endParts[0], endParts[1] - 1, endParts[2], 12, 0, 0));
  
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
    ...options,
  });
  
  // Use formatRange if available (modern browsers)
  // TypeScript may not have the type, but it exists in runtime
  if ('formatRange' in formatter && typeof (formatter as any).formatRange === 'function') {
    return (formatter as any).formatRange(startDate, endDate);
  }
  
  // Fallback for older browsers
  const startStr = formatter.format(startDate);
  const endStr = formatter.format(endDate);
  
  // Try to compact if same year/month
  if (startParts[0] === endParts[0] && startParts[1] === endParts[1]) {
    // Same year and month: "25-27 Dec 2025"
    const dayFormatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      timeZone: 'UTC',
    });
    return `${dayFormatter.format(startDate)} – ${dayFormatter.format(endDate)}, ${startParts[0]}`;
  }
  
  return `${startStr} – ${endStr}`;
}

/**
 * Format a range of instants (for studio/cowork)
 * 
 * IMPORTANT: Always uses venueTimezone explicitly.
 * 
 * @example
 * formatInstantRange(
 *   '2025-12-25T10:00:00-05:00',
 *   '2025-12-25T14:00:00-05:00',
 *   'America/Bogota',
 *   'en-US'
 * )
 * // Returns: "Dec 25, 10:00 – 14:00"
 */
export function formatInstantRange(
  start: string,
  end: string,
  venueTimezone: string,
  locale: string,
  options?: {
    includeDate?: boolean;
    timeFormat?: '12h' | '24h';
  }
): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const includeDate = options?.includeDate ?? true;
  const timeFormat = options?.timeFormat ?? '12h';
  
  if (includeDate) {
    // Format: "Dec 25, 10:00 – 14:00"
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      timeZone: venueTimezone,
    });
    
    const timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: timeFormat === '12h',
      timeZone: venueTimezone,
    });
    
    const dateStr = dateFormatter.format(startDate);
    const startTimeStr = timeFormatter.format(startDate);
    const endTimeStr = timeFormatter.format(endDate);
    
    return `${dateStr}, ${startTimeStr} – ${endTimeStr}`;
  } else {
    // Format: "10:00 – 14:00" (time only)
    const timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: timeFormat === '12h',
      timeZone: venueTimezone,
    });
    
    return `${timeFormatter.format(startDate)} – ${timeFormatter.format(endDate)}`;
  }
}

/**
 * Format booking range (unified entrypoint)
 * 
 * This is the main function UI components should use.
 * It handles both civil_range (hotel) and instant_range (studio) automatically.
 * 
 * @example
 * // Hotel booking
 * formatBookingRange({
 *   kind: 'civil_range',
 *   domain: 'hotel',
 *   unit: 'night',
 *   resourceId: 'hotel_123',
 *   venueTimezone: 'America/Cancun',
 *   checkInDate: '2025-12-25',
 *   checkOutDate: '2025-12-27',
 * }, 'en-US', { includeDuration: true })
 * // Returns: "Dec 25 – 27, 2025 (2 nights)"
 * 
 * @example
 * // Studio booking
 * formatBookingRange({
 *   kind: 'instant_range',
 *   domain: 'studio',
 *   unit: 'hour',
 *   resourceId: 'studio_456',
 *   venueTimezone: 'America/Bogota',
 *   startAt: '2025-12-25T10:00:00-05:00',
 *   endAt: '2025-12-25T14:00:00-05:00',
 * }, 'en-US', { includeDuration: true })
 * // Returns: "Dec 25, 10:00 AM – 2:00 PM (4 hours)"
 */
export function formatBookingRange(
  window: NormalizedWindow | BookingWindow,
  locale: string,
  options?: { 
    short?: boolean; 
    includeDuration?: boolean;
    timeFormat?: '12h' | '24h';
  }
): string {
  // Handle NormalizedWindow (new format)
  if ('kind' in window) {
    if (isCivilRange(window)) {
      // Hotel/Coliving/Airbnb: Civil date range
      const range = formatCivilRange(window.checkInDate, window.checkOutDate, locale);
      
      if (options?.includeDuration) {
        const nights = diffCivilDates(window.checkInDate, window.checkOutDate);
        const durationLabel = formatMessage(
          locale,
          '{count, plural, one {1 night} other {# nights}}',
          { count: nights }
        );
        return `${range} (${durationLabel})`;
      }
      
      return range;
    }
    
    if (isInstantRange(window)) {
      // Studio/Cowork: Instant range
      const range = formatInstantRange(
        window.startAt,
        window.endAt,
        window.venueTimezone,
        locale,
        {
          includeDate: !options?.short,
          timeFormat: options?.timeFormat,
        }
      );
      
      if (options?.includeDuration) {
        const hours = diffInstants(window.startAt, window.endAt);
        const durationLabel = formatMessage(
          locale,
          '{count, plural, one {1 hour} other {# hours}}',
          { count: hours }
        );
        return `${range} (${durationLabel})`;
      }
      
      return range;
    }
  }
  
  // Handle legacy BookingWindow (backward compatibility)
  if ('context' in window) {
    if (window.unit === 'night' && 'checkInDate' in window) {
      const range = formatCivilRange(window.checkInDate, window.checkOutDate, locale);
      
      if (options?.includeDuration) {
        const nights = diffCivilDates(window.checkInDate, window.checkOutDate);
        const durationLabel = formatMessage(
          locale,
          '{count, plural, one {1 night} other {# nights}}',
          { count: nights }
        );
        return `${range} (${durationLabel})`;
      }
      
      return range;
    }
    
    if (window.unit === 'hour' && 'startAt' in window) {
      const range = formatInstantRange(
        window.startAt,
        window.endAt,
        window.venueTimezone,
        locale,
        {
          includeDate: !options?.short,
          timeFormat: options?.timeFormat,
        }
      );
      
      if (options?.includeDuration) {
        const hours = diffInstants(window.startAt, window.endAt);
        const durationLabel = formatMessage(
          locale,
          '{count, plural, one {1 hour} other {# hours}}',
          { count: hours }
        );
        return `${range} (${durationLabel})`;
      }
      
      return range;
    }
  }
  
  throw new Error('Invalid booking window for formatting');
}

