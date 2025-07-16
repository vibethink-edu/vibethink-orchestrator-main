# [CATEGORÍA] ADR-[N]: [TÍTULO DE LA DECISIÓN]

**Módulo:** [Nombre del módulo o sistema]
**Tema:** [Tema principal o subtema]
**Tipo de documento:** ADR (Architecture Decision Record)
**Autor:** [Nombre(s) o equipo]
**Fecha:** [AAAA-MM-DD]
**Versión:** [v1.0 / fecha de última actualización]
**Estado:** [Proposed | Accepted | Rejected | Deprecated | Superseded]

---

## Resumen
Breve descripción del propósito del documento, contexto y objetivo.

---

## Historial de cambios
| Fecha       | Autor         | Cambio realizado                  |
|-------------|--------------|-----------------------------------|
| 2024-06-26  | Marcelo/AI   | Creación inicial                  |
| 2024-06-27  | AI            | Revisión y recomendaciones        |

---

## Recomendaciones AI Pair
- [Aquí irán recomendaciones personalizadas para cada documento, alineadas a mejores prácticas, estándares y contexto del proyecto.]

---

## 📋 **Información Básica**
- **Fecha:** YYYY-MM-DD
- **Decisor:** [Nombre del decisor]
- **Estado:** [Proposed | Accepted | Rejected | Deprecated | Superseded]
- **Impacto:** [LOW | MEDIUM | HIGH | CRITICAL]
- **Revisión:** YYYY-MM-DD

---

## 🎯 **Contexto**
[Describir el problema o necesidad que llevó a esta decisión. Incluir contexto técnico, de negocio y limitaciones actuales.]

### **Problema Identificado**
- [Problema 1]
- [Problema 2]
- [Problema 3]

### **Limitaciones Actuales**
- [Limitación 1]
- [Limitación 2]
- [Limitación 3]

---

## 🔍 **Búsqueda Exhaustiva** ⭐ **OBLIGATORIO**

### **Búsquedas Realizadas**
- [ ] `best [component] 2024`
- [ ] `fastest [component]`
- [ ] `[component] performance comparison`
- [ ] `[component] benchmarks`
- [ ] `alternative to [current_solution]`
- [ ] `[component] vs [competitor]`
- [ ] `emerging [component] technologies`

### **Fuentes Evaluadas**
- [ ] GitHub trending
- [ ] Stack Overflow insights
- [ ] Reddit discussions
- [ ] Tech blogs
- [ ] Conference talks
- [ ] Research papers
- [ ] Industry reports

### **Alternativas Consideradas**
| Alternativa | Performance | Madurez | Comunidad | Documentación | Licencia | Costo | Estado |
|-------------|-------------|---------|-----------|---------------|----------|-------|--------|
| [Alternativa 1] | X/10 | X/10 | X/10 | X/10 | [Licencia] | $X/mes | ❌ Rechazada |
| [Alternativa 2] | X/10 | X/10 | X/10 | X/10 | [Licencia] | $X/mes | ❌ Rechazada |
| **[Solución Elegida]** | X/10 | X/10 | X/10 | X/10 | [Licencia] | $X/mes | ✅ Seleccionada |

### **Métricas Comparativas**
```typescript
const comparisonMetrics = {
  performance: {
    [alternativa1]: { latency: 'Xms', throughput: 'X req/s' },
    [alternativa2]: { latency: 'Xms', throughput: 'X req/s' },
    [solucionElegida]: { latency: 'Xms', throughput: 'X req/s' }
  },
  cost: {
    [alternativa1]: { monthly: '$X', perRequest: '$X' },
    [alternativa2]: { monthly: '$X', perRequest: '$X' },
    [solucionElegida]: { monthly: '$X', perRequest: '$X' }
  }
};
```

---

## 🔄 **Compatibilidad Hacia Atrás** ⭐ **OBLIGATORIO**

### **Decisiones Previas Revisadas**
- [ ] ADR-001: Stack Tecnológico Base
- [ ] ADR-002: Arquitectura Multi-Tenant
- [ ] ADR-003: Sistema de Autenticación
- [ ] ADR-004: Base de Datos y ORM
- [ ] ADR-005: API Gateway Strategy
- [ ] ADR-006: Design Patterns Architecture
- [ ] ADR-007: Agentic Framework Selection
- [ ] ADR-008: Stack Evaluation Criteria

