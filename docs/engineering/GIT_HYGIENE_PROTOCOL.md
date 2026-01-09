# PROTOCOLO DE SALUD Y HIGIENE DE GIT (GIT HYGIENE PROTOCOL)

**Propósito:** Establecer un estado de repositorio saludable, predecible y libre de fricción cognitiva para colaboradores humanos y agentes de IA.

---

### 1. Diagnóstico de Salud
Los estados inconsistentes (procesos colgados, commits masivos, desorden de *untracked*) son síntomas de una carga excesiva en el *working tree*. El objetivo es mantener la sesión operativa limpia y el índice de Git al día.

### 2. Principios Fundamentales
*   **Indexación Continua:** No acumular cambios. Si una unidad de trabajo (función, doc, fix) está lista, debe ser añadida al índice (`git add`).
*   **Visibilidad Total:** El estado del repositorio debe ser legible de un vistazo. Un `git status` limpio reduce la carga mental.
*   **Atomicidad Conceptual:** Un commit equivale a un solo concepto. Evitar el antipatrón de agrupar cambios disconexos en un solo envío.
*   **Aislamiento de Dependencias:** El código externo (*vendors*) o artefactos temporales deben estar rigurosamente segregados mediante `.gitignore`.
*   **Validación Pre-Acción:** Verificar el estado del árbol antes de realizar operaciones pesadas o commits masivos.

### 3. Protocolo Operativo (Ritual Diario)

#### Inicio de Sesión
1.  **Sincronización:** `git pull --rebase` (Mantiene un historial lineal y limpio).
2.  **Verificación:** `git status` (Confirmar punto de partida sin residuos).

#### Ciclo de Desarrollo
1.  **Indexación Granular:** Usar `git add <archivo>` en lugar de `git add .` para mantener control total del stage.
2.  **Gestión de Emergentes:** Ante archivos nuevos, decidir inmediatamente: *Ignorar* o *Indexar*. No permitir el estado "limbo".

#### Cierre de Sesión
1.  **Limpieza Final:** Confirmar que no existen cambios accidentales sin stage.
2.  **Persistencia:** `git commit -m "[tipo]: [descripción]"` asegurando que el mensaje refleje la intención técnica.

### 4. Gestión de Archivos Untracked y Vendors
*   **Aislamiento Inmediato:** Cualquier archivo de sesión, log o temporal debe incluirse en `.gitignore` global o local al detectarse.
*   **Regla de Exclusión:** Si un componente externo no está curado para el repositorio, debe permanecer fuera del *working tree* o estar bajo una regla de exclusión preventiva.
*   **Depuración:** Los archivos *untracked* que no tengan propósito claro deben eliminarse en un plazo máximo de 24 horas.

### 5. Política de Commits
*   **SÍ:** Commits de arquitectura (scaffolding), documentación técnica, correcciones granulares.
*   **NO:** Commits de "progreso" genérico, inclusiones masivas de binarios/librerías o mensajes ambiguos.
*   **Formato:** `[contexto]: [acción técnico-funcional]` (ej. `docs: formalize hygiene protocol`).

### 6. Indicadores de Alerta (Repo Enfermo)
*   Latencia inusual (>2s) en comandos básicos de Git.
*   Presencia de archivos `.lock` residuales en `.git/`.
*   Procesos de terminal que reportan duraciones de ejecución irreales.
*   Exceso de archivos modificados (>5) sin haber realizado un commit intermedio.

### 7. Recomendaciones de Estabilidad
1.  **Limpieza de Stale Locks:** Verificar la ausencia de procesos zombis ante fallos de commit.
2.  **Uso de Stash:** Emplear `git stash` para despejar el área de trabajo ante tareas imprevistas.
3.  **Atomicidad de Ejecución:** Ante commits lentos, cancelar con `Ctrl+C` y reintentar con un subset menor de archivos para evitar bloqueos del SO.

---
*Este documento es normativo para el desarrollo dentro del ecosistema ViTo.*
