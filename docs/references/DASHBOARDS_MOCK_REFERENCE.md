# 📋 DASHBOARDS MOCK - REFERENCIA COMPLETA

> **Última actualización:** 2024-12-17  
> **Estado:** Documentación viva - mantener actualizada

---

## 🎯 PROPÓSITO

Este documento identifica **todos los dashboards que usan datos mock** (simulados) en VibeThink Orchestrator 1.0. 

**⚠️ REGLA CRÍTICA:** Estos dashboards son **referencias de diseño** y **no deben moverse físicamente** de su ubicación actual. La estructura de carpetas debe mantenerse intacta para no romper rutas, imports y navegación.

---

## 📊 RESUMEN EJECUTIVO

| Categoría | Cantidad | Estado |
|-----------|---------|--------|
| **Total Dashboards Mock** | 27 | - |
| **Con Migración Planificada** | 20 | 74% |
| **Solo Referencia** | 7 | 26% |
| **Hybrid (Mock + Real)** | 1 | 4% |

---

## 🏗️ ARQUITECTURA

### Estructura Actual (NO CAMBIAR)

```
app/(dashboard)/
├── default/                    # ✅ Mock - Referencia
├── sales-dashboard/            # ✅ Mock - Referencia (Migración planificada)
├── crm-dashboard/              # ✅ Mock - Referencia (Migración planificada)
├── website-analytics-dashboard/ # ✅ Mock - Referencia (Migración planificada)
├── project-management-dashboard/ # ✅ Mock - Referencia (Migración planificada)
├── file-manager-dashboard/     # ✅ Mock - Referencia (Migración planificada)
├── crypto-dashboard/            # ✅ Mock - Referencia
├── academy-dashboard/           # ✅ Mock - Referencia
├── hospital-management-dashboard/ # ✅ Mock - Referencia
├── hotel-dashboard/             # ✅ Mock - Referencia
├── finance-dashboard/           # ✅ Mock - Referencia (Migración planificada)
└── [otros...]
```

### ⚠️ POR QUÉ NO MOVER ARCHIVOS

1. **Next.js App Router** depende de la estructura de carpetas para rutas
2. **Imports relativos** se romperían
3. **Sidebar navigation** (`nav-main.tsx`) tiene rutas hardcodeadas
4. **Layout compartido** (`layout.tsx`) aplica a toda la ruta `(dashboard)`
5. **TypeScript paths** y aliases se desalinearían

---

## 📋 LISTA COMPLETA DE DASHBOARDS MOCK

### Grupo: Dashboards (12)

| Ruta | Tipo | Categoría | Migración | Badge |
|------|------|-----------|-----------|-------|
| `/dashboard/default` | Mock | Reference | ❌ | ✅ |
| `/dashboard/ecommerce` | Mock | Reference | ✅ | ✅ |
| `/dashboard/sales` | Mock | Reference | ✅ | ✅ |
| `/dashboard/crm` | Mock | Reference | ✅ | ✅ |
| `/dashboard/website-analytics` | Mock | Reference | ✅ | ✅ |
| `/dashboard/project-management` | Mock | Reference | ✅ | ✅ |
| `/dashboard/file-manager` | Mock | Reference | ✅ | ✅ |
| `/dashboard/crypto` | Mock | Reference | ❌ | ✅ |
| `/dashboard/academy` | Mock | Reference | ❌ | ✅ |
| `/dashboard/hospital-management` | Mock | Reference | ❌ | ✅ |
| `/dashboard/hotel` | Mock | Reference | ❌ | ✅ |
| `/dashboard/finance` | Mock | Reference | ✅ | ✅ |

### Grupo: AI (2)

| Ruta | Tipo | Categoría | Migración | Badge |
|------|------|-----------|-----------|-------|
| `/dashboard/apps/ai-chat` | Hybrid | Demo | ✅ | ✅ |
| `/dashboard/apps/ai-image-generator` | Mock | Demo | ❌ | ✅ |

**Nota:** `ai-chat` es **hybrid** porque puede usar múltiples proveedores reales (OpenAI, Anthropic) pero también tiene modo demo.

### Grupo: Apps (9)

| Ruta | Tipo | Categoría | Migración | Badge |
|------|------|-----------|-----------|-------|
| `/kanban-dashboard` | Mock | Reference | ✅ | ✅ |
| `/dashboard/apps/notes` | Mock | Reference | ✅ | ✅ |
| `/dashboard/apps/chat` | Mock | Reference | ✅ | ✅ |
| `/dashboard/apps/mail` | Mock | Reference | ✅ | ✅ |
| `/dashboard/apps/todo-list-app` | Mock | Reference | ✅ | ✅ |
| `/dashboard/apps/tasks` | Mock | Reference | ✅ | ✅ |
| `/dashboard/apps/calendar` | Mock | Reference | ✅ | ✅ |
| `/dashboard/apps/api-keys` | Mock | Reference | ✅ | ✅ |
| `/dashboard/apps/pos-system` | Mock | Reference | ❌ | ✅ |

