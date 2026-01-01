# Protocolo: Registro y Validación de Módulos Migrados

**Fecha de creación:** 2025-12-20  
**Estado:** ✅ Activo - Parte del protocolo de migración estándar  
**🚨 ÚNICA FUENTE DE VERDAD** para módulos y componentes migrados

---

## 🚨 REGLA CRÍTICA PARA AGENTES AI

**ESTE REGISTRO ES LA ÚNICA FUENTE DE VERDAD**

**ANTES de migrar, importar, o modificar cualquier módulo/componente externo:**

1. ✅ **SIEMPRE consultar** `apps/dashboard/src/shared/data/module-registry.ts`
2. ✅ **VERIFICAR** si el módulo ya está registrado
3. ✅ **VALIDAR** compatibilidad con nuestro stack
4. ✅ **REGISTRAR** cualquier nuevo módulo importado
5. ✅ **ACTUALIZAR** el registro si modificas un módulo existente

**NUNCA:**
- ❌ Asumir que un módulo no existe sin consultar el registro
- ❌ Importar componentes sin registrarlos
- ❌ Modificar módulos sin actualizar el registro
- ❌ Confiar en memoria o documentación desactualizada

**El registro es la autoridad definitiva sobre qué módulos están migrados, de dónde vienen, y cómo están adaptados.**

---

## 📋 Resumen Ejecutivo

Este protocolo establece un sistema de registro y validación para módulos y componentes migrados desde fuentes externas (Bundui Premium, Shadcn UI Kit, React Flow, TipTap, etc.) a nuestro monorepo. Permite:

- ✅ **Tracking:** Registrar qué módulos están migrados
- ✅ **Control de versiones:** Llevar control de versiones de importación
- ✅ **Validación:** Verificar compatibilidad con nuestro stack
- ✅ **Historial:** Mantener referencia histórica de migraciones
- ✅ **Única fuente de verdad:** Autoridad definitiva para agentes AI

---

## 🎯 Objetivo

Crear un sistema centralizado que:

1. **Registre** cada módulo/componente migrado con metadata completa
2. **Valide** compatibilidad con nuestro stack actual
3. **Documente** dependencias y requisitos específicos
4. **Facilite** futuras migraciones y actualizaciones

---

## 📁 Ubicación del Registro

**Archivo principal:**
```
apps/dashboard/src/shared/data/module-registry.ts
```

**Documentación:**
```
docs/architecture/MODULE_REGISTRY_PROTOCOL.md (este archivo)
```

---

## 📊 Estructura del Registro

### ModuleRegistryEntry

Cada módulo registrado contiene:

```typescript
interface ModuleRegistryEntry {
  // Identificación
  id: string;                    // ID único (ej: "hotel-dashboard")
  name: string;                  // Nombre del módulo (ej: "Hotel Dashboard")
  path: string;                  // Ruta en monorepo (ej: "/dashboard-bundui/hotel")
  type: ComponentType;           // Tipo: "dashboard" | "component" | "hook" | "utility" | "layout"
  
  // Origen
  source: MigrationSource;       // "bundui-premium" | "bundui-original" | "custom" | "other"
  sourcePath?: string;           // Ruta original (ej: "/dashboard/(auth)/hotel")
  sourceVersion?: string;        // Versión de la fuente al migrar
  
  // Fechas
  migratedAt: string;            // ISO 8601 (ej: "2025-12-20T00:00:00Z")
  updatedAt: string;             // ISO 8601
  
  // Estado
  status: ModuleStatus;          // "complete" | "partial" | "deprecated" | "experimental"
  
  // Stack
  stackCompatibility: StackCompatibility;  // Versiones requeridas
  
  // Componentes
  components: string[];          // Lista de componentes incluidos
  subRoutes?: Array<{            // Subopciones (si aplica)
    title: string;
    path: string;
  }>;
  
  // Dependencias
  dependencies?: string[];       // Dependencias específicas requeridas
  
  // Metadata
  notes?: string;                // Notas adicionales
  issues?: string[];             // Issues conocidos
  i18nNamespace?: string;        // Namespace de traducción
  i18nCoverage?: number;         // Porcentaje de traducción (0-100)
}
```

---

## 🔧 Uso del Registro

### Agregar un Nuevo Módulo

**Paso 1:** Migrar el módulo siguiendo el protocolo estándar

**Paso 2:** Agregar entrada al registro:

