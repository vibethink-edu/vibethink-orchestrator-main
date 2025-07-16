# Log de Decisiones Críticas (XTP)਍

## [Fecha: 09-07-2024] Decisión de Estructura General y Gobernanza del Monorepo

Se aprueba y formaliza la estructura general del monorepo VibeThink Orchestrator según lo documentado en `docs/STRUCTURE_OVERVIEW.md`, incluyendo:
- Convenciones para ports, integraciones, módulos propios y documentación.
- Ubicación y documentación de código original, adaptado, parches y módulos propios.
- Reglas de gobernanza, trazabilidad y logs de decisiones.

Toda excepción o cambio futuro debe documentarse en este log y actualizar el documento central de estructura.

---

## [Fecha: 09-07-2024] Decisión sobre la estructura y gobernanza de /docs

- Se establece que la carpeta `/docs` es el repositorio central de toda la documentación técnica, de proyectos, procesos, decisiones y gobernanza del monorepo.
- La estructura, convenciones y plantillas de documentación están definidas en `docs/STRUCTURE_OVERVIEW.md`.
- Toda documentación específica de proyectos debe residir en `docs/projects/NombreProyecto/`.
- Logs de decisiones, plantillas, convenciones y documentación transversal deben mantenerse en `/docs` y sus subcarpetas temáticas.
- Cualquier cambio estructural, excepción o caso especial en la documentación debe registrarse en este log y reflejarse en el documento central de estructura.

---

## [Fecha: 09-07-2024] Decisión sobre convención de múltiples apps y dashboards

- Se aprueba la convención de organizar las aplicaciones en `src/apps/` según contexto y público objetivo:
  - `home/`: landing, splash, login público
  - `superadmin-dashboard/`: dashboard exclusivo para superadministradores
  - `company-dashboard/`: dashboard para empresas SaaS (clientes)
  - `login/`: (opcional) app de login/autenticación
- Cada app debe tener README, estructura aislada y consumir componentes de `shared/`.
- Toda excepción o cambio debe documentarse en el README correspondiente y en este log.
