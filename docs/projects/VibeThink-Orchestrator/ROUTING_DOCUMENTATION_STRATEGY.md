# 🗺️ Estrategia de Documentación de Routing - Enfoque Conservador

## 📋 Resumen Ejecutivo

Este documento define la estrategia para mantener actualizado y visible el mapa de routing de la aplicación, siguiendo la **Estrategia A: Enfoque Conservador** aprobada en ADR-001. La implementación será gradual y manual, evolucionando hacia automatización solo después de estabilizar la base.

## 🎯 Objetivos de la Estrategia

### **Objetivos Principales**
- ✅ **Documentación manual** completa y actualizada
- ✅ **Visibilidad** del mapa de rutas para el equipo
- ✅ **Coherencia** con arquitectura multi-tenant y roles
- ✅ **Mantenibilidad** sin riesgo de estabilidad

### **Objetivos Secundarios**
- ✅ **Base sólida** para automatización futura
- ✅ **Proceso claro** de actualización
- ✅ **Validación** de coherencia arquitectónica
- ✅ **Integración** con documentación existente

---

## 🏗️ Arquitectura de Documentación

### **Estructura de Archivos**
```
docs/
├── routing/
│   ├── ROUTE_MAP.md              # Mapa completo de rutas
│   ├── ROUTE_TREE.md             # Árbol visual de rutas
│   ├── ROUTE_PERMISSIONS.md      # Matriz de permisos por ruta
│   ├── ROUTE_COMPONENTS.md       # Componentes por ruta
│   └── ROUTE_VALIDATION.md       # Proceso de validación
├── ARCHITECTURE_DECISION_RECORDS.md
├── STABILIZATION_PLAN.md
└── ROUTING_DOCUMENTATION_STRATEGY.md
```

### **Componentes de Documentación**

#### **1. ROUTE_MAP.md - Mapa Completo**
```markdown
# 🗺️ Mapa de Rutas - AI Pair Orchestrator Pro

## 📋 Resumen
- **Total de rutas**: 25
- **Rutas públicas**: 3
- **Rutas protegidas**: 22
- **Última actualización**: 19 Enero 2025

## 🏠 Rutas Públicas
| Ruta | Componente | Descripción | Estado |
|------|------------|-------------|--------|
| `/` | HomePage | Página principal | ✅ Activa |
| `/login` | AuthPage | Autenticación | ✅ Activa |
| `/register` | RegisterPage | Registro | ✅ Activa |

## 🔐 Rutas Protegidas por Rol

### EMPLOYEE (Nivel 1)
| Ruta | Componente | Descripción | Permisos |
|------|------------|-------------|----------|
| `/dashboard` | DashboardPage | Dashboard principal | READ |
| `/profile` | ProfilePage | Perfil de usuario | READ, WRITE |

### MANAGER (Nivel 2)
| Ruta | Componente | Descripción | Permisos |
|------|------------|-------------|----------|
| `/team` | TeamPage | Gestión de equipo | READ, WRITE |
| `/reports` | ReportsPage | Reportes básicos | READ |

### ADMIN (Nivel 3)
| Ruta | Componente | Descripción | Permisos |
|------|------------|-------------|----------|
| `/admin` | AdminPanel | Panel administrativo | FULL |
| `/billing` | BillingPage | Gestión de facturación | FULL |

### OWNER (Nivel 4)
| Ruta | Componente | Descripción | Permisos |
|------|------------|-------------|----------|
| `/company` | CompanyPage | Configuración empresa | FULL |
| `/analytics` | AnalyticsPage | Analytics avanzados | FULL |

### SUPER_ADMIN (Nivel 5)
| Ruta | Componente | Descripción | Permisos |
|------|------------|-------------|----------|
| `/super-admin` | SuperAdminPanel | Panel super admin | FULL |
| `/platform` | PlatformPage | Gestión plataforma | FULL |

## 🧪 Rutas de Testing
| Ruta | Componente | Descripción | Ambiente |
|------|------------|-------------|----------|
| `/testing/dual-configuration` | DualConfigurationTest | Test dual config | Development |
| `/testing/billing` | BillingTest | Test facturación | Development |
| `/testing/multi-country` | MultiCountryTest | Test multi-país | Development |

## 📱 Rutas Móviles
| Ruta | Componente | Descripción | Responsive |
|------|------------|-------------|------------|
| `/mobile/dashboard` | MobileDashboard | Dashboard móvil | ✅ Sí |
| `/mobile/chat` | MobileChat | Chat móvil | ✅ Sí |

## 🔄 Rutas de API
| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/auth` | POST | Autenticación | No |
| `/api/users` | GET | Lista usuarios | Sí |
| `/api/companies` | GET | Lista empresas | Sí |
```

#### **2. ROUTE_TREE.md - Árbol Visual**
```markdown
# 🌳 Árbol de Rutas - AI Pair Orchestrator Pro

