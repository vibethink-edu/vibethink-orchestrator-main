# VibeThink Orchestrator - Estructura `/src`

## 🏗️ **Arquitectura Monorepo - VThink 1.0**

Esta es la estructura principal del código fuente del proyecto VibeThink Orchestrator, organizada siguiendo las mejores prácticas de monorepo y arquitectura SaaS multi-tenant.

## 📁 **Estructura Principal**

```
src/
├── apps/                    # Aplicaciones independientes
├── shared/                  # Componentes y utilidades compartidas
├── integrations/            # Integraciones externas
├── modules/                 # Módulos de lógica de negocio
├── common/                  # Patrones y configuraciones comunes
├── specialized/             # Módulos especializados
└── external/                # Software externo (fuera de src/)
```

## 🎯 **Principios de Organización**

### **Separación de Responsabilidades:**
- **`apps/`**: Frontends de productos (aplicaciones independientes)
- **`modules/`**: Lógica de negocio reutilizable
- **`shared/`**: Componentes UI y utilidades
- **`integrations/`**: Conectores de sistemas externos
- **`common/`**: Patrones y configuraciones comunes
- **`specialized/`**: Módulos especializados

### **Reglas de Gobernanza:**
- ✅ **Nunca duplicar archivos**
- ✅ **Siempre documentar decisiones**
- ✅ **Mantener repo limpio y profesional**
- ✅ **Separar claramente apps de módulos**

## 🔒 **Seguridad Multi-tenant**

### **ALWAYS Filter by company_id:**
```typescript
// ✅ Correct: Company-scoped query
const data = await supabase
  .from('users')
  .select('*')
  .eq('company_id', user.company_id);

// ❌ SECURITY VIOLATION: Query without company_id
const data = await supabase.from('users').select('*');
```

### **Role-based Access Control:**
```typescript
// ✅ Correct: Check permissions before access
if (hasPermission('ADMIN')) {
  // Admin functionality
}

// ✅ Correct: Use FeatureGate component
<FeatureGate permission="ADMIN">
  <AdminPanel />
</FeatureGate>
```

## 🎨 **UI/UX Standards**

### **Shadcn/ui Integration:**
- Componentes base accesibles
- Temas dinámicos (light/dark/custom)
- Variantes flexibles
- Integración con Tailwind CSS
- TypeScript completo

### **Performance Optimization:**
- Virtualización con TanStack Virtual
- Memoización de componentes pesados
- Lazy loading de rutas
- Code splitting automático

## 🚀 **Integraciones Principales**

### **AI & Automation:**
- **OpenAI**: Integración directa
- **Firecrawl**: Web scraping inteligente
- **Knotie**: Análisis avanzado
- **Kestra**: Motor de workflows
- **Tracardi**: Orquestación de flujos

### **Data & Storage:**
- **Supabase**: Base de datos principal
- **Medusa**: E-commerce
- **Strapi**: CMS

### **UI & Development:**
- **Shadcn/ui**: Componentes base
- **React Flow**: Editor de workflows
- **TanStack Table**: Tablas avanzadas
- **React Query**: Gestión de estado

## 📋 **Módulos Transversales**

### **AI Chat:**
- Ubicación: `shared/components/ai-chat/`
- Propósito: Chat IA integrado en todas las apps
- Implementación: Hook `useAiChat()` + Componente `<AiChat />`

### **Universal Assistant:**
- Ubicación: `shared/components/universal-assistant/`
- Propósito: Asistente personal por empleado
- Implementación: Hook `useAssistantProfile()` + Componente `<UniversalAssistant />`

### **Workflow Engine:**
- Ubicación: `shared/components/workflow-engine/`
- Propósito: Motor de workflows con React Flow + Kestra
- Implementación: Editor visual drag & drop

## 🔧 **Patrones de Import**

```typescript
// ✅ CORRECTO - Usa alias para imports del monorepo
import { Component } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { apiClient } from '@/shared/services';

// ❌ INCORRECTO - Imports relativos entre apps
import { Component } from '../../../shared/components';
```

## 🧪 **Testing Requirements**

### **Multi-tenant Testing:**
```typescript
// ✅ Test company isolation
describe('Multi-tenant Security', () => {
  it('should not access cross-company data', async () => {
    const company1User = createTestUser({ company_id: 'company1' });
    const company2Data = await fetchCompanyData(company1User, 'company2');
    
    expect(company2Data).toBeNull();
  });
});
```

### **Role-based Testing:**
```typescript
// ✅ Test role permissions
describe('Role-based Access', () => {
  it('should deny access to unauthorized roles', () => {
    const employee = createTestUser({ role: 'EMPLOYEE' });
    const canAccessAdmin = hasPermission(employee, 'ADMIN');
    
    expect(canAccessAdmin).toBe(false);
  });
});
```

## 📊 **Quality Metrics - VThink 1.0**

### **Required Metrics:**
- **Security**: 100% multi-tenant isolation
- **Performance**: <2s load time for main features
- **Testing**: >90% coverage for critical paths
- **Documentation**: 100% VThink 1.0 compliance
- **Accessibility**: WCAG 2.1 AA compliance

## 🔄 **Development Workflow**

### **Task Management:**
```typescript
// ✅ Use VThink task templates
const task = {
  level: 1, // 1=Quick fix, 2-4=Feature, 5=Architecture
  complexity: 'low',
  vtkCompliance: true,
  securityReview: true,
  testingRequired: true
};
```

### **Git Workflow:**
```bash
# ✅ VThink 1.0 commit format
git commit -m "feat(admin): add user management with multi-tenant security

- Implements company_id filtering
- Adds role-based access control
- Includes comprehensive testing
- VThink 1.0 compliant"
```

---

**Esta estructura sigue los principios de VThink 1.0, CMMI-ML3 compliance y arquitectura SaaS multi-tenant escalable.** 