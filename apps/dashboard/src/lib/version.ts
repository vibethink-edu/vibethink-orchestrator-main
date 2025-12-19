/**
 * Version Management
 * 
 * Single Source of Truth for application versioning.
 * Following Semantic Versioning (https://semver.org/)
 * 
 * Usage:
 * - Import APP_VERSION in Footer components
 * - Update APP_VERSION_NUMBER and APP_VERSION_DESCRIPTOR for each release
 * - APP_VERSION auto-generates from these values
 */

/**
 * Semantic version number (MAJOR.MINOR.PATCH)
 * - MAJOR: Breaking changes
 * - MINOR: New features (backward compatible)
 * - PATCH: Bug fixes (backward compatible)
 */
export const APP_VERSION_NUMBER = '0.2.0';

/**
 * Short description of this version (3-5 words)
 * Used in APP_VERSION string
 */
export const APP_VERSION_DESCRIPTOR = 'i18n System & Architecture Consolidation';

/**
 * Full version string
 * Auto-generated from APP_VERSION_NUMBER and APP_VERSION_DESCRIPTOR
 * Format: "V{MAJOR}.{MINOR}.{PATCH} ({DESCRIPTOR})"
 */
export const APP_VERSION = `V${APP_VERSION_NUMBER} (${APP_VERSION_DESCRIPTOR})`;

/**
 * Version metadata
 */
export const VERSION_INFO = {
  number: APP_VERSION_NUMBER,
  descriptor: APP_VERSION_DESCRIPTOR,
  full: APP_VERSION,
  releaseDate: '2025-01-XX',
} as const;


