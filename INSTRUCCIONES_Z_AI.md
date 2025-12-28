# 🤖 INSTRUCCIONES PARA Z.AI - Sistema i18n 3 Capas

**Fecha:** 2025-12-26
**De:** Claude
**Para:** Z.Ai
**Estado:** ✅ Trabajo de Claude completado - Z.Ai puede continuar

---

## 🎯 CONTEXTO: ¿Qué Hizo Claude?

Claude trabajó en colaboración contigo implementando el sistema de 3 capas para i18n. Tú creaste 45 archivos de conceptos (9 idiomas × 5 archivos), pero había 3 archivos TypeScript con errores que impedían su uso.

### ✅ Lo Que Claude Completó:

1. **Arregló 3 archivos rotos:**
   - `packages/utils/src/i18n/terminology/engine.ts` (antes .disabled)
   - `packages/utils/src/i18n/terminology/cache.ts` (antes .disabled)
   - `packages/utils/src/i18n/terminology/index.ts` (antes .disabled)

2. **Copió 96 archivos faltantes:**
   - IT: 50 archivos
   - KO: 50 archivos
   - Otros: 3-4 archivos cada uno

3. **Creó 5 scripts de automatización:**
   - `validate-concepts-coherence.js`
   - `fix-concepts-coherence.js`
   - `copy-missing-translation-files.js`
   - `sync-translations-structure.js`
   - `check-missing-files.js`

4. **Creó documentación completa:**
   - `GUIA_MANTENIMIENTO_CONCEPTOS.md`
   - `ARCHIVOS_DISABLED_ARREGLADOS.md`
   - `VALIDACION_FINAL_3_CAPAS.md`
   - `REPORTE_PRODUCT_OWNER_2025-12-26.md`
   - `EXPLICACION_PARA_ADOLESCENTE.md`
   - `INSTRUCCIONES_Z_AI.md` (este documento)

### ✅ Estado Actual del Sistema:

```
TypeScript Compilation:  ✅ PASA sin errores
Next.js Build:          ✅ COMPILA correctamente
Dev Server:             ✅ LEVANTA sin errores
Archivos de Traducción: ✅ TODOS presentes (405 archivos)
Coherencia de Keys:     ✅ VALIDADA
```

---

## 📋 TAREAS PENDIENTES PARA Z.AI

### **PRIORIDAD ALTA** 🔴

#### **1. Traducción de Italiano (IT) - 50 archivos**

**Archivos que necesitan traducción (están en inglés):**

```bash
# Ver archivos copiados recientemente en IT
ls -lt apps/dashboard/src/lib/i18n/translations/it/ | head -20
```

**Archivos críticos a traducir primero:**
1. `common.json` - Palabras comunes (botones, acciones)
2. `navigation.json` - Menú de navegación
3. `sidebar.json` - Sidebar (si existe)
4. `dashboard-bundui.json` - Dashboard principal
5. `errors.json` - Mensajes de error

**Proceso recomendado:**
```bash
# Opción A: Traductor profesional (recomendado)
# - Contratar traductor nativo italiano
# - Costo: ~$150-250 USD
# - Tiempo: 2-3 días
# - Calidad: Alta

# Opción B: DeepL API (automático)
# - Usar DeepL API para traducción inicial
# - Revisar manualmente después
# - Costo: Gratis (hasta 500k chars/mes)
# - Tiempo: 2-3 horas
# - Calidad: Media-Alta

# Opción C: Manual
# - Traducir tú mismo
# - Tiempo: 8-12 horas
# - Calidad: Depende de tu nivel de italiano
```

**Después de traducir:**
```bash
# Validar que todo esté bien
node scripts/validate-concepts-coherence.js
```

#### **2. Traducción de Coreano (KO) - 50 archivos**

**Mismo proceso que IT pero para coreano.**

**Archivos críticos:**
1. `common.json`
2. `navigation.json`
3. `sidebar.json`
4. `dashboard-bundui.json`
5. `errors.json`

**Después de traducir:**
```bash
node scripts/validate-concepts-coherence.js
```

#### **3. Completar FR, PT, DE, AR, ZH - 3-4 archivos cada uno**

Estos idiomas solo tienen 3-4 archivos pendientes. Son rápidos de completar.

**Validar qué archivos faltan:**
```bash
node scripts/check-missing-files.js
```

---

### **PRIORIDAD MEDIA** 🟡

#### **4. Implementar CAPA 3: React Provider/Hook**

**Contexto:**
- CAPA 1 (Semantic IDs): ✅ Funciona
- CAPA 2 (Terminology Engine): ✅ Funciona
- CAPA 3 (UI Strings): ⚠️ PENDIENTE

