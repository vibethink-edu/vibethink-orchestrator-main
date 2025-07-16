# 📋 ViveThink-Orchestrator - Documentación Técnica Completa

**Fecha:** 7 de Julio, 2025  
**Estado:** Dashboard Admin Funcional ✅  
**Próximo paso:** Integración con Base de Datos

---

## 🏗️ Arquitectura del Sistema

### Estructura Principal del Proyecto

```
ViveThink-Orchestrator-main/
├── src/
│   ├── apps/
│   │   └── admin/                    # Aplicación Admin
│   │       ├── main.tsx             # Entry point Admin
│   │       ├── AdminRouter.tsx      # Rutas de administración
│   │       └── components/          # Componentes Admin
│   ├── shared/
│   │   ├── components/
│   │   │   ├── bundui/              # Componentes Bundui básicos
│   │   │   ├── bundui-premium/      # Componentes Bundui Premium
│   │   │   └── ui/                  # Componentes UI base
│   │   └── hooks/
│   │       └── useAuth.tsx          # Hook de autenticación
│   ├── integrations/
│   │   └── supabase/                # Integración Supabase
│   └── main.tsx                     # Entry point principal
├── public/
├── docs/                            # Documentación
└── package.json
```

---

## 🛣️ Sistema de Rutas Admin

### Rutas Principales (`/admin/*`)

| Ruta | Componente | Protección | Estado | Propósito |
|------|------------|------------|--------|-----------|
| `/admin/login` | `AdminLoginShadcn` | Pública | ✅ | Autenticación admin |
| `/admin/explorer` | `EmergencyTest` | Sin protección (temporal) | ✅ | Dashboard básico funcional |
| `/admin/premium` | `BunduiPremiumDashboard` | Admin + Premium | 🟡 | Dashboard premium completo |
| `/admin/premium-test` | `BunduiPremiumDashboard` | Sin protección | 🟡 | Test dashboard premium |
| `/admin/dashboard` | `CleanDashboard` | Admin | ✅ | Dashboard estándar |
| `/admin/test` | `TestDashboard` | Admin | ✅ | Dashboard de pruebas |

### Componentes de Protección

```tsx
// Protección Admin
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  
  const isAdmin = user?.profile?.role === "ADMIN" || 
                  user?.profile?.role === "OWNER" || 
                  user?.profile?.role === "SUPER_ADMIN";
                  
  if (!isAdmin) return <AccessDeniedMessage />;
  
  return <>{children}</>;
};

// Protección Premium
const PremiumRoute = ({ children }) => {
  const { user } = useAuth();
  
  const isPremium = user?.profile?.role === "OWNER" || 
                   user?.profile?.role === "SUPER_ADMIN";
                   
  if (!isPremium) return <PremiumUpgradeMessage />;
  
  return <>{children}</>;
};
```

---

## 🔧 Componentes de Dashboard

### 1. EmergencyTest (Funcional ✅)
**Ubicación:** `src/apps/admin/components/EmergencyTest.tsx`
```tsx
// Componente súper simple, sin dependencias
// Usado actualmente en /admin/explorer
```

### 2. BunduiPremiumDashboard (En Pruebas 🟡)
**Ubicación:** `src/apps/admin/components/BunduiPremiumDashboard.tsx`
```tsx
// Dashboard premium completo con:
// - Múltiples componentes Bundui
// - Navegación avanzada
// - Funcionalidades premium
```

### 3. SimpleDashboard (Funcional ✅)
**Ubicación:** `src/apps/admin/components/SimpleDashboard.tsx`
```tsx
// Dashboard intermedio con Tailwind CSS
// Sin dependencias complejas de Bundui
```

---

## 🎨 Sistema de UI

### Bundui Components Structure

```
src/shared/components/
├── bundui/                          # Componentes básicos
│   ├── Dashboard.tsx               # Dashboard simple
│   ├── cards/                      # Cards individuales
│   └── date-range-picker.tsx       # Selectores de fecha
├── bundui-premium/                 # Componentes premium
│   ├── components/ui/              # UI components
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── tabs.tsx
│   │   └── ...más componentes
│   └── BunduiPremiumProvider.tsx   # Provider principal
└── ui/                             # Componentes base
    ├── card.tsx
    ├── button.tsx
    └── ...
```

### Tailwind CSS Configuration ✅
```typescript
// tailwind.config.ts
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/apps/admin/**/*.{js,ts,jsx,tsx}",
    "./src/shared/components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...configuración completa
}
```

---

## 🔐 Sistema de Autenticación

### useAuth Hook
**Ubicación:** `src/shared/hooks/hooks/useAuth.tsx`

```tsx
interface AuthUser extends User {
  profile?: UserProfile;
  company?: Company;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // ...más métodos
}
```

### Roles del Sistema
- **ADMIN**: Acceso al panel admin
- **OWNER**: Acceso admin + premium
- **SUPER_ADMIN**: Acceso completo
- **USER**: Sin acceso admin

---

## 📊 Integración con Supabase

### Base de Datos (Preparado para integración)
**Ubicación:** `src/integrations/supabase/`

```typescript
// Tipos preparados
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];

// Cliente configurado
import { supabase } from '@/integrations/supabase/client';
```

