# RTL Pendientes (Dashboard Bundui)

Ultima actualizacion: 2025-12-28

Objetivo
Dejar documentadas las tareas pendientes relacionadas con RTL (arabic) y i18n
en dashboard-bundui, para retomar despues sin perder contexto.

Estado actual
- RTL mejora significativa: sidebar visible y empuja contenido en /dashboard-bundui.
- Todavia hay detalles visuales menores por ajustar.

Pendientes por grupo

1) RTL layout (estructura)
- Revisar gaps residuales en RTL (espacio vacio a la izquierda en algunos estados).
- Confirmar que data-side="right" se aplica en el sidebar del bundui.
- Validar comportamiento en collapse/expand (sidebar icon, sidebar full).
- Revisar layout en otras rutas de /dashboard-bundui para consistencia.

2) RTL UI detalles
- Alinear dropdowns/menus/tooltips a la derecha cuando dir="rtl".
- Revisar flechas e iconografia direccional que requiera mirror.
- Ajustar spacing en cards, tablas y listados largos.

3) Panel lateral (projects-v2)
- Evitar uso directo de document.documentElement.dir en render.
- Usar locale/RTL flag desde i18n para posicionar panel lateral.
- Confirmar que panel respeta RTL sin solapar contenido.

4) i18n keys faltantes (labels en UI)
- Se detectan labels mostrando paths tipo "projects.v2.summaryCards.timeSpent".
- Agregar keys faltantes en `en/projects.json` y replicar estructura en `ar`.
- Validar que el fallback a en funciona en ar cuando no hay traduccion.

5) Validacion i18n (9 idiomas)
- Verificar que todas las keys usadas en projects-v2 existan en los 9 idiomas.
- Ejecutar:
  - node scripts/validate-9-language-compliance.js --namespace projects
  - node scripts/validate-i18n-keys.js projects

Notas de contexto
- El soporte RTL base esta en `apps/dashboard/app/globals.css`.
- El sidebar usa `@vibethink/ui` con soporte side="right".
- El layout bundui aplica RTL via html[dir="rtl"] y reglas especificas.
