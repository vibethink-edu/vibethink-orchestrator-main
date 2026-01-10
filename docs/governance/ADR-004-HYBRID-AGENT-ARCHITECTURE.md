# 🧠 ADR-004: Estrategia Híbrida de Agentes (Mastra + Agno)

> **Estado:** 🟢 ACEPTADO (Standard)
> **Fecha:** 2026-01-09
> **Decisores:** Arquitectura VibeThink
> **Contexto:** Necesidad de escalar "Departamentos Agénticos" eficientemente sin perder capacidad de análisis de datos.

---

## 1. El Conflicto
Tenemos dos herramientas excelentes con fortalezas opuestas:
*   **Agno (Python):** Líder indiscutible en Data Science, Vector Math y ecosistema ML. Pero pesado en memoria y difícil de escalar en concurrencia (GIL).
*   **Mastra (Node.js/TS):** Superior en I/O asíncrono, escalabilidad de "enjambres" (swarms) e integración web. Pero débil en cálculo numérico pesado.

## 2. La Decisión: "Arquitectura Híbrida Especializada"

No elegiremos "uno u otro". Asignaremos roles específicos basados en la naturaleza de la tarea.

### A. El rol de Mastra ("The Brain / The Manager")
Mastra será el **Orquestador Principal** y la capa de cara al usuario.
*   **Responsabilidades:**
    *   Manejar el Chat UI (Stream de texto).
    *   Gestionar el Grafo de Estado del Departamento (quién trabaja ahora).
    *   Ejecutar herramientas ligeras (búsqueda web, llamar API de CRM, enviar emails).
    *   Coordinar a los "Specialists".
*   **Por qué:** Node.js maneja 10,000 conexiones de WebSocket (chats) con una fracción de la RAM que necesitaría Python.

### B. El rol de Agno ("The Muscle / The Specialist")
Agno se reservará para **Microservicios de Análisis Pesado**.
*   **Responsabilidades:**
    *   Procesar PDFs gigantes (Document Intelligence).
    *   Ejecutar análisis financiero con `pandas`.
    *   Entrenar o fine-tunear modelos pequeños.
*   **Por qué:** Python tiene librerías que JS no tiene (o son muy lentas en JS).

---

## 3. Ejemplo Práctico: "Departamento de Ventas"

1.  **Usuario:** "Analízame las ventas del Q3 y redáctame un correo para el CEO."
2.  **Mastra (Manager):**
    *   Recibe el mensaje.
    *   Detecta intención: "Análisis de Datos" + "Redacción".
    *   Llama a `tool_create_draft` (Mastra/LLM) -> Redacta el esqueleto del correo.
    *   Llama a `service_sales_analysis` (Agno/Python) -> Envía JSON con parámetros.
3.  **Agno (Worker):**
    *   Recibe petición.
    *   Descarga CSVs, usa Pandas para calcular crecimiento YoY.
    *   Devuelve JSON: `{ growth: "15%", top_product: "X" }`.
4.  **Mastra (Manager):**
    *   Inyecta los datos de Agno en el borrador.
    *   Hace stream de la respuesta final al usuario.

---

## 4. Política de Implementación

1.  **Default a Mastra:** Todo agente nuevo comienza en Mastra (TypeScript). Es más barato y rápido de desplegar.
2.  **Excepción Agno:** Solo si el agente requiere una librería exclusiva de Python (`numpy`, `pytorch`, `cv2`), se crea como un worker de Agno aislado.

---

## 5. Consecuencias
*   **Positivas:** Reducción drástica de costos de infraestructura (menos contenedores Python ociosos). Mejor latencia en interacciones de chat.
*   **Negativas:** Mantener dos lenguajes en el stack (Polyglot).
*   **Mitigación:** Usar contenedores Docker estrictos para Agno y tratarlo como una "Black Box API".

---
**Firmado:** Arquitectura VibeThink
