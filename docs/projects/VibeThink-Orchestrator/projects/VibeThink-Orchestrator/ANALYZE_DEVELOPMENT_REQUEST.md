# Comando ANALYZE_DEVELOPMENT_REQUEST

## Resumen Ejecutivo

Este documento define el comando y metodología para análisis automático de requerimientos de desarrollo, estandarizando el proceso de evaluación de reutilización vs personalización.

## Comando: ANALYZE_DEVELOPMENT_REQUEST

### Sintaxis
```
ANALYZE_DEVELOPMENT_REQUEST {
  "client": "string",
  "requirements": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": "HIGH|MEDIUM|LOW",
      "complexity": "HIGH|MEDIUM|LOW",
      "estimated_effort": "number_weeks",
      "dependencies": ["string"],
      "constraints": ["string"]
    }
  ],
  "context": {
    "industry": "string",
    "compliance_requirements": ["string"],
    "integration_needs": ["string"],
    "budget_constraints": "string"
  }
}
```

### Ejemplo de Uso
```json
{
  "client": "ICA",
  "requirements": [
    {
      "id": "REQ-001",
      "title": "Gestión de Documentos Oficiales",
      "description": "Sistema para gestionar documentos oficiales con trazabilidad completa",
      "priority": "HIGH",
      "complexity": "HIGH",
      "estimated_effort": 8,
      "dependencies": ["auth-system", "audit-system"],
      "constraints": ["government-compliance", "data-encryption"]
    }
  ],
  "context": {
    "industry": "government",
    "compliance_requirements": ["CMMI", "ISO27001"],
    "integration_needs": ["kentico-v12", "government-systems"],
    "budget_constraints": "medium"
  }
}
```

---

## Metodología de Análisis

### 1. Evaluación de Reutilización

#### Criterios de Evaluación:
1. **Frecuencia de Uso (0-10)**
   - ¿Se usará en múltiples clientes?
   - ¿Es una funcionalidad común en el mercado?

2. **Especificidad del Cliente (0-10)**
   - ¿Es único para este cliente?
   - ¿Requiere personalización específica?

3. **Complejidad Técnica (0-10)**
   - ¿Requiere desarrollo complejo?
   - ¿Justifica desarrollo específico?

4. **Mantenimiento (0-10)**
   - ¿Facilita futuras modificaciones?
   - ¿Reduce duplicación de código?

#### Fórmula de Puntuación:
```
Reutilización Score = (Frecuencia * 0.3) + (Especificidad * 0.2) + (Complejidad * 0.3) + (Mantenimiento * 0.2)
```

#### Decisiones:
- **Score 7-10:** Desarrollar como módulo reutilizable
- **Score 4-6:** Evaluar caso por caso
- **Score 0-3:** Desarrollar como personalización específica

---

### 2. Análisis de Impacto

#### Impacto en Arquitectura:
- [ ] Nuevos módulos requeridos
- [ ] Modificaciones en módulos existentes
- [ ] Cambios en base de datos
- [ ] Nuevas APIs requeridas

#### Impacto en Desarrollo:
- [ ] Esfuerzo de desarrollo estimado
- [ ] Dependencias identificadas
- [ ] Riesgos técnicos
- [ ] Recursos requeridos

#### Impacto en Documentación:
- [ ] FAQs a actualizar
- [ ] Nueva documentación requerida
- [ ] Guías de usuario
- [ ] Documentación técnica

---

### 3. Estimación de Esfuerzo

#### Factores de Estimación:
1. **Complejidad Técnica**
   - Integración con sistemas externos
   - Requerimientos de compliance
   - Performance y escalabilidad

2. **Experiencia del Equipo**
   - Conocimiento de tecnologías
   - Experiencia en dominio
   - Disponibilidad de recursos

3. **Dependencias**
   - Módulos externos
   - Sistemas de terceros
   - Infraestructura requerida

#### Fórmula de Estimación:
```
Esfuerzo Base = Complejidad * Factor_Experiencia
Esfuerzo Total = Esfuerzo_Base * (1 + Factor_Dependencias) * (1 + Factor_Testing)
```

---

## Proceso de Análisis Automático

### Paso 1: Recepción de Requerimientos
```typescript
interface DevelopmentRequest {
  client: string;
  requirements: Requirement[];
  context: RequestContext;
}
```

### Paso 2: Análisis de Reutilización
```typescript
interface ReutilizationAnalysis {
  requirementId: string;
  reutilizationScore: number;
  recommendation: 'REUSABLE' | 'CUSTOM' | 'EVALUATE';
  reasoning: string;
}
```

### Paso 3: Análisis de Impacto
```typescript
interface ImpactAnalysis {
  requirementId: string;
  architectureImpact: string[];
  developmentImpact: string[];
  documentationImpact: string[];
  estimatedEffort: number;
}
```

