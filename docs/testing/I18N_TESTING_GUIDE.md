# Guía de Testing i18n - 9 Idiomas

**Fecha:** 2025-12-21  
**Ruta de Testing:** `/dashboard-bundui/i18n-test`

---

## 🎯 Propósito

Página completa de testing para validar que todos los módulos funcionan correctamente con los **9 idiomas base**.

---

## 🚀 Cómo Usar

### 1. Iniciar Servidor de Desarrollo

```powershell
# Desde la raíz del proyecto
.\scripts\start-dashboard.ps1
```

O manualmente:

```bash
cd apps/dashboard
npm run dev
```

El servidor iniciará en: `http://localhost:3005`

### 2. Acceder a la Página de Testing

Navegar a:
```
http://localhost:3005/dashboard-bundui/i18n-test
```

---

## 📋 Funcionalidades de la Página de Test

### 1. **Selector de Idioma**

- Grid con los **9 idiomas** disponibles
- Cada botón muestra:
  - 🇺🇸 Bandera del país
  - Nombre nativo (ej: "Español", "한국어")
  - Código ISO (ej: "es", "ko")
- Click en cualquier idioma para cambiar instantáneamente

### 2. **Pruebas por Módulo**

Pestañas para cada módulo con i18n implementado:
- Common
- Projects V2
- Analytics
- API Keys
- Dashboard Bundui
- Dashboard VibeThink
- Hotel
- Calendar
- Mail
- Chat
- Tasks

**Para cada módulo se muestra:**
- Grid de los 9 idiomas con estado visual:
  - ✅ Verde: Traducción existe
  - ❌ Rojo: Falta traducción
- Muestra de traducciones actuales (en el idioma seleccionado)
- Keys de prueba comunes (header.title, title, etc.)

### 3. **Resumen de Tests**

Vista consolidada que muestra:
- Estado por módulo
- Porcentaje de completitud (X/9 idiomas)
- Indicadores visuales:
  - ✅ 100% completo
  - ⚠️ 50-99% completo
  - ❌ <50% completo

### 4. **Información del Sistema**

Muestra:
- Idioma por defecto (en)
- Total de idiomas (9)
- Idiomas RTL (1: Arabic)
- Total de módulos de prueba

---

## 🧪 Proceso de Testing Recomendado

### Paso 1: Verificación General

1. Abrir la página de test
2. Verificar que todos los 9 idiomas aparecen en el selector
3. Revisar el resumen de tests para ver el estado general

### Paso 2: Probar Cambio de Idioma

1. Click en cada idioma del selector
2. Verificar que:
   - El idioma cambia instantáneamente
   - La dirección del texto cambia para RTL (Arabic)
   - Los textos se traducen correctamente

### Paso 3: Validar por Módulo

1. Ir a cada pestaña de módulo
2. Verificar que:
   - Todos los idiomas muestran ✅ o ❌ correctamente
   - Las traducciones se muestran en el idioma actual
   - Las keys de prueba funcionan

### Paso 4: Probar en Módulos Reales

1. Navegar a cada módulo real:
   - `/dashboard-bundui/projects-v2`
   - `/dashboard-bundui/analytics`
   - `/dashboard-bundui/api-keys`
   - etc.

2. Cambiar idioma usando el LanguageSwitcher
3. Verificar que:
   - Todos los textos se traducen
   - No hay texto hardcodeado
   - El layout funciona (especialmente en RTL)

---

## 🔍 Qué Buscar (Problemas Comunes)

### ❌ Texto Hardcodeado

**Síntoma:** Texto que NO cambia al cambiar de idioma

**Ejemplo:**
```tsx
// ❌ INCORRECTO
<h1>My Title</h1>

// ✅ CORRECTO
<h1>{t('header.title')}</h1>
```

### ❌ Keys Faltantes

**Síntoma:** Texto muestra `missing: namespace.key` o la key literal

**Solución:** Agregar la key a todos los 9 archivos JSON