```
ai-pair-orchestrator-pro/
├── / (HomePage) - Público
├── /login (AuthPage) - Público
├── /register (RegisterPage) - Público
├── /dashboard (DashboardPage) - EMPLOYEE+
│   ├── /overview
│   ├── /tasks
│   └── /notifications
├── /profile (ProfilePage) - EMPLOYEE+
│   ├── /settings
│   ├── /preferences
│   └── /security
├── /team (TeamPage) - MANAGER+
│   ├── /members
│   ├── /roles
│   └── /permissions
├── /reports (ReportsPage) - MANAGER+
│   ├── /performance
│   ├── /productivity
│   └── /analytics
├── /admin (AdminPanel) - ADMIN+
│   ├── /users
│   ├── /settings
│   ├── /audit
│   └── /system
├── /billing (BillingPage) - ADMIN+
│   ├── /invoices
│   ├── /payments
│   ├── /plans
│   └── /usage
├── /company (CompanyPage) - OWNER+
│   ├── /settings
│   ├── /branding
│   ├── /integrations
│   └── /security
├── /analytics (AnalyticsPage) - OWNER+
│   ├── /overview
│   ├── /reports
│   ├── /insights
│   └── /export
├── /super-admin (SuperAdminPanel) - SUPER_ADMIN
│   ├── /companies
│   ├── /users
│   ├── /platform
│   └── /system
├── /platform (PlatformPage) - SUPER_ADMIN
│   ├── /settings
│   ├── /monitoring
│   ├── /maintenance
│   └── /updates
├── /testing (TestingRoutes) - Development
│   ├── /dual-configuration
│   ├── /billing
│   ├── /multi-country
│   └── /language
└── /mobile (MobileRoutes) - Responsive
    ├── /dashboard
    ├── /chat
    └── /profile
```

