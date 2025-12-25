# 🔄 Migración de Menú: Sección "Migrados"

**Fecha:** 2025-12-18  
**Objetivo:** Mover rutas de la sección "Migrados" a `/dashboard-vibethink/`

---

## 📋 Estado Actual

### Sección "Migrados" en nav-main.tsx (líneas 254-272)

Rutas actuales (sin prefijo correcto):
- `/ai-chat-dashboard` → Debe ser: `/dashboard-vibethink/ai-chat`
- `/calendar-dashboard` → Debe ser: `/dashboard-vibethink/calendar`
- `/crm-dashboard` → Debe ser: `/dashboard-vibethink/crm` ✅
- `/crypto-dashboard` → Debe ser: `/dashboard-vibethink/crypto`
- `/ecommerce-dashboard` → Debe ser: `/dashboard-vibethink/ecommerce` ✅
- `/file-manager-dashboard` → Debe ser: `/dashboard-vibethink/file-manager`
- `/finance-dashboard` → Debe ser: `/dashboard-vibethink/finance`
- `/mail-dashboard` → Debe ser: `/dashboard-vibethink/mail`
- `/notes-dashboard` → Debe ser: `/dashboard-vibethink/notes`
- `/pos-system-dashboard` → Debe ser: `/dashboard-vibethink/pos-system`
- `/project-management-dashboard` → Debe ser: `/dashboard-vibethink/project-management`
- `/sales-dashboard` → Debe ser: `/dashboard-vibethink/sales` ✅
- `/tasks-dashboard` → Debe ser: `/dashboard-vibethink/tasks`
- `/website-analytics-dashboard` → Debe ser: `/dashboard-vibethink/website-analytics`

---

## ✅ Dashboards Existentes en dashboard-vibethink

Según estructura actual:
- ✅ `crm` - `/dashboard-vibethink/crm`
- ✅ `ecommerce` - `/dashboard-vibethink/ecommerce`
- ✅ `sales` - `/dashboard-vibethink/sales`

---

## 🔄 Cambios Necesarios

1. **Actualizar nav-main.tsx** - Cambiar todas las rutas de la sección "Migrados" a `/dashboard-vibethink/...`

2. **Verificar existencia** - Algunas rutas pueden no existir aún en `dashboard-vibethink`, en ese caso:
   - Opción A: Crearlas (mover de dashboard-bundui si existen)
   - Opción B: Remover de la sección "Migrados" temporalmente

---

## 📝 Plan de Acción

1. Actualizar rutas en nav-main.tsx
2. Verificar qué dashboards faltan en dashboard-vibethink
3. Decidir si crear los faltantes o remover del menú

---

**Última actualización:** 2025-12-18







