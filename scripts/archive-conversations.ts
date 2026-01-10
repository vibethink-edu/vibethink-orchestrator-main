import { Pool } from 'pg';

const RETENTION_DAYS = 365;
const BATCH_SIZE_PER_TENANT = 500;

async function archiveConversations() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is required.');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 10000
    });

    try {
        console.log(`📦 Starting Multi-Tenant Archival Job (Limit: ${RETENTION_DAYS} days)...`);

        // 1. Get List of Tenants (Companies) with data to archive
        // Using DISTINCT filtering to only process relevant tenants
        const tenantsResult = await pool.query(`
            SELECT DISTINCT company_id 
            FROM conversations 
            WHERE updated_at < NOW() - INTERVAL '${RETENTION_DAYS} days'
              AND is_archived = FALSE
        `);

        const tenants = tenantsResult.rows.map(r => r.company_id);

        if (tenants.length === 0) {
            console.log('✅ No tenants require archival actions.');
            return;
        }

        console.log(`ℹ️ Found ${tenants.length} tenants with archivable data.`);

        let totalArchived = 0;

        // 2. Process per Tenant (maintaining isolation logic)
        for (const companyId of tenants) {
            if (!companyId) continue; // Skip nulls if any

            console.log(`Processing Tenant: ${companyId}...`);

            const result = await pool.query(`
                UPDATE conversations
                SET is_archived = TRUE, archived_at = NOW()
                WHERE id IN (
                    SELECT id FROM conversations
                    WHERE company_id = $1
                      AND updated_at < NOW() - INTERVAL '${RETENTION_DAYS} days'
                      AND is_archived = FALSE
                    LIMIT ${BATCH_SIZE_PER_TENANT}
                )
                RETURNING id
            `, [companyId]);

            const count = result.rowCount || 0;
            totalArchived += count;

            if (count > 0) {
                console.log(`  -> Archived ${count} conversations for ${companyId}`);
            }

            // Safety pause between tenants to not hog DB
            await new Promise(r => setTimeout(r, 100));
        }

        console.log(`✅ Job Complete. Total archived: ${totalArchived} conversations across ${tenants.length} tenants.`);

    } catch (err: any) {
        console.error(`❌ Archival job failed: ${err.message}`);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

archiveConversations();