**Qué falta implementar:**

**4.1. TerminologyProvider (React Context)**

Crear archivo: `packages/utils/src/i18n/terminology/TerminologyProvider.tsx`

```typescript
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { TerminologySnapshot, ConceptID } from './types';

interface TerminologyContextValue {
  snapshot: TerminologySnapshot;
  term: (conceptId: ConceptID) => string;
}

const TerminologyContext = createContext<TerminologyContextValue | null>(null);

export function TerminologyProvider({
  snapshot,
  children,
}: {
  snapshot: TerminologySnapshot;
  children: ReactNode;
}) {
  const term = (conceptId: ConceptID): string => {
    return snapshot.concepts[conceptId] || conceptId;
  };

  return (
    <TerminologyContext.Provider value={{ snapshot, term }}>
      {children}
    </TerminologyContext.Provider>
  );
}

export function useTerminology() {
  const context = useContext(TerminologyContext);
  if (!context) {
    throw new Error('useTerminology must be used within TerminologyProvider');
  }
  return context;
}
```

**4.2. TerminologyHydration Component**

Crear archivo: `packages/utils/src/i18n/terminology/TerminologyHydration.tsx`

```typescript
import React from 'react';
import { TerminologySnapshot } from './types';

export function TerminologyHydration({
  snapshot,
}: {
  snapshot: TerminologySnapshot;
}) {
  return (
    <script
      id="terminology-snapshot"
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(snapshot),
      }}
    />
  );
}
```

**4.3. Actualizar index.ts para exportar nuevos componentes**

```typescript
// En packages/utils/src/i18n/terminology/index.ts

// Agregar:
export { TerminologyProvider, useTerminology } from './TerminologyProvider';
export { TerminologyHydration } from './TerminologyHydration';
```

**4.4. Uso en apps/dashboard/app/layout.tsx**

```typescript
import { getSnapshot } from '@vibethink/utils/i18n/terminology';
import { TerminologyProvider } from '@vibethink/utils/i18n/terminology';

export default async function RootLayout({ children }) {
  // Preload conceptos críticos
  const snapshot = await getSnapshot(
    [
      'concept.booking.action.reserve',
      'concept.booking.action.cancel',
      'concept.booking.action.confirm',
      // ... más conceptos
    ],
    {
      locale: 'es', // O detectar del user
      productContext: 'hotel',
    }
  );

  return (
    <html>
      <body>
        <TerminologyProvider snapshot={snapshot}>
          {children}
        </TerminologyProvider>
      </body>
    </html>
  );
}
```

**4.5. Uso en Client Components**

```typescript
'use client';

import { useTerminology } from '@vibethink/utils/i18n/terminology';

export function BookingButton() {
  const { term } = useTerminology();

  return (
    <button>
      {term('concept.booking.action.reserve')}
      {/* → "Reservar" (en español) */}
    </button>
  );
}
```

**Tiempo estimado:** 2-3 horas

---

#### **5. Registrar TranslationLoader Real**

**Contexto:**
El sistema usa un `TranslationLoader` para cargar archivos JSON, pero actualmente no está registrado.

**Crear:** `apps/dashboard/lib/i18n/translation-loader.ts`

```typescript
import { TranslationLoader } from '@vibethink/utils';

// Cache interno
const cache = new Map<string, any>();

export const dashboardTranslationLoader: TranslationLoader = {
  load: async (locale: string, namespace: string) => {
    try {
      const data = await import(
        `@/lib/i18n/translations/${locale}/${namespace}.json`
      );
      return data.default;
    } catch (error) {
      console.error(`Failed to load ${locale}/${namespace}:`, error);
      return null;
    }
  },

  loadSync: (locale: string, namespace: string) => {
    const key = `${locale}:${namespace}`;
    return cache.get(key) || null;
  },

  preload: async (locale: string, namespace: string) => {
    const key = `${locale}:${namespace}`;
    const data = await dashboardTranslationLoader.load(locale, namespace);
    if (data) {
      cache.set(key, data);
    }
  },

  isPreloaded: (locale: string, namespace: string) => {
    const key = `${locale}:${namespace}`;
    return cache.has(key);
  },

  clearCache: (locale?: string, namespace?: string) => {
    if (locale && namespace) {
      const key = `${locale}:${namespace}`;
      cache.delete(key);
    } else if (locale) {
      // Clear all for locale
      for (const [key] of cache) {
        if (key.startsWith(`${locale}:`)) {
          cache.delete(key);
        }
      }
    } else {
      cache.clear();
    }
  },
};
```

