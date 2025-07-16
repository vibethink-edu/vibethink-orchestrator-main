# FAQs Internos de Desarrollo y Decisiones

Este directorio contiene **FAQs internos** y registros de decisiones técnicas, arquitectónicas y de producto para el equipo de desarrollo de AI Pair Orchestrator Pro.

## Estructura y Protocolo
- Todas las decisiones críticas, ADRs y excepciones deben estar enlazadas aquí, categorizadas por tipo.
- Si un archivo es histórico, márcalo como tal y no lo elimines.
- Si una decisión importante solo existe en un archivo disperso, resúmela aquí y enlaza el original.
- Cada decisión nueva debe tener fecha, responsable, justificación y categoría.

---

# Índice Maestro de Decisiones, ADRs y Registros

## Arquitectura
- [ARCHITECTURE_DECISION_RECORDS.md](../../../docs/project/ARCHITECTURE_DECISION_RECORDS.md) — Registro de ADRs (histórico y actual)
- [ADR-003-Advanced-Help-Desk-Architecture.md](../../../docs/ADR-003-Advanced-Help-Desk-Architecture.md)
- [ADR-006-Design-Patterns-Architecture.md](../../../docs/ADR-006-Design-Patterns-Architecture.md)
- [ADR-007-Embedded-BI-Strategy.md](../../../docs/ADR-007-Embedded-BI-Strategy.md)
- [ADR-008-Augmented-Intelligence-Architecture.md](../../../docs/ADR-008-Augmented-Intelligence-Architecture.md)
- [memory-bank/templates/level5/architecture-change-template.md](../../../memory-bank/templates/level5/architecture-change-template.md) — Plantilla de cambios arquitectónicos

## Seguridad
- [critical-decisions.md](../../../memory-bank/essential/critical-decisions.md) — Decisiones clave de seguridad, arquitectura, negocio y despliegue (activo)
- [framework-decision-rules.md](../../../memory-bank/essential/framework-decision-rules.md) — Protocolo/checklist para documentar decisiones

## Negocio y Lógica
- [CRITICAL_DECISIONS_REGISTRY.md](../../../docs/CRITICAL_DECISIONS_REGISTRY.md) — Registro completo de decisiones críticas (histórico y actual)

## Integraciones
- [001-reimplementacion-vs-fork-postiz.md](./001-reimplementacion-vs-fork-postiz.md) — Decisión legal y técnica sobre Postiz
- [002-integracion-ai-gestion-claves.md](./002-integracion-ai-gestion-claves.md) — Integración AI y gestión de claves

## Desarrollo y Producto
- [003-rol-marketing-assistant.md](./003-rol-marketing-assistant.md) — Permisos y límites del Marketing Assistant
- [004-automatizacion-campanas-workflows.md](./004-automatizacion-campanas-workflows.md) — Automatización de campañas y workflows
- [005-migracion-planes-avanzados.md](./005-migracion-planes-avanzados.md) — Migración y personalización de planes

## Excepciones y Violaciones
- [violaciones-y-excepciones.md](./violaciones-y-excepciones.md) — Registro de violaciones, excepciones y cambios de reglas

## Histórico/Obsoleto
- [ARCHITECTURE_DECISION_RECORDS.md](../../../docs/ARCHITECTURE_DECISION_RECORDS.md) (histórico)
- [CRITICAL_DECISIONS_REGISTRY.md](../../../docs/CRITICAL_DECISIONS_REGISTRY.md) (histórico)

---

## Plantilla Sugerida
```markdown
# FAQ: [TÍTULO CLARO Y CONCRETO]

## 🎯 Pregunta principal
**P:** [Pregunta que responde este FAQ]

**A:** [Respuesta clara, con contexto y justificación]

## 📋 Detalles técnicos o de negocio
- [Puntos clave, riesgos, límites, dependencias]

## 🔄 Decisión tomada (si aplica)
- [Resumen de la decisión, fecha, responsables]

## 🕒 Pendiente/Futuro
- [Qué falta, cuándo se retoma, condiciones para reabrir]

## 🔗 Relacionadas
- [Otras FAQs, ADRs, documentación relevante]
``` 