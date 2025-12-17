#!/usr/bin/env node

/**
 * VTK 1.0 - Validador de Pendientes
 * 
 * Script de validación automática para el protocolo de pendientes VTK 1.0
 * Valida estructura, dependencias, fechas y genera reportes de cumplimiento
 * 
 * @author VTK Framework v1.0
 * @version 1.0.0
 * @license MIT
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

class VTKPendientesValidator {
  constructor() {
    this.rootPath = process.cwd();
    this.pendientesFile = path.join(this.rootPath, 'docs', 'vtk-pendientes.yaml');
    this.results = {
      errors: [],
      warnings: [],
      successes: [],
      metrics: {}
    };
    this.pendientes = null;
  }

  /**
   * Ejecutar validación completa
   */
  async validate() {
    // TODO: log '🔍 VTK 1.0 - Validación de Pendientes'
    // TODO: log '=====================================\n'

    try {
      // 1. Cargar archivo de pendientes
      await this.loadPendientes();
      
      // 2. Validar estructura del archivo
      this.validateStructure();
      
      // 3. Validar cada pendiente individual
      this.validatePendientes();
      
      // 4. Validar dependencias
      this.validateDependencies();
      
      // 5. Validar fechas y deadlines
      this.validateDates();
      
      // 6. Validar vínculos con código
      this.validateCodeLinks();
      
      // 7. Generar reporte
      this.generateReport();
      
      // 8. Retornar código de salida
      return this.results.errors.length === 0 ? 0 : 1;
      
    } catch (error) {
      // TODO: log '❌ Error en validación:' error.message
      return 1;
    }
  }

  /**
   * Cargar archivo de pendientes
   */
  async loadPendientes() {
    if (!fs.existsSync(this.pendientesFile)) {
      throw new Error(`Archivo de pendientes no encontrado: ${this.pendientesFile}`);
    }

    const content = fs.readFileSync(this.pendientesFile, 'utf8');
    this.pendientes = yaml.load(content);
    
    if (!this.pendientes || !this.pendientes.pendientes) {
      throw new Error('Estructura inválida en archivo de pendientes');
    }

    // TODO: log '✅ Archivo de pendientes cargado correctamente'
  }

  /**
   * Validar estructura del archivo
   */
  validateStructure() {
    const requiredFields = ['version', 'metodologia', 'fecha_creacion', 'pendientes'];
    
    for (const field of requiredFields) {
      if (!this.pendientes[field]) {
        this.results.errors.push(`Campo requerido faltante: ${field}`);
      }
    }

    if (this.pendientes.metodologia !== 'VTK') {
      this.results.errors.push('Metodología debe ser "VTK"');
    }

    if (this.results.errors.length === 0) {
      // TODO: log '✅ Estructura del archivo válida'
    }
  }

  /**
   * Validar cada pendiente individual
   */
  validatePendientes() {
    const requiredPendienteFields = [
      'id', 'titulo', 'descripcion', 'responsable', 
      'prioridad', 'estado', 'fecha_creacion', 'etiquetas'
    ];

    const validEstados = ['pendiente', 'en_progreso', 'revisando', 'completado', 'bloqueado', 'cancelado'];
    const validPrioridades = ['critica', 'alta', 'media', 'baja'];

    this.pendientes.pendientes.forEach((pendiente, index) => {
      // Validar campos requeridos
      for (const field of requiredPendienteFields) {
        if (!pendiente[field]) {
          this.results.errors.push(`Pendiente ${pendiente.id || index}: Campo requerido faltante: ${field}`);
        }
      }

      // Validar estado
      if (pendiente.estado && !validEstados.includes(pendiente.estado)) {
        this.results.errors.push(`Pendiente ${pendiente.id}: Estado inválido: ${pendiente.estado}`);
      }

      // Validar prioridad
      if (pendiente.prioridad && !validPrioridades.includes(pendiente.prioridad)) {
        this.results.errors.push(`Pendiente ${pendiente.id}: Prioridad inválida: ${pendiente.prioridad}`);
      }

      // Validar etiquetas requeridas
      if (pendiente.etiquetas) {
        const requiredTags = ['VTK'];
        for (const tag of requiredTags) {
          if (!pendiente.etiquetas.includes(tag)) {
            this.results.warnings.push(`Pendiente ${pendiente.id}: Etiqueta requerida faltante: ${tag}`);
          }
        }
      }

      // Validar formato de ID
      if (pendiente.id && !/^VTK-\d{3}$/.test(pendiente.id)) {
        this.results.errors.push(`Pendiente ${pendiente.id}: Formato de ID inválido (debe ser VTK-XXX)`);
      }

      // Validar fechas
      if (pendiente.fecha_creacion && !this.isValidDate(pendiente.fecha_creacion)) {
        this.results.errors.push(`Pendiente ${pendiente.id}: Fecha de creación inválida: ${pendiente.fecha_creacion}`);
      }

      if (pendiente.fecha_limite && !this.isValidDate(pendiente.fecha_limite)) {
        this.results.errors.push(`Pendiente ${pendiente.id}: Fecha límite inválida: ${pendiente.fecha_limite}`);
      }
    });

    // TODO: log `✅ ${this.pendientes.pendientes.length} pendientes validados`
  }

  /**
   * Validar dependencias entre pendientes
   */
  validateDependencies() {
    const pendientesIds = this.pendientes.pendientes.map(p => p.id);
    
    this.pendientes.pendientes.forEach(pendiente => {
      if (pendiente.dependencias) {
        pendiente.dependencias.forEach(depId => {
          if (!pendientesIds.includes(depId)) {
            this.results.errors.push(`Pendiente ${pendiente.id}: Dependencia inexistente: ${depId}`);
          }
        });
      }
    });

    // Detectar dependencias circulares
    const circularDeps = this.detectCircularDependencies();
    if (circularDeps.length > 0) {
      this.results.errors.push(`Dependencias circulares detectadas: ${circularDeps.join(', ')}`);
    }

    // TODO: log '✅ Dependencias validadas'
  }

  /**
   * Detectar dependencias circulares
   */
  detectCircularDependencies() {
    const visited = new Set();
    const recursionStack = new Set();
    const circular = [];

    const dfs = (pendienteId) => {
      if (recursionStack.has(pendienteId)) {
        circular.push(pendienteId);
        return;
      }
      if (visited.has(pendienteId)) return;

      visited.add(pendienteId);
      recursionStack.add(pendienteId);

      const pendiente = this.pendientes.pendientes.find(p => p.id === pendienteId);
      if (pendiente && pendiente.dependencias) {
        pendiente.dependencias.forEach(depId => dfs(depId));
      }

      recursionStack.delete(pendienteId);
    };

    this.pendientes.pendientes.forEach(pendiente => {
      if (!visited.has(pendiente.id)) {
        dfs(pendiente.id);
      }
    });

    return circular;
  }

  /**
   * Validar fechas y deadlines
   */
  validateDates() {
    const today = new Date();
    
    this.pendientes.pendientes.forEach(pendiente => {
      if (pendiente.fecha_limite) {
        const deadline = new Date(pendiente.fecha_limite);
        const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDeadline < 0) {
          this.results.errors.push(`Pendiente ${pendiente.id}: Fecha límite vencida: ${pendiente.fecha_limite}`);
        } else if (daysUntilDeadline <= 7 && pendiente.prioridad === 'critica') {
          this.results.warnings.push(`Pendiente ${pendiente.id}: Fecha límite crítica próxima (${daysUntilDeadline} días)`);
        } else if (daysUntilDeadline <= 3) {
          this.results.warnings.push(`Pendiente ${pendiente.id}: Fecha límite muy próxima (${daysUntilDeadline} días)`);
        }
      }
    });

    // TODO: log '✅ Fechas validadas'
  }

  /**
   * Validar vínculos con código
   */
  validateCodeLinks() {
    this.pendientes.pendientes.forEach(pendiente => {
      if (pendiente.vinculo_codigo) {
        const codePath = path.join(this.rootPath, pendiente.vinculo_codigo);
        if (!fs.existsSync(codePath)) {
          this.results.warnings.push(`Pendiente ${pendiente.id}: Vínculo de código no encontrado: ${pendiente.vinculo_codigo}`);
        }
      }

      if (pendiente.vinculo_docs) {
        const docsPath = path.join(this.rootPath, pendiente.vinculo_docs);
        if (!fs.existsSync(docsPath)) {
          this.results.warnings.push(`Pendiente ${pendiente.id}: Vínculo de documentación no encontrado: ${pendiente.vinculo_docs}`);
        }
      }
    });

    // TODO: log '✅ Vínculos validados'
  }

  /**
   * Generar reporte de validación
   */
  generateReport() {
    // TODO: log '\n📊 REPORTE DE VALIDACIÓN VTK 1.0'
    // TODO: log '================================\n'

    // Estadísticas
    const stats = this.calculateStats();
    
    // TODO: log '📈 ESTADÍSTICAS:'
    // TODO: log `   Total pendientes: ${stats.total}`
    // TODO: log `   Críticos: ${stats.criticos}`
    // TODO: log `   Altos: ${stats.altos}`
    // TODO: log `   Medios: ${stats.medios}`
    // TODO: log `   Bajos: ${stats.bajos}`
    // TODO: log `   En progreso: ${stats.enProgreso}`
    // TODO: log `   Completados: ${stats.completados}`
    // TODO: log `   Bloqueados: ${stats.bloqueados}`

    // Errores críticos
    if (this.results.errors.length > 0) {
      // TODO: log '\n❌ ERRORES CRÍTICOS:'
      this.results.errors.forEach(error => {
        // TODO: log `   • ${error}`
      });
    }

    // Advertencias
    if (this.results.warnings.length > 0) {
      // TODO: log '\n⚠️ ADVERTENCIAS:'
      this.results.warnings.forEach(warning => {
        // TODO: log `   • ${warning}`
      });
    }

    // Pendientes críticos próximos a vencer
    const criticalDeadlines = this.getCriticalDeadlines();
    if (criticalDeadlines.length > 0) {
      // TODO: log '\n🚨 PENDIENTES CRÍTICOS PRÓXIMOS:'
      criticalDeadlines.forEach(pendiente => {
        const days = Math.ceil((new Date(pendiente.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24));
        // TODO: log `   • ${pendiente.id}: ${pendiente.titulo} (${days} días)`
      });
    }

    // Resumen
    // TODO: log '\n📋 RESUMEN:'
    // TODO: log `   ✅ Validaciones exitosas: ${this.results.successes.length}`
    // TODO: log `   ⚠️ Advertencias: ${this.results.warnings.length}`
    // TODO: log `   ❌ Errores: ${this.results.errors.length}`
    
    if (this.results.errors.length === 0) {
      // TODO: log '\n🎉 ¡Validación exitosa! Protocolo VTK 1.0 cumplido.'
    } else {
      // TODO: log '\n🔧 Se requieren correcciones antes de continuar.'
    }

    // Guardar reporte
    this.saveReport();
  }

  /**
   * Calcular estadísticas
   */
  calculateStats() {
    const stats = {
      total: this.pendientes.pendientes.length,
      criticos: 0,
      altos: 0,
      medios: 0,
      bajos: 0,
      enProgreso: 0,
      completados: 0,
      bloqueados: 0
    };

    this.pendientes.pendientes.forEach(pendiente => {
      switch (pendiente.prioridad) {
        case 'critica': stats.criticos++; break;
        case 'alta': stats.altos++; break;
        case 'media': stats.medios++; break;
        case 'baja': stats.bajos++; break;
      }

      switch (pendiente.estado) {
        case 'en_progreso': stats.enProgreso++; break;
        case 'completado': stats.completados++; break;
        case 'bloqueado': stats.bloqueados++; break;
      }
    });

    return stats;
  }

  /**
   * Obtener pendientes críticos próximos a vencer
   */
  getCriticalDeadlines() {
    const today = new Date();
    const criticalDeadlines = [];

    this.pendientes.pendientes.forEach(pendiente => {
      if (pendiente.fecha_limite && pendiente.prioridad === 'critica') {
        const deadline = new Date(pendiente.fecha_limite);
        const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDeadline <= 7 && daysUntilDeadline >= 0) {
          criticalDeadlines.push(pendiente);
        }
      }
    });

    return criticalDeadlines.sort((a, b) => new Date(a.fecha_limite) - new Date(b.fecha_limite));
  }

  /**
   * Guardar reporte en archivo
   */
  saveReport() {
    const reportPath = path.join(this.rootPath, 'reports', 'vtk-pendientes-validation.json');
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const report = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      metodologia: 'VTK',
      results: this.results,
      stats: this.calculateStats(),
      criticalDeadlines: this.getCriticalDeadlines().map(p => ({
        id: p.id,
        titulo: p.titulo,
        fecha_limite: p.fecha_limite,
        responsable: p.responsable
      }))
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    // TODO: log `\n📄 Reporte guardado: ${reportPath}`
  }

  /**
   * Validar formato de fecha
   */
  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

// Ejecutar validación
const validator = new VTKPendientesValidator();
const exitCode = await validator.validate();
process.exit(exitCode); 