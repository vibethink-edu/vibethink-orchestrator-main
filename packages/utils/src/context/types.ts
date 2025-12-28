/**
 * Resource Context Types - ViTo Architecture Spec v3.0.0
 * 
 * Context types for external resource normalization.
 * The timezone belongs to the RESOURCE, not the user.
 * 
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md - PART 3
 */

/**
 * Source system for external integrations
 */
export type SourceSystem = 'airbnb' | 'pms' | 'google_calendar' | 'booking_com' | 'other';

/**
 * Resource Context
 * 
 * Represents an external resource (hotel, studio, etc.) with its timezone.
 * This is the source of truth for timezone in ViTo.
 * 
 * @example
 * const resourceCtx: ResourceContext = {
 *   resourceId: 'airbnb_12345',
 *   sourceSystem: 'airbnb',
 *   timeZone: 'America/Cancun', // From lat/lng or config
 * };
 */
export interface ResourceContext {
  /** Unique identifier for the resource */
  resourceId: string;
  
  /** Source system that provides the data */
  sourceSystem: SourceSystem;
  
  /** IANA timezone string (e.g., 'America/Cancun', 'America/Bogota') */
  timeZone: string;
  
  /** Optional: Additional metadata */
  metadata?: {
    /** Latitude (for geocoding) */
    latitude?: number;
    /** Longitude (for geocoding) */
    longitude?: number;
    /** Display name */
    name?: string;
    /** Address */
    address?: string;
  };
}

/**
 * Helper to create ResourceContext from coordinates
 * 
 * In production, this would use a geocoding service to determine timezone
 * from lat/lng. For now, it's a placeholder.
 * 
 * @example
 * const ctx = createResourceContextFromCoords(
 *   'airbnb_123',
 *   'airbnb',
 *   21.1619, // Cancún lat
 *   -86.8515 // Cancún lng
 * );
 * // Returns: { resourceId: 'airbnb_123', sourceSystem: 'airbnb', timeZone: 'America/Cancun' }
 */
export function createResourceContextFromCoords(
  resourceId: string,
  sourceSystem: SourceSystem,
  latitude: number,
  longitude: number
): ResourceContext {
  // TODO: Implement geocoding service to get timezone from lat/lng
  // For now, return a placeholder
  // In production, use a service like:
  // - Google Time Zone API
  // - TimeZoneDB API
  // - GeoNames API
  
  return {
    resourceId,
    sourceSystem,
    timeZone: 'UTC', // Placeholder - should be determined from lat/lng
    metadata: {
      latitude,
      longitude,
    },
  };
}

/**
 * Helper to create ResourceContext from explicit timezone
 * 
 * @example
 * const ctx = createResourceContext(
 *   'hotel_456',
 *   'pms',
 *   'America/Cancun'
 * );
 */
export function createResourceContext(
  resourceId: string,
  sourceSystem: SourceSystem,
  timeZone: string,
  metadata?: ResourceContext['metadata']
): ResourceContext {
  return {
    resourceId,
    sourceSystem,
    timeZone,
    metadata,
  };
}









