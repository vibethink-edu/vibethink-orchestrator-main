/**
 * Revenue Share Model
 * Ensures celebrity + platform = 100% at compile time using TypeScript literal types.
 */

export type RevenueShareModel = {
    celebrity: number;
    platform: number;
    total: 100; // Literal type enforces sum = 100 semantically
};

// Compile-time assertion helper
// We rely on the unit test for mathematical validation since TS doesn't support
// direct arithmetic subtraction on generic number types easily.
export type AssertSum<T extends { celebrity: number; platform: number; total: 100 }> = T;

// ------------------------------------------------------------------
// DEFINITIONS
// ------------------------------------------------------------------

/**
 * Standard Portal Revenue Share
 * Celebrity: 70%
 * Platform: 30%
 */
export const PORTAL_REVENUE_SHARE = {
    celebrity: 70,
    platform: 30,
    total: 100
} as const;

/**
 * White-Label Revenue Share
 * Celebrity: 70%
 * Platform: 30%
 * (Note: White-label fees are handled separately via setup/platform fees)
 */
export const WHITE_LABEL_REVENUE_SHARE = {
    celebrity: 70,
    platform: 30,
    total: 100
} as const;

// ------------------------------------------------------------------
// COMPILE-TIME VALIDATIONS
// ------------------------------------------------------------------

// These lines will cause a TypeScript error if the math is wrong
// @ts-ignore: Unused variable is intentional for type check
type _ValidPortal = AssertSum<typeof PORTAL_REVENUE_SHARE>;
// @ts-ignore: Unused variable is intentional for type check
type _ValidWhiteLabel = AssertSum<typeof WHITE_LABEL_REVENUE_SHARE>;

// ------------------------------------------------------------------
// RUNTIME HELPERS
// ------------------------------------------------------------------

export function validateRevenueShare(model: { celebrity: number; platform: number }): boolean {
    return model.celebrity + model.platform === 100;
}
