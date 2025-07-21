#!/usr/bin/env node

/**
 * @file create-report.js
 * @description Script para crear reportes automáticamente en docs/reports/
 * @version 1.0.0
 * @author VThink 1.0 Team
 */

const fs = require('fs');
const path = require('path');

class ReportCreator {
  constructor() {
    this.root = process.cwd();
    this.reportsDir = path.join(this.root, 'docs', 'reports');
    this.timestamp = new Date().toISOString().split('T')[0];
  }

  /**
   * Crear estructura de carpetas si no existe
   */
  createStructure() {
    const folders = [
      'migration',
      'analysis',
      'performance', 
      'security',
      'quality',
      'deployment',
      'archives'
    ];

    for (const folder of folders) {
      const folderPath = path.join(this.reportsDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`📁 Carpeta creada: ${folder}/`);
      }
    }
  }

  /**
   * Generar template de reporte
   */
  generateTemplate(type, title, description = '') {
    const template = `# Reporte: ${title} - ${this.timestamp}

## 📊 Resumen Ejecutivo
- **Objetivo**: ${description || 'Análisis y reporte de datos'}
- **Tipo**: ${type}
- **Fecha**: ${this.timestamp}
- **Estado**: ⚠️ En progreso

## 🔍 Detalles Técnicos
- **Metodología**: VThink 1.0
- **Herramientas**: Scripts automatizados
- **Alcance**: ${type === 'migration' ? 'Migración de datos y documentación' :
                type === 'analysis' ? 'Análisis de código y estructura' :
                type === 'performance' ? 'Métricas de rendimiento' :
                type === 'security' ? 'Auditoría de seguridad' :
                type === 'quality' ? 'Control de calidad' :
                type === 'deployment' ? 'Despliegue y configuración' :
                'Análisis general'}

## 📈 Métricas
- **Archivos procesados**: 0
- **Errores encontrados**: 0
- **Advertencias**: 0
- **Tiempo de ejecución**: 0s

## 🎯 Hallazgos Principales
- [ ] Análisis en progreso
- [ ] Métricas por calcular
- [ ] Conclusiones pendientes

## 📋 Recomendaciones
- [ ] Implementar mejoras identificadas
- [ ] Resolver errores críticos
- [ ] Optimizar procesos

## 🎯 Conclusiones
- Análisis en progreso
- Resultados pendientes
- Próximos pasos por definir

## 📋 VThink 1.0 Compliance
- ✅ Metodología VThink 1.0 aplicada
- ✅ CMMI-ML3 standards considerados
- ✅ Multi-tenant security validada
- ✅ Estructura de reporte estandarizada

## 🔧 Próximos Pasos
1. Ejecutar análisis completo
2. Revisar métricas generadas
3. Implementar recomendaciones
4. Validar resultados

---
*Reporte generado automáticamente por VThink 1.0 - ${this.timestamp}*
`;

    return template;
  }

  /**
   * Crear reporte
   */
  createReport(type, title, description = '') {
    // Validar tipo
    const validTypes = ['migration', 'analysis', 'performance', 'security', 'quality', 'deployment'];
    if (!validTypes.includes(type)) {
      console.error(`❌ Tipo inválido: ${type}`);
      console.error(`Tipos válidos: ${validTypes.join(', ')}`);
      process.exit(1);
    }

    // Crear estructura si no existe
    this.createStructure();

    // Generar nombre de archivo
    const fileName = `${this.timestamp}-${type}-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filePath = path.join(this.reportsDir, type, fileName);

    // Verificar si archivo ya existe
    if (fs.existsSync(filePath)) {
      console.error(`❌ El archivo ya existe: ${fileName}`);
      process.exit(1);
    }

    // Generar contenido
    const content = this.generateTemplate(type, title, description);

    // Escribir archivo
    fs.writeFileSync(filePath, content);

    console.log(`✅ Reporte creado: ${filePath}`);
    console.log(`📊 Tipo: ${type}`);
    console.log(`📝 Título: ${title}`);
    console.log(`📅 Fecha: ${this.timestamp}`);

    return filePath;
  }

  /**
   * Mostrar ayuda
   */
  showHelp() {
    console.log(`
📋 CREAR REPORTE - VThink 1.0

Uso: node create-report.js <tipo> <título> [descripción]

Tipos válidos:
  migration    - Reportes de migración de datos/documentación
  analysis     - Análisis de código y estructura
  performance  - Métricas de rendimiento
  security     - Auditorías de seguridad
  quality      - Control de calidad
  deployment   - Reportes de despliegue

Ejemplos:
  node create-report.js migration "Migración Docusaurus" "Migración de documentación a Docusaurus v3"
  node create-report.js analysis "Análisis de Dependencias" "Análisis de dependencias del proyecto"
  node create-report.js performance "Métricas de Carga" "Análisis de tiempos de carga"
  node create-report.js security "Auditoría RLS" "Validación de políticas RLS"
  node create-report.js quality "Control de Código" "Revisión de estándares de código"
  node create-report.js deployment "Despliegue Staging" "Reporte de despliegue a staging"

Reglas:
  ✅ Reportes van en docs/reports/<tipo>/
  ✅ Nomenclatura: YYYY-MM-DD-tipo-titulo.md
  ✅ Estructura VThink 1.0 obligatoria
  ✅ Validación automática de ubicación
`);
  }

  /**
   * Ejecutar script
   */
  run() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      this.showHelp();
      return;
    }

    if (args.length < 2) {
      console.error('❌ Error: Se requieren tipo y título');
      this.showHelp();
      process.exit(1);
    }

    const [type, title, ...descriptionParts] = args;
    const description = descriptionParts.join(' ');

    try {
      this.createReport(type, title, description);
    } catch (error) {
      console.error(`❌ Error al crear reporte: ${error.message}`);
      process.exit(1);
    }
  }
}

// Ejecutar script
const creator = new ReportCreator();
creator.run(); 