**Registrar en layout.tsx:**

```typescript
import { registerTranslationLoader } from '@vibethink/utils';
import { dashboardTranslationLoader } from '@/lib/i18n/translation-loader';

// En el top del archivo, antes del layout
registerTranslationLoader(dashboardTranslationLoader);

export default function RootLayout({ children }) {
  // ...
}
```

**Tiempo estimado:** 1 hora

---

#### **6. Automatizar Validación en CI/CD**

**Crear:** `.github/workflows/validate-i18n.yml`

```yaml
name: Validate i18n Concepts

on:
  push:
    paths:
      - 'apps/dashboard/src/lib/i18n/translations/**/*.json'
  pull_request:
    paths:
      - 'apps/dashboard/src/lib/i18n/translations/**/*.json'

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Validate concepts coherence
        run: node scripts/validate-concepts-coherence.js

      - name: Check for missing files
        run: node scripts/check-missing-files.js
```

**Tiempo estimado:** 30 minutos

---

### **PRIORIDAD BAJA** 🟢

#### **7. Features Avanzados (Después de completar traducciones)**

**🚀 NUEVOS FEATURES DOCUMENTADOS Y LISTOS PARA IMPLEMENTAR:**

Después de completar las traducciones de IT/KO y la CAPA 3, hay 2 features avanzados documentados:

**Feature 1: Multi-Product Concept Sharing (Restaurant)**
- **Documento:** `docs/architecture/I18N_MULTI_PRODUCT_CONCEPT_SHARING.md`
- **Estado:** 📋 Política definida, scripts pendientes de crear
- **Qué hace:** Permite agregar nuevos productos (ej: Restaurant) de forma óptima
- **Beneficios:**
  - 0% duplicación de conceptos
  - Validación automática de conceptos compartidos
  - Scripts de automatización
  - < 30 min para agregar nuevo producto
- **Scripts a crear:**
  1. `validate-shared-concepts.js` - Detecta conceptos compartidos duplicados
  2. `add-product.js` - Wizard interactivo para agregar producto
  3. Pre-commit hook para validar antes de commit

**Feature 2: Selective Language Loading (Filtro por Workspace)**
- **Documento:** `docs/architecture/I18N_SELECTIVE_LANGUAGE_LOADING.md`
- **Estado:** 📋 Política definida, requiere CAPA 3 completa
- **Qué hace:** Permite que cada workspace solo cargue 2-3 idiomas en vez de 9
- **Beneficios:**
  - 67-78% reducción en bundle size
  - 65% más rápido en carga de idiomas
  - Mejor experiencia de usuario
- **Requiere:**
  1. CAPA 3 completa (TerminologyProvider + Snapshot)
  2. Configuración de workspace en BD
  3. API endpoint para cambio de idioma
  4. TranslationLoader con filtro

**Orden de implementación recomendado:**
1. ✅ Completar traducciones IT/KO (ALTA PRIORIDAD)
2. ⚙️ Implementar CAPA 3 completa (MEDIA PRIORIDAD)
3. 🔧 Implementar Feature 1: Multi-Product Concept Sharing
4. 🔧 Implementar Feature 2: Selective Language Loading

---

#### **8. Agregar Nuevos Productos (Ejemplo: Restaurant)**

**IMPORTANTE:** Ahora existe una política completa para esto.

Seguir el workflow documentado en `docs/architecture/I18N_MULTI_PRODUCT_CONCEPT_SHARING.md`:

```bash
# 1. Crear archivo EN
touch apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json

# 2. Editar contenido
cat > apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json << 'EOF'
{
  "concept": {
    "restaurant": {
      "resource": { "table": "Table", "kitchen": "Kitchen" },
      "item": { "menu": "Menu", "dish": "Dish" },
      "action": { "order": "Order", "serve": "Serve" }
    }
  }
}
EOF

# 3. Copiar a todos los idiomas
for locale in es fr pt de it ko ar zh; do
  cp apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json \
     apps/dashboard/src/lib/i18n/translations/$locale/
done

# 4. Validar
node scripts/validate-concepts-coherence.js

# 5. Traducir manualmente cada idioma

# 6. Validar nuevamente
node scripts/validate-concepts-coherence.js

# 7. Commit
git add apps/dashboard/src/lib/i18n/translations/*/concept-restaurant.json
git commit -m "feat(i18n): Add restaurant concepts (9 locales)"
```

**Tiempo estimado:** 2-3 horas por producto

---

## 🔧 HERRAMIENTAS DE VALIDACIÓN PARA Z.AI

### **Scripts de Validación i18n (Usar ANTES de marcar como completo)**

