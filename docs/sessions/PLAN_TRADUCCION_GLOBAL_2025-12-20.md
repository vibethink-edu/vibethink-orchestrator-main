# Plan de Traducción Global para Dashboards - 2025-12-20

**Objetivo:** Implementar traducción completa (i18n) para todos los dashboards, eliminando textos hardcoded y asegurando soporte multidioma consistente.

---

## 📊 Estado Actual de Traducciones

### Namespaces Existentes ✅

| Namespace | Estado EN | Estado ES | Uso |
|-----------|-----------|-----------|-----|
| `common` | ✅ Completo | ✅ Completo | Botones, labels, mensajes comunes |
| `navigation` | ✅ Completo | ✅ Completo | Nombres de módulos y rutas |
| `theme` | ✅ Completo | ✅ Completo | Theme customizer |
| `crm` | ✅ Completo | ✅ Completo | Módulo CRM |
| `ecommerce` | ✅ Completo | ✅ Completo | Módulo E-commerce |
| `sales` | ✅ Completo | ✅ Completo | Módulo Sales |
| `errors` | ✅ Completo | ✅ Completo | Mensajes de error |
| `validation` | ✅ Completo | ✅ Completo | Validaciones de formularios |

### Namespaces Faltantes ❌

| Namespace | Prioridad | Módulos Afectados |
|-----------|-----------|-------------------|
| `ai-chat` | 🔴 **ALTA** | AI Chat, AI Chat V2 |
| `crypto` | 🟡 Media | Crypto, Crypto V2 |
| `finance` | 🟡 Media | Finance, Finance V2 |
| `kanban` | 🟡 Media | Kanban |
| `mail` | 🟡 Media | Mail |
| `notes` | 🟡 Media | Notes, Notes V2 |
| `tasks` | 🟡 Media | Tasks |
| `calendar` | 🟡 Media | Calendar |
| `file-manager` | 🟡 Media | File Manager |
| `analytics` | 🟡 Media | Website Analytics |
| `projects` | 🟡 Media | Project Management |
| `settings` | 🟡 Media | Settings pages |

---

## 🎯 Estrategia de Traducción Global

### Fase 1: Auditoría y Mapeo 📋

**Objetivo:** Identificar todos los textos hardcoded en los dashboards.

**Proceso:**
1. Escanear todos los componentes en `apps/dashboard/app/dashboard-bundui/`
2. Escanear todos los componentes en `apps/dashboard/app/dashboard-vibethink/`
3. Identificar strings hardcoded (no usando `t()`)
4. Categorizar por namespace
5. Crear lista de textos a traducir

**Herramientas:**
- Script de auditoría automatizada
- Búsqueda regex: `"[A-Z][^"]*"` (strings en inglés)
- Búsqueda de componentes sin `useTranslation`

### Fase 2: Creación de Namespaces 🗂️

**Objetivo:** Crear archivos de traducción para todos los módulos faltantes.

**Estructura:**
```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   ├── ai-chat.json
│   ├── crypto.json
│   ├── finance.json
│   ├── kanban.json
│   ├── mail.json
│   ├── notes.json
│   ├── tasks.json
│   ├── calendar.json
│   ├── file-manager.json
│   ├── analytics.json
│   ├── projects.json
│   └── settings.json
└── es/
    ├── ai-chat.json
    ├── crypto.json
    ├── finance.json
    ├── kanban.json
    ├── mail.json
    ├── notes.json
    ├── tasks.json
    ├── calendar.json
    ├── file-manager.json
    ├── analytics.json
    ├── projects.json
    └── settings.json
```

**Template por Namespace:**
```json
{
  "title": "Module Title",
  "description": "Module description",
  "sections": {
    "section1": {
      "title": "Section Title",
      "subtitle": "Section subtitle",
      "items": {
        "item1": "Item 1",
        "item2": "Item 2"
      }
    }
  },
  "actions": {
    "action1": "Action 1",
    "action2": "Action 2"
  },
  "messages": {
    "success": "Success message",
    "error": "Error message"
  }
}
```

### Fase 3: Migración de Componentes 🔄

**Objetivo:** Reemplazar textos hardcoded con llamadas a `t()`.

**Proceso por Componente:**
1. Agregar `useTranslation` hook
2. Identificar namespace apropiado
3. Reemplazar strings hardcoded con `t('namespace:key')`
4. Verificar que todas las traducciones existen
5. Probar en ambos idiomas (EN/ES)

