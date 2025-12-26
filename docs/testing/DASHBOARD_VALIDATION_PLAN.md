# Plan de Validación de Dashboards

**Fecha**: 2025-01-XX  
**Objetivo**: Validar que los 3 dashboards principales funcionan correctamente según su propósito

---

## 🎯 Contexto de los Dashboards

### 1. `/dashboard` - Producción Final ⭐
- **URL**: `http://localhost:3005/dashboard`
- **Propósito**: Dashboard de producción con integración BD
- **Características esperadas**:
  - ✅ Layout minimalista (sin sidebar/header)
  - ✅ Página de login funcional
  - ✅ Redirige a `/dashboard-vibethink/crm` después del login
  - ✅ Multidioma implementado

### 2. `/dashboard-bundui` - Referencia/Inspiración
- **URL**: `http://localhost:3005/dashboard-bundui`
- **Propósito**: Espejo de Bundui Premium (referencia externa)
- **Características esperadas**:
  - ✅ Sidebar: `AppSidebar` (Bundui original)
  - ✅ Header: `SiteHeader` (sin selector de idioma)
  - ✅ Badge: "Bundui Premium"
  - ✅ Solo inglés (sin i18n)
  - ✅ Todos los módulos de Bundui accesibles

### 3. `/dashboard-vibethink` - Mockup/Sandbox
- **URL**: `http://localhost:3005/dashboard-vibethink`
- **Propósito**: Sandbox de pruebas antes de producción
- **Características esperadas**:
  - ✅ Sidebar: `VibeThinkSidebar` (propio)
  - ✅ Header: `VibeThinkHeader` (con selector de idioma)
  - ✅ Badge: "VibeThink Sandbox"
  - ✅ Multidioma (inglés/español)
  - ✅ Selector de idioma funcional
  - ✅ Módulos de prueba accesibles

---

## ✅ Checklist de Validación

### `/dashboard` (Producción Final)

- [ ] **Página de Login**
  - [ ] Formulario de login visible
  - [ ] Campos email y password funcionan
  - [ ] Botón "Iniciar sesión" funciona
  - [ ] Botón "Usar credenciales de demo" funciona
  - [ ] Redirección a `/dashboard-vibethink/crm` después del login

- [ ] **Layout**
  - [ ] Sin sidebar visible
  - [ ] Sin header visible
  - [ ] Layout minimalista

- [ ] **Multidioma**
  - [ ] Textos en español (por defecto)
  - [ ] i18n implementado

---

### `/dashboard-bundui` (Referencia)

- [ ] **Layout y Navegación**
  - [ ] Sidebar `AppSidebar` visible y funcional
  - [ ] Header `SiteHeader` visible
  - [ ] Badge "Bundui Premium" visible
  - [ ] Footer visible

- [ ] **Idioma**
  - [ ] Solo inglés (sin selector de idioma)
  - [ ] Textos hardcoded en inglés
  - [ ] NO hay selector de idioma en header

- [ ] **Módulos Accesibles**
  - [ ] Navegación por sidebar funciona
  - [ ] Módulos principales accesibles (CRM, Sales, E-commerce, etc.)
  - [ ] Rutas usan prefijo `/dashboard-bundui/*`

- [ ] **Independencia**
  - [ ] Sidebar propio (no compartido)
  - [ ] Header propio (no compartido)
  - [ ] No depende de `dashboard-vibethink`

---

### `/dashboard-vibethink` (Mockup/Sandbox)

- [ ] **Layout y Navegación**
  - [ ] Sidebar `VibeThinkSidebar` visible y funcional
  - [ ] Header `VibeThinkHeader` visible
  - [ ] Badge "VibeThink Sandbox" visible
  - [ ] Footer visible

- [ ] **Multidioma (i18n)**
  - [ ] Selector de idioma visible en header
  - [ ] Cambio entre inglés y español funciona
  - [ ] Textos se actualizan al cambiar idioma
  - [ ] Persistencia del idioma seleccionado

- [ ] **Módulos Accesibles**
  - [ ] Navegación por sidebar funciona
  - [ ] Módulos principales accesibles (CRM, Sales, E-commerce, etc.)
  - [ ] Rutas usan prefijo `/dashboard-vibethink/*`

- [ ] **Independencia**
  - [ ] Sidebar propio (no compartido)
  - [ ] Header propio (no compartido)
  - [ ] No depende de `dashboard-bundui`

---

## 🔍 Validaciones Técnicas

### Build y Compilación
- [ ] `npm run build:dashboard` compila sin errores críticos
- [ ] No hay errores de TypeScript
- [ ] No hay errores de imports faltantes

### Rutas y Navegación
- [ ] Todas las rutas usan prefijos correctos
- [ ] No hay rutas mezcladas entre dashboards
- [ ] Sidebars muestran solo rutas de su dashboard

### Componentes
- [ ] `AppSidebar` solo muestra rutas de `dashboard-bundui`
- [ ] `VibeThinkSidebar` solo muestra rutas de `dashboard-vibethink`
- [ ] Headers correctos en cada dashboard
- [ ] Badges correctos en cada dashboard

---

## 📝 Notas de Prueba

### Errores Conocidos
- ⚠️ Error React #31 en página 404 (pendiente de investigación)
- ⚠️ Algunos imports corregidos pero build puede tener warnings

### Próximos Pasos
1. Ejecutar servidor de desarrollo
2. Probar cada dashboard manualmente
3. Documentar resultados
4. Corregir problemas encontrados
5. Versionar si todo está correcto

---

**Última actualización**: 2025-01-XX











