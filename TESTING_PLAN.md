# 🧪 PLAN DE TESTING - Migración Bundui a Migrados

> **Fecha:** 2025-12-17  
> **Estado:** En progreso  
> **Objetivo:** Validar migración completa de dashboards

---

## ✅ CHECKLIST DE TESTING

### 1. Testing de Rutas

#### Dashboards Migrados (Nuevos)
- [ ] `/academy-dashboard` - Academy Dashboard
- [ ] `/hospital-management-dashboard` - Hospital Management
- [ ] `/hotel-dashboard` - Hotel Dashboard
- [ ] `/payment-dashboard` - Payment Dashboard
- [ ] `/project-list-dashboard` - Project List

#### Dashboards Existentes (Verificar)
- [ ] `/ai-chat-dashboard` - AI Chat
- [ ] `/calendar-dashboard` - Calendar
- [ ] `/crm-dashboard` - CRM
- [ ] `/crypto-dashboard` - Crypto
- [ ] `/ecommerce-dashboard` - E-commerce
- [ ] `/file-manager-dashboard` - File Manager
- [ ] `/finance-dashboard` - Finance
- [ ] `/mail-dashboard` - Mail
- [ ] `/notes-dashboard` - Notes
- [ ] `/pos-system-dashboard` - POS System
- [ ] `/project-management-dashboard` - Projects
- [ ] `/sales-dashboard` - Sales
- [ ] `/tasks-dashboard` - Tasks
- [ ] `/website-analytics-dashboard` - Analytics

### 2. Testing de Build

```bash
# Ejecutar build completo
npm run build:dashboard

# Verificar errores
# ✅ No debe haber errores de imports
# ✅ No debe haber errores de tipos
# ✅ No debe haber errores de rutas
```

### 3. Testing de Imports

#### Verificar Shadcn UI First
```bash
# Buscar imports incorrectos
grep -r "@/components/ui/" apps/dashboard/app
grep -r "@/shared/components/ui/" apps/dashboard/app

# Debe retornar 0 resultados (o solo componentes custom)
```

#### Verificar Imports Correctos
```bash
# Verificar que todos usan @vibethink/ui
grep -r "from \"@vibethink/ui\"" apps/dashboard/app | wc -l
# Debe ser > 0 (muchos imports)
```

### 4. Testing de Componentes

#### Componentes Críticos
- [ ] Theme Customizer abre correctamente
- [ ] Theme Customizer aplica cambios
- [ ] Sidebar navegación funciona
- [ ] Badges de "Demo/Reference" se muestran
- [ ] Todos los dashboards renderizan sin errores

### 5. Testing de Funcionalidad

#### Por Dashboard
- [ ] **Academy:** Todos los componentes cargan
- [ ] **Hospital:** Tabs, reports, calendar funcionan
- [ ] **Hotel:** Stat cards y componentes principales
- [ ] **Payment:** Balance, transactions, exchange rates
- [ ] **Project List:** Grid de proyectos se muestra

---

## 🔧 COMANDOS DE TESTING

### Testing Automatizado

```bash
# 1. Validar estructura
npm run validate:universal

# 2. Validar imports
npm run validate:imports

# 3. Build completo
npm run build:dashboard

# 4. Lint
npm run lint
```

### Testing Manual

```bash
# 1. Iniciar servidor
.\scripts\start-dashboard.ps1

# 2. Probar rutas en navegador
# http://localhost:3005/academy-dashboard
# http://localhost:3005/hospital-management-dashboard
# http://localhost:3005/payment-dashboard
# http://localhost:3005/project-list-dashboard

# 3. Verificar en consola del navegador
# No debe haber errores
```

---

## 📊 REPORTE DE TESTING

### Estado Actual

| Categoría | Estado | Notas |
|-----------|--------|-------|
| **Rutas** | ⏳ Pendiente | Necesita testing manual |
| **Build** | ⏳ Pendiente | Ejecutar `npm run build:dashboard` |
| **Imports** | ✅ Verificado | Sin imports incorrectos encontrados |
| **Componentes** | ⏳ Pendiente | Necesita testing en navegador |
| **Funcionalidad** | ⏳ Pendiente | Necesita testing por dashboard |

---

## 🚨 ISSUES CONOCIDOS

### Pendientes de Resolver
- [ ] Hotel Dashboard: Solo tiene StatCards, faltan otros componentes
- [ ] Verificar que todos los dashboards tienen metadata correcta
- [ ] Validar que las rutas del sidebar coinciden con las rutas reales

---

## ✅ CRITERIOS DE ÉXITO

### Build
- ✅ Build sin errores
- ✅ Sin warnings críticos
- ✅ Tiempo de build razonable

### Funcionalidad
- ✅ Todas las rutas responden 200
- ✅ Todos los dashboards renderizan
- ✅ No hay errores en consola del navegador
- ✅ Theme Customizer funciona

### Código
- ✅ Todos los imports usan `@vibethink/ui`
- ✅ Sin imports de `@/components/ui/`
- ✅ Sin imports de `@/shared/components/ui/` (excepto custom)

---

## 📝 NOTAS

- Testing debe ejecutarse después de cada migración
- Reportar issues en este documento
- Actualizar estado después de cada sesión de testing

