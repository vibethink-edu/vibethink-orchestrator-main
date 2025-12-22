# Lista Completa de Módulos Perdidos - 2025-12-20

**Commit de Seguridad:** `f14a4a6` - "chore: Safety commit before module recovery - 2025-12-20"

---

## 📊 Resumen Ejecutivo

### Módulos V2 Encontrados en Commit 1929140 (14:14)

| Módulo | En 1929140 | Estado Actual | Ubicación Esperada | Prioridad |
|--------|------------|---------------|-------------------|-----------|
| **ai-chat-v2** | ✅ Completo | ❌ NO existe | `/dashboard-bundui/ai-chat-v2` | 🔴 **ALTA** |
| **crm-v2** | ✅ Completo | ❌ NO existe | `/dashboard-bundui/crm-v2` | 🟡 Media |
| **crypto-v2** | ✅ Completo | ❌ NO existe | `/dashboard-bundui/crypto-v2` | 🟡 Media |
| **finance-v2** | ✅ Completo | ❌ NO existe | `/dashboard-bundui/finance-v2` | 🟡 Media |
| **notes-v2** | ✅ Completo | ✅ **EXISTE** | `/dashboard-vibethink/notes-v2` | ✅ OK |

---

## 🔍 Análisis Detallado por Módulo

### 1. AI Chat V2 🔴 **ALTA PRIORIDAD**

**Estado en Commit 1929140:**
- ✅ `apps/dashboard/app/dashboard-bundui/ai-chat-v2/page.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/ai-chat-v2/[id]/page.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/ai-chat-v2/components/ai-chat-interface.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/ai-chat-v2/components/ai-chat-sidebar.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/ai-chat-v2/components/ai-upgrade-modal.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/ai-chat-v2/data.json`
- ✅ `apps/dashboard/app/dashboard-bundui/ai-chat-v2/ai-sphere-animation.json`

**Estado Actual:**
- ❌ NO existe en dashboard-bundui
- ❌ NO existe en dashboard-vibethink
- ⚠️ **PERO** está en el menú (`bundui-nav-items.ts` línea 164-168) → **404 Error**

**Razón de Prioridad Alta:**
- Está referenciado en navegación (causa 404)
- Trabajo ya migrado y funcional
- Usuario mencionó específicamente este módulo

---

### 2. CRM V2 🟡 **MEDIA PRIORIDAD**

**Estado en Commit 1929140:**
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/page.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/index.ts`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/leads-by-source.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/leads.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/recent-tasks.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/sales-pipeline.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/target-card.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/total-customers.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/total-deals.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/components/total-revenue.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crm-v2/README.md`

**Estado Actual:**
- ❌ NO existe en dashboard-bundui
- ✅ CRM v1 existe en ambos dashboards

**Nota:** CRM v1 funciona, v2 es versión mejorada

---

### 3. Crypto V2 🟡 **MEDIA PRIORIDAD**

**Estado en Commit 1929140:**
- ✅ `apps/dashboard/app/dashboard-bundui/crypto-v2/page.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crypto-v2/components/chart-balance-summary.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crypto-v2/components/digital-wallets.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crypto-v2/components/index.ts`
- ✅ `apps/dashboard/app/dashboard-bundui/crypto-v2/components/overview-card.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crypto-v2/components/recent-activities.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crypto-v2/components/trading-card.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/crypto-v2/README.md`

**Estado Actual:**
- ❌ NO existe crypto-v2
- ✅ Crypto v1 existe en ambos dashboards y funciona

**Nota:** Crypto v1 funciona, v2 es versión mejorada

---

### 4. Finance V2 🟡 **MEDIA PRIORIDAD**

