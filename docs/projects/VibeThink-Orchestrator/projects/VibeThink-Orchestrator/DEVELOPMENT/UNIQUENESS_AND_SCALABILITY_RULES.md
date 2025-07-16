# Reglas de Desarrollo: Unicidad y Escalabilidad Multi-Tenant

## 📋 **Resumen Ejecutivo**

Este documento establece las **reglas obligatorias** para garantizar la unicidad de datos y el rendimiento óptimo en un sistema SaaS multi-tenant con miles de clientes. Estas reglas son **críticas** para la escalabilidad y deben seguirse **sin excepciones**.

---

## 🎯 **Principios Fundamentales**

### **1. Unicidad Absoluta de Identificadores**
- **NUNCA** permitir nombres duplicados como identificadores únicos
- **SIEMPRE** usar UUIDs como identificadores primarios
- **SIEMPRE** generar slugs únicos automáticamente
- **SIEMPRE** validar unicidad en múltiples niveles

### **2. Rendimiento Optimizado**
- **Cache multi-nivel** obligatorio
- **Lazy loading** de configuraciones
- **Índices de base de datos** optimizados
- **Queries eficientes** con límites de tiempo

### **3. Aislamiento Total de Tenants**
- **NUNCA** compartir recursos entre empresas
- **SIEMPRE** filtrar por `company_id` en todas las queries
- **SIEMPRE** validar permisos antes de acceder a datos

---

## 🏗️ **Arquitectura de Identificación**

### **Estructura de Identificadores Únicos**

```typescript
interface CompanyIdentifiers {
  // Identificador interno único (NUNCA cambia)
  id: UUID;
  
  // Nombre legible (puede repetirse)
  name: string;
  
  // Identificador URL único (generado automáticamente)
  slug: string;
  
  // Subdomain único (para URLs personalizadas)
  subdomain: string;
  
  // ID externo de la empresa (para integraciones)
  external_id: string;
  
  // ID de tenant en Supabase (para RLS)
  tenant_id: string;
}
```

### **Jerarquía de Identificadores**

```
1. UUID (id) - Identificador absoluto
   ↓
2. Slug (slug) - Identificador URL único
   ↓
3. Subdomain (subdomain) - Identificador de dominio
   ↓
4. External ID (external_id) - Identificador de integración
   ↓
5. Name (name) - Identificador legible (NO único)
```

---

## 🔧 **Implementación Técnica**

### **1. Generación Automática de Slugs Únicos**

```typescript
/**
 * Genera un slug único basado en el nombre de la empresa
 * @param name - Nombre de la empresa
 * @returns Promise<string> - Slug único
 * 
 * @example
 * generateUniqueSlug("Hospital San José") // "hospital-san-jose"
 * generateUniqueSlug("Hospital San José") // "hospital-san-jose-1"
 * generateUniqueSlug("Hospital San José") // "hospital-san-jose-2"
 */
export const generateUniqueSlug = async (name: string): Promise<string> => {
  // 1. Normalizar el nombre
  let baseSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, ''); // Remover guiones al inicio/final
  
  // 2. Verificar unicidad con sufijo incremental
  let slug = baseSlug;
  let counter = 1;
  const maxAttempts = 100; // Prevenir loops infinitos
  
  while (counter <= maxAttempts) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', slug)
        .single();
      
      // Si no existe, el slug es único
      if (error && error.code === 'PGRST116') {
        return slug;
      }
      
      // Si existe, agregar sufijo
      slug = `${baseSlug}-${counter}`;
      counter++;
    } catch (error) {
      console.error('Error verificando unicidad de slug:', error);
      throw new Error('No se pudo generar un slug único');
    }
  }
  
  throw new Error('No se pudo generar un slug único después de 100 intentos');
};
```

### **2. Hook de Identificación de Empresa**

