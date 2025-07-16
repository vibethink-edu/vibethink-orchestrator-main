# VibeThink Orchestrator - Registro Maestro

## 🎯 **INFORMACIÓN CRÍTICA - ACTUALIZAR SIEMPRE**

### **Última Actualización:** Julio 2025
### **Responsable:** Equipo VThink 1.0
### **Estado:** ✅ **ACTIVO**

---

## 🏢 **APLICACIONES CORE - NOMBRES OFICIALES**

### **Apps Principales**
| Aplicación | Nombre Oficial | Estado | Versión | Repositorio |
|------------|----------------|--------|---------|-------------|
| **CRM** | **e2crm** | 🔄 Development | v1.0.0 | `e2crm-repo` |
| **Helpdesk** | **e2helpdesk** | 🔄 Development | v1.0.0 | `e2helpdesk-repo` |
| **PQRS** | **e2pqrs** | 🔄 Development | v1.0.0 | `e2pqrs-repo` |
| **Dashboard** | **VibeThink Dashboard** | ✅ Port | v1.0.0 | `vibethink-dashboard` |
| **Admin Panel** | **VibeThink Admin** | ✅ Port | v1.0.0 | `vibethink-admin` |
| **AI Chat** | **VibeThink AI** | 🔄 Integration | v1.0.0 | `vibethink-ai` |

### **Estados de Desarrollo**
- ✅ **Port** = Código migrado y funcionando
- 🔄 **Integration** = En proceso de integración
- 🔄 **Development** = En desarrollo activo
- ⏳ **Planned** = Planificado para futuro

---

## 📦 **STACK TECNOLÓGICO - VERSIONES ACTUALES**

### **Framework Core**
```json
{
  "next": "^15.3.4",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.4.0"
}
```

### **UI Components**
```json
{
  "tailwindcss": "^3.4.17",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.6",
  "@radix-ui/react-*": "^1.x.x",
  "lucide-react": "^0.294.0"
}
```

### **State Management**
```json
{
  "zustand": "^4.4.7",
  "@tanstack/react-query": "^5.8.4",
  "react-hook-form": "^7.60.0",
  "zod": "^3.25.74"
}
```

### **Database & Auth**
```json
{
  "@supabase/supabase-js": "^2.50.3",
  "@supabase/auth-helpers-nextjs": "^0.9.0",
  "prisma": "^6.10.1",
  "@prisma/client": "^6.10.1"
}
```

### **Testing & Quality**
```json
{
  "vitest": "^3.2.4",
  "@testing-library/react": "^14.1.2",
  "eslint": "^8.53.0",
  "prettier": "^3.2.4"
}
```

---

## 🔄 **PROTOCOLO DE ACTUALIZACIÓN DE VERSIONES**

### **Proceso de Actualización**
1. **Detectar Cambio** → Monitorear repositorios
2. **Evaluar Impacto** → Análisis de breaking changes
3. **Actualizar Registro** → Modificar este documento
4. **Probar Integración** → Validar funcionamiento
5. **Documentar Cambios** → Actualizar changelog

### **Matriz de Actualización**
| Componente | Última Verificación | Próxima Verificación | Responsable |
|------------|---------------------|----------------------|-------------|
| **Next.js** | Julio 2025 | Agosto 2025 | Frontend Team |
| **React** | Julio 2025 | Agosto 2025 | Frontend Team |
| **Supabase** | Julio 2025 | Agosto 2025 | Backend Team |
| **Tailwind** | Julio 2025 | Agosto 2025 | UI Team |
| **Radix UI** | Julio 2025 | Agosto 2025 | UI Team |

### **Criterios de Actualización**
- ✅ **Stability** → Versión estable en producción
- ✅ **Security** → Sin vulnerabilidades conocidas
- ✅ **Performance** → Mejoras de rendimiento
- ✅ **Compatibility** → Compatible con stack actual

---

## 🏗️ **ARQUITECTURA MULTI-TENANT**

### **Estructura de Datos**
```typescript
// Tenant/Company
interface Company {
  id: string;
  name: string;
  slug: string; // e2crm, e2helpdesk, e2pqrs
  domain: string;
  branding: CompanyBranding;
  settings: CompanySettings;
}

// Usuario con contexto multi-tenant
interface User {
  id: string;
  email: string;
  company_id: string; // CRÍTICO: Siempre filtrar
  role: UserRole;
  permissions: Permission[];
}
```

### **Roles Unificados**
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

## 🔐 **SEGURIDAD - REGLAS INMUTABLES**

### **Multi-tenant Isolation**
```typescript
// ✅ SIEMPRE HACER
const fetchCompanyData = async (companyId: string) => {
  return await supabase
    .from('data')
    .select('*')
    .eq('company_id', companyId);
};

// ❌ NUNCA HACER
const fetchAllData = async () => {
  return await supabase.from('data').select('*');
};
```

### **RLS Policies Requeridas**
```sql
-- Política base para todas las tablas
CREATE POLICY "Company isolation" ON table_name
FOR ALL USING (company_id = auth.jwt() ->> 'company_id');
```

