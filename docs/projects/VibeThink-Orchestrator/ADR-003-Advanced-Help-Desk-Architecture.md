# ADR-003: Arquitectura de Help Desk Avanzado y Plataforma de Experiencia del Cliente

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---

**Fecha**: 2024-06-20

**Estado**: Propuesto

**Relacionado con**: [ADR-002: Adopción de Arquitectura Avanzada de CRM y Flujos de Trabajo](ADR-002-Advanced-CRM-And-Workflow-Architecture.md)

## Contexto

Siguiendo la decisión de adoptar una arquitectura de flujos de trabajo flexible (ADR-002), se presenta la necesidad de definir la estrategia para el módulo de atención al cliente o "Help Desk". El objetivo es ir más allá de un simple sistema de tickets y crear una plataforma de experiencia del cliente que sea tan potente e intuitiva como la visión establecida para el CRM.

Se requiere que la solución sea adaptable a diferentes mercados, manejando terminologías específicas como "PQRS" (Peticiones, Quejas, Reclamos, Sugerencias) en Colombia, mientras mantiene una relevancia global.

## Decisión

1.  **Evolucionar el concepto de "Help Desk" a una "Plataforma de Experiencia del Cliente"**. El sistema no se limitará a la gestión de tickets reactivos, sino que se centrará en la gestión proactiva de todas las interacciones con el cliente.

2.  **Adoptar a Front (front.com) como modelo de inspiración principal** para la UX/UI y la filosofía de diseño. El concepto central será un **buzón de entrada inteligente y colaborativo** que unifique múltiples canales de comunicación (email, chat, etc.).

3.  **Reutilizar y extender la arquitectura definida en ADR-002**. El nuevo módulo de Help Desk se construirá sobre el mismo núcleo tecnológico:
    -   **Motor de Flujos (`React Flow`):** Permitirá a las empresas configurar sus propias reglas de negocio, SLAs, escalado y asignación de casos.
    -   **Inteligencia de Datos (`Pydantic AI`):** Se utilizará para analizar automáticamente el contenido de los casos entrantes, extrayendo intención, sentimiento, entidades y sugiriendo categorizaciones.
    -   **Componentes de UI (`Tiptap`, `shadcn/ui`):** Se reutilizarán para garantizar una experiencia de usuario consistente y de alta calidad.

4.  **Diseñar el sistema para ser terminológicamente agnóstico**. El módulo se conocerá internamente como "Case Management" o "Customer Experience Platform". Se proporcionará una opción en la configuración de cada empresa para que puedan etiquetar el sistema con el nombre que mejor se adapte a su contexto (ej. "PQRS", "Support Tickets", "Customer Service").

## Razón Fundamental

-   **Sinergia y Reutilización de Código**: Construir sobre la misma base arquitectónica del CRM reduce drásticamente el tiempo de desarrollo, aumenta la estabilidad y disminuye los costos de mantenimiento. Creamos una plataforma, no dos productos aislados.
-   **Ventaja Competitiva**: Un Help Desk que integra automatización visual, IA para el análisis de contenido y un enfoque en la colaboración de equipo nos diferencia de las soluciones de ticketing tradicionales y nos posiciona en el mercado premium.
-   **Adaptabilidad Global**: Al permitir la personalización de la terminología, creamos un producto que puede ser adoptado en cualquier mercado sin necesidad de costosas bifurcaciones de código, satisfaciendo requisitos locales como los de PQRS en Colombia.
-   **Coherencia de la Experiencia de Usuario**: Al compartir inspiración (Attio/Front) y componentes, el usuario final experimenta una plataforma unificada, donde los flujos de trabajo y la lógica operativa son consistentes entre el CRM y el Help Desk.

## Consecuencias e Implicaciones

-   **Dependencia del ADR-002**: La implementación de esta arquitectura de Help Desk está supeditada a la implementación exitosa de la arquitectura base descrita en el ADR-002. Su desarrollo se planificará *después* de la implementación del CRM departamentalizado.
-   **Impacto en la Base de Datos**: Requerirá su propio conjunto de tablas especializadas (`cases`, `case_comments`, `agents`, `slas`, `knowledge_base_articles`, etc.), que también deberán adherirse al modelo de seguridad departamentalizado.
-   **Planificación a Largo Plazo**: Esta decisión solidifica la visión de la plataforma a largo plazo, enfocándose en la creación de un sistema operativo empresarial integrado.
-   **Hoja de Ruta de Implementación (Post-CRM)**:
    1.  **Fase 1: Modelo de Datos**: Diseño del esquema de base de datos para el módulo de Help Desk.
    2.  **Fase 2: Integración del Buzón**: Conexión con canales iniciales (ej. una cuenta de email de soporte).
    3.  **Fase 3: Flujos de Trabajo**: Integración con el motor de `React Flow` para permitir la automatización de casos.
    4.  **Fase 4: Integración de IA**: Aplicación de `Pydantic AI` para el análisis y categorización de casos. 