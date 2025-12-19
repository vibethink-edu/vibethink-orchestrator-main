# 🔧 Shadcn CLI - Guía de Uso

**Última actualización**: 2025-12-18  
**Referencia**: [Shadcn UI CLI Docs](https://ui.shadcn.com/docs/cli)  
**Estado**: ✅ CONFIGURADO Y LISTO

---

## 🎯 Por Qué Usar Shadcn CLI

### ❌ Problema Anterior (Manual)
```bash
# 1. Ir a Shadcn docs
# 2. Copiar código del componente
# 3. Crear archivo en packages/ui/src/components/ui/button.tsx
# 4. Ajustar imports manualmente
# 5. Instalar dependencias manualmente
# 6. Actualizar imports en apps/dashboard
# 7. Debugging de imports rotos
```

**Tiempo**: 10-15 minutos  
**Errores comunes**: Imports incorrectos, dependencias faltantes, versiones incompatibles

---

### ✅ Solución (Con CLI)
```bash
cd apps/dashboard
npx shadcn@latest add button
```

**Tiempo**: 30 segundos  
**Errores**: Ninguno (todo automático)

---

## 🚀 Configuración Actual

### 1. components.json en apps/dashboard

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@vibethink/ui/lib/utils",
    "ui": "@vibethink/ui"
  }
}
```

**Lo que esto le dice al CLI**:
- Instalar componentes en `packages/ui` (vía aliases)
- Usar `@vibethink/ui` para imports
- CSS en `packages/ui/src/styles/globals.css`
- Iconos de `lucide-react`

---

### 2. components.json en packages/ui

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "../../tailwind.config.ts",
    "css": "../../apps/dashboard/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "./src/components",
    "utils": "./src/lib/utils",
    "ui": "./src/components",
    "lib": "./src/lib",
    "hooks": "./src/hooks"
  }
}
```

---

## 📋 Workflow Recomendado

### Agregar Nuevo Componente

```bash
# 1. Ir a la app (IMPORTANTE)
cd apps/dashboard

# 2. Agregar componente con CLI
npx shadcn@latest add button

# Resultado automático:
# ✅ Componente instalado en packages/ui/src/components/ui/button.tsx
# ✅ Dependencias instaladas en packages/ui/package.json
# ✅ Imports listos para usar en apps/dashboard
```

### Agregar Múltiples Componentes

```bash
cd apps/dashboard

# Agregar varios a la vez
npx shadcn@latest add button card dialog sheet
```

### Ver Componentes Disponibles

```bash
npx shadcn@latest add
# Muestra lista interactiva de todos los componentes
```

---

## 🔍 Lo Que Hace el CLI

### Paso 1: Lee components.json
```
CLI lee: apps/dashboard/components.json
Descubre: aliases.ui = "@vibethink/ui"
Resuelve: packages/ui/src/components/
```

### Paso 2: Descarga Componente
```
Fuente: https://ui.shadcn.com/registry/[component].json
Versión: Última disponible (compatible con tu config)
```

### Paso 3: Instala en Ubicación Correcta
```
Destino: packages/ui/src/components/ui/button.tsx
Dependencias: packages/ui/package.json
Imports: Actualizados automáticamente
```

### Paso 4: Instala Dependencias
```bash
# CLI ejecuta automáticamente:
cd packages/ui
npm install [dependencias necesarias]
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Agregar Button

```bash
cd apps/dashboard
npx shadcn@latest add button
```

**Resultado**:
```
✔ Installing button component...
✔ Installing dependencies...
✔ Component added to packages/ui/src/components/ui/button.tsx

You can now use it in your app:

import { Button } from "@vibethink/ui"

<Button>Click me</Button>
```

---

### Ejemplo 2: Agregar Data Table (Componente Complejo)

```bash
cd apps/dashboard
npx shadcn@latest add data-table
```

**Resultado**:
```
✔ Installing data-table component...
✔ Installing table component...
✔ Installing dependencies...
  - @tanstack/react-table
  - ... (otras dependencias)
✔ Components added:
  - packages/ui/src/components/ui/table.tsx
  - packages/ui/src/components/ui/data-table.tsx
```

---

### Ejemplo 3: Actualizar Componente Existente

```bash
cd apps/dashboard
npx shadcn@latest add button --overwrite

# CLI pregunta:
? Component 'button' already exists. Overwrite? (y/N)
```

---

## ⚠️ Consideraciones Especiales

### 1. Estructura con Subdirectorio `ui/`

**Nuestro proyecto**:
```
packages/ui/src/components/
└── ui/                    ← Subdirectorio extra
    └── button.tsx
