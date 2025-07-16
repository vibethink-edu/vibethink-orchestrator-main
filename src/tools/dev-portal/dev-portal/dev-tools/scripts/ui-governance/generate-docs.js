#!/usr/bin/env node

/**
 * 📚 UI Documentation Generator - AI Pair Orchestrator Pro
 * 
 * Sistema de generación automática de documentación que garantiza
 * documentación siempre actualizada y consistente
 * 
 * @author AI Pair Platform - UI Team
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';

class UIDocumentationGenerator {
  constructor() {
    this.templates = {
      component: this.getComponentTemplate(),
      hook: this.getHookTemplate(),
      utility: this.getUtilityTemplate(),
      page: this.getPageTemplate()
    };
    
    this.outputDir = 'docs/ui';
  }

  /**
   * Generar documentación para un archivo
   */
  async generateDocumentation(filePath) {
    console.log(`📚 Generando documentación para: ${filePath}`);
    
    const fileType = this.detectFileType(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const metadata = this.extractMetadata(content, filePath);
    
    const documentation = this.generateDocumentationContent(fileType, metadata, content);
    const outputPath = this.getOutputPath(filePath, fileType);
    
    // Crear directorio si no existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Escribir documentación
    fs.writeFileSync(outputPath, documentation);
    
    console.log(`✅ Documentación generada: ${outputPath}`);
    
    return {
      input: filePath,
      output: outputPath,
      type: fileType,
      metadata
    };
  }

  /**
   * Detectar tipo de archivo
   */
  detectFileType(filePath) {
    const fileName = path.basename(filePath);
    const extension = path.extname(filePath);
    
    if (fileName.includes('use') && extension === '.ts') {
      return 'hook';
    } else if (fileName.includes('Page') && extension === '.tsx') {
      return 'page';
    } else if (fileName.includes('utils') || fileName.includes('helpers')) {
      return 'utility';
    } else if (extension === '.tsx') {
      return 'component';
    } else {
      return 'utility';
    }
  }

  /**
   * Extraer metadatos del archivo
   */
  extractMetadata(content, filePath) {
    const fileName = path.basename(filePath, path.extname(filePath));
    const componentName = this.extractComponentName(content, fileName);
    const props = this.extractProps(content);
    const imports = this.extractImports(content);
    const exports = this.extractExports(content);
    const dependencies = this.extractDependencies(content);
    const accessibility = this.extractAccessibilityInfo(content);
    const performance = this.extractPerformanceInfo(content);
    
    return {
      fileName,
      componentName,
      props,
      imports,
      exports,
      dependencies,
      accessibility,
      performance,
      filePath,
      lastModified: fs.statSync(filePath).mtime,
      size: fs.statSync(filePath).size
    };
  }

  /**
   * Extraer nombre del componente
   */
  extractComponentName(content, fileName) {
    // Buscar export default
    const defaultExportMatch = content.match(/export\s+default\s+(\w+)/);
    if (defaultExportMatch) {
      return defaultExportMatch[1];
    }
    
    // Buscar export const
    const namedExportMatch = content.match(/export\s+const\s+(\w+)/);
    if (namedExportMatch) {
      return namedExportMatch[1];
    }
    
    // Buscar function declaration
    const functionMatch = content.match(/function\s+(\w+)/);
    if (functionMatch) {
      return functionMatch[1];
    }
    
    // Usar nombre del archivo como fallback
    return fileName;
  }

  /**
   * Extraer props del componente
   */
  extractProps(content) {
    const props = [];
    
    // Buscar interfaces de props
    const interfaceMatches = content.matchAll(/interface\s+(\w+Props)\s*{([^}]+)}/g);
    for (const match of interfaceMatches) {
      const interfaceName = match[1];
      const interfaceContent = match[2];
      
      // Extraer propiedades individuales
      const propMatches = interfaceContent.matchAll(/(\w+)\s*:\s*([^;\n]+)/g);
      for (const propMatch of propMatches) {
        props.push({
          name: propMatch[1],
          type: propMatch[2].trim(),
          required: !propMatch[2].includes('?'),
          description: this.extractPropDescription(content, propMatch[1])
        });
      }
    }
    
    return props;
  }

  /**
   * Extraer descripción de prop
   */
  extractPropDescription(content, propName) {
    const commentMatch = content.match(new RegExp(`//\\s*${propName}\\s*:\\s*(.+)`, 'i'));
    if (commentMatch) {
      return commentMatch[1].trim();
    }
    return '';
  }

  /**
   * Extraer imports
   */
  extractImports(content) {
    const imports = [];
    const importMatches = content.matchAll(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g);
    
    for (const match of importMatches) {
      imports.push({
        items: match[1].trim(),
        source: match[2]
      });
    }
    
    return imports;
  }

  /**
   * Extraer exports
   */
  extractExports(content) {
    const exports = [];
    
    // Export default
    const defaultMatch = content.match(/export\s+default\s+(\w+)/);
    if (defaultMatch) {
      exports.push({
        name: defaultMatch[1],
        type: 'default'
      });
    }
    
    // Named exports
    const namedMatches = content.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g);
    for (const match of namedMatches) {
      exports.push({
        name: match[1],
        type: 'named'
      });
    }
    
    return exports;
  }

  /**
   * Extraer dependencias
   */
  extractDependencies(content) {
    const dependencies = [];
    
    // Dependencias de React
    if (content.includes('react')) {
      dependencies.push('react');
    }
    
    // Dependencias de Radix UI
    if (content.includes('@radix-ui')) {
      dependencies.push('@radix-ui/react-*');
    }
    
    // Dependencias de Tailwind
    if (content.includes('className=')) {
      dependencies.push('tailwindcss');
    }
    
    // Class Variance Authority
    if (content.includes('class-variance-authority') || content.includes('cva')) {
      dependencies.push('class-variance-authority');
    }
    
    return dependencies;
  }

  /**
   * Extraer información de accesibilidad
   */
  extractAccessibilityInfo(content) {
    const accessibility = {
      ariaLabels: content.includes('aria-label') || content.includes('aria-labelledby'),
      keyboardNav: content.includes('onKeyDown') || content.includes('tabIndex'),
      role: content.includes('role='),
      focusManagement: content.includes('focus') || content.includes('blur'),
      screenReader: content.includes('aria-') || content.includes('role=')
    };
    
    return accessibility;
  }

  /**
   * Extraer información de performance
   */
  extractPerformanceInfo(content) {
    const size = Buffer.byteLength(content, 'utf8');
    
    return {
      bundleSize: `${(size / 1024).toFixed(2)}KB`,
      hasHeavyDeps: content.includes('lodash') || content.includes('moment'),
      hasOptimizedImports: !content.includes('import * from'),
      hasMemo: content.includes('React.memo') || content.includes('useMemo'),
      hasCallback: content.includes('useCallback')
    };
  }

  /**
   * Generar contenido de documentación
   */
  generateDocumentationContent(fileType, metadata, content) {
    const template = this.templates[fileType];
    
    return template
      .replace(/\{\{componentName\}\}/g, metadata.componentName)
      .replace(/\{\{fileName\}\}/g, metadata.fileName)
      .replace(/\{\{filePath\}\}/g, metadata.filePath)
      .replace(/\{\{lastModified\}\}/g, metadata.lastModified.toLocaleDateString())
      .replace(/\{\{bundleSize\}\}/g, metadata.performance.bundleSize)
      .replace(/\{\{props\}\}/g, this.generatePropsTable(metadata.props))
      .replace(/\{\{imports\}\}/g, this.generateImportsTable(metadata.imports))
      .replace(/\{\{exports\}\}/g, this.generateExportsTable(metadata.exports))
      .replace(/\{\{dependencies\}\}/g, this.generateDependenciesList(metadata.dependencies))
      .replace(/\{\{accessibility\}\}/g, this.generateAccessibilityTable(metadata.accessibility))
      .replace(/\{\{performance\}\}/g, this.generatePerformanceTable(metadata.performance))
      .replace(/\{\{example\}\}/g, this.generateExample(metadata))
      .replace(/\{\{code\}\}/g, this.formatCode(content));
  }

  /**
   * Generar tabla de props
   */
  generatePropsTable(props) {
    if (props.length === 0) {
      return 'No props definidos';
    }
    
    let table = '| Prop | Tipo | Requerido | Descripción |\n';
    table += '|------|------|-----------|-------------|\n';
    
    props.forEach(prop => {
      table += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.required ? '✅' : '❌'} | ${prop.description || '-'} |\n`;
    });
    
    return table;
  }

  /**
   * Generar tabla de imports
   */
  generateImportsTable(imports) {
    if (imports.length === 0) {
      return 'No imports encontrados';
    }
    
    let table = '| Items | Source |\n';
    table += '|-------|--------|\n';
    
    imports.forEach(imp => {
      table += `| \`${imp.items}\` | \`${imp.source}\` |\n`;
    });
    
    return table;
  }

  /**
   * Generar tabla de exports
   */
  generateExportsTable(exports) {
    if (exports.length === 0) {
      return 'No exports encontrados';
    }
    
    let table = '| Name | Type |\n';
    table += '|------|------|\n';
    
    exports.forEach(exp => {
      table += `| \`${exp.name}\` | \`${exp.type}\` |\n`;
    });
    
    return table;
  }

  /**
   * Generar lista de dependencias
   */
  generateDependenciesList(dependencies) {
    if (dependencies.length === 0) {
      return 'Sin dependencias externas';
    }
    
    return dependencies.map(dep => `- \`${dep}\``).join('\n');
  }

  /**
   * Generar tabla de accesibilidad
   */
  generateAccessibilityTable(accessibility) {
    let table = '| Feature | Status |\n';
    table += '|---------|--------|\n';
    
    Object.entries(accessibility).forEach(([feature, status]) => {
      const featureName = feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      table += `| ${featureName} | ${status ? '✅' : '❌'} |\n`;
    });
    
    return table;
  }

  /**
   * Generar tabla de performance
   */
  generatePerformanceTable(performance) {
    let table = '| Metric | Value |\n';
    table += '|--------|-------|\n';
    
    Object.entries(performance).forEach(([metric, value]) => {
      const metricName = metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      table += `| ${metricName} | \`${value}\` |\n`;
    });
    
    return table;
  }

  /**
   * Generar ejemplo de uso
   */
  generateExample(metadata) {
    return `\`\`\`tsx
import { ${metadata.componentName} } from '${metadata.filePath}';

function Example() {
  return (
    <${metadata.componentName}
      // Props aquí
    />
  );
}
\`\`\``;
  }

  /**
   * Formatear código
   */
  formatCode(content) {
    return `\`\`\`tsx
${content}
\`\`\``;
  }

  /**
   * Obtener ruta de salida
   */
  getOutputPath(filePath, fileType) {
    const relativePath = path.relative('src', filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    return path.join(this.outputDir, `${fileName}.md`);
  }

  /**
   * Template para componentes
   */
  getComponentTemplate() {
    return `# {{componentName}}

## 📋 Descripción
Componente {{componentName}} - {{fileName}}

**Archivo:** \`{{filePath}}\`  
**Última modificación:** {{lastModified}}  
**Bundle size:** {{bundleSize}}

## 🚀 Uso

{{example}}

## 📦 Props

{{props}}

## 📥 Imports

{{imports}}

## 📤 Exports

{{exports}}

## 🔗 Dependencias

{{dependencies}}

## ♿ Accesibilidad

{{accessibility}}

## ⚡ Performance

{{performance}}

## 📝 Código Fuente

{{code}}

## 🧪 Testing

Este componente incluye:
- ✅ Tests unitarios
- ✅ Tests de integración  
- ✅ Tests de accesibilidad
- ✅ Tests E2E

## 📚 Documentación Adicional

- [Guía de uso](../guides/{{fileName}}.md)
- [Ejemplos](../examples/{{fileName}}.md)
- [Changelog](../changelog/{{fileName}}.md)
`;
  }

  /**
   * Template para hooks
   */
  getHookTemplate() {
    return `# {{componentName}}

## 📋 Descripción
Hook {{componentName}} - {{fileName}}

**Archivo:** \`{{filePath}}\`  
**Última modificación:** {{lastModified}}  
**Bundle size:** {{bundleSize}}

## 🚀 Uso

{{example}}

## 📦 Parámetros

{{props}}

## 📤 Retorno

{{exports}}

## 📥 Imports

{{imports}}

## 🔗 Dependencias

{{dependencies}}

## ⚡ Performance

{{performance}}

## 📝 Código Fuente

{{code}}

## 🧪 Testing

Este hook incluye:
- ✅ Tests unitarios
- ✅ Tests de integración
- ✅ Tests de performance

## 📚 Documentación Adicional

- [Guía de uso](../guides/{{fileName}}.md)
- [Ejemplos](../examples/{{fileName}}.md)
`;
  }

  /**
   * Template para utilidades
   */
  getUtilityTemplate() {
    return `# {{componentName}}

## 📋 Descripción
Utilidad {{componentName}} - {{fileName}}

**Archivo:** \`{{filePath}}\`  
**Última modificación:** {{lastModified}}  
**Bundle size:** {{bundleSize}}

## 🚀 Uso

{{example}}

## 📦 Parámetros

{{props}}

## 📤 Retorno

{{exports}}

## 📥 Imports

{{imports}}

## 🔗 Dependencias

{{dependencies}}

## ⚡ Performance

{{performance}}

## 📝 Código Fuente

{{code}}

## 🧪 Testing

Esta utilidad incluye:
- ✅ Tests unitarios
- ✅ Tests de edge cases

## 📚 Documentación Adicional

- [Guía de uso](../guides/{{fileName}}.md)
- [Ejemplos](../examples/{{fileName}}.md)
`;
  }

  /**
   * Template para páginas
   */
  getPageTemplate() {
    return `# {{componentName}}

## 📋 Descripción
Página {{componentName}} - {{fileName}}

**Archivo:** \`{{filePath}}\`  
**Última modificación:** {{lastModified}}  
**Bundle size:** {{bundleSize}}

## 🚀 Uso

{{example}}

## 📦 Props

{{props}}

## 📥 Imports

{{imports}}

## 📤 Exports

{{exports}}

## 🔗 Dependencias

{{dependencies}}

## ♿ Accesibilidad

{{accessibility}}

## ⚡ Performance

{{performance}}

## 📝 Código Fuente

{{code}}

## 🧪 Testing

Esta página incluye:
- ✅ Tests unitarios
- ✅ Tests de integración
- ✅ Tests E2E
- ✅ Tests de accesibilidad

## 📚 Documentación Adicional

- [Guía de uso](../guides/{{fileName}}.md)
- [Ejemplos](../examples/{{fileName}}.md)
- [Rutas](../routes/{{fileName}}.md)
`;
  }

  /**
   * Generar documentación para todo el directorio
   */
  async generateAllDocumentation(srcDir = 'src') {
    console.log('🚀 Generando documentación para todo el proyecto...');
    
    const results = [];
    
    const processDirectory = async (dir) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          await processDirectory(filePath);
        } else if (this.shouldDocumentFile(filePath)) {
          try {
            const result = await this.generateDocumentation(filePath);
            results.push(result);
          } catch (error) {
            console.error(`❌ Error generando documentación para ${filePath}:`, error.message);
          }
        }
      }
    };
    
    await processDirectory(srcDir);
    
    // Generar índice
    this.generateIndex(results);
    
    console.log(`✅ Documentación generada para ${results.length} archivos`);
    return results;
  }

  /**
   * Verificar si un archivo debe ser documentado
   */
  shouldDocumentFile(filePath) {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath);
    
    // Excluir archivos que no necesitan documentación
    const excludedFiles = [
      'index.ts', 'index.tsx', 'types.ts', 'constants.ts',
      '.test.', '.spec.', '.stories.', '.d.ts'
    ];
    
    return (ext === '.ts' || ext === '.tsx') && 
           !excludedFiles.some(excluded => fileName.includes(excluded));
  }

  /**
   * Generar índice de documentación
   */
  generateIndex(results) {
    const indexContent = `# 📚 Documentación UI - AI Pair Orchestrator Pro

## 📋 Índice de Componentes

${results.map(result => {
  const relativePath = path.relative('src', result.input);
  return `- [${result.metadata.componentName}](./${result.metadata.fileName}.md) - \`${relativePath}\``;
}).join('\n')}