```typescript
/**
 * Hook para identificar la empresa actual basado en múltiples criterios
 * @returns CompanyIdentifiers | null
 * 
 * @example
 * const company = useCompanyIdentification();
 * // company = { id: "uuid", slug: "hospital-san-jose", ... }
 */
export const useCompanyIdentification = () => {
  const [company, setCompany] = useState<CompanyIdentifiers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const identifyCompany = async () => {
      try {
        setLoading(true);
        
        // 1. Intentar identificación por subdomain
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('subdomain', subdomain)
            .single();
          
          if (data && !error) {
            setCompany(data);
            return;
          }
        }
        
        // 2. Intentar identificación por slug en path
        const pathSlug = window.location.pathname.split('/')[1];
        if (pathSlug && pathSlug.length > 0) {
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('slug', pathSlug)
            .single();
          
          if (data && !error) {
            setCompany(data);
            return;
          }
        }
        
        // 3. Intentar identificación por usuario autenticado
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('company_id')
            .eq('id', user.id)
            .single();
          
          if (data?.company_id) {
            const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .select('*')
              .eq('id', data.company_id)
              .single();
            
            if (companyData && !companyError) {
              setCompany(companyData);
              return;
            }
          }
        }
        
        setError('No se pudo identificar la empresa');
      } catch (err) {
        setError('Error identificando la empresa');
        console.error('Error en identificación de empresa:', err);
      } finally {
        setLoading(false);
      }
    };
    
    identifyCompany();
  }, []);
  
  return { company, loading, error };
};
```

### **3. Sistema de Cache Multi-nivel**

```typescript
/**
 * Sistema de cache optimizado para configuraciones de empresa
 * Implementa cache en memoria, localStorage y base de datos
 */
export class CompanyCacheManager {
  private static instance: CompanyCacheManager;
  private memoryCache = new Map<string, { data: any; timestamp: number }>();
  private readonly MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly LOCAL_STORAGE_TTL = 30 * 60 * 1000; // 30 minutos
  
  static getInstance(): CompanyCacheManager {
    if (!CompanyCacheManager.instance) {
      CompanyCacheManager.instance = new CompanyCacheManager();
    }
    return CompanyCacheManager.instance;
  }
  
  /**
   * Genera clave de cache única por empresa y tipo de dato
   */
  private generateCacheKey(companyId: string, dataType: string): string {
    return `${dataType}_${companyId}`;
  }
  
  /**
   * Obtiene datos del cache con fallback automático
   */
  async get<T>(companyId: string, dataType: string, fetchFunction: () => Promise<T>): Promise<T> {
    const cacheKey = this.generateCacheKey(companyId, dataType);
    
    // 1. Intentar cache en memoria
    const memoryData = this.getFromMemory(cacheKey);
    if (memoryData) {
      return memoryData;
    }
    
    // 2. Intentar cache en localStorage
    const localStorageData = this.getFromLocalStorage(cacheKey);
    if (localStorageData) {
      this.setInMemory(cacheKey, localStorageData);
      return localStorageData;
    }
    
    // 3. Cargar desde fuente original
    const freshData = await fetchFunction();
    
    // 4. Guardar en ambos caches
    this.setInMemory(cacheKey, freshData);
    this.setInLocalStorage(cacheKey, freshData);
    
    return freshData;
  }
  
  private getFromMemory<T>(cacheKey: string): T | null {
    const cached = this.memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.MEMORY_CACHE_TTL) {
      return cached.data;
    }
    this.memoryCache.delete(cacheKey);
    return null;
  }
  
  private setInMemory<T>(cacheKey: string, data: T): void {
    this.memoryCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
  
  private getFromLocalStorage<T>(cacheKey: string): T | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.LOCAL_STORAGE_TTL) {
          return data;
        }
        localStorage.removeItem(cacheKey);
      }
    } catch (error) {
      console.warn('Error leyendo cache de localStorage:', error);
    }
    return null;
  }
  
  private setInLocalStorage<T>(cacheKey: string, data: T): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error guardando cache en localStorage:', error);
    }
  }
  
  /**
   * Invalida cache específico
   */
  invalidate(companyId: string, dataType: string): void {
    const cacheKey = this.generateCacheKey(companyId, dataType);
    this.memoryCache.delete(cacheKey);
    localStorage.removeItem(cacheKey);
  }
  
  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.memoryCache.clear();
    // Limpiar solo las claves de cache de empresas
    Object.keys(localStorage).forEach(key => {
      if (key.includes('_')) {
        localStorage.removeItem(key);
      }
    });
  }
}
```

### **4. Hook de Branding Optimizado**

