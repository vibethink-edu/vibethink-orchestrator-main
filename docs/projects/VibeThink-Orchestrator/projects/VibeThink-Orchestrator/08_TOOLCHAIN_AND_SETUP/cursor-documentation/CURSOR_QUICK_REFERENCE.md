# Cursor Quick Reference - VTK 1.0

## ⚡ **Referencia Rápida para Cursor**

### **Snippets Esenciales - Escribe y Autocompleta**

---

## 🚀 **Snippets de Desarrollo**

### **Inicio de Sesión**
```bash
# Escribe: xtp-session
const sessionInfo = {
  fecha: "DD-MM-YYYY",
  participante: "Tu nombre",
  rol: "Tu rol",
  contexto: "Propósito"
};
```

### **Crear Componente**
```bash
# Escribe: xtp-component
const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
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

export default React.memo(ComponentName);
```

### **Query Multi-tenant**
```bash
# Escribe: xtp-query
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('company_id', user.company_id);

if (error) {
  console.error('RLS policy violation:', error);
  throw new Error('Access denied');
}
```

### **Test Template**
```bash
# Escribe: xtp-test
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });
  
  it('should respect company isolation', () => {
    // Multi-tenant test
  });
  
  it('should validate permissions', () => {
    // Role-based test
  });
});
```

### **Task Management**
```bash
# Escribe: xtp-task
const task = {
  id: 'TASK-001',
  title: 'Task title',
  description: 'Task description',
  level: 2,
  complexity: 'medium',
  xtpCompliance: true,
  securityReview: true,
  testingRequired: true
};
```

### **Git Commit**
```bash
# Escribe: xtp-commit
git commit -m "feat(scope): description

- Implements feature
- Adds security validation
- Includes comprehensive testing
- VTK 1.0 compliant"
```

---

## 🔒 **Patrones de Seguridad**

### **Validación de Permisos**
```typescript
// Hook de autenticación
const { hasPermission } = useAuth();

// Validación directa
if (!hasPermission('ADMIN')) {
  return <Unauthorized />;
}

// Componente FeatureGate
<FeatureGate permission="ADMIN">
  <AdminPanel />
</FeatureGate>
```

### **Query Segura**
```typescript
// ✅ SIEMPRE incluye company_id
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('company_id', user.company_id);

// ✅ Manejo de errores
if (error) {
  console.error('RLS policy violation:', error);
  throw new Error('Access denied');
}
```

### **Roles del Sistema**
```typescript
enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER', 
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN'
}
```

---

## 🏗️ **Patrones de Import**

### **Monorepo Imports**
```typescript
// ✅ CORRECTO - Usa alias
import { Component } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { apiClient } from '@/shared/services';

// ❌ INCORRECTO - Imports relativos
import { Component } from '../../../shared/components';
```

### **TypeScript Types**
```typescript
// Database types
import type { Database } from '@/integrations/supabase/types';
type User = Database['public']['Tables']['users']['Row'];

// Component props
interface ComponentProps {
  user: User;
  onAction: (action: UserAction) => void;
  isLoading?: boolean;
}
```

---

## 🧪 **Testing por Nivel**

### **Level 1 (Quick Fix)**
```typescript
// Requerido:
- Basic functionality test
- No regression test
- Console error check
```

### **Level 2-4 (Standard Feature)**
```typescript
// Requerido:
- Unit tests para business logic
- Integration tests para API calls
- Component tests para UI
- Security tests para permissions
- Error handling tests
```

### **Level 5 (Architecture Change)**
```typescript
// Requerido:
- Comprehensive unit test suite
- Full integration test coverage
- E2E tests para todos los flujos
- Security penetration tests
- Performance load tests
- Accessibility compliance tests
```

---

## 📊 **Task Levels**

### **Level 1: Quick Fix**
- **Scope:** Bug fixes, small tweaks
- **Time:** <2 horas
- **Testing:** Básico
- **Review:** Self-review

### **Level 2-4: Standard Feature**
- **Scope:** New features, integrations
- **Time:** <1 semana
- **Testing:** Comprehensivo
- **Review:** Peer review

### **Level 5: Architecture Change**
- **Scope:** Major refactoring, security changes
- **Time:** <2 semanas
- **Testing:** Full suite
- **Review:** Architecture review

---

## 🚫 **Anti-Patterns**

### **Seguridad**
```typescript
// ❌ NUNCA hagas esto:
const users = await supabase.from('users').select('*'); // Sin company_id
const adminData = await fetchAdminData(); // Sin permission check
```

### **Monorepo**
```typescript
// ❌ NUNCA hagas esto:
import { Component } from '../../../shared/components'; // Import relativo
const data = await fetchData(); // Sin error handling
```

### **XTP**
```typescript
// ❌ NUNCA hagas esto:
// Missing session protocol
// No documentation
// No testing
// No security review
```

---

## 🔧 **Comandos Útiles**

### **Validación**
```bash
# Validar compliance XTP
npm run validate:xtp

# Testing completo
npm run test:full

# Quality check
npm run quality-check

# Lint específico
npm run lint:accents
npm run lint:spelling
```

### **Desarrollo**
```bash
# Build del proyecto
npm run build

# Desarrollo local
npm run dev

# Testing en watch mode
npm run test:watch
```

---

## 📚 **Documentación**

### **JSDoc Template**
```typescript
/**
 * @component ComponentName
 * @description Brief description
 * @requires PERMISSION_LEVEL
 * @example
 * <ComponentName 
 *   prop1="value"
 *   onAction={handleAction}
 * />
 * @xtpCompliance true
 * @securityReview true
 * @testingRequired true
 */
```

### **XTP Documentation**
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
```

---

## 🎯 **Workflow Rápido**

### **1. Iniciar Sesión**
```bash
# Escribe: xtp-session
# Completa la información
```

### **2. Crear Componente**
```bash
# Escribe: xtp-component
# Personaliza según necesidades
```

### **3. Implementar**
```bash
# Sigue patrones de seguridad
# Usa TypeScript strict
# Implementa validaciones
```

### **4. Testear**
```bash
# Escribe: xtp-test
# Ejecuta tests
```

### **5. Documentar**
```bash
# Escribe: xtp-docs
# Actualiza documentación
```

### **6. Commit**
```bash
# Escribe: xtp-commit
# Push y deploy
```

---

## 📞 **Recursos**

### **Archivos Clave**
- `.cursorrules` - Reglas principales
- `.cursor/rules/` - Reglas especializadas
- `.cursor/snippets/` - Snippets de desarrollo
- `docs/CURSOR_DEVELOPER_GUIDE.md` - Guía completa

### **Documentación**
- `docs/PROJECT/` - Documentación del proyecto
- `docs/XTP_METHODOLOGY/` - Metodología XTP
- `scripts/` - Scripts de validación

---

*Quick Reference - VTK 1.0* 