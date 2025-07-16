#!/usr/bin/env node

import DocumentXTR from './DocumentXTR.js';

console.log('🧪 Probando DocumentXTR...');

async function test() {
  try {
    const documentXTR = new DocumentXTR();
    console.log('✅ DocumentXTR instanciado correctamente');
    
    await documentXTR.execute();
    console.log('✅ DocumentXTR ejecutado correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

test(); 