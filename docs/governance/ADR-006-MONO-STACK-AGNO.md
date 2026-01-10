# 🧠 ADR-006: Pivote a Mono-Stack Python (Agno First)

> **Estado:** 🟢 APROBADO (Override)
> **Fecha:** 2026-01-09
> **Referencia Anterior:** Supersedes [ADR-005 Hybrid](./ADR-005-HYBRID-POLYGLOT-ARCHITECTURE.md)
> **Motivo:** Evidencia de complejidad operativa excesiva en stack híbrido vs madurez de Python Async moderno.

---

## 1. El Nuevo Veredicto: "Keep It Simple, Scale Later"

Tras un análisis profundo de benchmarks 2025/2026 y el caso de estudio de Amazon Prime Video, hemos determinado que la **Arquitectura Híbrida (Node+Python) es una Optimización Prematura** para la fase actual de VibeThink.

**La Evidencia:**
1.  **I/O en Python:** Con `uvloop` y `FastAPI` modernos, Python maneja workloads de I/O (Websockets/Webhooks) con latencias competitivas a Node.js (70ms vs 45ms). La diferencia no justifica mantener dos infraestructuras.
2.  **Costos Ocultos:** Mantener dos lenguajes implica duplicar CI/CD, compartir tipos (DTOs), latencia de red entre servicios y mayor carga cognitiva.
3.  **Agno Maturity:** Agno v2+ (AgentOS) es un orquestador completo, ligero y rápido (500x más rápido en instanciación que LangGraph).

---

## 2. La Arquitectura Mono-Stack (Python Core)

### El Stack Unificado
*   **Backend & Orquestación:** **Agno (Python)**.
    *   Maneja el State Machine.
    *   Maneja el Chat (API/Websocket).
    *   Maneja el Cómputo (Pandas/OCR).
*   **Frontend:** **Next.js (TypeScript)**.
    *   Usa `Vercel AI SDK` en modo cliente solo para conectar con la API de Agno.
*   **Infraestructura:** Un solo contenedor/servicio escalable.

### Manejo de Cargas (The Pattern)
En lugar de separar por *lenguaje*, separamos por *proceso* dentro de Python:
*   **I/O Bound (Chat/Webhooks):** AsyncIO nativo (FastAPI).
*   **CPU Bound (OCR/Pandas):** `ProcessPoolExecutor` o Workers de Celery/BullMQ (mismo código Python, distinto proceso).

---

## 3. Rol de Mastra
Mastra pasa a estado **🟡 HOLD / OBSERVACIÓN**.
*   No se integrará en el Core Backend por ahora para evitar fragmentación.
*   Se evaluará en el futuro solo si el equipo de Frontend necesita capacidad agéntica "Edge" pura que no toque el backend.

---

## 4. Beneficios Inmediatos
1.  **Velocidad de Desarrollo:** Un solo repositorio de lógica de negocio.
2.  **Type Safety:** Pydantic como única fuente de verdad para validación de datos.
3.  **Zero Network Latency:** El orquestador llama al OCR en memoria (o proceso local), no por HTTP.

---
**Firmado:** Arquitectura VibeThink (Corrigiendo el rumbo hacia la simplicidad)
