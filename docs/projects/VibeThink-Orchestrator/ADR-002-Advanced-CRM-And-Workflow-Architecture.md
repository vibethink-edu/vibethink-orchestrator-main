# ADR-002: Adopción de Arquitectura Avanzada de CRM y Flujos de Trabajo

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

## Contexto

Tras un análisis de mercado y la revisión de plataformas líderes como Attio.com, se ha identificado una oportunidad estratégica para evolucionar las capacidades de nuestro sistema. La visión actual, aunque robusta, puede expandirse para satisfacer necesidades empresariales más complejas en las áreas de gestión de relaciones con clientes (CRM), automatización de flujos de trabajo y permisos de acceso a datos.

Las tecnologías clave identificadas para esta evolución son:
- **Pydantic & Pydantic AI**: Para validación de datos robusta y extracción de datos estructurados desde fuentes no estructuradas en el backend de Python.
- **Tiptap**: Como editor de texto enriquecido "headless" para una experiencia de usuario flexible y personalizable.
- **React Flow**: Para la construcción de interfaces visuales de nodos para la automatización de flujos de trabajo.

Adicionalmente, se ha propuesto una evolución fundamental en el modelo de permisos: pasar de un único rol de "manager" por empresa a un sistema **multi-manager departamentalizado**, donde cada departamento (Ventas, Finanzas, etc.) tenga su propio manager y silo de datos, garantizando la confidencialidad y autonomía.

## Decisión

1.  **Adoptar a Attio.com como modelo de inspiración principal** para el diseño de la experiencia de usuario (UX) en funcionalidades de CRM, onboarding y automatización de flujos de trabajo.
2.  **Integrar el siguiente stack tecnológico** para habilitar estas nuevas capacidades:
    -   **Frontend**:
        -   `Tiptap` para todas las necesidades de edición de texto enriquecido.
        -   `React Flow` para la interfaz de creación y visualización de flujos de trabajo automatizados.
    -   **Backend (Python/Edge Functions)**:
        -   `Pydantic` para la validación estricta de esquemas de datos en todas las APIs.
        -   `Pydantic AI` para procesar y estructurar datos provenientes de integraciones como Google Workspace y Microsoft 365 (ej. emails, documentos).
3.  **Evolucionar la arquitectura de permisos y datos a un modelo departamentalizado**. Esto implica abandonar el concepto de un único "manager" por empresa y adoptar un sistema donde se puedan crear múltiples departamentos, cada uno con sus propios managers y con sus datos aislados del resto de departamentos dentro de la misma empresa.
4.  **Utilizar Supabase Realtime Subscriptions** como mecanismo principal para la sincronización de datos en tiempo real en interfaces colaborativas como los grids de automatización, para replicar la fluidez y la inmediatez observada en Attio.

## Razón Fundamental

-   **Competitividad**: Este conjunto de características nos posiciona en un segmento de mercado más alto, compitiendo directamente con soluciones de CRM modernas y flexibles.
-   **Escalabilidad y Seguridad**: El modelo departamentalizado es fundamental para la adopción en empresas medianas y grandes, donde la confidencialidad de los datos entre áreas es un requisito no negociable. Se alinea con el principio de "menor privilegio".
-   **Calidad Tecnológica**: Las librerías seleccionadas (`Pydantic`, `Tiptap`, `React Flow`) son líderes en sus respectivos campos, bien mantenidas, y se integran limpiamente con nuestro stack existente de React/TypeScript/Python, asegurando mantenibilidad y una alta calidad de desarrollo.
-   **Experiencia de Usuario**: La construcción de interfaces de flujos de trabajo visuales y la sincronización en tiempo real mejoran drásticamente la usabilidad y el poder de la plataforma para el usuario final.

## Consecuencias e Implicaciones

Esta es una evolución arquitectónica significativa. Su implementación debe ser cuidadosamente planificada y ejecutada **después de la finalización del plan de estabilización actual (ver `