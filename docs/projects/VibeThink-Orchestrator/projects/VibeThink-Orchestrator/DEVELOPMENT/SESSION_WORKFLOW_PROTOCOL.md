# Protocolo de Flujo de Trabajo de Sesión y Confidencialidad

**Fecha de Última Actualización**: 2024-06-22

## 1. Contexto

Para asegurar la trazabilidad, propiedad y confidencialidad de toda la documentación y decisiones de arquitectura, se establece un protocolo de inicio de sesión que debe ser ejecutado al comienzo de cada jornada de trabajo.

## 2. Protocolo de Verificación

1.  **Activador**: El primer saludo del usuario que indique el inicio de una nueva jornada (ej. "Buenos días", "Hola", "Empecemos").

2.  **Acción del Asistente**: Al detectar el activador, el asistente formulará una pregunta de verificación completa:
    > "¡Hola! Para la documentación de hoy, ¿confirmamos que eres **[Nombre Inferido]**, **[Cargo Inferido]** de **[Empresa Inferida]**, y que la fecha de la sesión es **[Fecha Inferida]**?"

3.  **Fuentes de Contexto Inferido**:
    *   **Nombre**: Marcelo Escallón
    *   **Cargo**: CEO
    *   **Empresa**: Euphorianet
    *   **Fecha**: Fecha actual del sistema.

4.  **Respuesta del Usuario**: El usuario debe confirmar o corregir la información.

## 3. Política de Documentación y Confidencialidad

Una vez que el contexto de la sesión es confirmado, toda la documentación generada (ADRs, resúmenes, logs, archivos de código fuente comentados) deberá incluir:

1.  **Atribución Clara**: El nombre, cargo y empresa del autor intelectual.
2.  **Fecha de Creación/Modificación**.
3.  **Nota de Confidencialidad**: Un aviso estándar para proteger la propiedad intelectual.

### 4. Ejemplo de Encabezado de Documento

A continuación, un ejemplo de cómo se aplicará esta política en un documento de arquitectura o similar:

---
**ADR-007: Título del Documento de Decisión**

*   **Autor**: Marcelo Escallón
*   **Cargo**: CEO, Euphorianet
*   **Fecha**: 2024-06-22
*   **Estado**: Propuesto

**Nota de Confidencialidad**: Este documento es propiedad de Euphorianet. Contiene información confidencial y propietaria y no debe ser distribuido, copiado o divulgado sin autorización explícita.

---

## 5. Protocolo de Cierre de Sesión (Session End Protocol)

Para asegurar la integridad y el correcto versionado del trabajo realizado, se establece un protocolo de cierre al finalizar cada jornada de trabajo.

1.  **Activador**: El usuario indica la finalización de la sesión (ej. "Eso es todo por hoy", "Hasta mañana", "Terminamos por hoy").

2.  **Acción del Asistente**: Al detectar el activador, el asistente realizará las siguientes acciones:
    *   **Confirmar Cierre**: Acusará el recibo del fin de la sesión.
    *   **Generar Resumen del Día**: Proporcionará un resumen conciso de las decisiones tomadas, los artefactos creados (documentos, código) y los problemas resueltos durante la sesión.
    *   **Confirmar Documentación**: Verificará que toda la documentación ha sido actualizada y guardada conforme a la política de atribución y confidencialidad establecida.
    *   **Alinear Próximos Pasos**: Resumirá brevemente los objetivos o tareas planeadas para el inicio de la siguiente sesión.

3.  **Ejemplo de Cierre del Asistente**:
    > "Entendido, cerramos la sesión por hoy.
    > **Resumen del 2024-06-22 (Autor: Marcelo Escallón, CEO, Euphorianet):**
    > - Se estableció y documentó el léxico unificado para las entidades del proyecto.
    > - Se definió la arquitectura y el plan de acción para el MVP del módulo CRM.
    > - Se creó el patrón de éxito para tablas de alto rendimiento.
    > - Se documentó el protocolo de inicio y cierre de sesión.
    >
    > Toda la documentación ha sido actualizada con la atribución y nota de confidencialidad correspondientes.
    >
    > Mañana comenzaremos con la implementación del modelo de datos en Supabase. ¡Que tengas un buen día!" 