# AI-First Universal Methodology — ViTo Orchestrator

**STATUS:** 🚨 **IMPERATIVO** - Metodología universal para TODOS los módulos  
**VERSION:** 1.0.0  
**DATE:** 2025-12-21  
**CONTEXT:** ViTo es un **Orchestrator multipropósito**, no solo un sistema de booking

---

## 🎯 Visión: ViTo como Orchestrator Universal

**ViTo NO es:**
- ❌ Solo un sistema de booking
- ❌ Solo un sistema de prestación de servicios de estudio
- ❌ Un sistema monolítico de un solo dominio

**ViTo SÍ es:**
- ✅ **Orchestrator multipropósito** que integra múltiples dominios
- ✅ **AI-First Platform** donde cada módulo hereda la misma metodología
- ✅ **Context-Aware System** que adapta terminología y comportamiento según el dominio
- ✅ **Evolutivo** - Los módulos se agregan gradualmente (Hotel → Studio → CRM → Tareas → Calendario → Soporte)

---

## 📋 Módulos Actuales y Futuros

### Módulos en Desarrollo

1. **Hotel** (Piloto inicial) ✅
   - Context: `'hotel'`
   - Unit: `'night'`
   - Tipo: CivilDate (fechas de calendario)

2. **Studio** (En desarrollo)
   - Context: `'studio'`
   - Unit: `'hour'`
   - Tipo: InstantISO (puntos físicos en el tiempo)

3. **CRM** (Inspirado en Attio) 🔄
   - Context: `'crm'`
   - Onboarding: Google Workspace / Office 365
   - Fuentes de datos: Email interno, redes sociales, scraping
   - Entidades: Accounts, Contacts, Deals, Activities

4. **Tareas** (Próximo)
   - Context: `'tasks'`
   - Integración con calendario

5. **Calendario** (Próximo)
   - Context: `'calendar'`
   - Sincronización multi-fuente

6. **Soporte** (Próximo)
   - Context: `'support'`
   - Tickets, interacciones

### Módulos Especializados (Futuro)

- **Proveedores** - Persona que trabaja con proveedores, recibe información para reportes
- **Marketing** - Scraping, redes sociales, análisis
- **Operaciones** - Logística, inventario, despachos

---

## 🔄 Metodología AI-First Universal

### Principio Fundamental

**Cada módulo es AI-First, pero hereda la misma metodología base:**

1. **Context-Aware Terminology**
   - Cada módulo tiene su contexto (`hotel`, `studio`, `crm`, `tasks`, etc.)
   - La terminología se resuelve según el contexto
   - Los AI Agents reciben el contexto automáticamente

2. **DateTime Safety**
   - Cada módulo define su tipo de fecha según su dominio
   - Hotel → CivilDate (noches)
   - Studio → InstantISO (horas)
   - CRM → Puede usar ambos según la entidad

3. **External Normalization**
   - Cada módulo puede tener integraciones externas
   - Hotel → Airbnb, PMS
   - CRM → Google Workspace, Office 365, Email, Redes Sociales
   - Todos usan el mismo patrón de normalización

4. **Resource Context**
   - Cada recurso tiene su timezone explícito
   - El timezone pertenece al RECURSO, no al usuario
   - CRM: El timezone de la empresa, no del usuario

---

## 📐 Aplicación por Módulo

### Hotel (Piloto)

```typescript
// Context
const context = 'hotel';

// NormalizedWindow
const booking: NormalizedWindow = {
  kind: 'civil_range',
  domain: 'hotel',
  unit: 'night',
  resourceId: 'hotel_123',
  venueTimezone: 'America/Cancun',
  checkInDate: '2025-12-25',
  checkOutDate: '2025-12-27',
};

// Terminology
const roomLabel = await term('concept.resource.room', { locale: 'es', context: 'hotel' });
// → "habitación"

// Formatting
formatBookingRange(booking, 'es');
// → "25-27 de diciembre de 2025 (2 noches)"
```

### Studio

