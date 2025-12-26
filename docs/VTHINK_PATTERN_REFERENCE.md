# 🎯 VThink 1.0 Pattern - Reference Guide

**VibeThink Orchestrator - Architecture Upgrade Phase 4**

---

## 📋 Contenido

1. [Qué es VThink Pattern](#qué-es-vthink-pattern)
2. [Patrón de Referencia: Hospital Management](#patrón-de-referencia-hospital-management)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Step-by-Step Guide](#step-by-step-guide)
5. [Antes vs Después](#antes-vs-después)
6. [Checklist](#checklist)

---

## 🎯 Qué es VThink Pattern

**VThink 1.0** es un patrón arquitectónico que separa concerns en hooks especializados:

```
┌──────────────────────────────────────────────┐
│  Page Component (UI Only)                    │
│  - NO business logic                         │
│  - Imports hooks                             │
│  - Renders UI                                │
└─────────────┬────────────────────────────────┘
              │
      ┌───────┴───────┐
      │               │
┌─────▼─────┐   ┌────▼────┐
│ useData   │   │ useFilters│
│ - Fetch   │   │ - Filter  │
│ - company_id│  │ - Search  │
└───────────┘   └───────────┘
```

### **Principios**

1. **Separation of Concerns**: Data, filters, y operations en hooks separados
2. **Multi-tenant First**: `company_id` en TODAS las queries
3. **Type Safety**: TypeScript strict con interfaces completas
4. **Clean Components**: UI components sin lógica de negocio
5. **Testability**: Hooks se pueden testear independientemente

---

## 📁 Patrón de Referencia: Hospital Management

**Ubicación:** `apps/dashboard/app/dashboard-bundui/hospital-management/`

### **Estructura Completa**

```
hospital-management/
├── types.ts                    ← 1. Define tipos
├── hooks/
│   ├── index.ts                ← 2. Export hub
│   ├── useHospitalData.ts      ← 3. Data fetching
│   └── useHospitalFilters.ts   ← 4. Filter logic
├── components/
│   ├── patient-visits-chart.tsx
│   ├── summary-cards.tsx
│   └── ...
└── page.tsx                    ← 5. Clean UI (usa hooks)
```

---

## 📝 Estructura de Archivos

### **1. types.ts** (Tipos de Datos)

```typescript
/**
 * Base entity with multi-tenant support
 */
export interface BaseEntity {
  id: string
  company_id: string  // ⭐ CRITICAL: Multi-tenant
  created_at: string
  updated_at: string
}

/**
 * Domain entity
 */
export interface Patient extends BaseEntity {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  department: string
  status: 'active' | 'inactive' | 'critical'
  // ... más campos
}

/**
 * Filters
 */
export interface HospitalFilters {
  date_range: { from: Date; to: Date }
  department?: string
  status?: string
  search_query?: string
}
```

**✅ Checklist:**
- [ ] `BaseEntity` con `company_id`
- [ ] Tipos de dominio extendiendo `BaseEntity`
- [ ] Tipos de filtros
- [ ] Enums si necesario

---

### **2. hooks/useData.ts** (Data Fetching)

```typescript
import { useAuth } from '@/lib/hooks/useAuth'

export function useHospitalData() {
  const { company_id } = useAuth()  // ⭐ Get company_id
  
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  
  useEffect(() => {
    async function fetchData() {
      // ⭐ CRITICAL: Include company_id
      const res = await fetch(`/api/patients?company_id=${company_id}`)
      const data = await res.json()
      setData(data)
    }
    
    if (company_id) {
      fetchData()
    }
  }, [company_id])
  
  return { data, isLoading, isError, company_id, refresh }
}
```

**✅ Checklist:**
- [ ] Usa `useAuth()` para `company_id`
- [ ] TODAS las queries incluyen `company_id`
- [ ] Loading states (`isLoading`, `isError`)
- [ ] `refresh()` function
- [ ] Mock data para desarrollo (TODO marcado)

---

### **3. hooks/useFilters.ts** (Filter Logic)

```typescript
export function useHospitalFilters() {
  const [filters, setFilters] = useState<HospitalFilters>({
    date_range: { from: new Date(), to: new Date() },
    department: undefined,
    status: undefined,
    search_query: undefined
  })
  
  // Setter functions
  const setDepartment = (dept: string | undefined) => {
    setFilters(prev => ({ ...prev, department: dept }))
  }
  
  // Filter functions
  const filterPatients = (patients: Patient[]): Patient[] => {
    let filtered = [...patients]
    
    if (filters.department) {
      filtered = filtered.filter(p => p.department === filters.department)
    }
    
    if (filters.search_query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.search_query.toLowerCase())
      )
    }
    
    return filtered
  }
  
  return {
    filters,
    setDepartment,
    filterPatients,
    resetFilters
  }
}
```

**✅ Checklist:**
- [ ] State de filtros centralizado
- [ ] Setter functions individuales
- [ ] Filter functions (filterX, filterY)
- [ ] `resetFilters()` function
- [ ] Active filters count (optional)

---

### **4. page.tsx** (Clean UI)

```typescript
'use client'

import { useHospitalData, useHospitalFilters } from './hooks'

export default function HospitalPage() {
  // ⭐ VThink Pattern: Import hooks
  const { patients, isLoading, company_id, refresh } = useHospitalData()
  const { filterPatients, setDepartment } = useHospitalFilters()
  
  // Apply filters
  const filteredPatients = filterPatients(patients)
  
  // Loading state
  if (isLoading) return <Loading />
  
  // Render UI
  return (
    <div>
      <h1>Hospital Management</h1>
      
      {/* Filters */}
      <Select onValueChange={setDepartment}>
        <SelectItem value="Cardiology">Cardiology</SelectItem>
      </Select>
      
      {/* Data */}
      <PatientsList patients={filteredPatients} />
      
      {/* Actions */}
      <Button onClick={refresh}>Refresh</Button>
    </div>
  )
}
```

**✅ Checklist:**
- [ ] `'use client'` directive
- [ ] Imports hooks desde `./hooks`
- [ ] NO lógica de negocio en el component
- [ ] Loading states manejados
- [ ] Data filtrada pasada a child components
- [ ] Actions (refresh, etc.) conectadas

---

## 📊 Antes vs Después

### **ANTES (Anti-patrón)**

```typescript
// ❌ 78 líneas simples sin lógica
export default function HospitalPage() {
  return (
    <div>
      <h1>Hospital Management</h1>
      <SummaryCards />           {/* Sin props */}
      <PatientVisitsChart />     {/* Sin props */}
      <UpcomingAppointments />   {/* Sin props */}
    </div>
  )
}
```

**Problemas:**
- ❌ Sin data fetching
- ❌ Sin multi-tenant security
- ❌ Sin filtros
- ❌ Componentes sin datos reales
- ❌ No testeable

---

### **DESPUÉS (VThink Pattern)**

```typescript
// ✅ 120 líneas con lógica completa
export default function HospitalPage() {
  const { patients, appointments, stats, isLoading, company_id, refresh } = useHospitalData()
  const { filterPatients, filterAppointments, activeFiltersCount } = useHospitalFilters()
  
  const filteredPatients = filterPatients(patients)
  const filteredAppointments = filterAppointments(appointments)
  
  if (isLoading) return <Loading />
  
  return (
    <div>
      <h1>Hospital Management</h1>
      
      {/* Multi-tenant badge */}
      <Badge>{company_id}</Badge>
      
      {/* Active filters badge */}
      {activeFiltersCount > 0 && <Badge>{activeFiltersCount} filters</Badge>}
      
      {/* Components con props */}
      <SummaryCards stats={stats} />
      <PatientVisitsChart patients={filteredPatients} stats={stats} />
      <UpcomingAppointments appointments={filteredAppointments} />
      
      {/* Actions */}
      <Button onClick={refresh}>Refresh</Button>
    </div>
  )
}
```

**Ventajas:**
- ✅ Data fetching con multi-tenant
- ✅ Filter logic separada
- ✅ Loading states
- ✅ Props pasadas a componentes
- ✅ Actions funcionales
- ✅ Testeable

---

## ✅ Step-by-Step Guide

### **Paso 1: Crear types.ts**

1. Crear `types.ts` en el directorio de la app
2. Definir `BaseEntity` con `company_id`
3. Definir tipos de dominio (Patient, Order, etc.)
4. Definir tipos de filtros
5. Commit: `feat(app): Add types with multi-tenant support`

### **Paso 2: Crear useData hook**

1. Crear `hooks/useAppData.ts`
2. Import `useAuth` para `company_id`
3. Crear state (data, loading, error)
4. Fetch data con `company_id` en query
5. Return { data, isLoading, company_id, refresh }
6. Commit: `refactor(app): Add useAppData hook`

### **Paso 3: Crear useFilters hook**

1. Crear `hooks/useAppFilters.ts`
2. Crear state de filtros
3. Crear setter functions (setDepartment, setStatus, etc.)
4. Crear filter functions (filterX, filterY)
5. Return { filters, setX, filterX, resetFilters }
6. Commit: `refactor(app): Add useAppFilters hook`

### **Paso 4: Crear hooks/index.ts**

1. Crear `hooks/index.ts`
2. Export `useAppData`
3. Export `useAppFilters`
4. Commit: `refactor(app): Add hooks index`

### **Paso 5: Refactor page.tsx**

1. Abrir `page.tsx`
2. Import hooks desde `./hooks`
3. Usar hooks en component
4. Aplicar filtros
5. Pasar props a child components
6. Agregar loading states
7. Agregar actions (refresh, etc.)
8. Commit: `refactor(app): Clean page.tsx with hooks pattern`

### **Paso 6: Backup**

1. Ejecutar backup script
2. Verificar en browser
3. Commit consolidado

---

## 🎯 Checklist General

### **Multi-tenant Security**
- [ ] `BaseEntity` con `company_id`
- [ ] `useAuth()` para obtener `company_id`
- [ ] TODAS las queries incluyen `company_id`
- [ ] Badge de company_id en UI

### **Hooks Pattern**
- [ ] `useData` hook (data fetching)
- [ ] `useFilters` hook (filter logic)
- [ ] `hooks/index.ts` (exports)
- [ ] Clean `page.tsx` (solo UI)

### **TypeScript**
- [ ] Tipos completos en `types.ts`
- [ ] No `any` types
- [ ] Interfaces exportadas

### **User Experience**
- [ ] Loading states
- [ ] Error handling
- [ ] Refresh button
- [ ] Active filters badge
- [ ] Last updated timestamp

### **Documentation**
- [ ] Comments en hooks
- [ ] Usage examples
- [ ] TODO marcados (API calls mock)

---

## 🚀 Apps Refactored (Hasta Ahora)

| App | Status | Hooks | Multi-tenant | Notes |
|-----|--------|-------|--------------|-------|
| **Hospital Management** | ✅ **PATRÓN DE REFERENCIA** | useData + useFilters | ✅ | Modelo completo |
| Analytics | ✅ Ya tiene hooks | useData + useFilters | ⚠️ Revisar | Ya migrado |
| CRM | ✅ Ya tiene hooks | 2 hooks | ⚠️ Revisar | Ya migrado |
| Crypto | ✅ Ya tiene hooks | 4 hooks | ✅ | De VibeThink |
| Finance | ✅ Ya tiene hooks | 4 hooks | ✅ | De VibeThink |
| File Manager | ✅ Ya tiene hooks | 3 hooks | ⚠️ Revisar | De VibeThink |
| Mail | ✅ Ya tiene hooks | 4 hooks | ⚠️ Revisar | De VibeThink |
| Projects | ✅ Ya tiene hooks | 4 hooks | ⚠️ Revisar | Ya migrado |
| Sales | ✅ Ya tiene hooks | 3 hooks | ⚠️ Revisar | Ya migrado |
| **Academy** | ⏳ Pendiente | - | ❌ | - |
| **Default** | ⏳ Pendiente | - | ❌ | - |
| **Ecommerce** | ⏳ Pendiente | - | ❌ | - |
| **Hotel** | ⏳ Pendiente | - | ❌ | - |
| **Payment** | ⏳ Pendiente | - | ❌ | - |

---

## 💡 Tips

### **Tip 1: Start Simple**
No necesitas refactorizar TODO. Empieza con el hook de data, luego filtros.

### **Tip 2: Mock Data is OK**
Usa mock data mientras no tengas API real. Márcalo con `// TODO: Replace with API`.

### **Tip 3: Copy from Reference**
Usa `hospital-management` como template. Copia y adapta.

### **Tip 4: Commit Often**
Haz commit después de cada paso (types → data → filters → page).

### **Tip 5: Test in Browser**
Verifica que funciona después de cada commit.

---

## 📚 Referencias

- **Patrón completo:** `apps/dashboard/app/dashboard-bundui/hospital-management/`
- **Multi-tenant guide:** `docs/MULTI_TENANT_SECURITY.md`
- **useAuth hook:** `src/lib/hooks/useAuth.ts`
- **AuthProvider:** `src/providers/AuthProvider.tsx`

---

**Última actualización:** 2025-12-18  
**Versión:** Fase 4 - Architecture Upgrade  
**Patrón de Referencia:** Hospital Management  
**Autor:** VibeThink Orchestrator Team










