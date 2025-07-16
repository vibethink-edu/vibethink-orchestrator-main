# Guía de Desarrollo CDP - Aislamiento Total

**Versión:** 1.0.0  
**Fecha:** 2025-01-22  
**Autor:** AI Pair Platform  
**Estado:** **ACTIVO - PARA DESARROLLADORES**  

---

## 🎯 Principio Fundamental

> **"Los datos de una persona en una empresa son PRIVADOS y NO deben filtrarse a otras empresas, aunque sea la misma persona física."**

### **Caso de Uso Crítico**
- Juan Pérez = **Gerente de Operaciones** en Empresa A
- Juan Pérez = **Asesor Externo** en Empresa B  
- **Email personal** de Juan NO debe ser visible para Empresa A
- **Cargo en Empresa A** NO debe ser visible para Empresa B
- **Aislamiento total** entre contextos empresariales

---

## 🚨 Reglas de Desarrollo CRÍTICAS

### **1. Aislamiento Obligatorio**
```typescript
// ❌ INCORRECTO - Nunca hacer esto
const profiles = await supabase
  .from('workspace_profiles')
  .select('*')
  .eq('email', email); // Sin company_id filter

// ✅ CORRECTO - Siempre incluir company_id
const profiles = await supabase
  .from('workspace_profiles')
  .select('*')
  .eq('email', email)
  .eq('company_id', user.company_id); // Aislamiento obligatorio
```

### **2. Validación de Datos**
```typescript
// Siempre validar antes de guardar
export function validateWorkspaceData(data: any, userCompanyId: string) {
  // 1. Verificar que company_id no se manipule
  if (data.company_id && data.company_id !== userCompanyId) {
    throw new Error('Company ID manipulation detected');
  }
  
  // 2. Forzar company_id correcto
  data.company_id = userCompanyId;
  
  // 3. Remover campos sensibles
  delete data.universal_profile_id;
  delete data.created_at;
  delete data.updated_at;
  
  return data;
}
```

### **3. Queries Seguras**
```typescript
// Helper para queries seguras
export class SecureQueryBuilder {
  constructor(private supabase: SupabaseClient, private user: User) {
    if (!user.company_id) {
      throw new Error('User must have company_id');
    }
  }

  from<T>(table: string) {
    return this.supabase
      .from(table)
      .select('*')
      .eq('company_id', this.user.company_id);
  }

  // Para búsquedas por email (solo en workspace)
  async findByEmail(table: string, email: string) {
    return this.supabase
      .from(table)
      .select('*')
      .eq('company_id', this.user.company_id)
      .eq('email', email)
      .single();
  }
}
```

---

## 🏗️ Patrones de Implementación

### **1. Crear Perfil de Cliente**
```typescript
export async function createCustomerProfile(
  data: CreateProfileData, 
  user: User
): Promise<WorkspaceProfile> {
  // 1. Validar aislamiento
  const validatedData = validateWorkspaceData(data, user.company_id);
  
  // 2. Verificar si ya existe en este workspace
  const existing = await supabase
    .from('workspace_profiles')
    .select('id')
    .eq('company_id', user.company_id)
    .eq('email', validatedData.email)
    .single();
  
  if (existing) {
    throw new Error('Customer already exists in this workspace');
  }
  
  // 3. Crear perfil (aislamiento garantizado)
  const { data: profile, error } = await supabase
    .from('workspace_profiles')
    .insert({
      ...validatedData,
      company_id: user.company_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // 4. Log audit
  await logAudit('profile_created', {
    user_id: user.id,
    company_id: user.company_id,
    profile_id: profile.id,
    action: 'create'
  });
  
  return profile;
}
```

### **2. Buscar Perfiles**
```typescript
export async function searchCustomerProfiles(
  query: string, 
  user: User,
  options: SearchOptions = {}
): Promise<WorkspaceProfile[]> {
  // Solo buscar en workspace del usuario
  let queryBuilder = supabase
    .from('workspace_profiles')
    .select('*')
    .eq('company_id', user.company_id)
    .or(`email.ilike.%${query}%,position.ilike.%${query}%,department.ilike.%${query}%`);
  
  // Aplicar filtros adicionales
  if (options.status) {
    queryBuilder = queryBuilder.eq('relationship_data->status', options.status);
  }
  
  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }
  
  const { data: profiles, error } = await queryBuilder;
  
  if (error) throw error;
  
  return profiles || [];
}
```

