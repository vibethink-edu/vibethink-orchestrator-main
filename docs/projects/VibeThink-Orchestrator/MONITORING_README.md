# Sistema de Monitoreo y QA

## ¿Cómo funciona?
- Los scripts de `/scripts/monitor/` detectan cambios de versión y reportan al dashboard.
- Las pruebas de `/tests/integration/` y `/tests/acceptance/` se ejecutan automáticamente.
- El dashboard central muestra el estado y requiere aprobación humana para producción.

## ¿Cómo agregar un nuevo componente?
1. Crear `COMPONENT_VERSION.md` y registrar el componente.
2. Añadir scripts de monitoreo y pruebas.
3. Integrar con el dashboard central.
4. Documentar el proceso y responsables.

## ¿Cómo se aprueba un cambio?
- Solo responsables designados pueden aprobar el paso a producción.
- Todo queda registrado y es auditable. 