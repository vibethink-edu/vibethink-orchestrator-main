# 📚 Integración Oficial de React Flow en VibeThink Orchestrator v1.0

## 🎯 Propósito

- Proveer una única fuente de verdad sobre cómo integrar, ubicar y mantener React Flow en el producto.
- Evitar ambigüedad, duplicidad y deuda técnica en la gestión de diagramas y flujos visuales.

---

## 🛡️ Política de Integración

- **React Flow NO debe acoplarse directamente a los layouts ni componentes base de Bundui Premium.**
- Los layouts de Bundui Premium son genéricos y sirven como contenedores, no como hosts de dependencias externas específicas.
- React Flow debe integrarse en features/apps, usando los layouts de Bundui Premium como contenedor visual.
- Si se requiere integración visual (theming, estilos), crear un wrapper desacoplado en `src/shared/components/react-flow/`.

---

## 🗂️ Ubicación Recomendada

```
src/
├── shared/
│   ├── components/
│   │   ├── bundui-premium/
│   │   │   └── layouts/
│   │   │       └── DashboardLayout.tsx
│   │   └── react-flow/
│   │       └── ReactFlowBunduiWrapper.tsx
│   └── demos/
│       └── react-flow/
│           └── FlowDemo.tsx
├── apps/
│   └── dashboard/
│       └── features/
│           └── flow-editor/
│               └── FlowEditor.tsx
```

---

## 🧩 Ejemplo de Uso

```tsx
// src/apps/dashboard/features/flow-editor/FlowEditor.tsx
import { DashboardLayout } from '@/shared/components/bundui-premium/layouts/DashboardLayout';
import { ReactFlowBunduiWrapper } from '@/shared/components/react-flow/ReactFlowBunduiWrapper';

export const FlowEditor = () => (
  <DashboardLayout>
    <ReactFlowBunduiWrapper />
  </DashboardLayout>
);
```

---

## 🧪 Demos y Tests

- **Demos:**
  - Todas las demos y playgrounds de React Flow deben ir en `src/shared/demos/react-flow/`.
  - Cada demo debe tener README explicando propósito y diferencias con la versión productiva.
- **Tests:**
  - Tests unitarios del wrapper en `src/shared/components/react-flow/__tests__/`.
  - Tests de integración en `tests/integration/react-flow.test.ts`.
  - Tests E2E en `tests/e2e/react-flow.spec.ts`.

---

## 🗑️ Deprecación y Limpieza

- Cualquier referencia, archivo o documentación legacy sobre React Flow debe eliminarse o marcarse como deprecada.
- Esta es la única fuente de verdad para futuras integraciones y mantenimientos.

---

## 🏷️ Notas finales

- Si se requiere actualizar la integración, este documento debe ser el primero en modificarse.
- Toda decisión de arquitectura sobre React Flow debe quedar registrada aquí. 