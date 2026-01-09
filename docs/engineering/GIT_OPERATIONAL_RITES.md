# RITOS OPERATIVOS DE GIT — ENTRADA Y SALIDA

**Propósito:** Reducir el error humano y la deriva técnica mediante la ejecución de rituales mínimos, secuenciales y obligatorios de sincronización y persistencia.

---

### 1. Rito de Entrada
**Intención:** Garantizar un punto de partida limpio y sincronizado antes de cualquier edición.
1.  **Observación:** Ejecutar `git status` para confirmar que no existen bloqueos (`.lock`) ni residuos de la sesión previa.
2.  **Alineación:** Ejecutar `git pull --rebase` para integrar el trabajo más reciente sin contaminar el historial con nodos de merge vacíos.
3.  **Regla de Bloqueo:** Si `git status` muestra cambios inesperados, **no iniciar el desarrollo** hasta estibar (`stash`) o descartar cambios huérfanos.

### 2. Rito de Salida
**Intención:** Persistencia atómica de la unidad de trabajo y limpieza del área operativa.
1.  **Revisión Final:** Ejecutar `git status` para listar archivos modificados y emergentes (*untracked*).
2.  **Consagración del Stage:** Ejecutar `git add <archivo>` de forma granular. Evitar indexaciones masivas y ciegas.
3.  **Persistencia:** Ejecutar `git commit -m "[contexto]: [acción]"` siguiendo los estándares de canon.
4.  **Regla de Bloqueo:** Si el proceso de commit tarda >30 segundos, cancelar (`Ctrl+C`), verificar el sistema de archivos y reintentar. **Nunca dejar una terminal con un commit colgado.**

### 3. Regla Suprema
> **"No existe commit válido si el `git status` póstumo no es predecible."**  
> Todo archivo presente en el working tree debe tener una razón de ser (indexado) o una regla de exclusión (.gitignore).

### 4. Versión Corta (Checklist)

**Entrada (<1 min):**
- [ ] `git status` -> Árbol predecible.
- [ ] `git pull --rebase` -> Sincronización lineal.

**Salida (<1 min):**
- [ ] `git status` -> Revisión de emergentes.
- [ ] `git add` -> Indexación dirigida.
- [ ] `git commit` -> Persistencia atómica.

### 5. Regla para Agentes AI
*   Los Agentes AI **deben** ejecutar el Rito de Entrada antes de proponer o editar cualquier archivo.
*   Al finalizar su tarea, **deben** realizar la fase de Rito de Salida hasta el estado de commit pre-aprobado.
*   Si un Agente detecta archivos *untracked* ajenos a su tarea, debe reportarlos en el log de ejecución inmediatamente.

---
*Ubicación sugerida: docs/engineering/GIT_OPERATIONAL_RITES.md*
