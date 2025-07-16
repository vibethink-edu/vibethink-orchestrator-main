# Comandos de Comportamiento de Documentación

## 🎯 **Comandos Directos (No npm)**

### **DOCUMENTAR TODO**
**Comportamiento:** Cuando se ejecute este comando, automáticamente:

1. **Analizar** todo el código fuente
2. **Generar** documentación técnica completa
3. **Crear** evidencias CMMI automáticamente
4. **Generar** FAQs estratégicas
5. **Crear** material de soporte
6. **Actualizar** versionado y trazabilidad
7. **Validar** conformidad automáticamente

**Archivos generados:**
- `docs/components/` - Documentación de componentes
- `docs/utils/` - Documentación de utilidades
- `docs/modules/` - Documentación de módulos
- `docs/cmmi/evidence/` - Evidencias CMMI
- `docs/faqs/` - FAQs generadas
- `docs/user-manuals/` - Manuales de usuario
- `docs/commercial/` - Material comercial

### **DOCUMENTAR XTR**
**Comportamiento:** Cuando se ejecute este comando, automáticamente:

1. **Ejecutar** todo lo de "DOCUMENTAR TODO"
2. **Documentar** metodología de desarrollo
3. **Documentar** procesos operativos
4. **Realizar** análisis de impacto
5. **Validar** retrospectiva automáticamente
6. **Actualizar** material comercial
7. **Generar** guías de implementación

**Archivos adicionales generados:**
- `docs/methodology/` - Documentación de metodología
- `docs/processes/` - Documentación de procesos
- `docs/impact-analysis/` - Análisis de impacto
- `docs/retrospective/` - Validación retrospectiva

### **DOCUMENTAR COMPONENTE [nombre]**
**Comportamiento:** Cuando se ejecute este comando, automáticamente:

1. **Analizar** el componente específico
2. **Extraer** props e interfaces
3. **Generar** documentación técnica
4. **Crear** ejemplos de uso
5. **Generar** casos de uso
6. **Crear** FAQs específicas
7. **Generar** evidencias CMMI

**Archivos generados:**
- `docs/components/[nombre].md`
- `docs/components/[nombre]-examples.md`
- `docs/components/[nombre]-faqs.md`
- `docs/cmmi/evidence/components/[nombre].json`

### **DOCUMENTAR MÓDULO [nombre]**
**Comportamiento:** Cuando se ejecute este comando, automáticamente:

1. **Analizar** el módulo completo
2. **Documentar** arquitectura del módulo
3. **Generar** documentación de APIs
4. **Crear** flujos de datos
5. **Documentar** integraciones
6. **Generar** FAQs del módulo
7. **Crear** material comercial

**Archivos generados:**
- `docs/modules/[nombre].md`
- `docs/modules/[nombre]-architecture.md`
- `docs/modules/[nombre]-apis.md`
- `docs/modules/[nombre]-faqs.md`
- `docs/modules/[nombre]-commercial.md`
- `docs/cmmi/evidence/modules/[nombre].json`

### **DOCUMENTAR REFACTOR**
**Comportamiento:** Cuando se ejecute este comando, automáticamente:

1. **Analizar** cambios realizados
2. **Identificar** documentación afectada
3. **Actualizar** documentación técnica
4. **Regenerar** evidencias CMMI
5. **Actualizar** FAQs relacionadas
6. **Revisar** material comercial
7. **Validar** conformidad post-refactor

**Archivos actualizados:**
- Todos los archivos de documentación afectados
- Evidencias CMMI regeneradas
- FAQs actualizadas
- Material comercial revisado

## 🔄 **Comportamiento Automático**

### **Triggers Automáticos:**
- **Push a main** → Ejecuta `DOCUMENTAR TODO`
- **Merge de PR** → Ejecuta `DOCUMENTAR REFACTOR`
- **Release** → Ejecuta `DOCUMENTAR XTR`
- **Nuevo componente** → Ejecuta `DOCUMENTAR COMPONENTE [nombre]`
- **Nuevo módulo** → Ejecuta `DOCUMENTAR MÓDULO [nombre]`