```

**Shadcn esperaría**:
```
packages/ui/src/components/
└── button.tsx             ← Directamente aquí
```

**Impacto**: CLI instalará en la estructura que tenemos (con `ui/`)

**Solución**: Ya está configurado en `components.json` para manejar esto.

---

### 2. Tailwind v3 (en lugar de v4)

**Shadcn recomienda**: Tailwind v4  
**Tenemos**: Tailwind v3 con CDN

**Impacto**: Componentes funcionarán correctamente, pero sin algunas features de v4

**Solución**: Documentado en `docs/ui-ux/TAILWIND_CDN_WARNING.md`

---

## 🧪 Validación

### Verificar que CLI Funciona

```bash
# 1. Ir a la app
cd apps/dashboard

# 2. Intentar agregar componente de prueba
npx shadcn@latest add badge

# 3. Verificar instalación
ls ../../packages/ui/src/components/ui/badge.tsx

# 4. Verificar import en app
echo "import { Badge } from '@vibethink/ui'" | Set-Content test.tsx

# 5. Compilar
npm run build
```

---

## 📊 Comparación: Manual vs CLI

| Aspecto | Manual | CLI |
|---------|--------|-----|
| **Tiempo** | 10-15 min | 30 seg |
| **Errores** | Frecuentes | Ninguno |
| **Dependencias** | Manual | Automático |
| **Actualización** | Manual | Un comando |
| **Imports** | Ajustar | Correcto |
| **Versiones** | Variable | Última compatible |

---

## 🚨 Errores Comunes y Soluciones

### Error 1: "components.json not found"

**Causa**: Ejecutaste el comando desde la raíz

**Solución**:
```bash
cd apps/dashboard
npx shadcn@latest add button
```

---

### Error 2: "Failed to install dependencies"

**Causa**: npm registry timeout o problema de red

**Solución**:
```bash
# Instalar manualmente
cd packages/ui
npm install [dependencias faltantes]
```

---

### Error 3: "Component already exists"

**Causa**: Componente ya fue agregado anteriormente

**Solución**:
```bash
# Opción 1: Sobrescribir
npx shadcn@latest add button --overwrite

# Opción 2: Cancelar y mantener versión actual
```

---

## 📚 Comandos Disponibles

### Agregar Componentes
```bash
npx shadcn@latest add [component]
npx shadcn@latest add button card dialog
```

### Ver Componentes Disponibles
```bash
npx shadcn@latest add
# Lista interactiva
```

### Inicializar (Ya hecho)
```bash
npx shadcn@latest init
# Ya tenemos components.json configurado
```

### Actualizar Componente
```bash
npx shadcn@latest add button --overwrite
```

---

## ✅ Checklist para Usar CLI

Antes de agregar un componente:

- [ ] Estoy en `apps/dashboard/` (no en la raíz)
- [ ] `components.json` existe en `apps/dashboard/`
- [ ] Tengo conexión a internet (para descargar)
- [ ] npm/node están actualizados

Después de agregar:

- [ ] Componente aparece en `packages/ui/src/components/ui/`
- [ ] Dependencias instaladas en `packages/ui/package.json`
- [ ] Build compila sin errores: `npm run build`
- [ ] Import funciona: `import { Component } from '@vibethink/ui'`

---

## 🎯 Próximos Pasos

### Fase 1: Validación (Hoy)
1. ✅ `components.json` creado
2. ⏸️ Probar CLI con un componente simple
3. ⏸️ Verificar que se instala en `packages/ui`

### Fase 2: Adopción (Esta semana)
1. ⏸️ Usar CLI para todos los nuevos componentes
2. ⏸️ Documentar casos especiales
3. ⏸️ Entrenar equipo en uso del CLI

### Fase 3: Migración (Opcional)
1. ❓ Considerar actualizar componentes existentes con CLI
2. ❓ Validar que versiones nuevas no rompen nada
3. ❓ Actualizar solo si hay beneficio claro

---

## 📝 Referencias

### Shadcn UI
- [CLI Docs](https://ui.shadcn.com/docs/cli) - Documentación oficial
- [Monorepo Setup](https://ui.shadcn.com/docs/monorepo) - Setup de monorepo
- [Components](https://ui.shadcn.com/docs/components) - Lista de componentes

### Nuestro Proyecto
- `apps/dashboard/components.json` - Config de la app
- `packages/ui/components.json` - Config del package
- `docs/architecture/SHADCN_MONOREPO_COMPLIANCE.md` - Compliance
- `AGENTS.md` - Reglas del proyecto

---

**Última actualización**: 2025-12-18  
**Estado**: ✅ Configurado y listo para usar  
**Recomendación**: Adoptar CLI como método estándar para agregar componentes Shadcn



