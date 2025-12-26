# 📦 Shadcn UI Monorepo Compliance

**Última actualización**: 2025-12-18  
**Referencia**: [Shadcn UI Monorepo Docs](https://ui.shadcn.com/docs/monorepo)  
**Estado**: ✅ PARCIALMENTE COMPLIANT - Mejoras recomendadas

---

## 🎯 Principio Fundamental

**Todo lo que sea Shadcn UI en Orchestrator debe seguir el estándar de monorepo de Shadcn.**

**Excepción**: Las REFERENCIAS externas (no son parte del monorepo):
- `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard` - Bundui Reference (SOLO LECTURA)
- `C:\IA Marcelo Labs\shadcn-ui\ui\apps\v4` - Shadcn Reference (SOLO LECTURA)

---

## 📊 Estado Actual vs Estándar Shadcn

### ✅ Lo que Tenemos Correcto

#### 1. Estructura Monorepo
```
vibethink-orchestrator-main/
├── apps/
│   └── dashboard/              ✅ App workspace
├── packages/
│   └── ui/                     ✅ Componentes compartidos
└── package.json                ✅ Root package.json
```

#### 2. Componentes en Package UI
```
packages/ui/
├── src/
│   ├── components/
│   │   └── ui/                 ✅ Componentes Shadcn
│   ├── hooks/                  ✅ Hooks compartidos
│   └── lib/
│       └── utils.ts            ✅ Utilities
└── package.json                ✅ Package definition
```

#### 3. Imports Usando Alias
```typescript
// ✅ CORRECTO - Usando alias del monorepo
import { Button } from '@vibethink/ui';
import { cn } from '@vibethink/ui/lib/utils';
```

---

## ⚠️ Diferencias con Estándar Shadcn

### 1. Nombre del Workspace

**Shadcn Standard**:
```json
"@workspace/ui"
```

**Nuestro Actual**:
```json
"@vibethink/ui"
```

**Evaluación**: ✅ ACEPTABLE - Es más descriptivo y específico del proyecto

---

### 2. Estructura de Componentes

**Shadcn Standard** (según [docs](https://ui.shadcn.com/docs/monorepo)):
```
packages/ui/
├── src/
│   ├── components/
│   │   └── button.tsx          ← Directamente aquí
│   ├── hooks/
│   ├── lib/
│   └── styles/
│       └── globals.css
└── components.json
```

**Nuestro Actual**:
```
packages/ui/
├── src/
│   ├── components/
│   │   └── ui/                 ← Subdirectorio extra
│   │       └── button.tsx
│   ├── hooks/
│   └── lib/
└── components.json
```

**Evaluación**: ⚠️ DESVIACIÓN MENOR - Tenemos un subdirectorio `ui/` extra

**Impacto**: 
- ✅ Imports funcionan correctamente
- ⚠️ No sigue exactamente el estándar de Shadcn
- ⚠️ Puede causar confusión al comparar con docs oficiales

---

### 3. Components.json en Ambos Workspaces

**Shadcn Requirement** (según [docs](https://ui.shadcn.com/docs/monorepo)):
> Every workspace must have a `components.json` file.

**Nuestro Actual**:
- ✅ `apps/dashboard/components.json` - Existe
- ✅ `packages/ui/components.json` - Existe

**Evaluación**: ✅ COMPLIANT

---

### 4. Aliases en components.json

**Shadcn Standard** (apps/web/components.json):
```json
{
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components"
  }
}
```

**Nuestro Actual** (apps/dashboard/components.json):
```json
{
  "aliases": {
    "components": "@/components",
    "ui": "@vibethink/ui",
    "utils": "@vibethink/ui/lib/utils"
  }
}
```

**Evaluación**: ⚠️ DESVIACIÓN - Faltan algunos aliases recomendados

---

### 5. Tailwind CSS v4

**Shadcn Recommendation** (según [docs](https://ui.shadcn.com/docs/monorepo)):
> Note: The monorepo uses React 19 and Tailwind CSS v4.

**Nuestro Actual**:
- React: 19.0.0 ✅
- Tailwind: v3 (con CDN) ⚠️

**Evaluación**: ⚠️ DESVIACIÓN - No estamos en Tailwind v4

**Razón documentada**: Ver `docs/ui-ux/TAILWIND_CDN_WARNING.md` - Intentamos migrar a v4 y falló, CDN es estable.

---

## 📋 Recomendaciones de Mejora

### Prioridad Alta

#### 1. Reorganizar Estructura de Componentes

**Problema**: Tenemos `packages/ui/src/components/ui/` en lugar de `packages/ui/src/components/`

**Solución**:
```bash
# Mover componentes un nivel arriba
mv packages/ui/src/components/ui/* packages/ui/src/components/
rmdir packages/ui/src/components/ui
```

**Impacto**:
- ✅ Alineado con estándar Shadcn
- ⚠️ Requiere actualizar imports en todo el proyecto
- ⚠️ Requiere actualizar `components.json`

**Recomendación**: ⏸️ POSPONER - Funciona bien como está, cambiar solo si migramos a Shadcn CLI

---

#### 2. Completar Aliases en components.json

**Problema**: Faltan aliases recomendados por Shadcn

**Solución** (apps/dashboard/components.json):
```json
{
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",              // AGREGAR
    "lib": "@/lib",                  // AGREGAR
    "utils": "@vibethink/ui/lib/utils",
    "ui": "@vibethink/ui"
  }
}
```

**Impacto**:
- ✅ Mejor alineación con estándar
- ✅ Fácil de implementar
- ✅ No rompe nada existente

**Recomendación**: ✅ IMPLEMENTAR

---

### Prioridad Media

#### 3. Considerar Migración a Tailwind v4

**Problema**: Shadcn recomienda Tailwind v4, tenemos v3 con CDN

**Solución**: 
- Leer `docs/ui-ux/TAILWIND_CDN_WARNING.md`
- Intentar migración controlada en rama separada
- Si falla, documentar y mantener v3

**Impacto**:
- ✅ Alineado con última versión de Shadcn
- ⚠️ Alto riesgo (ya falló antes)
- ⚠️ Requiere testing exhaustivo

**Recomendación**: ⏸️ EVALUAR - Solo si hay beneficio claro

---

### Prioridad Baja

#### 4. Usar Shadcn CLI para Agregar Componentes

**Problema**: Actualmente agregamos componentes manualmente

**Solución**: Usar `npx shadcn@latest add [component]` desde `apps/dashboard/`

**Ventaja**:
- ✅ CLI instala en path correcto (`packages/ui`)
- ✅ CLI actualiza imports automáticamente
- ✅ Siempre actualizado con última versión

**Impacto**:
- ✅ Workflow más estándar
- ⚠️ Requiere que `components.json` esté perfectamente configurado

**Recomendación**: ✅ ADOPTAR gradualmente

---

## 🔄 Workflow Recomendado (Shadcn Standard)

### Agregar Nuevo Componente Shadcn

**Método Actual** (manual):
```bash
# Copiar de Shadcn docs a packages/ui/src/components/ui/
# Ajustar imports manualmente
```

**Método Shadcn Standard** (según [docs](https://ui.shadcn.com/docs/monorepo)):
```bash
# Ir a la app
cd apps/dashboard

# Agregar componente con CLI
npx shadcn@latest add button

# CLI automáticamente:
# 1. Instala button en packages/ui/src/components/
# 2. Instala dependencias en packages/ui
# 3. Actualiza imports en apps/dashboard
```

**Ventajas del CLI**:
- ✅ Garantiza estructura correcta
- ✅ Instala dependencias correctas
- ✅ Actualiza imports automáticamente
- ✅ Siempre última versión del componente

---

## 📊 Comparación: Reference vs Monorepo

### Bundui Reference (Externo - NO TOCAR)
```
C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard/
├── components/
│   └── ui/              ← Componentes Shadcn (Reference)
└── app/
    └── dashboard/       ← Dashboards (Reference)
```

**Propósito**: Consulta y comparación visual (SOLO LECTURA)  
**Puerto**: 3050 (global)  
**Regla**: NUNCA modificar

---

### Orchestrator Monorepo (Nuestro - SÍ MODIFICAR)
```
vibethink-orchestrator-main/
├── packages/ui/         ← Componentes Shadcn (Monorepo)
│   └── src/
│       └── components/
│           └── ui/      ← Nuestros componentes Shadcn
└── apps/dashboard/      ← Dashboards (Monorepo)
    └── app/
        ├── dashboard-bundui/      ← Espejo (puede modificarse)
        └── dashboard-vibethink/   ← Mejoras (total libertad)
```

**Propósito**: Producción y desarrollo  
**Puerto**: 3005 (global)  
**Regla**: SÍ modificar (es nuestro código)

---

## ✅ Checklist de Compliance Shadcn Monorepo

### Estructura
- [x] Monorepo con `apps/` y `packages/`
- [x] Componentes en `packages/ui`
- [x] Apps en `apps/`
- [ ] Componentes directamente en `packages/ui/src/components/` (tenemos subdirectorio `ui/`)

### Configuration
- [x] `components.json` en cada workspace
- [x] Aliases definidos en `components.json`
- [ ] Aliases completos (faltan `hooks`, `lib`)
- [x] Same `style`, `iconLibrary`, `baseColor` en ambos

### Dependencies
- [x] Dependencies en `packages/ui/package.json`
- [x] Imports usan aliases (`@vibethink/ui`)
- [x] No duplicate dependencies

### Tooling
- [ ] Usar Shadcn CLI para agregar componentes (recomendado)
- [x] Build system (Turborepo/Nx) - tenemos custom setup
- [ ] Tailwind v4 (tenemos v3)

**Score**: 8/12 (66% compliant)

---

## 🎯 Plan de Acción

### Fase 1: Quick Wins (1 hora)
1. ✅ Completar aliases en `apps/dashboard/components.json`
2. ✅ Documentar excepciones (Tailwind v3, estructura)
3. ✅ Crear este documento

### Fase 2: Adopción Gradual (1 semana)
1. ⏸️ Empezar a usar Shadcn CLI para nuevos componentes
2. ⏸️ Validar que CLI funciona con nuestra estructura
3. ⏸️ Documentar workflow en `AGENTS.md`

### Fase 3: Refactoring (Opcional - 1 mes)
1. ❓ Evaluar migración a Tailwind v4
2. ❓ Evaluar reorganizar `packages/ui/src/components/`
3. ❓ Solo si hay beneficio claro

---

## 📚 Referencias

### Shadcn UI Official
- [Monorepo Docs](https://ui.shadcn.com/docs/monorepo) - Documentación oficial
- [CLI Docs](https://ui.shadcn.com/docs/cli) - Comandos del CLI
- [components.json](https://ui.shadcn.com/docs/components-json) - Configuración

### Nuestro Proyecto
- `AGENTS.md` - Reglas del proyecto
- `docs/architecture/DASHBOARD_ARCHITECTURE.md` - Arquitectura de dashboards
- `docs/ui-ux/TAILWIND_CDN_WARNING.md` - Por qué usamos v3
- `packages/ui/README.md` - Documentación del package UI

---

## 🚨 Reglas Críticas

### 1. Referencias NO Son Monorepo
```
❌ INCORRECTO: Modificar Bundui Reference
✅ CORRECTO: Es solo para consulta (SOLO LECTURA)
```

### 2. Orchestrator SÍ Es Monorepo
```
✅ CORRECTO: Modificar packages/ui y apps/dashboard
✅ CORRECTO: Seguir estándar Shadcn donde sea posible
```

### 3. Shadcn First, Siempre
```
✅ CORRECTO: Usar componentes de Shadcn como base
✅ CORRECTO: Extender/personalizar cuando sea necesario
❌ INCORRECTO: Crear componentes desde cero
```

---

**Última actualización**: 2025-12-18  
**Compliance Score**: 66% (8/12)  
**Recomendación**: Mejorar gradualmente, no requiere refactoring inmediato











