/**
 * Document Intelligence Worker - Startup Script
 * 
 * Starts the BullMQ worker for async document processing.
 * 
 * Usage:
 * ```bash
 * node dist/modules/document-intelligence/worker/start.js
 * ```
 * 
 * Environment Variables:
 * - REDIS_URL: Redis connection URL (required)
 * - SUPABASE_URL: Supabase URL (required)
 * - SUPABASE_SERVICE_KEY: Supabase service key (required)
 * - AWS_REGION: AWS region (required)
 * - AWS_S3_BUCKET: S3 bucket name (required)
 * - GEMINI_API_KEY: Gemini API key (required)
 * - DOCINT_WORKER_CONCURRENCY: Worker concurrency (default: 2)
 * - DOCINT_MAX_JOBS_PER_SECOND: Max jobs per second (default: 10)
 * 
 * @module document-intelligence/worker/start
 * @version 2.0.0
 */

import { createClient } from '@supabase/supabase-js';
import { DocumentIntelligenceWorker } from './processor.js';

/**
 * Parse Redis URL
 */
function parseRedisUrl(url: string): { host: string; port: number } {
    const parsed = new URL(url);
    return {
        host: parsed.hostname,
        port: parseInt(parsed.port) || 6379,
    };
}

/**
 * Start worker
 */
async function startWorker() {
    // Validate environment variables
    const requiredEnvVars = [
        'REDIS_URL',
        'SUPABASE_URL',
        'SUPABASE_SERVICE_KEY',
        'AWS_REGION',
        'AWS_S3_BUCKET',
        'GEMINI_API_KEY',
    ];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }

    // Parse configuration
    const redisConnection = parseRedisUrl(process.env.REDIS_URL!);
    const supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );
    const s3Config = {
        bucket: process.env.AWS_S3_BUCKET!,
        region: process.env.AWS_REGION!,
    };
    const geminiApiKey = process.env.GEMINI_API_KEY!;

    const workerOptions = {
        concurrency: parseInt(process.env.DOCINT_WORKER_CONCURRENCY || '2'),
        maxJobsPerSecond: parseInt(process.env.DOCINT_MAX_JOBS_PER_SECOND || '10'),
    };

    // Create worker
    console.log('[Worker] Starting Document Intelligence worker...');
    console.log(`[Worker] Redis: ${redisConnection.host}:${redisConnection.port}`);
    console.log(`[Worker] Concurrency: ${workerOptions.concurrency}`);
    console.log(`[Worker] Max jobs/sec: ${workerOptions.maxJobsPerSecond}`);

    const worker = new DocumentIntelligenceWorker(
        redisConnection,
        supabaseClient,
        s3Config,
        geminiApiKey,
        workerOptions
    );

    console.log('[Worker] Worker started successfully');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        console.log('[Worker] SIGTERM received, shutting down gracefully...');
        await worker.shutdown();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('[Worker] SIGINT received, shutting down gracefully...');
        await worker.shutdown();
        process.exit(0);
    });
}

// Start worker
startWorker().catch((error) => {
    console.error('[Worker] Fatal error:', error);
    process.exit(1);
});
