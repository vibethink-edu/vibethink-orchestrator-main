# 🧪 Sprint 1 - Checklist de Prueba

**Fecha:** 2025-12-18  
**Apps Funcionando:** 11/14 (79%)  
**Objetivo:** Verificar que todas las apps funcionan correctamente

---

## ✅ GRUPO 1: Apps Estables (Ya funcionaban antes) - 6 apps

### 1. Products (`/dashboard-bundui/pages/products`)
**Prueba:**
- [ ] Página carga sin errores
- [ ] Tabla de productos visible
- [ ] Filtros funcionan (Status, Category)
- [ ] Búsqueda funciona
- [ ] Imágenes de productos cargan

**Tiempo estimado:** 30 segundos

---

### 2. Orders (`/dashboard-bundui/pages/orders`)
**Prueba:**
- [ ] Página carga sin errores
- [ ] Tabla de órdenes visible
- [ ] Tabs funcionan (All, Pending, Completed)
- [ ] Filtros funcionan
- [ ] Estados de orden visibles (badges)

**Tiempo estimado:** 30 segundos

---

### 3. AI Chat (`/dashboard-bundui/ai-chat`)
**Prueba:**
- [ ] Página carga sin errores
- [ ] Interfaz de chat visible
- [ ] Sidebar con historial funciona
- [ ] Settings visible
- [ ] Input de mensaje presente

**Tiempo estimado:** 30 segundos

---

### 4. AI Image Generator (`/dashboard-bundui/ai-image-generator`)
**Prueba:**
- [ ] Página carga sin errores
- [ ] Interfaz de generación visible
- [ ] Controles presentes

**Tiempo estimado:** 20 segundos

---

### 5. Kanban (`/dashboard-bundui/kanban`)
**Prueba:**
- [ ] Página carga sin errores
- [ ] Columnas de kanban visibles (To Do, In Progress, Done)
- [ ] Tarjetas de tareas visibles
- [ ] Drag & drop funciona (mover una tarjeta)

**Tiempo estimado:** 30 segundos

---

### 6. Notes (`/dashboard-bundui/notes`)
**Prueba:**
- [ ] Página carga sin errores
- [ ] Lista de notas visible
- [ ] Sidebar con carpetas funciona
- [ ] Editor de notas visible

**Tiempo estimado:** 30 segundos

---

## 🆕 GRUPO 2: Apps Desbloqueadas (Por @remixicon/react) - 4 apps

### 7. Calendar (`/dashboard-bundui/calendar`) ⭐ **CRÍTICO**
**Prueba:**
- [ ] Página carga sin errores
- [ ] Vista mensual completa visible
- [ ] Eventos aparecen en el calendario
- [ ] Botón "New event" presente
- [ ] Navegación entre meses funciona (flechas)
- [ ] Dropdown de vista (Month) funciona

**Tiempo estimado:** 1 minuto

**✅ YA PROBADO:** Funciona perfectamente (36KB snapshot)

---

### 8. Tasks (`/dashboard-bundui/tasks`) ⭐ **CRÍTICO**
**Prueba:**
- [ ] Página carga sin errores
- [ ] Tabla de tareas (DataTable) visible
- [ ] Columnas visibles (Title, Status, Priority, Label)
- [ ] Filtros funcionan (Status, Priority)
- [ ] Búsqueda funciona
- [ ] Paginación visible

**Tiempo estimado:** 1 minuto

**✅ YA PROBADO:** Funciona (34KB snapshot, pero prueba visual recomendada)

---

### 9. API Keys (`/dashboard-bundui/api-keys`) ⭐ **CRÍTICO**
**Prueba:**
- [ ] Página carga sin errores
- [ ] Tarjetas de estadísticas visibles (API Calls, Successful, Failed)
- [ ] Tabla de API keys visible
- [ ] Botón "Create API Key" presente
- [ ] Upgrade plan card visible

**Tiempo estimado:** 1 minuto

**✅ YA PROBADO:** Funciona (34KB snapshot, pero prueba visual recomendada)

---

### 10. POS System (`/dashboard-bundui/pos-system`) ⭐ **CRÍTICO**
**Prueba:**
- [ ] Página carga sin errores
- [ ] Menú de productos visible
- [ ] Categorías de productos visibles
- [ ] Carrito de compras presente
- [ ] Productos se pueden agregar al carrito

**Tiempo estimado:** 1 minuto

**✅ YA PROBADO:** Funciona (34KB snapshot, pero prueba visual recomendada)

---

## ⭐ GRUPO 3: Apps Copiadas desde VibeThink - 1 app

### 11. Mail (`/dashboard-bundui/mail`) ⭐⭐ **MUY CRÍTICO**
**Prueba:**
- [ ] Página carga sin errores
- [ ] Sidebar con folders visible (Inbox, Sent, Drafts, Trash)
- [ ] Lista de emails visible (3 emails)
- [ ] Panel de lectura muestra "No email selected"
- [ ] Botón "Compose" presente
- [ ] Búsqueda de emails presente
- [ ] Labels funcionan (Work, Personal)
- [ ] Contador de emails en folders correcto

**Tiempo estimado:** 2 minutos

**✅ YA PROBADO:** Funciona perfectamente (36KB snapshot, interfaz completa visible)

---

## 🎯 RESUMEN DE PRUEBA

**Tiempo total estimado:** ~10 minutos

### **Prioridad de Prueba:**

**🔥 ALTA PRIORIDAD (Probar primero):**
1. ✅ Mail (copiado desde VibeThink - nuevo)
2. ✅ Calendar (desbloqueado - nuevo)
3. ✅ Tasks (desbloqueado - nuevo)
4. ✅ POS System (desbloqueado + fixed imports - nuevo)

**📊 MEDIA PRIORIDAD (Verificación rápida):**
5. API Keys (desbloqueado - nuevo)
6. Products (estable)
7. Orders (estable)
8. Kanban (estable)

**⏭️ BAJA PRIORIDAD (Opcional):**
9. AI Chat (estable)
10. AI Image Generator (estable)
11. Notes (estable)

---

## ✅ CHECKLIST SIMPLIFICADO (30 segundos por app)

```
URL Base: http://localhost:3005

□ Mail          (/dashboard-bundui/mail)
□ Calendar      (/dashboard-bundui/calendar)  
□ Tasks         (/dashboard-bundui/tasks)
□ POS System    (/dashboard-bundui/pos-system)
□ API Keys      (/dashboard-bundui/api-keys)
□ Products      (/dashboard-bundui/pages/products)
□ Orders        (/dashboard-bundui/pages/orders)
□ Kanban        (/dashboard-bundui/kanban)
□ Notes         (/dashboard-bundui/notes)
□ AI Chat       (/dashboard-bundui/ai-chat)
□ AI Image Gen  (/dashboard-bundui/ai-image-generator)
```

---

## 🚨 Si Encuentras Errores

**Para cada error:**

1. **Tomar screenshot** (si es visual)
2. **Abrir DevTools** (F12)
3. **Ver Console** (errores en rojo)
4. **Copiar mensaje de error**
5. **Reportar:**
   - URL de la app
   - Error específico
   - Screenshot (opcional)

---

## ✅ Después de Pruebas

**Si todo funciona:**
- ✅ Proceder con Sprint 2 (arreglar Chat, Todo-List, File-Manager)

**Si hay errores:**
- 🔧 Arreglar errores encontrados primero
- ⏸️ Pausar Sprint 2 hasta resolverlos

---

**Estado del servidor:**
- ✅ Corriendo en puerto 3005
- ✅ Backups disponibles (3 backups recientes)
- ✅ Git actualizado

**¿Listo para probar?** 🧪

