# 📚 Terminología y Nombres Clave de la Aplicación

**Última actualización**: 2025-01-XX  
**Estado**: ⚠️ FUENTE ÚNICA DE VERDAD - NUNCA DUPLICAR

---

## 🎯 Propósito

Este documento es la **fuente única de verdad** para todos los nombres clave, términos, convenciones de nomenclatura y conceptos utilizados en VibeThink Orchestrator.

**Regla Fundamental:** Si un término o nombre clave está definido aquí, DEBE usarse exactamente como está documentado en todo el proyecto.

**⚠️ IMPORTANTE:** Este documento consolida información de múltiples fuentes. No crear documentos duplicados sobre naming o terminología.

---

## 📋 Nombres Clave de Dashboards

### Dashboards Principales

| Nombre | Ruta | Propósito | Estado |
|--------|------|-----------|--------|
| **`dashboard`** | `/dashboard` | Producción final con integración BD | ⭐ Meta final |
| **`dashboard-bundui`** | `/dashboard-bundui` | Referencia/Inspiración (externo) | ✅ Congelado |
| **`dashboard-vibethink`** | `/dashboard-vibethink` | Mockup/Sandbox de pruebas | ✅ Activo |

### Convenciones de Nombres de Dashboards

- **Rutas de dashboards**: SIEMPRE usar prefijos completos:
  - ✅ `/dashboard-bundui/*`
  - ✅ `/dashboard-vibethink/*`
  - ✅ `/dashboard/*`
  - ❌ NUNCA `/bundui/*` o `/vibethink/*` (sin prefijo)

- **Referencias en código**: Usar nombres exactos:
  - `AppSidebar` (para bundui)
  - `VibeThinkSidebar` (para vibethink)
  - `SiteHeader` (para bundui)
  - `VibeThinkHeader` (para vibethink)

---

## 📁 Convenciones de Nomenclatura de Archivos

### Principios Generales

- ✅ **Consistencia**: Usar la misma convención en todo el proyecto
- ✅ **Legibilidad**: Nombres descriptivos y claros
- ✅ **Escalabilidad**: Convenciones que funcionen a medida que crece el proyecto
- ✅ **Estándar de industria**: Seguir mejores prácticas establecidas

### 🚫 Prohibido en TODO el repositorio

- Espacios en nombres de archivos
- Caracteres especiales (excepto `-`, `_`, `.`)
- Nombres en idiomas mixtos (español/inglés mezclados)
- Abreviaciones no estándar
- Nombres genéricos (`test.js`, `utils.ts`, `component.tsx`)

### Archivos TypeScript/JavaScript

```
✅ Correcto:
- UserProfile.tsx
- userService.ts
- apiClient.ts
- authUtils.ts
- userTypes.ts

❌ Incorrecto:
- userprofile.tsx
- User_Profile.tsx
- user-profile.tsx
- utils.ts
- types.ts
```

### Componentes React

```
✅ PascalCase para componentes:
- UserDashboard.tsx
- ProjectCard.tsx
- NavigationBar.tsx
- AuthButton.tsx

❌ Evitar:
- userDashboard.tsx
- project-card.tsx
- navigation_bar.tsx
```

### Hooks Personalizados

```
✅ camelCase con prefijo 'use':
- useAuthState.ts
- useProjectData.ts
- useLocalStorage.ts
- useCookies.ts

❌ Evitar:
- AuthState.ts
- use-auth-state.ts
- useauth.ts
```

### Servicios y Utilidades

```
✅ camelCase:
- authService.ts
- apiClient.ts
- dateUtils.ts
- validationHelpers.ts

❌ Evitar:
- AuthService.ts
- api-client.ts
- utils.ts
```

### Tipos TypeScript

```
✅ PascalCase para interfaces/types:
- UserProfile.ts
- ApiResponse.ts
- AuthState.ts
- ProjectData.ts

❌ Evitar:
- userProfile.ts
- types.ts
- interfaces.ts
```

### Scripts y Configuraciones

```
✅ kebab-case:
- build-production.sh
- setup-environment.sh
- cleanup-dependencies.sh
- generate-types.js

✅ Descriptivo con propósito:
- jest.config.js
- docker-compose.dev.yml
- webpack.development.js
- eslint.custom.js
```

### Archivos de Documentación

```
✅ UPPER_CASE para archivos principales:
- README.md
- SECURITY.md
- NAMING_CONVENTIONS.md
- CONTRIBUTING.md
- CHANGELOG.md

✅ kebab-case para documentación específica:
- api-reference.md
- deployment-guide.md
- architecture-overview.md
- user-manual.md
```

