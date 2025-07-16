# Guía de Comandos de Documentación Automática

## 🎯 **Propósito**
Esta guía define los comandos estandarizados para automatizar la documentación completa del proyecto. Cuando se solicite "DOCUMENTAR X", se ejecutará automáticamente todo el proceso definido.

## 📋 **Comandos Estandarizados**

### **DOCUMENTAR TODO**
**Significado:** Documentación completa de todo el desarrollo realizado.

**Proceso Automático:**
1. ✅ **Documentación Técnica**
   - Generar documentación de componentes
   - Crear guías de implementación
   - Documentar APIs y servicios
   - Generar diagramas de arquitectura

2. ✅ **Evidencias CMMI**
   - Crear evidencias para cada feature
   - Documentar procesos de desarrollo
   - Generar trazabilidad de requerimientos
   - Validar conformidad con estándares

3. ✅ **FAQs Estratégicas**
   - FAQs por módulo (CRM, Helpdesk, Analytics, etc.)
   - FAQs técnicas para desarrolladores
   - FAQs de usuario para cada característica
   - FAQs de implementación para validación

4. ✅ **Material de Soporte**
   - Manuales de usuario interactivos
   - Ayudas de pantalla contextuales
   - Guías de implementación técnicas
   - Material comercial cuando aplique

5. ✅ **Versionado y Trazabilidad**
   - Etiquetar versiones
   - Actualizar changelog
   - Mantener historial de cambios
   - Documentar decisiones de arquitectura

### **DOCUMENTAR XTR**
**Significado:** Documentación EXTRA que incluye metodología y procesos.

**Proceso Automático:**
1. ✅ **Todo lo de "DOCUMENTAR TODO"**
2. ✅ **Documentación de Metodología**
   - Procesos de desarrollo
   - Estándares de código
   - Flujos de trabajo
   - Decisiones de arquitectura

3. ✅ **Documentación de Procesos**
   - Guías de onboarding
   - Procedimientos operativos
   - Checklists de calidad
   - Procesos de revisión

4. ✅ **Documentación de Impacto**
   - Análisis de impacto en entregables
   - Actualización de material comercial
   - Revisión de conformidad
   - Identificación de gaps

### **DOCUMENTAR COMPONENTE [nombre]**
**Significado:** Documentación específica de un componente.

**Proceso Automático:**
1. ✅ **Documentación Técnica del Componente**
   - Props y interfaces
   - Ejemplos de uso
   - Casos de uso
   - Consideraciones de rendimiento

2. ✅ **Evidencias CMMI del Componente**
   - Trazabilidad de requerimientos
   - Validación de conformidad
   - Documentación de pruebas
   - Registro de decisiones

3. ✅ **FAQs del Componente**
   - Preguntas frecuentes de uso
   - Solución de problemas
   - Mejores prácticas
   - Casos de uso avanzados

4. ✅ **Material de Soporte**
   - Guías de implementación
   - Ejemplos interactivos
   - Ayudas contextuales

### **DOCUMENTAR MÓDULO [nombre]**
**Significado:** Documentación completa de un módulo del sistema.

**Proceso Automático:**
1. ✅ **Documentación del Módulo**
   - Arquitectura del módulo
   - APIs y servicios
   - Flujos de datos
   - Integraciones

2. ✅ **Evidencias CMMI del Módulo**
   - Procesos de desarrollo
   - Validación de calidad
   - Trazabilidad de features
   - Conformidad con estándares

3. ✅ **FAQs del Módulo**
   - Preguntas de usuario
   - Preguntas técnicas
   - Preguntas de implementación
   - Casos de uso

4. ✅ **Material Comercial**
   - Beneficios del módulo
   - Casos de uso comerciales
   - ROI y métricas
   - Comparativas

### **DOCUMENTAR REFACTOR**
**Significado:** Documentación de cambios y actualización de todo el material.

