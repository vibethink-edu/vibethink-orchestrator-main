# ⚔️ Vendor Shootout: Mastra AI vs VibeThink Agno (Agentic Core)

> **Fecha:** 2026-01-09
> **Tipo:** Evaluación Arquitectónica (AI Framework)
> **Contendiente:** Mastra AI (TypeScript Agent Framework)
> **Estado:** 🟡 **EVALUAR SERIAMENTE (Fuerte Competidor)**

---

## 1. ¿Qué es Mastra AI?
Es un framework para hacer Agentes de IA, pero **Nativo en TypeScript**.
*   **Origen:** Creado por los fundadores de Gatsby.js.
*   **Filosofía:** "Local First", TypeScript estricto, diseñado para integrarse directamente en Next.js.
*   **Core Features:** Workflows, RAG, Evals y Observability incluidos.

---

## 2. El Dilema del Stack: Python (Agno) vs TypeScript (Mastra)

Actualmente, VibeThink usa un modelo "Polyglot":
*   **Next.js (TS):** Frontend & Orquestación ligera.
*   **Agno (Python):** Lógica pesada de agentes.

**¿Dónde cabe Mastra?**
Mastra entra para **eliminar a Python** de la ecuación (o reducirlo drásticamente).

| Criterio | Agno (Python) | Mastra (TypeScript) | Ganador para VibeThink |
| :--- | :--- | :--- | :--- |
| **DX (Developer Exp)** | Requiere venv, pip, puente HTTP. | Npm install y listo. Todo en un repo. | 🏆 **Mastra** |
| **Integración Next.js** | Vía API REST (lento). | Nativa (importación directa). | 🏆 **Mastra** |
| **Ecosistema AI** | Masivo (LangChain, LlamaIndex). | Creciendo (Vercel AI SDK, Mastra). | 🏆 **Agno** |
| **Complejidad** | Alta (Dos lenguajes). | Baja (Solo TypeScript). | 🏆 **Mastra** |

---

## 3. Matriz de Decisión

### Escenario A: Tus agentes son principalmente "Llamadas a LLM + Tools"
*   **Acción:** Migrar a **Mastra**.
*   **Beneficio:** Simplificas el despliegue a un solo contenedor Node.js. Eliminas la latencia de red entre Next y Python.

### Escenario B: Tus agentes hacen Data Science pesado (Pandas, PyTorch)
*   **Acción:** Mantener **Agno**.
*   **Beneficio:** Python sigue siendo el rey del cálculo numérico. TypeScript no sirve para entrenar modelos custom.

---

## 4. Veredicto Final

**¿Dónde cabe?**
Mastra es el **"Next.js Replacement" para nuestra capa de Agentes**. Podría reemplazar la necesidad de tener microservicios en Python.

**Recomendación:**
1.  **No reemplazar Agno hoy** (es arriesgado migrar todo ya).
2.  **PILOTO:** Implementar el próximo agente simple (ej. "Email Classifier") usando **Mastra dentro de Next.js**.
3.  **Comparar:** Si Mastra reduce el código en un 50% (al quitar el boilerplate de Python), entonces **adoptarlo como estándar para agentes ligeros**.

**Estado en Radar:** 🟡 **TRIAL** (Prioridad Alta).

---
**Firmado:** Arquitectura VibeThink
