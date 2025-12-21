# Tareas Pendientes por Prioridad - 2025-12-20

**Última actualización:** 2025-12-20

---

## 🔴 PRIORIDAD ALTA (Hacer Primero)

### 1. Fix: Error Class extends value undefined en ai-image-generator
- **Estado:** ⚠️ **PENDIENTE**
- **Ubicación:** `apps/dashboard/app/dashboard-bundui/ai-image-generator`
- **Problema:** Error de build después de fix de MinimalTiptapEditor
- **Impacto:** Bloquea build/compilación
- **Acción:** Investigar y corregir error de clase undefined

### 2. Fix: Error React children en página /404
- **Estado:** ⚠️ **PENDIENTE**
- **Ubicación:** `apps/dashboard/app/not-found.tsx` o similar
- **Problema:** Error repetitivo de React children
- **Impacto:** Página 404 no funciona correctamente
- **Acción:** Revisar y corregir estructura de componentes

---

## 🟡 PRIORIDAD MEDIA (Después de Alta)

### 3. Recuperar Crypto V2
- **Estado:** ⚠️ **PENDIENTE**
- **Commit fuente:** `1929140`
- **Ubicación esperada:** `/dashboard-bundui/crypto-v2`
- **Archivos:** 7 componentes + page.tsx + README.md
- **Nota:** Crypto v1 funciona, v2 es versión mejorada

### 4. Recuperar Finance V2
- **Estado:** ⚠️ **PENDIENTE**
- **Commit fuente:** `1929140`
- **Ubicación esperada:** `/dashboard-bundui/finance-v2`
- **Archivos:** 7 componentes + page.tsx + README.md
- **Nota:** Finance v1 funciona, v2 es versión mejorada

---

## 🟢 PRIORIDAD BAJA (Mejoras/Optimizaciones)

### 5. Mejorar look visual del Theme Configurator
- **Estado:** ⚠️ **PENDIENTE**
- **Ubicación:** `apps/dashboard/src/shared/components/bundui-premium/components/panel.tsx`
- **Problema:** Look visual puede mejorarse (revisar commit 1929140)
- **Impacto:** Solo estético, funcionalidad OK
- **Acción:** Revisar versión problemática para mejoras visuales

---

## 🌍 TAREA GLOBAL: Traducción i18n

### 6. Auditoría de Textos Hardcoded
- **Estado:** ⚠️ **PENDIENTE**
- **Script:** `scripts/audit-hardcoded-text.js` (✅ Creado)
- **Acción:** Ejecutar script para identificar textos sin traducir
- **Resultado esperado:** Reporte de textos hardcoded por módulo

### 7. Crear Namespaces de Traducción Faltantes
- **Estado:** ⚠️ **PENDIENTE**
- **Namespaces faltantes:** 12 módulos
  - `ai-chat` (🔴 Alta prioridad)
  - `crypto`, `finance`, `kanban`, `mail`, `notes`, `tasks`, `calendar`, `file-manager`, `analytics`, `projects`, `settings` (🟡 Media)
- **Acción:** Crear archivos `*.json` para EN y ES

### 8. Migrar Componentes a i18n
- **Estado:** ⚠️ **PENDIENTE**
- **Prioridad 1:** AI Chat V2 (ya recuperado, necesita traducción)
- **Prioridad 2:** CRM V2 (ya recuperado, necesita traducción)
- **Prioridad 3:** Resto de módulos
- **Acción:** Reemplazar strings hardcoded con `t('namespace:key')`

---

## ✅ COMPLETADAS (Referencia)

### Módulos Recuperados
- ✅ **AI Chat V2** - Recuperado, visible en sidebar, funcional
- ✅ **CRM V2** - Recuperado, funcional

### Fixes Aplicados
- ✅ **Theme Configurator** - Aislamiento por dashboard + i18n
- ✅ **i18n Warnings** - Eliminados (locale store inicializado)
- ✅ **Sidebar AI Chat V2** - Visible con badge "New"
- ✅ **Scripts start/stop** - Fixes de TIME_WAIT

### Documentación Creada
- ✅ **Plan de Traducción Global** - `docs/sessions/PLAN_TRADUCCION_GLOBAL_2025-12-20.md`
- ✅ **Script de Auditoría** - `scripts/audit-hardcoded-text.js`

---

## 🎯 Orden Recomendado de Ejecución

### Fase 1: Fixes Críticos (Bloquean Build)
1. Fix error ai-image-generator
2. Fix error React children en /404

### Fase 2: Recuperación de Módulos
3. Recuperar Crypto V2
4. Recuperar Finance V2

### Fase 3: Traducción Global
5. Ejecutar auditoría de textos hardcoded
6. Crear namespaces faltantes
7. Migrar componentes a i18n (empezar con AI Chat V2 y CRM V2)

### Fase 4: Mejoras Visuales
8. Mejorar look del Theme Configurator

---

## 📊 Resumen por Estado

| Prioridad | Cantidad | Estado |
|-----------|----------|--------|
| 🔴 Alta | 2 | Fixes críticos |
| 🟡 Media | 2 | Recuperación módulos |
| 🟢 Baja | 1 | Mejoras visuales |
| 🌍 Global | 3 | Traducción i18n |
| **TOTAL** | **8** | **Pendientes** |

---

**Nota:** Las tareas de traducción global pueden ejecutarse en paralelo con la recuperación de módulos, ya que son independientes.

