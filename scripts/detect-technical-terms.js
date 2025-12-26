#!/usr/bin/env node

/**
 * Script: detect-technical-terms.js
 *
 * PURPOSE:
 * Detecta términos técnicos que DeepL puede haber traducido incorrectamente
 * en archivos de traducciones IT/KO.
 *
 * USAGE:
 * node scripts/detect-technical-terms.js --locale it
 * node scripts/detect-technical-terms.js --locale ko
 * node scripts/detect-technical-terms.js --locale it --file concept.json
 *
 * OUTPUT:
 * Lista de términos técnicos encontrados con:
 * - ✅ Correctos (traducidos apropiadamente)
 * - ⚠️ Revisar (requieren revisión manual)
 * - ❌ Incorrectos (traducción probable incorrecta)
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// DICCIONARIO DE TÉRMINOS TÉCNICOS
// =============================================================================

/**
 * Términos que NUNCA deben traducirse (mantener en inglés)
 * Estos son estándares de la industria o términos técnicos universales
 */
const KEEP_IN_ENGLISH = [
  // Hotel/Booking Standards
  'check-in',
  'check-out',
  'booking',
  'online',
  'offline',
  'email',
  'Wi-Fi',
  'QR',
  'app',
  'dashboard',
  'API',
  'URL',
  'username',
  'password',
  'login',
  'logout',

  // Tech Terms
  'workspace',
  'dashboard',
  'admin',
  'settings',
  'upload',
  'download',
  'cloud',
  'sync',
  'backup',
  'restore',

  // Date/Time Standards (pueden variar)
  'AM',
  'PM',
];

/**
 * Términos específicos del dominio con traducciones esperadas
 * Format: { term: { it: 'traducción italiana', ko: 'traducción coreana' } }
 */
const DOMAIN_TERMS = {
  // Booking/Reservations
  'reserve': {
    it: ['prenota', 'prenotare', 'riserva'],
    ko: ['예약', '예약하다'],
    note: 'Verbo/sustantivo de reserva'
  },
  'reservation': {
    it: ['prenotazione', 'prenotazioni'],
    ko: ['예약'],
    note: 'Sustantivo de reserva'
  },
  'guest': {
    it: ['ospite', 'ospiti'],
    ko: ['손님', '게스트'],
    note: 'Huésped/invitado'
  },
  'room': {
    it: ['camera', 'camere', 'stanza'],
    ko: ['방', '객실'],
    note: 'Habitación'
  },

  // Studio/Workspace
  'studio': {
    it: ['studio', 'spazio'],
    ko: ['스튜디오', '작업실'],
    note: 'Espacio de trabajo creativo'
  },
  'session': {
    it: ['sessione', 'sessioni'],
    ko: ['세션', '시간'],
    note: 'Sesión de trabajo'
  },
  'equipment': {
    it: ['attrezzatura', 'equipaggiamento'],
    ko: ['장비', '기자재'],
    note: 'Equipo/equipamiento'
  },

  // Coworking
  'cowork': {
    it: ['cowork', 'coworking'],
    ko: ['코워킹', '공유 오피스'],
    note: 'Espacio de trabajo compartido - puede mantenerse en inglés en IT'
  },
  'desk': {
    it: ['scrivania', 'postazione'],
    ko: ['책상', '데스크'],
    note: 'Escritorio/mesa de trabajo'
  },
  'meeting': {
    it: ['riunione', 'meeting'],
    ko: ['회의', '미팅'],
    note: 'Reunión - "meeting" también aceptado en IT'
  },

  // Coliving
  'coliving': {
    it: ['coliving', 'convivenza'],
    ko: ['코리빙', '공동 생활'],
    note: 'Espacio de convivencia - puede mantenerse en inglés en IT'
  },
  'community': {
    it: ['comunità', 'community'],
    ko: ['커뮤니티', '공동체'],
    note: 'Comunidad - "community" también aceptado en IT'
  },
  'kitchen': {
    it: ['cucina'],
    ko: ['부엌', '주방'],
    note: 'Cocina'
  },

  // Restaurant (NUEVO)
  'breakfast': {
    it: ['colazione'],
    ko: ['아침 식사', '조식'],
    note: 'Desayuno'
  },
  'lunch': {
    it: ['pranzo'],
    ko: ['점심', '중식'],
    note: 'Almuerzo'
  },
  'dinner': {
    it: ['cena'],
    ko: ['저녁', '석식'],
    note: 'Cena'
  },
  'menu': {
    it: ['menu', 'menù'],
    ko: ['메뉴'],
    note: 'Menú'
  },
  'table': {
    it: ['tavolo', 'tavola'],
    ko: ['테이블', '탁자'],
    note: 'Mesa'
  },

  // General Actions
  'cancel': {
    it: ['annulla', 'annullare', 'cancella'],
    ko: ['취소', '취소하다'],
    note: 'Cancelar'
  },
  'confirm': {
    it: ['conferma', 'confermare'],
    ko: ['확인', '확인하다'],
    note: 'Confirmar'
  },
  'save': {
    it: ['salva', 'salvare'],
    ko: ['저장', '저장하다'],
    note: 'Guardar'
  },
  'delete': {
    it: ['elimina', 'eliminare', 'cancella'],
    ko: ['삭제', '삭제하다'],
    note: 'Eliminar'
  },
  'edit': {
    it: ['modifica', 'modificare'],
    ko: ['편집', '수정'],
    note: 'Editar'
  },

  // Status
  'available': {
    it: ['disponibile', 'disponibili'],
    ko: ['이용 가능', '사용 가능'],
    note: 'Disponible'
  },
  'occupied': {
    it: ['occupato', 'occupata', 'occupati'],
    ko: ['사용 중', '점유됨'],
    note: 'Ocupado'
  },
  'pending': {
    it: ['in attesa', 'pendente'],
    ko: ['대기 중', '보류'],
    note: 'Pendiente'
  },
  'confirmed': {
    it: ['confermato', 'confermata', 'confermati'],
    ko: ['확인됨', '확정'],
    note: 'Confirmado'
  },
  'cancelled': {
    it: ['annullato', 'annullata', 'cancellato'],
    ko: ['취소됨'],
    note: 'Cancelado'
  },
};

