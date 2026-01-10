/**
 * Revenue Share Model
 * 
 * STRICT ALLOWLIST: This type defines the ONLY valid business models supported by the platform.
 * New revenue splits must be explicitly added here after business approval.
 * TS Union Types enforce this at compile time (preventing ad-hoc { 51, 49 } splits).
 */
export type RevenueShareModel =
    | { celebrity: 70; platform: 30; total: 100 }
    | { celebrity: 50; platform: 50; total: 100 }
    | { celebrity: 80; platform: 20; total: 100 }
    | { celebrity: 90; platform: 10; total: 100 };

// ------------------------------------------------------------------
// DEFINITIONS
// ------------------------------------------------------------------

/**
 * Standard Portal Revenue Share
 * Celebrity: 70%
 * Platform: 30%
 */
export const PORTAL_REVENUE_SHARE: RevenueShareModel = {
    celebrity: 70,
    platform: 30,
    total: 100
};

/**
 * White-Label Revenue Share
 * Celebrity: 70%
 * Platform: 30%
 */
export const WHITE_LABEL_REVENUE_SHARE: RevenueShareModel = {
    celebrity: 70,
    platform: 30,
    total: 100
};

// ------------------------------------------------------------------
// RUNTIME HELPERS
// ------------------------------------------------------------------

export function validateRevenueShare(model: RevenueShareModel): boolean {
    return model.celebrity + model.platform === 100;
}
