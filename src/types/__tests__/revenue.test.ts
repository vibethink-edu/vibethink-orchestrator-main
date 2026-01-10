import { describe, it, expect } from 'vitest';
import {
    PORTAL_REVENUE_SHARE,
    WHITE_LABEL_REVENUE_SHARE,
    validateRevenueShare
} from '../revenue';

describe('Revenue Models', () => {
    describe('Portal Revenue Share', () => {
        it('should have consistent revenue share summing to 100', () => {
            expect(PORTAL_REVENUE_SHARE.celebrity + PORTAL_REVENUE_SHARE.platform).toBe(100);
        });

        it('should pass runtime validation', () => {
            expect(validateRevenueShare(PORTAL_REVENUE_SHARE)).toBe(true);
        });

        it('should match documented values (70/30)', () => {
            expect(PORTAL_REVENUE_SHARE.celebrity).toBe(70);
            expect(PORTAL_REVENUE_SHARE.platform).toBe(30);
        });
    });

    describe('White-Label Revenue Share', () => {
        it('should have consistent revenue share summing to 100', () => {
            expect(WHITE_LABEL_REVENUE_SHARE.celebrity + WHITE_LABEL_REVENUE_SHARE.platform).toBe(100);
        });

        it('should pass runtime validation', () => {
            expect(validateRevenueShare(WHITE_LABEL_REVENUE_SHARE)).toBe(true);
        });

        it('should match documented values (70/30)', () => {
            expect(WHITE_LABEL_REVENUE_SHARE.celebrity).toBe(70);
            expect(WHITE_LABEL_REVENUE_SHARE.platform).toBe(30);
        });
    });

    describe('Validation Logic', () => {
        it('should fail for incorrect sums', () => {
            const invalidShare = { celebrity: 60, platform: 30 }; // Sum = 90
            expect(validateRevenueShare(invalidShare)).toBe(false);
        });

        it('should fail for sums > 100', () => {
            const invalidShare = { celebrity: 80, platform: 30 }; // Sum = 110
            expect(validateRevenueShare(invalidShare)).toBe(false);
        });
    });
});