```typescript
/**
 * Hook para cargar branding de empresa con cache optimizado
 * @param companyId - UUID de la empresa
 * @returns CompanyBranding | null
 * 
 * @example
 * const branding = useCompanyBranding(companyId);
 * // branding = { logoUrl: "...", primaryColor: "#0055A4", ... }
 */
export const useCompanyBranding = (companyId: string) => {
  const [branding, setBranding] = useState<CompanyBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cacheManager = CompanyCacheManager.getInstance();
  
  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }
    
    const loadBranding = async () => {
      try {
        setLoading(true);
        
        const brandingData = await cacheManager.get(
          companyId,
          'branding',
          async () => {
            const { data, error } = await supabase
              .from('company_branding')
              .select('branding_config, custom_locales')
              .eq('company_id', companyId)
              .single();
            
            if (error) {
              throw new Error('Error cargando branding');
            }
            
            return data;
          }
        );
        
        setBranding(brandingData);
      } catch (err) {
        setError('Error cargando configuración de empresa');
        console.error('Error cargando branding:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBranding();
  }, [companyId]);
  
  return { branding, loading, error };
};
```

---

## 🗄️ **Estructura de Base de Datos**

### **Tabla de Empresas con Restricciones de Unicidad**

```sql
-- Tabla principal de empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  subdomain VARCHAR(100) UNIQUE,
  external_id VARCHAR(100) UNIQUE,
  tenant_id UUID UNIQUE DEFAULT gen_random_uuid(),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de branding y configuración
CREATE TABLE company_branding (
  company_id UUID PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  branding_config JSONB NOT NULL DEFAULT '{}',
  custom_locales JSONB DEFAULT '{}',
  permissions_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de permisos granulares
CREATE TABLE company_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role_name VARCHAR(50) NOT NULL,
  module VARCHAR(50) NOT NULL,
  permissions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, role_name, module)
);

-- Índices para optimización
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_subdomain ON companies(subdomain);
CREATE INDEX idx_companies_external_id ON companies(external_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_company_branding_company_id ON company_branding(company_id);
CREATE INDEX idx_company_permissions_company_id ON company_permissions(company_id);
CREATE INDEX idx_company_permissions_role ON company_permissions(role_name);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_branding_updated_at BEFORE UPDATE ON company_branding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Políticas RLS (Row Level Security)**

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_permissions ENABLE ROW LEVEL SECURITY;

-- Política para SuperAdmin (acceso total)
CREATE POLICY "SuperAdmin can access all companies" ON companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPER_ADMIN'
    )
  );

-- Política para usuarios de empresa (solo su empresa)
CREATE POLICY "Users can access only their company" ON companies
  FOR ALL USING (
    id = (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Políticas similares para otras tablas...
```

---

## 🔐 **Sistema de Permisos Granulares**

### **Estructura de Permisos**

```typescript
interface CompanyPermissions {
  [module: string]: {
    read: boolean;
    write: boolean;
    delete: boolean;
    customFields?: string[];
    modules?: string[];
  };
}

interface PermissionConfig {
  company_id: UUID;
  role_name: string;
  permissions: CompanyPermissions;
}
```

### **Hook de Permisos**

```typescript
/**
 * Hook para verificar permisos de usuario en empresa específica
 * @param companyId - UUID de la empresa
 * @param userId - UUID del usuario
 * @returns CompanyPermissions | null
 */
export const useCompanyPermissions = (companyId: string, userId: string) => {
  const [permissions, setPermissions] = useState<CompanyPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  
  const cacheManager = CompanyCacheManager.getInstance();
  
  useEffect(() => {
    if (!companyId || !userId) {
      setLoading(false);
      return;
    }
    
    const loadPermissions = async () => {
      try {
        setLoading(true);
        
        const permissionsData = await cacheManager.get(
          `${companyId}_${userId}`,
          'permissions',
          async () => {
            const { data, error } = await supabase
              .from('company_permissions')
              .select('permissions')
              .eq('company_id', companyId)
              .eq('role_name', await getUserRole(userId, companyId));
            
            if (error) {
              throw new Error('Error cargando permisos');
            }
            
            return data?.[0]?.permissions || {};
          }
        );
        
        setPermissions(permissionsData);
      } catch (err) {
        console.error('Error cargando permisos:', err);
        setPermissions({});
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, [companyId, userId]);
  
  return { permissions, loading };
};
```

### **Componente de Verificación de Permisos**

```typescript
/**
 * Componente para proteger funcionalidades basado en permisos
 */
interface PermissionGateProps {
  companyId: string;
  module: string;
  action: 'read' | 'write' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  companyId,
  module,
  action,
  children,
  fallback = <Unauthorized />
}) => {
  const { user } = useAuth();
  const { permissions, loading } = useCompanyPermissions(companyId, user?.id);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!permissions?.[module]?.[action]) {
    return fallback;
  }
  
  return <>{children}</>;
};

// Uso
<PermissionGate companyId={companyId} module="crm" action="write">
  <CreateClientForm />
</PermissionGate>
```

