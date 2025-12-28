/**
 * DateTime Module - ViTo Architecture Spec v3.0.0
 * 
 * Unified exports for date/time handling with timezone safety.
 */

// Types
export type {
  CivilDate,
  InstantISO,
  BookingUnit,
  ResourceDomain,
  NormalizedWindow,
  BookingWindow,
} from './types';

export {
  isCivilRange,
  isInstantRange,
  isValidCivilDate,
  isValidInstantISO,
} from './types';

// CivilDate utilities
export {
  civilDateToParts,
  civilDateToSafeDate,
  formatCivilDate,
  diffCivilDates,
  diffInstants,
} from './civil';

// Formatting functions
export {
  formatCivilRange,
  formatInstantRange,
  formatBookingRange,
} from './format';











