/**
 * Revenue Share Model
 * Uses discriminating unions to enforce valid 100% splits at compile time.
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
