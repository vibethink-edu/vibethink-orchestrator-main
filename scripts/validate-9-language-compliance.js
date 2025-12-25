#!/usr/bin/env node

/**
 * Script de Validación de Cumplimiento de Idiomas
 * 
 * Verifica que un módulo/componente tenga soporte completo para los 9 idiomas:
 * IMPORTANTE: English (en) SIEMPRE primero, luego el resto
 * en (English), es (Español), fr (Français), pt (Português), de (Deutsch), 
 * it (Italiano), ko (한국어), ar (العربية), zh (中文)
 * 
 * REGLA AUTOMÁTICA: Nuevos componentes/módulos deben incluir TODOS estos idiomas
 * 
 * Uso: node scripts/validate-9-language-compliance.js [namespace|ruta]
 */

const fs = require('fs');
const path = require('path');

// CRITICAL: English MUST be first
// Total: 9 idiomas
const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
const TRANSLATIONS_DIR = 'apps/dashboard/src/lib/i18n/translations';

// Colores para terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
    log(`❌ ${message}`, 'red');
}

function success(message) {
    log(`✅ ${message}`, 'green');
}

function warning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
    log(`ℹ️  ${message}`, 'cyan');
}

/**
 * Obtener namespace desde ruta de archivo
 */
function getNamespaceFromPath(filePath) {
    // Buscar uso de useTranslation en el archivo
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const match = content.match(/useTranslation\(['"`]([^'"`]+)['"`]\)/);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
}

/**
 * Obtener todos los namespaces usados en una ruta
 */
function getNamespacesFromPath(dirPath) {
    const namespaces = new Set();

    function scanDirectory(dir) {
        if (!fs.existsSync(dir)) {
            return;
        }

        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                scanDirectory(filePath);
            } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                const ns = getNamespaceFromPath(filePath);
                if (ns) {
                    namespaces.add(ns);
                }
            }
        }
    }

    scanDirectory(dirPath);
    return Array.from(namespaces);
}

/**
 * Validar que un namespace tenga archivos en los 9 idiomas
 */
function validateNamespace(namespace) {
    const results = {
        namespace,
        compliant: true,
        errors: [],
        warnings: [],
        files: {},
    };

    info(`\n📋 Validando namespace: ${namespace}`);

    // Verificar archivos en cada idioma
    for (const locale of SUPPORTED_LOCALES) {
        const filePath = path.join(TRANSLATIONS_DIR, locale, `${namespace}.json`);

        if (fs.existsSync(filePath)) {
            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                results.files[locale] = {
                    exists: true,
                    valid: true,
                    keys: getKeys(content),
                };
                success(`  ${locale}: Archivo existe y es válido`);
            } catch (e) {
                results.compliant = false;
                results.errors.push(`${locale}: Error parseando JSON - ${e.message}`);
                error(`  ${locale}: Error parseando JSON`);
            }
        } else {
            results.compliant = false;
            results.errors.push(`${locale}: Archivo no existe`);
            error(`  ${locale}: Archivo no existe`);
        }
    }

    // Verificar que todas las keys sean iguales
    if (Object.keys(results.files).length === SUPPORTED_LOCALES.length) {
        const locales = Object.keys(results.files);
        const firstLocale = locales[0];
        const firstKeys = results.files[firstLocale].keys;

        for (let i = 1; i < locales.length; i++) {
            const locale = locales[i];
            const keys = results.files[locale].keys;

            const missingKeys = firstKeys.filter(k => !keys.includes(k));
            const extraKeys = keys.filter(k => !firstKeys.includes(k));

            if (missingKeys.length > 0) {
                results.compliant = false;
                results.errors.push(`${locale}: Faltan keys: ${missingKeys.join(', ')}`);
                error(`  ${locale}: Faltan keys: ${missingKeys.join(', ')}`);
            }

            if (extraKeys.length > 0) {
                results.warnings.push(`${locale}: Keys adicionales: ${extraKeys.join(', ')}`);
                warning(`  ${locale}: Keys adicionales: ${extraKeys.join(', ')}`);
            }
        }
    }

    return results;
}

/**
 * Obtener todas las keys de un objeto JSON (recursivo)
 */
function getKeys(obj, prefix = '') {
    const keys = [];

    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys.push(...getKeys(obj[key], prefix ? `${prefix}.${key}` : key));
        } else {
            keys.push(prefix ? `${prefix}.${key}` : key);
        }
    }

    return keys.sort();
}

/**
 * Validar ruta de componente
 */
function validateComponentPath(componentPath) {
    info(`\n📂 Validando ruta: ${componentPath}`);

    if (!fs.existsSync(componentPath)) {
        error(`Ruta no existe: ${componentPath}`);
        return null;
    }

    const namespaces = getNamespacesFromPath(componentPath);

    if (namespaces.length === 0) {
        warning('No se encontraron namespaces usados en esta ruta');
        warning('Verificar que los componentes usen useTranslation()');
        return null;
    }

    info(`Namespaces encontrados: ${namespaces.join(', ')}`);

    const results = [];
    for (const namespace of namespaces) {
        results.push(validateNamespace(namespace));
    }

    return results;
}

/**
 * Main
 */
function main() {
    const args = process.argv.slice(2);

    log('\n🌍 VALIDACIÓN DE CUMPLIMIENTO DE IDIOMAS (9 idiomas)\n', 'blue');
    log('='.repeat(60), 'blue');

    if (args.length === 0) {
        error('Uso: node scripts/validate-9-language-compliance.js [namespace|ruta]');
        error('Ejemplos:');
        error('  node scripts/validate-9-language-compliance.js api-keys');
        error('  node scripts/validate-9-language-compliance.js apps/dashboard/app/dashboard-bundui/api-keys');
        process.exit(1);
    }

    const input = args[0];
    let results = [];

    // Determinar si es namespace o ruta
    if (input.includes('/') || input.includes('\\')) {
        // Es una ruta
        results = validateComponentPath(input);
    } else {
        // Es un namespace
        results = [validateNamespace(input)];
    }

    if (!results || results.length === 0) {
        process.exit(1);
    }

    // Resumen
    log('\n' + '='.repeat(60), 'blue');
    log('\n📊 RESUMEN\n', 'blue');

    let allCompliant = true;

    for (const result of results) {
        if (result.compliant) {
            success(`✅ ${result.namespace}: CUMPLE con 9 idiomas`);
        } else {
            allCompliant = false;
            error(`❌ ${result.namespace}: NO CUMPLE con 9 idiomas`);

            if (result.errors.length > 0) {
                log('\nErrores:', 'red');
                result.errors.forEach(err => error(`  - ${err}`));
            }
        }

        if (result.warnings.length > 0) {
            log('\nAdvertencias:', 'yellow');
            result.warnings.forEach(warn => warning(`  - ${warn}`));
        }
    }

    log('\n' + '='.repeat(60), 'blue');

    if (allCompliant) {
        success('\n🎉 TODOS LOS NAMESPACES CUMPLEN CON 9 IDIOMAS\n');
        process.exit(0);
    } else {
        error('\n⚠️  ALGUNOS NAMESPACES NO CUMPLEN CON 9 IDIOMAS\n');
        error('Por favor, corrige los errores antes de finalizar.\n');
        process.exit(1);
    }
}

// Ejecutar
if (require.main === module) {
    main();
}

module.exports = { validateNamespace, validateComponentPath };
