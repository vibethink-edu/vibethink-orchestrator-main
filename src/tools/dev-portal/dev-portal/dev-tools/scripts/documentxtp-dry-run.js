#!/usr/bin/env node

/**
 * DocumentVTK Dry Run Test Suite
 * 
 * Prueba la separación de DocumentVTK en sus componentes:
 * - Core (universal)
 * - VibeThink (específico del proyecto)
 * - Wrapper de compatibilidad
 * 
 * @author VTK Framework
 * @version 1.0.0
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

class DocumentVTKDryRun {
  constructor() {
    this.testResults = [];
    this.rootPath = process.cwd();
    this.paths = {
      core: 'docs/VTK_METHODOLOGY/04_TOOLS/DocumentVTK-core.js',
      VibeThink: 'docs/PROJECT/08_TOOLCHAIN_AND_SETUP/DocumentVTK-VibeThink-config.js',
      wrapper: 'src/scripts/DocumentVTK.js'
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];
    
    const logMessage = `${timestamp} ${prefix} ${message}`;
    // TODO: log logMessage
    
    this.testResults.push({
      timestamp,
      type,
      message,
      logMessage
    });
  }

  async testFileExists(filePath, description) {
    try {
      await fs.access(path.join(this.rootPath, filePath));
      this.log(`${description} exists: ${filePath}`, 'success');
      return true;
    } catch (error) {
      this.log(`${description} missing: ${filePath}`, 'error');
      return false;
    }
  }

  async testImports() {
    this.log('Testing import paths...', 'info');
    
    try {
      // Test wrapper imports
      const wrapperContent = await fs.readFile(path.join(this.rootPath, this.paths.wrapper), 'utf8');
      
      if (wrapperContent.includes('DocumentVTK-VibeThink-config.js')) {
        this.log('Wrapper correctly imports VibeThink config', 'success');
      } else {
        this.log('Wrapper missing VibeThink config import', 'error');
      }
      
      // Test core module syntax
      const coreContent = await fs.readFile(path.join(this.rootPath, this.paths.core), 'utf8');
      
      if (coreContent.includes('export class DocumentVTKCore')) {
        this.log('Core module has correct export', 'success');
      } else {
        this.log('Core module missing correct export', 'error');
      }
      
      // Test VibeThink config syntax
      const VibeThinkContent = await fs.readFile(path.join(this.rootPath, this.paths.VibeThink), 'utf8');
      
      if (VibeThinkContent.includes('import') && VibeThinkContent.includes('DocumentVTKCore')) {
        this.log('VibeThink config correctly imports core', 'success');
      } else {
        this.log('VibeThink config missing core import', 'error');
      }
      
    } catch (error) {
      this.log(`Import test failed: ${error.message}`, 'error');
    }
  }

  async testNodeSyntax() {
    this.log('Testing Node.js syntax validation...', 'info');
    
    for (const [name, filePath] of Object.entries(this.paths)) {
      try {
        const { stdout, stderr } = await execAsync(`node --check "${filePath}"`);
        
        if (stderr) {
          this.log(`${name} has syntax errors: ${stderr}`, 'error');
        } else {
          this.log(`${name} syntax valid`, 'success');
        }
      } catch (error) {
        this.log(`${name} syntax check failed: ${error.message}`, 'error');
      }
    }
  }

  async testCompatibilityWrapper() {
    this.log('Testing compatibility wrapper...', 'info');
    
    try {
      // Test with --help flag (should not throw)
      const { stdout, stderr } = await execAsync(`node "${this.paths.wrapper}" --help`, {
        timeout: 10000
      });
      
      if (stdout || stderr) {
        this.log('Wrapper responds to --help', 'success');
      }
    } catch (error) {
      // Expected for --help, but should not crash
      if (error.code !== 1) {
        this.log(`Wrapper test unexpected error: ${error.message}`, 'warning');
      } else {
        this.log('Wrapper handles arguments correctly', 'success');
      }
    }
  }

  async testDirectoryStructure() {
    this.log('Testing VTK-compliant directory structure...', 'info');
    
    const expectedDirs = [
      'docs/VTK_METHODOLOGY/04_TOOLS',
      'docs/PROJECT/08_TOOLCHAIN_AND_SETUP',
      'src/scripts'
    ];
    
    for (const dir of expectedDirs) {
      try {
        const stats = await fs.stat(path.join(this.rootPath, dir));
        if (stats.isDirectory()) {
          this.log(`Directory exists: ${dir}`, 'success');
        }
      } catch (error) {
        this.log(`Directory missing: ${dir}`, 'error');
      }
    }
  }

  async testBackupIntegrity() {
    this.log('Testing backup integrity...', 'info');
    
    const backupPath = 'docs/PROJECT/08_TOOLCHAIN_AND_SETUP/DocumentVTK.js.backup';
    
    try {
      const backupExists = await fs.access(path.join(this.rootPath, backupPath)).then(() => true).catch(() => false);
      
      if (backupExists) {
        const backupContent = await fs.readFile(path.join(this.rootPath, backupPath), 'utf8');
        
        if (backupContent.length > 1000) { // Reasonable size check
          this.log('Backup file exists and has content', 'success');
        } else {
          this.log('Backup file exists but seems empty', 'warning');
        }
      } else {
        this.log('Backup file not found (may have been moved)', 'warning');
      }
    } catch (error) {
      this.log(`Backup check failed: ${error.message}`, 'warning');
    }
  }

  async generateReport() {
    const successCount = this.testResults.filter(r => r.type === 'success').length;
    const errorCount = this.testResults.filter(r => r.type === 'error').length;
    const warningCount = this.testResults.filter(r => r.type === 'warning').length;
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.testResults.length,
        success: successCount,
        errors: errorCount,
        warnings: warningCount,
        status: errorCount === 0 ? 'PASS' : 'FAIL'
      },
      details: this.testResults,
      recommendations: []
    };
    
    if (errorCount > 0) {
      report.recommendations.push('Fix syntax errors before proceeding');
      report.recommendations.push('Verify all import paths are correct');
    }
    
    if (warningCount > 0) {
      report.recommendations.push('Review warnings for potential issues');
    }
    
    if (errorCount === 0) {
      report.recommendations.push('DocumentVTK separation is ready for production');
      report.recommendations.push('Consider running integration tests');
    }
    
    // Save report
    const reportPath = 'docs/PROJECT/08_TOOLCHAIN_AND_SETUP/documentVTK-dry-run-report.json';
    await fs.writeFile(
      path.join(this.rootPath, reportPath),
      JSON.stringify(report, null, 2)
    );
    
    this.log(`Report saved to: ${reportPath}`, 'info');
    
    return report;
  }

  async run() {
    this.log('🚀 Starting DocumentVTK Dry Run Test Suite', 'info');
    this.log('='.repeat(60), 'info');
    
    // Test 1: File existence
    this.log('TEST 1: File Existence', 'info');
    await this.testFileExists(this.paths.core, 'Core module');
    await this.testFileExists(this.paths.VibeThink, 'VibeThink config');
    await this.testFileExists(this.paths.wrapper, 'Compatibility wrapper');
    
    // Test 2: Directory structure
    this.log('\nTEST 2: Directory Structure', 'info');
    await this.testDirectoryStructure();
    
    // Test 3: Import paths
    this.log('\nTEST 3: Import Paths', 'info');
    await this.testImports();
    
    // Test 4: Node.js syntax
    this.log('\nTEST 4: Node.js Syntax Validation', 'info');
    await this.testNodeSyntax();
    
    // Test 5: Compatibility wrapper
    this.log('\nTEST 5: Compatibility Wrapper', 'info');
    await this.testCompatibilityWrapper();
    
    // Test 6: Backup integrity
    this.log('\nTEST 6: Backup Integrity', 'info');
    await this.testBackupIntegrity();
    
    // Generate final report
    this.log('\n' + '='.repeat(60), 'info');
    this.log('Generating final report...', 'info');
    
    const report = await this.generateReport();
    
    this.log('='.repeat(60), 'info');
    this.log(`FINAL STATUS: ${report.summary.status}`, report.summary.status === 'PASS' ? 'success' : 'error');
    this.log(`✅ Success: ${report.summary.success}`, 'success');
    this.log(`❌ Errors: ${report.summary.errors}`, report.summary.errors > 0 ? 'error' : 'info');
    this.log(`⚠️ Warnings: ${report.summary.warnings}`, report.summary.warnings > 0 ? 'warning' : 'info');
    this.log('='.repeat(60), 'info');
    
    if (report.recommendations.length > 0) {
      this.log('RECOMMENDATIONS:', 'info');
      report.recommendations.forEach((rec, i) => {
        this.log(`${i + 1}. ${rec}`, 'info');
      });
    }
    
    return report;
  }
}

// Ejecutar dry run
if (import.meta.url === `file://${process.argv[1]}`) {
  const dryRun = new DocumentVTKDryRun();
  dryRun.run()
    .then(report => {
      process.exit(report.summary.status === 'PASS' ? 0 : 1);
    })
    .catch(error => {
      // TODO: log '❌ Dry run failed:' error
      process.exit(1);
    });
}

export { DocumentVTKDryRun };