/**
 * Términos que comúnmente se traducen MAL
 * DeepL tiende a traducir literalmente cuando deberían mantenerse o adaptarse
 */
const COMMON_MISTRANSLATIONS = {
  // Italiano
  it: {
    'workspace': {
      wrong: ['spazio di lavoro', 'area di lavoro'],
      correct: 'workspace',
      reason: 'Término técnico estándar, se mantiene en inglés en contexto tech'
    },
    'dashboard': {
      wrong: ['cruscotto', 'pannello di controllo'],
      correct: 'dashboard',
      reason: 'Término técnico estándar UI/UX'
    },
    'admin': {
      wrong: ['amministratore'],
      correct: 'admin',
      reason: 'Abreviación técnica estándar'
    },
    'app': {
      wrong: ['applicazione'],
      correct: 'app',
      reason: 'Abreviación universal'
    },
  },

  // Coreano
  ko: {
    'workspace': {
      wrong: ['작업 공간', '업무 공간'],
      correct: '워크스페이스',
      reason: 'Se transliera en coreano, no se traduce'
    },
    'dashboard': {
      wrong: ['계기판', '대시보드'],
      correct: '대시보드',
      reason: 'Transliteración estándar en coreano'
    },
    'admin': {
      wrong: ['관리자'],
      correct: '관리자',
      reason: 'Traducción correcta en este caso'
    },
  },
};

// =============================================================================
// FUNCIONES DE ANÁLISIS
// =============================================================================

/**
 * Extrae todos los valores de texto de un objeto JSON (recursivo)
 */
function extractTextValues(obj, prefix = '') {
  const results = [];

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      results.push({ key: fullKey, value });
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      results.push(...extractTextValues(value, fullKey));
    }
  });

  return results;
}

/**
 * Verifica si un término técnico está correctamente traducido
 */
function checkTermTranslation(value, locale) {
  const issues = [];

  // 1. Verificar términos que deben mantenerse en inglés
  KEEP_IN_ENGLISH.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = value.match(regex);

    if (matches && matches.length > 0) {
      // El término está presente (correcto)
      issues.push({
        type: 'correct',
        term,
        value,
        message: `✅ Término técnico mantenido correctamente en inglés`
      });
    }
  });

  // 2. Verificar términos del dominio
  Object.entries(DOMAIN_TERMS).forEach(([englishTerm, translations]) => {
    const expectedTranslations = translations[locale];
    if (!expectedTranslations) return;

    const valueLower = value.toLowerCase();
    const hasExpectedTranslation = expectedTranslations.some(trans =>
      valueLower.includes(trans.toLowerCase())
    );

    if (hasExpectedTranslation) {
      issues.push({
        type: 'correct',
        term: englishTerm,
        value,
        message: `✅ Traducción correcta detectada`,
        note: translations.note
      });
    }
  });

  // 3. Verificar errores comunes de DeepL
  const commonErrors = COMMON_MISTRANSLATIONS[locale] || {};
  Object.entries(commonErrors).forEach(([term, config]) => {
    const valueLower = value.toLowerCase();

    config.wrong.forEach(wrongTranslation => {
      if (valueLower.includes(wrongTranslation.toLowerCase())) {
        issues.push({
          type: 'error',
          term,
          value,
          message: `❌ Traducción incorrecta de "${term}"`,
          found: wrongTranslation,
          shouldBe: config.correct,
          reason: config.reason
        });
      }
    });
  });

  return issues;
}

/**
 * Analiza un archivo de traducción
 */
