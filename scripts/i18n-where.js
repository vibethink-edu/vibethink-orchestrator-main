#!/usr/bin/env node
/**
 * i18n WHERE command - Find term in registry
 *
 * Usage: npm run i18n:where "Patient"
 */

const path = require('path');

// Dynamic import for ES module
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run i18n:where <query>');
    console.error('Example: npm run i18n:where "Patient"');
    process.exit(1);
  }

  const query = args[0];

  try {
    // Import ES module
    const registryPath = path.join(process.cwd(), 'apps/dashboard/src/lib/i18n/registry-loader.ts');
    const { searchTerms } = await import(registryPath);

    console.log(`🔍 Searching for: "${query}"\n`);

    const results = searchTerms(query);

    if (results.length === 0) {
      console.log('❌ No terms found');
      process.exit(1);
    }

    console.log(`✅ Found ${results.length} term(s):\n`);

    results.forEach((term, index) => {
      console.log(`${index + 1}. ${term.key}`);
      console.log(`   Label: ${term.label}`);
      if (term.plural) console.log(`   Plural: ${term.plural}`);
      if (term.context) console.log(`   Context: ${term.context}`);
      if (term.synonyms && term.synonyms.length > 0) {
        console.log(`   Synonyms: ${term.synonyms.join(', ')}`);
      }
      console.log();
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n⚠️  Note: This script requires TypeScript compilation.');
    console.error('   Run: npx tsx scripts/i18n-where.js "<query>"');
    process.exit(1);
  }
}

main();
