# Methodology Evaluation Framework (MEF)

**ID**: VITO-CANON-001  
**Status**: ACTIVE  
**Law**: VITO-FOUNDATION-001

## ⚖️ VITO-FOUNDATION-001: Actualidad sobre Historia
ViTo es la única autoridad metodológica vigente en este repositorio. Cualquier metodología externa (BMAD, SpecKit, OpenSpec u otra) solo puede adoptarse mediante un proceso de evaluación serio, auditable y basado en la base de conocimiento actual de ViTo. 

**Nada gobierna por historia. Nada decide por costumbre.**

---

## 🛠️ El Proceso MEF
Para que una metodología o patrón externo sea integrado en el Canon de ViTo, debe seguir este flujo:

1.  **Inventario**: Identificación clara de la metodología y sus promitentes.
2.  **Matriz de Alineación**: Evaluación contra los principios de ViTo (AI-First, 3-Layer Architecture).
3.  **Decisión**: Determinación de un estado:
    *   **ADOPT**: Integración total.
    *   **PARTIAL**: Adopción de sub-componentes específicos.
    *   **REJECT**: Incompatible o redundante.
4.  **Canonización**: Registro de la decisión y actualización de los documentos técnicos.

## 📋 Criterios de Evaluación
Cada propuesta debe ser auditada bajo los siguientes ejes:
*   **Alineación ViTo**: ¿Respeta la jerarquía "Z ejecuta, no decide"?
*   **Claridad**: ¿Es comprensible para agentes AI sin ambigüedad?
*   **Portabilidad a Gates**: ¿Se puede validar mediante scripts automáticos?
*   **Costo Cognitivo**: ¿Simplifica o complica el flujo de desarrollo?

---

## 🧼 VITO-HYGIENE-002: No Drift
Se prohíbe el "Methodological Drift". Ningún PR puede introducir patrones de una metodología no adoptada formalmente (`ADOPTED` o `PARTIAL` en el Registry). La mención de términos externos en el código sin respaldo canónico se considera deuda técnica inmediata.

## 🚫 No Implicit Adoption
La adopción por costumbre ("siempre lo hemos hecho así") es inválida. Si una metodología no está en el `docs/registry/METHODOLOGY_REGISTRY.md` con evidencia de evaluación, **no existe** para el sistema de gobernanza de ViTo.

---

## 🧪 Ejemplo de Evaluación (Hipotético)

| Methodology | Core Concept | Alignment | Decision |
| :--- | :--- | :--- | :--- |
| **BMAD** | Business-Managed Development | Low (ViTo is Architect-Driven) | **REJECTED** |
| **SpecKit** | YAML-First Spec Sheets | High (Executable Specs) | **PARTIAL** (Porting Spec parser only) |
| **OpenSpec** | Universal Interface Contract | Medium (Redundant with ViTo ESI) | **PROPOSED** |

---
*Documento generado por el Arquitecto Principal - Enero 2026*
