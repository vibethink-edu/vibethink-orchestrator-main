# Proceso Automatizado de Validación de Dependencias (El "Guardián")

**Fecha:** 2024-06-20

**Estado:** **APROBADO - Proceso Operativo**

**Propósito:** Este documento describe el proceso automatizado y auditable para la gestión de actualizaciones de componentes de software de código abierto. El objetivo es cumplir con los requisitos de madurez de procesos (como CMMI) generando evidencia como un subproducto natural del flujo de trabajo, sin crear una carga administrativa.

---

## 1. Filosofía: La Evidencia como Subproducto

El proceso está diseñado para que cada etapa genere un **artefacto digital inmutable y rastreable**. La auditoría no se basa en documentos manuales, sino en la revisión de la cadena de artefactos generados por la automatización y las decisiones humanas registradas en el sistema.

## 2. El Flujo de Gestión del Cambio y sus Artefactos Auditables

```mermaid
sequenceDiagram
    participant D as Dependabot / Detección
    participant GH_A as GitHub Actions (Workflow)
    participant OT as OpenTofu
    participant Tests as Batería de Pruebas
    participant Bot as Bot de Reporte
    participant Arq as Arquitecto (Humano)
    participant Git as Repositorio de Infra

    D->>GH_A: 1. Detecta nueva versión y dispara el workflow (La Solicitud)
    Note over D,GH_A: Artefacto: Trigger del Workflow

    GH_A->>OT: 2. Provisiona entorno de validación efímero
    Note over GH_A,OT: Artefacto: Log de OpenTofu en el Workflow

    GH_A->>Tests: 3. Ejecuta batería de pruebas (API, E2E, Seguridad)
    Note over GH_A,Tests: Artefacto: Reportes de Pruebas (JUnit XML, JSON)

    Tests-->>Bot: 4. Envía resultados de las pruebas
    Bot->>Git: 5. Abre un Pull Request con el cambio de versión
    Note over Bot,Git: Artefacto: Pull Request (La Propuesta de Cambio)

    Bot->>Git: 6. Comenta el PR con el resumen de las pruebas
    Note over Bot,Git: Artefacto: Comentario del Bot (El Análisis de Impacto)

    Arq->>Git: 7. Revisa el PR, discute y aprueba el cambio
    Note over Arq,Git: Artefacto: Aprobación explícita en GitHub (La Decisión)

    Git->>GH_A: 8. La fusión del PR dispara el pipeline de despliegue
    Note over Git,GH_A: Artefacto: Commit de Fusión (La Mejora Implementada)
```

---

## 3. Desglose de Artefactos para Auditoría CMMI

Este es el núcleo de cómo respondemos a un auditor.

### Nivel de Madurez 2-3: Proceso Definido y Gestionado

**Auditor:** "Muéstrenme su proceso definido para gestionar una actualización de una dependencia crítica, como un parche de seguridad en su sistema de autenticación."

**Nuestra Respuesta:** "Nuestro proceso está definido en el documento `AUTOMATED_DEPENDENCY_VALIDATION_PROCESS.md`. Ahora, permítame mostrarle una ejecución real de ese proceso."

**Auditor:** "Ok, muéstrenme el registro para la actualización de `fusionauth` a la versión `1.50.1`."

**Nosotros mostramos (con enlaces directos):**

1.  **La Solicitud (El "Porqué"):**
    *   "Aquí está el Pull Request #123 que abrió Dependabot, indicando una vulnerabilidad de seguridad en la versión anterior. Esta es nuestra solicitud de cambio registrada."

2.  **La Ejecución del Proceso (La "Prueba de Trabajo"):**
    *   "Al abrirse ese PR, se disparó automáticamente nuestro workflow del 'Guardián'. Aquí está el enlace a la ejecución del workflow #456 en GitHub Actions, donde puede ver cada paso que se ejecutó, con sus logs y tiempos."

3.  **El Análisis de Impacto (La "Evaluación"):**
    *   "Como parte de la ejecución, se generaron estos artefactos: el reporte de vulnerabilidades de Trivy y los resultados de las pruebas de regresión. Están adjuntos a la ejecución del workflow. Además, nuestro bot resumió estos hallazgos en este comentario dentro del mismo Pull Request #123 para una fácil revisión."

4.  **La Aprobación (La "Decisión Documentada"):**
    *   "Como puede ver en la conversación del PR, el arquitecto líder revisó el informe del bot, confirmó que el parche no introducía regresiones y dio su aprobación formal haciendo clic en el botón 'Approve'. Esta es nuestra aprobación registrada e inmutable."

5.  **La Implementación de la Mejora (El "Cierre del Ciclo"):**
    *   "Una vez aprobado, el PR fue fusionado en este commit `[hash]`. Este commit es la prueba de que la mejora fue integrada en nuestra base de código."

6.  **La Verificación del Despliegue:**
    *   "Finalmente, ese commit de fusión disparó nuestro pipeline de despliegue principal (enlace al workflow #457), que llevó la nueva versión segura a producción. Como puede ver, todos los pasos posteriores de health-check fueron exitosos."

### Conclusión para el Auditor

Hemos demostrado un proceso **repetible, gestionado, medible y rastreable** de principio a fin, donde cada etapa clave está documentada con evidencia digital generada por el propio sistema. Cumplimos con los principios de CMMI sin haber rellenado un solo documento manualmente. Nuestra plataforma está diseñada para la **mejora continua**, y aquí tiene la prueba. 