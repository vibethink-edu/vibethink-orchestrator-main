# 🏗️ ARQUITECTURA DEFINITIVA - DASHBOARD MONOREPO

**Fecha**: 2026-01-10  
**Versión**: 2.0 - REESTRUCTURACIÓN FINAL  
**Propósito**: NUNCA MÁS romper dashboards. Arquitectura clara y mantenible.

---

## 🎯 REGLA DE ORO

> **dashboard-bundui = LABORATORIO DE UI**  
> Todo componente nuevo se prueba PRIMERO aquí.  
> Los demás dashboards CONSUMEN, nunca crean.

---

## 📐 ESTRUCTURA DEFINITIVA

```
vibethink-orchestrator-main/
│
├── packages/ui/                    ← 🌍 ASSETS GLOBALES (ÚNICOS)
│   ├── src/
│   │   ├── icons.tsx               ← ⚠️ ÚNICA fuente de iconos
│   │   ├── globals.css             ← ⚠️ ÚNICO CSS global
│   │   └── components/             ← ⚠️ ÚNICOS componentes base
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   └── package.json
│
└── apps/dashboard/
    └── app/
        │
        ├── dashboard-bundui/       ← 🎨 MOCKUPS UI (LABORATORIO)
        │   ├── projects-v2/        ← Mockup de proyectos
        │   ├── crm-v2-ai/          ← Mockup de CRM con IA
        │   ├── pos-system/         ← Mockup de POS
        │   ├── ecommerce/          ← Mockup de e-commerce
        │   ├── crypto/             ← Mockup de crypto
        │   ├── file-manager/       ← Mockup de archivos
        │   └── ...                 ← Todos los mockups
        │
        ├── dashboard-admin/        ← 🔧 ADMIN INTERNO (VibeThink)
        │   └── tenants/            ← Gestión de clientes
        │       ├── page.tsx
        │       └── components/
        │
        ├── dashboard-tenant/       ← 👥 ADMIN CLIENTES (Empresas)
        │   └── overview/           ← Dashboard del cliente
        │       ├── page.tsx
        │       └── components/
        │
        └── dashboard-vibethink/    ← 🌟 DASHBOARD ALTERNATIVO
            └── ...                 ← Consume assets globales
```

---

## 🚀 SCRIPTS DE DESARROLLO

### **Iniciar Dashboards**

Cada dashboard tiene su propio script y puerto:

```powershell
# Dashboard-Bundui (UI Mockups) - Puerto 3005
.\scripts\start-dashboard-bundui.ps1
# URL: http://localhost:3005/dashboard-bundui/projects-v2

# Dashboard-Admin (VibeThink Internal) - Puerto 3006
.\scripts\start-dashboard-admin.ps1
# URL: http://localhost:3006/dashboard-admin/tenants

# Dashboard-Tenant (Client Admin) - Puerto 3007
.\scripts\start-dashboard-tenant.ps1
# URL: http://localhost:3007/dashboard-tenant/overview
```

### **Detener Dashboards**

```powershell
# Detener individual
.\scripts\stop-dashboard-bundui.ps1
.\scripts\stop-dashboard-admin.ps1
.\scripts\stop-dashboard-tenant.ps1

# Detener todos
.\scripts\stop-all-dashboards.ps1
```

### **Puertos Asignados**

| Dashboard | Puerto | Propósito |
|-----------|--------|-----------|
| **Bundui** | 3005 | UI Mockups Lab |
| **Admin** | 3006 | VibeThink Internal Admin |
| **Tenant** | 3007 | Client/Company Admin |

📚 **Documentación completa**: `scripts/DASHBOARD_SCRIPTS_README.md`

---

## 🚦 FLUJO DE TRABAJO PARA NUEVOS COMPONENTES

### **Paso 1: Crear en dashboard-bundui**
```typescript
// ✅ CORRECTO: Crear mockup primero
apps/dashboard/app/dashboard-bundui/new-feature/
├── page.tsx
├── components/
│   ├── NewComponent.tsx
│   └── AnotherComponent.tsx
└── hooks/
    └── useNewFeature.ts
```