---

## 📊 **Métricas de Rendimiento**

### **Objetivos de Rendimiento**

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Tiempo de carga inicial | < 2 segundos | Lighthouse |
| Cache hit rate | > 90% | Analytics |
| DB queries por sesión | < 5 | Monitoring |
| Bundle size | Sin incremento | Webpack |
| Memory usage | < 50MB | DevTools |

### **Monitoreo y Alertas**

```typescript
// Sistema de monitoreo de rendimiento
export const PerformanceMonitor = {
  trackCacheHit: (cacheType: string, hit: boolean) => {
    // Enviar métrica a sistema de monitoreo
    analytics.track('cache_hit', { cacheType, hit });
  },
  
  trackQueryTime: (query: string, duration: number) => {
    if (duration > 1000) { // Más de 1 segundo
      console.warn(`Query lenta detectada: ${query} (${duration}ms)`);
    }
  },
  
  trackMemoryUsage: () => {
    if (performance.memory) {
      const usage = performance.memory.usedJSHeapSize / 1024 / 1024;
      if (usage > 50) {
        console.warn(`Alto uso de memoria: ${usage.toFixed(2)}MB`);
      }
    }
  }
};
```

---

## 🚨 **Reglas Críticas para Desarrolladores**

### **✅ OBLIGATORIO - Siempre Hacer**

1. **Usar UUIDs como identificadores primarios**
   ```typescript
   // ✅ CORRECTO
   const companyId = "123e4567-e89b-12d3-a456-426614174000";
   
   // ❌ INCORRECTO
   const companyId = "empresa1";
   ```

2. **Generar slugs únicos automáticamente**
   ```typescript
   // ✅ CORRECTO
   const slug = await generateUniqueSlug(companyName);
   
   // ❌ INCORRECTO
   const slug = companyName.toLowerCase().replace(/\s+/g, '-');
   ```

3. **Filtrar por company_id en TODAS las queries**
   ```typescript
   // ✅ CORRECTO
   const { data } = await supabase
     .from('users')
     .select('*')
     .eq('company_id', companyId);
   
   // ❌ INCORRECTO
   const { data } = await supabase
     .from('users')
     .select('*');
   ```

4. **Usar cache para configuraciones**
   ```typescript
   // ✅ CORRECTO
   const branding = await cacheManager.get(companyId, 'branding', fetchBranding);
   
   // ❌ INCORRECTO
   const branding = await fetchBranding();
   ```

5. **Validar permisos antes de acceder a datos**
   ```typescript
   // ✅ CORRECTO
   <PermissionGate companyId={companyId} module="crm" action="write">
     <CreateClientForm />
   </PermissionGate>
   
   // ❌ INCORRECTO
   <CreateClientForm />
   ```

### **❌ PROHIBIDO - Nunca Hacer**

1. **Usar nombres como identificadores únicos**
2. **Cargar archivos estáticos para cada empresa**
3. **Compartir recursos entre empresas**
4. **Hacer queries sin filtros de company_id**
5. **Ignorar el sistema de cache**
6. **Hardcodear identificadores de empresa**

---

## 🔧 **Herramientas de Desarrollo**

### **Scripts de Validación**

```bash
# Validar unicidad de slugs
npm run validate:slugs

# Validar queries sin filtros de company_id
npm run validate:queries

# Validar cache hit rate
npm run validate:cache

# Validar permisos
npm run validate:permissions
```

### **Linting Rules**

```json
{
  "rules": {
    "no-hardcoded-company-id": "error",
    "require-company-filter": "error",
    "require-permission-check": "error",
    "no-direct-db-access": "error"
  }
}
```

---

## 📚 **Recursos Adicionales**

- [Documentación de Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [React Query para cache](https://tanstack.com/query/latest)
- [UUID generation](https://www.npmjs.com/package/uuid)
- [Performance monitoring](https://web.dev/performance/)

---

## 📞 **Soporte y Contacto**

Para dudas sobre implementación o escalabilidad:
- **Documentación**: `/docs/development/`
- **Ejemplos**: `/src/examples/`
- **Tests**: `/tests/scalability/`

---

**Última actualización**: 2025-01-27  
**Versión**: 1.0.0  
**Autor**: Marcelo + AI 