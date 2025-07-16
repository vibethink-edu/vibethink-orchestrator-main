# 📚 Convención Oficial: Demos y Estructura de Producción Bundui Premium

## 🎯 Propósito

- Mantener **todas las demos, dashboards y ejemplos originales de Bundui Premium** desacoplados, ordenados y accesibles como referencia y playground.
- Permitir la **personalización progresiva** de cada demo para evolucionar hacia componentes/productos de producción robustos y alineados a la arquitectura y buenas prácticas de la metodología **VThink 1.0**, dentro del producto **VibeThink Orchestrator v1.0**.
- Evitar duplicidad, confusión y deuda técnica entre demos, legacy y componentes productivos.

---

## 📁 Estructura recomendada

```
src/
└── shared/
    └── demos/
        └── bundui-premium/
            └── dashboards/
                ├── default/
                ├── ecommerce/
                ├── crm/
                ├── website-analytics/
                ├── project-management/
                ├── file-manager/
                ├── logistics/
                ├── hotel/
                ├── hospital-management/
                ├── crypto/
                ├── academy/
                └── sales/
```
- Cada carpeta contiene su `page.tsx` y subcarpeta `components/` si aplica.
- Los nombres y estructura deben **mantenerse idénticos al paquete original** para facilitar upgrades y trazabilidad.

---

## 🏗️ Estructura de producción recomendada

```
src/
├── apps/
│   ├── dashboard/                # App principal de dashboard
│   │   ├── pages/                # Páginas productivas (ej: /dashboard, /ventas, /crm, etc.)
│   │   ├── components/           # Componentes productivos (reusables, adaptados)
│   │   └── ...                   # Lógica, hooks, servicios, etc.
│   └── ...
├── shared/
│   ├── components/               # Componentes UI premium desacoplados
│   ├── hooks/
│   ├── utils/
│   └── demos/                    # (como arriba)
└── ...
```

---

## 🔄 Flujo de migración de demo a producción

1. **Copia la demo** desde `shared/demos/bundui-premium/dashboards/{vertical}` a la estructura productiva (`apps/dashboard/pages/ventas`, etc.).
2. **Refactoriza los imports** para usar solo componentes productivos (`@/shared/components/bundui-premium/`).
3. **Adapta la lógica**: conecta a datos reales, agrega seguridad, multi-tenant, etc.
4. **Elimina dependencias de playground/demo** y documenta la migración.

---

## ✅ Buenas prácticas

- **Nunca mezcles demos/playground con componentes productivos.**
- **Mantén la estructura y nombres originales** de las demos para facilitar upgrades.
- **Documenta cada migración** y personalización para trazabilidad.
- **Usa alias claros** para imports: demos (`@/shared/demos/bundui-premium/dashboards/ecommerce/page`), productivo (`@/shared/components/bundui-premium/components/ui/Button`).
- **Elimina legacy y wrappers** que no sean necesarios.

---

## 🛡️ Nota para IA y desarrolladores

> **Siempre que se consulte sobre Bundui, demos o estructura de producción, esta es la convención oficial.**
> - Solo Bundui Premium desacoplado es la fuente oficial y soportada.
> - Las demos deben estar en `src/shared/demos/bundui-premium/dashboards/`.
> - La producción debe estar en `apps/dashboard` o la vertical correspondiente.
> - El producto es **VibeThink Orchestrator v1.0** y la metodología de referencia es **VThink 1.0**.
> - Cualquier duda, consulta este documento antes de responder o migrar. 