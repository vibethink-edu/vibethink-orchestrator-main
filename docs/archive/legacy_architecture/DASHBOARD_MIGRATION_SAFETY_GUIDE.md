# 🛡️ Guía de Seguridad para la Migración de Dashboards - VibeThink Orchestrator

**Fecha**: 2025-12-18  
**Estado**: ✅ Implementado y Documentado  
**Propósito**: Prevenir la ruptura de estilos y funcionalidades durante la migración de dashboards Bundui Premium.

---

## 🎯 Problema Identificado

Durante la migración de dashboards, es común que se rompan estilos o funcionalidades debido a:
- Imports incorrectos de componentes UI.
- Duplicación de estilos o componentes.
- Falta de uso de variables CSS semánticas.
- Inconsistencias en la estructura del monorepo.

Este documento y el script `dashboard-migration-guard.cjs` establecen un protocolo para mitigar estos riesgos.

---

## 🛠️ Guardrails Implementados

Se ha creado el script `packages/cli/src/validation/dashboard-migration-guard.cjs` para validar automáticamente los dashboards migrados.

### Uso del Guardrail

#### Validar Dashboard Específico
```bash
npm run validate:dashboard <nombre-del-dashboard>
# O directamente:
node packages/cli/src/validation/dashboard-migration-guard.cjs <nombre-del-dashboard>
```

Ejemplo:
```bash
npm run validate:dashboard ecommerce
```

#### Validar Componentes Compartidos (Global)
```bash
npm run validate:dashboard:global
# O directamente:
node packages/cli/src/validation/dashboard-migration-guard.cjs --global
```

Este comando escanea `src/shared/components/` para detectar imports incorrectos que pueden afectar todos los dashboards.

---

## ✅ Validaciones del Guardrail

El script realiza las siguientes comprobaciones:

### 1. **Estructura del Directorio**
- Verifica que el directorio del dashboard exista en `apps/dashboard/app/dashboard-bundui/`.
- Asegura la presencia de `page.tsx`.
- **Nota**: El directorio `components/` es **opcional** (páginas simples como empty states no lo requieren).
- Si existe `components/`, el barrel file `index.ts` es opcional (puede causar loops de importación).

### 2. **Imports de Componentes UI**
- **Regla**: Todos los imports de componentes de `@vibethink/ui` deben ser directos (`@vibethink/ui`), no específicos de componente (`@vibethink/ui[component]`).
- **Ejemplo**: 
  - ✅ Correcto: `import { Button } from '@vibethink/ui';`
  - ❌ Incorrecto: `import { Button } from '@vibethink/uibutton';`
  - ❌ Incorrecto: `import { Button } from '@/components/ui/button';`

### 3. **Uso de Componentes Compartidos**
- Verifica que los helpers compartidos como `CustomDateRangePicker`, `CardActionMenus`, `DateTimePicker` se importen desde `@/shared/components/` cuando sean necesarios.

### 4. **Consistencia de Estilos**
- **No Hardcodeo de Colores**: Detecta colores hardcodeados (ej. `#FFFFFF`, `rgb(255,255,255)`) y sugiere usar variables CSS semánticas o clases de Tailwind.
- **Uso de `cn`**: Recomienda el uso de la utilidad `cn` (`packages/utils/src/cn.ts`) para combinar clases de Tailwind de forma condicional y legible.
- **No Inline Styles**: Detecta uso de `style={{}}` y sugiere usar `className` con Tailwind.

### 5. **Barrel Files**
- Asegura que todos los componentes `.tsx` dentro del directorio `components/` del dashboard estén exportados correctamente en su `index.ts`.

### 6. **Variables CSS Semánticas**
- Detecta uso de variables CSS como `var(--background)`, `var(--foreground)`, etc.
- Sugiere usar variables semánticas en lugar de valores hardcodeados.

### 7. **Validación de Assets (Imágenes)** 🆕
- **Referencias locales**: Verifica que todas las imágenes referenciadas (`/images/...`) existan en `public/images/`.
- **URLs externas**: Detecta y advierte sobre URLs externas (pueden fallar o ser lentas).
- **bundui-images.netlify.app**: Detecta específicamente esta URL externa como **error crítico** (debe reemplazarse).
- **Estructura de directorios**: Verifica que `public/images/avatars/` y `public/images/products/` existan.
- **Conteo de assets**: Reporta cuántos avatares y productos están disponibles.

