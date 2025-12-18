# 🏗️ PROPUESTA DE ARQUITECTURA - Separación de Dashboards

> **Fecha:** 2025-12-17  
> **Objetivo:** Separar dashboards mock de Bundui de dashboards productivos VibeThink  
> **Estilo:** attio.com (Onboarding + CRM como dashboards principales)

---

## 🎯 VISIÓN GENERAL

### Estructura Propuesta

```
/dashboard-vibethink          → Dashboards PRODUCTIVOS (Onboarding, CRM, etc.)
/dashboard-bundui              → Dashboards MOCK de referencia (todos los de Bundui)
```

### Principios

1. **Separación Clara:** Mock vs Productivo
2. **URLs Semánticas:** Fácil de entender qué es cada cosa
3. **Escalable:** Fácil agregar nuevos dashboards en cada categoría
4. **Mantenible:** Estructura clara y organizada

---

## 📋 ESTRUCTURA DE RUTAS PROPUESTA

### `/dashboard-vibethink` - Dashboards Productivos

**Propósito:** Dashboards reales con datos reales, funcionalidad completa.

**Dashboards Iniciales:**
- `/dashboard-vibethink/onboarding` - Flujo de onboarding (estilo attio.com)
- `/dashboard-vibethink/crm` - CRM productivo con datos reales

**Futuros:**
- `/dashboard-vibethink/analytics` - Analytics real
- `/dashboard-vibethink/settings` - Configuración del sistema
- etc.

### `/dashboard-bundui` - Dashboards Mock de Referencia

**Propósito:** Todos los dashboards mock de Bundui Premium para referencia visual.

**Lista Completa (de la sección "Migrados"):**
- `/dashboard-bundui/ai-chat`
- `/dashboard-bundui/academy`
- `/dashboard-bundui/calendar`
- `/dashboard-bundui/crm` (mock)
- `/dashboard-bundui/crypto`
- `/dashboard-bundui/ecommerce`
- `/dashboard-bundui/file-manager`
- `/dashboard-bundui/finance`
- `/dashboard-bundui/hospital-management`
- `/dashboard-bundui/hotel`
- `/dashboard-bundui/mail`
- `/dashboard-bundui/notes`
- `/dashboard-bundui/payment`
- `/dashboard-bundui/pos-system`
- `/dashboard-bundui/project-list`
- `/dashboard-bundui/projects`
- `/dashboard-bundui/sales`
- `/dashboard-bundui/tasks`
- `/dashboard-bundui/analytics`
- `/dashboard-bundui/default`
- `/dashboard-bundui/kanban`
- `/dashboard-bundui/todo-list`
- `/dashboard-bundui/api-keys`
- `/dashboard-bundui/ai-image-generator`

---

## 🏗️ ESTRUCTURA DE ARCHIVOS

### Opción 1: Grupos de Rutas (Recomendado)

```
apps/dashboard/app/
├── (dashboard-vibethink)/          ← Grupo para dashboards productivos
│   ├── layout.tsx                  ← Layout específico para VibeThink
│   ├── onboarding/
│   │   └── page.tsx
│   └── crm/
│       └── page.tsx
│
├── (dashboard-bundui)/              ← Grupo para dashboards mock
│   ├── layout.tsx                  ← Layout específico para Bundui (con badges)
│   ├── ai-chat/
│   │   └── page.tsx
│   ├── academy/
│   │   └── page.tsx
│   ├── calendar/
│   │   └── page.tsx
│   └── ... (todos los demás)
│
└── layout.tsx                       ← Layout raíz
```

**Ventajas:**
- ✅ Separación clara en el código
- ✅ Layouts diferentes para cada grupo
- ✅ Fácil de mantener
- ✅ URLs limpias (`/dashboard-vibethink/...`, `/dashboard-bundui/...`)

### Opción 2: Prefijos en Rutas

```
apps/dashboard/app/
├── dashboard-vibethink/
│   ├── onboarding/
│   └── crm/
├── dashboard-bundui/
│   ├── ai-chat/
│   ├── academy/
│   └── ...
```

**Ventajas:**
- ✅ Más simple
- ✅ URLs directas

**Desventajas:**
- ❌ No permite layouts diferentes fácilmente
- ❌ Más difícil de organizar

---

