import { createClient } from '@supabase/supabase-js';
import type { IUsageLog } from '@/types/api-keys';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TrackUsageParams {
    tenantId: string;
    apiKeyId: string;
    scope: string;
    operationType: string;
    provider: string;
    model?: string;
    tenantSecretId?: string;
    tokensInput?: number;
    tokensOutput?: number;
    durationMs?: number;
    charactersProcessed?: number;
    costCents: number;
    correlationId: string;
    userId?: string;
    metadata?: Record<string, any>;
}

/**
 * Tracks API key usage asynchronously (fire and forget).
 */
export async function trackUsage(params: TrackUsageParams): Promise<void> {
    const log: Partial<IUsageLog> = {
        tenant_id: params.tenantId,
        api_key_id: params.apiKeyId,
        scope: params.scope,
        operation_type: params.operationType,
        provider: params.provider,
        model_used: params.model,
        tenant_secret_id: params.tenantSecretId,
        tokens_input: params.tokensInput || 0,
        tokens_output: params.tokensOutput || 0,
        duration_ms: params.durationMs,
        characters_processed: params.charactersProcessed,
        cost_cents: params.costCents,
        correlation_id: params.correlationId,
        user_id: params.userId,
        metadata: params.metadata || {},
        currency: 'USD',
        recorded_at: new Date().toISOString(),
    };

    // Fire and forget - don't await the result to block the response
    // In a real high-throughput scenario, this should push to a queue (Upstash/Redis/SQS)
    supabase.from('api_key_usage_logs').insert(log).then(({ error }) => {
        if (error) {
            console.error('Failed to track API usage:', error);
        }
    });
}
