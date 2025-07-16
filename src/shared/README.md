# Componentes Compartidos (`shared/`)

## 🎯 **Propósito**

Esta carpeta contiene todos los **componentes, hooks, utilidades y servicios compartidos** que pueden ser utilizados por múltiples aplicaciones del monorepo.

## 📁 **Estructura**

```
shared/
├── components/         # Componentes reutilizables
│   ├── ui/            # Shadcn/ui base components
│   ├── ai-chat/       # Módulo transversal de chat IA
│   ├── universal-assistant/ # Asistente universal
│   ├── workflow-engine/     # Motor de workflows con React Flow
│   └── themes/        # Temas y variantes de Shadcn
├── hooks/             # Custom hooks
├── utils/             # Funciones utilitarias
├── types/             # Definiciones de tipos
├── services/          # Servicios compartidos
└── constants/         # Constantes globales
```

## 🎨 **Componentes UI (`components/ui/`)**

### **Shadcn/ui Base Components:**
```
ui/
├── button/            # Botones con variantes
├── card/              # Cards y layouts
├── dialog/            # Modales y overlays
├── form/              # Formularios con react-hook-form
├── input/             # Inputs, textarea, select
├── table/             # Tablas con TanStack Table
├── navigation/        # Navbar, sidebar, breadcrumbs
├── feedback/          # Alerts, toasts, progress, skeleton
├── layout/            # Container, grid, flex
├── data-display/      # Charts, badges, avatars, icons
└── advanced/          # Date picker, file upload, rich text
```

### **Características:**
- **Accesibilidad**: WCAG 2.1 AA compliance
- **Temas dinámicos**: Light/dark/custom themes
- **Variantes flexibles**: Sizes, variants, colors
- **TypeScript completo**: Tipado estricto
- **Performance optimizado**: Memoización y lazy loading

## 🤖 **Módulos Transversales**

### **AI Chat (`components/ai-chat/`)**
- **Propósito**: Chat IA integrado en todas las apps
- **Implementación**: 
  - Hook: `useAiChat()`
  - Componente: `<AiChat />`
- **Características**:
  - Integración con OpenAI
  - Contexto por aplicación
  - Historial de conversaciones
  - Personalización por usuario

### **Universal Assistant (`components/universal-assistant/`)**
- **Propósito**: Asistente personal por empleado
- **Implementación**:
  - Hook: `useAssistantProfile()`
  - Componente: `<UniversalAssistant />`
- **Características**:
  - Adaptable al perfil del usuario
  - Integración con herramientas existentes
  - Coordinación entre assistants
  - Adopción progresiva

### **Workflow Engine (`components/workflow-engine/`)**
- **Propósito**: Motor de workflows con React Flow + Kestra
- **Implementación**:
  - Editor visual: `<WorkflowCanvas />`
  - Nodos: `<WorkflowNodes />`
  - Toolbar: `<WorkflowToolbar />`
  - Sidebar: `<WorkflowSidebar />`
- **Características**:
  - Editor drag & drop
  - Nodos personalizados
  - Validación en tiempo real
  - Templates predefinidos

## 🎨 **Temas (`components/themes/`)**

### **Estructura de Temas:**
```
themes/
├── light/             # Tema claro corporativo
├── dark/              # Tema oscuro moderno
├── corporate/         # Tema empresarial profesional
├── modern/            # Tema moderno minimalista
└── custom/            # Temas personalizados por empresa
```

### **Características:**
- **Temas dinámicos**: Cambio en tiempo real
- **Personalización por empresa**: Brand-specific themes
- **Modo oscuro/claro**: Toggle automático
- **CSS Variables**: Configuración flexible

## 🔧 **Hooks (`hooks/`)**

