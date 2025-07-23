# VibeThink Orchestrator - Guía de Desarrollo

## 🚀 **Quick Start**

### **Requisitos Previos**
```bash
Node.js >= 20.0.0
npm >= 10.0.0
Git >= 2.30.0
```

### **Instalación**
```bash
git clone [repository-url]
cd ViveThink-Orchestrator-main
npm install
npm run dev
```

### **Verificación**
- ✅ Servidor en `http://localhost:3000`
- ✅ Sin errores en consola
- ✅ TypeScript compilando
- ✅ Hot reload funcionando

---

## 📁 **Estructura del Proyecto**

### **Organización de Archivos**
```
src/
├── apps/                    # Aplicaciones
│   ├── dashboard/          # Dashboard principal
│   ├── admin/             # Panel admin
│   ├── auth/              # Autenticación
│   └── api/               # API routes
├── shared/                 # Recursos compartidos
│   ├── components/        # Componentes UI
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilidades
│   └── types/            # Tipos TypeScript
├── config/                # Configuraciones
│   ├── database/         # Config DB
│   ├── auth/             # Config auth
│   └── api/              # Config API
└── docs/                 # Documentación
```

### **Convenciones de Naming**
```typescript
// Archivos: kebab-case
user-management.tsx
auth-provider.tsx

// Componentes: PascalCase
UserManagement
AuthProvider

// Hooks: camelCase con 'use'
useAuth
useCompany

// Tipos: PascalCase con sufijo
UserType
CompanyConfig
```

---

## 🎨 **Patrones de Componentes**

### **Componente Base**
```typescript
import React from 'react';

interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
```

### **Hook Personalizado**
```typescript
import { useState, useEffect } from 'react';

export const useCustomHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    // Lógica del hook
  }, [value]);
  
  return { value, setValue };
};
```

---

## 🔐 **Seguridad Multi-tenant**

### **Siempre Filtrar por Company**
```typescript
// ✅ Correcto
const fetchUsers = async (companyId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('company_id', companyId);
  
  if (error) throw error;
  return data;
};

// ❌ Incorrecto
const fetchUsers = async () => {
  const { data } = await supabase.from('users').select('*');
  return data; // Sin filtro de compañía
};
```

### **Verificación de Permisos**
```typescript
// Hook de permisos
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) ?? false;
  };
  
  return { hasPermission };
};
```

---

## 🧪 **Testing**

### **Unit Tests**
```typescript
// __tests__/Component.test.tsx
import { render, screen } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component>Test</Component>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### **Integration Tests**
```typescript
// __tests__/api/users.test.ts
import { fetchUsers } from '../api/users';

describe('Users API', () => {
  it('fetches users for company', async () => {
    const users = await fetchUsers('company-123');
    expect(users).toHaveLength(5);
  });
});
```

---

## 🔧 **Comandos de Desarrollo**

### **Desarrollo**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Type checking
```

### **Testing**
```bash
npm run test         # Unit tests
npm run test:watch   # Tests en watch mode
npm run test:coverage # Coverage report
npm run test:e2e     # E2E tests
```

### **Quality**
```bash
npm run lint:fix     # Auto-fix linting
npm run format       # Format code
npm run security     # Security audit
```

---

## 📝 **Convenciones de Código**

### **TypeScript Strict**
```typescript
// ✅ Tipos explícitos
interface User {
  id: string;
  name: string;
  email: string;
  company_id: string;
}

// ❌ Evitar 'any'
const user: any = getUser(); // Malo
const user: User = getUser(); // Bueno
```

### **React Patterns**
```typescript
// ✅ Functional components
const UserComponent: React.FC<UserProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ✅ Custom hooks
const useUser = (userId: string) => {
  // Lógica del hook
};
```

---

## 🚀 **Deployment**

### **Pre-deployment Checklist**
- ✅ Tests pasando
- ✅ Linting sin errores
- ✅ Type checking sin errores
- ✅ Build exitoso
- ✅ Security audit limpio

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🐛 **Debugging**

### **Herramientas de Debug**
```typescript
// React DevTools
// Redux DevTools (si usas Redux)
// React Query DevTools
// Browser DevTools

// Debug en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### **Error Boundaries**
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Enviar a servicio de monitoreo
  }
}
```

---

## 📚 **Recursos de Aprendizaje**

### **Documentación Oficial**
- [Next.js 15](https://nextjs.org/docs)
- [React 18](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **VThink 1.0 Resources**
- [Metodología VThink](docs/vthink-methodology.md)
- [Patrones Multi-tenant](docs/multi-tenant-patterns.md)
- [Security Guidelines](docs/security-guidelines.md)

---

## 🤝 **Contribución**

### **Git Workflow**
```bash
# Crear feature branch
git checkout -b feature/user-management

# Hacer cambios
git add .
git commit -m "feat: add user management component"

# Push y crear PR
git push origin feature/user-management
```

### **Commit Convention**
```
feat: nueva característica
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

---

**Última actualización:** Julio 2025  
**Responsable:** Equipo de Desarrollo VThink 1.0  
**Estado:** ✅ **ACTIVO** 