### Archivos de Test

```
✅ Mismo nombre + .test.ts/.spec.ts:
- UserProfile.test.tsx
- authService.spec.ts
- apiClient.integration.test.ts
- userUtils.unit.test.ts

✅ Fixtures y Mocks:
- userProfile.fixture.ts
- apiResponse.mock.ts
- authState.mock.ts
- projectData.fixture.json
```

---

## 💻 Convenciones de Código

### Variables y Funciones

```typescript
// ✅ Correcto - camelCase
const userName = 'john_doe';
const apiBaseUrl = 'https://api.example.com';
const isUserAuthenticated = true;

function getUserProfile(userId: string): UserProfile {
  // ...
}

const handleUserLogin = async (credentials: LoginCredentials) => {
  // ...
};

// ❌ Incorrecto
const user_name = 'john_doe';
const APIBaseURL = 'https://api.example.com';
const IsUserAuthenticated = true;
```

### Constantes

```typescript
// ✅ UPPER_SNAKE_CASE para constantes
const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
  PROJECTS: '/api/projects'
};

const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

// ❌ Evitar
const apiEndpoints = { /* ... */ };
const maxRetryAttempts = 3;
```

### Interfaces y Types

```typescript
// ✅ PascalCase
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// ❌ Evitar
interface userProfile { /* ... */ }
type apiResponse<T> = { /* ... */ };
```

### CSS y Estilos

```css
/* ✅ kebab-case para clases */
.user-dashboard {
  /* ... */
}

.navigation-bar {
  /* ... */
}

.auth-button--primary {
  /* ... */
}

/* ✅ kebab-case con prefijos descriptivos para variables */
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --spacing-small: 8px;
  --spacing-medium: 16px;
  --font-size-heading: 2rem;
  --border-radius-default: 4px;
}
```

---

## 🗂️ Estructura de Directorios

### Organización Jerárquica

```
✅ Correcto:
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthButton.tsx
│   ├── dashboard/
│   │   ├── UserDashboard.tsx
│   │   ├── ProjectCard.tsx
│   │   └── StatsWidget.tsx
│   └── shared/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── LoadingSpinner.tsx
├── services/
│   ├── authService.ts
│   ├── projectService.ts
│   └── apiClient.ts
├── utils/
│   ├── dateUtils.ts
│   ├── validationUtils.ts
│   └── formatUtils.ts
└── types/
    ├── AuthTypes.ts
    ├── ProjectTypes.ts
    └── ApiTypes.ts
```

### Convenciones de Directorios

- **kebab-case** para nombres de directorios
- **Agrupación lógica** por funcionalidad
- **Evitar** nombres genéricos como `misc`, `other`, `temp`

---

## 📊 Bases de Datos y APIs

### Tablas de Base de Datos

```sql
-- ✅ snake_case
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ❌ Evitar
CREATE TABLE UserProfiles ( ... );
CREATE TABLE userprofiles ( ... );
```

### Endpoints de API

```
✅ kebab-case y RESTful:
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
GET    /api/users/{id}/projects
POST   /api/auth/login
POST   /api/auth/logout

❌ Evitar:
/api/getUsers
/api/user_profile
/api/UserLogin
```

---

## 🌍 Internacionalización (i18n)

### Locales Soportados

| Código | Nombre | Estado |
|--------|--------|--------|
| `en` | English | ✅ Activo |
| `es` | Español | ✅ Activo |

### Namespaces de Traducción

- `common` - Términos comunes
- `navigation` - Navegación
- `crm` - Módulo CRM
- `errors` - Mensajes de error
- `validation` - Validación de formularios
- `sales` - Módulo de ventas
- `ecommerce` - E-commerce

### Convenciones de Claves de Traducción

```
✅ kebab-case con namespace:
- common.welcome
- navigation.dashboard
- crm.contacts
- errors.not-found
- validation.required

❌ Evitar:
- common_welcome
- navigationDashboard
- CRMContacts
```

---

## 📦 Módulos y Componentes

### Módulos Principales

*(Agregar módulos principales aquí cuando se definan)*

### Componentes Compartidos

*(Agregar componentes compartidos aquí cuando se definan)*

---

## 🔧 Servicios y APIs

### Servicios Internos

*(Agregar servicios internos aquí cuando se definan)*

### APIs Externas

*(Agregar APIs externas aquí cuando se definan)*

---

## 🔐 Autenticación y Seguridad

### Roles y Permisos

*(Agregar roles y permisos aquí cuando se definan)*

### Tokens y Sesiones

*(Agregar términos de autenticación aquí cuando se definan)*

---

## 💾 Base de Datos

### Tablas Principales

