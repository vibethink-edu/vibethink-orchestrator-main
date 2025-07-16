#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📊 VERIFICACIÓN RÁPIDA DE VERSIONES');
console.log('='.repeat(50));

// Cargar package.json
try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  console.log(`📦 Package.json versión: ${packageJson.version}`);
  console.log(`📦 Nombre del proyecto: ${packageJson.name}`);
  console.log(`📦 Tipo: ${packageJson.private ? 'Privado' : 'Público'}`);
} catch (error) {
  console.error('❌ Error al cargar package.json:', error.message);
}

// Cargar changelog
try {
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');
  
  // Buscar versiones
  const unreleasedMatch = changelogContent.match(/## \[Unreleased\] - v(\d+\.\d+\.\d+)/);
  const latestVersionMatch = changelogContent.match(/## \[(\d+\.\d+\.\d+)\] - \d{4}-\d{2}-\d{2}/);
  
  console.log(`📝 Changelog última versión: ${latestVersionMatch ? latestVersionMatch[1] : 'N/A'}`);
  console.log(`🚀 Versión en desarrollo: ${unreleasedMatch ? unreleasedMatch[1] : 'N/A'}`);
  console.log(`📋 Tiene cambios pendientes: ${changelogContent.includes('[Unreleased]') ? 'SÍ' : 'NO'}`);
} catch (error) {
  console.error('❌ Error al cargar CHANGELOG.md:', error.message);
}

console.log('\n🎯 ESTADO ACTUAL:');
console.log('✅ Versión 1.1.0 - Sistema de configuraciones implementado');
console.log('🔄 Versión 1.2.0 - En desarrollo (Agentes IA + KB Híbrida)');
console.log('📋 Próximo: v1.3.0 - API pública + microservicios');

console.log('\n' + '='.repeat(50)); 