---

## 📱 **APLICACIONES ESPECÍFICAS**

### **e2crm - Customer Relationship Management**
- **Propósito:** Gestión de clientes y ventas
- **Features:** Contactos, oportunidades, pipeline
- **Integración:** Supabase + React Flow
- **Estado:** 🔄 Development

### **e2helpdesk - Sistema de Soporte**
- **Propósito:** Gestión de tickets y soporte
- **Features:** Tickets, categorías, SLA
- **Integración:** Supabase + React Hook Form
- **Estado:** 🔄 Development

### **e2pqrs - Sistema de PQRS**
- **Propósito:** Gestión de peticiones ciudadanas
- **Features:** PQRS, seguimiento, reportes
- **Integración:** Supabase + React Query
- **Estado:** 🔄 Development

---

## 🎨 **BRANDING DINÁMICO**

### **Configuración por Tenant**
```typescript
interface CompanyBranding {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  favicon: string;
  companyName: string;
  theme: 'light' | 'dark';
}
```

### **Implementación**
```typescript
// Hook para branding dinámico
export const useCompanyBranding = () => {
  const { company } = useCompany();
  
  return {
    colors: company.branding.colors,
    logo: company.branding.logo,
    theme: company.branding.theme
  };
};
```

---

## 📊 **MONITOREO Y MÉTRICAS**

### **KPIs Críticos**
- **Performance:** < 2s load time
- **Uptime:** > 99.9%
- **Security:** 0 vulnerabilidades críticas
- **Multi-tenant:** 100% isolation

### **Alertas Configuradas**
- ⚠️ **Performance degradation**
- 🚨 **Security vulnerabilities**
- 🔴 **Multi-tenant data leak**
- 📉 **Error rate increase**

---

## 🔄 **WORKFLOW DE DESARROLLO**

### **Git Branch Strategy**
```bash
main/           # Producción
├── develop/    # Desarrollo
├── feature/    # Nuevas features
├── hotfix/     # Correcciones urgentes
└── release/    # Preparación de releases
```

### **Commit Convention**
```
feat(e2crm): add customer management
fix(e2helpdesk): resolve ticket status bug
docs(e2pqrs): update API documentation
refactor(shared): optimize database queries
```

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

### **Pre-deployment**
- ✅ **Multi-tenant isolation** verificada
- ✅ **Security audit** limpio
- ✅ **Performance tests** pasando
- ✅ **Cross-browser** testing
- ✅ **Mobile responsive** validado

### **Post-deployment**
- ✅ **Monitoring** activo
- ✅ **Error tracking** configurado
- ✅ **Performance** monitoreado
- ✅ **User feedback** recopilado

---

## 🚨 **ALERTAS CRÍTICAS**

### **Nunca Olvidar**
1. **Siempre filtrar por company_id**
2. **Usar nombres oficiales** (e2crm, e2helpdesk, e2pqrs)
3. **Actualizar este registro** cuando cambien versiones
4. **Documentar breaking changes**
5. **Probar multi-tenant isolation**

### **Reglas Inmutables**
- ❌ **Nunca** hardcodear company_id
- ❌ **Nunca** omitir RLS policies
- ❌ **Nunca** usar nombres genéricos
- ❌ **Nunca** saltar testing multi-tenant

---

## 📞 **CONTACTOS CRÍTICOS**

### **Equipo Responsable**
- **Frontend Lead:** [Nombre]
- **Backend Lead:** [Nombre]
- **DevOps Lead:** [Nombre]
- **Security Lead:** [Nombre]

### **Repositorios Críticos**
- **e2crm:** [URL]
- **e2helpdesk:** [URL]
- **e2pqrs:** [URL]
- **VibeThink Core:** [URL]

---

**Documento actualizado:** Julio 2025  
**Próxima revisión:** Agosto 2025  
**Responsable:** Equipo VThink 1.0  
**Estado:** ✅ **CRÍTICO - MANTENER ACTUALIZADO** 

## 🆕 **APLICACIÓN EN DESARROLLO: e2crm**

### Integración: e2crm (CRM SaaS Multi-Tenant - Híbrido)

- **Ubicación:** src/apps/e2crm/
- **Versión actual:** 0.1.0-dev
- **Inspiraciones:** Twenty CRM (arquitectura) + Attio (UX/UI)
- **Modelo:** SaaS multi-tenant estable (una instalación, múltiples empresas)
- **Historial:**
  - 0.1.0-dev (10-07-2025, responsable: Equipo VThink 1.0)
- **Notas:** Desarrollo híbrido propio, arquitectura SaaS multi-tenant nativa, combinando lo mejor de Twenty CRM (estructura) y Attio (experiencia de usuario). Una sola instalación sirve a múltiples tenants con aislamiento completo por company_id.
- **Estado:** En desarrollo activo
- **Responsable:** Equipo VThink 1.0
- **📚 Documentación Consolidada:** `docs/projects/VibeThink-Orchestrator/E2CRM_CONSOLIDATED_DOCUMENTATION.md`

--- 