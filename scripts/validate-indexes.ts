import { Pool } from 'pg';

interface RequiredIndex {
    table: string;
    column: string;
    type: 'GIN' | 'BTREE';
    expression?: string; // For functional indexes like (config -> 'brandId')
}

const REQUIRED_INDEXES: RequiredIndex[] = [
    // Full JSONB indexes
    { table: 'celebrities', column: 'twin_config', type: 'GIN' },
    { table: 'deployments', column: 'config', type: 'GIN' },
    { table: 'conversations', column: 'context', type: 'GIN' },

    // Functional indexes on JSONB fields
    {
        table: 'celebrities',
        column: 'twin_config',
        type: 'GIN',
        expression: "twin_config -> 'voicecloneid'" // Postgres normalizes to lowercase in indexdef
    },
    {
        table: 'deployments',
        column: 'config',
        type: 'GIN',
        expression: "config -> 'customdomain'"
    }
];

async function validateIndexes() {
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️ DATABASE_URL not set. Skipping Index validation.');
        return;
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5000
    });

    try {
        const result = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
    `);

        const existingIndexes = result.rows;
        const missing: RequiredIndex[] = [];

        REQUIRED_INDEXES.forEach(req => {
            const exists = existingIndexes.some(idx => {
                const matchesTable = idx.tablename === req.table;
                const matchesType = idx.indexdef.toUpperCase().includes(`USING ${req.type}`);

                let matchesColumn = false;
                if (req.expression) {
                    // Robust check for expression: remove spaces, quotes, etc to compare
                    const normalizedDef = idx.indexdef.toLowerCase().replace(/\s/g, '').replace(/"/g, '');
                    const normalizedExpr = req.expression.toLowerCase().replace(/\s/g, '').replace(/"/g, '');
                    matchesColumn = normalizedDef.includes(normalizedExpr);
                } else {
                    matchesColumn = idx.indexdef.includes(req.column);
                }

                return matchesTable && matchesType && matchesColumn;
            });

            if (!exists) {
                missing.push(req);
            }
        });

        if (missing.length > 0) {
            console.error('❌ Missing required indexes:');
            missing.forEach(idx => {
                const expr = idx.expression || idx.column;
                console.error(`  - ${idx.type} index on ${idx.table} (${expr})`);
            });
            if (process.env.CI) process.exit(1);
        } else {
            console.log('✅ All required JSONB indexes exist.');
        }

    } catch (err: any) {
        console.error(`❌ Database validation failed: ${err.message}`);
        if (process.env.CI) process.exit(1);
    } finally {
        await pool.end();
    }
}

validateIndexes();
