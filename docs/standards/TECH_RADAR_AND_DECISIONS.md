# 🧠 Technology Radar & Decision Log

> **Propósito:** Centralizar las decisiones de adoptación o rechazo de tecnologías para evitar re-evaluaciones innecesarias ("Déjà vu tecnológico").
> **Estado:** LIVE DOCUMENT.

---

## 1. El Radar Tecnológico (VibeThink Radar)

Clasificamos las tecnologías en 4 anillos:

*   **🟢 ADOPT (Estándar):** Úsalo sin preguntar.
    *   *Ejemplos:* React 19, Tailwind v4, BullMQ, Agno, XYFlow (React Flow), Bundui.
*   **🟡 TRIAL (A prueba):** Úsalo con cuidado en proyectos piloto.
    *   *Ejemplos:* (Vacío por ahora)
*   **🔴 HOLD (Rechazado/Espera):** No usar por ahora. Ver razones abajo.
    *   *Ejemplos:* MotiaDev, Kestra, Moment.js.
*   **⚫ DEPRECATED (Prohibido):** Fue estándar, ahora se elimina.
    *   *Ejemplos:* `bundui-premium` (la carpeta legacy), Axios.

---

## 2. Registro de Shootouts (El Cementerio de Ideas)

Historización de batallas tecnológicas para futuros arquitectos.

| Candidato | Retador de | Fecha | Veredicto | Razón Principal | Link al Detalles |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MotiaDev** | VibeThink Core (Backend) | 2026-01-09 | 🔴 **RECHAZADO** | No reemplaza UI (Bundui). Compite con Backend pero añade lock-in innecesario. | [Ver Shootout](../evaluations/MOTIADEV_SHOOTOUT.md) |
| **Kestra** | VibeThink Core (Workflows) | 2026-01-09 | 🔴 **RECHAZADO** | Demasiado complejo (Java/Kafka) y UX basada en YAML (no apta para Tenants). | [Ver Shootout](../evaluations/KESTRA_SHOOTOUT.md) |
| **XYFlow** | (N/A) | 2026-01-09 | 🟢 **ADOPTADO** | Estándar visual insustituible para flujos "No-Code". | [Ver Análisis](../evaluations/MOTIADEV_VS_XYFLOW.md) |

---

## 3. Política de Nueva Evaluación

¿Alguien quiere proponer `Kestra` de nuevo en 6 meses?
**Regla:** Solo se permite re-abrir un caso si ha habido un cambio sustancial (ej. "Kestra lanzó una versión 100% Node.js ligera"). Si no, referir a este log y cerrar la discusión.

---

## 4. Ubicación de Documentos
Toda la evidencia forense se ha movido a:
*   `docs/evaluations/` (Todos los documentos `*_SHOOTOUT.md`).
*   `docs/standards/VENDOR_EVALUATION_POLICY.md` (Las reglas del juego).

---
**Mantenedor:** Arquitectura VibeThink