### Tablas Principales (a implementar)
```sql
-- user_profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER',
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- companies
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'FREE',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Plan de Integración con Base de Datos

### Fase 1: Configuración Base
```bash
# 1. Configurar variables de entorno
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# 2. Instalar dependencias si es necesario
npm install @supabase/supabase-js
```

### Fase 2: Implementar Autenticación Real
```tsx
// En useAuth.tsx - Implementar métodos reales:
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*, companies(*)')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};
```

### Fase 3: Datos del Dashboard
```tsx
// Crear hooks para datos reales:
const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      const { data } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      setMetrics(data[0]);
    };
    
    fetchMetrics();
  }, []);
  
  return metrics;
};
```

### Fase 4: Componentes Conectados
```tsx
// Actualizar componentes para usar datos reales:
const RevenueCard = () => {
  const metrics = useDashboardMetrics();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${metrics?.revenue || '0'}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 📈 **Estado Final - Dashboard Funcional**
**Fecha actualización:** 7 de Julio, 2025 - 9:42 AM

### ✅ **RESUELTO - Dashboard Admin Completamente Funcional**

**URLs Funcionando:**
- `http://localhost:8080/admin/explorer` ✅ - Dashboard básico funcional
- `http://localhost:8080/admin/premium-test` ✅ - Dashboard premium funcional (sin autenticación)  
- `http://localhost:8080/admin/premium` 🔐 - Dashboard premium con autenticación
- `http://localhost:8080/admin/dashboard` 🔐 - Dashboard estándar con autenticación

### 🔧 **Problemas Resueltos:**
1. ✅ **Import duplicado eliminado** - AdminRouter.tsx limpio
2. ✅ **Servidor funcionando** sin errores de compilación
3. ✅ **Rutas configuradas** correctamente
4. ✅ **Componentes renderizando** apropiadamente
5. ✅ **Tailwind CSS** funcionando correctamente

### 🎯 **Estado Actual de Componentes:**

| Componente | Estado | Ubicación | Función |
|------------|--------|-----------|---------|
| `EmergencyTest` | ✅ Funcional | `/admin/explorer` | Dashboard básico de emergencia |
| `BunduiPremiumDashboard` | ✅ Funcional | `/admin/premium-test` | Dashboard premium completo |
| `SimpleDashboard` | ✅ Disponible | Importado | Dashboard intermedio |
| `DiagnosticExplorer` | ✅ Disponible | Importado | Diagnóstico del sistema |
| `BunduiExplorerFixed` | ✅ Disponible | Importado | Versión híbrida |

---

## 🚀 **PRÓXIMA FASE: Integración con Base de Datos**

### **Checklist de Preparación:**
- [x] ✅ Dashboard Admin funcionando
- [x] ✅ Rutas configuradas
- [x] ✅ Componentes UI operativos
- [x] ✅ Sistema de autenticación preparado
- [x] ✅ Documentación actualizada

### **Siguiente Sprint - Integración DB:**

#### **STEP 1: Configuración Supabase**
```bash
# Variables de entorno a configurar
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### **STEP 2: Tablas de Base de Datos**
```sql
-- user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'FREE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- dashboard_metrics
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    revenue DECIMAL(12,2) DEFAULT 0,
    users_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **STEP 3: Hooks de Datos**
```tsx
// useDashboardMetrics.tsx
export const useDashboardMetrics = (companyId?: string) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!companyId) return;
      
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!error && data.length > 0) {
        setMetrics(data[0]);
      }
      setLoading(false);
    };
    
    fetchMetrics();
  }, [companyId]);
  
  return { metrics, loading };
};
```

#### **STEP 4: Componentes Conectados**
```tsx
// MetricCard.tsx - Conectado a datos reales
const MetricCard = ({ title, field, icon, format = 'number' }) => {
  const { user } = useAuth();
  const { metrics, loading } = useDashboardMetrics(user?.company?.id);
  
  if (loading) return <Skeleton className="h-32" />;
  
  const value = metrics?.[field] || 0;
  const formattedValue = format === 'currency' 
    ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
    : new Intl.NumberFormat('es-ES').format(value);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
      </CardContent>
    </Card>
  );
};
```

### **Timeline Estimado:**
- **Semana 1:** Configuración Supabase + Tablas + Auth real
- **Semana 2:** Hooks de datos + Componentes conectados  
- **Semana 3:** Testing + Optimización + Deploy

### **Métricas de Éxito:**
- ✅ Login real funcionando
- ✅ Dashboard con datos de BD
- ✅ Roles y permisos operativos
- ✅ Actualizaciones en tiempo real
- ✅ Performance < 2s carga inicial

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Iniciar servidor desarrollo
npm run build                  # Build para producción
npm run type-check            # Verificar tipos TypeScript

# Testing
npm run test                  # Tests unitarios
npm run test:e2e             # Tests end-to-end

# Utilidades
npm run format               # Formatear código
npm run lint                 # Linter
```

---

## 📝 Notas Importantes

### Problemas Resueltos:
1. **Import duplicado** en AdminRouter.tsx
2. **Configuración incorrecta** del index.html
3. **Pantalla blanca** por errores de compilación

### Configuración Actual:
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Bundui Components
- **Routing**: React Router v6
- **Auth**: Supabase (preparado)
- **Database**: Supabase PostgreSQL (por conectar)

---

## 🎯 Objetivos de la Integración DB

### Funcionalidades a Implementar:
1. **Autenticación completa** con roles y permisos
2. **Dashboard con datos reales** de la base de datos
3. **Gestión de usuarios** y empresas
4. **Métricas en tiempo real** con actualizaciones automáticas
5. **Sistema de notificaciones** 
6. **Configuración dinámica** de la aplicación

### Métricas del Dashboard:
- **Revenue**: Ingresos totales y tendencias
- **Users**: Usuarios activos y registros
- **Companies**: Empresas registradas y planes
- **API Usage**: Uso de APIs y límites
- **Performance**: Métricas de rendimiento del sistema

---

*Documentación actualizada: 7 de Julio, 2025*
*Estado: Dashboard básico funcional, listo para integración DB*
