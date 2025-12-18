# 🧪 Pruebas Post-Limpieza - Checklist Usuario

## ✅ Pruebas Automáticas (COMPLETADAS)

| Prueba | Status | Resultado |
|--------|--------|-----------|
| **Build Production** | ✅ PASS | 11.0s, 58 páginas, 0 errores |
| **Server Dev** | ✅ PASS | Puerto 3005 activo (PID: 9372) |
| **Estructura CSS** | ✅ PASS | Centralizado en `app/globals.css` |
| **Imports** | ✅ PASS | 20 archivos validados |

---

## 🧪 Pruebas Manuales (REQUERIDAS)

### 📋 Checklist Rápido (5 min)

Abrir en browser y validar que TODO funciona:

#### **1. Login** ⏱️ 30s
```
http://localhost:3005/dashboard
```
- [ ] Se ve el formulario de login
- [ ] Inputs funcionan (email, password)
- [ ] Botón "Iniciar sesión" visible
- [ ] Click login → Redirige a `/dashboard-vibethink/crm`

---

#### **2. VibeThink Sandbox** ⏱️ 1 min
```
http://localhost:3005/dashboard-vibethink
```
- [ ] Se ve el index con 3 dashboards (CRM, Sales, E-commerce)
- [ ] Badge "VibeThink Sandbox" visible
- [ ] Click CRM → Abre dashboard CRM
- [ ] Click Sales → Abre dashboard Sales
- [ ] Click E-commerce → Abre dashboard E-commerce

**Dashboard CRM**:
```
http://localhost:3005/dashboard-vibethink/crm
```
- [ ] Sidebar visible (navegación)
- [ ] Header visible (search, theme, user menu)
- [ ] Contenido del dashboard visible
- [ ] **CSS aplicado** (colores, spacing, fuentes)

---

#### **3. Bundui Mirror** ⏱️ 1 min
```
http://localhost:3005/dashboard-bundui
```
- [ ] Se ve el index con TODOS los mocks (15+ dashboards)
- [ ] Badge "Bundui Premium - Reference" visible
- [ ] Cards organizadas por categorías
- [ ] Click Analytics → Abre dashboard Analytics

**Dashboard Analytics**:
```
http://localhost:3005/dashboard-bundui/analytics
```
- [ ] Sidebar visible con navegación completa
- [ ] Header visible
- [ ] Contenido del dashboard visible
- [ ] **CSS aplicado correctamente**

---

#### **4. Sidebar (CRÍTICO)** ⏱️ 1 min

En **cualquier dashboard interno** (ej: `/dashboard-bundui/analytics`):

- [ ] **Colapsar**: Click icono → Sidebar se colapsa
- [ ] **Expandir**: Click icono → Sidebar se expande
- [ ] **Logo**: Escala cuando colapsado
- [ ] **NO overlap**: Sidebar NO se superpone al contenido
- [ ] **Navegación**: Links funcionan y marcan activo

---

#### **5. Theme Selector** ⏱️ 30s

En **cualquier dashboard interno**:

- [ ] Click icono Settings (⚙️) en header
- [ ] Dropdown aparece (NO escondido detrás)
- [ ] Selector de Color Mode visible (Light/Dark/System)
- [ ] Click Light → Tema cambia
- [ ] Click Dark → Tema cambia

---

#### **6. Responsive (OPCIONAL)** ⏱️ 1 min

- [ ] **Desktop** (>1200px): Sidebar expandido por defecto
- [ ] **Tablet** (768-1200px): Sidebar colapsado por defecto
- [ ] **Mobile** (<768px): Sidebar oculto, botón menu funciona

---

## 📊 Resultados Esperados

### ✅ **TODO funciona**
```
✓ Build: OK
✓ CSS: OK
✓ Login: OK
✓ Dashboards: OK
✓ Sidebar: OK
✓ Theme: OK
```

**Acción**: ✅ Continuar con migraciones de dashboards

---

### ⚠️ **Algo roto**
```
✗ CSS no se aplica
✗ Sidebar overlap
✗ Imports rotos
```

**Acción**: 🔧 Reportar qué se rompió → Rollback si necesario

---

## 🚀 Comando de Prueba

```powershell
# Si necesitas reiniciar el servidor:
.\scripts\stop-dashboard.ps1
.\scripts\start-dashboard.ps1
```

**URL Base**: `http://localhost:3005`

---

## 📝 Reportar Resultados

**Si todo OK**, responder:
```
✅ Todo funciona, continuemos con migraciones
```

**Si algo falla**, especificar:
```
❌ [Qué URL] - [Qué problema] - [Screenshot si es visual]
```

---

**Tiempo estimado**: 5 minutos  
**URLs críticas**: 6  
**Checklist items**: 30+

¡Vamos! 🚀

