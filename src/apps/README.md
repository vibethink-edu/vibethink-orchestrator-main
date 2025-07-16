# Aplicaciones (`apps/`)

## 🎯 **Propósito**

Esta carpeta contiene las **aplicaciones independientes** del monorepo VibeThink Orchestrator. Cada aplicación es un frontend completo que puede funcionar de manera independiente.

## 📁 **Estructura**

```
apps/
├── admin/              # Panel de administración (ADMIN/OWNER)
├── super-admin/        # Panel de super administración (SUPER_ADMIN)
├── dashboard/          # Dashboard principal (usuarios finales)
├── dev-dashboard/      # Dashboard de desarrollo (herramientas)
├── helpdesk/           # Sistema de soporte
├── crm/                # Sistema de CRM
├── compliance/         # Sistema de cumplimiento
└── login/              # Aplicación de autenticación
```

## 🔐 **Jerarquía de Roles**

```
SUPER_ADMIN > OWNER > ADMIN > MANAGER > EMPLOYEE
```

### **Diferenciación por Roles:**

#### **`admin/` - Panel de Administración**
- **Audiencia**: ADMIN y OWNER roles
- **Propósito**: Gestión de empresa y usuarios
- **Funcionalidades**: 
  - Gestión de usuarios
  - Configuración de empresa
  - Reportes empresariales
  - Workflow management

#### **`super-admin/` - Panel de Super Administración**
- **Audiencia**: SUPER_ADMIN role
- **Propósito**: Gestión cross-company y sistema
- **Funcionalidades**:
  - Gestión de todas las empresas
  - Configuración global del sistema
  - Auditoría cross-company
  - Monitoreo de plataforma

#### **`dashboard/` - Dashboard Principal**
- **Audiencia**: Usuarios finales (EMPLOYEE, MANAGER)
- **Propósito**: Interfaz principal de la aplicación SaaS
- **Funcionalidades**:
  - Gestión de datos personales
  - Reportes individuales
  - Configuración de usuario
  - Acceso a módulos asignados

#### **`dev-dashboard/` - Dashboard de Desarrollo**
- **Audiencia**: Desarrolladores y equipo técnico
- **Propósito**: Herramientas de desarrollo y debugging
- **Funcionalidades**:
  - Logs del sistema
  - Métricas de rendimiento
  - Testing tools
  - Configuración técnica

#### **`helpdesk/` - Sistema de Soporte**
- **Audiencia**: Equipo de soporte y usuarios
- **Propósito**: Gestión de tickets y soporte
- **Funcionalidades**:
  - Creación de tickets
  - Seguimiento de casos
  - Base de conocimiento
  - Chat de soporte

#### **`crm/` - Sistema de CRM**
- **Audiencia**: Equipo de ventas y marketing
- **Propósito**: Gestión de relaciones con clientes
- **Funcionalidades**:
  - Gestión de leads
  - Pipeline de ventas
  - Seguimiento de oportunidades
  - Reportes de ventas

#### **`compliance/` - Sistema de Cumplimiento**
- **Audiencia**: Equipo de compliance y legal
- **Propósito**: Gestión de cumplimiento normativo
- **Funcionalidades**:
  - Auditorías de cumplimiento
  - Reportes regulatorios
  - Gestión de políticas
  - Monitoreo de riesgos

#### **`login/` - Aplicación de Autenticación**
- **Audiencia**: Todos los usuarios
- **Propósito**: Autenticación y autorización
- **Funcionalidades**:
  - Login/Logout
  - Registro de usuarios
  - Recuperación de contraseña
  - Autenticación multi-factor

## 🔧 **Patrones de Desarrollo**

### **Estructura de Cada App:**
```
app-name/
├── components/          # Componentes específicos de la app
├── pages/              # Páginas de la aplicación
├── hooks/              # Hooks específicos de la app
├── services/           # Servicios específicos de la app
├── types/              # Tipos específicos de la app
├── utils/              # Utilidades específicas de la app
├── styles/             # Estilos específicos de la app
├── tests/              # Tests específicos de la app
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── README.md           # Documentación específica
```

### **Import Patterns:**
```typescript
// ✅ CORRECTO - Imports desde shared
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/useAuth';
import { apiClient } from '@/shared/services/api';

// ✅ CORRECTO - Imports desde modules
import { BillingService } from '@/modules/billing';
import { AnalyticsService } from '@/modules/analytics';

// ❌ INCORRECTO - Imports entre apps
import { Component } from '../other-app/components';
```

## 🚀 **Características Comunes**

### **Módulos Transversales:**
Todas las aplicaciones incluyen:
- **AI Chat**: `@/shared/components/ai-chat`
- **Universal Assistant**: `@/shared/components/universal-assistant`
- **Workflow Engine**: `@/shared/components/workflow-engine`

### **Seguridad Multi-tenant:**
- Filtrado automático por `company_id`
- Validación de permisos por rol
- Auditoría de acciones
- Isolación de datos por empresa

### **UI/UX Standards:**
- Shadcn/ui components
- Temas dinámicos (light/dark/custom)
- Responsive design
- Accessibility (WCAG 2.1 AA)

## 🧪 **Testing Strategy**

### **Por Aplicación:**
- Unit tests para componentes
- Integration tests para flujos
- E2E tests para casos críticos
- Performance tests para métricas

### **Cross-Application:**
- Multi-tenant security tests
- Role-based access tests
- Integration tests entre módulos

## 📊 **Métricas de Calidad**

### **Por Aplicación:**
- **Performance**: <2s load time
- **Testing**: >90% coverage
- **Accessibility**: WCAG 2.1 AA
- **Security**: 100% multi-tenant isolation

---

**Cada aplicación mantiene independencia funcional mientras comparte componentes y servicios comunes del monorepo.** 