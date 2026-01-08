import { Asset, UsageEvent, Expense, MaintenanceEvent } from '@vibethink/core-assets';
import { SharedOwnershipAgreement, AllocationPolicy, AllocationLedgerEntry, OwnerParty } from './models';
import { AllocationAlert, ALERT_TYPES } from './alerts';

export class AllocationEngine {

    public calculateAllocation(
        agreement: SharedOwnershipAgreement,
        policy: AllocationPolicy,
        costs: (Expense | MaintenanceEvent)[],
        usageEvents: UsageEvent[],
        period: { start: Date; end: Date; label: string }
    ): { ledger: AllocationLedgerEntry[]; alerts: AllocationAlert[] } {

        const ledger: AllocationLedgerEntry[] = [];
        const alerts: AllocationAlert[] = [];

        for (const cost of costs) {
            if (cost.asset_id !== agreement.asset_id) {
                // Skip costs not for this asset (or could alert)
                continue;
            }

            // Check for missing policy match (rudimentary check if policy type matches logic)
            if (!this.isPolicyCompatible(policy, cost)) {
                alerts.push({
                    type: ALERT_TYPES.SHARED_COST_MISSING_POLICY,
                    severity: 'red',
                    short_explanation: `Policy ${policy.type} not compatible with cost type`,
                    evidence_refs: [],
                    drilldown_ids: { cost_id: cost.id, agreement_id: agreement.policy_id }
                });
                continue; // or degrade
            }

            let costEntries: AllocationLedgerEntry[] = [];

            switch (policy.type) {
                case 'PRO_RATA':
                    costEntries = this.allocateProRata(agreement, cost, period);
                    break;
                case 'BY_USAGE':
                    const usageResult = this.allocateByUsage(agreement, cost, usageEvents, period);
                    costEntries = usageResult.entries;
                    alerts.push(...usageResult.alerts);
                    break;
                case 'MIXED':
                    // Logic: Fixed costs (Maintenance Scheduled, some Expenses) -> Pro Rata
                    // Variable costs (Fuel, Maintenance Unscheduled linked to usage) -> By Usage
                    if (this.isVariableCost(cost)) {
                        const mixedUsageResult = this.allocateByUsage(agreement, cost, usageEvents, period);
                        costEntries = mixedUsageResult.entries;
                        alerts.push(...mixedUsageResult.alerts);
                    } else {
                        costEntries = this.allocateProRata(agreement, cost, period);
                    }
                    break;
                default:
                    // Alert: Unknown policy
                    break;
            }

            ledger.push(...costEntries);
        }

        // Additional generic alerts checks (scope drift, etc.)
        // ...

        return { ledger, alerts };
    }

    private isPolicyCompatible(policy: AllocationPolicy, cost: Expense | MaintenanceEvent): boolean {
        // Placeholder for validity logic
        return true;
    }

    private isVariableCost(cost: Expense | MaintenanceEvent): boolean {
        // Heuristic or Metadata check. For robust implementation, cost category or type should be checked against a configuration.
        // Assuming 'fuel' category or 'unscheduled' maintenance as variable for this example foundational logic.
        if ('category' in cost && cost.category.toLowerCase() === 'fuel') return true;
        if ('type' in cost && cost.type === 'unscheduled') return true; // simplified
        return false;
    }

    private allocateProRata(
        agreement: SharedOwnershipAgreement,
        cost: Expense | MaintenanceEvent,
        period: { start: Date; end: Date; label: string }
    ): AllocationLedgerEntry[] {
        const totalCost = 'amount' in cost ? cost.amount : cost.total_cost;

        return agreement.owners.map(owner => ({
            period,
            owner_id: owner.owner_id,
            cost_id: cost.id,
            allocated_amount: totalCost * (owner.share_percentage / 100),
            rationale: `Pro-rata allocation: ${owner.share_percentage}% of ${totalCost}`,
            evidence_refs: cost.evidence_refs,
            status: 'OK'
        }));
    }

