# ADR-007: Estrategia de Business Intelligence (BI) y Analítica Embebida

**Fecha**: 2024-06-20

**Estado**: **APROBADO**

**Relacionado con**: `docs/SYSTEM_ARCHITECTURE_OVERVIEW.md`, `docs/ADR-005-CDP-Core-Architecture.md`

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---


## 1. Contexto

La arquitectura de la plataforma está diseñada para ser un sistema de recolección de datos unificado y de alta fidelidad (vía el CDP Tracardi). Una vez que los datos son recolectados, limpiados y almacenados, el siguiente paso lógico y de mayor valor para el cliente es proporcionar herramientas para analizar y actuar sobre estos datos.

Se requiere una solución de Business Intelligence (BI) que permita a los usuarios no técnicos (gerentes, analistas de negocio) de nuestras empresas clientes visualizar, explorar y entender sus datos de forma autónoma (self-service).

## 2. Decisión Estratégica

1.  **Integrar una Capa de Business Intelligence (BI) Embebida**: Se ofrecerá un módulo de BI nativo dentro de la plataforma, permitiendo a los clientes crear y consumir dashboards y reportes sin salir de nuestro ecosistema.

2.  **Adoptar Lightdash como la Plataforma de BI Open Source**: Se ha seleccionado **Lightdash** como el motor principal para nuestra capa de BI. Su alineación con el stack de datos moderno, su naturaleza open source y su integración nativa con `dbt` la convierten en la opción estratégica ideal.

3.  **Implementar Data Build Tool (dbt) para el Modelado de Datos**: Toda la lógica de negocio y las métricas (ej. "Ingresos", "Clientes Activos", "Tasa de Abandono") se definirán y modelarán utilizando `dbt`. Esto garantiza que las métricas sean consistentes, versionables y confiables. Lightdash consumirá directamente estos modelos de `dbt`.

4.  **Hoja de Ruta para IA - Consulta en Lenguaje Natural (NLQ)**: Como una evolución futura, se desarrollará una interfaz de "Chat con tus Datos" (inspirada en Chat2DB). Esta funcionalidad utilizará la capa semántica definida en `dbt` para traducir preguntas en lenguaje natural a consultas y visualizaciones, democratizando aún más el acceso a los datos.

5.  **Descarte de Alternativas Conflictivas**: Herramientas como Hasura son descartadas para este propósito, ya que representan un patrón de arquitectura de backend (GraphQL sobre la base de datos) que entra en conflicto con nuestra arquitectura de servicios ya definida.

## 3. Razón Fundamental

-   **Valor para el Cliente**: Pasar de la recolección de datos a la generación de insights es el mayor salto de valor que podemos ofrecer. Empodera a nuestros clientes para que tomen decisiones basadas en los datos que nuestra plataforma les ayuda a unificar.
-   **Coherencia y Confianza en los Datos**: El uso de `dbt` como única fuente de verdad para las métricas asegura que un "ingreso" se calcule de la misma manera en todos los reportes, eliminando la ambigüedad y aumentando la confianza en los datos.
-   **Alineación con el Stack Moderno**: La combinación Lightdash + dbt es el estándar de oro actual para BI de código abierto, asegurando que nuestra plataforma sea moderna, mantenible y atractiva para el talento técnico.
-   **Sostenibilidad y Control**: Al basarnos en soluciones open source (Lightdash, dbt), mantenemos el control total sobre nuestra hoja de ruta y evitamos los altos costos de licencia de plataformas de BI propietarias como Looker o Tableau.

## 4. Consecuencias e Implicaciones

-   **Infraestructura**: Requerirá el despliegue y mantenimiento de una instancia de Lightdash junto con el resto de nuestros servicios. Esto se incluirá en nuestra estrategia de infraestructura por fases (empezando con Docker Compose).
-   **Nuevas Capacidades de Equipo**: Requerirá habilidades en **modelado de datos con dbt**. Este es un perfil de "Analytics Engineer", que puede ser un rol especializado o una habilidad desarrollada por nuestros ingenieros de backend.
-   **Integración con el CDP**: Los datos modelados en `dbt` se nutrirán de las tablas limpias y enriquecidas que el CDP Tracardi produce en nuestra base de datos principal (Supabase).
-   **Modelo de Negocio**: Esta funcionalidad de BI avanzado será un diferenciador clave y un fuerte candidato para ser incluido en los planes de suscripción de nivel superior.
-   **Clarificación sobre la Implementación de NLQ (Chat con tus Datos)**: A raíz de la investigación del modelo de negocio de Chat2DB (que es "Open Core" y no incluye las funciones de IA en su versión comunitaria), se especifica que nuestra implementación de NLQ **no integrará Chat2DB directamente**. En su lugar, **se construirá una solución propia** que consistirá en un pipeline que: 
    1.  Toma la pregunta del usuario.
    2.  La envía a un modelo de lenguaje grande (LLM) a través de nuestros conectores de IA existentes.
    3.  El LLM genera una consulta SQL basada en el esquema de datos proveído.
    4.  Nuestra plataforma ejecuta la consulta y visualiza el resultado.
    
    Este enfoque nos da control total sobre la funcionalidad, evita dependencias de terceros para características críticas y se alinea con nuestra estrategia de costos basada en el uso de API de IA. 