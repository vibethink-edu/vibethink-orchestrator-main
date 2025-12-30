# 🌍 Buenas Prácticas i18n para AI Agents

**Fecha:** 2025-12-21  
**Propósito:** Guía de buenas prácticas para implementar i18n sin errores y sin blink de texto  
**Audiencia:** AI Agents que migran componentes a i18n

---

## 🚨 Reglas Fundamentales

### **1. Validación Obligatoria de Keys**

**NUNCA asumir que todas las keys existen. SIEMPRE verificar.**

```bash
# Después de migrar CADA componente, ejecutar:
grep -r "t('cards\." apps/dashboard/app/dashboard-bundui/[MODULE]/components/[COMPONENT].tsx

# Verificar que cada key existe en ambos archivos:
grep "[KEY_NAME]" apps/dashboard/src/lib/i18n/translations/en/[MODULE].json
grep "[KEY_NAME]" apps/dashboard/src/lib/i18n/translations/es/[MODULE].json
```

**Checklist obligatorio:**
- [ ] Extraer TODAS las keys usadas con `grep`
- [ ] Verificar existencia en `en/[module].json`
- [ ] Verificar existencia en `es/[module].json`
- [ ] Agregar keys faltantes ANTES de considerar completado

**Documentación:** `docs/architecture/I18N_VALIDATION_PROTOCOL.md`

---

## 🚫 Evitar Blink de Texto (Flash of Untranslated Content)

### **Problema:**

Cuando las traducciones se cargan de forma asíncrona, puede aparecer el key de traducción (`"cards.tickets.ticketStatus"`) antes de que se cargue la traducción real.

### **Estrategia Anti-Blink:**

#### **1. Preload en Layout (OBLIGATORIO)**

**SIEMPRE preload el namespace del módulo en el layout:**

```typescript
// apps/dashboard/app/dashboard-bundui/[MODULE]/layout.tsx
import { I18nProvider } from '@/lib/i18n';

export default function ModuleLayout({ children }) {
  return (
    <I18nProvider preloadNamespaces={['common', 'navigation', '[MODULE]']}>
      {children}
    </I18nProvider>
  );
}
```

**Ejemplo real:**
```typescript
// apps/dashboard/app/dashboard-bundui/analytics/layout.tsx
<I18nProvider preloadNamespaces={['common', 'navigation', 'analytics']}>
  {children}
</I18nProvider>
```

**✅ VENTAJA:** Las traducciones se cargan ANTES de renderizar los componentes → NO HAY BLINK en primera carga.

#### **2. Caché de Traducciones (Ya Implementado)**

El sistema tiene caché automático:
- ✅ Una vez cargadas, las traducciones quedan en caché
- ✅ Al cambiar de idioma, si están en caché → NO HAY BLINK
- ✅ Si NO están en caché → puede haber blink pequeño

#### **3. Comportamiento Esperado**

| Escenario | Blink? | Razón |
|-----------|--------|-------|
| **Primera carga (con preload)** | ❌ NO | Traducciones cargadas antes del render |
| **Primera carga (sin preload)** | ⚠️ SÍ | Traducciones se cargan "on-demand" |
| **Cambio de idioma (con caché)** | ❌ NO | Traducciones ya están en caché |
| **Cambio de idioma (sin caché)** | ⚠️ SÍ | Traducciones se cargan después |

**Conclusión:** El preload en layout elimina el blink en la primera carga. El caché elimina el blink en cambios de idioma.

---

## ✅ Checklist Completo por Módulo

### **Fase 1: Preparación**

- [ ] Verificar que los archivos de traducción existen (`en/[module].json`, `es/[module].json`)
- [ ] Si no existen, crearlos con estructura básica

### **Fase 2: Migración de Componentes**

- [ ] Agregar `useTranslation('[module]')` en cada componente
- [ ] Reemplazar strings hardcoded con `t('key')`
- [ ] Seguir estructura de sub-namespaces (`cards.*`, `header.*`, etc.)

### **Fase 3: Validación de Keys**

- [ ] Extraer TODAS las keys usadas con `grep`
- [ ] Verificar que cada key existe en `en/[module].json`
- [ ] Verificar que cada key existe en `es/[module].json`
- [ ] Agregar keys faltantes en AMBOS archivos

### **Fase 4: Preload (Anti-Blink)**

- [ ] Crear o actualizar `layout.tsx` en el módulo
- [ ] Agregar `I18nProvider` con `preloadNamespaces` incluyendo el módulo
- [ ] Verificar que las traducciones se cargan antes del render