function analyzeTranslationFile(filePath, locale) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo no encontrado: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const textValues = extractTextValues(data);

  const results = {
    file: path.basename(filePath),
    totalStrings: textValues.length,
    issues: {
      correct: [],
      warnings: [],
      errors: []
    }
  };

  textValues.forEach(({ key, value }) => {
    const issues = checkTermTranslation(value, locale);

    issues.forEach(issue => {
      const entry = { key, ...issue };

      if (issue.type === 'correct') {
        results.issues.correct.push(entry);
      } else if (issue.type === 'warning') {
        results.issues.warnings.push(entry);
      } else if (issue.type === 'error') {
        results.issues.errors.push(entry);
      }
    });
  });

  return results;
}

/**
 * Genera reporte de análisis
 */
function generateReport(allResults, locale) {
  console.log('\n' + '='.repeat(80));
  console.log(`REPORTE DE TÉRMINOS TÉCNICOS - ${locale.toUpperCase()}`);
  console.log('='.repeat(80) + '\n');

  let totalCorrect = 0;
  let totalWarnings = 0;
  let totalErrors = 0;

  allResults.forEach(result => {
    if (!result) return;

    const { file, totalStrings, issues } = result;

    totalCorrect += issues.correct.length;
    totalWarnings += issues.warnings.length;
    totalErrors += issues.errors.length;

    console.log(`\n📄 ${file} (${totalStrings} strings)\n`);

    // Mostrar errores (alta prioridad)
    if (issues.errors.length > 0) {
      console.log(`  ❌ ERRORES (${issues.errors.length}):`);
      issues.errors.forEach(({ key, message, found, shouldBe, reason }) => {
        console.log(`     ${key}:`);
        console.log(`       ${message}`);
        console.log(`       Encontrado: "${found}"`);
        console.log(`       Debería ser: "${shouldBe}"`);
        console.log(`       Razón: ${reason}\n`);
      });
    }

    // Mostrar warnings (media prioridad)
    if (issues.warnings.length > 0) {
      console.log(`  ⚠️  REVISAR (${issues.warnings.length}):`);
      issues.warnings.forEach(({ key, message, note }) => {
        console.log(`     ${key}: ${message}`);
        if (note) console.log(`       Nota: ${note}`);
      });
      console.log('');
    }

    // Mostrar aciertos (opcional, solo resumen)
    if (issues.correct.length > 0) {
      console.log(`  ✅ Correctos: ${issues.correct.length}`);
    }
  });

  // Resumen general
  console.log('\n' + '='.repeat(80));
  console.log('RESUMEN GENERAL');
  console.log('='.repeat(80));
  console.log(`✅ Términos correctos: ${totalCorrect}`);
  console.log(`⚠️  Términos a revisar: ${totalWarnings}`);
  console.log(`❌ Errores detectados: ${totalErrors}`);

  if (totalErrors > 0) {
    console.log('\n⚠️  ACCIÓN REQUERIDA:');
    console.log('   Revisa y corrige los errores detectados antes de hacer commit.');
    console.log('   Ejecuta este script nuevamente después de corregir.\n');
  } else if (totalWarnings > 0) {
    console.log('\n💡 RECOMENDACIÓN:');
    console.log('   Revisa manualmente los términos marcados como "REVISAR".');
    console.log('   Verifica que la traducción tenga sentido en contexto.\n');
  } else {
    console.log('\n🎉 ¡Excelente! No se detectaron problemas en términos técnicos.\n');
  }
}

// =============================================================================
// CLI
// =============================================================================

function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let locale = null;
  let specificFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--locale' && args[i + 1]) {
      locale = args[i + 1];
      i++;
    } else if (args[i] === '--file' && args[i + 1]) {
      specificFile = args[i + 1];
      i++;
    }
  }

  // Validar locale
  if (!locale) {
    console.error('❌ ERROR: Debes especificar un locale con --locale');
    console.log('\nUSO:');
    console.log('  node scripts/detect-technical-terms.js --locale it');
    console.log('  node scripts/detect-technical-terms.js --locale ko');
    console.log('  node scripts/detect-technical-terms.js --locale it --file concept.json');
    process.exit(1);
  }

  const SUPPORTED_LOCALES = ['it', 'ko'];
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.error(`❌ ERROR: Locale "${locale}" no soportado`);
    console.log(`   Locales soportados: ${SUPPORTED_LOCALES.join(', ')}`);
    process.exit(1);
  }

  // Ruta base de traducciones
  const translationsDir = path.join(
    __dirname,
    '../apps/dashboard/src/lib/i18n/translations',
    locale
  );

  if (!fs.existsSync(translationsDir)) {
    console.error(`❌ ERROR: Directorio no encontrado: ${translationsDir}`);
    process.exit(1);
  }

  // Obtener archivos a analizar
  let files = [];
  if (specificFile) {
    files = [path.join(translationsDir, specificFile)];
  } else {
    // Analizar TODOS los archivos JSON
    files = fs.readdirSync(translationsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(translationsDir, file));
  }

  // Analizar cada archivo
  const results = files.map(filePath => analyzeTranslationFile(filePath, locale));

  // Generar reporte
  generateReport(results, locale);
}

main();
