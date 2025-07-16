# Comandos Directos de Documentación (Sin npm)

## 🎯 **Comandos de Comportamiento Directo**

### **DOCUMENTAR TODO**
**Comando directo:** `DOCUMENTAR TODO`
**Comportamiento:** Ejecuta automáticamente toda la documentación

**Proceso automático:**
1. **Analizar código** → Escanea todo el código fuente
2. **Generar documentación técnica** → Crea docs de componentes, utils, módulos
3. **Crear evidencias CMMI** → Genera evidencias automáticamente
4. **Generar FAQs** → Crea FAQs por módulo y técnica
5. **Crear material de soporte** → Manuales, ayudas, guías
6. **Actualizar versionado** → Changelog, versiones, trazabilidad
7. **Validar conformidad** → Verifica estándares y calidad

**Archivos generados automáticamente:**
```
docs/
├── components/
│   ├── BaseModal.md
│   ├── BaseTabs.md
│   ├── BaseAccordion.md
│   └── ...
├── utils/
│   ├── analytics.md
│   ├── notifications.md
│   └── ...
├── modules/
│   ├── CRM.md
│   ├── Helpdesk.md
│   └── ...
├── cmmi/evidence/
│   ├── components/
│   ├── modules/
│   └── ...
├── faqs/
│   ├── technical.md
│   ├── user.md
│   └── ...
└── user-manuals/
    ├── getting-started.md
    ├── features.md
    └── ...
```

### **DOCUMENTAR XTR**
**Comando directo:** `DOCUMENTAR XTR`
**Comportamiento:** Documentación completa + metodología + procesos

**Proceso automático:**
1. **Ejecutar DOCUMENTAR TODO** → Todo lo anterior
2. **Documentar metodología** → Procesos de desarrollo, estándares
3. **Documentar procesos** → Operacionales, calidad, revisión
4. **Análisis de impacto** → Entregables, comercial, conformidad
5. **Validar retrospectiva** → Casos de uso, gaps, mejoras

**Archivos adicionales generados:**
```
docs/
├── methodology/
│   ├── development-process.md
│   ├── coding-standards.md
│   └── ...
├── processes/
│   ├── onboarding.md
│   ├── operations.md
│   └── ...
├── impact-analysis/
│   ├── deliverables.md
│   ├── commercial.md
│   └── ...
└── retrospective/
    ├── use-cases.md
    ├── gaps.md
    └── ...
```

### **DOCUMENTAR COMPONENTE [nombre]**
**Comando directo:** `DOCUMENTAR COMPONENTE BaseButton`
**Comportamiento:** Documentación específica del componente

**Proceso automático:**
1. **Analizar componente** → Extrae props, interfaces, casos de uso
2. **Generar documentación técnica** → Props, ejemplos, consideraciones
3. **Crear evidencias CMMI** → Trazabilidad, validación, calidad
4. **Generar FAQs** → Preguntas específicas del componente
5. **Crear material de soporte** → Guías, ejemplos, mejores prácticas

**Archivos generados:**
```
docs/components/
├── BaseButton.md
├── BaseButton-examples.md
├── BaseButton-faqs.md
└── BaseButton-support.md

docs/cmmi/evidence/components/
└── BaseButton.json
```

### **DOCUMENTAR MÓDULO [nombre]**
**Comando directo:** `DOCUMENTAR MÓDULO CRM`
**Comportamiento:** Documentación completa del módulo

**Proceso automático:**
1. **Analizar módulo** → Arquitectura, APIs, integraciones
2. **Documentar arquitectura** → Componentes, flujos, datos
3. **Generar documentación de APIs** → Endpoints, parámetros, respuestas
4. **Crear flujos de datos** → Diagramas, integraciones
5. **Generar FAQs del módulo** → Preguntas específicas
6. **Crear material comercial** → Beneficios, ROI, casos de éxito

**Archivos generados:**
```
docs/modules/
├── CRM.md
├── CRM-architecture.md
├── CRM-apis.md
├── CRM-faqs.md
└── CRM-commercial.md

docs/cmmi/evidence/modules/
└── CRM.json
```

### **DOCUMENTAR REFACTOR**
**Comando directo:** `DOCUMENTAR REFACTOR`
**Comportamiento:** Actualización automática de documentación

**Proceso automático:**
1. **Análisis de impacto** → Identifica documentación afectada
2. **Actualizar documentación técnica** → Regenera docs afectados
3. **Regenerar evidencias CMMI** → Actualiza evidencias
4. **Actualizar FAQs** → Revisa y actualiza FAQs
5. **Revisar material comercial** → Actualiza material comercial
6. **Validar post-refactor** → Verifica conformidad