### **Matriz de Compatibilidad**
| Componente | Compatible | Migración Requerida | Breaking Changes | Beneficios |
|------------|------------|-------------------|------------------|------------|
| **Base de Datos** | ✅ Sí | ❌ No | Ninguno | [Beneficio] |
| **Autenticación** | ✅ Sí | ❌ No | Ninguno | [Beneficio] |
| **Vector DB** | ✅ Sí | ❌ No | Ninguno | [Beneficio] |
| **Providers IA** | ✅ Sí | ❌ No | Ninguno | [Beneficio] |
| **Billing** | ✅ Sí | ❌ No | Ninguno | [Beneficio] |
| **Email** | ✅ Sí | ❌ No | Ninguno | [Beneficio] |
| **Secrets** | ✅ Sí | ❌ No | Ninguno | [Beneficio] |

### **Impacto en Decisiones Previas**
```typescript
const impactMatrix = {
  'ADR-001': { affected: false, impact: 'neutral', reasoning: 'No afecta stack base' },
  'ADR-002': { affected: false, impact: 'neutral', reasoning: 'Mantiene multi-tenancy' },
  'ADR-003': { affected: false, impact: 'neutral', reasoning: 'No afecta autenticación' },
  // ... continuar para todas las decisiones
};
```

---

## ⚠️ **Análisis de Riesgos** ⭐ **OBLIGATORIO**

### **Riesgos Identificados**

#### **Riesgos Técnicos**
- [ ] **Riesgo 1**: [Descripción]
  - **Probabilidad**: [LOW | MEDIUM | HIGH]
  - **Impacto**: [LOW | MEDIUM | HIGH]
  - **Estrategia de Mitigación**: [Descripción]
  - **Plan de Fallback**: [Descripción]

- [ ] **Riesgo 2**: [Descripción]
  - **Probabilidad**: [LOW | MEDIUM | HIGH]
  - **Impacto**: [LOW | MEDIUM | HIGH]
  - **Estrategia de Mitigación**: [Descripción]
  - **Plan de Fallback**: [Descripción]

#### **Riesgos de Negocio**
- [ ] **Riesgo 1**: [Descripción]
  - **Probabilidad**: [LOW | MEDIUM | HIGH]
  - **Impacto**: [LOW | MEDIUM | HIGH]
  - **Estrategia de Mitigación**: [Descripción]
  - **Plan de Fallback**: [Descripción]

#### **Riesgos Operacionales**
- [ ] **Riesgo 1**: [Descripción]
  - **Probabilidad**: [LOW | MEDIUM | HIGH]
  - **Impacto**: [LOW | MEDIUM | HIGH]
  - **Estrategia de Mitigación**: [Descripción]
  - **Plan de Fallback**: [Descripción]

#### **Riesgos de Seguridad**
- [ ] **Riesgo 1**: [Descripción]
  - **Probabilidad**: [LOW | MEDIUM | HIGH]
  - **Impacto**: [LOW | MEDIUM | HIGH]
  - **Estrategia de Mitigación**: [Descripción]
  - **Plan de Fallback**: [Descripción]

### **Nivel de Riesgo General**
- **Probabilidad Promedio**: [LOW | MEDIUM | HIGH]
- **Impacto Promedio**: [LOW | MEDIUM | HIGH]
- **Riesgo General**: [LOW | MEDIUM | HIGH]

---

## 🔍 **Validación de Suposiciones** ⭐ **OBLIGATORIO**

### **Suposiciones Listadas y Validadas**

| Suposición | Validada | Evidencia | Confianza |
|------------|----------|-----------|-----------|
| **El componente es estable** | ✅ Sí | [Evidencia: versiones, releases, etc.] | 95% |
| **La documentación es completa** | ✅ Sí | [Evidencia: ejemplos, guías, etc.] | 90% |
| **La comunidad es activa** | ✅ Sí | [Evidencia: GitHub stars, issues, etc.] | 85% |
| **El rendimiento es el prometido** | ✅ Sí | [Evidencia: benchmarks, tests, etc.] | 80% |
| **La licencia es compatible** | ✅ Sí | [Evidencia: análisis legal, etc.] | 100% |

### **Nivel de Confianza General**
- **Confianza Promedio**: X%
- **Suposiciones Críticas Validadas**: X/X
- **Evidencia Suficiente**: ✅ Sí / ❌ No

