import { Expense, MaintenanceEvent } from '@vibethink/core-assets';

export interface OwnerParty {
    id: string;
    name: string;
    privacy_flags?: string[];
}

export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export interface SharedOwnershipAgreement {
    asset_id: string;
    owners: {
        owner_id: string;
        share_percentage: number;
    }[];
    policy_id: string;
    billing_cycle: BillingCycle;
    privacy_policy?: string;
}

export type AllocationPolicyType = 'PRO_RATA' | 'BY_USAGE' | 'MIXED';

export interface AllocationPolicy {
    id: string;
    type: AllocationPolicyType;
    params: Record<string, any>; // thresholds, fixed_vs_variable_split, etc.
}

export type LedgerEntryStatus = 'OK' | 'INCOMPLETE_WITH_FLAG';

export interface AllocationLedgerEntry {
    period: {
        start: Date;
        end: Date;
        label: string;
    };
    owner_id: string;
    cost_id: string; // ID of Expense or MaintenanceEvent
    allocated_amount: number;
    rationale: string;
    evidence_refs: string[];
    status: LedgerEntryStatus;
}
