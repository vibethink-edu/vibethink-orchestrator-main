Status: CANON
Owner: Chief Architect
Last updated: 2025-12-29
Rule: cambios solo por PR

# FOUNDATION Canon

## Proposito
Establecer reglas minimas, operativas y no negociables para trabajo seguro en el monorepo. Esto es el contrato de trabajo diario.

## Las 10 leyes
1. Origin/main es la unica fuente de verdad.
2. Prohibido commitear o pushear directo a main.
3. Todo cambio va por rama + PR + CI (si existe).
4. Cambios pequenos, atomicos y reversibles.
5. Solo tocar el scope permitido por la tarea.
6. Si algo existe y funciona, no lo rompas; ajusta con criterio conservador.
7. Un error bloquea el release: se corrige antes de continuar.
8. Nunca mezclar cambios no relacionados.
9. Documentacion y reglas viven en docs/ y se respetan.
10. Cualquier excepcion requiere aprobacion explicita.

## Ritual de desapego (release discipline)
- Crear rama desde origin/main y trabajar solo alli.
- El PR es el unico canal de integracion.
- El merge a main cierra el ciclo; la rama se puede eliminar.
- Si no se puede validar, se documenta la razon en el PR.

## Branching
- Base: siempre desde origin/main.
- Nombres claros y propositivos (ej: docs/foundation-canon, fix/dashboard-ssr).
- Una rama = un objetivo.
- Commits pequenos con mensajes claros.

## Worktrees
- Usar worktrees para aislar ramas y evitar conflictos.
- Politica completa en docs/FOUNDATION/WORKTREES.md.

## Locks
- Los locks evitan colisiones en rutas criticas.
- Tabla unica en docs/FOUNDATION/LOCKS.md.
- Regla: ACTIVE = nadie mas toca ese scope.

## Agentes (humanos y AI)
- Leer reglas antes de modificar.
- Mantener el contexto minimo necesario.
- No inventar procesos ni dependencias.
- Reportar riesgos y bloqueos con claridad.

## CI minimo
- Si existe CI, debe pasar antes del merge.
- Guardrail obligatorio: fallar ante conflict markers.
- Si un cambio puede romper CI, detener y documentar.

## Checklists
Pre-PR:
- Scope limitado a lo solicitado.
- Sin cambios colaterales.
- Build/test aplicable ejecutado o motivo documentado.

Pre-merge:
- CI en verde o justificacion aceptada.
- Revisiones aplicadas.
- Locks liberados.

## Anti-dolor (errores recurrentes)
- No trabajar sobre main.
- No mezclar cambios de features con fixes.
- No tocar configs globales sin permiso.
- No dejar worktrees con ramas equivocas.

## Mantra
Corto, claro, verificable.
