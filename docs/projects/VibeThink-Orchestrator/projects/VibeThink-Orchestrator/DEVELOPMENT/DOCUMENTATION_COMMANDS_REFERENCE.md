# Referencia Rápida de Comandos de Documentación

## 🚀 **Comandos Principales**

### **DOCUMENTAR TODO**
```bash
npm run document:all
```
**Significado:** Documentación completa de todo el desarrollo realizado.

**Incluye:**
- ✅ Documentación técnica de componentes
- ✅ Evidencias CMMI
- ✅ FAQs estratégicas
- ✅ Material de soporte
- ✅ Versionado y trazabilidad
- ✅ Validación de conformidad

### **DOCUMENTAR XTR**
```bash
npm run document:xtr
```
**Significado:** Documentación EXTRA que incluye metodología y procesos.

**Incluye:**
- ✅ Todo lo de "DOCUMENTAR TODO"
- ✅ Documentación de metodología
- ✅ Documentación de procesos
- ✅ Análisis de impacto
- ✅ Validación de retrospectiva

### **DOCUMENTAR COMPONENTE**
```bash
npm run document:component [nombre]
```
**Ejemplo:**
```bash
npm run document:component BaseButton
npm run document:component BaseModal
npm run document:component BaseTabs
```

**Significado:** Documentación específica de un componente.

**Incluye:**
- ✅ Documentación técnica del componente
- ✅ Evidencias CMMI del componente
- ✅ FAQs del componente
- ✅ Material de soporte del componente

### **DOCUMENTAR MÓDULO**
```bash
npm run document:module [nombre]
```
**Ejemplo:**
```bash
npm run document:module CRM
npm run document:module Helpdesk
npm run document:module Analytics
```

**Significado:** Documentación completa de un módulo del sistema.

**Incluye:**
- ✅ Documentación del módulo
- ✅ Evidencias CMMI del módulo
- ✅ FAQs del módulo
- ✅ Material comercial del módulo

### **DOCUMENTAR REFACTOR**
```bash
npm run document:refactor
```
**Significado:** Documentación de cambios y actualización de todo el material.

**Incluye:**
- ✅ Análisis de impacto
- ✅ Actualización de documentación técnica
- ✅ Regeneración de evidencias CMMI
- ✅ Actualización de FAQs
- ✅ Revisión de material comercial
- ✅ Validación post-refactor

## 📋 **Comandos de Validación**

### **Validar Documentación**
```bash
npm run document:validate
```
**Significado:** Validar la calidad y conformidad de la documentación.

**Incluye:**
- ✅ Validación de documentación técnica
- ✅ Validación de evidencias CMMI
- ✅ Validación de FAQs
- ✅ Validación de material de soporte
- ✅ Validación de conformidad

### **Actualizar Documentación**
```bash
npm run document:update
```
**Significado:** Actualizar toda la documentación existente.

**Incluye:**
- ✅ Actualización de documentación técnica
- ✅ Actualización de evidencias CMMI
- ✅ Actualización de FAQs
- ✅ Actualización de material de soporte
- ✅ Validación de actualizaciones

## 🔧 **Comandos Directos (Node.js)**

### **Usando el Script Directamente**
```bash
node scripts/documentation-automation.js [comando] [objetivo]
```

**Ejemplos:**
```bash
# Documentar todo
node scripts/documentation-automation.js all

# Documentar XTR
node scripts/documentation-automation.js xtr

# Documentar componente específico
node scripts/documentation-automation.js component BaseButton

# Documentar módulo específico
node scripts/documentation-automation.js module CRM

# Documentar refactor
node scripts/documentation-automation.js refactor
```

## 📊 **Comandos de Análisis**

### **Análisis de Código**
```bash
npm run analyze:code
```
**Significado:** Analizar el código para identificar elementos a documentar.

### **Análisis de Impacto**
```bash
npm run analyze:impact
```
**Significado:** Analizar el impacto de cambios en la documentación.

### **Análisis de Conformidad**
```bash
npm run analyze:compliance
```
**Significado:** Analizar la conformidad con estándares CMMI.

## 📝 **Comandos de Generación**

### **Generar FAQs**
```bash
npm run generate:faqs
```
**Significado:** Generar FAQs para todos los elementos.

### **Generar Evidencias CMMI**
```bash
npm run generate:cmmi
```
**Significado:** Generar evidencias CMMI para todos los elementos.

### **Generar Material Comercial**
```bash
npm run generate:commercial
```
**Significado:** Generar material comercial para módulos.

## 🔄 **Comandos de Automatización**

### **Documentación Automática en CI/CD**
```yaml
# GitHub Actions
- name: Generate Documentation
  run: npm run document:all

- name: Validate Documentation
  run: npm run document:validate

- name: Update Documentation
  run: npm run document:update
```

### **Documentación Automática en Pre-commit**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run document:validate"
    }
  }
}
```

## 📋 **Ejemplos de Uso Comunes**

### **Desarrollo de Nuevo Componente**
```bash
# 1. Desarrollar componente
# 2. Documentar componente
npm run document:component MiNuevoComponente

# 3. Validar documentación
npm run document:validate
```

### **Desarrollo de Nuevo Módulo**
```bash
# 1. Desarrollar módulo
# 2. Documentar módulo
npm run document:module MiNuevoModulo

# 3. Validar documentación
npm run document:validate
```

### **Refactoring de Código**
```bash
# 1. Realizar refactor
# 2. Documentar refactor
npm run document:refactor

# 3. Validar documentación
npm run document:validate
```

### **Release de Versión**
```bash
# 1. Documentar todo
npm run document:all

# 2. Validar documentación
npm run document:validate

# 3. Actualizar versionado
npm run document:update
```

## 🎯 **Flujo de Trabajo Recomendado**

### **Para Cada Desarrollo:**
1. **Desarrollar** funcionalidad
2. **Documentar** elemento específico
3. **Validar** documentación
4. **Actualizar** documentación general

### **Para Cada Refactor:**
1. **Realizar** refactor
2. **Documentar** refactor
3. **Validar** impacto
4. **Actualizar** todo el material

### **Para Cada Release:**
1. **Documentar** todo
2. **Validar** conformidad
3. **Actualizar** versionado
4. **Generar** material comercial

## 📊 **Métricas de Documentación**

### **Comandos de Métricas**
```bash
# Ver cobertura de documentación
npm run metrics:coverage

# Ver calidad de documentación
npm run metrics:quality

# Ver conformidad CMMI
npm run metrics:cmmi
```

### **Reportes de Documentación**
```bash
# Generar reporte de documentación
npm run report:documentation

# Generar reporte de conformidad
npm run report:compliance

# Generar reporte de calidad
npm run report:quality
```

## 🔧 **Configuración**

### **Archivo de Configuración**
```json
{
  "documentation": {
    "autoSave": true,
    "generateFAQs": true,
    "generateCMMI": true,
    "generateUserManuals": true,
    "generateCommercialMaterial": true,
    "validateCompliance": true,
    "updateVersioning": true
  }
}
```

### **Personalización de Comandos**
```bash
# Configurar comandos personalizados
npm run config:documentation

# Ver configuración actual
npm run config:show
```

---

**Nota:** Todos los comandos generan documentación automáticamente según los estándares definidos en `DOCUMENTATION_STANDARDS.md`. 