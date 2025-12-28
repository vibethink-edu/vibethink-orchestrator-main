# Inventario Dashboard Default - Validación vs Shadcn UI Kit

**Fecha:** 2025-12-20  
**Referencia:** https://shadcnuikit.com/dashboard/default  
**Código Original:** `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard`  
**Nuestro Código:** `apps/dashboard/app/dashboard-bundui/default/`

---

## 📊 Resumen Ejecutivo

### Estado General
- ✅ **Estructura:** Completa y alineada con el original
- ⚠️ **i18n:** Parcialmente implementado (textos hardcoded en componentes)
- ✅ **Componentes:** Todos presentes y funcionales
- ⚠️ **Traducciones:** Faltan namespaces para dashboard default

---

## 🔍 Comparación Detallada

### 1. Estructura de Archivos

#### ✅ Original (Bundui)
```
app/dashboard/(auth)/default/
├── page.tsx
└── components/
    ├── index.ts
    ├── chat-widget.tsx
    ├── exercise-minutes.tsx
    ├── latest-payments.tsx
    ├── payment-method.tsx
    ├── subscriptions.tsx
    ├── theme-members.tsx (TeamMembersCard)
    └── total-revenue.tsx
```

#### ✅ Nuestro (ViTo)
```
apps/dashboard/app/dashboard-bundui/default/
├── page.tsx
└── components/
    ├── index.ts
    ├── chat-widget.tsx
    ├── exercise-minutes.tsx
    ├── latest-payments.tsx
    ├── payment-method.tsx
    ├── subscriptions.tsx
    ├── theme-members.tsx (TeamMembersCard)
    └── total-revenue.tsx
```

**Estado:** ✅ **100% Alineado** - Todos los componentes presentes

---

### 2. Componentes Individuales

#### 2.1. ChatWidget ✅

**Original:**
- Ubicación: `app/dashboard/(auth)/default/components/chat-widget.tsx`
- Imports: `@/components/ui/*`, `@/lib/utils`
- Textos hardcoded: "Hi, how can I help you today?", "New message", etc.

**Nuestro:**
- Ubicación: `apps/dashboard/app/dashboard-bundui/default/components/chat-widget.tsx`
- Imports: `@vibethink/ui`, `@vibethink/utils`
- Textos hardcoded: **Mismo estado** (no traducido)
- Rutas de assets: `/assets/images/avatars/` (correcto)

**Diferencias:**
- ✅ Imports migrados a monorepo (`@vibethink/ui`)
- ❌ **Falta i18n:** Todos los textos están hardcoded en inglés

**Textos a traducir:**
- "Hi, how can I help you today?"
- "Hey, I'm having trouble with my account."
- "What seems to be the problem?"
- "I can't log in."
- "Type your message..."
- "New message"
- "Invite a user to this thread. This will create a new group message."
- "Search user..."
- "No users found."
- "Select users to add to this thread."
- "Continue"
- "Send"

**Namespace sugerido:** `chat.json` o `default-dashboard.json`

---

#### 2.2. LatestPayments ✅

**Original:**
- Ubicación: `app/dashboard/(auth)/default/components/latest-payments.tsx`
- Textos hardcoded: "Customer", "Email", "Amount", "Status", etc.

**Nuestro:**
- Ubicación: `apps/dashboard/app/dashboard-bundui/default/components/latest-payments.tsx`
- Textos hardcoded: **Mismo estado** (no traducido)

**Textos a traducir:**
- "Latest Payments"
- "See recent payments from your customers here."
- "Customer"
- "Email"
- "Amount"
- "Status"
- "success", "processing", "failed"
- "0 of X row(s) selected."
- Alertas: "Deleting X payments", "Exporting X payments", etc.

**Namespace sugerido:** `default-dashboard.json` o `payments.json`

---

#### 2.3. TeamMembersCard (theme-members.tsx) ✅

**Original:**
- Ubicación: `app/dashboard/(auth)/default/components/theme-members.tsx`
- Textos hardcoded: "Team Members", "Invite your team members to collaborate.", etc.

