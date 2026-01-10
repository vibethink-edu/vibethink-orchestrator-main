import { Pool } from 'pg';

// Configuration
const RETENTION_DAYS = 365; // 1 year
const CRITICAL_THRESHOLD = 1000; // Alert if > 1000 conversations need archiving
const WARNING_THRESHOLD = 100;

async function validateArchival() {
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️ DATABASE_URL not set. Skipping Archival validation.');
        return;
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 10000
    });

    try {
        console.log(`🔍 Checking for unarchived conversations older than ${RETENTION_DAYS} days...`);

        // Simulate query if table doesn't exist (graceful fallback for dev)
        // In real prod this would just run
        const result = await pool.query(`
      SELECT count(*) as count
      FROM conversations 
      WHERE updated_at < NOW() - INTERVAL '${RETENTION_DAYS} days'
        AND is_archived = FALSE
    `);

        const count = parseInt(result.rows[0].count, 10);

        if (count > CRITICAL_THRESHOLD) {
            console.error(`❌ CRITICAL: ${count} conversations require archiving (Threshold: ${CRITICAL_THRESHOLD})`);
            console.error(`👉 Action required: Run 'pnpm run db:archive-conversations' immediately.`);

            // In a real setup, this would trigger PagerDuty or Slack alert via API
            // await sendAlert(...)

            if (process.env.CI) process.exit(1);
        } else if (count > WARNING_THRESHOLD) {
            console.warn(`⚠️ WARNING: ${count} conversations valid for archiving.`);
        } else {
            console.log(`✅ Archival health is good. Only ${count} pending items.`);
        }

    } catch (err: any) {
        // If table doesn't exist yet (fresh install), warn but don't fail
        if (err.code === '42P01') { // undefined_table
            console.warn('⚠️ Conversations table does not exist yet. Skipping check.');
        } else {
            console.error(`❌ Archival check failed: ${err.message}`);
            if (process.env.CI) process.exit(1);
        }
    } finally {
        await pool.end();
    }
}

validateArchival();
