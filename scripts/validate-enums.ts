import { Pool } from 'pg';

const REQUIRED_ENUMS = [
    'celebrity_type',
    'entity_status',
    'deployment_type',
    'transaction_type'
];

async function validateEnums() {
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️ DATABASE_URL not set. Skipping ENUM validation.');
        return;
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5000 // 5s timeout
    });

    try {
        console.log('Connecting to database...');
        const result = await pool.query(`
      SELECT typname 
      FROM pg_type 
      JOIN pg_enum ON pg_enum.enumtypid = pg_type.oid 
      GROUP BY typname
    `);

        // Also check standard pg_type for enums
        const typeResult = await pool.query(`
      SELECT typname FROM pg_type WHERE typtype = 'e'
    `);

        const existingEnums = new Set([
            ...result.rows.map(row => row.typname),
            ...typeResult.rows.map(row => row.typname)
        ]);

        const missing = REQUIRED_ENUMS.filter(e => !existingEnums.has(e));

        if (missing.length > 0) {
            console.error(`❌ Missing required ENUMs in database: ${missing.join(', ')}`);
            // Warning for now, exit 1 when migrations are fully automated
            console.warn('⚠️ Please ensure migrations are run to create these ENUM types.');
            process.exit(1);
        }

        console.log('✅ All required ENUMs exist in the database.');
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`❌ Database validation failed: ${message}`);
        // If connection fails in CI, we want to fail. Locally we might just warn.
        if (process.env.CI) {
            process.exit(1);
        }
    } finally {
        await pool.end();
    }
}

validateEnums();
