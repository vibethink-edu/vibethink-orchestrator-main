import { describe, it, expect } from 'vitest';
import { AllocationEngine } from '../src/engine';
import { SharedOwnershipAgreement, AllocationPolicy, OwnerParty } from '../src/models';
import { Expense, UsageEvent } from '@vibethink/core-assets';

describe('AllocationEngine (Deterministic)', () => {
    const engine = new AllocationEngine();

    const owners: { owner_id: string; share_percentage: number }[] = [
        { owner_id: 'owner_A', share_percentage: 50 },
        { owner_id: 'owner_B', share_percentage: 50 }
    ];

    const agreement: SharedOwnershipAgreement = {
        asset_id: 'asset_1',
        owners,
        policy_id: 'policy_1',
        billing_cycle: 'monthly'
    };

    const period = { start: new Date('2026-01-01'), end: new Date('2026-01-31'), label: 'Jan 2026' };

    it('PRO_RATA: allocates cost 50/50', () => {
        const policy: AllocationPolicy = { id: 'p1', type: 'PRO_RATA', params: {} };
        const cost: Expense = {
            id: 'cost_1',
            asset_id: 'asset_1',
            amount: 1000,
            currency: 'USD',
            date: new Date('2026-01-15'),
            category: 'insurance',
            provider: 'Provider X',
            evidence_refs: []
        };

        const { ledger, alerts } = engine.calculateAllocation(agreement, policy, [cost], [], period);

        expect(alerts).toHaveLength(0);
        expect(ledger).toHaveLength(2);
        expect(ledger.find(e => e.owner_id === 'owner_A')?.allocated_amount).toBe(500);
        expect(ledger.find(e => e.owner_id === 'owner_B')?.allocated_amount).toBe(500);
        expect(ledger[0].status).toBe('OK');
    });

    it('BY_USAGE: allocates variable cost by usage metric', () => {
        const policy: AllocationPolicy = { id: 'p2', type: 'BY_USAGE', params: {} };
        const cost: Expense = {
            id: 'fuel_1',
            asset_id: 'asset_1',
            amount: 2000,
            currency: 'USD',
            date: new Date('2026-01-10'),
            category: 'fuel',
            provider: 'Fuel Co',
            evidence_refs: [],
            usage_event_ids: ['u1', 'u2'] // explicitly linked
        };

        // Owner A flew 1.5 hours, Owner B flew 0.5 hours
        const usageEvents: UsageEvent[] = [
            {
                id: 'u1', asset_id: 'asset_1', start_at: new Date(), end_at: new Date(), usage_metric: 'hours', metric_value: 1.5,
                refs: { source: 'test', source_ids: [], tags: ['owner_id:owner_A'] }
            },
            {
                id: 'u2', asset_id: 'asset_1', start_at: new Date(), end_at: new Date(), usage_metric: 'hours', metric_value: 0.5,
                refs: { source: 'test', source_ids: [], tags: ['owner_id:owner_B'] }
            }
        ];

        const { ledger, alerts } = engine.calculateAllocation(agreement, policy, [cost], usageEvents, period);

        expect(alerts).toHaveLength(0);
        // Total usage = 2.0. Cost = 2000.
        // A: 1.5/2.0 * 2000 = 1500
        // B: 0.5/2.0 * 2000 = 500
        expect(ledger.find(e => e.owner_id === 'owner_A')?.allocated_amount).toBe(1500);
        expect(ledger.find(e => e.owner_id === 'owner_B')?.allocated_amount).toBe(500);
    });

    it('BY_USAGE: alerts on missing owner tags (unattributed usage)', () => {
        const policy: AllocationPolicy = { id: 'p2', type: 'BY_USAGE', params: {} };
        const cost: Expense = {
            id: 'fuel_1',
            asset_id: 'asset_1',
            amount: 100,
            currency: 'USD',
            date: new Date('2026-01-10'),
            category: 'fuel',
            provider: 'Fuel Co',
            evidence_refs: [],
            usage_event_ids: ['u_ghost']
        };

        const usageEvents: UsageEvent[] = [
            {
                id: 'u_ghost', asset_id: 'asset_1', start_at: new Date(), end_at: new Date(), usage_metric: 'hours', metric_value: 1.0,
                refs: { source: 'test', source_ids: [], tags: [] } // No owner tag
            }
        ];

        const { ledger, alerts } = engine.calculateAllocation(agreement, policy, [cost], usageEvents, period);

        // Should have an alert for mismatch/missing attribution
        expect(alerts.length).toBeGreaterThan(0);
        expect(alerts[0].type).toBe('owner_charge_mismatch_usage');
        // Ledger might be empty or 0 allocation depending on logic, check status
        // In current logic, if total metric value is > 0 but no owner map hits (because no tags), it might return all 0.
        // Or if total metric is > 0, but ownerUsageMap is empty?
        // Let's check logic:
        // for usage in related: if no tag, alert. 
        // totalMetricValue += usage.metric_value (so total is 100).
        // ownerUsageMap is empty.
        // Loop owners: usageVal=0. ratio=0. allocated=0.

        expect(ledger.find(e => e.owner_id === 'owner_A')?.allocated_amount).toBe(0);
    });

    it('MIXED: allocates fixed as PRO_RATA and variable as BY_USAGE', () => {
        const policy: AllocationPolicy = { id: 'p3', type: 'MIXED', params: {} };

        const fixedCost: Expense = {
            id: 'insurance_1',
            asset_id: 'asset_1',
            amount: 500,
            category: 'insurance', // not variable in default logic
            currency: 'USD', date: new Date(), provider: 'InsureCo', evidence_refs: []
        };

        const variableCost: Expense = {
            id: 'fuel_2',
            asset_id: 'asset_1',
            amount: 200,
            category: 'fuel', // variable
            currency: 'USD', date: new Date(), provider: 'FuelCo', evidence_refs: [],
            usage_event_ids: ['u3']
        };

        const usageEvents: UsageEvent[] = [
            {
                id: 'u3', asset_id: 'asset_1', metric_value: 10, usage_metric: 'hours', start_at: new Date(), end_at: new Date(),
                refs: { source: 't', source_ids: [], tags: ['owner_id:owner_A'] } // only Owner A flew
            }
        ];

        const { ledger } = engine.calculateAllocation(agreement, policy, [fixedCost, variableCost], usageEvents, period);

        // Fixed: 500 split 50/50 -> 250 each.
        // Variable: 200 split 100/0 -> Owner A gets 200.

        const totalA = ledger.filter(e => e.owner_id === 'owner_A').reduce((sum, e) => sum + e.allocated_amount, 0);
        const totalB = ledger.filter(e => e.owner_id === 'owner_B').reduce((sum, e) => sum + e.allocated_amount, 0);

        expect(totalA).toBe(250 + 200); // 450
        expect(totalB).toBe(250 + 0);   // 250
    });

});