```bash
# 1. VALIDACIÓN PRINCIPAL - Coherencia de conceptos (OBLIGATORIO)
node scripts/validate-concepts-coherence.js
# ✅ Verifica:
#   - Todos los idiomas tienen mismos archivos
#   - Todos los archivos tienen mismas keys
#   - No hay duplicados entre base y product
#   - No hay traducciones vacías
# 🎯 Debe pasar SIN errores antes de commit

# 2. VERIFICAR ARCHIVOS FALTANTES (Rápido)
node scripts/check-missing-files.js
# ✅ Muestra rápidamente qué archivos faltan en cada idioma
# 🎯 Útil para saber cuánto trabajo queda

# 3. ARREGLO AUTOMÁTICO (Si hay problemas)
node scripts/fix-concepts-coherence.js
# ✅ Arregla automáticamente:
#   - Sincroniza keys entre idiomas
#   - Elimina duplicados
#   - Preserva traducciones existentes
# ⚠️ Revisar cambios antes de commit

# 4. COPIAR ARCHIVOS FALTANTES (Si faltan archivos completos)
node scripts/copy-missing-translation-files.js
# ✅ Copia archivos desde EN a idiomas que les faltan
# 🎯 Útil al agregar nuevo producto o idioma

# 5. SINCRONIZAR ESTRUCTURA (Si estructura difiere)
node scripts/sync-translations-structure.js
# ✅ Sincroniza estructura interna de archivos JSON
# ✅ Preserva traducciones existentes
```

### **Validación TypeScript y Build**

```bash
# Validar TypeScript (paquete utils)
cd packages/utils && npx tsc --noEmit
# ✅ Debe pasar sin errores TypeScript

# Validar Next.js build (apps/dashboard)
cd apps/dashboard && npx next build
# ✅ Debe compilar sin errores
# ⚠️ Puede tomar 2-3 minutos

# Levantar servidor de desarrollo (Testing)
cd apps/dashboard && npm run dev
# 🌐 Abrir: http://localhost:3005/dashboard-bundui/projects-v2
# 🎯 Probar cambio de idioma en UI
```

### **Workflow Completo de Validación (RECOMENDADO)**

```bash
# PASO 1: Validar coherencia
node scripts/validate-concepts-coherence.js

# PASO 2: Si hay errores, arreglar automáticamente
node scripts/fix-concepts-coherence.js

# PASO 3: Validar de nuevo (debe pasar)
node scripts/validate-concepts-coherence.js

# PASO 4: Validar TypeScript
cd packages/utils && npx tsc --noEmit

# PASO 5: Validar Next.js build
cd apps/dashboard && npx next build

# PASO 6: Probar en navegador
cd apps/dashboard && npm run dev
# Abrir http://localhost:3005/dashboard-bundui/projects-v2
# Cambiar idioma y verificar traducciones

# PASO 7: Si todo pasa, commit
git add .
git commit -m "feat(i18n): [descripción de cambios]"
```

### **Arreglos Automáticos**

```bash
# Arreglar coherencia automáticamente
node scripts/fix-concepts-coherence.js

# Copiar archivos faltantes
node scripts/copy-missing-translation-files.js

# Sincronizar estructura
node scripts/sync-translations-structure.js
```

### **Testing**

```bash
# Levantar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3005/dashboard-bundui/projects-v2

# Probar cambio de idioma en UI
```

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

**Para entender el sistema:**
1. `GUIA_MANTENIMIENTO_CONCEPTOS.md` - Workflow completo
2. `ARCHIVOS_DISABLED_ARREGLADOS.md` - Qué arregló Claude
3. `VALIDACION_FINAL_3_CAPAS.md` - Estado actual

**Para Product Owner:**
1. `REPORTE_PRODUCT_OWNER_2025-12-26.md` - Reporte ejecutivo

**Para aprender:**
1. `EXPLICACION_PARA_ADOLESCENTE.md` - Explicación simple

**Para arquitectura:**
1. `docs/architecture/I18N_3_LAYERS_ARCHITECTURE.md`
2. `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`

---

## ⚠️ REGLAS IMPORTANTES

### **1. NUNCA Modificar Archivos TypeScript Sin Validar**

```bash
# ❌ MALO
# Editar packages/utils/src/i18n/terminology/engine.ts
# Sin ejecutar: npx tsc --noEmit

# ✅ BUENO
# Editar packages/utils/src/i18n/terminology/engine.ts
cd packages/utils && npx tsc --noEmit
# Si pasa, entonces commit
```

### **2. SIEMPRE Usar EN Como Master**

