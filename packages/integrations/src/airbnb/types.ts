/**
 * Airbnb Raw Types
 * 
 * Types for raw Airbnb API payloads (before normalization).
 * These are the "dirty" external types that need to be normalized.
 * 
 * @see docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md - PART 3
 */

/**
 * Raw Airbnb booking payload (example structure)
 * 
 * Note: This is a simplified structure. Real Airbnb API may have more fields.
 */
export interface AirbnbRawBooking {
  listing_id: string;
  check_in: string; // Format: "YYYY-MM-DD" (date only, no timezone)
  check_out: string; // Format: "YYYY-MM-DD" (date only, no timezone)
  guest_count?: number;
  total_price?: number;
  currency?: string;
  status?: string;
  // ... otros campos de Airbnb
}

/**
 * Raw Airbnb listing payload
 */
export interface AirbnbRawListing {
  id: string;
  name?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  // ... otros campos
}