**Nuestro:**
- Ubicación: `apps/dashboard/app/dashboard-bundui/default/components/theme-members.tsx`
- Textos hardcoded: **Mismo estado** (no traducido)
- ✅ Nombre actualizado: "Vito Escallón" (ya corregido)

**Textos a traducir:**
- "Team Members"
- "Invite your team members to collaborate."
- "Viewer", "Developer", "Billing", "Owner"
- "Can view and comment."
- "Can view, comment and edit."
- "Can view, comment and manage billing."
- "Admin-level access to all resources."
- "Select new role..."
- "No roles found."

**Namespace sugerido:** `default-dashboard.json` o `team.json`

---

#### 2.4. SubscriptionsCard ✅

**Original:**
- Ubicación: `app/dashboard/(auth)/default/components/subscriptions.tsx`
- Textos hardcoded: "Subscriptions", "+4850", "+180.1% from last month"

**Nuestro:**
- Ubicación: `apps/dashboard/app/dashboard-bundui/default/components/subscriptions.tsx`
- Textos hardcoded: **Mismo estado** (no traducido)

**Textos a traducir:**
- "Subscriptions"
- "+X from last month" (formato)

**Namespace sugerido:** `default-dashboard.json`

---

#### 2.5. TotalRevenueCard ✅

**Original:**
- Ubicación: `app/dashboard/(auth)/default/components/total-revenue.tsx`
- Textos hardcoded: "Total Revenue", "$15,231.89", "+20.1% from last month"

**Nuestro:**
- Ubicación: `apps/dashboard/app/dashboard-bundui/default/components/total-revenue.tsx`
- Textos hardcoded: **Mismo estado** (no traducido)

**Textos a traducir:**
- "Total Revenue"
- "+X% from last month" (formato)

**Namespace sugerido:** `default-dashboard.json`

---

#### 2.6. ExerciseMinutes ✅

**Original:**
- Ubicación: `app/dashboard/(auth)/default/components/exercise-minutes.tsx`
- Textos hardcoded: "Exercise Minutes", "Your exercise minutes are ahead...", "Export"

**Nuestro:**
- Ubicación: `apps/dashboard/app/dashboard-bundui/default/components/exercise-minutes.tsx`
- Textos hardcoded: **Mismo estado** (no traducido)

**Textos a traducir:**
- "Exercise Minutes"
- "Your exercise minutes are ahead of where you normally are."
- "Export"

**Namespace sugerido:** `default-dashboard.json`

---

#### 2.7. PaymentMethodCard ✅

**Original:**
- Ubicación: `app/dashboard/(auth)/default/components/payment-method.tsx`
- Textos hardcoded: "Payment Method", "Add a new payment method...", etc.

**Nuestro:**
- Ubicación: `apps/dashboard/app/dashboard-bundui/default/components/payment-method.tsx`
- Textos hardcoded: **Mismo estado** (no traducido)

**Textos a traducir:**
- "Payment Method"
- "Add a new payment method to your account."
- "Card", "Paypal", "Apple"
- "Name on the card"
- "City"
- "Card number"
- "Expires"
- "Month", "Year"
- "CVC"
- "Continue"

**Namespace sugerido:** `default-dashboard.json` o `payments.json`

---

#### 2.8. Page.tsx ✅

**Original:**
- Ubicación: `app/dashboard/(auth)/default/page.tsx`
- Textos hardcoded: "Dashboard", "Download"

**Nuestro:**
- Ubicación: `apps/dashboard/app/dashboard-bundui/default/page.tsx`
- Textos hardcoded: **Mismo estado** (no traducido)

**Textos a traducir:**
- "Dashboard"
- "Download"

**Namespace sugerido:** `common.json` o `default-dashboard.json`

---

## 🌍 Estado Global de i18n

### Configuración Actual

