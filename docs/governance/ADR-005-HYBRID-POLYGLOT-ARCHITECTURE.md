# 🧠 ADR-005: Arquitectura Híbrida "Agentic Polyglot" (Sellada)

> **Estado:** 🟢 CONFIRMADO (Cross-Validated)
> **Fecha:** 2026-01-09
> **Validación Externa:** OpenAI o1/Expert Analysis
> **Decisión:** Implementar separación Node.js (Control Plane) + Python (Compute Plane).

---

## 1. El Veredicto Experto (Resumen)

La consulta externa validó nuestra hipótesis. La separación **NO es optimización prematura** dado nuestro caso de uso (OCR + Pandas pesado).

**Puntos Clave Validados:**
*   **Separación Correcta:** El perfil de carga es radicalmente distinto (Chat vs OCR).
*   **Contenedor vs Monolito:** Es "Safe" separar desde ahora para evitar deuda técnica de empaquetado (builds de 5GB).

---

## 2. La Arquitectura "Híbrido Mínimo y Contractual"

No haremos "microservicios por gusto". Haremos **Dos Planos**:

### A. Control Plane (Mastra / TypeScript)
*   **Rol:** El "Jefe de Tráfico".
*   **Responsabilidades:** Webhooks, Chat, State Machine, Billing.
*   **Patrón de Comunicación:** Job Queue (BullMQ) + S3 (para archivos).
*   **Regla:** Nunca procesa binarios pesados en memoria.

### B. Compute Plane (Agno / Python)
*   **Rol:** El "Laboratorio".
*   **Responsabilidades:** OCR, Pandas, PDF Generation.
*   **Interfase:** "Black Box API". Recibe S3 URL -> Devuelve JSON/URL.
*   **Regla:** Stateless. Se levanta, procesa, muere (o duerme).

---

## 3. Mitigación de "Pain Points"

Para evitar el infierno de integración, estas reglas son CANÓNICAS:

| Pain Point | Solución Canónica VibeThink |
| :--- | :--- |
| **Tipos Compartidos** | **OpenAPI First.** El contrato se define en JSON Schema. Se generan tipos TS y Pydantic Models automáticamente. |
| **Data Gravity** | **S3-Only Transport.** Nunca pasar base64 por la cola. Solo URLs firmadas. |
| **Retries** | **Orchestrator Owns It.** Mastra reintenta la tarea. Agno debe ser idempotente. |
| **Debug** | **Trace ID Header.** Mastra genera `x-trace-id`, Agno lo loguea en cada print. |

---

## 4. Próximos Pasos (Roadmap de Implementación)
1.  **Piloto:** Implementar el "Agente Legal" con esta separación.
2.  **Infra:** Configurar BullMQ para conectar ambos mundos.
3.  **Contrato:** Definir el `schema.json` compartido.

---
**Firmado:** Arquitectura VibeThink
