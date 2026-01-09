# Cursor Developer Guide - VTK 1.0

## 🚀 **Guía Completa para Developers usando Cursor**

### **¿Qué es este documento?**
Esta guía te ayudará a usar Cursor IDE de manera eficiente con las reglas VTK 1.0, optimizando tu desarrollo en el proyecto VibeThink.

---

## 📋 **Protocolo de Sesión - OBLIGATORIO**

### **Al iniciar cada sesión de desarrollo:**

1. **Usa el snippet de sesión:**
   ```typescript
   // Escribe: vtk-session
   // Cursor te autocompletará:
   const sessionInfo = {
     fecha: "DD-MM-YYYY",
     participante: "Tu nombre",
     rol: "Tu rol en el proyecto",
     contexto: "Propósito de la sesión"
   };
   ```

2. **Valida la información:**
   - ✅ Fecha actual
   - ✅ Tu nombre y rol
   - ✅ Contexto claro del trabajo

### **¿Por qué es importante?**
- Mantiene trazabilidad de decisiones
- Ayuda a Cursor a entender el contexto
- Cumple con estándares VTK 1.0

---

## 🎯 **Snippets Esenciales para Desarrollo Rápido**

### **1. Crear Componente VTK 1.0**
```typescript
// Escribe: vtk-component
// Cursor te generará un componente con:
// - Validación de permisos
// - Multi-tenant security
// - Performance optimizations
// - VTK 1.0 compliance
```

### **2. Query Multi-tenant**
```typescript
// Escribe: vtk-query
// Cursor te generará:
// - Filtrado por company_id
// - Validación de RLS policies
// - Error handling
```

### **3. Test Template**
```typescript
// Escribe: vtk-test
// Cursor te generará tests para:
// - Company isolation
// - Role-based access
// - Security validation
```

### **4. Task Management**
```typescript
// Escribe: vtk-task
// Cursor te generará una tarea con:
// - Nivel de complejidad
// - Criterios de aceptación
// - Requisitos de testing
// - Compliance VTK 1.0
```

### **5. Git Commit VTK**
```bash
# Escribe: vtk-commit
# Cursor te generará un commit con:
# - Formato estándar
# - Información de compliance
# - Métricas de testing
```

---

## 🏗️ **Estructura del Proyecto - Monorepo**

### **Organización de Carpetas:**
```
src/
├── apps/                    # Aplicaciones independientes
│   ├── admin/              # Panel de administración
│   ├── dashboard/          # Dashboard principal
│   ├── ai-chat/            # Chat con IA
│   ├── helpdesk/           # Sistema de soporte
│   └── login/              # Autenticación
├── shared/                 # Componentes y utilidades compartidas
│   ├── components/         # Componentes reutilizables
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Funciones utilitarias
│   ├── types/              # Definiciones de tipos
│   └── services/           # Servicios compartidos
├── integrations/           # Integraciones externas
├── common/                 # Patrones y configuraciones comunes
├── specialized/            # Módulos especializados
└── modules/                # Lógica de negocio
```

### **Patrones de Import:**
```typescript
// ✅ CORRECTO - Usa alias para imports del monorepo
import { Component } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { apiClient } from '@/shared/services';

// ❌ INCORRECTO - Imports relativos entre apps
import { Component } from '../../../shared/components';
```

---

## 🔒 **Seguridad Multi-tenant - SIEMPRE REQUERIDA**

### **1. Filtrado por Company ID:**
```typescript
// ✅ SIEMPRE incluye company_id en queries
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('company_id', user.company_id);

if (error) {
  console.error('RLS policy violation:', error);
  throw new Error('Access denied');
}
```

### **2. Validación de Permisos:**
```typescript
// ✅ SIEMPRE valida permisos antes de acceder
const { hasPermission } = useAuth();

if (!hasPermission('ADMIN')) {
  return <Unauthorized />;
}

// O usa el componente FeatureGate
<FeatureGate permission="ADMIN">
  <AdminPanel />
</FeatureGate>
```

