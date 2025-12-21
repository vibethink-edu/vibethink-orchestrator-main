const fs = require('fs');
const path = require('path');

const json = JSON.parse(fs.readFileSync('apps/dashboard/src/lib/i18n/translations/es/hotel.json', 'utf8'));

console.log('=== Verificando hotel.roomTypes.deluxe ===\n');

// Simular lo que hace el loader
const namespace = 'hotel';
const namespaceContent = json[namespace];
console.log('1. Namespace content extraído:');
console.log('   Keys:', Object.keys(namespaceContent).slice(0, 10));
console.log('   roomTypes existe?', 'roomTypes' in namespaceContent);

// Simular lo que hace useTranslation
// useTranslation('hotel') → t('roomTypes.deluxe') → busca 'hotel.roomTypes.deluxe'
// Pero internamente busca 'roomTypes.deluxe' en namespaceContent

function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
}

const translationKey = 'roomTypes.deluxe';
const value = getNestedValue(namespaceContent, translationKey);

console.log('\n2. Buscando clave:', translationKey);
console.log('   Valor encontrado:', value);
console.log('   Existe?', value !== undefined);

if (!value) {
  console.log('\n❌ PROBLEMA: La clave no se encuentra');
  console.log('   Esto causará que aparezca visible: hotel.roomTypes.deluxe');
  console.log('\n   Verificando estructura:');
  console.log('   namespaceContent.roomTypes:', JSON.stringify(namespaceContent.roomTypes, null, 2));
} else {
  console.log('\n✅ La clave existe y debería funcionar');
  console.log('   Si aparece visible, el problema puede ser:');
  console.log('   - Namespace no está cargado');
  console.log('   - Problema en el loader');
  console.log('   - Problema en getNestedValue');
}

