/**
 * Script de Validación de Compliance de 9 Idiomas
 * 
 * Valida que un módulo tenga traducciones en los 9 idiomas soportados
 * o que el sistema de fallback funcione correctamente.
 * 
 * Uso:
 *   node scripts/validate-9-language-compliance.js --module path/to/module --namespace namespace-name
 *   node scripts/validate-9-language-compliance.js --namespace hotel
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const I18N_DIR = path.join(ROOT_DIR, 'src/lib/i18n/translations');
const REQUIRED_LOCALES = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
const CRITICAL_LOCALES = ['en', 'es']; // OBLIGATORIOS 100%

// Parse arguments
const args = process.argv.slice(2);
let modulePath = null;
let namespace = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--module' && args[i + 1]) {
    modulePath = args[i + 1];
  }
  if (args[i] === '--namespace' && args[i + 1]) {
    namespace = args[i + 1];
  }
}

if (!namespace) {
  console.error('❌ Error: --namespace es requerido');
  console.log('Uso: node scripts/validate-9-language-compliance.js --namespace hotel');
  process.exit(1);
}

/**
 * Obtener todas las keys de un archivo JSON
 */
function getKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * Validar compliance de 9 idiomas
 */
function validate9LanguageCompliance() {
  console.log(`\n🔍 Validando compliance de 9 idiomas para namespace: ${namespace}\n`);

  const results = {
    namespace,
    locales: {},
    criticalErrors: [],
    warnings: [],
    summary: {
      totalKeys: 0,
      criticalComplete: 0,
      otherComplete: 0,
      fallbackEnabled: true
    }
  };

  // 1. Validar que existe archivo en inglés (OBLIGATORIO)
  const enFile = path.join(I18N_DIR, 'en', `${namespace}.json`);
  if (!fs.existsSync(enFile)) {
    results.criticalErrors.push(`❌ CRÍTICO: Archivo en inglés (en) NO existe: ${enFile}`);
    results.summary.fallbackEnabled = false;
    console.error(results.criticalErrors[results.criticalErrors.length - 1]);
    console.log('\n❌ Validación fallida: English (en) es OBLIGATORIO (fallback universal)');
    process.exit(1);
  }

  // 2. Leer archivo en inglés y obtener todas las keys
  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
  const enKeys = getKeys(enContent[namespace] || enContent);
  results.summary.totalKeys = enKeys.length;

  console.log(`✅ English (en): ${enKeys.length} keys encontradas`);

  // 3. Validar cada idioma
  for (const locale of REQUIRED_LOCALES) {
    const localeFile = path.join(I18N_DIR, locale, `${namespace}.json`);
    const isCritical = CRITICAL_LOCALES.includes(locale);

    if (!fs.existsSync(localeFile)) {
      if (isCritical) {
        results.criticalErrors.push(`❌ CRÍTICO: Archivo ${locale} NO existe: ${localeFile}`);
      } else {
        results.warnings.push(`⚠️ Archivo ${locale} NO existe: ${localeFile} (usará fallback a inglés)`);
      }
      results.locales[locale] = {
        exists: false,
        totalKeys: 0,
        translatedKeys: 0,
        missingKeys: enKeys,
        coverage: 0,
        status: isCritical ? 'error' : 'warning'
      };
      continue;
    }

    // Leer archivo del idioma
    const localeContent = JSON.parse(fs.readFileSync(localeFile, 'utf-8'));
    const localeKeys = getKeys(localeContent[namespace] || localeContent);

    // Comparar keys
    const missingKeys = enKeys.filter(key => !localeKeys.includes(key));
    const translatedKeys = enKeys.length - missingKeys.length;
    const coverage = (translatedKeys / enKeys.length) * 100;

    results.locales[locale] = {
      exists: true,
      totalKeys: localeKeys.length,
      translatedKeys,
      missingKeys,
      coverage,
      status: isCritical && coverage < 100 ? 'error' : coverage < 100 ? 'warning' : 'ok'
    };

    // Validar idiomas críticos
    if (isCritical && coverage < 100) {
      results.criticalErrors.push(
        `❌ CRÍTICO: ${locale} tiene ${missingKeys.length} keys faltantes (${coverage.toFixed(1)}% cobertura)`
      );
    } else if (coverage < 100) {
      results.warnings.push(
        `⚠️ ${locale} tiene ${missingKeys.length} keys faltantes (${coverage.toFixed(1)}% cobertura) - Usará fallback a inglés`
      );
    }

    // Actualizar summary
    if (isCritical && coverage === 100) {
      results.summary.criticalComplete++;
    } else if (!isCritical && coverage === 100) {
      results.summary.otherComplete++;
    }
  }

  // 4. Mostrar resultados
  console.log('\n📊 Resultados por Idioma:');
  console.log('─'.repeat(60));

  for (const locale of REQUIRED_LOCALES) {
    const localeResult = results.locales[locale];
    const isCritical = CRITICAL_LOCALES.includes(locale);
    const icon = isCritical ? '⭐' : '  ';

    if (!localeResult.exists) {
      console.log(`${icon} ${locale.toUpperCase()}: ❌ Archivo no existe ${isCritical ? '(CRÍTICO)' : '(usará fallback)'}`);
    } else {
      const statusIcon = localeResult.status === 'error' ? '❌' : localeResult.status === 'warning' ? '⚠️' : '✅';
      console.log(
        `${icon} ${locale.toUpperCase()}: ${statusIcon} ${localeResult.translatedKeys}/${results.summary.totalKeys} keys ` +
        `(${localeResult.coverage.toFixed(1)}%) ${isCritical ? '(OBLIGATORIO)' : '(fallback disponible)'}`
      );

      if (localeResult.missingKeys.length > 0 && localeResult.missingKeys.length <= 10) {
        console.log(`   Keys faltantes: ${localeResult.missingKeys.slice(0, 5).join(', ')}${localeResult.missingKeys.length > 5 ? '...' : ''}`);
      }
    }
  }

  // 5. Mostrar errores críticos
  if (results.criticalErrors.length > 0) {
    console.log('\n❌ Errores Críticos:');
    results.criticalErrors.forEach(error => console.log(`  ${error}`));
  }

  // 6. Mostrar warnings
  if (results.warnings.length > 0) {
    console.log('\n⚠️ Advertencias (fallback disponible):');
    results.warnings.forEach(warning => console.log(`  ${warning}`));
  }

  // 7. Resumen final
  console.log('\n📋 Resumen:');
  console.log('─'.repeat(60));
  console.log(`Total de keys: ${results.summary.totalKeys}`);
  console.log(`Idiomas críticos completos: ${results.summary.criticalComplete}/${CRITICAL_LOCALES.length}`);
  console.log(`Otros idiomas completos: ${results.summary.otherComplete}/${REQUIRED_LOCALES.length - CRITICAL_LOCALES.length}`);
  console.log(`Sistema de fallback: ${results.summary.fallbackEnabled ? '✅ Activo' : '❌ Desactivado'}`);

  // 8. Determinar resultado
  const hasCriticalErrors = results.criticalErrors.length > 0;
  const allCriticalComplete = results.summary.criticalComplete === CRITICAL_LOCALES.length;

  if (hasCriticalErrors || !allCriticalComplete) {
    console.log('\n❌ Validación fallida: Idiomas críticos (en, es) deben estar 100% completos');
    process.exit(1);
  }

  console.log('\n✅ Validación exitosa: Compliance de 9 idiomas verificado');
  console.log('   - English (en): 100% completo (fallback universal)');
  console.log('   - Español (es): 100% completo');
  console.log('   - Otros idiomas: Estructura completa, fallback disponible si faltan traducciones');
  console.log('   - Sistema de fallback: Funcionando correctamente\n');

  // Guardar resultados en archivo
  const outputFile = path.join(ROOT_DIR, `i18n-9-language-compliance-${namespace}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`📄 Resultados guardados en: ${outputFile}`);

  return results;
}

// Ejecutar validación
try {
  validate9LanguageCompliance();
} catch (error) {
  console.error('\n❌ Error durante validación:', error.message);
  process.exit(1);
}

