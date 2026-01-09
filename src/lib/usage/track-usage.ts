/**
 * Usage Tracking Service
 * 
 * FIT: FIT-API-KEY-MGMT-001-Phase-1
 * Standard: docs/standards/API_KEY_MANAGEMENT.md
 * 
 * Purpose:
 * - Track API usage for billing and analytics
 * - Support event-based (idempotent) and daily aggregate modes
 * - Normalize endpoints for consistent reporting
 * - Support multi-workload billing (voice, agents, documents)
 * 
 * Features:
 * - Idempotent event tracking (anti-double-charge)
 * - Daily aggregates for fast billing queries
 * - Endpoint normalization (replace IDs with :id)
 * - Multi-workload and meter-based billing
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export interface TrackUsageParams {
    // Identity
    tenantId: string;
    apiKeyId: string;
    requestId: string; // For idempotency
    correlationId?: string;

    // Request Details
    method: string; // "GET", "POST", "PUT", "DELETE"
    endpoint: string; // Raw endpoint (will be normalized)
    operationId?: string; // OpenAPI operationId (preferred)
    statusCode: number;
    durationMs?: number;

    // Multi-Workload Billing
    workloadClass?: string; // "voice_processing", "document_scan", "financial_analysis", etc.
    meterKey?: string; // "stt_second", "tts_char", "doc_page", "llm_token", "agent_step", "req"
    meterQty?: number; // Quantity of the meter

    // Legacy Billing (backward compat)
    billableUnits?: number;
    unitType?: string;

    // Token Metrics (for LLM APIs)
    inputTokens?: number;
    outputTokens?: number;

    // Cost
    costUsdMicros?: number; // Cost in microdollars (1,000,000 = $1.00)

    // Context
    userId?: string;
    tenantSecretId?: string; // If using BYOK
    metadata?: Record<string, any>;
}

export type TrackingMode = 'event' | 'daily';

// ============================================================================
// CONFIGURATION
// ============================================================================

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalize endpoint by replacing IDs with :id placeholder
 * Examples:
 * - /v1/reviews/123 => /v1/reviews/:id
 * - /v1/docs/550e8400-e29b-41d4-a716-446655440000 => /v1/docs/:id
 * - /v1/users/abc123/posts/456 => /v1/users/:id/posts/:id
 */
export function normalizeEndpoint(pathname: string): string {
    // Remove query string if present
    const path = pathname.split('?')[0];

    // Split by /
    const segments = path.split('/').filter(Boolean);

    // Replace numeric and UUID segments with :id
    const normalized = segments.map((segment) => {
        // Check if segment is numeric
        if (/^\d+$/.test(segment)) {
            return ':id';
        }

        // Check if segment is UUID
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
            return ':id';
        }

        // Check if segment is alphanumeric ID (e.g., "abc123", "550e8400")
        if (/^[a-z0-9]{6,}$/i.test(segment)) {
            return ':id';
        }

        return segment;
    });

    return '/' + normalized.join('/');
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Track usage in event mode (idempotent)
 * Inserts into api_key_request_events with UNIQUE(tenant_id, request_id)
 */
async function trackEvent(params: TrackUsageParams): Promise<void> {
    const endpointNormalized = normalizeEndpoint(params.endpoint);

    const { error } = await supabase
        .from('api_key_request_events')
        .insert({
            tenant_id: params.tenantId,
            api_key_id: params.apiKeyId,
            request_id: params.requestId,
            correlation_id: params.correlationId || null,
            occurred_at: new Date().toISOString(),
            method: params.method,
            operation_id: params.operationId || null,
            endpoint_normalized: endpointNormalized,
            status_code: params.statusCode,
            duration_ms: params.durationMs || null,
            workload_class: params.workloadClass || 'generic',
            meter_key: params.meterKey || 'req',
            meter_qty: params.meterQty || 1,
            billable_units: params.billableUnits || 1,
            unit_type: params.unitType || 'request',
            input_tokens: params.inputTokens || null,
            output_tokens: params.outputTokens || null,
            cost_usd_micros: params.costUsdMicros || null,
        });

    if (error) {
        // Check if error is due to duplicate request_id (idempotency)
        if (error.code === '23505') { // PostgreSQL unique violation
            console.log('[Usage Tracking] Duplicate request_id (idempotent):', params.requestId);
            return; // Silently ignore (already tracked)
        }

        console.error('[Usage Tracking] Event insert failed:', error);
        throw new Error('Failed to track usage event');
    }
}

/**
 * Track usage in daily mode (aggregate)
 * Upserts into api_key_usage_daily, incrementing counters
 */
async function trackDaily(params: TrackUsageParams): Promise<void> {
    const endpointNormalized = normalizeEndpoint(params.endpoint);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const isError = params.statusCode >= 400;

    // Prepare upsert data
    const upsertData = {
        tenant_id: params.tenantId,
        api_key_id: params.apiKeyId,
        day: today,
        method: params.method,
        operation_id: params.operationId || null,
        endpoint_normalized: endpointNormalized,
        workload_class: params.workloadClass || 'generic',
        meter_key: params.meterKey || 'req',
        request_count: 1,
        error_count: isError ? 1 : 0,
        meter_qty_total: params.meterQty || 1,
        billable_units_total: params.billableUnits || 1,
        input_tokens_total: params.inputTokens || 0,
        output_tokens_total: params.outputTokens || 0,
        cost_usd_micros_total: params.costUsdMicros || 0,
    };

    // Upsert: Insert or update if exists
    const { error } = await supabase
        .from('api_key_usage_daily')
        .upsert(
            upsertData,
            {
                onConflict: 'tenant_id,api_key_id,day,method,endpoint_normalized,workload_class,meter_key',
                ignoreDuplicates: false,
            }
        );

    if (error) {
        console.error('[Usage Tracking] Daily upsert failed:', error);
        throw new Error('Failed to track daily usage');
    }
}

/**
 * Track API usage (main entry point)
 * 
 * @param params - Usage tracking parameters
 * @param mode - Tracking mode: "event" (idempotent) or "daily" (aggregate)
 */
export async function trackUsage(
    params: TrackUsageParams,
    mode: TrackingMode = 'daily'
): Promise<void> {
    try {
        if (mode === 'event') {
            await trackEvent(params);
        } else {
            await trackDaily(params);
        }
    } catch (error) {
        console.error('[Usage Tracking] Failed to track usage:', {
            mode,
            tenantId: params.tenantId,
            apiKeyId: params.apiKeyId,
            requestId: params.requestId,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        // Don't throw - usage tracking should not break the request
    }
}

/**
 * Track usage in both modes (event + daily)
 * Use for critical billing scenarios where you need both audit trail and fast queries
 */
export async function trackUsageDual(params: TrackUsageParams): Promise<void> {
    await Promise.all([
        trackEvent(params),
        trackDaily(params),
    ]);
}