**I18nProvider:**
- ✅ Ubicación: `apps/dashboard/app/layout.tsx`
- ✅ Preload namespaces: `['common', 'navigation', 'theme']`
- ✅ Locale detection: Cookie + Browser + Default ('en')
- ✅ Translation store: Inicializado correctamente

**Namespaces Existentes:**
- ✅ `common.json` (EN/ES)
- ✅ `navigation.json` (EN/ES)
- ✅ `theme.json` (EN/ES)
- ✅ `ai-chat.json` (EN/ES)
- ✅ `crypto.json` (EN/ES)
- ✅ `finance.json` (EN/ES)
- ✅ `crm.json` (EN/ES)
- ✅ `ecommerce.json` (EN/ES)
- ✅ `sales.json` (EN/ES)
- ✅ `errors.json` (EN/ES)
- ✅ `validation.json` (EN/ES)

**Total:** 11 namespaces existentes

---

### ❌ Namespaces Faltantes para Dashboard Default

**Prioridad Alta:**
1. ❌ `default-dashboard.json` - **CRÍTICO** para este dashboard
   - Incluiría: ChatWidget, LatestPayments, TeamMembers, Subscriptions, TotalRevenue, ExerciseMinutes, PaymentMethod
   - Estimado: ~80 strings

**Alternativa (si se prefiere granularidad):**
2. ❌ `chat.json` - Para ChatWidget (compartido con otros módulos)
3. ❌ `payments.json` - Para LatestPayments y PaymentMethod
4. ❌ `team.json` - Para TeamMembersCard

---

## 📋 Plan de Acción Recomendado

### Fase 1: Crear Namespace `default-dashboard.json`

**Archivos a crear:**
- `apps/dashboard/src/lib/i18n/translations/en/default-dashboard.json`
- `apps/dashboard/src/lib/i18n/translations/es/default-dashboard.json`

**Estructura sugerida:**
```json
{
  "title": "Dashboard",
  "actions": {
    "download": "Download"
  },
  "chat": {
    "title": "New message",
    "placeholder": "Type your message...",
    "messages": {
      "agent": {
        "greeting": "Hi, how can I help you today?",
        "problem": "What seems to be the problem?"
      },
      "user": {
        "trouble": "Hey, I'm having trouble with my account.",
        "login": "I can't log in."
      }
    },
    "dialog": {
      "title": "New message",
      "description": "Invite a user to this thread. This will create a new group message.",
      "search": "Search user...",
      "empty": "No users found.",
      "select": "Select users to add to this thread.",
      "continue": "Continue"
    },
    "send": "Send"
  },
  "payments": {
    "title": "Latest Payments",
    "description": "See recent payments from your customers here.",
    "table": {
      "customer": "Customer",
      "email": "Email",
      "amount": "Amount",
      "status": "Status",
      "selected": "{{count}} of {{total}} row(s) selected."
    },
    "status": {
      "success": "success",
      "processing": "processing",
      "failed": "failed"
    },
    "actions": {
      "delete": "Deleting {{count}} payments",
      "export": "Exporting {{count}} payments",
      "email": "Sending email to {{count}} customers",
      "tag": "Tagging {{count}} payments"
    }
  },
  "team": {
    "title": "Team Members",
    "description": "Invite your team members to collaborate.",
    "roles": {
      "viewer": "Viewer",
      "developer": "Developer",
      "billing": "Billing",
      "owner": "Owner"
    },
    "roleDescriptions": {
      "viewer": "Can view and comment.",
      "developer": "Can view, comment and edit.",
      "billing": "Can view, comment and manage billing.",
      "owner": "Admin-level access to all resources."
    },
    "selectRole": "Select new role...",
    "noRoles": "No roles found."
  },
  "subscriptions": {
    "title": "Subscriptions",
    "fromLastMonth": "+{{value}}% from last month"
  },
  "revenue": {
    "title": "Total Revenue",
    "fromLastMonth": "+{{value}}% from last month"
  },
  "exercise": {
    "title": "Exercise Minutes",
    "description": "Your exercise minutes are ahead of where you normally are.",
    "export": "Export"
  },
  "paymentMethod": {
    "title": "Payment Method",
    "description": "Add a new payment method to your account.",
    "types": {
      "card": "Card",
      "paypal": "Paypal",
      "apple": "Apple"
    },
    "form": {
      "nameOnCard": "Name on the card",
      "city": "City",
      "cardNumber": "Card number",
      "expires": "Expires",
      "month": "Month",
      "year": "Year",
      "cvc": "CVC",
      "continue": "Continue"
    }
  }
}
```

