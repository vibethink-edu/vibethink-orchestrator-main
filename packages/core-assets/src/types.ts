export type AssetType = string;

export interface Asset {
    id: string;
    type: AssetType; // Extensible enum-like string
    metadata: Record<string, any>;
}

export type UsageMetric = 'hours' | 'legs' | 'nights' | 'custom';

export interface UsageEvent {
    id: string;
    asset_id: string;
    start_at: Date;
    end_at: Date;
    usage_metric: UsageMetric;
    metric_value: number;
    refs: {
        source: string;
        source_ids: string[];
        tags: string[];
    };
}

export interface Expense {
    id: string;
    asset_id: string;
    amount: number;
    currency: string;
    date: Date;
    category: string;
    provider: string;
    evidence_refs: string[];
    usage_event_id?: string;
}

export type MaintenanceType = 'scheduled' | 'unscheduled';

export interface MaintenanceEvent {
    id: string;
    asset_id: string;
    type: MaintenanceType;
    start_at: Date;
    end_at: Date;
    total_cost: number;
    baseline_scope_hash?: string;
    evidence_refs: string[];
    usage_event_ids?: string[];
}

export type EvidenceSource = 'upload' | 'email' | 'system';

export interface DocumentEvidence {
    id: string;
    source: EvidenceSource;
    hash: string;
    links: string[];
}
