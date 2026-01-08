export type AlertSeverity = 'green' | 'yellow' | 'red';

export interface AllocationAlert {
    type: string;
    severity: AlertSeverity;
    short_explanation: string;
    evidence_refs: string[];
    drilldown_ids: {
        asset_id?: string;
        cost_id?: string; // Expense or MaintenanceEvent ID
        maintenance_event_id?: string;
        owner_id?: string;
        agreement_id?: string;
    };
}

export const ALERT_TYPES = {
    SHARED_COST_MISSING_POLICY: 'shared_cost_missing_policy',
    OWNER_CHARGE_MISMATCH_USAGE: 'owner_charge_mismatch_usage',
    FIXED_COST_SPIKE_WITHOUT_EVIDENCE: 'fixed_cost_spike_without_evidence',
    SCOPE_DRIFT_OWNER_IMPACT: 'scope_drift_owner_impact', // previously 'maintenance_scope_change_owner_impact'
};