```typescript
// En module-registry.ts
{
  id: "nuevo-modulo",
  name: "Nuevo Módulo",
  path: "/dashboard-bundui/nuevo-modulo",
  type: "dashboard",
  source: "bundui-premium",
  sourcePath: "/dashboard/(auth)/nuevo-modulo",
  migratedAt: "2025-12-20T00:00:00Z",
  updatedAt: "2025-12-20T00:00:00Z",
  status: "complete",
  stackCompatibility: {
    react: "19.0.0",
    nextjs: "15.3.4",
    typescript: "5.9.2",
    tailwind: "4.1.10"
  },
  components: ["Component1", "Component2"],
  dependencies: ["recharts"],
  notes: "Notas sobre el módulo"
}
```

**Paso 3:** Validar compatibilidad (ver sección Validación)

---

## ✅ Validación de Compatibilidad

### Stack Actual del Monorepo

**Versiones oficiales:**
- React: `19.0.0`
- Next.js: `15.3.4`
- TypeScript: `5.9.2`
- Tailwind CSS: `4.1.10`

**Referencias:**
- `package.json` (root) - Dependencias principales
- `apps/dashboard/package.json` - Dependencias específicas del dashboard

---

### Validación Automática

El registro incluye función `validateStackCompatibility()`:

```typescript
import { getModuleById, validateStackCompatibility } from '@/shared/data/module-registry';

const module = getModuleById('hotel-dashboard');
if (module) {
  const validation = validateStackCompatibility(module);
  if (!validation.compatible) {
    console.warn('Issues:', validation.issues);
  }
}
```

**Qué valida:**
- ✅ Versión exacta de React
- ✅ Versión exacta de Next.js
- ✅ Versión mayor.minor de TypeScript
- ✅ Versión mayor.minor de Tailwind CSS

---

### Validación Manual

**Checklist de compatibilidad antes de migrar:**

1. **React 19.0.0**
   - [ ] ¿El componente usa hooks modernos de React 19?
   - [ ] ¿Evita APIs deprecated de React 18?
   - [ ] ¿Usa `"use client"` donde es necesario?

2. **Next.js 15.3.4**
   - [ ] ¿Sigue App Router conventions?
   - [ ] ¿Server/Client Components correctos?
   - [ ] ¿Metadata API correcta?

3. **TypeScript 5.9.2**
   - [ ] ¿Tipos correctos sin `any`?
   - [ ] ¿Sintaxis compatible con TS 5.9?

4. **Tailwind CSS 4.1.10**
   - [ ] ¿Usa clases de Tailwind v4?
   - [ ] ¿Evita clases deprecated?

5. **Dependencias específicas**
   - [ ] ¿Todas las dependencias están en `package.json`?
   - [ ] ¿Versiones compatibles con nuestro stack?
   - [ ] ¿Requieren flags especiales (ej: `--legacy-peer-deps`)?

---

## 📝 Ejemplos de Registro

### Ejemplo 1: Módulo Completo (Hotel)

```typescript
{
  id: "hotel-dashboard",
  name: "Hotel Dashboard",
  path: "/dashboard-bundui/hotel",
  type: "dashboard",
  source: "bundui-premium",
  sourcePath: "/dashboard/(auth)/hotel",
  migratedAt: "2025-12-20T00:00:00Z",
  updatedAt: "2025-12-20T00:00:00Z",
  status: "complete",
  stackCompatibility: {
    react: "19.0.0",
    nextjs: "15.3.4",
    typescript: "5.9.2",
    tailwind: "4.1.10"
  },
  components: [
    "StatCards",
    "ReservationsCard",
    "CampaignOverview",
    "RecentActivities",
    "RevenueStat",
    "BookingsCard",
    "BookingList",
    "MeetingRoomSchedule",
    "BookingFormSheet"
  ],
  subRoutes: [
    { title: "Dashboard", path: "/dashboard-bundui/hotel" },
    { title: "Bookings", path: "/dashboard-bundui/hotel/bookings" }
  ],
  dependencies: ["recharts", "date-fns", "@tanstack/react-table"],
  notes: "Requiere 'use client' en page.tsx debido a imports de @vibethink/ui",
  i18nNamespace: undefined, // TODO: Crear namespace
  i18nCoverage: 0
}
```

### Ejemplo 2: Módulo con Dependencia Especial

```typescript
{
  id: "ai-chat-v2",
  name: "AI Chat V2",
  path: "/dashboard-bundui/ai-chat-v2",
  type: "dashboard",
  source: "bundui-premium",
  migratedAt: "2025-12-20T00:00:00Z",
  updatedAt: "2025-12-20T00:00:00Z",
  status: "complete",
  stackCompatibility: {
    react: "19.0.0",
    nextjs: "15.3.4",
    typescript: "5.9.2",
    tailwind: "4.1.10"
  },
  components: ["AIChatInterface", "AIChatSidebar"],
  dependencies: ["lottie-react"],
  notes: "Requiere lottie-react con --legacy-peer-deps",
  i18nNamespace: "ai-chat",
  i18nCoverage: 100
}
```

