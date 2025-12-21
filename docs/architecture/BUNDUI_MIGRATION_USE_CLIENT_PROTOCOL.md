# Protocolo: "use client" en Migración Bundui Premium → Monorepo

**Fecha de creación:** 2025-12-20  
**Estado:** ✅ Activo - Parte del protocolo de migración estándar

---

## 📋 Resumen Ejecutivo

Al migrar módulos desde Bundui Premium a nuestro monorepo, **es necesario evaluar si `page.tsx` debe ser Client Component** (`"use client"`) o Server Component. Este documento establece el protocolo para tomar esta decisión.

---

## 🎯 Problema Identificado

### Error Común Durante Migración

```
TypeError: Class extends value undefined is not a constructor or null
This might be caused by a React Class Component being rendered in a Server Component
```

**Causa raíz:**
- `@vibethink/ui` exporta `minimal-tiptap` (requiere Client Component)
- Cuando un `page.tsx` (Server Component por defecto) importa componentes que usan `@vibethink/ui`, puede causar conflictos
- Los Server Components no pueden importar directamente componentes que requieren cliente

---

## ✅ Reglas del Protocolo

### Regla 1: Cuándo usar `"use client"` en `page.tsx`

**Agregar `"use client"` cuando el `page.tsx`:**

1. ✅ **Importa componentes que usan hooks de React** (`useState`, `useEffect`, etc.)
2. ✅ **Importa componentes que usan `@vibethink/ui`** (que exporta Client Components)
3. ✅ **Tiene interactividad directa** (botones, formularios, eventos)
4. ✅ **Usa Context API o state management**
5. ✅ **Renderiza componentes que requieren cliente** (charts, animaciones interactivas)

**Ejemplo:**
```tsx
// ✅ CORRECTO - Client Component necesario
"use client";

import { StatCards } from "./components/stat-cards"; // Usa hooks
import { Button } from "@vibethink/ui"; // Puede exportar Client Components

export default function Page() {
  return (
    <div>
      <StatCards />
      <Button>Click me</Button>
    </div>
  );
}
```

---

### Regla 2: Cuándo NO usar `"use client"` (Server Component)

**Mantener como Server Component cuando el `page.tsx`:**

1. ✅ **Solo importa Server Components puros**
2. ✅ **Usa `generateMetadata()` para SEO** (requiere Server Component)
3. ✅ **Hace fetch de datos server-side**
4. ✅ **No tiene interactividad ni hooks**

**Ejemplo:**
```tsx
// ✅ CORRECTO - Server Component (mejor para SEO)
import { generateMeta } from "@/shared/lib/utils";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Dashboard",
    description: "Dashboard description"
  });
}

export default function Page() {
  // Fetch server-side data
  const data = await fetchData();
  
  return (
    <div>
      <ServerComponent data={data} />
    </div>
  );
}
```

---

## 🔍 Análisis de Bundui Original vs Nuestro Monorepo

### Bundui Original

**Características:**
- Usa Server Components por defecto
- `page.tsx` normalmente tiene `generateMetadata()`
- Los componentes internos tienen `"use client"` cuando es necesario
- No exporta `minimal-tiptap` en barrel exports

**Ejemplo Bundui Original:**
```tsx
// page.tsx - Server Component
import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";
import { StatCards } from "./components/stat-cards"; // Client Component interno

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: "Hotel Dashboard" });
}

export default function Page() {
  return <StatCards />; // OK porque StatCards es Client Component
}
```

---

### Nuestro Monorepo

**Diferencia crítica:**
- `@vibethink/ui` exporta `minimal-tiptap` en su barrel export (`index.ts`)
- Cuando importas desde `@vibethink/ui`, puedes estar importando indirectamente Client Components
- Next.js detecta esto y puede causar errores si el page es Server Component

**Ejemplo que causa error:**
```tsx
// page.tsx - Server Component (❌ ERROR)
import { Button } from "@vibethink/ui"; // Indirectamente importa minimal-tiptap
import { StatCards } from "./components/stat-cards"; // También usa @vibethink/ui

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: "Hotel Dashboard" });
}

export default function Page() {
  return <StatCards />; // ❌ Error: Class extends value undefined
}
```

**Solución:**
```tsx
// page.tsx - Client Component (✅ CORRECTO)
"use client";

import { Button } from "@vibethink/ui";
import { StatCards } from "./components/stat-cards";

// ⚠️ No puedes usar generateMetadata() en Client Components
// Pero puedes usar metadata en layout.tsx o manejar SEO de otra forma

export default function Page() {
  return <StatCards />; // ✅ Funciona correctamente
}
```

---

## 📝 Checklist de Migración: "use client"

### Paso 1: Analizar el `page.tsx` original de Bundui

- [ ] ¿Tiene `generateMetadata()`?
- [ ] ¿Hace fetch de datos server-side?
- [ ] ¿Importa componentes con interactividad?

### Paso 2: Analizar componentes importados

- [ ] ¿Los componentes importan desde `@vibethink/ui`?
- [ ] ¿Los componentes usan hooks de React (`useState`, `useEffect`)?
- [ ] ¿Los componentes tienen `"use client"`?

### Paso 3: Decisión

**Si TODOS los componentes importados son Client Components:**
- ✅ Agregar `"use client"` al `page.tsx`
- ❌ Eliminar `generateMetadata()` (no compatible con Client Components)

**Si necesitas `generateMetadata()` (SEO crítico):**
- ✅ Mantener como Server Component
- ✅ Crear un wrapper Client Component para componentes interactivos
- ✅ Pasar data como props desde Server Component