### **3. Actualizar Perfil**
```typescript
export async function updateCustomerProfile(
  profileId: string,
  updates: Partial<WorkspaceProfile>,
  user: User
): Promise<WorkspaceProfile> {
  // 1. Verificar que el perfil pertenece al workspace
  const existing = await supabase
    .from('workspace_profiles')
    .select('id')
    .eq('id', profileId)
    .eq('company_id', user.company_id)
    .single();
  
  if (!existing) {
    throw new Error('Profile not found or access denied');
  }
  
  // 2. Validar y sanitizar updates
  const validatedUpdates = validateWorkspaceData(updates, user.company_id);
  validatedUpdates.updated_at = new Date().toISOString();
  
  // 3. Actualizar (aislamiento garantizado)
  const { data: profile, error } = await supabase
    .from('workspace_profiles')
    .update(validatedUpdates)
    .eq('id', profileId)
    .eq('company_id', user.company_id) // Doble verificación
    .select()
    .single();
  
  if (error) throw error;
  
  // 4. Log audit
  await logAudit('profile_updated', {
    user_id: user.id,
    company_id: user.company_id,
    profile_id: profileId,
    action: 'update',
    changes: validatedUpdates
  });
  
  return profile;
}
```

---

## 🔒 Seguridad y Validación

### **1. Middleware de Seguridad**
```typescript
// Middleware para validar aislamiento en todas las requests
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  
  if (!user?.company_id) {
    return res.status(401).json({ error: 'Company context required' });
  }
  
  // Validar que no se intente acceder a datos de otras empresas
  const targetCompanyId = req.body?.company_id || req.query?.company_id;
  if (targetCompanyId && targetCompanyId !== user.company_id) {
    return res.status(403).json({ error: 'Cross-company access denied' });
  }
  
  // Forzar company_id en body
  if (req.body && !req.body.company_id) {
    req.body.company_id = user.company_id;
  }
  
  next();
}
```

### **2. Validación de Schema**
```typescript
import { z } from 'zod';

// Schema para crear perfil
export const CreateProfileSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  position: z.string(),
  department: z.string(),
  status: z.enum(['prospect', 'customer', 'partner', 'employee']),
  relationship_type: z.enum(['client', 'vendor', 'consultant', 'employee']),
  // company_id se agrega automáticamente
}).refine(
  (data) => !data.company_id, // No debe venir en el request
  "Company ID should not be provided in request"
);

// Schema para actualizar perfil
export const UpdateProfileSchema = CreateProfileSchema.partial();
```

### **3. Tests de Aislamiento**
```typescript
describe('CDP Data Isolation', () => {
  test('should not allow cross-company data access', async () => {
    // Setup
    const companyA = await createTestCompany('Company A');
    const companyB = await createTestCompany('Company B');
    const userA = await createTestUser(companyA.id);
    const userB = await createTestUser(companyB.id);
    
    // Crear perfiles en diferentes empresas
    const profileA = await createCustomerProfile({
      email: 'juan@empresa-a.com',
      position: 'Gerente',
      status: 'employee'
    }, userA);
    
    const profileB = await createCustomerProfile({
      email: 'juan@empresa-b.com',
      position: 'Asesor',
      status: 'consultant'
    }, userB);
    
    // Verificar aislamiento
    const profilesFromA = await searchCustomerProfiles('juan', userA);
    const profilesFromB = await searchCustomerProfiles('juan', userB);
    
    expect(profilesFromA).toHaveLength(1);
    expect(profilesFromA[0].id).toBe(profileA.id);
    expect(profilesFromA[0].email).toBe('juan@empresa-a.com');
    expect(profilesFromA[0].position).toBe('Gerente');
    
    expect(profilesFromB).toHaveLength(1);
    expect(profilesFromB[0].id).toBe(profileB.id);
    expect(profilesFromB[0].email).toBe('juan@empresa-b.com');
    expect(profilesFromB[0].position).toBe('Asesor');
    
    // Verificar que no hay filtraciones
    expect(profilesFromA).not.toContainEqual(expect.objectContaining({
      id: profileB.id
    }));
    
    expect(profilesFromB).not.toContainEqual(expect.objectContaining({
      id: profileA.id
    }));
  });
  
  test('should prevent company_id manipulation', async () => {
    const companyA = await createTestCompany('Company A');
    const companyB = await createTestCompany('Company B');
    const userA = await createTestUser(companyA.id);
    
    // Intentar crear perfil en empresa B desde usuario de empresa A
    await expect(
      createCustomerProfile({
        email: 'test@company-b.com',
        position: 'Test',
        status: 'employee',
        company_id: companyB.id // ❌ Manipulación detectada
      }, userA)
    ).rejects.toThrow('Company ID manipulation detected');
  });
});
```

