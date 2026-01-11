import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * VALIDATE UI STABILITY
 * 
 * Enforces:
 * 1. No direct imports from 'lucide-react' in protected areas.
 *    - apps/dashboard/app/dashboard-bundui (Golden Standard)
 *    - apps/admin (Production App)
 * 2. Usage of @vibethink/ui/icons is mandated.
 */

const PROTECTED_PATHS = [
    'apps/dashboard/app/dashboard-bundui',
    'apps/admin/components',
    'apps/admin/app'
];

async function validate() {
    console.log('🛡️  Starting UI Stability Validation...');
    let hasErrors = false;

    // 1. Validate Icon Imports
    for (const searchPath of PROTECTED_PATHS) {
        const fullPath = path.resolve(process.cwd(), searchPath);

        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ Path not found: ${searchPath}`);
            continue;
        }

        const files = await glob('**/*.{ts,tsx}', { cwd: fullPath });

        for (const file of files) {
            const filePath = path.join(fullPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            if (content.match(/from ['"]lucide-react['"]/)) {
                console.error(`❌ VIOLATION in ${path.join(searchPath, file)}`);
                console.error(`   Direct import from 'lucide-react' detected.`);
                console.error(`   👉 ACTION: Change to 'from "@vibethink/ui/icons"'`);
                hasErrors = true;
            }
        }
    }

    if (hasErrors) {
        console.error('\n💥 VALIDATION FAILED');
        console.error('The UI Core is not stable. Please fix the violations above.');
        process.exit(1);
    } else {
        console.log('\n✅ UI STABILITY CONFIRMED');
        console.log('All protected areas are using the Central Icon Vault.');
        console.log('Dashboard Bundui is maintained as the Golden Standard.');
    }
}

validate().catch(console.error);
