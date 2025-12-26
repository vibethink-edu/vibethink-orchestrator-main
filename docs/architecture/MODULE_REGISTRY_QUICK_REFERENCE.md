# Module Registry - Referencia Rápida para Agentes AI

**🚨 ÚNICA FUENTE DE VERDAD para módulos y componentes migrados**

---

## 📍 Ubicación

**Registro Principal:**
```
apps/dashboard/src/shared/data/module-registry.ts
```

**Protocolo Completo:**
```
docs/architecture/MODULE_REGISTRY_PROTOCOL.md
```

---

## ⚡ Checklist Rápido

### Antes de Migrar/Importar un Módulo

- [ ] **Consultar el registro:** ¿Ya existe este módulo?
  ```typescript
  import { getModuleById, getModuleByPath } from '@/shared/data/module-registry';
  const existing = getModuleById('module-id') || getModuleByPath('/path/to/module');
  ```

- [ ] **Validar compatibilidad del stack:**
  ```typescript
  import { validateStackCompatibility } from '@/shared/data/module-registry';
  const validation = validateStackCompatibility(module);
  if (!validation.compatible) {
    // Abortar o documentar issues
  }
  ```

- [ ] **Registrar el módulo** con metadata completa:
  - ID único
  - Nombre y ruta
  - Fuente (bundui-premium, react-flow, tiptap, etc.)
  - Versión de la fuente
  - Adaptaciones para monorepo/i18n
  - Dependencias específicas

---

## 🔍 Funciones Principales

### Verificar si existe un módulo

```typescript
import { getModuleById, getModuleByPath } from '@/shared/data/module-registry';

// Por ID
const hotel = getModuleById('hotel-dashboard');

// Por ruta
const module = getModuleByPath('/dashboard-bundui/hotel');
```

### Filtrar módulos

```typescript
import { getModulesBySource, getModulesByStatus } from '@/shared/data/module-registry';

// Por fuente
const bunduiModules = getModulesBySource('bundui-premium');
const reactFlowModules = getModulesBySource('react-flow');

// Por estado
const completeModules = getModulesByStatus('complete');
const partialModules = getModulesByStatus('partial');
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

## 📋 Template para Nuevo Módulo

```typescript
{
  id: "unique-module-id",
  name: "Module Name",
  path: "/dashboard-bundui/module-path",
  type: "dashboard" | "component" | "hook" | "utility" | "layout" | "extension" | "library",
  source: "bundui-premium" | "react-flow" | "tiptap" | "shadcn-ui-kit" | "custom" | "other",
  sourceUrl: "https://source-url.com",
  sourceVersion: "1.0.0",
  migratedAt: "2025-12-20T00:00:00Z",
  updatedAt: "2025-12-20T00:00:00Z",
  status: "complete" | "partial" | "deprecated" | "experimental",
  stackCompatibility: {
    react: "19.0.0",
    nextjs: "15.3.4",
    typescript: "5.9.2",
    tailwind: "4.1.10"
  },
  components: ["Component1", "Component2"],
  dependencies: ["dependency1", "dependency2"],
  adaptations: {
    monorepo: ["Cambio 1", "Cambio 2"],
    i18n: ["Adaptación i18n 1"],
    other: ["Otra adaptación"]
  },
  notes: "Notas adicionales",
  issues: ["Issue conocido 1"],
  i18nNamespace: "namespace-name",
  i18nCoverage: 100 // 0-100
}
```

---

## 🚨 Reglas Críticas

1. **NUNCA importar sin registrar**
2. **NUNCA modificar sin actualizar el registro**
3. **SIEMPRE validar compatibilidad antes de importar**
4. **SIEMPRE documentar adaptaciones** (monorepo, i18n, etc.)
5. **SIEMPRE actualizar `updatedAt` cuando modifiques un módulo**

---

## 📚 Fuentes Soportadas

| Fuente | Descripción | Ejemplo |
|--------|-------------|---------|
| `bundui-premium` | Bundui Premium Dashboard Templates | Hotel Dashboard |
| `bundui-original` | Bundui Original Source Code | Referencia externa |
| `shadcn-ui-kit` | shadcnuikit.com/components/ | Componentes premium |
| `react-flow` | reactflow.dev / @xyflow/react | Workflow Editor |
| `tiptap` | github.com/ueberdosis/tiptap | MinimalTiptapEditor |
| `shadcn-ui` | ui.shadcn.com | Componentes base |
| `custom` | Desarrollado internamente | Componentes propios |
| `other` | Otra fuente externa | Documentar fuente |

---

## 🔗 Referencias

- **Protocolo Completo:** `docs/architecture/MODULE_REGISTRY_PROTOCOL.md`
- **Evaluación de Bibliotecas:** `docs/architecture/EXTERNAL_LIBRARIES_EVALUATION.md`
- **AGENTS.md:** Sección "CRITICAL: Module Registry"

---

**Última actualización:** 2025-12-20  
**Para agentes AI:** Este es el documento de referencia rápida. Consulta el protocolo completo para detalles.







