# FAQ: Arquitectura del Sistema

## 📋 **Índice**
1. [Arquitectura General](#arquitectura-general)
2. [Multi-Tenancy](#multi-tenancy)
3. [Sistema de Roles](#sistema-de-roles)
4. [Módulos y Funcionalidades](#módulos-y-funcionalidades)
5. [Base de Datos](#base-de-datos)
6. [Seguridad](#seguridad)
7. [Integración de IA](#integración-de-ia)
8. [Escalabilidad](#escalabilidad)

---

## 🏗️ **Arquitectura General**

### **¿Cuál es la arquitectura general del sistema?**
El sistema es una plataforma SaaS multi-tenant con:
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **IA:** OpenAI + Firecrawl para funcionalidades inteligentes
- **Deployment:** Vercel + Supabase

### **¿Por qué elegimos esta stack tecnológica?**
- **React + TypeScript:** Tipado fuerte, ecosistema maduro
- **Supabase:** Backend-as-a-Service con PostgreSQL
- **Tailwind CSS:** Utilidades CSS, diseño consistente
- **OpenAI:** IA de vanguardia para funcionalidades avanzadas

### **¿Cómo está organizada la estructura de archivos?**
```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── base/           # Componentes base personalizados
│   ├── admin/          # Paneles administrativos
│   └── layout/         # Componentes de layout
├── hooks/              # Hooks personalizados
├── pages/              # Páginas principales
├── services/           # Servicios y APIs
├── utils/              # Utilidades
├── types/              # Tipos TypeScript
└── config/             # Configuración
```

### **¿Cuál es el flujo de datos en la aplicación?**
1. **Usuario interactúa** con componente React
2. **Hook personalizado** maneja lógica de negocio
3. **Servicio** hace llamada a API
4. **Supabase** procesa en base de datos
5. **Respuesta** regresa por la misma cadena
6. **UI se actualiza** con nuevos datos

---

## 🏢 **Multi-Tenancy**

### **¿Qué es multi-tenancy y cómo funciona?**
Multi-tenancy permite que múltiples empresas usen la misma aplicación con datos completamente aislados. Cada empresa tiene su propio espacio de datos.

### **¿Cómo se implementa el aislamiento de datos?**
- **Row Level Security (RLS):** Políticas de base de datos que filtran por `company_id`
- **Middleware de autenticación:** Verifica que usuario pertenece a empresa
- **Validación en frontend:** Todos los queries incluyen `company_id`

### **¿Qué campos identifican a una empresa?**
- `company_id` en todas las tablas de datos
- `user.company_id` en el contexto de autenticación
- `company_id` en todas las queries

### **¿Cómo funciona el onboarding de una nueva empresa?**
1. **Creación de empresa** en tabla `companies`
2. **Configuración inicial** (branding, módulos, etc.)
3. **Creación de usuario owner** con permisos completos
4. **Activación de módulos** según plan contratado

### **¿Pueden los usuarios ver datos de otras empresas?**
**NUNCA.** Excepto para SUPER_ADMIN que puede acceder a datos de todas las empresas para soporte y administración.

### **¿Cómo manejar datos compartidos entre empresas?**
- **Configuraciones globales:** Tabla separada sin `company_id`
- **Templates:** Sistema de templates reutilizables
- **Integraciones:** Configuraciones globales de APIs

---

## 👥 **Sistema de Roles**

### **¿Cuáles son los roles disponibles?**
1. **EMPLOYEE** - Usuario básico, acceso limitado
2. **MANAGER** - Supervisor, puede gestionar equipos
3. **ADMIN** - Administrador de empresa, configuración completa
4. **OWNER** - Propietario, acceso total a empresa
5. **SUPER_ADMIN** - Administrador de plataforma, acceso global

### **¿Cómo funcionan los permisos?**
```tsx
// Verificar permisos
const { hasPermission } = useAuth();

if (hasPermission('ADMIN')) {
  // Mostrar funcionalidades administrativas
}

// Verificar roles específicos
if (hasPermission(['ADMIN', 'OWNER'])) {
  // Acceso para admin y owner
}
```

### **¿Qué puede hacer cada rol?**

#### **EMPLOYEE**
- Ver tickets asignados
- Crear tickets
- Actualizar perfil personal
- Acceder a módulos básicos

#### **MANAGER**
- Todo de EMPLOYEE
- Gestionar tickets de equipo
- Ver reportes de equipo
- Asignar tickets

#### **ADMIN**
- Todo de MANAGER
- Configurar módulos
- Gestionar usuarios
- Ver reportes completos
- Configurar integraciones

#### **OWNER**
- Todo de ADMIN
- Configuración de empresa
- Gestión de facturación
- Acceso a todos los datos

#### **SUPER_ADMIN**
- Acceso a todas las empresas
- Configuración de plataforma
- Soporte técnico
- Analytics globales

### **¿Cómo cambiar roles de usuarios?**
```tsx
// Solo ADMIN, OWNER o SUPER_ADMIN pueden cambiar roles
const updateUserRole = async (userId: string, newRole: UserRole) => {
  if (!hasPermission(['ADMIN', 'OWNER', 'SUPER_ADMIN'])) {
    throw new Error('Sin permisos para cambiar roles');
  }
  
  await apiClient.put(`/users/${userId}/role`, { role: newRole });
};
```

### **¿Cómo manejar permisos granulares?**
```tsx
// Permisos específicos por módulo
const permissions = {
  helpdesk: {
    create: ['EMPLOYEE', 'MANAGER', 'ADMIN', 'OWNER'],
    delete: ['ADMIN', 'OWNER'],
    configure: ['ADMIN', 'OWNER']
  },
  crm: {
    create: ['MANAGER', 'ADMIN', 'OWNER'],
    delete: ['ADMIN', 'OWNER'],
    configure: ['ADMIN', 'OWNER']
  }
};
```

---

## 📦 **Módulos y Funcionalidades**

### **¿Qué módulos están disponibles?**
- **Helpdesk/PQRS:** Gestión de tickets y solicitudes
- **CRM:** Gestión de relaciones con clientes
- **Administración:** Gestión de usuarios y configuración
- **Analytics:** Reportes y métricas
- **Facturación:** Gestión de pagos y planes
- **Integraciones:** Conexiones con servicios externos

### **¿Cómo se activan/desactivan módulos?**
```tsx
// Verificar si módulo está activo
const { isModuleActive } = useCompanyConfiguration();

if (isModuleActive('helpdesk')) {
  return <HelpdeskPanel />;
} else {
  return <ModuleNotActive module="helpdesk" />;
}
```

### **¿Cómo funciona la navegación entre módulos?**
- **Sidebar dinámico:** Solo muestra módulos activos
- **Rutas protegidas:** Verifican permisos antes de renderizar
- **Breadcrumbs:** Navegación contextual

### **¿Cómo agregar un nuevo módulo?**
1. **Crear componente** en `src/components/[module-name]/`
2. **Agregar ruta** en `src/routes/`
3. **Configurar permisos** en sistema de roles
4. **Agregar configuración** en base de datos
5. **Documentar** funcionalidades

### **¿Cómo manejar dependencias entre módulos?**
```tsx
// Módulo CRM puede depender de Helpdesk
const { isModuleActive } = useCompanyConfiguration();

const canUseCRM = isModuleActive('crm') && isModuleActive('helpdesk');

if (!canUseCRM) {
  return <ModuleDependencyError required="helpdesk" />;
}
```

---

## 🗄️ **Base de Datos**

### **¿Qué base de datos usamos?**
**PostgreSQL** a través de Supabase, que proporciona:
- Base de datos relacional robusta
- Row Level Security (RLS)
- Real-time subscriptions
- Edge Functions
- Auth integrado

### **¿Cómo funcionan las migraciones?**
```bash
# Crear nueva migración
supabase migration new add_user_preferences

# Aplicar migraciones
supabase db push

# Revertir migración
supabase db reset
```

### **¿Cómo implementar RLS (Row Level Security)?**
```sql
-- Ejemplo: Tabla de tickets
CREATE POLICY "Users can only see tickets from their company"
ON tickets
FOR ALL
USING (company_id = auth.jwt() ->> 'company_id');

-- Habilitar RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
```

### **¿Cómo manejar relaciones entre tablas?**
```sql
-- Clave foránea con company_id
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  -- ... otros campos
);

-- Índices para performance
CREATE INDEX idx_tickets_company_id ON tickets(company_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
```

### **¿Cómo implementar soft delete?**
```sql
-- Agregar campo deleted_at
ALTER TABLE tickets ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Política para excluir registros eliminados
CREATE POLICY "Exclude soft deleted records"
ON tickets
FOR ALL
USING (deleted_at IS NULL);
```

### **¿Cómo manejar auditoría de cambios?**
```sql
-- Tabla de auditoría
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para auditoría automática
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
  VALUES (TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), TG_OP, 
          CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
          CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
          (auth.jwt() ->> 'user_id')::UUID);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

## 🔒 **Seguridad**

### **¿Cómo se maneja la autenticación?**
- **Supabase Auth:** JWT tokens con expiración
- **Refresh tokens:** Renovación automática
- **Sesiones:** Gestión de múltiples dispositivos
- **Logout:** Invalidación de tokens

### **¿Cómo proteger rutas?**
```tsx
// Componente ProtectedRoute
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, hasPermission } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && !hasPermission(requiredRole)) {
    return <Unauthorized />;
  }
  
  return children;
};

// Uso
<Route path="/admin" element={
  <ProtectedRoute requiredRole="ADMIN">
    <AdminPanel />
  </ProtectedRoute>
} />
```

### **¿Cómo validar datos en el servidor?**
```tsx
// Edge Function con validación
export default async function handler(req, res) {
  // Validar JWT
  const { user } = await supabase.auth.getUser(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  // Validar datos
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  // Procesar request
  // ...
}
```

### **¿Cómo prevenir ataques comunes?**
- **SQL Injection:** Usar parámetros en queries
- **XSS:** Sanitizar inputs, usar React
- **CSRF:** Tokens CSRF en formularios
- **Rate Limiting:** Limitar requests por IP/usuario

### **¿Cómo manejar secretos y API keys?**
```tsx
// Variables de entorno en Supabase
const openaiApiKey = process.env.OPENAI_API_KEY;
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

// Nunca en código
// ❌ const apiKey = "sk-1234567890abcdef";
```

---

## 🤖 **Integración de IA**

### **¿Qué servicios de IA usamos?**
- **OpenAI:** GPT-4 para generación de texto, análisis
- **Firecrawl:** Web scraping y extracción de datos
- **Edge Functions:** Procesamiento en servidor

### **¿Cómo integrar OpenAI?**
```tsx
// Hook para OpenAI
const { generateResponse, loading, error } = useOpenAI();

const handleGenerate = async (prompt: string) => {
  const response = await generateResponse({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000
  });
  
  return response.choices[0].message.content;
};
```

### **¿Cómo usar Firecrawl?**
```tsx
// Hook para Firecrawl
const { scrapeWebsite, loading, error } = useFirecrawl();

const handleScrape = async (url: string) => {
  const data = await scrapeWebsite({
    url,
    extractors: {
      title: { selector: 'h1' },
      content: { selector: '.content' }
    }
  });
  
  return data;
};
```

### **¿Cómo manejar costos de IA?**
```tsx
// Tracking de uso
const trackAIUsage = async (service: string, tokens: number, cost: number) => {
  await apiClient.post('/ai/usage', {
    service,
    tokens,
    cost,
    company_id: user.company_id,
    user_id: user.id
  });
};
```

### **¿Cómo implementar rate limiting para IA?**
```tsx
// Verificar límites antes de usar IA
const { canUseAI, remainingRequests } = useAILimits();

if (!canUseAI) {
  return <AILimitExceeded remaining={remainingRequests} />;
}
```

---

## 📈 **Escalabilidad**

### **¿Cómo escalar horizontalmente?**
- **Load Balancers:** Distribuir tráfico entre instancias
- **CDN:** Cache de assets estáticos
- **Database Sharding:** Particionar datos por empresa
- **Microservicios:** Separar módulos en servicios independientes

### **¿Cómo optimizar performance?**
```tsx
// React Query para cache
const { data } = useQuery({
  queryKey: ['users', companyId],
  queryFn: () => fetchUsers(companyId),
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
});

// Lazy loading de componentes
const HelpdeskPanel = lazy(() => import('./HelpdeskPanel'));
const CRMPanel = lazy(() => import('./CRMPanel'));
```

### **¿Cómo manejar grandes volúmenes de datos?**
- **Paginación:** Limitar resultados por página
- **Virtualización:** Renderizar solo elementos visibles
- **Indexes:** Optimizar queries de base de datos
- **Caching:** Redis para datos frecuentemente accedidos

### **¿Cómo monitorear performance?**
```tsx
// Métricas de performance
const trackPerformance = (metric: string, value: number) => {
  analytics.track('performance', {
    metric,
    value,
    company_id: user.company_id,
    timestamp: Date.now()
  });
};

// Uso
useEffect(() => {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    trackPerformance('component_render', duration);
  };
}, []);
```

---

## ✅ **Checklist de Arquitectura**

### **Antes de crear nueva funcionalidad:**
- [ ] ¿Sigue el patrón multi-tenant?
- [ ] ¿Incluye validación de permisos?
- [ ] ¿Está documentada la API?
- [ ] ¿Incluye manejo de errores?
- [ ] ¿Está optimizada para performance?
- [ ] ¿Incluye tests?

### **Antes de modificar base de datos:**
- [ ] ¿Incluye migración?
- [ ] ¿Aplica RLS si es necesario?
- [ ] ¿Tiene índices apropiados?
- [ ] ¿Incluye auditoría si es crítico?
- [ ] ¿Está documentado el esquema?

### **Antes de deploy:**
- [ ] ¿Pasan todos los tests?
- [ ] ¿Está actualizada la documentación?
- [ ] ¿Se han revisado los permisos?
- [ ] ¿Está configurado el monitoreo?
- [ ] ¿Se ha probado en staging?

---

## 📚 **Recursos Adicionales**

### **Documentación Relacionada:**
- [Arquitectura de Decisiones](../project/ARCHITECTURE_DECISION_RECORDS.md)
- [Guía de Desarrollo](../development/DEVELOPMENT_GUIDE.md)
- [Estándares de Seguridad](../development/SECURITY_STANDARDS.md)
- [Guía de Base de Datos](../development/DATABASE_GUIDE.md)

### **Herramientas:**
- [Supabase Dashboard](https://app.supabase.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Query Docs](https://tanstack.com/query/latest)

---

**Nota:** Esta FAQ es fundamental para entender la arquitectura del sistema. Cualquier cambio arquitectónico debe ser documentado aquí. 