### **Fase 5: Validación Final**

- [ ] Ejecutar `read_lints` - debe mostrar 0 errores
- [ ] Ejecutar `npm run build:dashboard` - debe compilar sin errores
- [ ] Verificar en navegador que no hay blink en primera carga
- [ ] Verificar cambio de idioma funciona sin blink

---

## 📋 Estructura de Keys Recomendada

### **Por Componente/Card:**

```json
{
  "cards": {
    "componentName": {
      "title": "...",
      "description": "...",
      "metric1": "...",
      "metric2": "...",
      "actions": {
        "save": "...",
        "cancel": "..."
      },
      "errors": {
        "loadingFailed": "...",
        "noData": "..."
      }
    }
  }
}
```

### **Sub-namespaces Comunes:**

- `cards.*` - Tarjetas y componentes principales
- `header.*` - Headers y controles de página
- `table.*` - Elementos de tabla
- `form.*` - Formularios
- `toolbar.*` - Barras de herramientas
- `status.*` - Estados
- `messages.*` - Mensajes del sistema
- `labels.*` - Labels genéricos

---

## 🎯 Ejemplo Completo: Módulo Analytics

### **1. Layout con Preload:**

```typescript
// apps/dashboard/app/dashboard-bundui/analytics/layout.tsx
import { I18nProvider } from '@/lib/i18n';

export default function AnalyticsLayout({ children }) {
  return (
    <I18nProvider preloadNamespaces={['common', 'navigation', 'analytics']}>
      {children}
    </I18nProvider>
  );
}
```

### **2. Componente Migrado:**

```typescript
// apps/dashboard/app/dashboard-bundui/analytics/components/TicketsCard.tsx
import { useTranslation } from '@/lib/i18n';

export function TicketsCard() {
  const { t } = useTranslation('analytics');
  
  return (
    <Card>
      <CardTitle>{t('cards.tickets.title')}</CardTitle>
      <CardDescription>{t('cards.tickets.description')}</CardDescription>
      <h4>{t('cards.tickets.ticketStatus')}</h4>
      {/* ... */}
    </Card>
  );
}
```

### **3. Keys en JSON:**

```json
// en/analytics.json
{
  "cards": {
    "tickets": {
      "title": "Support Tickets",
      "description": "Support team performance",
      "ticketStatus": "Ticket Status"
    }
  }
}
```

### **4. Validación:**

```bash
# Verificar keys usadas
grep -r "t('cards\.tickets\." apps/dashboard/app/dashboard-bundui/analytics/components/TicketsCard.tsx

# Verificar existencia
grep "ticketStatus" apps/dashboard/src/lib/i18n/translations/en/analytics.json
grep "ticketStatus" apps/dashboard/src/lib/i18n/translations/es/analytics.json
```

---

## ⚠️ Errores Comunes a Evitar

### **1. Asumir que las keys existen**
❌ **MAL:** Migrar componente y no verificar keys
✅ **BIEN:** Verificar con `grep` que todas las keys existen

### **2. Olvidar el preload**
❌ **MAL:** Migrar componente pero no agregar al preload
✅ **BIEN:** Siempre crear/actualizar layout con preload

### **3. Keys inconsistentes**
❌ **MAL:** `t('cards.ticket.title')` vs `t('cards.tickets.title')`
✅ **BIEN:** Usar estructura consistente y verificar que coincide en JSON

### **4. Solo agregar en un idioma**
❌ **MAL:** Agregar key solo en `en/[module].json`
✅ **BIEN:** Agregar key en AMBOS archivos (en/es)

---

## 📚 Documentación Relacionada

- **`I18N_VALIDATION_PROTOCOL.md`** - Protocolo de validación de keys
- **`I18N_NO_BLINK_STRATEGY.md`** - Estrategia detallada anti-blink
- **`I18N_AI_FIRST_COMPLETE_GUIDE.md`** - Guía completa de metodología AI-First
- **`I18N_AI_FIRST_QUICK_REFERENCE.md`** - Quick reference

---

## ✅ Regla de Oro

**"Siempre preload, siempre valida, nunca asumas"**

1. ✅ **Preload** el namespace en el layout
2. ✅ **Valida** todas las keys con grep
3. ✅ **Nunca asumas** que una key existe sin verificar

---

**Última actualización:** 2025-12-21  
**Para:** AI Agents  
**Tipo:** Buenas Prácticas