### **Paso 2: Probar y estabilizar**
- Validar visualmente en `/dashboard-bundui/new-feature`
- Asegurar que no hay errores TypeScript
- Verificar que usa assets de `@vibethink/ui`

### **Paso 3: Si es reutilizable → Mover a packages/ui**
```bash
# Solo si el componente es genérico y reutilizable
mv apps/dashboard/app/dashboard-bundui/new-feature/components/NewComponent.tsx \
   packages/ui/src/components/new-component.tsx
```

### **Paso 4: Usar en otros dashboards**
```typescript
// ✅ CORRECTO: Importar desde packages/ui
import { NewComponent } from '@vibethink/ui/components/new-component'

// ❌ PROHIBIDO: Importar desde dashboard-bundui
import { NewComponent } from '../../dashboard-bundui/new-feature/components/NewComponent'
```

---

## 🛡️ REGLAS INQUEBRANTABLES

### **1. Assets Globales = ÚNICA FUENTE**

#### **Iconos**
```typescript
// ✅ CORRECTO
import { UserIcon, SettingsIcon } from '@vibethink/ui/icons'

// ❌ PROHIBIDO
import { User, Settings } from 'lucide-react'
import UserIcon from './icons/user.svg'
```

#### **Componentes UI**
```typescript
// ✅ CORRECTO
import { Button } from '@vibethink/ui/components/button'
import { Card } from '@vibethink/ui/components/card'

// ❌ PROHIBIDO
import { Button } from '@/components/ui/button'
import { Card } from './components/Card'
```

#### **CSS Global**
```typescript
// ✅ CORRECTO (en layout.tsx)
import '@vibethink/ui/globals.css'

// ❌ PROHIBIDO
import './globals.css'
import '../styles/custom.css'
```

---

### **2. dashboard-bundui = SOLO MOCKUPS**

**Propósito**: Laboratorio de UI, prototipos, experimentación

**Contenido permitido**:
- ✅ Mockups de features
- ✅ Prototipos de UI
- ✅ Componentes en desarrollo
- ✅ Páginas de demostración

**Contenido PROHIBIDO**:
- ❌ Lógica de negocio real
- ❌ Conexiones a base de datos
- ❌ Autenticación real
- ❌ Features de producción

---

### **3. dashboard-admin = ADMIN VIBETHINK**

**Propósito**: Panel de administración INTERNO de VibeThink

**Rutas**:
```
/dashboard-admin/tenants        ← Gestión de clientes
/dashboard-admin/users          ← Gestión de usuarios internos
/dashboard-admin/billing        ← Facturación global
/dashboard-admin/analytics      ← Analytics internos
```

**Autenticación**:
- Solo usuarios con rol `admin` de VibeThink
- No accesible para clientes

---

### **4. dashboard-tenant = ADMIN CLIENTES**

**Propósito**: Panel de administración para EMPRESAS CLIENTES

**Rutas**:
```
/dashboard-tenant/overview      ← Dashboard principal del cliente
/dashboard-tenant/team          ← Gestión de equipo
/dashboard-tenant/settings      ← Configuración de la empresa
/dashboard-tenant/billing       ← Facturación del cliente
```

**Autenticación**:
- Multi-tenant (aislamiento por `company_id`)
- Solo usuarios del cliente correspondiente

---

### **5. dashboard-vibethink = DASHBOARD ALTERNATIVO**

**Propósito**: Dashboard con diseño alternativo (vendor-agnostic)

**Reglas**:
- ✅ Consume assets de `@vibethink/ui`
- ✅ Puede tener su propio diseño
- ❌ NO duplica componentes de packages/ui

---

## 🔒 IMPORTS PROTEGIDOS

### **Jerarquía de Imports**

```
Nivel 1: packages/ui             ← Fuente de verdad
         ↓
Nivel 2: dashboard-bundui        ← Mockups (consume de packages/ui)
         ↓
Nivel 3: dashboard-admin         ← Admin interno (consume de packages/ui)
         ↓
Nivel 4: dashboard-tenant        ← Admin clientes (consume de packages/ui)
         ↓
Nivel 5: dashboard-vibethink     ← Dashboard alternativo (consume de packages/ui)
```

### **Reglas de Importación**

