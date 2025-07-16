# ADR-005: Arquitectura Unificada - AI-First y Schema-First

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---

**Fecha:** 2025-06-22

**Autor:** Marcelo Escallón (CEO), AI Pair Assistant

**Estado:** Propuesto

---

## Contexto

Necesitamos definir una arquitectura coherente y escalable para la plataforma, que integre un CRM flexible (Schema-First) con las funcionalidades existentes y futuras (Helpdesk, PQRS, Workflows) sin generar complejidad accidental. El objetivo es evolucionar nuestro modelo actual, asimilando conceptos poderosos de plataformas como Attio, pero manteniendo nuestra propia identidad y robustez. Una directiva fundamental es que el Asistente de IA debe ser una capa omnipresente y contextualmente consciente en toda la plataforma.

## Decisión

Adoptamos una arquitectura de "Sistema Operativo y Aplicaciones Nativas", con los siguientes principios rectores:

1.  **El Núcleo es un CDP (Customer Data Platform):** El motor del CRM Schema-First es, en esencia, nuestro CDP. Unifica todos los datos del cliente (`Objects`, `Attributes`, `Records`) en un único repositorio central, eliminando los silos de datos desde el diseño.

2.  **La Herencia Funcional es "Schema-Aware", no "Schema-First":** Los módulos como Helpdesk, PQRS, Tareas o Workflows no replicarán la complejidad del núcleo. En su lugar, serán "conscientes del esquema" (`Schema-Aware`). Heredan la flexibilidad al poder leer, conectarse y ser extendidos por los `Objects` y `Attributes` definidos en el núcleo. Serán "Schema-Extensible" (ej. añadir campos personalizados a un ticket) pero no "Schema-First" en su propia implementación interna.

3.  **El Asistente de IA es una Capa Transversal y Contextual:** El Asistente de IA no es un módulo aislado. Es un componente embebido en cada interfaz principal. Su comportamiento y sugerencias se adaptan dinámicamente al contexto de la vista actual del usuario (un `Record`, una `List`, un `Workflow`, etc.), proveyendo asistencia proactiva y relevante.

4.  **Stack Tecnológico Minimalista y Evolutivo:** Mantenemos el stack actual (React, Supabase, PostgreSQL) para el MVP, maximizando sus capacidades nativas (Full-Text Search, JSONB, RPCs). Nuevas dependencias (ej. Typesense para búsqueda, Resend para email transaccional) se documentarán como evoluciones futuras y se añadirán solo cuando el crecimiento de la escala lo justifique.

## Consecuencias

*   **Positivas:**
    *   **Flexibilidad Controlada:** Obtenemos una plataforma adaptable sin que cada módulo se convierta en un sistema complejo por sí mismo.
    *   **Experiencia de Usuario Unificada:** Todas las "aplicaciones" (CRM, Helpdesk) se sienten conectadas porque beben de la misma fuente de datos y son aumentadas por el mismo Asistente de IA.
    *   **Desarrollo Enfocado:** Los equipos pueden trabajar en módulos especializados (ej. Helpdesk) con estructuras estables, mientras que el equipo de "Core" se enfoca en el motor de datos.
    *   **Ventaja Competitiva:** La IA contextual embebida y la eliminación de silos de datos son diferenciadores clave.

*   **Negativas o Riesgos a Mitigar:**
    *   **Complejidad en el Núcleo:** La implementación del motor Schema-First es compleja. Se mitigará con una fuerte capa de abstracción (RPCs, hooks de React).
    *   **Rendimiento:** Las consultas dinámicas pueden ser lentas. Se mitigará con indexación agresiva (GIN) y virtualización total en el frontend.
    *   **Dependencia del Contexto:** El Asistente de IA requiere una gestión de estado robusta para saber siempre "dónde" está el usuario.

Este ADR servirá como la guía principal para todas las decisiones de desarrollo futuras en la plataforma. 