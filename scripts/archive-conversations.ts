import { Pool } from 'pg';

const RETENTION_DAYS = 365;
const BATCH_SIZE_PER_TENANT = 500;

/**
 * Multi-Tenant Archival Job
 * 
 * Usage:
 *   # Archive all tenants
 *   pnpm run db:archive-conversations
 * 
 *   # Archive specific tenant (recommended for testing)
 *   COMPANY_ID=abc-123 pnpm run db:archive-conversations
 * 
 *   # Dry run (no changes)
 *   DRY_RUN=true pnpm run db:archive-conversations
 */

interface ArchivalConfig {
    companyId?: string;
    dryRun: boolean;
    retentionDays: number;
    batchSize: number;
}

function getConfig(): ArchivalConfig {
    return {
        companyId: process.env.COMPANY_ID,
        dryRun: process.env.DRY_RUN === 'true',
        retentionDays: parseInt(process.env.RETENTION_DAYS || String(RETENTION_DAYS)),
        batchSize: parseInt(process.env.BATCH_SIZE || String(BATCH_SIZE_PER_TENANT))
    };
}

async function validateCompanyId(pool: Pool, companyId: string): Promise<boolean> {
    const result = await pool.query(
        'SELECT EXISTS(SELECT 1 FROM conversations WHERE company_id = $1) as exists',
        [companyId]
    );
    return result.rows[0]?.exists || false;
}

async function archiveConversations() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is required.');
        process.exit(1);
    }

    const config = getConfig();

    // Log configuration
    console.log('📋 Configuration:');
    console.log(`  - Retention Days: ${config.retentionDays}`);
    console.log(`  - Batch Size: ${config.batchSize}`);
    console.log(`  - Dry Run: ${config.dryRun ? 'YES' : 'NO'}`);
    console.log(`  - Target Company: ${config.companyId || 'ALL'}`);
    console.log('');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 10000
    });

    try {
        console.log(`📦 Starting Multi-Tenant Archival Job...`);

        // Validate company_id if specified
        if (config.companyId) {
            console.log(`🔍 Validating company_id: ${config.companyId}...`);
            const exists = await validateCompanyId(pool, config.companyId);

            if (!exists) {
                console.error(`❌ Company ID "${config.companyId}" not found in database.`);
                console.error('💡 Check COMPANY_ID environment variable.');
                process.exit(1);
            }

            console.log(`✅ Company ID validated.\n`);
        }

        // 1. Get List of Tenants (Companies) with data to archive
        // Using DISTINCT filtering to only process relevant tenants
        const tenantsQuery = config.companyId
            ? `SELECT $1::text as company_id WHERE EXISTS(
                 SELECT 1 FROM conversations 
                 WHERE company_id = $1 
                   AND updated_at < NOW() - ($2 || ' days')::interval
                   AND is_archived = FALSE
               )`
            : `SELECT DISTINCT company_id 
               FROM conversations 
               WHERE updated_at < NOW() - ($1 || ' days')::interval
                 AND is_archived = FALSE`;

        const tenantsResult = config.companyId
            ? await pool.query(tenantsQuery, [config.companyId, config.retentionDays])
            : await pool.query(tenantsQuery, [config.retentionDays]);

        const tenants = tenantsResult.rows.map(r => r.company_id).filter(Boolean);

        if (tenants.length === 0) {
            console.log('✅ No tenants require archival actions.');
            return;
        }

        console.log(`ℹ️  Found ${tenants.length} tenant(s) with archivable data.`);

        if (config.dryRun) {
            console.log('⚠️  DRY RUN MODE - No changes will be made.\n');
        }

        let totalArchived = 0;

        // 2. Process per Tenant (maintaining isolation logic)
        for (const companyId of tenants) {
            console.log(`Processing Tenant: ${companyId}...`);

            if (config.dryRun) {
                // Dry run: just count what would be archived
                const countResult = await pool.query(`
                    SELECT COUNT(*) as count
                    FROM conversations
                    WHERE company_id = $1
                      AND updated_at < NOW() - ($2 || ' days')::interval
                      AND is_archived = FALSE
                    LIMIT $3
                `, [companyId, config.retentionDays, config.batchSize]);

                const count = parseInt(countResult.rows[0]?.count || '0');
                totalArchived += count;

                if (count > 0) {
                    console.log(`  -> Would archive ${count} conversations for ${companyId}`);
                }
            } else {
                // Real execution
                const result = await pool.query(`
                    UPDATE conversations
                    SET is_archived = TRUE, archived_at = NOW()
                    WHERE id IN (
                        SELECT id FROM conversations
                        WHERE company_id = $1
                          AND updated_at < NOW() - ($2 || ' days')::interval
                          AND is_archived = FALSE
                        LIMIT $3
                    )
                    RETURNING id
                `, [companyId, config.retentionDays, config.batchSize]);

                const count = result.rowCount || 0;
                totalArchived += count;

                if (count > 0) {
                    console.log(`  -> Archived ${count} conversations for ${companyId}`);
                }
            }

            // Safety pause between tenants to not hog DB
            await new Promise(r => setTimeout(r, 100));
        }

        console.log('');
        console.log(`✅ Job Complete. Total ${config.dryRun ? 'would archive' : 'archived'}: ${totalArchived} conversations across ${tenants.length} tenant(s).`);

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`❌ Archival job failed: ${message}`);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

archiveConversations();

