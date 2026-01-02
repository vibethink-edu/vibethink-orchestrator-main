# Guía Maestra i18n - VibeThink Orchestrator

**Última actualización:** 2025-12-21  
**Estado:** Activo  
**Versión:** 3.0.0

---

## 🎯 Resumen Ejecutivo

Este documento consolida toda la información sobre internacionalización (i18n) en el proyecto. Es la **fuente única de verdad consolidada** para developers, designers y AI agents.

### 📊 Estado Actual

- **Idiomas soportados:** 9 idiomas base (en, es, fr, pt, de, it, ko, ar, zh)
- **Cobertura:** English First, luego Europeos, Asiáticos, RTL
- **Regla automática:** Nuevos componentes/módulos deben incluir los 9 idiomas
- **Protocolo obligatorio:** Validación de 9 idiomas antes de finalizar cualquier trabajo

---

## 📚 Navegación Rápida

### 🚨 Documentos Críticos (Leer Primero)

1. **[I18N_7_LANGUAGE_COMPLIANCE_PROTOCOL.md](./I18N_7_LANGUAGE_COMPLIANCE_PROTOCOL.md)** ⭐
   - Protocolo obligatorio para agentes AI
   - Checklist de validación de 9 idiomas
   - Scripts de validación automática

2. **[I18N_AUTOMATIC_LANGUAGES_RULE.md](./I18N_AUTOMATIC_LANGUAGES_RULE.md)** ⭐
   - Regla automática para nuevos componentes
   - Proceso obligatorio de creación de archivos de traducción
   - Checklist completo

3. **[AGENTS.md](../../AGENTS.md)** (raíz del proyecto)
   - Reglas normativas para agentes AI
   - Incluye regla obligatoria de 9 idiomas

### 📖 Guías Específicas

4. **[I18N_BEST_PRACTICES_AGENTS.md](./I18N_BEST_PRACTICES_AGENTS.md)**
   - Buenas prácticas para agentes AI
   - Validación de keys + anti-blink

5. **[I18N_ANTI_HARDCODE_STRATEGY.md](./I18N_ANTI_HARDCODE_STRATEGY.md)**
   - Estrategia para prevenir texto hardcodeado
   - Scripts de detección automática

6. **[I18N_DASHBOARD_BUNDUI_IMPLEMENTATION_PLAN.md](./I18N_DASHBOARD_BUNDUI_IMPLEMENTATION_PLAN.md)**
   - Plan de implementación activo
   - Estado de módulos

### 🏗️ Arquitectura y Referencias

7. **[I18N_AI_FIRST_COMPLETE_GUIDE.md](./I18N_AI_FIRST_COMPLETE_GUIDE.md)**
   - Guía completa AI-First
   - Metodología universal

8. **[I18N_ARCHITECTURE.md](./I18N_ARCHITECTURE.md)**
   - Arquitectura técnica del sistema i18n
   - Configuración y estructura

9. **[I18N_USAGE_GUIDE.md](./I18N_USAGE_GUIDE.md)**
   - Guía de uso práctica
   - Ejemplos de código

10. **[I18N_TEMPLATE_GUIDE.md](./I18N_TEMPLATE_GUIDE.md)**
    - Templates para nuevos módulos
    - Estructura de archivos JSON

---

## 🌍 Los 9 Idiomas Base (English First)

### Lista Completa

1. 🇺🇸 **en** (English) ⭐ **PRIMERO SIEMPRE**
2. 🇪🇸 **es** (Español)
3. 🇫🇷 **fr** (Français)
4. 🇵🇹 **pt** (Português)
5. 🇩🇪 **de** (Deutsch)
6. 🇮🇹 **it** (Italiano) - Agregado automáticamente
7. 🇰🇷 **ko** (한국어) - Agregado automáticamente
8. 🇸🇦 **ar** (العربية) - RTL
9. 🇨🇳 **zh** (中文)

