#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const posSystemDir = 'C:\\IA Marcelo Labs\\vibethink-orchestrator-main\\apps\\dashboard\\app\\dashboard-bundui\\pos-system';

const filesToFix = [
  'components/assign-order-to-table.tsx',
  'components/cart-sheet.tsx',
  'components/cart.tsx',
  'components/product-list-item.tsx',
  'components/product-category-list-item.tsx',
  'components/cart-list-item.tsx',
  'components/add-product-dialog.tsx',
  'tables/components/table-list-item.tsx',
  'tables/tables-render.tsx',
  'tables/components/table-detail-dialog.tsx',
  'tables/components/add-table-dialog.tsx'
];

console.log('🔧 Arreglando imports de POS System...\n');

let fixed = 0;

filesToFix.forEach(file => {
  const filePath = path.join(posSystemDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  No encontrado: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Determinar el nivel de subdirectorios
  const isInSubdir = file.startsWith('tables/components/');
  const prefix = isInSubdir ? '../../' : '../';
  
  // Fix 1: ./store → ../store o ../../store
  content = content.replace(/from "\.\/store"/g, `from "${prefix}store"`);
  content = content.replace(/from '\.\/store'/g, `from '${prefix}store'`);
  
  // Fix 2: @/app/dashboard/(auth)/apps/pos-system/enums → ../enums o ../../enums
  content = content.replace(
    /from "@\/app\/dashboard\/\(auth\)\/apps\/pos-system\/enums"/g,
    `from "${prefix}enums"`
  );
  content = content.replace(
    /from '@\/app\/dashboard\/\(auth\)\/apps\/pos-system\/enums'/g,
    `from '${prefix}enums'`
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}`);
    fixed++;
  } else {
    console.log(`⏭️  ${file} (sin cambios)`);
  }
});

console.log(`\n📊 Resumen:`);
console.log(`   ✅ Archivos arreglados: ${fixed}/${filesToFix.length}\n`);