#### **3. ROUTE_PERMISSIONS.md - Matriz de Permisos**
```markdown
# 🔐 Matriz de Permisos por Ruta

## 📊 Leyenda
- ✅ **READ**: Puede ver la página
- ✏️ **WRITE**: Puede modificar datos
- 🗑️ **DELETE**: Puede eliminar datos
- ⚙️ **ADMIN**: Acceso administrativo completo
- ❌ **DENIED**: Acceso denegado

## 🏠 Rutas Públicas
| Ruta | READ | WRITE | DELETE | ADMIN |
|------|------|-------|--------|-------|
| `/` | ✅ | ❌ | ❌ | ❌ |
| `/login` | ✅ | ✅ | ❌ | ❌ |
| `/register` | ✅ | ✅ | ❌ | ❌ |

## 🔐 Rutas Protegidas

### EMPLOYEE (Nivel 1)
| Ruta | READ | WRITE | DELETE | ADMIN |
|------|------|-------|--------|-------|
| `/dashboard` | ✅ | ❌ | ❌ | ❌ |
| `/profile` | ✅ | ✅ | ❌ | ❌ |
| `/tasks` | ✅ | ✅ | ❌ | ❌ |
| `/notifications` | ✅ | ✅ | ❌ | ❌ |

### MANAGER (Nivel 2)
| Ruta | READ | WRITE | DELETE | ADMIN |
|------|------|-------|--------|-------|
| `/team` | ✅ | ✅ | ❌ | ❌ |
| `/reports` | ✅ | ❌ | ❌ | ❌ |
| `/team/members` | ✅ | ✅ | ❌ | ❌ |
| `/team/roles` | ✅ | ✅ | ❌ | ❌ |

### ADMIN (Nivel 3)
| Ruta | READ | WRITE | DELETE | ADMIN |
|------|------|-------|--------|-------|
| `/admin` | ✅ | ✅ | ✅ | ✅ |
| `/billing` | ✅ | ✅ | ✅ | ✅ |
| `/admin/users` | ✅ | ✅ | ✅ | ✅ |
| `/admin/settings` | ✅ | ✅ | ✅ | ✅ |

### OWNER (Nivel 4)
| Ruta | READ | WRITE | DELETE | ADMIN |
|------|------|-------|--------|-------|
| `/company` | ✅ | ✅ | ✅ | ✅ |
| `/analytics` | ✅ | ✅ | ✅ | ✅ |
| `/company/settings` | ✅ | ✅ | ✅ | ✅ |
| `/company/branding` | ✅ | ✅ | ✅ | ✅ |

### SUPER_ADMIN (Nivel 5)
| Ruta | READ | WRITE | DELETE | ADMIN |
|------|------|-------|--------|-------|
| `/super-admin` | ✅ | ✅ | ✅ | ✅ |
| `/platform` | ✅ | ✅ | ✅ | ✅ |
| `/super-admin/companies` | ✅ | ✅ | ✅ | ✅ |
| `/platform/system` | ✅ | ✅ | ✅ | ✅ |

## 🧪 Rutas de Testing (Development)
| Ruta | READ | WRITE | DELETE | ADMIN |
|------|------|-------|--------|-------|
| `/testing/*` | ✅ | ✅ | ✅ | ✅ |

## 📱 Rutas Móviles
| Ruta | READ | WRITE | DELETE | ADMIN |
|------|------|-------|--------|-------|
| `/mobile/*` | ✅ | ✅ | ❌ | ❌ |
```

#### **4. ROUTE_COMPONENTS.md - Componentes por Ruta**
```markdown
# 🧩 Componentes por Ruta

## 📋 Resumen
- **Total de componentes**: 45
- **Componentes reutilizables**: 23
- **Componentes específicos**: 22
- **Última actualización**: 19 Enero 2025

## 🏠 Páginas Principales

### HomePage (`/`)
```typescript
// src/pages/HomePage.tsx
interface HomePageProps {
  // Props específicas de la página
}

// Componentes utilizados:
// - Header
// - Hero
// - Features
// - Footer
// - LanguageSwitcher
// - CurrencySelector
```

### AuthPage (`/login`, `/register`)
```typescript
// src/pages/Auth.tsx
interface AuthPageProps {
  mode: 'login' | 'register';
}

// Componentes utilizados:
// - OAuthButtons
// - AuthForm
// - PasswordReset
// - EmailVerification
```

### DashboardPage (`/dashboard`)
```typescript
// src/pages/Dashboard.tsx
interface DashboardPageProps {
  // Props específicas del dashboard
}

// Componentes utilizados:
// - DashboardLayout
// - Sidebar
// - Header
// - QuickActions
// - RecentActivity
// - Notifications
```

## 🔐 Páginas Administrativas

### AdminPanel (`/admin`)
```typescript
// src/pages/admin/AdminPanel.tsx
interface AdminPanelProps {
  // Props específicas del admin
}

// Componentes utilizados:
// - AdminLayout
// - UserManagement
// - SystemSettings
// - AuditLog
// - RoleManager
```

### BillingPage (`/billing`)
```typescript
// src/pages/BillingTest.tsx
interface BillingPageProps {
  // Props específicas de billing
}

// Componentes utilizados:
// - BillingLayout
// - InvoiceList
// - PaymentMethods
// - UsageAnalytics
// - PlanSelector
```

## 🧪 Páginas de Testing

### DualConfigurationTest (`/testing/dual-configuration`)
```typescript
// src/pages/testing/DualConfigurationTest.tsx
interface DualConfigurationTestProps {
  // Props específicas del test
}

// Componentes utilizados:
// - Card
// - Button
// - useDualConfiguration
// - useLanguage
// - useCurrency
```

## 📱 Páginas Móviles

### MobileDashboard (`/mobile/dashboard`)
```typescript
// src/pages/mobile/MobileDashboard.tsx
interface MobileDashboardProps {
  // Props específicas móviles
}

// Componentes utilizados:
// - MobileLayout
// - TouchOptimized
// - SwipeGestures
// - OfflineIndicator
```

## 🔄 Componentes Reutilizables

### Layout Components
- `DashboardLayout` - Layout principal del dashboard
- `AdminLayout` - Layout para páginas administrativas
- `MobileLayout` - Layout optimizado para móviles
- `AuthLayout` - Layout para páginas de autenticación

### UI Components
- `Card` - Contenedor de contenido
- `Button` - Botones interactivos
- `Modal` - Ventanas modales
- `Table` - Tablas de datos
- `Form` - Formularios

### Feature Components
- `LanguageSwitcher` - Selector de idioma
- `CurrencySelector` - Selector de moneda
- `NotificationCenter` - Centro de notificaciones
- `UserMenu` - Menú de usuario
```

---

## 🔄 Proceso de Actualización Manual

### **Paso 1: Identificar Cambios**
```bash
# Verificar cambios en rutas
git diff HEAD~1 --name-only | grep -E "\.(tsx|ts)$"

# Verificar cambios en componentes
git diff HEAD~1 --name-only | grep "src/pages\|src/components"
```

### **Paso 2: Actualizar Documentación**
```bash
# 1. Actualizar ROUTE_MAP.md
# Agregar nuevas rutas
# Actualizar rutas modificadas
# Eliminar rutas obsoletas

# 2. Actualizar ROUTE_TREE.md
# Modificar estructura del árbol
# Actualizar jerarquía

# 3. Actualizar ROUTE_PERMISSIONS.md
# Verificar permisos
# Actualizar matriz

# 4. Actualizar ROUTE_COMPONENTS.md
# Agregar nuevos componentes
# Actualizar interfaces
```

### **Paso 3: Validar Coherencia**
```bash
# 1. Verificar que las rutas existen
npm run test:routes

# 2. Verificar que los componentes existen
npm run test:components

# 3. Verificar que los permisos son correctos
npm run test:permissions

# 4. Verificar que la documentación está actualizada
npm run test:documentation
```

### **Paso 4: Commit y Push**
```bash
# Commit con mensaje descriptivo
git add docs/routing/
git commit -m "docs: update routing documentation

- Add new route /admin/analytics
- Update permissions for /billing
- Add component documentation for MobileDashboard
- Update route tree structure"

git push origin develop
```

---

## 🛠️ Scripts de Validación Básicos

### **Script 1: Validar Rutas Existentes**
```javascript
// scripts/validate-routes.js
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Valida que todas las rutas documentadas existen en el código
 */