### Configuración

**Ubicación:** `apps/dashboard/src/lib/i18n/`

**Archivos clave:**
- `types.ts` - Tipos TypeScript (Locale, TranslationNamespace)
- `config.ts` - Configuración i18n (defaultLocale, locales array)
- `locale-config.ts` - Configuración por idioma (monedas, fechas, números)

**Orden en arrays:** `['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh']`

---

## 🚨 Regla Automática: Nuevos Componentes

**CUANDO agregas un nuevo componente o módulo:**

1. ✅ Crear 9 archivos JSON (uno por idioma)
2. ✅ Agregar namespace a `types.ts`
3. ✅ Agregar preload a `layout.tsx`
4. ✅ Validar con script automático

**Checklist completo:** Ver [I18N_AUTOMATIC_LANGUAGES_RULE.md](./I18N_AUTOMATIC_LANGUAGES_RULE.md)

---

## ✅ Protocolo de Validación Obligatorio

**ANTES de finalizar CUALQUIER trabajo:**

1. ✅ Verificar que NO hay texto hardcodeado
2. ✅ Verificar que usa `useTranslation`
3. ✅ Verificar que existen archivos JSON en 9 idiomas
4. ✅ Verificar que todas las keys existen en 9 idiomas
5. ✅ Ejecutar script de validación

**Script de validación:**
```bash
node scripts/validate-9-language-compliance.js [namespace]
```

**Checklist completo:** Ver [I18N_7_LANGUAGE_COMPLIANCE_PROTOCOL.md](./I18N_7_LANGUAGE_COMPLIANCE_PROTOCOL.md)

---

## 📁 Estructura de Archivos

### Traducciones

```
apps/dashboard/src/lib/i18n/translations/
├── en/          ← English First ⭐
│   ├── common.json
│   ├── projects.json
│   └── ...
├── es/
├── fr/
├── pt/
├── de/
├── it/          ← Automático en nuevos componentes
├── ko/          ← Automático en nuevos componentes
├── ar/          ← RTL
└── zh/
```

### Configuración

```
apps/dashboard/src/lib/i18n/
├── types.ts           ← Tipos (Locale, TranslationNamespace)
├── config.ts          ← Configuración i18n
├── locale-config.ts   ← Configuración por idioma
└── translations/      ← Archivos JSON por idioma
```

---

## 🔄 Workflow Típico

### 1. Crear Nuevo Módulo

```bash
# 1. Crear archivos de traducción (9 idiomas)
apps/dashboard/src/lib/i18n/translations/en/mi-modulo.json
apps/dashboard/src/lib/i18n/translations/es/mi-modulo.json
# ... (it, ko, ar, zh, etc.)

# 2. Agregar namespace a types.ts
# 3. Agregar preload a layout.tsx
# 4. Validar
node scripts/validate-9-language-compliance.js mi-modulo
```

### 2. Agregar Traducción a Módulo Existente

```bash
# 1. Identificar texto hardcodeado
node scripts/audit-hardcoded-text.js apps/dashboard/app/dashboard-bundui/mi-modulo

# 2. Agregar keys a archivos JSON (9 idiomas)
# 3. Reemplazar hardcode con t('key')
# 4. Validar
node scripts/validate-9-language-compliance.js mi-modulo
```

### 3. Validar Módulo Completo

```bash
# Validar namespace
node scripts/validate-9-language-compliance.js mi-modulo

# Detectar hardcode
node scripts/audit-hardcoded-text.js apps/dashboard/app/dashboard-bundui/mi-modulo
```

---

## 🛠️ Scripts Disponibles

### Validación

```bash
# Validar compliance de 9 idiomas
node scripts/validate-9-language-compliance.js [namespace|ruta]

# Detectar texto hardcodeado
node scripts/audit-hardcoded-text.js [ruta]
```

### Ubicación