### 8. **Duplicación de Estilos**
- Verifica que no haya archivos CSS locales en el dashboard.
- Todos los estilos deben estar en `apps/dashboard/app/globals.css` o usar variables CSS.

---

## 📋 Checklist de Migración con Guardrails

Para cada dashboard pendiente:

1. **Pre-validación**:
   ```bash
   npm run validate:dashboard <nombre-del-dashboard>
   ```
   - Verificar que no haya errores críticos antes de empezar.

2. **Copiar Componentes**:
   - Copiar los archivos `.tsx` del dashboard de `apps/bundui-reference/app/dashboard/(auth)/[dashboard]/components/` a `apps/dashboard/app/dashboard-bundui/[dashboard]/components/`.

3. **Crear `page.tsx` y `index.ts`**:
   - Crear el archivo `apps/dashboard/app/dashboard-bundui/[dashboard]/page.tsx`.
   - Crear el barrel file `apps/dashboard/app/dashboard-bundui/[dashboard]/components/index.ts` y exportar todos los componentes.

4. **Adaptar Imports**:
   - Ejecutar el script de corrección masiva de imports (ver "Comandos Útiles" abajo) o corregir manualmente:
     - `@/components/ui/*` → `@vibethink/ui`
     - `@vibethink/ui[component]` → `@vibethink/ui`
     - Rutas de helpers compartidos: `@/shared/components/`

5. **Revisar Estilos**:
   - Asegurarse de que no haya colores hardcodeados.
   - Utilizar `cn` para la combinación de clases.
   - Verificar que los estilos se adapten correctamente al tema (dark/light mode).

6. **Copiar Assets (Imágenes)** 🆕:
   - Copiar imágenes desde `bundui-reference/public/images/` a `apps/dashboard/public/images/`.
   - Verificar estructura: `public/images/avatars/` y `public/images/products/`.
   - Reemplazar URLs externas (`bundui-images.netlify.app`) con rutas locales (`/images/...`).
   - El guardrail ahora valida automáticamente que las imágenes existan.

7. **Post-validación**:
   ```bash
   npm run validate:dashboard <nombre-del-dashboard>
   ```
   - Resolver cualquier `ERROR` o `ADVERTENCIA` reportada por el script.

7. **Validación Global** (Opcional pero recomendado):
   ```bash
   npm run validate:dashboard:global
   ```
   - Verificar que los componentes compartidos no tengan imports incorrectos.

9. **Crear Alias de Rutas (si es necesario)**:
   - Si el sidebar o referencias usan rutas diferentes (ej. `/dashboard/pages/...` vs `/dashboard-bundui/pages/...`):
   - Crear archivos de re-export en `app/(dashboard)/dashboard/pages/...`
   - Ejemplo para error 403:
     ```typescript
     // app/(dashboard)/dashboard/pages/error/403/page.tsx
     export { default } from "../../../../../dashboard-bundui/pages/error/403/page";
     ```
   - **Nota**: Calcular niveles relativos correctamente (5 niveles desde `(dashboard)/dashboard/pages/error/403/`)

10. **Verificar en Navegador**:
   - Iniciar el servidor (`.\scripts\start-dashboard.ps1`).
   - Navegar a `http://localhost:3005/dashboard-bundui/[dashboard]` o `http://localhost:3005/dashboard/[dashboard]` (si hay alias).
   - Verificar que el dashboard se renderice correctamente y que los estilos sean consistentes.
   - Revisar la consola del navegador en busca de errores.

11. **Actualizar Documentación**:
   - Actualizar `docs/architecture/DASHBOARD_STATUS_CONSOLIDATED.md` con el estado del dashboard migrado.
   - Documentar errores encontrados en `docs/architecture/GUARDRAIL_IMPROVEMENTS.md`.

---

## 🚀 Comandos Útiles

### Iniciar servidor
```powershell
.\scripts\start-dashboard.ps1
```

### Detener servidor
```powershell
.\scripts\stop-dashboard.ps1
```