### **3. Roles del Sistema:**
```typescript
enum UserRole {
  EMPLOYEE = 'EMPLOYEE',      // Acceso básico
  MANAGER = 'MANAGER',        // Gestión de equipo
  ADMIN = 'ADMIN',           // Administración de empresa
  OWNER = 'OWNER',           // Propietario de empresa
  SUPER_ADMIN = 'SUPER_ADMIN' // Acceso cross-company
}
```

---

## 🧪 **Testing - Requisitos por Nivel**

### **Level 1 (Quick Fix):**
```typescript
// Requerido:
- Basic functionality test
- No regression test
- Console error check

// Opcional:
- Unit test si hay tiempo
- Manual verification
```

### **Level 2-4 (Standard Feature):**
```typescript
// Requerido:
- Unit tests para business logic
- Integration tests para API calls
- Component tests para UI
- Security tests para permissions
- Error handling tests

// Opcional:
- E2E tests para flujos críticos
- Performance tests
- Accessibility tests
```

### **Level 5 (Architecture Change):**
```typescript
// Requerido:
- Comprehensive unit test suite
- Full integration test coverage
- E2E tests para todos los flujos
- Security penetration tests
- Performance load tests
- Accessibility compliance tests
- Migration tests
- Rollback tests
```

---

## 📊 **Task Management - Niveles de Complejidad**

### **Level 1: Quick Fix (500 tokens)**
- **Scope:** Bug fixes, small tweaks
- **Time:** <2 horas
- **Testing:** Básico
- **Review:** Self-review

### **Level 2-4: Standard Feature (2000 tokens)**
- **Scope:** New features, integrations
- **Time:** <1 semana
- **Testing:** Comprehensivo
- **Review:** Peer review

### **Level 5: Architecture Change (5000 tokens)**
- **Scope:** Major refactoring, security changes
- **Time:** <2 semanas
- **Testing:** Full suite
- **Review:** Architecture review

---

## 🚀 **CI/CD Pipeline - Quality Gates**

### **Pre-deployment Validations:**
```bash
# Cursor ejecutará automáticamente:
npm run validate:xtp
npm run test:multi-tenant
npm run lint:accents
npm run lint:spelling
npm run quality-check
```

### **Quality Metrics Requeridas:**
- **Security:** 100% multi-tenant isolation
- **Performance:** <2s load time para features principales
- **Testing:** >90% coverage para paths críticos
- **Documentation:** 100% VTK 1.0 compliance
- **Accessibility:** WCAG 2.1 AA compliance

---

## 🎨 **Code Standards - TypeScript Strict**

### **Patrones de TypeScript:**
```typescript
// ✅ Strict typing - no 'any'
interface UserProps {
  user: User;
  onAction: (action: UserAction) => void;
  isLoading?: boolean;
}

// ✅ Enum types para valores fijos
enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// ✅ Database types desde Supabase
import type { Database } from '@/integrations/supabase/types';
type User = Database['public']['Tables']['users']['Row'];
```

### **Patrones de React:**
```typescript
// ✅ Functional components con hooks
const UserComponent: React.FC<UserProps> = ({ user, onAction, isLoading }) => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission('ADMIN')) {
    return <Unauthorized />;
  }
  
  return (
    <div className="p-4">
      {/* Component content */}
    </div>
  );
};

// ✅ Usa React.memo para performance
export default React.memo(UserComponent);
```

---

## 📚 **Documentación - Templates VTK 1.0**

### **Documentación de Componente:**
```typescript
/**
 * @component ComponentName
 * @description Brief description of component purpose
 * @requires PERMISSION_LEVEL
 * @example
 * <ComponentName 
 *   prop1="value"
 *   onAction={handleAction}
 * />
 * @vtCompliance true
 * @securityReview true
 * @testingRequired true
 */
```