```
scripts/
├── validate-9-language-compliance.js  ← Validación de 9 idiomas
└── audit-hardcoded-text.js            ← Detección de hardcode
```

---

## 📋 Checklist Consolidado

### Para Nuevos Componentes/Módulos

- [ ] Crear 9 archivos JSON (en, es, fr, pt, de, it, ko, ar, zh)
- [ ] Agregar namespace a `types.ts`
- [ ] Agregar preload a `layout.tsx`
- [ ] Validar con script automático
- [ ] Probar cambio de idioma en navegador

### Para Validación de Trabajo

- [ ] ¿NO hay texto hardcodeado?
- [ ] ¿Usa `useTranslation`?
- [ ] ¿Existen archivos JSON en 9 idiomas?
- [ ] ¿Todas las keys existen en 9 idiomas?
- [ ] ¿Ejecuté script de validación?
- [ ] ¿Probé cambio de idioma?

---

## 🚫 Errores Comunes

### ❌ Error 1: Olvidar it o ko

```json
// ❌ INCORRECTO - Solo creaste 7 archivos
en/mi-modulo.json
es/mi-modulo.json
// ... faltan it y ko
```

**Solución:** Crear archivos para los 9 idiomas siempre.

### ❌ Error 2: No agregar al preload

```typescript
// ❌ INCORRECTO
preloadNamespaces={['common', 'navigation']}
// Falta el nuevo módulo

// ✅ CORRECTO
preloadNamespaces={['common', 'navigation', 'mi-modulo']}
```

### ❌ Error 3: Texto hardcodeado

```typescript
// ❌ INCORRECTO
<h1>Mi Título</h1>

// ✅ CORRECTO
const { t } = useTranslation('mi-modulo');
<h1>{t('header.title')}</h1>
```

---

## 📊 Estado de Módulos

### Módulos Completos (9 idiomas)

Ver estado actualizado en:
- [I18N_DASHBOARD_BUNDUI_IMPLEMENTATION_PLAN.md](./I18N_DASHBOARD_BUNDUI_IMPLEMENTATION_PLAN.md)

### Módulos Pendientes

Ver plan de implementación:
- [I18N_DASHBOARD_BUNDUI_IMPLEMENTATION_PLAN.md](./I18N_DASHBOARD_BUNDUI_IMPLEMENTATION_PLAN.md)

---

## 🔗 Referencias Externas

### Documentos de Estándares

- `docs/standards/GLOBAL_MULTILINGUAL_STANDARD.md` - Estándar global
- `docs/standards/I18N_QUALITY_ASSURANCE.md` - Aseguramiento de calidad

### Guías Específicas

- `docs/guides/HOW_TO_VALIDATE_AND_FIX_I18N.md` - Cómo validar y corregir
- `docs/guides/GENERIC_TABLE_I18N.md` - Tablas genéricas

---

## 📝 Notas Importantes

1. **English First:** English (en) SIEMPRE primero en arrays, tipos y listas
2. **Regla automática:** Nuevos componentes deben incluir los 9 idiomas desde el inicio
3. **Validación obligatoria:** No finalizar trabajo sin validar compliance
4. **Anti-hardcode:** NUNCA texto hardcodeado visible al usuario
5. **Preload:** Siempre agregar namespace al preload en `layout.tsx`

---

## 🎓 Resumen

1. **9 idiomas base** (en, es, fr, pt, de, it, ko, ar, zh)
2. **English First** siempre
3. **Regla automática** para nuevos componentes
4. **Validación obligatoria** antes de finalizar
5. **Scripts automáticos** para validación y detección

---

## 📞 Soporte

- **Documentación completa:** Ver documentos específicos listados arriba
- **AGENTS.md:** Reglas normativas para agentes AI
- **DOCS_INDEX.md:** Índice completo de documentación

---

**Última actualización:** 2025-12-21  
**Mantenido por:** Arquitectura de Software  
**Versión:** 3.0.0 (9 idiomas base)