---

## 🎯 **Decisión**

### **Solución Elegida**
[Descripción clara y específica de la decisión tomada]

### **Justificación**
[Explicar por qué se tomó esta decisión específica, incluyendo análisis de pros y contras]

### **Alternativas Rechazadas**
- **[Alternativa 1]**: [Por qué se rechazó]
- **[Alternativa 2]**: [Por qué se rechazó]
- **[Alternativa 3]**: [Por qué se rechazó]

---

## 📊 **Impacto**

### **Impacto Técnico**
- [Impacto en la arquitectura]
- [Impacto en el desarrollo]
- [Impacto en el rendimiento]
- [Impacto en la escalabilidad]

### **Impacto en Negocio**
- [Impacto en costos]
- [Impacto en timeline]
- [Impacto en funcionalidad]
- [Impacto en competitividad]

### **Impacto Operacional**
- [Impacto en mantenimiento]
- [Impacto en soporte]
- [Impacto en capacitación]
- [Impacto en procesos]

---

## 🚀 **Plan de Implementación**

### **Fase 1: Preparación (Semana 1)**
- [ ] Configuración del entorno
- [ ] Instalación de dependencias
- [ ] Configuración inicial
- [ ] Tests básicos

### **Fase 2: Integración (Semana 2-3)**
- [ ] Integración con sistema existente
- [ ] Configuración de multi-tenant
- [ ] Tests de integración
- [ ] Validación de compatibilidad

### **Fase 3: Producción (Semana 4)**
- [ ] Deploy en staging
- [ ] Tests de carga
- [ ] Monitoreo y alertas
- [ ] Deploy en producción

### **Fase 4: Optimización (Semana 5+)**
- [ ] Optimización de performance
- [ ] Ajustes basados en métricas
- [ ] Documentación final
- [ ] Capacitación del equipo

---

## 📈 **Métricas de Éxito**

### **Métricas Técnicas**
- **Performance**: [Objetivo específico]
- **Escalabilidad**: [Objetivo específico]
- **Disponibilidad**: [Objetivo específico]
- **Latencia**: [Objetivo específico]

### **Métricas de Negocio**
- **ROI**: [Objetivo específico]
- **Time to Market**: [Objetivo específico]
- **Costos**: [Objetivo específico]
- **Adopción**: [Objetivo específico]

### **Métricas Operacionales**
- **Mantenimiento**: [Objetivo específico]
- **Soporte**: [Objetivo específico]
- **Capacitación**: [Objetivo específico]
- **Documentación**: [Objetivo específico]

---

## 🔄 **Revisión y Seguimiento**

### **Revisiones Programadas**
- [ ] Revisión en 30 días
- [ ] Revisión en 90 días
- [ ] Revisión en 180 días
- [ ] Revisión anual

### **Criterios de Revisión**
- [ ] Cumplimiento de métricas de éxito
- [ ] Evaluación de riesgos realizados
- [ ] Feedback del equipo
- [ ] Cambios en el contexto

### **Triggers de Revisión**
- [ ] Cambios significativos en el contexto
- [ ] Nuevas alternativas disponibles
- [ ] Problemas de performance
- [ ] Cambios en requisitos de negocio

---

## 📚 **Referencias**

### **Documentación**
- [Enlace a documentación oficial]
- [Enlace a guías de implementación]
- [Enlace a ejemplos de uso]
- [Enlace a troubleshooting]

### **Recursos Externos**
- [Enlace a benchmarks]
- [Enlace a comparativas]
- [Enlace a casos de uso]
- [Enlace a comunidad]

### **Decisiones Relacionadas**
- [Enlace a ADR relacionado]
- [Enlace a decisión de negocio]
- [Enlace a decisión técnica]
- [Enlace a decisión operacional]

---

## 📝 **Notas Adicionales**

### **Consideraciones Especiales**
- [Consideración 1]
- [Consideración 2]
- [Consideración 3]

### **Lecciones Aprendidas**
- [Lección 1]
- [Lección 2]
- [Lección 3]

### **Próximos Pasos**
- [Paso 1]
- [Paso 2]
- [Paso 3]

---

**Última actualización:** YYYY-MM-DD por [Nombre]
**Próxima revisión:** YYYY-MM-DD
**Estado de validación:** ✅ TODOS LOS CRITERIOS OBLIGATORIOS CUMPLIDOS 