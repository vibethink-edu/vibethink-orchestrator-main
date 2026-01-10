import { Pool } from 'pg';

const RETENTION_DAYS = 365;
const BATCH_SIZE = 1000;

async function archiveConversations() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is required.');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        console.log(`📦 Starting archival job (Limit: ${RETENTION_DAYS} days)...`);

        // In a real implementation:
        // 1. Select candidates
        // 2. Move to cold storage (S3/Glacier)
        // 3. Mark as archived OR delete from hot DB

        // Stub implementation for update only
        const result = await pool.query(`
      UPDATE conversations
      SET is_archived = TRUE, archived_at = NOW()
      WHERE id IN (
        SELECT id FROM conversations
        WHERE updated_at < NOW() - INTERVAL '${RETENTION_DAYS} days'
          AND is_archived = FALSE
        LIMIT ${BATCH_SIZE}
      )
      RETURNING id
    `);

        console.log(`✅ Archived ${result.rowCount} conversations.`);

        if (result.rowCount === BATCH_SIZE) {
            console.log('ℹ️ Batch limit reached. Run again to archive more.');
        }

    } catch (err: any) {
        console.error(`❌ Archival job failed: ${err.message}`);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

archiveConversations();
