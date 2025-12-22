# Checklist de Cumplimiento - Módulos Migrados

**Fecha:** 2025-12-21  
**Estado:** 🚨 **OBLIGATORIO** - Aplicar a todos los módulos migrados  
**Versión:** 1.0.0

---

## 🎯 Objetivo

Aplicar las normas de `I18N_TERMINOLOGY_AI_FIRST.md` y `MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md` a los módulos ya migrados **SIN romper nada**.

---

## 📋 Módulos Migrados (Estado Actual)

| Módulo | i18n | Boundaries | Terminology | Estado |
|--------|------|------------|-------------|--------|
| hotel | 65% | ❓ | ❓ | ⚠️ Revisar |
| ai-chat-v2 | 100% | ❓ | ❓ | ⚠️ Revisar |
| crm-v2 | 0% | ❓ | ❓ | 🔴 Crítico |
| crypto-v2 | 100% | ❓ | ❓ | ⚠️ Revisar |
| finance-v2 | 100% | ❓ | ❓ | ⚠️ Revisar |
| social-media | 0% | ❓ | ❓ | 🔴 Crítico |
| file-manager | 100% | ❓ | ❓ | ⚠️ Revisar |
| minimal-tiptap-editor | 0% | ❓ | ❓ | 🔴 Crítico |
| react-flow-workflow | 0% | ❓ | ❓ | 🔴 Crítico |

---

## ✅ Checklist por Módulo

### Paso 1: Validación Automática

```bash
# Para cada módulo, ejecutar:
npm run validate:i18n:master -- --module <nombre-modulo>

# Ejemplo:
npm run validate:i18n:master -- --module hotel
```

**Si hay errores:** Corregir antes de continuar.

---

### Paso 2: Verificar Boundaries de Imports

**Reglas:**
- ❌ UI no puede importar desde `packages/ai-agents`
- ❌ AI Agents no pueden importar desde `apps/*/lib/i18n`
- ❌ Terminology no puede importar desde `apps/*` o `ai-agents`
- ❌ Client components no pueden importar `concepts/*.json`

**Validar:**
```bash
npm run validate:i18n:boundaries
```

**Si hay violaciones:**
1. Identificar archivo y línea
2. Corregir import según regla
3. Re-validar

---

### Paso 3: Verificar Uso de Terminology

**Reglas:**
- ✅ UI puede usar `useTerm()` para labels cortos
- ❌ UI NO puede concatenar `term()` para frases (usar `useTranslations()`)
- ✅ RSC puede usar `await term()`
- ❌ Client NO puede usar `await term()` (usar `useTerm()`)

**Validar:**
```bash
npm run validate:i18n:terminology
```

**Si hay problemas:**
1. Identificar uso incorrecto
2. Reemplazar según patrón correcto
3. Re-validar

---

### Paso 4: Verificar Strings Hardcoded

**Reglas:**
- ❌ NO strings hardcoded en componentes
- ✅ Usar `useTranslations(namespace)` para frases
- ✅ Usar `useTerm()` para labels cortos

**Validar:**
```bash
npm run validate:i18n:hardcoded -- --module <nombre-modulo> --namespace <namespace> --all-components
```

**Si hay strings hardcoded:**
1. Agregar a JSON de traducciones (EN/ES)
2. Reemplazar en componente
3. Re-validar

---

## 🔧 Correcciones Específicas por Tipo de Violación

### Violación 1: Import Prohibido

**Ejemplo:**
```typescript
// ❌ INCORRECTO
import { something } from 'packages/ai-agents/src/...';
```

**Corrección:**
```typescript
// ✅ CORRECTO
// Mover lógica a packages/utils o crear interface
import { helper } from '@vibethink/utils';
```

---

### Violación 2: Client Component con await term()

**Ejemplo:**
```typescript
// ❌ INCORRECTO (en 'use client')
const label = await term('concept.resource.room');
```

**Corrección:**
```typescript
// ✅ CORRECTO
const label = useTerm('concept.resource.room');
```

---

### Violación 3: Concatenación de term()

**Ejemplo:**
```typescript
// ❌ INCORRECTO
const message = await term('concept.resource.room') + ' está disponible';
```

**Corrección:**
```typescript
// ✅ CORRECTO
const { t } = useTranslations('hotel');
const message = t('room.available', { room: useTerm('concept.resource.room') });
```

---

### Violación 4: String Hardcoded

**Ejemplo:**
```typescript
// ❌ INCORRECTO
<h1>Hotel Management</h1>
```

**Corrección:**
```typescript
// ✅ CORRECTO
const { t } = useTranslations('hotel');
<h1>{t('title')}</h1>
```

---

## 📊 Priorización de Módulos

### 🔴 Crítico (0% i18n)
1. **crm-v2** - Módulo importante, sin i18n
2. **social-media** - Módulo visible, sin i18n
3. **minimal-tiptap-editor** - Extensión usada en múltiples lugares
4. **react-flow-workflow** - Componente complejo

### ⚠️ Revisar (i18n parcial/completo pero boundaries)
1. **hotel** - 65% i18n, verificar boundaries
2. **ai-chat-v2** - 100% i18n, verificar boundaries
3. **crypto-v2** - 100% i18n, verificar boundaries
4. **finance-v2** - 100% i18n, verificar boundaries
5. **file-manager** - 100% i18n, verificar boundaries

---

## 🚀 Script de Aplicación Automática

```bash
# Validar todos los módulos migrados
node scripts/validate-all-migrated-modules.js
```

**Este script:**
1. Lee `module-registry.ts`
2. Ejecuta validaciones para cada módulo
3. Genera reporte consolidado
4. Identifica prioridades

---

## ✅ Checklist Final por Módulo

Para cada módulo migrado, verificar:

- [ ] **Boundaries:** `npm run validate:i18n:boundaries` pasa
- [ ] **Terminology:** `npm run validate:i18n:terminology` pasa
- [ ] **Hardcoded:** No strings hardcoded detectados
- [ ] **i18n:** Strings traducidos (EN/ES)
- [ ] **Registry:** Actualizado en `module-registry.ts`
- [ ] **Build:** `npm run build:dashboard` pasa sin errores

---

## 📝 Notas Importantes

1. **NO romper módulos existentes:** Validar antes de cambiar
2. **Migración gradual:** Un módulo a la vez
3. **Tests:** Verificar que módulo sigue funcionando después de cambios
4. **Documentación:** Actualizar `module-registry.ts` con estado de cumplimiento

---

**Última actualización:** 2025-12-21  
**Próxima revisión:** Después de aplicar a módulos críticos



