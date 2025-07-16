# Convenciones de Nombres - AI Pair Orchestrator Pro

## 📋 Overview

Este documento establece las convenciones de nombres para **TODO** el repositorio AI Pair Orchestrator Pro. Estas reglas son **obligatorias** y deben seguirse en todos los directorios: `src/`, `dev-tools/`, `tests/`, `docs/`, etc.

**Versión**: 1.0  
**Última actualización**: Enero 2025  
**Aplicable a**: Todo el repositorio

---

## 🎯 Principios Generales

### ✅ Reglas Universales
- **Consistencia**: Usar la misma convención en todo el proyecto
- **Legibilidad**: Nombres descriptivos y claros
- **Escalabilidad**: Convenciones que funcionen a medida que crece el proyecto
- **Estándar de industria**: Seguir mejores prácticas establecidas

### 🚫 Prohibido en TODO el repositorio
- Espacios en nombres de archivos
- Caracteres especiales (excepto `-`, `_`, `.`)
- Nombres en idiomas mixtos (español/inglés mezclados)
- Abreviaciones no estándar
- Nombres genéricos (`test.js`, `utils.ts`, `component.tsx`)

---

## 📁 Convenciones por Directorio

### 🚀 `src/` - Código de Producción

#### Archivos TypeScript/JavaScript
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

#### Componentes React
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

#### Hooks Personalizados
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

#### Servicios y Utilidades
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

#### Tipos TypeScript
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

### 🛠️ `dev-tools/` - Herramientas de Desarrollo

#### Scripts
```
✅ kebab-case:
- build-production.sh
- setup-environment.sh
- cleanup-dependencies.sh
- generate-types.js

❌ Evitar:
- buildProduction.sh
- setup_environment.sh
- script.sh
```

#### Configuraciones
```
✅ Descriptivo con propósito:
- jest.config.js
- docker-compose.dev.yml
- webpack.development.js
- eslint.custom.js

❌ Evitar:
- config.js
- docker.yml
- webpack.js
```

#### Templates
```
✅ Descriptivo del template:
- component.template.tsx
- service.template.ts
- test.template.spec.ts
- page.template.tsx

❌ Evitar:
- template.tsx
- default.ts
- base.tsx
```

### 🧪 `tests/` - Testing

#### Archivos de Test
```
✅ Mismo nombre + .test.ts/.spec.ts:
- UserProfile.test.tsx
- authService.spec.ts
- apiClient.integration.test.ts
- userUtils.unit.test.ts

❌ Evitar:
- test-user-profile.tsx
- auth_test.ts
- tests.ts
```

#### Fixtures y Mocks
```
✅ Descriptivo del propósito:
- userProfile.fixture.ts
- apiResponse.mock.ts
- authState.mock.ts
- projectData.fixture.json

❌ Evitar:
- fixture.ts
- mock.ts
- data.json
```

#### Configuraciones de Testing
```
✅ Específico del framework:
- jest.config.js
- playwright.config.ts
- vitest.config.ts
- cypress.config.js

❌ Evitar:
- test-config.js
- config.js
- setup.js
```

### 📚 `docs/` - Documentación

#### Archivos Markdown
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

❌ Evitar:
- readme.md
- ApiReference.md
- deployment_guide.md
```

#### Imágenes y Assets
```
✅ kebab-case descriptivo:
- architecture-diagram.png
- user-flow-dashboard.jpg
- logo-light-theme.svg
- icon-notification.png

❌ Evitar:
- image1.png
- diagram.jpg
- logo.svg
```

---

## 🎨 Convenciones Específicas

### Variables y Funciones en Código

#### JavaScript/TypeScript
```typescript
// ✅ Correcto
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

function get_user_profile(user_id: string): UserProfile {
  // ...
}
```

#### Constantes
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

#### Interfaces y Types
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

#### Clases CSS
```css
/* ✅ kebab-case */
.user-dashboard {
  /* ... */
}

.navigation-bar {
  /* ... */
}

.auth-button--primary {
  /* ... */
}

.project-card__title {
  /* ... */
}

/* ❌ Evitar */
.userDashboard { /* ... */ }
.navigation_bar { /* ... */ }
.AuthButton { /* ... */ }
```

#### Variables CSS
```css
/* ✅ kebab-case con prefijos descriptivos */
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --spacing-small: 8px;
  --spacing-medium: 16px;
  --font-size-heading: 2rem;
  --border-radius-default: 4px;
}

/* ❌ Evitar */
:root {
  --primary: #007bff;
  --spacing: 16px;
  --fontSize: 2rem;
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

❌ Evitar:
src/
├── Components/  (PascalCase en directorios)
├── Auth/        (Sin agrupación lógica)
├── utils.ts     (Archivo genérico en root)
└── types.ts     (Todo en un archivo)
```

---

## 🔧 Herramientas y Configuración

### Archivos de Configuración
```
✅ Nombres estándar:
- .gitignore
- .editorconfig
- .env.example
- .env.local
- package.json
- tsconfig.json
- tailwind.config.js
- vite.config.ts

❌ Evitar:
- gitignore (sin punto)
- config.js (genérico)
- env (sin extensión)
```

### Scripts en package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:production": "vite build --mode production",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "type-check": "tsc --noEmit"
  }
}
```

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

### Problemas Frecuentes
| ❌ Problema | ✅ Solución |
|-------------|-------------|
| `utils.ts` | `dateUtils.ts`, `validationUtils.ts` |
| `types.ts` | `UserTypes.ts`, `ApiTypes.ts` |
| `component.tsx` | `UserProfile.tsx`, `ProjectCard.tsx` |
| `test.js` | `UserProfile.test.tsx` |
| `config.js` | `jest.config.js`, `webpack.config.js` |
| `data.json` | `userProfile.fixture.json` |

### Script de Verificación
```bash
#!/bin/bash
# verify-naming.sh - Verificar convenciones de nombres

echo "🔍 Verificando convenciones de nombres..."

# Buscar archivos con nombres genéricos
echo "❌ Archivos con nombres genéricos:"
find . -name "utils.*" -o -name "types.*" -o -name "component.*" -o -name "test.*" -o -name "config.*" | grep -v node_modules

# Buscar archivos con espacios
echo "❌ Archivos con espacios:"
find . -name "* *" | grep -v node_modules

# Buscar componentes que no siguen PascalCase
echo "❌ Componentes que no siguen PascalCase:"
find src/components -name "*.tsx" | grep -E "^[a-z]" | grep -v node_modules

echo "✅ Verificación completada"
```

---

## 📚 Referencias y Recursos

### Estándares Seguidos
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Naming Conventions](https://medium.com/@dheerajsinghnagra/react-component-naming-convention-7089b69a120f)
- [REST API Naming Conventions](https://restfulapi.net/resource-naming/)

### Herramientas Recomendadas
- **ESLint**: Para verificar convenciones en código
- **Prettier**: Para formateo consistente
- **TypeScript**: Para tipado estricto
- **Husky**: Para hooks de pre-commit

---

**📋 Nota**: Este documento es la **única fuente de verdad** para convenciones de nombres. Cualquier cambio debe documentarse aquí y comunicarse al equipo.

**⚠️ Importante**: Estas convenciones son **obligatorias** para mantener la consistencia y calidad del código en todo el repositorio.

---

**Última actualización**: Enero 2025  
**Mantenido por**: Equipo AI Pair (Marcelo + Crisselda)  
**Revisión**: Trimestral