### ❌ Layout Roto (RTL)

**Síntoma:** En Arabic, el layout se ve mal o los textos están mal alineados

**Solución:** Verificar que se usa `dir={isRTL ? 'rtl' : 'ltr'}` en contenedores

### ❌ Falta Idioma (it o ko)

**Síntoma:** Solo aparecen 7 idiomas en lugar de 9

**Solución:** Agregar archivos `it/[namespace].json` y `ko/[namespace].json`

---

## 📊 Módulos para Probar

### ✅ Completos (9 idiomas)

- `projects-v2` - Referencia completa
- `analytics` - Completo
- `api-keys` - Completo
- `dashboard-bundui` - Completo
- `dashboard-vibethink` - Completo

### ⚠️ Parciales (verificar it/ko)

- `hotel` - Verificar si tiene it/ko
- `calendar` - Verificar si tiene it/ko
- `mail` - Verificar si tiene it/ko
- `chat` - Verificar si tiene it/ko
- `tasks` - Verificar si tiene it/ko

### 📝 Pendientes

- Otros módulos según el plan de implementación

---

## 🛠️ Scripts de Validación

### Validar Namespace Específico

```bash
node scripts/validate-9-language-compliance.js projects
```

### Detectar Texto Hardcodeado

```bash
node scripts/audit-hardcoded-text.js apps/dashboard/app/dashboard-bundui/projects-v2
```

---

## 🎨 Características Visuales

### Idioma Actual
- Resaltado con anillo azul (ring-2 ring-primary)
- Muestra traducción de ejemplo
- Badge RTL si aplica

### Estado de Traducciones
- ✅ Verde: Traducción válida
- ❌ Rojo: Falta traducción
- Indicadores visuales claros

### Responsive
- Grid adaptable (3 cols mobile, 5 tablet, 9 desktop)
- Información optimizada para cada tamaño de pantalla

---

## 📝 Notas Importantes

1. **Cambio Instantáneo:** El cambio de idioma es inmediato, sin recargar la página
2. **Persistencia:** El idioma seleccionado se guarda en localStorage
3. **RTL:** El Arabic (ar) cambia automáticamente la dirección del texto
4. **Validación:** La página usa el sistema real de i18n, no mocks

---

## 🚨 Si Algo se Rompe

### Error: "Cannot find module"

- Verificar que los archivos JSON existen en `apps/dashboard/src/lib/i18n/translations/`
- Verificar que el namespace está en `types.ts`
- Verificar que el namespace está en `preloadNamespaces` en `layout.tsx`

### Error: "Missing translation"

- Agregar la key faltante a todos los 9 archivos JSON
- Verificar la estructura del JSON (debe coincidir entre idiomas)

### Error: "Type error"

- Verificar que el namespace está en `TranslationNamespace` type
- Verificar que el código del idioma está en `Locale` type

---

## ✅ Checklist de Testing Completo

- [ ] Todos los 9 idiomas aparecen en el selector
- [ ] Cambio de idioma funciona instantáneamente
- [ ] RTL funciona correctamente para Arabic
- [ ] Cada módulo muestra el estado correcto (✅/❌)
- [ ] Las traducciones se muestran correctamente
- [ ] No hay texto hardcodeado visible
- [ ] El layout funciona en todos los idiomas
- [ ] El LanguageSwitcher funciona en módulos reales
- [ ] Los scripts de validación pasan

---

## 🔗 Referencias

- [I18N_MASTER_GUIDE.md](../architecture/I18N_MASTER_GUIDE.md) - Guía maestra
- [I18N_7_LANGUAGE_COMPLIANCE_PROTOCOL.md](../architecture/I18N_7_LANGUAGE_COMPLIANCE_PROTOCOL.md) - Protocolo obligatorio
- [I18N_AUTOMATIC_LANGUAGES_RULE.md](../architecture/I18N_AUTOMATIC_LANGUAGES_RULE.md) - Regla automática