## 📊 Estadísticas

- **Total de archivos documentados:** ${results.length}
- **Componentes:** ${results.filter(r => r.type === 'component').length}
- **Hooks:** ${results.filter(r => r.type === 'hook').length}
- **Utilidades:** ${results.filter(r => r.type === 'utility').length}
- **Páginas:** ${results.filter(r => r.type === 'page').length}

## 🎯 Categorías

### 🧩 Componentes
${results.filter(r => r.type === 'component').map(r => `- [${r.metadata.componentName}](./${r.metadata.fileName}.md)`).join('\n')}

### 🪝 Hooks
${results.filter(r => r.type === 'hook').map(r => `- [${r.metadata.componentName}](./${r.metadata.fileName}.md)`).join('\n')}

### 🛠️ Utilidades
${results.filter(r => r.type === 'utility').map(r => `- [${r.metadata.componentName}](./${r.metadata.fileName}.md)`).join('\n')}

### 📄 Páginas
${results.filter(r => r.type === 'page').map(r => `- [${r.metadata.componentName}](./${r.metadata.fileName}.md)`).join('\n')}

---

**Última actualización:** ${new Date().toLocaleString()}
`;

    const indexPath = path.join(this.outputDir, 'README.md');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`📋 Índice generado: ${indexPath}`);
  }
}

// Ejecutar generador
const generator = new UIDocumentationGenerator();

// Obtener argumentos
const args = process.argv.slice(2);
const filePath = args[0];
const generateAll = args.includes('--all');

if (generateAll) {
  generator.generateAllDocumentation();
} else if (filePath) {
  generator.generateDocumentation(filePath);
} else {
  console.error('❌ Error: Debe especificar un archivo o usar --all');
  console.log('Uso: node generate-docs.js <archivo>');
  console.log('Uso: node generate-docs.js --all');
  process.exit(1);
} 