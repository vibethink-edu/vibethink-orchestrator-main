# 🕵️ Caso de Uso: "El Abogado Comercial Digital" (Arquitectura Híbrida)

> **Escenario:** Un agente para oficinas de abogados/comerciales que automatiza el flujo de trabajo diario.
> **Tareas:** Leer correos, asistir a reuniones (transcribir), crear tareas, scraping legal/competencia, reportes consolidados.

---

## 1. Desglose de Tareas & Asignación de Motor

Aquí verás la potencia de la arquitectura híbrida **Mastra (Orquestador)** + **Agno (Especialista)**.

| Tarea | Motor Asignado | Razón Técnica |
| :--- | :--- | :--- |
| **1. Leer Correos (Gmail/Outlook)** | **Mastra (Node.js)** | I/O puro. Node.js es increíblemente eficiente esperando y procesando webhooks de Gmail. No gasta CPU. |
| **2. Asistir a Reuniones (Google Meet)** | **Agno (Python) o Servicio** | Transcribir audio requiere modelos pesados (Whisper). Si es local, Python (Agno). Si es API (Deepgram), Mastra. |
| **3. Crear Tareas (Jira/Asana)** | **Mastra (Node.js)** | Simple llamada API REST. Mastra lo hace en milisegundos. |
| **4. Scraping (Web Legal/Competencia)** | **Híbrido** | *Simple:* Mastra (fetch). *Complejo (JS, Captchas):* Servicio dedicado o Agno con Selenium/Playwright (aunque Node también es bueno aquí, Python tiene mejores libs de anti-detección a veces). |
| **5. Consolidar Reportes (PDF/Excel)** | **Agno (Python)** | **PUNTO CLAVE.** Generar un PDF legal complejo o manipular Excel con Pandas es territorio de Python. Mastra delega esto a Agno. |

---

## 2. Flujo de Ejecución (The Pipeline)

```mermaid
graph TD
    A[📩 Nuevo Correo: "Demanda Pendiente"] -->|Webhook| M(Mastra Manager)
    M -->|Analizar Intención| M_AI[LLM Rápido: "Es urgente?"]
    M_AI -->|Sí, requiere Info| M
    M -->|Solicitar Búsqueda| S(Scraper Tool)
    S -->|Datos Web| M
    M -->|Solicitar Resumen Legal| W(Agno Specialist)
    W -->|Python: NLP Legal + PDF Gen| W_Result[Reporte PDF]
    W_Result --> M
    M -->|Enviar Respuesta| Gmail API
    M -->|Crear Tarea| CRM API
```

---

## 3. ¿Por qué esta arquitectura gana aquí?

1.  **Latencia del Correo:** Mastra responde al webhook del correo instantáneamente. Si usaras Agno para todo, tendrías un proceso pesado de Python levantándose solo para recibir un JSON.
2.  **Escalabilidad:** Imagina que tienes 500 abogados.
    *   **Solo Agno:** Necesitas 500 Workers de Python (consumo de RAM brutal).
    *   **Híbrido:** Un solo servidor Mastra maneja los 500 correos entrantes. Solo llamas a Agno (Python) los 10 segundos que necesitas generar el PDF del reporte. El resto del tiempo, tu infraestructura pesada "duerme" ($$$ ahorro).

---

## 4. Conclusión para este Caso
El "Abogado Comercial" es el ejemplo perfecto de por qué no puedes casarte con un solo lenguaje.
*   Usa **Mastra** para ser el "Secretario Rápido" (Mover datos, APIs, Chat).
*   Usa **Agno** para ser el "Paralegal Experto" (Analizar documentos, Generar reportes complejos).

---
**Documento de Diseño:** `docs/architecture/USE_CASE_LEGAL_AGENT.md`