---

## 🎨 BADGE VISUAL

Todos los dashboards mock muestran un badge discreto en el header:

```tsx
<Badge variant="outline" className="text-xs">
  Demo / Reference
</Badge>
```

**Ubicación:** `apps/dashboard/src/shared/components/dashboard-badge.tsx`

**Configuración:** Controlada por `dashboards-metadata.ts` → `showBadge: true`

---

## 🔄 ESTRATEGIA DE MIGRACIÓN

### Fase 1: Preparación (Actual)
- ✅ Identificar todos los dashboards mock
- ✅ Documentar metadata centralizada
- ✅ Implementar badge visual
- ✅ Crear sistema de feature flags

### Fase 2: Infraestructura
- [ ] Diseñar schema Supabase
- [ ] Implementar adapters (MockAdapter → SupabaseAdapter)
- [ ] Feature flags (`USE_REAL_CRM=true`)

### Fase 3: Migración Gradual
- [ ] CRM Dashboard (prioridad alta)
- [ ] Sales Dashboard (prioridad alta)
- [ ] Website Analytics (prioridad media)
- [ ] Project Management (prioridad media)
- [ ] Resto de dashboards (prioridad baja)

**Ver:** `docs/architecture/MOCK_TO_CRM_STRATEGY.md`

---

## 📁 ARCHIVOS CLAVE

### Metadata Centralizada
- **Ubicación:** `apps/dashboard/src/config/dashboards-metadata.ts`
- **Propósito:** Sistema centralizado de metadata para identificar dashboards mock
- **Uso:** Importar funciones helper (`isMockDashboard`, `getDashboardMetadata`)

### Componente Badge
- **Ubicación:** `apps/dashboard/src/shared/components/dashboard-badge.tsx`
- **Propósito:** Badge visual discreto para dashboards mock
- **Uso:** Importar en headers de dashboards

### Estrategia de Migración
- **Ubicación:** `docs/architecture/MOCK_TO_CRM_STRATEGY.md`
- **Propósito:** Plan detallado de migración Mock → CRM real

---

## ✅ CHECKLIST DE MANTENIMIENTO

Cuando agregues un nuevo dashboard:

- [ ] Agregar entrada en `dashboards-metadata.ts`
- [ ] Actualizar este documento (`DASHBOARDS_MOCK_REFERENCE.md`)
- [ ] Agregar ruta en `nav-main.tsx` (si aplica)
- [ ] Verificar que el badge se muestra correctamente
- [ ] Documentar si requiere migración a CRM

---

## 🚫 REGLAS CRÍTICAS

### ❌ NUNCA HACER

1. **NO mover archivos** de `app/(dashboard)/` a otra ubicación
2. **NO crear** estructura `/dashboard/mock/*` (rompe rutas)
3. **NO cambiar** nombres de carpetas de dashboards existentes
4. **NO eliminar** dashboards mock sin documentar migración

### ✅ SIEMPRE HACER

1. **Mantener** estructura actual de carpetas
2. **Usar** `dashboards-metadata.ts` para identificar mock
3. **Mostrar** badge visual en dashboards mock
4. **Documentar** cambios en este archivo
5. **Usar** feature flags para migración gradual

---

## 📊 ESTADÍSTICAS

### Por Tipo
- **Mock:** 26 dashboards (96%)
- **Hybrid:** 1 dashboard (4%)
- **Real:** 0 dashboards (0%)

### Por Categoría
- **Reference:** 25 dashboards (93%)
- **Demo:** 2 dashboards (7%)

### Por Migración
- **Planificada:** 20 dashboards (74%)
- **No planificada:** 7 dashboards (26%)

---

## 🔗 REFERENCIAS

- **Metadata:** `apps/dashboard/src/config/dashboards-metadata.ts`
- **Estrategia Migración:** `docs/architecture/MOCK_TO_CRM_STRATEGY.md`
- **Auditoría Dashboards:** `docs/references/DASHBOARDS_AUDIT_REPORT.md`
- **Sidebar Navigation:** `apps/dashboard/src/shared/components/bundui-premium/components/layout/sidebar-bundui/nav-main.tsx`

---

**Última actualización:** 2024-12-17  
**Mantenido por:** VibeThink Orchestrator Team