```bash
# ❌ MALO: Crear concepto solo en ES
touch apps/dashboard/src/lib/i18n/translations/es/concept-restaurant.json

# ✅ BUENO: Crear primero en EN, luego copiar
touch apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json
for locale in es fr pt de it ko ar zh; do
  cp .../en/concept-restaurant.json .../lang/
done
```

### **3. SIEMPRE Validar Antes de Commit**

```bash
# ❌ MALO
git add .
git commit -m "Add translations"

# ✅ BUENO
node scripts/validate-concepts-coherence.js
# Si pasa, entonces:
git add .
git commit -m "feat(i18n): Add restaurant concepts (9 locales)"
```

### **4. NUNCA Duplicar Conceptos Entre Base y Producto**

```bash
# ❌ MALO
# concept.json tiene "reserve"
# concept-hotel.json TAMBIÉN tiene "reserve"

# ✅ BUENO
# concept.json tiene "reserve"
# concept-hotel.json tiene "suite" (único de hotel)
```

---

## 🎯 PLAN DE TRABAJO SUGERIDO

### **Semana 1: Traducciones**

**Lunes-Martes:**
- Contratar traductores para IT y KO
- Enviar archivos críticos primero

**Miércoles-Jueves:**
- Recibir traducciones
- Validar con `validate-concepts-coherence.js`
- Corregir errores si los hay

**Viernes:**
- Completar FR, PT, DE, AR, ZH (3-4 archivos cada uno)
- Validar TODO
- Commit

### **Semana 2: Implementación CAPA 3**

**Lunes:**
- Implementar TerminologyProvider
- Implementar TerminologyHydration
- Implementar useTerminology hook

**Martes:**
- Registrar TranslationLoader
- Testear en navegador
- Validar que funcione

**Miércoles:**
- Automatizar CI/CD
- Testear GitHub Actions

**Jueves-Viernes:**
- Agregar primer producto nuevo (Restaurant)
- Documentar cualquier issue encontrado
- Demo para stakeholders

---

## ✅ CHECKLIST DE VALIDACIÓN

Antes de considerar el trabajo "completado", verificar:

- [ ] IT: 50 archivos traducidos y validados
- [ ] KO: 50 archivos traducidos y validados
- [ ] FR, PT, DE, AR, ZH: Archivos faltantes completados
- [ ] `validate-concepts-coherence.js` pasa sin errores
- [ ] `npx tsc --noEmit` pasa sin errores (packages/utils)
- [ ] `npx next build` compila correctamente (apps/dashboard)
- [ ] TerminologyProvider implementado
- [ ] useTerminology hook implementado
- [ ] TranslationLoader registrado
- [ ] CI/CD configurado
- [ ] Pruebas manuales en navegador (9 idiomas)
- [ ] Documentación actualizada si necesario

---

## 🤝 COMUNICACIÓN CON CLAUDE

Si necesitas ayuda de Claude:

**Formato recomendado:**
```
Hola Claude, estoy trabajando en [TAREA].

Estado actual:
- ✅ Lo que ya funciona
- ❌ Lo que no funciona
- ⚠️ Lo que estoy intentando

Error encontrado:
[Copia el error aquí]

¿Puedes ayudarme a [ACCIÓN ESPECÍFICA]?
```

**Ejemplo:**
```
Hola Claude, estoy implementando TerminologyProvider.

Estado actual:
- ✅ Creé el archivo TerminologyProvider.tsx
- ❌ Tengo error TypeScript: "Type X is not assignable to type Y"
- ⚠️ Estoy intentando usarlo en layout.tsx

Error encontrado:
Type 'TerminologySnapshot | undefined' is not assignable to type 'TerminologySnapshot'

¿Puedes ayudarme a arreglar este error de tipos?
```

---

## 📧 REPORTES DE PROGRESO

**Formato sugerido para reportar avances:**

```markdown
# Reporte de Progreso Z.Ai - [FECHA]

## ✅ Completado Hoy:
- Traducidos 20 archivos IT (40% progreso)
- Validado coherencia - pasa

## 🚧 En Progreso:
- Traduciendo archivos KO (10% progreso)

## ❌ Bloqueadores:
- Ninguno

## 📋 Próximos Pasos:
- Completar KO mañana
- Empezar CAPA 3 el jueves

## 🕐 Tiempo Invertido:
- 4 horas
```

---

**¡ÉXITO EN TU TRABAJO, Z.AI!** 🚀

Si tienes cualquier duda o necesitas ayuda, Claude está disponible para asistirte.

---

**CREADO POR:** Claude
**FECHA:** 2025-12-26
**PARA:** Z.Ai
**VERSIÓN:** 1.0.0
