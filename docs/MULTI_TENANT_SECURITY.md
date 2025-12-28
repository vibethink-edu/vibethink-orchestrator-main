# 🔒 Multi-tenant Security Guide

**VibeThink Orchestrator - Architecture Upgrade Phase 4**

---

## 📚 Contenido

1. [Qué es Multi-tenancy](#qué-es-multi-tenancy)
2. [Arquitectura](#arquitectura)
3. [Uso Básico](#uso-básico)
4. [Reglas de Seguridad](#reglas-de-seguridad)
5. [Ejemplos](#ejemplos)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Qué es Multi-tenancy

**Multi-tenancy** es una arquitectura donde **múltiples clientes (tenants)** usan la misma aplicación, pero **cada uno ve solo SUS datos**.

### Ejemplo Real

| Cliente | company_id | Ve |
|---------|------------|-----|
| **Acme Corp** | `acme_123` | Solo clientes de Acme |
| **TechStart** | `techstart_456` | Solo clientes de TechStart |
| **GlobalCo** | `globalco_789` | Solo clientes de GlobalCo |

**CRÍTICO:** Cada cliente **NUNCA** debe ver datos de otro cliente.

---

## 🏗️ Arquitectura

### **Componentes**

```
┌─────────────────────────────────────────────────┐
│  AuthProvider (layout.tsx)                      │
│  - Gestiona user + company_id                   │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────┴──────┐
         │              │
    ┌────▼────┐   ┌────▼────┐
    │ useAuth │   │  Page   │
    └────┬────┘   └────┬────┘
         │              │
         └──────┬───────┘
                │
        ┌───────▼────────┐
        │  API Call      │
        │  + company_id  │
        └────────────────┘
```

### **Flujo de Datos**

1. **AuthProvider** carga el `user` (con `company_id`)
2. **useAuth()** expone `company_id` a todos los componentes
3. **API calls** incluyen `company_id` en queries
4. **Backend** filtra datos por `company_id`

---

## 🚀 Uso Básico

### **1. Obtener company_id**

```tsx
import { useAuth } from '@/lib/hooks/useAuth'

function MyComponent() {
  const { company_id, user } = useAuth()
  
  console.log('User:', user.name)
  console.log('Company:', company_id)  // "vibethink_dev"
}
```

### **2. Filtrar Datos por company_id**

```tsx
import { useAuth } from '@/lib/hooks/useAuth'

function CustomersPage() {
  const { company_id } = useAuth()
  const [customers, setCustomers] = useState([])
  
  useEffect(() => {
    async function fetchCustomers() {
      // ⭐ CRITICAL: Siempre incluir company_id
      const res = await fetch(`/api/customers?company_id=${company_id}`)
      const data = await res.json()
      setCustomers(data)
    }
    
    if (company_id) {
      fetchCustomers()
    }
  }, [company_id])
  
  return (
    <div>
      <h1>Customers for {company_id}</h1>
      {customers.map(c => <div key={c.id}>{c.name}</div>)}
    </div>
  )
}
```

### **3. Usar Hook Simplificado**

```tsx
import { useCompanyId } from '@/lib/hooks/useAuth'

function DataFetcher() {
  const companyId = useCompanyId()  // Throws error si no autenticado
  
  const { data } = useSWR(
    `/api/data?company_id=${companyId}`,
    fetcher
  )
}
```

---

## 🔐 Reglas de Seguridad

### ⚠️ REGLAS CRÍTICAS

1. **NUNCA hacer queries sin company_id**
   ```tsx
   // ❌ MALO - Devuelve TODOS los datos de TODOS los clientes
   fetch('/api/customers')
   
   // ✅ BUENO - Solo datos de este cliente
   fetch(`/api/customers?company_id=${company_id}`)
   ```

2. **SIEMPRE validar company_id en backend**
   ```typescript
   // Backend API
   app.get('/api/customers', (req, res) => {
     const { company_id } = req.query
     
     // ⭐ VALIDACIÓN CRÍTICA
     if (!company_id) {
       return res.status(400).json({ error: 'company_id required' })
     }
     
     const customers = await db.customers.findMany({
       where: { company_id }  // Filtrar por company_id
     })
     
     res.json(customers)
   })
   ```

3. **NUNCA confiar en company_id del frontend**
   - El frontend puede ser manipulado
   - Backend debe validar que el user pertenece a ese company_id
   - Usar JWT/session para verificar

### ✅ Checklist de Seguridad

Antes de hacer deploy:

- [ ] Todas las API calls incluyen `company_id`
- [ ] Backend valida `company_id` en TODOS los endpoints
- [ ] JWT/session contiene `company_id`
- [ ] Indexes de DB incluyen `company_id`
- [ ] Tests verifican aislamiento de datos

---

## 📋 Ejemplos

### **Ejemplo 1: Hook de Datos con Multi-tenant**

```tsx
// hooks/useCustomers.ts
import { useAuth } from '@/lib/hooks/useAuth'
import { useState, useEffect } from 'react'

export function useCustomers() {
  const { company_id } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function load() {
      setLoading(true)
      
      // ⭐ Filtrar por company_id
      const res = await fetch(`/api/customers?company_id=${company_id}`)
      const customers = await res.json()
      
      setData(customers)
      setLoading(false)
    }
    
    if (company_id) {
      load()
    }
  }, [company_id])
  
  return { data, loading, company_id }
}
```

### **Ejemplo 2: Crear Registro con company_id**

```tsx
import { useAuth } from '@/lib/hooks/useAuth'

function CreateCustomerForm() {
  const { company_id } = useAuth()
  
  async function handleSubmit(formData) {
    const customer = {
      ...formData,
      company_id  // ⭐ Asignar company_id automáticamente
    }
    
    await fetch('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customer)
    })
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### **Ejemplo 3: Validación en Backend (Express)**

```typescript
// middleware/auth.ts
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded  // { id, company_id, role }
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// routes/customers.ts
app.get('/api/customers', requireAuth, async (req, res) => {
  const { company_id } = req.user  // ⭐ Desde JWT, NO desde query
  
  const customers = await db.customers.findMany({
    where: { company_id }
  })
  
  res.json(customers)
})
```

---

## 🧪 Testing

### **Test 1: Verificar Aislamiento**

```typescript
describe('Multi-tenant Security', () => {
  it('should only return data for user company', async () => {
    // User de Acme Corp
    const acmeToken = createToken({ company_id: 'acme_123' })
    
    const res = await request(app)
      .get('/api/customers')
      .set('Authorization', `Bearer ${acmeToken}`)
    
    // Verificar que TODOS los customers pertenecen a Acme
    res.body.forEach(customer => {
      expect(customer.company_id).toBe('acme_123')
    })
  })
  
  it('should NOT allow cross-company access', async () => {
    // User de Acme intenta acceder a datos de TechStart
    const acmeToken = createToken({ company_id: 'acme_123' })
    
    const res = await request(app)
      .get('/api/customers?company_id=techstart_456')  // ❌ Intento de hack
      .set('Authorization', `Bearer ${acmeToken}`)
    
    // Backend debe rechazar esto
    expect(res.status).toBe(403)
  })
})
```

---

## 🚨 Troubleshooting

### **Error: "company_id not available"**

**Causa:** useAuth() no encuentra company_id

**Solución:**
1. Verificar que AuthProvider está en layout.tsx
2. Verificar que el componente está dentro de `<AuthProvider>`
3. Verificar que user está cargado correctamente

### **Error: Datos de otros clientes visibles**

**Causa:** Falta filtro de company_id

**Solución:**
1. Agregar `company_id` a TODAS las queries
2. Verificar que backend filtra correctamente
3. Revisar logs de queries SQL/DB

### **Error: Performance lento con muchos clientes**

**Causa:** Falta index en company_id

**Solución:**
```sql
-- Agregar index compuesto
CREATE INDEX idx_customers_company_id ON customers (company_id, created_at);
```

---

## 📊 Estado Actual (Desarrollo)

### **Mock User**

```typescript
{
  id: 'dev_user_1',
  name: 'Development User',
  email: 'dev@vibethink.com',
  company_id: 'vibethink_dev',  // ⭐ Company de desarrollo
  role: 'admin'
}
```

### **TODO: Producción**

- [ ] Implementar API real de login
- [ ] Generar JWT con company_id
- [ ] Middleware de autenticación en backend
- [ ] Validación de company_id en TODOS los endpoints
- [ ] Indexes de DB con company_id
- [ ] Tests de aislamiento

---

## 📚 Referencias

- **useAuth Hook:** `src/lib/hooks/useAuth.ts`
- **AuthProvider:** `src/providers/AuthProvider.tsx`
- **Layout:** `app/layout.tsx`

---

**Última actualización:** 2025-12-18  
**Versión:** Fase 4 - Architecture Upgrade  
**Autor:** VibeThink Orchestrator Team