**Proceso Automático:**
1. ✅ **Análisis de Impacto**
   - Identificar documentación afectada
   - Actualizar guías técnicas
   - Revisar casos de uso
   - Validar conformidad

2. ✅ **Actualización Automática**
   - Actualizar documentación técnica
   - Regenerar evidencias CMMI
   - Actualizar FAQs
   - Revisar material comercial

3. ✅ **Validación Post-Refactor**
   - Verificar conformidad
   - Actualizar casos de uso
   - Revisar ayudas de pantalla
   - Validar manuales

## 🔄 **Proceso de Retrospectiva Automática**

### **Validación de Implementación**
1. ✅ **Revisar casos de uso** vs implementación
2. ✅ **Identificar gaps** y oportunidades
3. ✅ **Actualizar documentación** basada en hallazgos
4. ✅ **Mejorar procesos** de desarrollo

### **Impacto en Entregables**
1. ✅ **Actualizar manuales** de usuario
2. ✅ **Revisar ayudas** de pantalla
3. ✅ **Actualizar material** comercial
4. ✅ **Validar conformidad** con estándares

## 📝 **Plantillas Automáticas**

### **Para Cada Componente:**
```markdown
# [Nombre del Componente]

## Descripción
[Descripción automática del componente]

## Props
[Documentación automática de props]

## Ejemplos de Uso
[Ejemplos automáticos generados]

## Casos de Uso
[Casos de uso identificados]

## FAQs
[FAQs generadas automáticamente]

## Evidencias CMMI
[Evidencias generadas automáticamente]
```

### **Para Cada Módulo:**
```markdown
# [Nombre del Módulo]

## Arquitectura
[Documentación automática de arquitectura]

## APIs y Servicios
[Documentación automática de APIs]

## Flujos de Datos
[Diagramas automáticos generados]

## Integraciones
[Documentación automática de integraciones]

## FAQs
[FAQs generadas automáticamente]

## Material Comercial
[Material generado automáticamente]
```

## 🚀 **Implementación Automática**

### **Scripts de Automatización**
- `npm run document:all` - Ejecuta "DOCUMENTAR TODO"
- `npm run document:xtr` - Ejecuta "DOCUMENTAR XTR"
- `npm run document:component [nombre]` - Documenta componente específico
- `npm run document:module [nombre]` - Documenta módulo específico
- `npm run document:refactor` - Documenta refactor

### **Triggers Automáticos**
- **Push a main** → Ejecuta documentación automática
- **Merge de PR** → Actualiza documentación relacionada
- **Release** → Genera documentación de versión
- **Refactor** → Actualiza toda documentación afectada

## 📊 **Métricas de Documentación**

### **Cobertura de Documentación**
- Porcentaje de componentes documentados
- Porcentaje de módulos documentados
- Porcentaje de APIs documentadas
- Porcentaje de casos de uso cubiertos

### **Calidad de Documentación**
- Conformidad con estándares
- Actualización de documentación
- Validación de casos de uso
- Satisfacción del usuario

## 🎯 **Resultado Esperado**

Cuando se ejecute cualquier comando de documentación:

1. ✅ **Se genere automáticamente** toda la documentación necesaria
2. ✅ **Se actualicen** todos los entregables relacionados
3. ✅ **Se validen** los casos de uso y conformidad
4. ✅ **Se mantenga** trazabilidad completa
5. ✅ **Se impacten** todos los procesos y materiales

## 📋 **Checklist de Validación**

### **Para Cada Documentación:**
- [ ] Documentación técnica completa
- [ ] Evidencias CMMI generadas
- [ ] FAQs actualizadas
- [ ] Material de soporte actualizado
- [ ] Casos de uso validados
- [ ] Conformidad verificada
- [ ] Trazabilidad mantenida
- [ ] Versionado actualizado

---

**Nota:** Esta guía debe ser actualizada cada vez que se agreguen nuevos tipos de documentación o se modifiquen los procesos existentes. 