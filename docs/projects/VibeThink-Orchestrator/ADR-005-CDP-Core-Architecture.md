# ADR-005: Arquitectura de Núcleo Basada en una Plataforma de Datos de Cliente (CDP)

**Fecha**: 2024-06-20

**Estado**: Propuesto

**Relacionado con**: [ADR-002](ADR-002-Advanced-CRM-And-Workflow-Architecture.md), [ADR-003](ADR-003-Advanced-Help-Desk-Architecture.md), [ADR-004](ADR-004-Integrated-Scheduling-Platform.md)

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---


## Contexto

Las arquitecturas definidas en los ADRs 002, 003 y 004 describen una suite de aplicaciones de negocio potentes (CRM, Help Desk, Agendamiento). Para que estas aplicaciones alcancen su máximo potencial y operen de forma sinérgica, se requiere un núcleo central que unifique los datos del cliente desde todos los puntos de contacto. Un enfoque tradicional de base de datos relacional es insuficiente para capturar el historial completo de interacciones, eventos y comportamientos del cliente.

Se necesita una solución que cree una vista de 360° del cliente en tiempo real, que sea capaz de procesar flujos de eventos a gran escala y que sirva como base para la personalización avanzada y la inteligencia artificial.

## Decisión

1.  **Adoptar una arquitectura de núcleo basada en una Plataforma de Datos de Cliente (CDP - Customer Data Platform)**. Este CDP no será un producto externo, sino un componente central y auto-hospedado de nuestra plataforma.

2.  **Seleccionar Tracardi (tracardi.io) como la tecnología base para nuestro núcleo CDP**. La elección se justifica por su naturaleza **open source**, su enfoque **API-first**, su backend en Python (alineado con nuestro stack) y su soporte nativo para conceptos clave como la unificación de perfiles (Identity Resolution), flujos de trabajo de procesamiento de eventos y almacenamiento de vectores para IA.

3.  **El CDP funcionará como el "sistema nervioso central" de la plataforma**. Todos los módulos (CRM, Help Desk, Agendamiento, etc.) enviarán flujos de eventos estandarizados al CDP. El CDP, a su vez, ingiere, procesa y enriquece estos eventos para construir y mantener un **Perfil de Cliente Unificado**.

4.  **La arquitectura de datos será híbrida**:
    -   **Capa de Eventos y Perfil Unificado (Tracardi)**: Gestionará el flujo de eventos en tiempo real y el perfil de 360°, que incluye todo el historial de interacciones.
    -   **Capa de Estado (Supabase - PostgreSQL)**: Continuará siendo la fuente de verdad para el *estado actual* y los datos relacionales de la aplicación (usuarios, empresas, configuración). Será enriquecida constantemente con datos agregados desde el CDP.
    -   **Capa de IA (Base de Datos Vectorial)**: Se utilizará para almacenar embeddings y otros datos para búsquedas semánticas y modelos de IA, gestionada a través de las capacidades de Tracardi.

## Razón Fundamental

-   **Única Fuente de Verdad del Cliente**: Elimina los silos de datos entre el CRM, el Help Desk y otras aplicaciones. Todos los módulos operan sobre la misma vista completa y actualizada del cliente.
-   **Capacidades de Automatización Avanzada**: Los eventos que ocurren en cualquier parte de la plataforma (ej. "cliente abre email") pueden ser utilizados por nuestro motor de flujos (`React Flow`) para disparar automatizaciones complejas y transversales.
-   **Fundamento para la Inteligencia Artificial**: Un CDP que organiza y estructura el historial del cliente es el prerrequisito para cualquier iniciativa seria de IA, como la predicción de comportamiento, la segmentación inteligente o la personalización predictiva.
-   **Escalabilidad y Rendimiento**: Desacopla la ingesta masiva de eventos de la base de datos transaccional principal, asegurando que la plataforma pueda escalar para manejar un gran volumen de interacciones sin degradar el rendimiento de la aplicación principal.
-   **Propiedad y Control Total**: Al usar una solución open source como Tracardi, evitamos los costos de licencia de los CDP comerciales y mantenemos un control total sobre nuestros datos y nuestra hoja de ruta tecnológica.

## Consecuencias e Implicaciones

-   **Decisión Arquitectónica Fundamental**: Esta es la decisión de más alto nivel y sirve como la base sobre la que se construirán todos los demás sistemas. Su implementación debe ser prioritaria en la hoja de ruta de la nueva arquitectura.
-   **Complejidad de la Infraestructura**: Requiere la implementación y el mantenimiento de la infraestructura de Tracardi (que incluye dependencias como Elasticsearch/OpenSearch y Redis) junto con nuestra infraestructura de Supabase.
-   **Estandarización de Eventos**: Requiere la creación de un esquema de eventos estandarizado (un "diccionario de datos") que será utilizado por todos los módulos para comunicarse con el CDP.
-   **Plan de Implementación Fásico (Post-Estabilización)**:
    1.  **Fase 1: Infraestructura del CDP**: Despliegue y configuración de una instancia de Tracardi.
    2.  **Fase 2: Ingesta de Eventos Básicos**: Instrumentación de los módulos clave (CRM, Auth) para enviar eventos básicos (ej. `user_created`, `contact_added`).
    3.  **Fase 3: Unificación de Perfil Inicial**: Configuración de las reglas básicas en Tracardi para empezar a construir los perfiles unificados.
    4.  **Fase 4: Integración con Flujos de Trabajo**: Conexión del CDP con el orquestador `React Flow` para habilitar las primeras automatizaciones basadas en eventos. 