**Ejemplo de Migración:**
```tsx
// ANTES
<h1>AI Chat</h1>
<p>Start a conversation with AI</p>
<button>Send Message</button>

// DESPUÉS
const { t } = useTranslation();
<h1>{t('ai-chat:title')}</h1>
<p>{t('ai-chat:description')}</p>
<button>{t('common:buttons.send')}</button>
```

### Fase 4: Validación y Testing ✅

**Objetivo:** Asegurar que todas las traducciones funcionan correctamente.

**Checklist:**
- [ ] Todos los componentes usan `t()` en lugar de strings hardcoded
- [ ] Todas las traducciones existen en EN y ES
- [ ] No hay keys faltantes en ningún namespace
- [ ] El cambio de idioma funciona en todos los dashboards
- [ ] No hay textos en inglés cuando el idioma es español
- [ ] No hay textos en español cuando el idioma es inglés

---

## 📝 Plan de Implementación por Módulo

### Prioridad Alta 🔴

#### 1. AI Chat / AI Chat V2

**Namespace:** `ai-chat`

**Componentes a Migrar:**
- `apps/dashboard/app/dashboard-bundui/ai-chat-v2/page.tsx`
- `apps/dashboard/app/dashboard-bundui/ai-chat-v2/components/ai-chat-interface.tsx`
- `apps/dashboard/app/dashboard-bundui/ai-chat-v2/components/ai-chat-sidebar.tsx`
- `apps/dashboard/app/dashboard-bundui/ai-chat-v2/components/ai-upgrade-modal.tsx`

**Textos Clave:**
- Títulos y subtítulos
- Mensajes de placeholder
- Botones de acción
- Mensajes de error/success
- Tooltips y ayuda

**Archivo de Traducción:**
```json
{
  "title": "AI Chat",
  "subtitle": "Chat with AI Assistant",
  "placeholder": "Type your message...",
  "send": "Send",
  "newChat": "New Chat",
  "upgrade": {
    "title": "Upgrade to Pro",
    "description": "Unlock advanced features",
    "button": "Upgrade Now"
  },
  "messages": {
    "thinking": "AI is thinking...",
    "error": "An error occurred",
    "retry": "Retry"
  }
}
```

### Prioridad Media 🟡

#### 2. Crypto / Crypto V2

**Namespace:** `crypto`

**Textos Clave:**
- Balances y wallets
- Trading actions
- Transaction history
- Charts y métricas

#### 3. Finance / Finance V2

**Namespace:** `finance`

**Textos Clave:**
- Revenue y expenses
- KPI cards
- Transactions
- Savings goals

#### 4. Otros Módulos

**Namespaces:** `kanban`, `mail`, `notes`, `tasks`, `calendar`, `file-manager`, `analytics`, `projects`, `settings`

**Proceso:** Similar a los módulos anteriores

---

## 🛠️ Herramientas y Scripts

### Script de Auditoría

**Objetivo:** Encontrar todos los textos hardcoded.

```javascript
// scripts/audit-hardcoded-text.js
// Buscar strings en inglés dentro de componentes
// Categorizar por módulo
// Generar reporte de textos a traducir
```

### Script de Validación

**Objetivo:** Verificar que todas las traducciones existen.

```javascript
// scripts/validate-translations.js
// Verificar que todas las keys usadas existen en EN y ES
// Detectar keys faltantes
// Detectar keys no utilizadas
```

---

## 📋 Checklist de Implementación

### Pre-Implementación
- [ ] Crear documento de plan (este documento)
- [ ] Auditar textos hardcoded
- [ ] Crear lista de namespaces necesarios
- [ ] Definir estructura de traducciones

### Implementación
- [ ] Crear archivos de traducción (EN/ES) para cada namespace
- [ ] Migrar componentes prioridad alta (AI Chat)
- [ ] Migrar componentes prioridad media
- [ ] Validar traducciones
- [ ] Probar cambio de idioma

### Post-Implementación
- [ ] Documentar proceso
- [ ] Crear guía para futuros módulos
- [ ] Actualizar CHANGELOG
- [ ] Commit de traducción global

---

## 🎯 Métricas de Éxito

- ✅ 0 textos hardcoded en componentes de dashboards
- ✅ 100% de módulos con traducciones completas
- ✅ Cambio de idioma funciona en todos los dashboards
- ✅ No hay keys faltantes en producción

---

## 📚 Referencias

- **Sistema i18n:** `apps/dashboard/src/lib/i18n/`
- **Traducciones existentes:** `apps/dashboard/src/lib/i18n/translations/`
- **Documentación:** `docs/architecture/I18N_STRATEGY.md`

---

**Última actualización:** 2025-12-20
**Estado:** Plan creado, listo para implementación


