# 🌍 I18N STRATEGY - DASHBOARD LANGUAGES

**Fecha**: 2026-01-10 23:39  
**Versión**: 1.0

---

## 🎯 REGLA DE IDIOMAS POR DASHBOARD

### **Dashboard-Admin (Admin Interno VibeThink)**
**Puerto**: 3006  
**Idiomas**: **SOLO 2 idiomas**
- 🇺🇸 **English (en)** - Principal
- 🇪🇸 **Español (es)** - Secundario

**Razón**: Admin interno solo para equipo VibeThink (bilingüe EN/ES)

---

### **Dashboard-Tenant (Admin Clientes)**
**Puerto**: 3007  
**Idiomas**: **TODOS los 9 idiomas**
- 🇺🇸 English (en)
- 🇪🇸 Español (es)
- 🇫🇷 Français (fr)
- 🇵🇹 Português (pt)
- 🇩🇪 Deutsch (de)
- 🇮🇹 Italiano (it)
- 🇰🇷 한국어 (ko)
- 🇸🇦 العربية (ar)
- 🇨🇳 中文 (zh)

**Razón**: Clientes internacionales necesitan todos los idiomas

---

### **Dashboard-Bundui (UI Mockups)**
**Puerto**: 3005  
**Idiomas**: **TODOS los 9 idiomas** (para testing)

**Razón**: Laboratorio de UI - necesita probar todos los idiomas

---

## 🔧 IMPLEMENTACIÓN

### **1. Configuración por Dashboard**

#### **Dashboard-Admin** (`dashboard-admin/layout.tsx`)
```typescript
// Configuración i18n para admin interno
const ADMIN_LOCALES = ['en', 'es'] as const;
const ADMIN_DEFAULT_LOCALE = 'en';

// En el provider
<I18nProvider 
  locales={ADMIN_LOCALES}
  defaultLocale={ADMIN_DEFAULT_LOCALE}
>
  {children}
</I18nProvider>
```

#### **Dashboard-Tenant** (`dashboard-tenant/layout.tsx`)
```typescript
// Configuración i18n para clientes
const TENANT_LOCALES = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'] as const;
const TENANT_DEFAULT_LOCALE = 'en';

// En el provider
<I18nProvider 
  locales={TENANT_LOCALES}
  defaultLocale={TENANT_DEFAULT_LOCALE}
>
  {children}
</I18nProvider>
```

#### **Dashboard-Bundui** (`dashboard-bundui/layout.tsx`)
```typescript
// Configuración i18n para mockups (todos los idiomas)
const BUNDUI_LOCALES = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'] as const;
const BUNDUI_DEFAULT_LOCALE = 'en';

// En el provider
<I18nProvider 
  locales={BUNDUI_LOCALES}
  defaultLocale={BUNDUI_DEFAULT_LOCALE}
>
  {children}
</I18nProvider>
```

---

### **2. Selector de Idioma**

#### **Dashboard-Admin**
```typescript
// Solo mostrar EN y ES
const ADMIN_LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];
```

#### **Dashboard-Tenant**
```typescript
// Mostrar todos los idiomas
const TENANT_LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];
```

---

## 📋 TRADUCCIONES REQUERIDAS

### **Dashboard-Admin**
```
src/lib/i18n/translations/
├── en/  ← 100% completo (obligatorio)
└── es/  ← 100% completo (obligatorio)
```

### **Dashboard-Tenant**
```
src/lib/i18n/translations/
├── en/  ← 100% completo (obligatorio)
├── es/  ← 100% completo (obligatorio)
├── fr/  ← 90%+ completo
├── pt/  ← 90%+ completo
├── de/  ← 90%+ completo
├── it/  ← 50%+ completo
├── ko/  ← 50%+ completo
├── ar/  ← 90%+ completo (RTL support)
└── zh/  ← 90%+ completo
```

---

## 🎯 VALIDACIÓN

### **Checklist Dashboard-Admin**
- [ ] Solo muestra EN y ES en selector de idioma
- [ ] Default locale es 'en'
- [ ] Traducciones EN y ES 100% completas
- [ ] No muestra otros idiomas

### Tiered Language Support

Para optimizar la calidad del producto, dividimos el soporte en dos niveles:

### Tier 1: Canonical Languages (100% Core)
- **Idiomas**: `en` (English), `es` (Español).
- **Estado**: Producción.
- **Regla**: Todo nuevo componente o mockup DEBE tener traducción en estos dos idiomas.
- **Uso**: Todos los dashboards.

### Tier 2: Expansion Languages (In-Progress)
- **Idiomas**: `fr`, `pt`, `de`, `it`, `ko`, `ar`, `zh`.
- **Estado**: Beta / En traducción.
- **Regla**: Si falta una traducción, el sistema hará fallback automático a `en`.
- **Uso**: `dashboard-bundui` (para testing) y `dashboard-tenant` (habilitado para clientes internacionales).
- **Restricción**: Ocultos en `dashboard-admin` para mantener la interfaz limpia y funcional.funciona correctamente

### **Checklist Dashboard-Tenant**
- [ ] Muestra todos los 9 idiomas en selector
- [ ] Default locale es 'en'
- [ ] Traducciones EN y ES 100% completas
- [ ] Otros idiomas al menos 50% completos
- [ ] RTL funciona correctamente para AR

### **Checklist Dashboard-Bundui**
- [ ] Muestra todos los 9 idiomas (para testing)
- [ ] Permite cambiar entre todos los idiomas
- [ ] RTL funciona correctamente

---

## 🚨 REGLAS IMPORTANTES

### **1. NO duplicar traducciones**
- ✅ Usar archivos compartidos en `src/lib/i18n/translations/`
- ❌ NO crear traducciones específicas por dashboard

### **2. Fallback siempre a EN**
- Si falta una traducción, mostrar EN
- Nunca mostrar claves (ej: `navigation.groups.dashboards`)

### **3. RTL Support**
- AR (árabe) requiere RTL completo
- Sidebar, layout, y componentes deben adaptarse

### **4. Validación antes de deploy**
```bash
# Validar traducciones
pnpm run i18n:validate

# Verificar archivos faltantes
node scripts/check-missing-files.js

# Validar coherencia
node scripts/validate-concepts-coherence.js
```

---

## 📊 RESUMEN

| Dashboard | Puerto | Idiomas | Default | Propósito |
|-----------|--------|---------|---------|-----------|
| **Admin** | 3006 | EN, ES | en | Admin interno VibeThink |
| **Tenant** | 3007 | 9 idiomas | en | Admin clientes (multi-idioma) |
| **Bundui** | 3005 | 9 idiomas | en | Mockups UI (testing) |

---

## 🔗 REFERENCIAS

- **Configuración i18n**: `src/lib/i18n/config.ts`
- **Traducciones**: `src/lib/i18n/translations/`
- **Provider**: `src/lib/i18n/context.tsx`
- **Arquitectura**: `apps/dashboard/DASHBOARD_ARCHITECTURE.md`

---

**ÚLTIMA ACTUALIZACIÓN**: 2026-01-10 23:39  
**AUTOR**: Marcelo + Antigravity AI  
**ESTADO**: ✅ DOCUMENTADO