### Corregir imports masivamente (ejemplo para un dashboard)
```powershell
Get-ChildItem "apps/dashboard/app/dashboard-bundui/<nombre-del-dashboard>/components/*.tsx" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw;
  $content = $content -replace '@/components/ui/', '@vibethink/ui';
  $content = $content -replace '@vibethink/ui([a-z-]+)', '@vibethink/ui';
  Set-Content $_.FullName -Value $content
}
```

### Limpiar cache Next.js
```powershell
cd apps/dashboard
Remove-Item -Path ".next" -Recurse -Force
```

---

## 🎨 Consolidación de Estilos y Buenas Prácticas

### Principios Clave
- **Single Source of Truth**: `apps/dashboard/app/globals.css` es el único punto de entrada global.
- **Variables CSS Semánticas**: Todos los colores, fuentes y espaciados deben usar variables CSS definidas en `apps/dashboard/app/themes.css` o en `:root` de `globals.css`.
- **Tailwind CSS**: Utilizar clases de utilidad de Tailwind siempre que sea posible.
- **Component-Specific CSS**: Si un componente requiere estilos muy específicos que no pueden ser manejados por Tailwind o variables, estos deben residir junto al componente (ej. `packages/ui/src/components/extensions/minimal-tiptap/styles/`).
- **No Duplicación**: Evitar la creación de múltiples archivos `globals.css` o `tailwind.config.js` en subdirectorios de `apps/`.

### Archivos Clave de Estilos
- `apps/dashboard/tailwind.config.ts`: Configuración principal de Tailwind. **CRÍTICO**: Debe incluir `packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}` en `content` para escanear todos los componentes compartidos.
- `apps/dashboard/app/globals.css`: Estilos globales, imports de Tailwind y `themes.css`, definición de variables CSS semánticas y overrides base.
- `apps/dashboard/app/themes.css`: Definiciones de presets de temas (colores, radios, escalas, fuentes).

---

## 🔄 Mejora Continua del Guardrail

El guardrail se mejora iterativamente basado en errores encontrados durante las migraciones. Ver `docs/architecture/GUARDRAIL_IMPROVEMENTS.md` para:
- Errores encontrados y soluciones aplicadas
- Mejoras implementadas
- Estadísticas de validación
- Próximas mejoras planificadas

**Proceso**:
1. Durante migración, documentar errores encontrados
2. Analizar patrones de errores
3. Mejorar el guardrail con nuevas validaciones
4. Probar con dashboard migrado
5. Documentar en `GUARDRAIL_IMPROVEMENTS.md`

---

## 🛣️ Alias de Rutas para Páginas Especiales

### Cuándo Crear Alias

Si el sidebar o referencias usan rutas diferentes a donde están las páginas migradas, crear alias:

**Ejemplo**:
- Sidebar usa: `/dashboard/pages/error/403`
- Página está en: `/dashboard-bundui/pages/error/403`
- **Solución**: Crear alias en `app/(dashboard)/dashboard/pages/error/403/page.tsx`

### Cómo Crear Alias

1. **Crear estructura de directorios**:
   ```powershell
   New-Item -ItemType Directory -Path "app/(dashboard)/dashboard/pages/error/403" -Force
   ```

2. **Crear archivo de re-export**:
   ```typescript
   // app/(dashboard)/dashboard/pages/error/403/page.tsx
   export { default } from "../../../../../dashboard-bundui/pages/error/403/page";
   ```

3. **Calcular niveles relativos**:
   - Desde: `app/(dashboard)/dashboard/pages/error/403/page.tsx`
   - Hasta: `app/dashboard-bundui/pages/error/403/page.tsx`
   - Niveles: `../../../../../` (5 niveles hacia arriba)

### Patrón de Rutas Relativas

| Desde | Hasta | Niveles |
|-------|-------|---------|
| `(dashboard)/dashboard/pages/error/403/` | `dashboard-bundui/pages/error/403/` | `../../../../../` |
| `(dashboard)/dashboard/pages/empty-states/01/` | `dashboard-bundui/pages/empty-states/01/` | `../../../../../` |
| `(dashboard)/apps/ai-chat/` | `dashboard-bundui/ai-chat/` | `../../../` |

---

**Última actualización**: 2025-12-18