*(Agregar tablas principales aquí cuando se definan)*

### Convenciones de Nombres de BD

- **snake_case** para nombres de tablas y columnas
- **Prefijos** cuando sea necesario (ej: `vtk_users`, `vtk_projects`)
- **Nombres descriptivos** y claros

---

## 🎨 UI/UX

### Componentes de UI

*(Agregar componentes UI clave aquí cuando se definan)*

### Temas y Estilos

*(Agregar temas y estilos aquí cuando se definan)*

---

## 📊 Estado y Gestión de Datos

### Stores y Contextos

*(Agregar stores y contextos aquí cuando se definan)*

### Hooks Personalizados

*(Agregar hooks clave aquí cuando se definan)*

---

## 🚀 Deployment y Operaciones

### Ambientes

| Nombre | Descripción | Estado |
|--------|-------------|--------|
| `development` | Desarrollo local | ✅ Activo |
| `staging` | Pre-producción | ⚠️ Pendiente |
| `production` | Producción | ⚠️ Pendiente |

### Servicios y Puertos

*(Ver `docs/operations/PORT_CONVENTIONS.md` para detalles de puertos)*

---

## 📝 Convenciones de Commits

### Formato Conventional Commits

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Tipos de Commits

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bugs
- **docs**: Cambios en documentación
- **style**: Cambios de formato (no afectan funcionalidad)
- **refactor**: Refactorización de código
- **test**: Agregar o modificar tests
- **chore**: Cambios en build, configuraciones, etc.

### Ejemplos

```bash
feat(auth): add JWT authentication system
fix(api): resolve CORS issue in user endpoints
docs(readme): update installation instructions
refactor(components): extract reusable Button component
```

---

## ✅ Checklist de Verificación

### Antes de crear un archivo:
- [ ] ¿El nombre describe claramente su propósito?
- [ ] ¿Sigue la convención del directorio correspondiente?
- [ ] ¿Es consistente con archivos similares?
- [ ] ¿Evita nombres genéricos?
- [ ] ¿No contiene espacios ni caracteres especiales prohibidos?

### Antes de hacer commit:
- [ ] Verificar que todos los archivos nuevos siguen las convenciones
- [ ] Revisar que los imports/referencias funcionan correctamente
- [ ] Confirmar que no hay archivos con nombres genéricos
- [ ] Validar que la estructura de directorios es lógica

---

## 🚨 Violaciones Comunes y Correcciones

| ❌ Problema | ✅ Solución |
|-------------|-------------|
| `utils.ts` | `dateUtils.ts`, `validationUtils.ts` |
| `types.ts` | `UserTypes.ts`, `ApiTypes.ts` |
| `component.tsx` | `UserProfile.tsx`, `ProjectCard.tsx` |
| `test.js` | `UserProfile.test.tsx` |
| `config.js` | `jest.config.js`, `webpack.config.js` |
| `data.json` | `userProfile.fixture.json` |

---

## 🔗 Referencias Cruzadas

### Documentos Relacionados

- `AGENTS.md` - Reglas del proyecto
- `docs/architecture/DASHBOARD_ARCHITECTURE.md` - Arquitectura de dashboards
- `docs/architecture/I18N_STRATEGY.md` - Estrategia i18n
- `docs/operations/PORT_CONVENTIONS.md` - Convenciones de puertos

### Documentos Consolidados (No usar directamente)

⚠️ **Los siguientes documentos han sido consolidados en este documento:**
- `docusaurus-dev/docs/common/NAMING_CONVENTIONS.md` - ✅ Consolidado aquí
- `docs/projects/VibeThink-Orchestrator/.../TECHNICAL_STACK_AND_NAMING_CONVENTIONS.md` - ✅ Consolidado aquí
- `docs/projects/VibeThink-Orchestrator/CONVENTIONS_README.md` - ✅ Consolidado aquí
- `docusaurus-dev/docs/common/CONVENTIONS.md` - ✅ Consolidado aquí

**No crear nuevos documentos sobre naming o terminología. Usar este documento como fuente única.**

---

## 📌 Notas Importantes

1. **Este documento es la fuente única de verdad** - No crear glosarios duplicados
2. **Actualizar este documento** cuando se agreguen nuevos términos
3. **Consultar este documento** antes de crear nuevos nombres o términos
4. **Mantener consistencia** - Usar exactamente los nombres documentados
5. **Consolidación completa** - Toda la información de naming está aquí

---

**Última actualización**: 2025-01-XX  
**Mantenido por**: Equipo de Desarrollo VibeThink  
**Versión**: 1.0.0  
**Revisión**: Trimestral