## 🎨 DIFERENCIACIÓN VISUAL

### Dashboard VibeThink (Productivo)
- **Sin badges** de "Demo/Reference"
- **Layout limpio** estilo attio.com
- **Sidebar específico** para funcionalidad productiva
- **Datos reales** (cuando esté conectado)

### Dashboard Bundui (Mock)
- **Badge visible** "Demo / Reference" en cada página
- **Layout de referencia** (puede ser idéntico al actual)
- **Sidebar con sección "Migrados"** (todos los dashboards mock)
- **Datos mock** (simulados)

---

## 📊 SIDEBAR NAVIGATION

### Sidebar VibeThink (`/dashboard-vibethink`)

```
📊 Dashboards
  ├─ Onboarding
  └─ CRM

⚙️ Configuración
  ├─ Perfil
  └─ Ajustes
```

### Sidebar Bundui (`/dashboard-bundui`)

```
📊 Migrados (Mock)
  ├─ AI Chat
  ├─ Academy
  ├─ Calendar
  ├─ CRM (mock)
  ├─ Crypto
  ├─ E-commerce
  ├─ File Manager
  ├─ Finance
  ├─ Hospital Management
  ├─ Hotel
  ├─ Mail
  ├─ Notes
  ├─ Payment
  ├─ POS System
  ├─ Project List
  ├─ Projects
  ├─ Sales
  ├─ Tasks
  └─ Analytics
```

---

## 🔄 PLAN DE MIGRACIÓN

### Fase 1: Crear Estructura Base

1. Crear grupo `(dashboard-vibethink)` con layout
2. Crear grupo `(dashboard-bundui)` con layout
3. Mover dashboards mock a `(dashboard-bundui)`
4. Crear dashboards productivos en `(dashboard-vibethink)`

### Fase 2: Actualizar Sidebars

1. Crear `AppSidebarVibeThink` para dashboards productivos
2. Mantener `AppSidebarBundui` (actual) para dashboards mock
3. Actualizar rutas en ambos sidebars

### Fase 3: Actualizar Metadata

1. Actualizar `dashboards-metadata.ts` con nuevas rutas
2. Asegurar que badges solo aparezcan en `/dashboard-bundui/*`

### Fase 4: Testing

1. Probar todas las rutas
2. Verificar que los layouts funcionan
3. Validar que los badges aparecen correctamente

---

## ✅ VENTAJAS DE ESTA ARQUITECTURA

1. **Claridad:** Fácil distinguir mock vs productivo
2. **Escalabilidad:** Fácil agregar nuevos dashboards en cada categoría
3. **Mantenibilidad:** Código organizado y separado
4. **URLs Semánticas:** `/dashboard-vibethink` vs `/dashboard-bundui`
5. **Layouts Diferentes:** Cada grupo puede tener su propio layout
6. **Sidebars Específicos:** Cada grupo tiene su sidebar apropiado

---

## 🎯 ORDENAMIENTO RECOMENDADO

### Por Categoría (Recomendado)

**Dashboard VibeThink:**
1. Onboarding (primero - primera experiencia del usuario)
2. CRM (segundo - funcionalidad principal)

**Dashboard Bundui (Mock):**
- Mantener orden alfabético o por categoría
- Todos con badge "Demo / Reference"

### Por Prioridad de Uso

Si algunos dashboards mock se usan más que otros, ordenarlos por frecuencia de uso.

---

## 📝 DECISIONES PENDIENTES

1. **¿Layout compartido o separado?**
   - Recomendación: Layouts separados para máxima flexibilidad

2. **¿Sidebar compartido o separado?**
   - Recomendación: Sidebars separados (ya tenemos `AppSidebar`)

3. **¿Metadata centralizada o separada?**
   - Recomendación: Centralizada con filtros por grupo

4. **¿Badges automáticos o manuales?**
   - Recomendación: Automáticos basados en ruta (`/dashboard-bundui/*`)

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Aprobar arquitectura
2. ⏳ Crear estructura de grupos
3. ⏳ Migrar dashboards mock
4. ⏳ Crear dashboards productivos
5. ⏳ Actualizar sidebars
6. ⏳ Testing completo

---

**📌 NOTA:** Esta arquitectura permite mantener los dashboards mock como referencia mientras desarrollamos los dashboards productivos sin conflictos.