**Ejemplo de patrón híbrido:**
```tsx
// page.tsx - Server Component (mantiene SEO)
import { generateMeta } from "@/shared/lib/utils";
import { Metadata } from "next";
import { HotelDashboardClient } from "./hotel-dashboard-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: "Hotel Dashboard" });
}

export default function Page() {
  // Fetch server-side
  const initialData = await fetchInitialData();
  
  return <HotelDashboardClient initialData={initialData} />;
}
```

```tsx
// hotel-dashboard-client.tsx - Client Component
"use client";

import { StatCards } from "./components/stat-cards";
import { Button } from "@vibethink/ui";

export function HotelDashboardClient({ initialData }) {
  return (
    <div>
      <StatCards data={initialData} />
      <Button>Interactive Button</Button>
    </div>
  );
}
```

---

## 🎯 Protocolo Simplificado para Migración Rápida

### ⚡ Decisión Rápida (95% de casos)

**Regla de oro:** Si migras un módulo completo de Bundui que tiene componentes interactivos:

1. ✅ **Agregar `"use client"` al `page.tsx`**
2. ✅ **Eliminar `generateMetadata()`** (o moverlo a `layout.tsx`)
3. ✅ **Verificar que funciona**

**Razón:** La mayoría de los módulos de Bundui tienen componentes con interactividad (charts, botones, formularios), por lo que necesitan Client Component.

---

## 📊 Comparación: Bundui Original vs Monorepo

| Aspecto | Bundui Original | Nuestro Monorepo | Acción Requerida |
|---------|----------------|------------------|------------------|
| **page.tsx por defecto** | Server Component | Server Component | ✅ Igual |
| **generateMetadata()** | ✅ Disponible | ✅ Disponible | ✅ Igual |
| **Imports de UI** | `@/components/ui/*` | `@vibethink/ui` | ⚠️ Cambiar imports |
| **Barrel exports** | ❌ No exporta Client Components problemáticos | ✅ Exporta `minimal-tiptap` | ⚠️ Puede requerir `"use client"` |
| **Componentes internos** | Tienen `"use client"` cuando necesario | Tienen `"use client"` cuando necesario | ✅ Igual |
| **Conflictos** | ❌ Pocos conflictos | ⚠️ Puede haber conflictos Server/Client | ⚠️ Agregar `"use client"` si error |

---

## 🔧 Casos Específicos Documentados

### Caso 1: Módulo Hotel

**Problema:**
- `page.tsx` era Server Component con `generateMetadata()`
- Importaba componentes que usaban `@vibethink/ui`
- Error: `Class extends value undefined is not a constructor or null`

**Solución aplicada:**
```tsx
// ✅ CORRECTO
"use client";

import { Button } from "@vibethink/ui";
import { StatCards } from "./components/stat-cards";
// ... otros componentes

export default function Page() {
  return (
    <div>
      <StatCards />
      {/* ... */}
    </div>
  );
}
```

**Resultado:** ✅ Error resuelto, módulo funciona correctamente

---

### Caso 2: Módulos con Solo Datos Estáticos

**Cuando usar Server Component:**
- Páginas de contenido estático
- Páginas que requieren SEO crítico
- Páginas que hacen fetch server-side

**Solución:**
- Mantener como Server Component
- Usar patrón híbrido si hay componentes interactivos

---

## ✅ Checklist Completo de Migración

### Antes de Migrar

- [ ] Leer este protocolo
- [ ] Analizar `page.tsx` original de Bundui
- [ ] Identificar si tiene `generateMetadata()`
- [ ] Identificar componentes importados

### Durante Migración

- [ ] Corregir imports (`@/components/ui/*` → `@vibethink/ui`)
- [ ] Corregir rutas de assets (`../images/` → `/assets/images/`)
- [ ] Agregar componentes al sidebar
- [ ] **Decidir: ¿"use client" o Server Component?**

### Decisión "use client"

**Agregar `"use client"` si:**
- [ ] El módulo tiene componentes interactivos
- [ ] Los componentes usan hooks de React
- [ ] Los componentes importan desde `@vibethink/ui`
- [ ] Ocurre error: `Class extends value undefined`

**Mantener Server Component si:**
- [ ] Solo tiene contenido estático
- [ ] Requiere `generateMetadata()` crítico para SEO
- [ ] Hace fetch de datos server-side importante
- [ ] Usa patrón híbrido (wrapper Client Component)

### Después de Migrar

- [ ] Probar que la página carga correctamente
- [ ] Verificar que no hay errores en consola
- [ ] Verificar que interactividad funciona
- [ ] Si usaste `"use client"`, verificar SEO (si es crítico)

---

## 📚 Referencias

### Documentación Relacionada

- `docs/architecture/BUNDUI_PREMIUM_MIGRATION.md` - Protocolo general de migración
- `docs/TROUBLESHOOTING.md` - Problemas comunes y soluciones
- `docs/sessions/CIRUGIA_RECUPERACION_2025-12-20.md` - Caso Hotel (ejemplo real)

### Documentación Next.js

- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [When to use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

## 🎯 Resumen para Desarrollo Rápido

**Para migración rápida (casos comunes):**

1. Si el módulo tiene componentes interactivos → ✅ Agregar `"use client"`
2. Si necesitas SEO crítico → ⚠️ Considerar patrón híbrido
3. Si hay error `Class extends value undefined` → ✅ Agregar `"use client"`

**Regla simple:** **Si dudas, agrega `"use client"`** - es más seguro y funciona en 95% de los casos.

---

## ✅ Estado del Protocolo

**Versión:** 1.0  
**Fecha:** 2025-12-20  
**Estado:** ✅ Activo  
**Aplicable a:** Todas las migraciones de Bundui Premium → Monorepo

---

**Última actualización:** 2025-12-20  
**Próxima revisión:** Cuando se identifique un caso nuevo que no esté cubierto