### **Hooks Principales:**
- **`useAuth()`**: Autenticación y autorización
- **`useCompany()`**: Contexto de empresa
- **`usePermissions()`**: Validación de permisos
- **`useTheme()`**: Gestión de temas
- **`useApi()`**: Cliente API unificado
- **`useLocalStorage()`**: Persistencia local
- **`useDebounce()`**: Debounce para inputs
- **`useIntersectionObserver()`**: Lazy loading

### **Patrón de Uso:**
```typescript
// ✅ Uso correcto de hooks
const { user, login, logout } = useAuth();
const { company } = useCompany();
const { hasPermission } = usePermissions();
const { theme, setTheme } = useTheme();
```

## 🛠️ **Utilidades (`utils/`)**

### **Categorías:**
- **`validation/`**: Validación de datos
- **`formatting/`**: Formateo de datos
- **`crypto/`**: Encriptación y hashing
- **`date/`**: Manipulación de fechas
- **`string/`**: Manipulación de strings
- **`array/`**: Manipulación de arrays
- **`object/`**: Manipulación de objetos

### **Ejemplos:**
```typescript
// ✅ Utilidades comunes
import { validateEmail } from '@/shared/utils/validation';
import { formatCurrency } from '@/shared/utils/formatting';
import { encryptData } from '@/shared/utils/crypto';
import { formatDate } from '@/shared/utils/date';
```

## 📝 **Tipos (`types/`)**

### **Tipos Principales:**
- **`auth.ts`**: Tipos de autenticación
- **`user.ts`**: Tipos de usuario
- **`company.ts`**: Tipos de empresa
- **`api.ts`**: Tipos de API
- **`ui.ts`**: Tipos de componentes UI
- **`workflow.ts`**: Tipos de workflows

### **Patrón de Uso:**
```typescript
// ✅ Tipos compartidos
import type { User, Company, ApiResponse } from '@/shared/types';
import type { ButtonProps, CardProps } from '@/shared/types/ui';
```

## 🔌 **Servicios (`services/`)**

### **Servicios Principales:**
- **`api.ts`**: Cliente API unificado
- **`auth.ts`**: Servicio de autenticación
- **`storage.ts`**: Servicio de almacenamiento
- **`analytics.ts`**: Servicio de analíticas
- **`notifications.ts`**: Servicio de notificaciones
- **`logger.ts`**: Servicio de logging

### **Patrón de Uso:**
```typescript
// ✅ Servicios compartidos
import { apiClient } from '@/shared/services/api';
import { authService } from '@/shared/services/auth';
import { storageService } from '@/shared/services/storage';
```

## 📊 **Constantes (`constants/`)**

### **Categorías:**
- **`roles.ts`**: Roles y permisos
- **`routes.ts`**: Rutas de la aplicación
- **`api.ts`**: Endpoints de API
- **`ui.ts`**: Constantes de UI
- **`validation.ts`**: Reglas de validación
- **`config.ts`**: Configuración global

### **Ejemplos:**
```typescript
// ✅ Constantes compartidas
import { ROLES, PERMISSIONS } from '@/shared/constants/roles';
import { API_ENDPOINTS } from '@/shared/constants/api';
import { UI_CONSTANTS } from '@/shared/constants/ui';
```

## 🧪 **Testing Strategy**

### **Componentes:**
- Unit tests para cada componente
- Integration tests para flujos
- Visual regression tests
- Accessibility tests

### **Hooks:**
- Unit tests para hooks
- Integration tests con componentes
- Error boundary tests

### **Utilidades:**
- Unit tests para funciones
- Edge case testing
- Performance testing

## 📊 **Métricas de Calidad**

### **Componentes:**
- **Reutilización**: >80% de componentes reutilizados
- **Performance**: <100ms render time
- **Accessibility**: 100% WCAG 2.1 AA
- **Testing**: >95% coverage

### **Hooks:**
- **Performance**: Memoización optimizada
- **Testing**: >90% coverage
- **Error handling**: 100% error boundaries

---

**Los componentes compartidos siguen los principios de VThink 1.0, asegurando reutilización, performance y mantenibilidad.** 