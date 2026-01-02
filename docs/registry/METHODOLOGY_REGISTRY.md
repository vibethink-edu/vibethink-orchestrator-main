# Methodology Registry

Este registro rastrea el estado de evaluación de metodologías externas bajo el marco [MEF](../canon/METHODOLOGY_EVALUATION_FRAMEWORK.md).

| Methodology | Status | Decision Date | Decision Owner | Evidence | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BMAD** | PROPOSED | 2026-01-01 | Architect | - | Pendiente de evaluación MEP-001. |
| **SpecKit** | PROPOSED | 2026-01-01 | Architect | - | Interés en el parser de Spec Sheets. |
| **OpenSpec** | PROPOSED | 2026-01-01 | Architect | - | Posible solapamiento con ESI. |

---

## 🚦 Status Definitions
*   **PROPOSED**: En espera de evaluación. No permitida en producción/canon.
*   **ADOPTED**: Integrada totalmente. Parte del Canon.
*   **PARTIAL**: Solo componentes específicos están permitidos.
*   **REJECTED**: Evaluada e incompatible. Prohibida su aplicación.

## 🛡️ Enforcement Rule
Cualquier metodología marcada como `ADOPTED` o `PARTIAL` **DEBE** incluir un link de evidencia a su evaluación específica o al documento de Canon que la integra. PRs que cambien estados a `ADOPTED` sin evidencia serán bloqueados por el CI Gate.
