#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: log '📊 VERIFICACIÓN RÁPIDA DE VERSIONES'
// TODO: log '='.repeat(50)

// Cargar package.json
try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  // TODO: log `📦 Package.json versión: ${packageJson.version}`
  // TODO: log `📦 Nombre del proyecto: ${packageJson.name}`
  // TODO: log `📦 Tipo: ${packageJson.private ? 'Privado' : 'Público'}`
} catch (error) {
  // TODO: log '❌ Error al cargar package.json:' error.message
}

// Cargar changelog
try {
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');
  
  // Buscar versiones
  const unreleasedMatch = changelogContent.match(/## \[Unreleased\] - v(\d+\.\d+\.\d+)/);
  const latestVersionMatch = changelogContent.match(/## \[(\d+\.\d+\.\d+)\] - \d{4}-\d{2}-\d{2}/);
  
  // TODO: log `📝 Changelog última versión: ${latestVersionMatch ? latestVersionMatch[1] : 'N/A'}`
  // TODO: log `🚀 Versión en desarrollo: ${unreleasedMatch ? unreleasedMatch[1] : 'N/A'}`
  // TODO: log `📋 Tiene cambios pendientes: ${changelogContent.includes('[Unreleased]') ? 'SÍ' : 'NO'}`
} catch (error) {
  // TODO: log '❌ Error al cargar CHANGELOG.md:' error.message
}

// TODO: log '\n🎯 ESTADO ACTUAL:'
// TODO: log '✅ Versión 1.1.0 - Sistema de configuraciones implementado'
// TODO: log '🔄 Versión 1.2.0 - En desarrollo (Agentes IA + KB Híbrida)'
// TODO: log '📋 Próximo: v1.3.0 - API pública + microservicios'

// TODO: log '\n' + '='.repeat(50) 