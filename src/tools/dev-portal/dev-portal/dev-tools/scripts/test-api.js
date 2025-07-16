#!/usr/bin/env node

/**
 * Script de Newman para ejecutar pruebas de API automatizadas
 * Parte del framework de testing VTK 1.0
 */

import newman from 'newman';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const COLLECTION_PATH = 'docs/PROJECT/04_TESTING/postman/AI-Pair-Orchestrator-Pro.postman_collection.json';
const ENV_PATH = 'docs/PROJECT/04_TESTING/postman/environments/development.json';
const REPORTS_DIR = 'docs/PROJECT/04_TESTING/postman/reports';

// Asegurar que el directorio de reportes existe
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Generar timestamp para reportes únicos
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const gitCommit = process.env.GITHUB_SHA?.slice(0, 7) || 'local';

const reportBaseName = `api-test-${timestamp}-commit-${gitCommit}`;

console.log('🚀 Ejecutando pruebas de API con Newman...');
console.log(`📁 Colección: ${COLLECTION_PATH}`);
console.log(`🌐 Environment: ${ENV_PATH}`);
console.log(`📊 Reportes: ${REPORTS_DIR}/${reportBaseName}.*`);

newman.run({
    collection: COLLECTION_PATH,
    environment: ENV_PATH,
    reporters: ['cli', 'json', 'html'],
    reporter: {
        json: {
            export: path.join(REPORTS_DIR, `${reportBaseName}.json`)
        },
        html: {
            export: path.join(REPORTS_DIR, `${reportBaseName}.html`)
        }
    },
    insecure: true, // Para desarrollo local
    timeout: 30000,
    timeoutRequest: 10000,
    iterationCount: 1
}, function (err, summary) {
    if (err) {
        console.error('❌ Error ejecutando Newman:', err);
        process.exit(1);
    }

    console.log('\n📈 Resumen de la ejecución:');
    console.log(`✅ Pruebas ejecutadas: ${summary.run.stats.tests.total}`);
    console.log(`✅ Pruebas pasadas: ${summary.run.stats.tests.passed}`);
    console.log(`❌ Pruebas fallidas: ${summary.run.stats.tests.failed}`);
    console.log(`📦 Requests enviados: ${summary.run.stats.requests.total}`);
    console.log(`⏱️  Tiempo total: ${summary.run.timings.completed}ms`);

    // Actualizar log histórico
    updateHistoricalLog(reportBaseName, summary);

    if (summary.run.stats.tests.failed > 0) {
        console.log('\n❌ Algunas pruebas fallaron. Revisa los reportes para más detalles.');
        process.exit(1);
    } else {
        console.log('\n✅ Todas las pruebas pasaron exitosamente!');
        process.exit(0);
    }
});

function updateHistoricalLog(reportBaseName, summary) {
    const logPath = path.join(REPORTS_DIR, 'README.md');
    const currentDate = new Date().toLocaleString('es-ES');
    const result = summary.run.stats.tests.failed > 0 ? 'FALLO' : 'OK';
    const responsible = process.env.USER || process.env.USERNAME || 'Sistema';
    
    // Crear nueva entrada
    const newEntry = `| ${currentDate} | ${gitCommit} | ${responsible} | ${result} | [HTML](${reportBaseName}.html) | [JSON](${reportBaseName}.json) |`;
    
    if (fs.existsSync(logPath)) {
        let content = fs.readFileSync(logPath, 'utf8');
        
        // Buscar la línea después de la cabecera de la tabla
        const headerIndex = content.indexOf('|--------');
        if (headerIndex !== -1) {
            const afterHeader = content.indexOf('\n', headerIndex) + 1;
            content = content.slice(0, afterHeader) + newEntry + '\n' + content.slice(afterHeader);
        } else {
            // Si no encuentra la tabla, agregar al final
            content += '\n' + newEntry;
        }
        
        fs.writeFileSync(logPath, content);
        console.log(`📝 Log histórico actualizado: ${logPath}`);
    }
}