### Paso 4: Generación de Reporte
```typescript
interface AnalysisReport {
  summary: string;
  recommendations: Recommendation[];
  effortEstimation: EffortEstimation;
  riskAssessment: RiskAssessment;
  nextSteps: string[];
}
```

---

## Plantillas de Análisis

### Plantilla para Módulo Reutilizable
```markdown
## Análisis: [NOMBRE_MODULO]

### Evaluación de Reutilización
- **Frecuencia de Uso:** [PUNTUACIÓN] - [JUSTIFICACIÓN]
- **Especificidad:** [PUNTUACIÓN] - [JUSTIFICACIÓN]
- **Complejidad:** [PUNTUACIÓN] - [JUSTIFICACIÓN]
- **Mantenimiento:** [PUNTUACIÓN] - [JUSTIFICACIÓN]

**Score Total:** [SCORE] - **Recomendación:** [REUTILIZABLE/CUSTOM]

### Arquitectura Propuesta
- **Módulo:** [NOMBRE_MODULO]
- **Interfaces:** [LISTA_INTERFACES]
- **Configuración:** [OPCIONES_CONFIGURACION]
- **Extensiones:** [PUNTOS_EXTENSION]

### Estimación de Esfuerzo
- **Desarrollo:** [X] semanas
- **Testing:** [X] semanas
- **Documentación:** [X] semanas
- **Total:** [X] semanas

### Impacto en Sistema
- **Módulos Afectados:** [LISTA_MODULOS]
- **APIs Nuevas:** [LISTA_APIS]
- **Base de Datos:** [CAMBIOS_BD]
```

### Plantilla para Personalización Específica
```markdown
## Análisis: [NOMBRE_FUNCIONALIDAD]

### Justificación de Personalización
- **Especificidad:** [JUSTIFICACIÓN]
- **Complejidad:** [JUSTIFICACIÓN]
- **Mantenimiento:** [JUSTIFICACIÓN]

### Arquitectura Propuesta
- **Módulo:** [NOMBRE_MODULO]_[CLIENTE]
- **Interfaces:** [INTERFACES_ESPECIFICAS]
- **Configuración:** [CONFIGURACION_ESPECIFICA]

### Estimación de Esfuerzo
- **Desarrollo:** [X] semanas
- **Testing:** [X] semanas
- **Documentación:** [X] semanas
- **Total:** [X] semanas

### Impacto en Sistema
- **Módulos Afectados:** [LISTA_MODULOS]
- **APIs Nuevas:** [LISTA_APIS]
- **Base de Datos:** [CAMBIOS_BD]
```

---

## Integración con Sistema de Documentación

### Archivos Generados Automáticamente:
- [ ] `docs/project/analysis/[CLIENTE]_[FECHA].md`
- [ ] `docs/features/[MODULO]/README.md`
- [ ] `docs/development/[MODULO]_guide.md`
- [ ] `docs/testing/[MODULO]_testing.md`

### Actualizaciones Automáticas:
- [ ] `docs/project/ANALYSIS_BACKLOG.md`
- [ ] `docs/project/DEVELOPMENT_REQUIREMENTS.md`
- [ ] `docs/project/IMPACT_ANALYSIS.md`
- [ ] `docs/project/IMPLEMENTATION_ROADMAP.md`

---

## Métricas de Calidad del Análisis

### Métricas de Precisión:
- [ ] Estimación vs tiempo real
- [ ] Reutilización vs uso real
- [ ] Impacto predicho vs real
- [ ] Satisfacción del cliente

### Métricas de Eficiencia:
- [ ] Tiempo de análisis
- [ ] Cobertura de requerimientos
- [ ] Calidad de documentación
- [ ] Reducción de rework

---

## Ejemplos de Análisis

### Ejemplo 1: Módulo Reutilizable
```json
{
  "requirement": "Sistema de Auditoría",
  "reutilizationScore": 8.5,
  "recommendation": "REUSABLE",
  "reasoning": "Funcionalidad común en múltiples industrias, alta complejidad técnica, facilita mantenimiento"
}
```

### Ejemplo 2: Personalización Específica
```json
{
  "requirement": "Integración con Sistema ICA",
  "reutilizationScore": 2.0,
  "recommendation": "CUSTOM",
  "reasoning": "Específico para entidad gubernamental, APIs únicas, baja reutilización"
}
```

---

## Próximos Pasos

1. **Implementar comando** en sistema de desarrollo
2. **Crear plantillas** de análisis automático
3. **Integrar con documentación** existente
4. **Validar metodología** con casos reales
5. **Refinar criterios** basado en feedback

---

*Comando creado:* 2025-01-22
*Responsable:* Marcelo SALES
*Estado:* Pendiente de implementación 