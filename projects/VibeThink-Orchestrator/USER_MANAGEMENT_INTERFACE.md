# Interfaz de Gestión de Usuarios

## 🎯 Descripción General

La interfaz de gestión de usuarios es una solución completa y moderna para administrar usuarios, roles y permisos en el sistema AI Pair Orchestrator Pro. Está construida con React + TypeScript + Supabase, siguiendo las mejores prácticas de desarrollo y diseño.

## 🏗️ Arquitectura

### Componentes Principales

```
src/
├── components/admin/
│   ├── UserManagement.tsx          # Componente principal de gestión
│   ├── UserManagementSidebar.tsx   # Sidebar con interacciones y IA
│   └── UserManagementPanel.tsx     # Panel administrativo avanzado
├── hooks/
│   ├── useUsers.ts                 # Hook para operaciones CRUD
│   └── useRecentInteractions.ts    # Hook para interacciones recientes
├── types/
│   └── users.ts                    # Definiciones de tipos
└── pages/admin/
    └── UsersPage.tsx               # Página principal
```

### Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'EMPLOYEE',
  department VARCHAR(255),
  status user_status NOT NULL DEFAULT 'active',
  last_activity TIMESTAMP WITH TIME ZONE,
  monthly_usage INTEGER DEFAULT 0,
  avatar_url TEXT,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de interacciones
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type interaction_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Características de la Interfaz

### 1. Panel Principal de Usuarios

#### Funcionalidades:
- **Lista de usuarios** con información detallada
- **Filtros avanzados** por rol, estado, departamento
- **Búsqueda en tiempo real** por nombre, email o departamento
- **Estadísticas en tiempo real** (total, activos, suspendidos, admins)
- **Acciones rápidas** (editar, suspender, eliminar)

#### Componentes UI:
- Tabla responsiva con shadcn/ui
- Badges para roles y estados
- Avatares con fallbacks
- Barras de progreso para uso mensual
- Menús desplegables para acciones

### 2. Sidebar de Interacciones

#### Funcionalidades:
- **Interacciones recientes** con usuarios
- **Configuración de IA** (creatividad, sugerencias automáticas)
- **Sugerencias rápidas** categorizadas
- **Estadísticas de uso** en tiempo real

#### Componentes UI:
- Cards organizadas por sección
- Sliders para configuración
- Switches para opciones
- Badges para métricas
- Iconos contextuales

### 3. Sistema de Roles

#### Roles Disponibles:
- **SUPER_ADMIN**: Acceso completo a la plataforma
- **ADMIN**: Administración de empresa
- **MANAGER**: Gestión de equipos
- **EMPLOYEE**: Usuario estándar
- **OWNER**: Propietario de empresa

#### Estados de Usuario:
- **active**: Usuario activo
- **suspended**: Usuario suspendido
- **inactive**: Usuario inactivo

## 🔧 Configuración y Uso

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd ai-pair-orchestrator-pro-main
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Ejecutar migraciones**
```bash
npx supabase db push
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

### Acceso a la Interfaz

1. **Navegar a la página**
```
http://localhost:8080/admin/users
```

2. **Autenticación requerida**
- Usuario debe estar autenticado
- Rol mínimo: ADMIN
- Permisos de empresa verificados

## 🎯 Funcionalidades Principales

### Gestión de Usuarios

#### Crear Usuario
```typescript
const { createUser } = useUsers();

await createUser.mutateAsync({
  name: 'Juan Pérez',
  email: 'juan.perez@empresa.com',
  role: 'EMPLOYEE',
  department: 'Desarrollo',
  status: 'active'
});
```

#### Actualizar Usuario
```typescript
const { updateUser } = useUsers();

await updateUser.mutateAsync({
  id: 'user-id',
  role: 'MANAGER',
  department: 'Ventas'
});
```

#### Suspender/Activar Usuario
```typescript
const { suspendUser, activateUser } = useUsers();

// Suspender
await suspendUser.mutateAsync('user-id');

// Activar
await activateUser.mutateAsync('user-id');
```

### Filtros y Búsqueda

```typescript
const { users } = useUsers({
  searchTerm: 'juan',
  roleFilter: 'EMPLOYEE',
  statusFilter: 'active',
  departmentId: 'dev-department'
});
```

### Interacciones Recientes

```typescript
const { interactions } = useRecentInteractions();