---

## 🔍 Funciones Útiles

### Obtener módulo por ID

```typescript
import { getModuleById } from '@/shared/data/module-registry';

const hotel = getModuleById('hotel-dashboard');
```

### Obtener módulo por ruta

```typescript
import { getModuleByPath } from '@/shared/data/module-registry';

const module = getModuleByPath('/dashboard-bundui/hotel');
```

### Filtrar por fuente

```typescript
import { getModulesBySource } from '@/shared/data/module-registry';

const bunduiModules = getModulesBySource('bundui-premium');
```

### Filtrar por estado

```typescript
import { getModulesByStatus } from '@/shared/data/module-registry';

const completeModules = getModulesByStatus('complete');
```

### Validar compatibilidad

```typescript
import { validateStackCompatibility } from '@/shared/data/module-registry';

const validation = validateStackCompatibility(module);
if (!validation.compatible) {
  console.warn('Stack incompatibilities:', validation.issues);
}
```

---

## 📋 Checklist de Migración Actualizado

### Antes de Migrar

- [ ] Verificar que el módulo no está ya registrado
- [ ] Revisar compatibilidad con stack actual
- [ ] Identificar dependencias específicas
- [ ] **Auditar strings hardcoded** (usar `scripts/audit-hardcoded-text.js`)

### Durante Migración

- [ ] Seguir protocolo de migración estándar
- [ ] Corregir imports a `@vibethink/ui`
- [ ] Agregar `"use client"` si es necesario
- [ ] Verificar rutas de assets
- [ ] **🚨 DESPLIEGUE EN SIDEBAR:**
  - [ ] Agregar módulo a `bundui-nav-items.ts` (si es dashboard-bundui)
  - [ ] Agregar módulo a `nav-main.tsx` (si es dashboard-bundui)
  - [ ] Verificar títulos del sidebar (deben ser traducibles o usar i18n)
  - [ ] Documentar si sidebar usa títulos hardcoded (para migración futura)
- [ ] **🚨 VALIDACIÓN i18n OBLIGATORIA:**
  - [ ] Identificar todos los strings hardcoded
  - [ ] Crear namespace i18n (EN/ES) - incluir sección "sidebar"
  - [ ] Validar subcomponentes (headers, footers, toolbars, **sidebar**)
  - [ ] Adaptar código con `useTranslation()`
  - [ ] **Validar sidebar en ambos idiomas (EN/ES)**
  - [ ] Ver `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md` para proceso completo

### Después de Migrar

- [ ] Agregar entrada al registro
- [ ] Completar todos los campos requeridos (incluyendo `i18nStatus`)
- [ ] Validar compatibilidad con `validateStackCompatibility()`
- [ ] Documentar issues conocidos
- [ ] **Verificar namespace i18n creado y registrado**
- [ ] **Actualizar `i18nCoverage` y `i18nStatus` en el registro**
- [ ] Commit con mensaje descriptivo

---

## 🚨 Validación i18n Durante Importación (OBLIGATORIO)

**NO dejar la validación i18n para después. Hacerla durante la importación.**

**Ver documentación completa:**
- `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md` - Protocolo completo

**Resumen rápido:**
1. ✅ Auditar strings hardcoded (componentes + subcomponentes)
2. ✅ Crear namespace i18n estructurado (EN/ES)
3. ✅ Validar headers, footers, toolbars, sidebars
4. ✅ Adaptar código con `useTranslation()`
5. ✅ Registrar estado en `i18nStatus`

---

## 🔄 Actualización del Registro

### Cuándo actualizar

- ✅ Después de migrar un nuevo módulo
- ✅ Cuando se actualiza un módulo existente
- ✅ Cuando se corrige un issue conocido
- ✅ Cuando se agrega i18n namespace
- ✅ Cuando cambia el estado (complete, deprecated, etc.)

### Cómo actualizar

1. Abrir `module-registry.ts`
2. Buscar la entrada del módulo
3. Actualizar campos relevantes
4. Cambiar `updatedAt` a fecha actual
5. Validar compatibilidad
6. Commit con mensaje descriptivo

---

## 🎯 Protocolo de Validación de Compatibilidad

### Antes de Importar un Nuevo Componente

**Paso 1: Verificar Stack Requerido**

```bash
# En el componente/paquete fuente, verificar package.json
```

**Paso 2: Comparar con Nuestro Stack**

