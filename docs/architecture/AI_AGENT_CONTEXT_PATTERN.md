# 🕵️ Análisis de Patrón: "The Contextual Agent Interface"

> **Deducción de Caso de Uso:** El usuario tiene una UI donde un **Agente (Sidebar)** siempre está presente junto a una **Línea de Tiempo (Contextual Timeline)**.

### El Patrón: "Chat with Context"
No es un simple chatbot. Es un **Copiloto Contextual**.

1.  **El Timeline es el "Estado del Mundo":**
    *   Muestra lo que ha pasado (emails enviados, llamadas, cambios de estado).
    *   Es la "Memoria a Largo Plazo" visualizada para el humano.

2.  **El Agente (Sidebar) es el "Ejecutor":**
    *   El usuario mira el Timeline y dice: *"Oye, veo que le mandamos la propuesta ayer. Mándale un follow-up preguntando si tiene dudas."*
    *   El agente **lee el contexto** (sabe qué propuesta se mandó porque está en el timeline) y ejecuta la acción.

### Por qué esta UI es Brillante
*   **Grounding:** El usuario no tiene que explicarle todo al agente ("Recuerdas el correo de ayer?"). El agente *ya lo ve* en el contexto de la entidad (`lead`, `ticket`, `claim`).
*   **Transparencia:** Cuando el agente hace algo (ej. "Enviando email"), esa acción **aparece inmediatamente en el Timeline**.
    *   *Acción:* Agente manda email.
    *   *Feedback:* Timeline se actualiza con un item "Email Sent".

### Implementación en la Arquitectura Híbrida
*   **Mastra (Node):**
    *   Maneja el WebSocket del Chat (Sidebar).
    *   Escucha eventos de cambios de estado para actualizar el Timeline en tiempo real (Reactive UI).
*   **Agno (Python):**
    *   Si el usuario pide "Analiza todos los PDFs de este timeline", Mastra se los pasa a Agno.

### Conclusión
El caso de uso es **"Gestión de Casos Asistida por IA"**.
Sea un caso legal, un lead de ventas o un reclamo de seguros. El humano supervisa la historia (Timeline) y el agente opera sobre ella.