```typescript
// Context
const context = 'studio';

// NormalizedWindow
const booking: NormalizedWindow = {
  kind: 'instant_range',
  domain: 'studio',
  unit: 'hour',
  resourceId: 'studio_456',
  venueTimezone: 'America/Bogota',
  startAt: '2025-12-25T10:00:00-05:00',
  endAt: '2025-12-25T14:00:00-05:00',
};

// Terminology
const studioLabel = await term('concept.resource.studio', { locale: 'es', context: 'studio' });
// → "sala"

// Formatting
formatBookingRange(booking, 'es');
// → "25 dic, 10:00 – 14:00 (4 horas)"
```

### CRM (Inspirado en Attio)

```typescript
// Context
const context = 'crm';

// Resource Context (empresa, no usuario)
const companyCtx: ResourceContext = {
  resourceId: 'company_789',
  sourceSystem: 'google_workspace',
  timeZone: 'America/Bogota', // Timezone de la empresa
};

// Entidades CRM
const deal = {
  id: 'deal_123',
  name: 'Oportunidad Q1',
  // Puede usar CivilDate para fechas de cierre
  closeDate: '2025-12-31' as CivilDate,
  // O InstantISO para actividades
  lastActivityAt: '2025-12-25T14:30:00-05:00' as InstantISO,
};

// Terminology
const dealLabel = await term('concept.crm.entity.deal', { locale: 'es', context: 'crm' });
// → "oportunidad"

// Onboarding desde Google Workspace
const accounts = await normalizeGoogleWorkspaceAccounts(rawData, companyCtx);
// → NormalizedWindow o entidades CRM normalizadas
```

### Tareas

```typescript
// Context
const context = 'tasks';

// Tareas pueden tener fechas civiles (deadline) o instantes (recordatorio)
const task = {
  id: 'task_123',
  title: 'Revisar propuesta',
  deadline: '2025-12-31' as CivilDate, // Fecha límite
  reminderAt: '2025-12-30T09:00:00-05:00' as InstantISO, // Recordatorio
};

// Terminology
const taskLabel = await term('concept.tasks.entity.task', { locale: 'es', context: 'tasks' });
// → "tarea"
```

---

## 🔍 Validación de Compliance

### Checklist Universal por Módulo

Para cada módulo nuevo o existente, validar:

#### 1. Context-Aware Terminology ✅
- [ ] ¿El módulo define su contexto? (`hotel`, `studio`, `crm`, etc.)
- [ ] ¿Usa `term()` para labels cortos?
- [ ] ¿Usa `useTranslations()` para frases completas?
- [ ] ¿Los AI Agents reciben el contexto automáticamente?

#### 2. DateTime Safety ✅
- [ ] ¿Define si usa CivilDate o InstantISO?
- [ ] ¿Usa `formatBookingRange()` o equivalente?
- [ ] ¿Respeta venueTimezone (del recurso, no del usuario)?
- [ ] ¿NO hay fechas hardcoded como strings?

#### 3. External Normalization ✅
- [ ] ¿Tiene integraciones externas? (Google Workspace, Email, etc.)
- [ ] ¿Usa normalizers para transformar datos externos?
- [ ] ¿Inyecta timezone desde ResourceContext?

#### 4. Resource Context ✅
- [ ] ¿Define ResourceContext para sus recursos?
- [ ] ¿El timezone pertenece al recurso, no al usuario?
- [ ] ¿Los AI Agents reciben el ResourceContext?

#### 5. AI Integration ✅
- [ ] ¿Los AI Agents construyen Active Glossary?
- [ ] ¿El Active Glossary incluye terminología del módulo?
- [ ] ¿Los prompts incluyen el contexto del módulo?

---

## 🚨 Problemas Actuales Identificados

### Hotel Module (Piloto)

#### ❌ Violación 1: Fechas Hardcoded
**Ubicación:** `apps/dashboard/app/dashboard-bundui/hotel/components/booking-list.tsx`

```typescript
// ❌ INCORRECTO
checkIn: "June 19, 2028",  // Hardcoded string en inglés
checkOut: "June 22, 2028",
```