function validateRoutes() {
  const routeMap = fs.readFileSync('docs/routing/ROUTE_MAP.md', 'utf8');
  const routes = extractRoutesFromMarkdown(routeMap);
  
  const missingRoutes = [];
  
  routes.forEach(route => {
    if (!routeExistsInCode(route)) {
      missingRoutes.push(route);
    }
  });
  
  if (missingRoutes.length > 0) {
    console.error('❌ Missing routes in code:', missingRoutes);
    process.exit(1);
  }
  
  console.log('✅ All documented routes exist in code');
}

function extractRoutesFromMarkdown(markdown) {
  // Extraer rutas del markdown
  const routeRegex = /\| `([^`]+)` \|/g;
  const routes = [];
  let match;
  
  while ((match = routeRegex.exec(markdown)) !== null) {
    routes.push(match[1]);
  }
  
  return routes;
}

function routeExistsInCode(route) {
  // Verificar si la ruta existe en el código
  const pagesDir = 'src/pages';
  const routePath = route.replace(/^\//, '').replace(/\//g, '/');
  
  return fs.existsSync(path.join(pagesDir, routePath + '.tsx')) ||
         fs.existsSync(path.join(pagesDir, routePath + '/index.tsx'));
}

validateRoutes();
```

### **Script 2: Validar Componentes**
```javascript
// scripts/validate-components.js
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Valida que todos los componentes documentados existen
 */
function validateComponents() {
  const componentDoc = fs.readFileSync('docs/routing/ROUTE_COMPONENTS.md', 'utf8');
  const components = extractComponentsFromMarkdown(componentDoc);
  
  const missingComponents = [];
  
  components.forEach(component => {
    if (!componentExistsInCode(component)) {
      missingComponents.push(component);
    }
  });
  
  if (missingComponents.length > 0) {
    console.error('❌ Missing components in code:', missingComponents);
    process.exit(1);
  }
  
  console.log('✅ All documented components exist in code');
}

function extractComponentsFromMarkdown(markdown) {
  // Extraer componentes del markdown
  const componentRegex = /`([A-Z][a-zA-Z]+)`/g;
  const components = [];
  let match;
  
  while ((match = componentRegex.exec(markdown)) !== null) {
    components.push(match[1]);
  }
  
  return [...new Set(components)]; // Eliminar duplicados
}

function componentExistsInCode(component) {
  // Verificar si el componente existe en el código
  const possiblePaths = [
    `src/components/${component}.tsx`,
    `src/components/${component}/index.tsx`,
    `src/pages/${component}.tsx`,
    `src/pages/${component}/index.tsx`
  ];
  
  return possiblePaths.some(path => fs.existsSync(path));
}

validateComponents();
```

