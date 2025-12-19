# 🎨 Shadcn UI First Policy

**Última actualización**: 2025-12-18  
**Estado**: ⚠️ OBLIGATORIO

---

## 📋 Principio Fundamental

**Este proyecto es SIEMPRE "Shadcn UI First".**

Todos los dashboards, componentes y sistemas deben basarse en Shadcn UI.

---

## ✅ Qué Significa "Shadcn UI First"

### 1. Componentes Base
**Siempre usar componentes de Shadcn UI como base:**

```typescript
// ✅ CORRECTO
import { Button, Card, Dialog } from '@vibethink/ui';

// ❌ INCORRECTO
import { Button } from 'react-bootstrap';
import { Card } from 'antd';
```

### 2. Patrones de Diseño
**Seguir los patrones de Shadcn UI:**

```typescript
// ✅ CORRECTO: Patrón Shadcn UI
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>

// ❌ INCORRECTO: Patrón custom o de otra librería
<CustomCard title="Title" description="Description">
  Content
</CustomCard>
```

### 3. Estructura
**Usar la estructura de archivos de Shadcn UI:**

```
components/
├── ui/              ← Componentes base de Shadcn
│   ├── button.tsx
│   ├── card.tsx
│   └── dialog.tsx
└── custom/          ← Componentes custom basados en Shadcn
    ├── data-table.tsx
    └── chart-widget.tsx
```

---

## 📦 Paquete UI del Proyecto

### `@vibethink/ui`
Todos los componentes de Shadcn UI están en `@vibethink/ui`:

```typescript
// ✅ CORRECTO: Usar @vibethink/ui
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Sidebar,
  SidebarProvider
} from '@vibethink/ui';
```

### Ubicación
```
packages/ui/               ← Paquete @vibethink/ui
├── src/
│   └── components/
│       └── ui/           ← Componentes Shadcn
└── package.json
```

---

## 🚫 Prohibiciones

### ❌ NUNCA Usar Otras Librerías de UI

**Prohibido**:
- Material-UI (MUI)
- Ant Design
- Chakra UI
- React Bootstrap
- Mantine
- Cualquier otra librería de UI

**Razón**: Mantener consistencia visual y arquitectónica.

### ❌ NUNCA Crear Componentes Desde Cero

Si necesitas un componente nuevo:

1. ✅ Buscar si existe en Shadcn UI
2. ✅ Instalarlo desde Shadcn UI
3. ✅ Adaptarlo si es necesario
4. ❌ NO crearlo desde cero

**Ejemplo**:
```bash
# ✅ CORRECTO: Instalar desde Shadcn
npx shadcn@latest add data-table

# ❌ INCORRECTO: Crear custom
# No crear DataTable.tsx desde cero
```

---

## ✅ Workflow Correcto

### Para Nuevos Componentes

1. **Buscar en Shadcn UI**
   ```
   https://ui.shadcn.com/docs/components
   ```

2. **Instalar el componente**
   ```bash
   npx shadcn@latest add [component-name]
   ```

3. **Importar desde @vibethink/ui**
   ```typescript
   import { ComponentName } from '@vibethink/ui';
   ```

4. **Adaptar si es necesario**
   - Mantener la estructura base
   - Agregar estilos con Tailwind
   - No cambiar la API del componente

### Para Componentes Custom

Si necesitas algo que no existe en Shadcn:

1. **Basar en componentes Shadcn existentes**
   ```typescript
   // ✅ CORRECTO: Custom basado en Shadcn
   import { Card, CardContent } from '@vibethink/ui';
   
   export function CustomWidget() {
     return (
       <Card>
         <CardContent>
           {/* Tu contenido custom */}
         </CardContent>
       </Card>
     );
   }
   ```

2. **Usar primitivos de Radix UI**
   ```typescript
   // ✅ CORRECTO: Si no hay en Shadcn, usar Radix
   import * as Popover from '@radix-ui/react-popover';
   ```

3. **Mantener estilo consistente**
   - Usar variables CSS de Shadcn
   - Usar clases de Tailwind
   - Seguir el diseño system de Shadcn

---

## 🎨 Estilos y Theming

### Variables CSS
**Usar las variables de Shadcn UI:**

```css
/* ✅ CORRECTO */
.my-component {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}

/* ❌ INCORRECTO */
.my-component {
  background: #ffffff;
  color: #000000;
  border: 1px solid #cccccc;
}
```

### Tailwind Classes
**Usar las clases de Tailwind configuradas para Shadcn:**

```typescript
// ✅ CORRECTO
<div className="bg-background text-foreground border border-border">

// ❌ INCORRECTO
<div className="bg-white text-black border border-gray-300">
```

---

## 📚 Recursos

### Documentación Oficial
- [Shadcn UI Docs](https://ui.shadcn.com/)
- [Shadcn UI Components](https://ui.shadcn.com/docs/components)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

### En Este Proyecto
- `packages/ui/` - Paquete @vibethink/ui
- `apps/dashboard/` - Ejemplos de uso
- `AGENTS.md` - Reglas generales

---

## ⚠️ Excepciones

### Casos Especiales

**Solo en casos EXTREMOS** donde Shadcn UI no tiene solución:

1. **Consultar con el equipo**
2. **Documentar por qué Shadcn no funciona**
3. **Buscar alternativas basadas en Radix UI**
4. **Como último recurso**, considerar otra librería

**Ejemplo de excepción válida**:
- Componente muy específico (ej: editor de video)
- No existe en Shadcn ni en Radix
- No es posible crearlo desde primitivos

---

## 📋 Checklist

Antes de agregar un componente:

- [ ] ¿Existe en Shadcn UI?
- [ ] ¿Está instalado en @vibethink/ui?
- [ ] ¿Puedo crearlo desde componentes Shadcn existentes?
- [ ] ¿Puedo usar primitivos de Radix UI?
- [ ] ¿He consultado la documentación de Shadcn?

Si todas las respuestas son "no", entonces considera alternativas.

---

**IMPORTANTE**: "Shadcn UI First" no es una sugerencia, es una **regla arquitectónica obligatoria** del proyecto.

---

**Última actualización**: 2025-12-18  
**Aprobado por**: Usuario  
**Criticidad**: ⚠️ MÁXIMA




