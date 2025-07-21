#!/usr/bin/env node

/**
 * Evidence Generator - UBICACIÓN CORRECTA: docs/PROJECT/09_EVIDENCES/
 * Generates evidence with user information from system/git/environment
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

// TODO: log '🔍 GENERADOR DE EVIDENCIAS - UBICACIÓN CORRECTA'
// TODO: log '📁 Ubicación: docs/PROJECT/09_EVIDENCES/'
// TODO: log '='.repeat(60)

const timestamp = new Date().toISOString();
const formName = process.argv[2] || 'LoginForm';
const executionId = `${timestamp.replace(/[:.]/g, '-')}-${Math.random().toString(36).substr(2, 6)}`;

// Get user information from multiple sources
function getUserInfo() {
  // TODO: log '\n🔍 DETECTANDO INFORMACIÓN DEL USUARIO...'
  
  // Method 1: Environment variables
  const envUsername = process.env.USERNAME || process.env.USER;
  const envEmail = process.env.USEREMAIL || process.env.EMAIL;
  const envFullName = process.env.USERFULLNAME;
  
  // TODO: log `📌 Variables de entorno:`
  // TODO: log `   USERNAME/USER: ${envUsername || 'no encontrado'}`
  // TODO: log `   EMAIL: ${envEmail || 'no encontrado'}`
  // TODO: log `   FULLNAME: ${envFullName || 'no encontrado'}`
  
  // Method 2: OS user info
  let osUser = {};
  try {
    osUser = os.userInfo();
    // TODO: log `📌 Sistema operativo:`
    // TODO: log `   os.userInfo().username: ${osUser.username}`
    // TODO: log `   os.userInfo().homedir: ${osUser.homedir}`
  } catch (error) {
    // TODO: log `❌ os.userInfo() falló: ${error.message}`
  }
  
  // Method 3: Git configuration
  let gitUser = {};
  try {
    gitUser.name = execSync('git config user.name', { encoding: 'utf8' }).trim();
    gitUser.email = execSync('git config user.email', { encoding: 'utf8' }).trim();
    // TODO: log `📌 Configuración Git:`
    // TODO: log `   git config user.name: ${gitUser.name}`
    // TODO: log `   git config user.email: ${gitUser.email}`
  } catch (error) {
    // TODO: log `❌ Git config falló: ${error.message}`
  }
  
  // Method 4: Computer/Machine name
  const hostname = os.hostname();
  // TODO: log `📌 Información del sistema:`
  // TODO: log `   hostname: ${hostname}`
  // TODO: log `   platform: ${os.platform()}`
  
  // Combine all sources with priority
  const finalUserInfo = {
    username: envUsername || osUser.username || 'unknown',
    full_name: gitUser.name || envFullName || envUsername || osUser.username || 'Usuario Desconocido',
    email: gitUser.email || envEmail || `${envUsername || osUser.username || 'user'}@company.com`,
    employee_id: process.env.EMPLOYEE_ID || `EMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    role: process.env.USER_ROLE || 'developer',
    department: process.env.USER_DEPARTMENT || 'engineering',
    machine: hostname,
    source_priority: {
      username_from: envUsername ? 'environment' : osUser.username ? 'os' : 'fallback',
      fullname_from: gitUser.name ? 'git' : envFullName ? 'environment' : 'fallback',
      email_from: gitUser.email ? 'git' : envEmail ? 'environment' : 'generated'
    }
  };
  
  // TODO: log `\n✅ INFORMACIÓN FINAL DEL USUARIO:`
  // TODO: log `   👤 Nombre completo: ${finalUserInfo.full_name} (fuente: ${finalUserInfo.source_priority.fullname_from})`
  // TODO: log `   📧 Email: ${finalUserInfo.email} (fuente: ${finalUserInfo.source_priority.email_from})`
  // TODO: log `   💻 Username: ${finalUserInfo.username} (fuente: ${finalUserInfo.source_priority.username_from})`
  // TODO: log `   🏢 Departamento: ${finalUserInfo.department}`
  // TODO: log `   🆔 Employee ID: ${finalUserInfo.employee_id}`
  
  return finalUserInfo;
}

// Create evidence structure in correct location
function createEvidenceStructure() {
  const dirs = [
    'docs/PROJECT/09_EVIDENCES/by-application/login/components/LoginForm/unit-tests',
    'docs/PROJECT/09_EVIDENCES/by-application/login/components/LoginForm/integration-tests',
    'docs/PROJECT/09_EVIDENCES/by-application/login/components/LoginForm/e2e-tests',
    'docs/PROJECT/09_EVIDENCES/by-application/login/components/LoginForm/quality-reports',
    'docs/PROJECT/09_EVIDENCES/by-application/login/components/LoginForm/audit-trail',
    'docs/PROJECT/09_EVIDENCES/by-module/authentication/components',
    'docs/PROJECT/09_EVIDENCES/consolidated/by-date/' + new Date().toISOString().split('T')[0],
    'docs/PROJECT/09_EVIDENCES/consolidated/by-user',
    'docs/PROJECT/09_EVIDENCES/consolidated/by-execution-id'
  ];

  // TODO: log '\n📁 CREANDO ESTRUCTURA DE EVIDENCIAS...'
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      // TODO: log `✅ Creado: ${dir}`
    }
  });
}

// Generate evidence with correct location and user info
function generateEvidence() {
  const userInfo = getUserInfo();
  const startTime = new Date().toISOString();
  
  // Get git information
  let gitInfo = {};
  try {
    gitInfo.branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    gitInfo.commit_hash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    gitInfo.commit_message = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
  } catch (error) {
    gitInfo.branch = 'unknown';
    gitInfo.commit_hash = 'unknown';
    gitInfo.commit_message = 'Git not available';
  }
  
  const evidenceData = {
    evidence_execution: {
      execution_id: executionId,
      timestamp: startTime,
      location: "docs/PROJECT/09_EVIDENCES/ (UBICACIÓN CORRECTA)",
      executed_by: {
        username: userInfo.username,
        full_name: userInfo.full_name,
        email: userInfo.email,
        employee_id: userInfo.employee_id,
        role: userInfo.role,
        department: userInfo.department,
        machine: userInfo.machine,
        detection_method: userInfo.source_priority
      }
    }
  };
  
  // Save evidence in correct location
  const evidencePath = `docs/PROJECT/09_EVIDENCES/by-application/login/components/${formName}/evidence-complete-${executionId}.json`;
  fs.writeFileSync(evidencePath, JSON.stringify(evidenceData, null, 2));
  
  // TODO: log `\n✅ EVIDENCIA GENERADA:`
  // TODO: log `📁 Ubicación: ${evidencePath}`
  // TODO: log `👤 Ejecutado por: ${userInfo.full_name}`
  // TODO: log `🔑 Execution ID: ${executionId}`
  
  return evidencePath;
}

// Main execution
function main() {
  // TODO: log `\n🎯 Generando evidencias para: ${formName}`
  // TODO: log `📍 Ubicación correcta: docs/PROJECT/09_EVIDENCES/`
  
  createEvidenceStructure();
  const evidencePath = generateEvidence();
  
  // TODO: log '\n' + '='.repeat(60)
  // TODO: log '🎉 EVIDENCIAS GENERADAS EN UBICACIÓN CORRECTA'
  // TODO: log `📁 Base path: docs/PROJECT/09_EVIDENCES/`
  // TODO: log `📄 Evidencia principal: ${evidencePath}`
  // TODO: log '='.repeat(60)
}

// Execute
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as runEvidenceGenerator };