```typescript
// ✅ TODOS pueden importar de packages/ui
import { Button } from '@vibethink/ui/components/button'

// ✅ dashboard-admin puede importar de shared
import { useAuth } from '@/shared/hooks/useAuth'

// ❌ NUNCA importar entre dashboards
import { Component } from '../../dashboard-bundui/...'  // ❌ PROHIBIDO
import { Component } from '../../dashboard-admin/...'   // ❌ PROHIBIDO
```

---

## 📦 DEPLOYMENT DE COMPONENTES

### **Flujo Oficial**

```
1. Crear mockup en dashboard-bundui
   ↓
2. Probar y validar visualmente
   ↓
3. ¿Es reutilizable?
   ├─ SÍ → Mover a packages/ui
   └─ NO → Dejar en dashboard-bundui
   ↓
4. Usar en otros dashboards desde packages/ui
```

### **Ejemplo Completo**

```bash
# 1. Crear mockup
apps/dashboard/app/dashboard-bundui/new-crm/
└── components/
    └── CustomerCard.tsx

# 2. Probar en /dashboard-bundui/new-crm

# 3. Si es genérico → Mover a packages/ui
packages/ui/src/components/customer-card.tsx

# 4. Exportar en packages/ui
packages/ui/src/index.ts:
export { CustomerCard } from './components/customer-card'

# 5. Usar en dashboard-admin
apps/dashboard/app/dashboard-admin/tenants/page.tsx:
import { CustomerCard } from '@vibethink/ui/components/customer-card'
```

---

## 🚨 CHECKLIST ANTES DE COMMIT

### **Para CUALQUIER cambio**

- [ ] ¿Usé imports desde `@vibethink/ui`?
- [ ] ¿No dupliqué componentes?
- [ ] ¿No rompí imports de otros dashboards?
- [ ] ¿Pasó `pnpm tsc --noEmit`?
- [ ] ¿Probé visualmente en el browser?

### **Para nuevos componentes**

- [ ] ¿Lo creé primero en `dashboard-bundui`?
- [ ] ¿Lo probé en el mockup?
- [ ] ¿Es reutilizable? → Mover a `packages/ui`
- [ ] ¿Actualicé exports en `packages/ui/src/index.ts`?

### **Para mover archivos**

- [ ] ¿Actualicé TODOS los imports?
- [ ] ¿Verifiqué que no rompí otros dashboards?
- [ ] ¿Documenté el cambio?

---

## 🎯 OBJETIVOS FINALES

### **Corto Plazo (Hoy)**
- ✅ Separar `dashboard-admin` y `dashboard-tenant`
- ✅ Limpiar `dashboard-bundui` (solo mockups)
- ✅ 0 errores TypeScript
- ✅ Todos los dashboards funcionando

### **Mediano Plazo (Esta semana)**
- ✅ Migrar componentes reutilizables a `packages/ui`
- ✅ Documentar cada componente
- ✅ Tests unitarios para componentes críticos

### **Largo Plazo (Este mes)**
- ✅ Storybook para `packages/ui`
- ✅ CI/CD que valide imports
- ✅ Linter que detecte imports prohibidos

---

## 📞 CONTACTO Y SOPORTE

**Si tienes dudas**:
1. Lee este documento primero
2. Verifica `UI_STABILITY_RULES.md`
3. Pregunta antes de mover archivos

**Si algo se rompe**:
1. Revierte el commit inmediatamente
2. Verifica los imports
3. Consulta este documento

---

## 📝 CHANGELOG

### v2.0 - 2026-01-10 (REESTRUCTURACIÓN FINAL)
- ✅ Separación de `dashboard-admin` y `dashboard-tenant`
- ✅ `dashboard-bundui` solo para mockups
- ✅ Assets centralizados en `packages/ui`
- ✅ Documentación completa de arquitectura

### v1.0 - 2026-01-10 (INICIAL)
- ✅ Reglas básicas de estabilidad UI

---

**ÚLTIMA ACTUALIZACIÓN**: 2026-01-10 22:59  
**AUTOR**: Marcelo + Antigravity AI  
**ESTADO**: ✅ APROBADO PARA PRODUCCIÓN