**Estado en Commit 1929140:**
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/page.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/components/kpi-cards.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/components/monthly-expenses.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/components/my-wallet.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/components/revenue.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/components/saving-goal.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/components/summary.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/components/transactions.tsx`
- ✅ `apps/dashboard/app/dashboard-bundui/finance-v2/README.md`

**Estado Actual:**
- ❌ NO existe finance-v2
- ✅ Finance v1 existe en dashboard-vibethink y funciona

**Nota:** Finance v1 funciona, v2 es versión mejorada

---

### 5. Notes V2 ✅ **OK - NO REQUIERE ACCIÓN**

**Estado:**
- ✅ Existe en `/dashboard-vibethink/notes-v2`
- ✅ Funcionando correctamente
- ✅ Migrado desde commit `ce14140`

**Conclusión:** No requiere recuperación

---

## 🎯 Plan de Recuperación Recomendado

### Fase 1: AI Chat V2 (Prioridad Alta) ⭐

**Razón:** Está en el menú pero no existe → 404 Error

**Proceso:**
1. Extraer desde commit `1929140`
2. Verificar estructura completa
3. Aplicar fixes (React 19, imports, "use client")
4. Probar funcionalidad
5. Verificar que no rompe otras rutas

### Fase 2: Módulos V2 Restantes (Prioridad Media)

**Módulos:** CRM V2, Crypto V2, Finance V2

**Proceso:**
1. Recuperar uno por uno desde commit `1929140`
2. Verificar que no duplican funcionalidad de v1
3. Aplicar fixes necesarios
4. Decidir si mantener v1 y v2 o reemplazar v1

---

## 🔧 Aislamiento de Estado: Sidebar y Colores

### Estado Actual de Aislamiento

#### Sidebar State Isolation

**Dashboard Bundui:**
- Cookie: `bundui_sidebar_state`
- Layout: `apps/dashboard/app/dashboard-bundui/layout.tsx`
- Sidebar: `AppSidebar` (desde `@vibethink/ui`)

**Dashboard VibeThink:**
- Cookie: `vibethink_sidebar_state`
- Layout: `apps/dashboard/app/dashboard-vibethink/layout.tsx`
- Sidebar: `VibeThinkSidebar` (custom)

**Estado:** ✅ **AISLADO CORRECTAMENTE**

#### Theme/Color State Isolation ⚠️ **PROBLEMA IDENTIFICADO**

**Archivos relacionados:**
- `apps/dashboard/src/shared/components/theme-picker.tsx`
- `apps/dashboard/src/shared/components/theme-customizer/` (varios componentes)
- `apps/dashboard/src/shared/lib/themes.ts`
- `apps/dashboard/src/shared/lib/use-theme-preset.ts`
- `apps/dashboard/src/shared/lib/use-theme-settings.ts`

**Problema Identificado:** ❌ **NO HAY AISLAMIENTO DE TEMA POR DASHBOARD**

**Análisis:**
- `useThemePreset()` usa cookie global: `theme_preset` (sin prefijo de dashboard)
- `useThemeSettings()` usa cookies globales: `theme_radius`, `theme_scale`, etc. (sin prefijo)
- **Resultado:** Cambios en un dashboard afectan al otro

**Cookies actuales (GLOBALES - PROBLEMA):**
- `theme_preset`
- `theme_radius`
- `theme_scale`
- `theme_content_layout`
- `theme_sidebar_mode`
- `theme_base_color`
- `theme_menu_color`
- `theme_menu_accent`
- `theme_font`

**Cookies esperadas (AISLADAS):**
- `bundui_theme_preset` / `vibethink_theme_preset`
- `bundui_theme_radius` / `vibethink_theme_radius`
- etc.

**Acción Requerida:**
- [ ] Modificar `useThemePreset()` para aceptar prefijo de dashboard
- [ ] Modificar `useThemeSettings()` para aceptar prefijo de dashboard
- [ ] Actualizar layouts para pasar prefijo: `bundui_` o `vibethink_`
- [ ] Verificar que cambios en un dashboard NO afectan al otro
- [ ] Probar persistencia independiente

---

## 📋 Checklist de Recuperación

### Pre-Recuperación ✅
- [x] Commit de seguridad creado (`f14a4a6`)
- [x] Lista de módulos perdidos identificada
- [x] Análisis de estado de aislamiento completado

### Fase 1: AI Chat V2
- [ ] Extraer desde commit `1929140`
- [ ] Verificar estructura completa
- [ ] Aplicar fixes (React 19, imports, "use client")
- [ ] Probar funcionalidad
- [ ] Verificar que no rompe otras rutas
- [ ] Commit de recuperación

### Fase 2: Módulos V2 Restantes
- [ ] CRM V2: Extraer y verificar
- [ ] Crypto V2: Extraer y verificar
- [ ] Finance V2: Extraer y verificar
- [ ] Aplicar fixes necesarios
- [ ] Decidir estrategia (mantener v1+v2 o reemplazar)

### Fase 3: Theme Configurator Fix
- [ ] Revisar `theme-picker.tsx`
- [ ] Verificar aislamiento de estado por dashboard
- [ ] Verificar persistencia en cookies/localStorage
- [ ] Aplicar fixes necesarios
- [ ] Probar que cambios en un dashboard no afectan al otro

---

## 🚨 Notas Importantes

1. **Commit de Seguridad:** `f14a4a6` - Punto de retorno seguro
2. **Estrategia:** Recuperar desde commit `1929140` (trabajo ya hecho)
3. **Riesgo:** Bajo (commit de seguridad + verificación paso a paso)
4. **Prioridad:** AI Chat V2 primero (está en menú → 404)

---

**Última actualización:** 2025-12-20
**Estado:** Lista completada, listo para recuperación