### **Documentación VTK:**
```markdown
# Component: ComponentName

## VTK 1.0 Compliance
- ✅ Multi-tenant isolation
- ✅ Role-based access control
- ✅ CMMI-ML3 standards
- ✅ Performance optimization

## Security Considerations
- Company_id filtering required
- RLS policies enforced
- Audit logging implemented

## Testing Requirements
- Unit tests for business logic
- Integration tests for API calls
- Security tests for permissions
- E2E tests for user flows
```

---

## 🚫 **Anti-Patterns - NUNCA HAGAS ESTO**

### **Violaciones de Seguridad:**
```typescript
// ❌ NUNCA hagas esto:
const users = await supabase.from('users').select('*'); // Sin company_id filter
const adminData = await fetchAdminData(); // Sin permission check
```

### **Violaciones de Monorepo:**
```typescript
// ❌ NUNCA hagas esto:
import { Component } from '../../../shared/components'; // Import relativo
const data = await fetchData(); // Sin error handling
```

### **Violaciones VTK:**
```typescript
// ❌ NUNCA hagas esto:
// Missing session protocol
// No documentation
// No testing
// No security review
```

---

## 🔧 **Workflow de Desarrollo con Cursor**

### **1. Iniciar Sesión:**
```typescript
// Escribe: vtk-session
// Completa la información de sesión
```

### **2. Crear Componente:**
```typescript
// Escribe: vtk-component
// Cursor te generará el template completo
```

### **3. Implementar Lógica:**
```typescript
// Sigue las reglas de seguridad
// Usa los patrones de TypeScript
// Implementa validaciones de permisos
```

### **4. Escribir Tests:**
```typescript
// Escribe: vtk-test
// Cursor te generará tests completos
```

### **5. Documentar:**
```typescript
// Escribe: vtk-docs
// Cursor te generará documentación VTK
```

### **6. Commit:**
```bash
# Escribe: vtk-commit
# Cursor te generará commit con compliance
```

---

## 🎯 **Tips y Trucos para Cursor**

### **1. Usa los Snippets:**
- Escribe el prefijo del snippet
- Cursor te autocompletará el template
- Personaliza según tus necesidades

### **2. Aprovecha las Reglas:**
- Cursor te sugerirá mejoras basadas en las reglas
- Acepta las sugerencias que mejoren el código
- Revisa las validaciones automáticas

### **3. Mantén el Contexto:**
- Siempre inicia con el protocolo de sesión
- Documenta decisiones importantes
- Usa los templates de documentación

### **4. Valida Compliance:**
- Ejecuta `npm run validate:xtp` antes de commit
- Revisa que pasen todos los quality gates
- Asegúrate de que el testing esté completo

---

## 📞 **Soporte y Recursos**

### **Archivos de Reglas:**
- `.cursorrules` - Reglas principales
- `.cursor/rules/` - Reglas especializadas
- `.cursor/snippets/` - Snippets de desarrollo

### **Documentación Adicional:**
- `docs/PROJECT/` - Documentación del proyecto
- `docs/XTP_METHODOLOGY/` - Metodología VTK
- `scripts/` - Scripts de validación y mantenimiento

### **Comandos Útiles:**
```bash
# Validar compliance VTK
npm run validate:xtp

# Testing completo
npm run test:full

# Quality check
npm run quality-check

# Lint con reglas específicas
npm run lint:accents
npm run lint:spelling
```

---

## 🎉 **Conclusión**

Siguiendo esta guía y usando las reglas VTK 1.0 en Cursor:

- ✅ Desarrollarás más rápido y seguro
- ✅ Mantendrás compliance con estándares
- ✅ Evitarás errores comunes
- ✅ Tendrás mejor documentación
- ✅ Facilitarás el trabajo en equipo

**¡Recuerda: Las reglas están ahí para ayudarte, no para limitarte!**

---

*Última actualización: VTK 1.0 - Cursor Developer Guide* 