    private allocateByUsage(
        agreement: SharedOwnershipAgreement,
        cost: Expense | MaintenanceEvent,
        usageEvents: UsageEvent[],
        period: { start: Date; end: Date; label: string }
    ): { entries: AllocationLedgerEntry[]; alerts: AllocationAlert[] } {
        const entries: AllocationLedgerEntry[] = [];
        const alerts: AllocationAlert[] = [];

        // 1. Identify relevant usage events for this cost
        // If cost has explicit usage links, use them. Otherwise, use period usage? 
        // Usually variable costs are linked to specific usage events (e.g. fuel for a leg).
        // If cost is for a period (e.g. monthly maintainance variable), we might sum all usage in period.

        let relatedUsage: UsageEvent[] = [];

        // Explicit linking
        if ('usage_event_id' in cost && cost.usage_event_id) {
            const found = usageEvents.find(u => u.id === cost.usage_event_id);
            if (found) relatedUsage.push(found);
        } else if ('usage_event_ids' in cost && cost.usage_event_ids) {
            relatedUsage = usageEvents.filter(u => cost.usage_event_ids?.includes(u.id));
        } else {
            // Fallback: If no explicit link, but it's a variable cost in a "by usage" policy, maybe it applies to all usage in the cost's date/range?
            // For determinism, we require explicit linking or clear period association. 
            // If data is missing -> Alert & Flag.
            alerts.push({
                type: ALERT_TYPES.OWNER_CHARGE_MISMATCH_USAGE,
                severity: 'yellow',
                short_explanation: 'Variable cost without explicit usage linkage. Cannot distribute by usage reliably.',
                evidence_refs: cost.evidence_refs,
                drilldown_ids: { cost_id: cost.id }
            });

            // Failover to incomplete entries (allocated 0 or handle manually)
            return {
                entries: agreement.owners.map(owner => ({
                    period,
                    owner_id: owner.owner_id,
                    cost_id: cost.id,
                    allocated_amount: 0,
                    rationale: 'Missing usage data for distribution',
                    evidence_refs: cost.evidence_refs,
                    status: 'INCOMPLETE_WITH_FLAG'
                })),
                alerts
            };
        }

        // Distribute based on the metric of the related usage
        // Assuming single-user usage events for simplicity (typical in jets: 'Owner A' flew this leg). 
        // If usage is shared (e.g. 2 owners on board), usage event needs to specify 'who'.
        // Core UsageEvent doesn't have 'owner_id' explicitly in the type def provided in prompt, 
        // but usually 'refs' or 'metadata' holds it. OR UsageEvent IS the usage. 
        // We need to know WHO generated the usage.

        // Let's assume UsageEvent has a ref to the owner or we map it externaly. 
        // Since Core UsageEvent ref definition is: refs: { source, source_ids[], tags[] }. 
        // We might look for tag 'owner:ID'. 

        const totalCost = 'amount' in cost ? cost.amount : cost.total_cost;

        // Simple Case: The cost is directly linked to usage events. 
        // We assign the cost to the owners responsible for those usage events.

        const ownerUsageMap = new Map<string, number>();
        let totalMetricValue = 0;

        for (const usage of relatedUsage) {
            // functionality to extract owner from usage is needed here. 
            // Since we are core-agnostic, we rely on a standardized tag or source_id convention?
            // Or we assume the UsageEvent *is* the unit of attribution.

            // For this implementation, I will look for a tag 'owner_id:XYZ' in usage.refs.tags
            const ownerTag = usage.refs.tags.find(t => t.startsWith('owner_id:'));
            if (ownerTag) {
                const ownerId = ownerTag.split(':')[1];
                const current = ownerUsageMap.get(ownerId) || 0;
                ownerUsageMap.set(ownerId, current + usage.metric_value);
                totalMetricValue += usage.metric_value;
            } else {
                // Unattributed usage
                alerts.push({
                    type: ALERT_TYPES.OWNER_CHARGE_MISMATCH_USAGE,
                    severity: 'yellow',
                    short_explanation: `Usage event ${usage.id} has no owner attribution tag`,
                    evidence_refs: [],
                    drilldown_ids: { cost_id: cost.id }
                });
            }
        }

        if (totalMetricValue === 0) {
            return {
                entries: agreement.owners.map(owner => ({
                    period,
                    owner_id: owner.owner_id,
                    cost_id: cost.id,
                    allocated_amount: 0, // Cannot distribute
                    rationale: 'Total usage metric value is 0 or no owners found',
                    evidence_refs: cost.evidence_refs,
                    status: 'INCOMPLETE_WITH_FLAG'
                })),
                alerts
            };
        }

        // If total metric value > 0, distribute. 
        // NOTE: This assumes the cost covers ONLY these usages. 

        agreement.owners.forEach(owner => {
            const usageVal = ownerUsageMap.get(owner.owner_id) || 0;
            const ratio = usageVal / totalMetricValue;
            const allocated = totalCost * ratio;

            entries.push({
                period,
                owner_id: owner.owner_id,
                cost_id: cost.id,
                allocated_amount: allocated,
                rationale: `By Usage: ${usageVal}/${totalMetricValue} units (${(ratio * 100).toFixed(2)}%)`,
                evidence_refs: cost.evidence_refs,
                status: 'OK'
            });
        });

        return { entries, alerts };
    }
}