| Tecnología | Versión Actual | Compatible si |
|------------|----------------|---------------|
| React | 19.0.0 | == 19.0.0 (exacto) |
| Next.js | 15.3.4 | == 15.3.4 (exacto) |
| TypeScript | 5.9.2 | >= 5.9.0 (mayor.minor) |
| Tailwind | 4.1.10 | >= 4.1.0 (mayor.minor) |

**Paso 3: Verificar Dependencias Específicas**

```typescript
// Verificar si las dependencias están en nuestro package.json
// Si no están, evaluar:
// - ¿Son compatibles con nuestro stack?
// - ¿Requieren flags especiales?
// - ¿Son críticas o pueden removerse?
```

**Paso 4: Documentar en Registro**

Si el componente es compatible o requiere ajustes menores, documentar en el registro.

---

## 📊 Reportes y Estadísticas

### Módulos Migrados por Fuente

```typescript
const bunduiModules = getModulesBySource('bundui-premium');
console.log(`Total módulos de Bundui Premium: ${bunduiModules.length}`);
```

### Módulos por Estado

```typescript
const complete = getModulesByStatus('complete');
const partial = getModulesByStatus('partial');
console.log(`Completos: ${complete.length}, Parciales: ${partial.length}`);
```

### Compatibilidad del Stack

```typescript
const allModules = moduleRegistry;
const incompatible = allModules.filter(m => {
  const validation = validateStackCompatibility(m);
  return !validation.compatible;
});
console.log(`Módulos incompatibles: ${incompatible.length}`);
```

---

## 🚨 Casos Especiales

### Componente con Dependencia Incompatible

**Si un componente requiere una versión incompatible:**

1. **Evaluar:** ¿Es crítico migrar este componente ahora?
2. **Opción A:** Actualizar nuestro stack (si es posible y seguro)
3. **Opción B:** Adaptar el componente para usar nuestro stack
4. **Opción C:** Marcar como `status: "experimental"` con notas
5. **Opción D:** No migrar hasta que sea compatible

**Documentar en registro:**
```typescript
{
  // ...
  status: "experimental",
  issues: ["Requiere React 20.0.0, actual es 19.0.0"],
  notes: "No migrar hasta actualizar React"
}
```

---

### Componente con Dependencia Especial

**Ejemplo: `lottie-react` con `--legacy-peer-deps`**

```typescript
{
  // ...
  dependencies: ["lottie-react"],
  notes: "Requiere instalación con --legacy-peer-deps debido a conflictos de peer dependencies",
  issues: ["Peer dependency conflict with React 19"]
}
```

---

## ✅ Integración con Protocolo de Migración

Este registro se integra con:

1. **Protocolo de Migración General**
   - `docs/architecture/BUNDUI_PREMIUM_MIGRATION.md`

2. **Protocolo "use client"**
   - `docs/architecture/BUNDUI_MIGRATION_USE_CLIENT_PROTOCOL.md`

3. **Troubleshooting**
   - `docs/TROUBLESHOOTING.md`

**Workflow completo:**

```
1. Migrar módulo → Protocolo de Migración
2. Decidir "use client" → Protocolo "use client"
3. Registrar módulo → Module Registry (este protocolo)
4. Validar compatibilidad → validateStackCompatibility()
5. Documentar issues → Campo issues[]
```

---

## 🎯 Próximos Pasos

### Mejoras Futuras

1. **Script de Validación Automática**
   - Validar todos los módulos registrados
   - Generar reporte de compatibilidad
   - Detectar módulos con issues

2. **CLI Tool**
   - `npm run registry:add` - Agregar módulo
   - `npm run registry:validate` - Validar todos
   - `npm run registry:report` - Generar reporte

3. **Documentación Automática**
   - Generar lista de módulos migrados
   - Generar reporte de compatibilidad
   - Actualizar documentación automáticamente

---

## 📚 Referencias

### Documentación Relacionada

- `docs/architecture/BUNDUI_PREMIUM_MIGRATION.md` - Protocolo general
- `docs/architecture/BUNDUI_MIGRATION_USE_CLIENT_PROTOCOL.md` - Protocolo "use client"
- `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md` - **🚨 Validación i18n durante importación (OBLIGATORIO)**
- `docs/TROUBLESHOOTING.md` - Problemas comunes

### Archivos del Sistema

- `apps/dashboard/src/shared/data/module-registry.ts` - Registro principal
- `package.json` - Stack actual
- `apps/dashboard/package.json` - Dependencias específicas

---

## ✅ Estado del Protocolo

**Versión:** 1.0  
**Fecha:** 2025-12-20  
**Estado:** ✅ Activo  
**Aplicable a:** Todas las migraciones futuras

---

**Última actualización:** 2025-12-20  
**Próxima revisión:** Cuando se identifique necesidad de mejoras

