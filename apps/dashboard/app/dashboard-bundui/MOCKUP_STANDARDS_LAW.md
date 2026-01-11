# ⚖️ MOCKUP STANDARDS LAW: DASHBOARD BUNDUI
# 🛑 LEY SUPREMA - NO MODIFICAR SIN AUTORIZACIÓN 🛑

Esta documentación establece la **LEY** de funcionamiento y arquitectura para `dashboard-bundui`.

## 1. EL PROPOSITO SUPREMO (THE MOCKUP LAW)
**`dashboard-bundui` SIEMPRE funcionará como un MOCKUP.**

*   **Definición de Mockup:** Es una representación visual de alta fidelidad, estática o semi-funcional, que simula la experiencia final del usuario. No contiene lógica de negocio compleja, conexiones a bases de datos reales en producción, ni estados mutables persistentes que afecten al sistema central de VibeThink.
*   **Objetivo:** Servir como el "Golden Standard" (Estándar de Oro) visual y de arquitectura de componentes.

## 2. CENTRALIZACIÓN GLOBAL (THE GLOBAL LAW)
**Todo recurso utilizado debe ser GLOBAL.**

*   Todos los estilos, componentes base, iconos y utilidades deben residir en `packages/ui` o `apps/dashboard/src/shared`.
*   **PROHIBICIÓN ESTRICTA DE ASSETS DISPERSOS:** Existimos en un **Monorepo**. No deben existir carpetas locales `components/ui` duplicadas ni archivos de utilidades redundantes esparcidos por los sub-directorios. Si un activo es UI, pertenece a `packages/ui`. Si es lógica compartida, a `shared`.
*   **Prohibido:** Crear componentes UI ad-hoc "privados" dentro de `dashboard-bundui` si estos tienen potencial de reuso. Deben ser promovidos a `@vibethink/ui` primero.
*   **Iconos:** Como se establece en `PROTECTED_VENDOR_CODE.md`, todos los iconos vienen de `@vibethink/ui/icons`.

## 3. LEY DE ADAPTACIÓN (THE ADAPTATION LAW)
**Los dashboards de Tenants y Admin se ADAPTAN al estándar.**

*   **VibeThink Admin (Soporte):** El panel de administración del sistema (`apps/admin` o secciones administrativas) **debe** heredar sus patrones visuales, composición de layouts y uso de componentes directamente de lo establecido en `dashboard-bundui`.
*   **Tenant Dashboards (Clientes):** Los dashboards funcionales para los clientes (`dashboard-vibethink`) **no reinventan la rueda**. Replican la estructura y estética probada en `dashboard-bundui`, inyectando la lógica de negocio real sobre "esqueletos" visuales idénticos.
*   **Jerarquía:** `dashboard-bundui` define la verdad visual. Los demás implementan esa verdad con datos reales.

## 4. INMUTABILIDAD ESTRUCTURAL
La estructura de `dashboard-bundui` no se altera por capricho. Cualquier cambio aquí implica un cambio en el estándar de diseño de toda la plataforma VibeThink Orchestrator.

---
**Firmado y Sellado:** 2026-01-10
**Vigencia:** PERMANENTE