---

### Fase 2: Migrar Componentes a i18n

**Componentes a migrar (en orden de prioridad):**
1. `page.tsx` - Título y botón Download
2. `chat-widget.tsx` - Todos los textos del chat
3. `latest-payments.tsx` - Tabla y acciones
4. `theme-members.tsx` - Team members y roles
5. `subscriptions.tsx` - Título y formato
6. `total-revenue.tsx` - Título y formato
7. `exercise-minutes.tsx` - Título, descripción y botón
8. `payment-method.tsx` - Formulario completo

**Patrón a seguir:**
```tsx
// ANTES
<h1>Dashboard</h1>
<Button>Download</Button>

// DESPUÉS
import { useTranslation } from '@/lib/i18n';

const { t } = useTranslation('default-dashboard');
<h1>{t('title')}</h1>
<Button>{t('actions.download')}</Button>
```

---

### Fase 3: Actualizar Preload Namespaces

**Archivo:** `apps/dashboard/app/layout.tsx`

**Cambio:**
```tsx
// ANTES
<I18nProvider initialLocale={initialLocale} preloadNamespaces={['common', 'navigation', 'theme']}>

// DESPUÉS
<I18nProvider initialLocale={initialLocale} preloadNamespaces={['common', 'navigation', 'theme', 'default-dashboard']}>
```

---

## ✅ Checklist de Validación

### Estructura
- [x] Todos los componentes presentes
- [x] Estructura de archivos alineada
- [x] Imports migrados a monorepo
- [x] Rutas de assets correctas

### Funcionalidad
- [x] Componentes renderizan correctamente
- [x] Interacciones funcionan (chat, payments, team)
- [x] Datos mock presentes
- [x] Estilos aplicados correctamente

### i18n
- [ ] Namespace `default-dashboard.json` creado (EN/ES)
- [ ] Componentes migrados a `useTranslation()`
- [ ] Preload namespace agregado
- [ ] Traducciones validadas en ambos idiomas
- [ ] LocaleSelector funciona correctamente

### Documentación
- [x] Inventario creado
- [ ] Plan de migración documentado
- [ ] Guía de uso de i18n actualizada

---

## 📊 Estadísticas

| Categoría | Cantidad | Estado |
|-----------|----------|--------|
| **Componentes** | 8 | ✅ 100% |
| **Archivos** | 9 | ✅ 100% |
| **Textos hardcoded** | ~80 | ❌ 0% traducido |
| **Namespaces** | 0/1 | ❌ 0% |
| **Componentes con i18n** | 0/8 | ❌ 0% |

---

## 🎯 Próximos Pasos Inmediatos

1. ✅ **Completado:** Inventario y validación
2. ⏳ **Pendiente:** Crear `default-dashboard.json` (EN/ES)
3. ⏳ **Pendiente:** Migrar `page.tsx` a i18n
4. ⏳ **Pendiente:** Migrar `chat-widget.tsx` a i18n
5. ⏳ **Pendiente:** Migrar `latest-payments.tsx` a i18n
6. ⏳ **Pendiente:** Migrar `theme-members.tsx` a i18n
7. ⏳ **Pendiente:** Migrar componentes restantes
8. ⏳ **Pendiente:** Agregar `default-dashboard` a preload namespaces
9. ⏳ **Pendiente:** Validar traducciones en ambos idiomas

---

**Última actualización:** 2025-12-20  
**Estado:** Inventario completo - Listo para migración i18n












