# 🔍 Validación de Rutas de Dashboards

**Última actualización**: 2025-12-18  
**Estado**: ✅ ACTIVO

---

## 📋 Propósito

Este script valida que las rutas de los dashboards cumplan con las reglas establecidas:

- **`dashboard-bundui`**: Todas las rutas deben apuntar a `/dashboard-bundui/*`
- **`dashboard-vibethink`**: Todas las rutas deben apuntar a `/dashboard-vibethink/*`

---

## 🚀 Uso

### Ejecutar Validación Manualmente

```bash
npm run validate:routes
```

O directamente:

```bash
node scripts/validate-dashboard-routes.js
```

### Integración Automática

El script se ejecuta automáticamente cuando ejecutas:

```bash
npm run validate
```

---

## ✅ Qué Valida

### 1. Archivos en `dashboard-bundui/`
- ✅ Verifica que NO tengan referencias a `/dashboard-vibethink`
- ✅ Todas las rutas deben ser `/dashboard-bundui/*`

### 2. Archivos en `dashboard-vibethink/`
- ✅ Verifica que NO tengan referencias a `/dashboard-bundui`
- ✅ Todas las rutas deben ser `/dashboard-vibethink/*`

### 3. `vibethink-sidebar.tsx`
- ✅ Verifica que `vibethinkNavItems` use `/dashboard-vibethink/*`
- ⚠️ `bunduiReferenceNavItems` puede usar `/dashboard-bundui/*` (es correcto)

---

## 📊 Salida del Script

### ✅ Éxito
```
🔍 Validando rutas de dashboards...

📁 Validando dashboard-bundui...
📁 Validando dashboard-vibethink...
📁 Validando vibethink-sidebar.tsx...

================================================================================
📊 RESULTADOS DE VALIDACIÓN

✅ ¡Perfecto! Todas las rutas están correctas.

   - X archivos en dashboard-bundui validados
   - Y archivos en dashboard-vibethink validados
```

### ❌ Errores Encontrados
```
❌ Se encontraron N error(es):

📄 apps/dashboard/app/dashboard-vibethink/page.tsx
   Línea 51: /dashboard-bundui → debe ser /dashboard-vibethink
   Contexto: dashboard-vibethink
   Código: href: "/dashboard-bundui/analytics"

================================================================================
🔧 Para corregir automáticamente, ejecuta:
   node scripts/fix-vibethink-routes.js
```

---

## 🔧 Corrección Automática

Si encuentras errores, puedes corregirlos automáticamente con:

```bash
node scripts/fix-vibethink-routes.js
```

**Nota**: Este script solo corrige archivos en `dashboard-vibethink`, nunca modifica `dashboard-bundui`.

---

## ⚠️ Cuándo Ejecutar

### Antes de Commit
```bash
npm run validate:routes
```

### Antes de Build
```bash
npm run validate
# Esto incluye validate:routes automáticamente
```

### Durante Desarrollo
```bash
# Validar después de cambios importantes
npm run validate:routes
```

---

## 🚨 Reglas que Valida

1. **Separación estricta**: `dashboard-bundui` y `dashboard-vibethink` no deben mezclar rutas
2. **Consistencia**: Todas las rutas en un dashboard deben usar el mismo prefijo
3. **Prevención de confusión**: Evita que se generen enlaces incorrectos

---

## 📚 Referencias

- `docs/architecture/DASHBOARD_BUNDUI_VIBETHINK_RULES.md` - Reglas completas
- `scripts/fix-vibethink-routes.js` - Script de corrección automática
- `scripts/validate-dashboard-routes.js` - Este script de validación

---

**IMPORTANTE**: Este script es parte del sistema de validación del proyecto y ayuda a prevenir errores comunes que pueden romper la navegación entre dashboards.