**Archivos actualizados:**
- Todos los archivos de documentación afectados
- Evidencias CMMI regeneradas
- FAQs actualizadas
- Material comercial revisado

## 🔄 **Comportamiento Automático por Trigger**

### **Push a main:**
**Trigger:** `git push origin main`
**Comando automático:** `DOCUMENTAR TODO`
**Comportamiento:** Genera documentación completa automáticamente

### **Merge de PR:**
**Trigger:** `Pull Request merged`
**Comando automático:** `DOCUMENTAR REFACTOR`
**Comportamiento:** Actualiza documentación afectada

### **Release:**
**Trigger:** `git tag v1.0.0`
**Comando automático:** `DOCUMENTAR XTR`
**Comportamiento:** Documentación completa + metodología

### **Nuevo componente:**
**Trigger:** `src/components/base/NewComponent.tsx`
**Comando automático:** `DOCUMENTAR COMPONENTE NewComponent`
**Comportamiento:** Documenta componente específico

### **Nuevo módulo:**
**Trigger:** `src/modules/NewModule/`
**Comando automático:** `DOCUMENTAR MÓDULO NewModule`
**Comportamiento:** Documenta módulo específico

## 📊 **Comportamiento de Validación**

### **Validación Automática:**
**Comportamiento:** Se ejecuta automáticamente en cada comando
1. **Conformidad CMMI** → Valida estándares automáticamente
2. **Casos de uso** → Verifica implementación automáticamente
3. **Calidad de documentación** → Evalúa calidad automáticamente
4. **Trazabilidad** → Mantiene trazabilidad automáticamente

### **Métricas Automáticas:**
**Comportamiento:** Se calculan automáticamente
- **Cobertura:** Porcentaje de elementos documentados
- **Calidad:** Score de calidad de documentación
- **Conformidad:** Score de conformidad CMMI
- **Actualización:** Timestamp de última actualización

## 🎯 **Comportamiento de Retrospectiva**

### **Validación de Implementación:**
**Comportamiento:** Se ejecuta automáticamente en `DOCUMENTAR XTR`
1. **Revisar casos de uso** → Compara vs implementación
2. **Identificar gaps** → Encuentra oportunidades
3. **Actualizar documentación** → Basado en hallazgos
4. **Mejorar procesos** → Optimiza desarrollo

### **Impacto en Entregables:**
**Comportamiento:** Se actualiza automáticamente
1. **Manuales de usuario** → Actualizados automáticamente
2. **Ayudas de pantalla** → Revisadas automáticamente
3. **Material comercial** → Actualizado automáticamente
4. **Conformidad** → Validada automáticamente

## 📋 **Comportamiento por Tipo de Documentación**

### **Documentación Técnica:**
**Comportamiento:** Se genera automáticamente
- Análisis de código fuente
- Extracción de interfaces
- Generación de ejemplos
- Documentación de APIs
- Diagramas de arquitectura

### **Evidencias CMMI:**
**Comportamiento:** Se crean automáticamente
- Trazabilidad de requerimientos
- Validación de conformidad
- Documentación de procesos
- Registro de decisiones
- Métricas de calidad

### **FAQs Estratégicas:**
**Comportamiento:** Se generan automáticamente
- Análisis de casos de uso
- Identificación de preguntas frecuentes
- Generación de respuestas
- Categorización por módulo
- Validación de cobertura

### **Material de Soporte:**
**Comportamiento:** Se crea automáticamente
- Manuales de usuario
- Ayudas de pantalla
- Guías de implementación
- Material comercial
- Casos de éxito

## 🎯 **Resultado Esperado**

Cuando se ejecute cualquier comando directo:

1. ✅ **Se ejecute automáticamente** sin intervención manual
2. ✅ **Se genere** toda la documentación necesaria
3. ✅ **Se actualicen** todos los entregables
4. ✅ **Se valide** la conformidad y calidad
5. ✅ **Se mantenga** trazabilidad completa
6. ✅ **Se impacten** todos los procesos relacionados

## 📋 **Checklist de Comportamiento**

### **Para Cada Comando Directo:**
- [ ] Se ejecuta automáticamente sin npm
- [ ] Se genera documentación completa según estándares
- [ ] Se crean evidencias CMMI válidas
- [ ] Se actualizan FAQs y material de soporte
- [ ] Se valida la calidad y conformidad
- [ ] Se mantiene trazabilidad completa
- [ ] Se impactan todos los entregables relacionados

---

**Nota:** Estos comandos directos se ejecutan sin necesidad de npm, generando automáticamente toda la documentación según los estándares definidos. 