// Datos de ejemplo
[
  {
    id: '1',
    type: 'CRM',
    title: 'Cliente creado: Innovación Tech',
    description: 'Nuevo cliente registrado',
    timestamp: '2 min',
    user: 'María García'
  }
]
```

## 🎨 Personalización

### Temas y Colores

La interfaz utiliza el sistema de temas de shadcn/ui con soporte para modo claro y oscuro:

```css
/* Variables CSS personalizables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... más variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... variables para modo oscuro */
}
```

### Componentes Personalizables

#### Badges de Rol
```typescript
const getRoleBadge = (role: UserRole) => {
  const styles = {
    'SUPER_ADMIN': 'bg-purple-100 text-purple-800',
    'ADMIN': 'bg-red-100 text-red-800',
    'MANAGER': 'bg-yellow-100 text-yellow-800',
    'EMPLOYEE': 'bg-green-100 text-green-800',
    'OWNER': 'bg-blue-100 text-blue-800'
  };
  return styles[role] || styles.EMPLOYEE;
};
```

#### Iconos de Interacción
```typescript
const getInteractionIcon = (type: string) => {
  switch (type) {
    case 'CRM': return <Building className="h-4 w-4" />;
    case 'Email': return <MessageSquare className="h-4 w-4" />;
    case 'Calendar': return <Calendar className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};
```

## 🔒 Seguridad

### Row Level Security (RLS)

```sql
-- Política para usuarios de la misma empresa
CREATE POLICY "Users can view their own company's users"
  ON users FOR SELECT
  USING (company_id = auth.jwt() -> 'company_id'::text::uuid);

-- Política para administradores
CREATE POLICY "Admins can manage users in their company"
  ON users FOR ALL
  USING (
    company_id = auth.jwt() -> 'company_id'::text::uuid
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'OWNER')
    )
  );
```

### Verificación de Permisos

```typescript
// En el componente
const { user, hasPermission } = useAuth();

if (!hasPermission('ADMIN')) {
  return <Navigate to="/dashboard" replace />;
}
```

## 📊 Monitoreo y Analytics

### Métricas Disponibles

- **Total de usuarios** por empresa
- **Usuarios activos** vs suspendidos
- **Distribución por roles**
- **Uso mensual** de recursos
- **Interacciones recientes**
- **Tiempo promedio** de actividad

### Integración con Analytics

```typescript
// Tracking de acciones
const trackUserAction = async (action: string, userId: string) => {
  await supabase.functions.invoke('track-usage', {
    body: {
      company_id: user.company.id,
      user_id: userId,
      service_name: 'user_management',
      usage_type: action,
      amount: 1
    }
  });
};
```

## 🚀 Optimizaciones

### Performance

- **React Query** para cache y sincronización
- **Lazy loading** de componentes
- **Virtualización** para listas grandes
- **Debounced search** para búsquedas

### UX/UI

- **Loading states** para todas las operaciones
- **Error boundaries** para manejo de errores
- **Toast notifications** para feedback
- **Responsive design** para móviles
- **Keyboard navigation** completa

## 🧪 Testing

### Componentes de Prueba

```typescript
// Test de creación de usuario
test('should create user successfully', async () => {
  const { createUser } = renderHook(() => useUsers());
  
  await act(async () => {
    await createUser.mutateAsync({
      name: 'Test User',
      email: 'test@example.com',
      role: 'EMPLOYEE'
    });
  });
  
  expect(createUser.isSuccess).toBe(true);
});
```

### Datos de Prueba

```typescript
// Mock data para desarrollo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@empresa.com',
    role: 'ADMIN',
    department: 'Administración',
    status: 'active',
    last_activity: '2024-01-15T10:30:00Z',
    monthly_usage: 75,
    company_id: 'company-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  }
  // ... más usuarios
];
```

## 🔄 Roadmap

### Próximas Funcionalidades

- [ ] **Bulk actions** para operaciones masivas
- [ ] **Import/Export** de usuarios
- [ ] **Audit log** completo de cambios
- [ ] **Workflow approvals** para cambios críticos
- [ ] **Advanced analytics** con gráficos
- [ ] **API endpoints** para integraciones
- [ ] **Mobile app** nativa
- [ ] **Real-time notifications** con WebSockets

### Mejoras Técnicas

- [ ] **Micro-frontends** para escalabilidad
- [ ] **Service workers** para offline
- [ ] **Progressive Web App** (PWA)
- [ ] **Internationalization** (i18n)
- [ ] **Accessibility** mejorada (WCAG 2.1)
- [ ] **Performance monitoring** con Sentry

## 📞 Soporte

### Recursos

- **Documentación API**: `/docs/API.md`
- **Guía de desarrollo**: `/docs/DEVELOPMENT.md`
- **Ejemplos de código**: `/examples/`
- **Componentes UI**: `/src/components/ui/`

### Contacto

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@VibeThink.com

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2024  
**Compatibilidad**: React 18+, TypeScript 5+, Supabase 2.26+ 