---

## 📋 Checklist de Implementación

### **Antes de Cada Commit**
- [ ] **Validación de company_id** en todas las queries
- [ ] **RLS policies** implementadas y probadas
- [ ] **Tests de aislamiento** pasando
- [ ] **Audit logging** en operaciones sensibles
- [ ] **Validación de datos** antes de guardar
- [ ] **Sanitización de inputs** completada

### **Antes de Deploy**
- [ ] **Performance tests** < 200ms
- [ ] **Security tests** 100% pasando
- [ ] **Load tests** con 1000+ usuarios concurrentes
- [ ] **Data isolation** verificado en staging
- [ ] **Audit trails** funcionando correctamente
- [ ] **Error handling** implementado

### **Monitoreo Continuo**
- [ ] **Cross-company access attempts** = 0
- [ ] **Data leak alerts** configuradas
- [ ] **Performance metrics** < thresholds
- [ ] **Error rates** < 0.1%
- [ ] **Audit log completeness** = 100%

---

## 🚨 Anti-Patterns a Evitar

### **❌ NUNCA Hacer Esto**
```typescript
// 1. Queries sin company_id filter
const profiles = await supabase.from('workspace_profiles').select('*');

// 2. Trusting client-provided company_id
const profile = await supabase
  .from('workspace_profiles')
  .insert({ ...data, company_id: req.body.company_id });

// 3. Cross-company joins
const result = await supabase
  .from('workspace_profiles wp')
  .select('wp.*, up.*')
  .join('universal_profiles up', 'wp.universal_profile_id', 'up.id');

// 4. Global searches
const search = await supabase
  .from('workspace_profiles')
  .select('*')
  .textSearch('email', query);

// 5. Caching sin contexto de empresa
const cacheKey = `profile:${profileId}`; // Sin company_id
```

### **✅ SIEMPRE Hacer Esto**
```typescript
// 1. Queries con company_id filter
const profiles = await supabase
  .from('workspace_profiles')
  .select('*')
  .eq('company_id', user.company_id);

// 2. Validar company_id del usuario
const profile = await supabase
  .from('workspace_profiles')
  .insert({ ...data, company_id: user.company_id });

// 3. Búsquedas scoped por empresa
const search = await supabase
  .from('workspace_profiles')
  .select('*')
  .eq('company_id', user.company_id)
  .textSearch('email', query);

// 4. Cache con contexto de empresa
const cacheKey = `profile:${user.company_id}:${profileId}`;
```

---

## 🔧 Configuración de Desarrollo

### **1. Variables de Entorno**
```bash
# .env.local
CDP_DATABASE_URL=postgresql://cdp_user:password@localhost:5433/cdp
CDP_REDIS_URL=redis://localhost:6380
CDP_ENCRYPTION_KEY=your-encryption-key-here
CDP_AUDIT_ENABLED=true
CDP_ISOLATION_STRICT=true
```

### **2. Configuración de Testing**
```typescript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/cdp/**/*.ts',
    '!src/cdp/**/*.test.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

### **3. Scripts de Desarrollo**
```json
{
  "scripts": {
    "test:isolation": "jest --testPathPattern=isolation",
    "test:security": "jest --testPathPattern=security",
    "test:performance": "jest --testPathPattern=performance",
    "validate:cdp": "tsc --noEmit && eslint src/cdp/",
    "audit:cdp": "npm audit && npm run validate:cdp"
  }
}
```

---

## 📞 Soporte y Recursos

### **Contactos**
- **Arquitecto CDP**: [Nombre del arquitecto]
- **Security Lead**: [Nombre del security lead]
- **DevOps**: [Nombre del DevOps]

### **Documentación Relacionada**
- [Arquitectura CDP Completa](../CDP_MULTI_TENANT_ARCHITECTURE.md)
- [Políticas de Seguridad](../security/MULTI_TENANT_SECURITY.md)
- [Guía de Testing](../testing/CDP_TESTING_GUIDE.md)

### **Herramientas de Desarrollo**
- **Database**: PostgreSQL con RLS
- **Cache**: Redis
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Monitoring**: Custom metrics + alerts

---

## 🎯 Recordatorio Final

> **"Cada línea de código que escribas debe respetar el aislamiento total entre empresas. La privacidad de los datos es NO NEGOCIABLE."**

**Si tienes dudas sobre implementación, SIEMPRE pregunta antes de comprometer código que podría violar el aislamiento.** 