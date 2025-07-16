# Login App

## Descripción
Módulo de autenticación para AI Pair Platform con soporte multiidioma y roles.

## Componentes

### Login.tsx
Login principal para administradores de plataforma y equipo interno.

### CompanyLogin.tsx
Login específico para clientes empresariales con interfaz adaptada.

## Características
- ✅ Autenticación con Supabase
- ✅ Soporte multiidioma (ES/EN)
- ✅ Sistema de roles (SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE, SUPPORT)
- ✅ Interfaz moderna con Shadcn/UI
- ✅ Modo de prueba con credenciales predefinidas
- ✅ Navegación basada en roles
- ✅ Versión específica para empresas cliente

## Uso
```tsx
import { Login, CompanyLogin } from '@/apps/login';

// Login para administradores de plataforma
<Route path="/login" element={<Login />} />

// Login para clientes empresariales
<Route path="/company/login" element={<CompanyLogin />} />
```

## Credenciales de Prueba

### Administradores de Plataforma
- **SUPER_ADMIN**: superadmin@VibeThink.co / 12345
- **ADMIN**: admin@VibeThink.co / 12345
- **MANAGER**: manager@VibeThink.co / 12345
- **EMPLOYEE**: employee@VibeThink.co / 12345
- **SUPPORT**: support@VibeThink.co / 12345

### Clientes Empresariales
- **ADMIN**: admin@techcorp.com / 12345
- **MANAGER**: manager@techcorp.com / 12345
- **EMPLOYEE**: employee@techcorp.com / 12345
- **SUPPORT**: support@techcorp.com / 12345

## Estructura
```
src/apps/login/
├── Login.tsx          # Login principal
├── CompanyLogin.tsx   # Login para empresas
├── index.ts           # Exportaciones
└── README.md          # Documentación
```

## Dependencias
- `react-i18next` - Internacionalización
- `@/shared/components/ui` - Componentes UI
- `@/integrations/supabase/client` - Cliente Supabase
- `react-router-dom` - Navegación

## Diferencias entre Login y CompanyLogin

### Login.tsx
- Interfaz para administradores de plataforma
- Credenciales @VibeThink.co
- Acceso a superpoderes (SUPER_ADMIN)
- Gestión global de la plataforma

### CompanyLogin.tsx
- Interfaz para clientes empresariales
- Credenciales @company.com
- Roles limitados a la empresa
- Gestión local de la empresa
- Diseño más empresarial y profesional 