**Solución:**
```typescript
// ✅ CORRECTO
checkIn: '2028-06-19' as CivilDate,  // Date object o CivilDate
checkOut: '2028-06-22' as CivilDate,
// Luego usar formatBookingRange() en el render
```

#### ❌ Violación 2: No Usa formatBookingRange()
**Ubicación:** `apps/dashboard/app/dashboard-bundui/hotel/components/booking-list.tsx:256`

```typescript
// ❌ INCORRECTO
{row.original.checkIn} - {row.original.checkOut}
```

**Solución:**
```typescript
// ✅ CORRECTO
import { formatBookingRange, type NormalizedWindow } from '@vibethink/utils/datetime';

const bookingWindow: NormalizedWindow = {
  kind: 'civil_range',
  domain: 'hotel',
  unit: 'night',
  resourceId: 'hotel_mock',
  venueTimezone: 'America/Cancun', // O desde configuración
  checkInDate: row.original.checkIn as CivilDate,
  checkOutDate: row.original.checkOut as CivilDate,
};

formatBookingRange(bookingWindow, locale, { includeDuration: true })
```

---

## 📋 Plan de Corrección Inmediata

### Paso 1: Corregir booking-list.tsx

1. Cambiar `checkIn: string` → `checkIn: CivilDate`
2. Cambiar `checkOut: string` → `checkOut: CivilDate`
3. Actualizar datos mock a formato CivilDate
4. Usar `formatBookingRange()` en cell renderer
5. Agregar ResourceContext (mock para ahora)

### Paso 2: Validar Compliance Completo

1. Ejecutar `npm run validate:all-modules`
2. Revisar violaciones específicas del hotel
3. Corregir todas las violaciones
4. Re-validar

### Paso 3: Documentar para Otros Módulos

1. Crear template de módulo AI-First
2. Documentar patrón de ResourceContext por módulo
3. Crear ejemplos para CRM, Tareas, etc.

---

## 🎯 Template de Módulo AI-First

### Estructura Base

```typescript
// 1. Definir Context
export type ModuleContext = 'hotel' | 'studio' | 'crm' | 'tasks' | 'calendar' | 'support';

// 2. Definir ResourceContext (si aplica)
const resourceCtx: ResourceContext = {
  resourceId: 'module_resource_id',
  sourceSystem: 'google_workspace' | 'office365' | 'email' | 'other',
  timeZone: 'America/Bogota', // Del recurso
};

// 3. Definir NormalizedWindow o equivalente
const normalized = normalizeExternalData(rawData, resourceCtx);

// 4. Usar Terminology
const label = await term('concept.module.entity.name', { locale, context });

// 5. Formatear según tipo
if (needsDate) {
  formatBookingRange(normalized, locale);
}
```

---

## 📊 Matriz de Compliance por Módulo

| Módulo | Context | DateTime | Normalization | ResourceContext | AI Glossary | Estado |
|--------|---------|----------|---------------|-----------------|-------------|--------|
| Hotel | ✅ `hotel` | ⚠️ Hardcoded | ❌ Falta | ❌ Falta | ⚠️ Parcial | 🔴 Crítico |
| Studio | ✅ `studio` | ❓ | ❓ | ❓ | ❓ | ❓ |
| CRM | ✅ `crm` | ❓ | ❓ | ❓ | ❓ | ❓ |
| Tareas | ✅ `tasks` | ❓ | ❓ | ❓ | ❓ | ❓ |
| Calendario | ✅ `calendar` | ❓ | ❓ | ❓ | ❓ | ❓ |
| Soporte | ✅ `support` | ❓ | ❓ | ❓ | ❓ | ❓ |

---

## 🚀 Próximos Pasos

1. **Corregir Hotel Module** (compliance completo)
2. **Crear template de módulo** (para nuevos módulos)
3. **Documentar CRM pattern** (Attio-inspired, Google Workspace onboarding)
4. **Validar todos los módulos** (compliance universal)

---

**Última actualización:** 2025-12-21  
**Autor:** AI Assistant (Cursor)  
**Revisado por:** Pendiente