### **Script 3: Validar Permisos**
```javascript
// scripts/validate-permissions.js
#!/usr/bin/env node

const fs = require('fs');

/**
 * Valida que los permisos documentados son coherentes
 */
function validatePermissions() {
  const permissionsDoc = fs.readFileSync('docs/routing/ROUTE_PERMISSIONS.md', 'utf8');
  const permissions = extractPermissionsFromMarkdown(permissionsDoc);
  
  const invalidPermissions = [];
  
  permissions.forEach(permission => {
    if (!isValidPermission(permission)) {
      invalidPermissions.push(permission);
    }
  });
  
  if (invalidPermissions.length > 0) {
    console.error('❌ Invalid permissions:', invalidPermissions);
    process.exit(1);
  }
  
  console.log('✅ All permissions are valid');
}

function extractPermissionsFromMarkdown(markdown) {
  // Extraer permisos del markdown
  const permissionRegex = /\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|/g;
  const permissions = [];
  let match;
  
  while ((match = permissionRegex.exec(markdown)) !== null) {
    permissions.push({
      route: match[1].trim(),
      read: match[2].trim(),
      write: match[3].trim(),
      delete: match[4].trim(),
      admin: match[5].trim()
    });
  }
  
  return permissions;
}

function isValidPermission(permission) {
  const validValues = ['✅', '❌', '✏️', '🗑️', '⚙️'];
  
  return validValues.includes(permission.read) &&
         validValues.includes(permission.write) &&
         validValues.includes(permission.delete) &&
         validValues.includes(permission.admin);
}

validatePermissions();
```

---

## 📊 Métricas de Calidad

### **Métricas de Documentación**
- **Cobertura de rutas**: Objetivo 100%
- **Cobertura de componentes**: Objetivo 100%
- **Cobertura de permisos**: Objetivo 100%
- **Actualización semanal**: Objetivo 100%

### **Métricas de Validación**
- **Rutas válidas**: Objetivo 100%
- **Componentes válidos**: Objetivo 100%
- **Permisos coherentes**: Objetivo 100%
- **Tests pasando**: Objetivo 100%

---

## 🔄 Plan de Evolución

### **Fase 1: Documentación Manual (Semanas 1-2)**
- ✅ Implementar documentación manual completa
- ✅ Establecer proceso de actualización
- ✅ Validar coherencia con dual configuration
- ✅ Crear scripts básicos de validación

### **Fase 2: Automatización Básica (Semanas 3-4)**
- 🔄 Scripts de detección de cambios
- 🔄 Validación automática en CI/CD
- 🔄 Notificaciones de documentación desactualizada
- 🔄 Generación automática de reportes

### **Fase 3: Automatización Avanzada (Semanas 5-6)**
- 🔄 Generación automática de documentación
- 🔄 Integración con herramientas de desarrollo
- 🔄 Dashboard de estado de documentación
- 🔄 Alertas proactivas

---

## 🎯 Criterios de Éxito

### **Éxito de Fase 1**
- ✅ Documentación manual 100% completa
- ✅ Proceso de actualización establecido
- ✅ Validación de coherencia exitosa
- ✅ Scripts básicos funcionando

### **Éxito de Fase 2**
- ✅ Automatización básica implementada
- ✅ CI/CD integrado
- ✅ Notificaciones funcionando
- ✅ Reportes automáticos

### **Éxito de Fase 3**
- ✅ Automatización avanzada implementada
- ✅ Herramientas integradas
- ✅ Dashboard funcionando
- ✅ Alertas proactivas

---

## 📞 Contacto y Soporte

### **Equipo Responsable**
- **Arquitecto de Software**: Responsable de decisiones
- **Tech Lead**: Responsable de implementación
- **Desarrolladores**: Responsables de actualización
- **QA**: Responsable de validación

### **Canal de Comunicación**
- **Slack**: #routing-documentation
- **Email**: routing@VibeThink.co
- **Jira**: Proyecto ROUTING-DOCS

---

**Última actualización**: 19 de Enero 2025  
**Responsable**: Equipo de Arquitectura  
**Estado**: 🔄 **EN IMPLEMENTACIÓN**  
**Próxima revisión**: 20 de Enero 2025 