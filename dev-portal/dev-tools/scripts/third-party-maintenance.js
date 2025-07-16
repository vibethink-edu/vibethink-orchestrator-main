/**
 * Sistema Robusto de Mantenimiento de Código de Terceros
 * 
 * Este sistema permite:
 * - Trackear modificaciones automáticamente
 * - Aplicar actualizaciones de forma segura
 * - Mantener compatibilidad de addons
 * - Generar reportes de cambios
 * - Automatizar el proceso de migración
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

class ThirdPartyMaintenance {
  constructor(appName, basePath) {
    this.appName = appName;
    this.basePath = basePath;
    this.originalPath = path.join(basePath, 'original');
    this.modifiedPath = path.join(basePath, 'modified');
    this.maintenancePath = path.join(basePath, 'maintenance');
    this.versionInfoPath = path.join(this.maintenancePath, 'version-info.json');
  }

  /**
   * Inicializar estructura de mantenimiento
   */
  initialize() {
    const dirs = [
      this.originalPath,
      this.modifiedPath,
      this.maintenancePath,
      path.join(this.maintenancePath, 'scripts'),
      path.join(this.maintenancePath, 'patches'),
      path.join(this.maintenancePath, 'changelog'),
      path.join(this.maintenancePath, 'compatibility')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    this.createVersionInfo();
    console.log(`✅ Initialized maintenance structure for ${this.appName}`);
  }

  /**
   * Crear archivo de información de versiones
   */
  createVersionInfo() {
    const versionInfo = {
      app_name: this.appName,
      current_version: null,
      original_version: null,
      last_update: new Date().toISOString(),
      modifications: {
        files: [],
        integrations: [],
        customizations: []
      },
      addons: [],
      compatibility_matrix: {},
      update_history: []
    };

    fs.writeFileSync(this.versionInfoPath, JSON.stringify(versionInfo, null, 2));
  }

  /**
   * Trackear modificaciones en archivos
   */
  trackModifications() {
    console.log(`🔍 Tracking modifications for ${this.appName}...`);
    
    const modifications = [];
    const originalFiles = this.getFilesRecursive(this.originalPath);
    const modifiedFiles = this.getFilesRecursive(this.modifiedPath);

    // Comparar archivos
    modifiedFiles.forEach(modifiedFile => {
      const relativePath = path.relative(this.modifiedPath, modifiedFile);
      const originalFile = path.join(this.originalPath, relativePath);

      if (fs.existsSync(originalFile)) {
        const originalHash = this.getFileHash(originalFile);
        const modifiedHash = this.getFileHash(modifiedFile);

        if (originalHash !== modifiedHash) {
          modifications.push({
            file: relativePath,
            original_hash: originalHash,
            modified_hash: modifiedHash,
            changes: this.analyzeChanges(originalFile, modifiedFile),
            date_modified: new Date().toISOString()
          });
        }
      } else {
        // Archivo nuevo
        modifications.push({
          file: relativePath,
          type: 'new_file',
          modified_hash: this.getFileHash(modifiedFile),
          date_created: new Date().toISOString()
        });
      }
    });

    // Actualizar version-info.json
    const versionInfo = JSON.parse(fs.readFileSync(this.versionInfoPath, 'utf8'));
    versionInfo.modifications.files = modifications;
    versionInfo.last_update = new Date().toISOString();
    
    fs.writeFileSync(this.versionInfoPath, JSON.stringify(versionInfo, null, 2));
    
    console.log(`✅ Tracked ${modifications.length} modifications`);
    return modifications;
  }

  /**
   * Crear patch de diferencias
   */
  createPatch(patchName) {
    const patchPath = path.join(this.maintenancePath, 'patches', `${patchName}.patch`);
    
    try {
      const diff = execSync(`git diff --no-index ${this.originalPath} ${this.modifiedPath}`, { encoding: 'utf8' });
      fs.writeFileSync(patchPath, diff);
      console.log(`✅ Created patch: ${patchName}.patch`);
      return patchPath;
    } catch (error) {
      console.error(`❌ Error creating patch: ${error.message}`);
      return null;
    }
  }

  /**
   * Aplicar actualización de versión
   */
  async applyUpdate(newVersion, updateStrategy = 'safe') {
    console.log(`🔄 Applying update to version ${newVersion}...`);
    
    // 1. Backup de modificaciones actuales
    const backupPath = path.join(this.maintenancePath, 'backups', `v${newVersion}-${Date.now()}`);
    fs.mkdirSync(backupPath, { recursive: true });
    
    execSync(`cp -r ${this.modifiedPath}/* ${backupPath}/`);
    console.log(`✅ Created backup at ${backupPath}`);

    // 2. Actualizar código original
    const newOriginalPath = path.join(this.originalPath, `v${newVersion}`);
    if (!fs.existsSync(newOriginalPath)) {
      console.log(`⚠️ New version ${newVersion} not found in original/`);
      return false;
    }

    // 3. Aplicar estrategia de actualización
    switch (updateStrategy) {
      case 'safe':
        return await this.safeUpdate(newOriginalPath);
      case 'aggressive':
        return await this.aggressiveUpdate(newOriginalPath);
      case 'manual':
        return await this.manualUpdate(newOriginalPath);
      default:
        console.error(`❌ Unknown update strategy: ${updateStrategy}`);
        return false;
    }
  }

  /**
   * Actualización segura (conserva modificaciones)
   */
  async safeUpdate(newOriginalPath) {
    try {
      // Aplicar parches existentes
      const patchesDir = path.join(this.maintenancePath, 'patches');
      const patches = fs.readdirSync(patchesDir).filter(f => f.endsWith('.patch'));
      
      for (const patch of patches) {
        const patchPath = path.join(patchesDir, patch);
        try {
          execSync(`git apply --directory=${newOriginalPath} ${patchPath}`);
          console.log(`✅ Applied patch: ${patch}`);
        } catch (error) {
          console.warn(`⚠️ Failed to apply patch ${patch}: ${error.message}`);
        }
      }

      // Actualizar version-info.json
      const versionInfo = JSON.parse(fs.readFileSync(this.versionInfoPath, 'utf8'));
      versionInfo.original_version = versionInfo.current_version;
      versionInfo.current_version = newVersion;
      versionInfo.update_history.push({
        version: newVersion,
        date: new Date().toISOString(),
        strategy: 'safe',
        patches_applied: patches.length
      });
      
      fs.writeFileSync(this.versionInfoPath, JSON.stringify(versionInfo, null, 2));
      
      console.log(`✅ Safe update completed to version ${newVersion}`);
      return true;
    } catch (error) {
      console.error(`❌ Safe update failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Generar reporte de compatibilidad
   */
  generateCompatibilityReport() {
    const versionInfo = JSON.parse(fs.readFileSync(this.versionInfoPath, 'utf8'));
    const report = {
      app_name: this.appName,
      current_version: versionInfo.current_version,
      addons_compatibility: {},
      breaking_changes: [],
      recommendations: []
    };

    // Analizar compatibilidad de addons
    versionInfo.addons.forEach(addon => {
      report.addons_compatibility[addon] = this.checkAddonCompatibility(addon);
    });

    // Generar recomendaciones
    if (report.addons_compatibility.incompatible.length > 0) {
      report.recommendations.push('Update incompatible addons before applying update');
    }

    const reportPath = path.join(this.maintenancePath, 'compatibility', `report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Generated compatibility report: ${reportPath}`);
    return report;
  }

  /**
   * Utilidades auxiliares
   */
  getFilesRecursive(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getFilesRecursive(fullPath));
      } else {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  getFileHash(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  analyzeChanges(originalFile, modifiedFile) {
    // Implementar análisis de diferencias más detallado
    return ['Modified for platform integration'];
  }

  checkAddonCompatibility(addon) {
    // Implementar verificación de compatibilidad
    return 'compatible';
  }
}

// Exportar para uso en otros scripts
module.exports = ThirdPartyMaintenance;

// Ejemplo de uso
if (require.main === module) {
  const maintenance = new ThirdPartyMaintenance('strapi', './src/apps/ap-cms');
  maintenance.initialize();
  maintenance.trackModifications();
  maintenance.generateCompatibilityReport();
} 