### **Validación Automática:**
- **Conformidad CMMI** → Validada automáticamente
- **Casos de uso** → Verificados automáticamente
- **Calidad de documentación** → Evaluada automáticamente
- **Trazabilidad** → Mantenida automáticamente

## 📋 **Comportamiento por Tipo de Documentación**

### **Documentación Técnica:**
**Comportamiento:** Se genera automáticamente con:
- Análisis de código fuente
- Extracción de interfaces
- Generación de ejemplos
- Documentación de APIs
- Diagramas de arquitectura

### **Evidencias CMMI:**
**Comportamiento:** Se crean automáticamente con:
- Trazabilidad de requerimientos
- Validación de conformidad
- Documentación de procesos
- Registro de decisiones
- Métricas de calidad

### **FAQs Estratégicas:**
**Comportamiento:** Se generan automáticamente con:
- Análisis de casos de uso
- Identificación de preguntas frecuentes
- Generación de respuestas
- Categorización por módulo
- Validación de cobertura

### **Material de Soporte:**
**Comportamiento:** Se crea automáticamente con:
- Manuales de usuario
- Ayudas de pantalla
- Guías de implementación
- Material comercial
- Casos de éxito

## 🎯 **Comportamiento de Retrospectiva**

### **Validación de Implementación:**
**Comportamiento:** Se ejecuta automáticamente:
1. **Revisar** casos de uso vs implementación
2. **Identificar** gaps y oportunidades
3. **Actualizar** documentación basada en hallazgos
4. **Mejorar** procesos de desarrollo

### **Impacto en Entregables:**
**Comportamiento:** Se actualiza automáticamente:
1. **Actualizar** manuales de usuario
2. **Revisar** ayudas de pantalla
3. **Actualizar** material comercial
4. **Validar** conformidad con estándares

## 📊 **Comportamiento de Métricas**

### **Cobertura de Documentación:**
**Comportamiento:** Se calcula automáticamente:
- Porcentaje de componentes documentados
- Porcentaje de módulos documentados
- Porcentaje de APIs documentadas
- Porcentaje de casos de uso cubiertos

### **Calidad de Documentación:**
**Comportamiento:** Se evalúa automáticamente:
- Conformidad con estándares
- Actualización de documentación
- Validación de casos de uso
- Satisfacción del usuario

## 🔧 **Comportamiento de Configuración**

### **Configuración Automática:**
**Comportamiento:** Se aplica automáticamente:
- Estándares de documentación
- Plantillas de generación
- Criterios de validación
- Métricas de calidad

### **Personalización:**
**Comportamiento:** Se permite configurar:
- Tipos de documentación a generar
- Estándares específicos
- Criterios de validación
- Métricas personalizadas

## 🎯 **Resultado Esperado**

Cuando se ejecute cualquier comando de comportamiento:

1. ✅ **Se ejecute automáticamente** todo el proceso definido
2. ✅ **Se genere** toda la documentación necesaria
3. ✅ **Se actualicen** todos los entregables
4. ✅ **Se valide** la conformidad y calidad
5. ✅ **Se mantenga** trazabilidad completa
6. ✅ **Se impacten** todos los procesos relacionados

## 📋 **Checklist de Comportamiento**

### **Para Cada Comando:**
- [ ] Se ejecuta automáticamente sin intervención manual
- [ ] Se genera documentación completa según estándares
- [ ] Se crean evidencias CMMI válidas
- [ ] Se actualizan FAQs y material de soporte
- [ ] Se valida la calidad y conformidad
- [ ] Se mantiene trazabilidad completa
- [ ] Se impactan todos los entregables relacionados

---

**Nota:** Estos comandos de comportamiento se ejecutan directamente sin necesidad de npm, generando automáticamente toda la documentación según los estándares definidos. 