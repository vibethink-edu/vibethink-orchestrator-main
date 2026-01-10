# 🧩 Guía de Porting Universal (Cualquier Componente a VibeThink)

> **Alcance:** Shadcn UI, Aceternity, Magic UI, Código de StackOverflow, o cualquier snippet externo.
> **Objetivo:** "VibeThink-ificar" cualquier código externo para que cumpla nuestros estándares.

---

## 1. El Filtro de Entrada (Antes de Copiar)

Antes de traer código ajeno, hazte estas 3 preguntas:
1.  **¿Es compatible con React 19?** (Evita librerías viejas que dependen de `defaultProps`).
2.  **¿Es compatible con Tailwind v4?** (Si usa CSS Modules o Sass, requerirá refactorización).
3.  **¿Tiene licencia compatible?** (MIT, Apache 2.0, o comprada).

---

## 2. Dónde Ponerlo (Estructura)

*   **Componentes UI Genéricos** (Botones, Cards, Effects):
    *   `packages/ui/src/components/ui/` (si es estándar Shadcn).
    *   `packages/ui/src/components/extensions/` (si es algo exótico/premium).
*   **Componentes de Negocio** (Tablas complejas, Widgets):
    *   `apps/dashboard/src/components/` (si es solo para dashboard).

---

## 3. Proceso de Adaptación ("VibeThink-ificación")

### Paso A. Limpieza de Imports
El código externo suele traer imports raros. Normalízalos:
*   ❌ `import { cn } from "@/lib/utils"`
*   ✅ `import { cn } from "@vibethink/utils"`

### Paso B. Tipado Estricto (TypeScript)
Muchos ejemplos vienen en JS o con `any`.
*   ❌ `props: any`
*   ✅ Define la interface `ComponentProps`.
*   ✅ Usa `React.ComponentProps<"div">` para heredar props nativas.

### Paso C. Sistema de Diseño (Tailwind)
Asegura que use nuestras variables CSS (tokens):
*   ❌ `bg-blue-500` (Colores hardcoded)
*   ✅ `bg-primary` (Tokens semánticos)
*   ✅ `text-muted-foreground`

### Paso D. Client vs Server
*   ¿Usa `useState`, `useEffect`, `onClick`?
*   👉 **OBLIGATORIO:** Agrega `"use client";` al inicio del archivo.

---

## 4. Internacionalización (i18n)

Si el componente trae texto visible (Labels, Buttons, Placeholders):
1.  **NO lo dejes hardcoded.**
2.  Recibe el texto vía **props** (para componentes UI puros).
    *   `title?: string;`
    *   `label: string;`
3.  O usa `useTranslation()` si es un componente de negocio complejo.

---

## 5. Registro (Vendor Tracking)

Si copiaste el código de una librería externa, regístralo para futuras auditorías.

1.  Abre `docs/references/VENDOR_VERSIONS.md`.
2.  Agrega una entrada:
    ```markdown
    | Componente | Origen | Versión | Fecha | Notas |
    |------------|--------|---------|-------|-------|
    | `MagicCard`| MagicUI| v2.1    | 2026-01-09 | Adaptado a Tailwind v4 |
    ```

---

## 💡 Ejemplo Práctico: "FancyButton"

**Código Original (Externo):**
```jsx
// fancy-button.jsx
export default function FancyButton({ text }) {
  return <button className="my-btn">{text}</button>
}
```

**Código VibeThink (Adaptado):**
```tsx
// packages/ui/src/components/extensions/fancy-button.tsx
"use client"; // Si tiene interactividad

import { cn } from "@vibethink/utils"; // Import del monorepo

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // Texto vía prop para i18n
}

export function FancyButton({ label, className, ...props }: FancyButtonProps) {
  // Usa tokens semánticos (bg-primary)
  return (
    <button className={cn("bg-primary text-primary-foreground", className)} {...props}>
      {label}
    </button>
  );
}
```

---
**Regla de Oro:** "Hazlo parecer como si lo hubiéramos escrito nosotros desde el día 1".
