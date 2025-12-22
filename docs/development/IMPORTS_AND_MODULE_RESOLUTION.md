# Imports y Resolución de Módulos - Lecciones Aprendidas

**Fecha:** 2025-01-16  
**Contexto:** Migración de AI Chat V2 desde Bundui Reference  
**Estado:** ✅ Documentado

---

## 📋 Tabla de Contenidos

1. [Caso de Estudio: Componentes Custom de Prompt](#caso-de-estudio-componentes-custom-de-prompt)
2. [Estructura de Imports en ViTo](#estructura-de-imports-en-vito)
3. [Lecciones Aprendidas](#lecciones-aprendidas)
4. [Mejores Prácticas](#mejores-prácticas)
5. [Troubleshooting](#troubleshooting)
6. [Checklist para Nuevos Imports](#checklist-para-nuevos-imports)

---

## 🎯 Caso de Estudio: Componentes Custom de Prompt

### Problema Encontrado

Durante la migración de AI Chat V2 desde Bundui Reference, se encontró el siguiente error:

```
Module not found: Can't resolve '@/components/ui/custom/prompt/input'
```

**Error completo:**
```
./app/dashboard-bundui/ai-chat-v2/components/ai-chat-interface.tsx (22:1)
Module not found: Can't resolve '@/components/ui/custom/prompt/input'
```

### Análisis del Problema

1. **Componentes faltantes:** Los componentes custom de prompt no existían en el proyecto
2. **Ruta esperada:** El código esperaba `@/components/ui/custom/prompt/*`
3. **Ubicación correcta:** Según `tsconfig.json`, `@/components/*` resuelve a `./src/components/*`

### Solución Implementada

Se crearon todos los componentes necesarios en la ubicación correcta:

```
apps/dashboard/src/components/ui/custom/prompt/
├── input.tsx              # Input con contexto y textarea
├── suggestion.tsx          # Sugerencias de prompt
├── chat-container.tsx     # Contenedor con auto-scroll
├── message.tsx            # Mensajes del chat
├── markdown.tsx           # Renderizado de markdown
├── code-block.tsx         # Bloques de código con syntax highlighting
├── loader.tsx              # Varios tipos de loaders
└── scroll-button.tsx      # Botón de scroll
```

### Dependencias Verificadas

- ✅ `shiki` (3.7.0) - Para syntax highlighting
- ✅ `marked` (15.0.12) - Para parsing de markdown
- ✅ `react-markdown` (10.1.0) - Para renderizado de markdown
- ✅ `remark-gfm` (4.0.1) - Para GitHub Flavored Markdown

---

## 🏗️ Estructura de Imports en ViTo

### Configuración de Paths (tsconfig.json)

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/shared/*": ["./src/shared/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/components/*": [
      "./src/components/*",
      "./src/shared/components/bundui-premium/components/*"
    ],
    "@/hooks/*": ["./hooks/*"],
    "@vibethink/ui": ["../../packages/ui/src"],
    "@vibethink/ui/*": ["../../packages/ui/src/*"]
  }
}
```

### Mapeo de Rutas

| Alias | Resuelve a | Uso |
|-------|------------|-----|
| `@/*` | `./src/*` | Imports generales del proyecto |
| `@/components/*` | `./src/components/*` | Componentes principales |
| `@/components/*` | `./src/shared/components/bundui-premium/components/*` | Componentes legacy de Bundui |
| `@/lib/*` | `./src/lib/*` | Utilidades y helpers |
| `@/hooks/*` | `./hooks/*` | React hooks |
| `@vibethink/ui` | `../../packages/ui/src` | Package UI del monorepo |

### Jerarquía de Resolución

Cuando se usa `@/components/ui/custom/prompt/input`, TypeScript/Next.js busca en este orden:

1. `apps/dashboard/src/components/ui/custom/prompt/input.tsx` ✅ (Primera opción)
2. `apps/dashboard/src/shared/components/bundui-premium/components/ui/custom/prompt/input.tsx` (Fallback)

---

## 💡 Lecciones Aprendidas

### 1. **Verificar Estructura de Directorios Antes de Migrar**

**Problema:** Asumir que los componentes existen sin verificar.

**Solución:**
```bash
# Antes de migrar, verificar estructura
glob_file_search "**/prompt/**/*.tsx"
list_dir "apps/dashboard/src/components/ui"
```

**Lección:** Siempre verificar la existencia de componentes antes de migrar código que los importa.

---

### 2. **Entender la Resolución de Paths**

**Problema:** No entender cómo `tsconfig.json` resuelve los paths.

**Solución:**
- Leer `tsconfig.json` para entender los paths configurados
- Verificar que la ruta del componente coincida con la estructura de paths
- Usar rutas absolutas con aliases (`@/components/*`) en lugar de relativas

**Lección:** Los paths en `tsconfig.json` son la fuente de verdad para la resolución de módulos.

---

### 3. **Componentes Custom Requieren Creación Manual**

**Problema:** Asumir que los componentes custom se migran automáticamente.

**Solución:**
- Identificar componentes custom en el código fuente
- Copiarlos desde la referencia a la ubicación correcta
- Ajustar imports si es necesario
- Verificar dependencias

**Lección:** Los componentes custom no se instalan automáticamente; deben crearse manualmente.

---

### 4. **Verificar Dependencias Antes de Usar Componentes**

**Problema:** Usar componentes que requieren dependencias no instaladas.

**Solución:**
```bash
# Verificar dependencias en package.json
grep -i "shiki\|marked\|react-markdown" package.json

# Instalar si faltan
npm install shiki marked react-markdown remark-gfm
```

**Lección:** Siempre verificar que todas las dependencias estén instaladas antes de usar componentes.

---

### 5. **Errores 500 Pueden Ser por Componentes Faltantes**

**Problema:** Error 500 en runtime sin mensaje claro en build.

**Solución:**
- Verificar que el build compile correctamente
- Revisar logs del servidor para errores de runtime
- Verificar que todos los componentes importados existan
- Reiniciar el servidor después de crear nuevos componentes

**Lección:** Los errores 500 pueden indicar componentes faltantes que no se detectan en build time.

---

### 6. **Múltiples Paths para el Mismo Alias**

**Problema:** `@/components/*` resuelve a múltiples ubicaciones.

**Solución:**
- Entender el orden de resolución (primera coincidencia gana)
- Usar la ubicación más específica para nuevos componentes
- Documentar dónde van los nuevos componentes

**Lección:** Cuando hay múltiples paths, el orden importa. Usar la ubicación más apropiada.

---

## ✅ Mejores Prácticas

### 1. **Estructura de Componentes**

```
apps/dashboard/src/components/
├── ui/                    # Componentes base de Shadcn UI
│   ├── button.tsx
│   ├── input.tsx
│   └── custom/            # Componentes custom
│       └── prompt/        # Componentes específicos de prompt
│           ├── input.tsx
│           └── ...
└── ...
```

**Regla:** Componentes custom van en `src/components/ui/custom/[categoria]/`

---

### 2. **Naming Conventions**

- ✅ `@/components/ui/custom/prompt/input` - Claro y específico
- ❌ `@/components/prompt-input` - Demasiado genérico
- ❌ `../../../components/prompt/input` - Rutas relativas confusas

**Regla:** Usar aliases de paths y nombres descriptivos.

---

### 3. **Verificación de Imports**

Antes de migrar código:

```bash
# 1. Buscar todos los imports del componente
grep -r "@/components/ui/custom/prompt" apps/dashboard

# 2. Verificar que el componente existe
test -f "apps/dashboard/src/components/ui/custom/prompt/input.tsx"

# 3. Verificar dependencias
grep -i "shiki\|marked" apps/dashboard/package.json
```

---

### 4. **Documentación de Componentes Custom**

Cuando se crean componentes custom, documentar:

- **Ubicación:** Dónde está el componente
- **Dependencias:** Qué paquetes requiere
- **Uso:** Ejemplo de import y uso
- **Origen:** De dónde se migró (si aplica)

---

### 5. **Testing de Imports**

Después de crear componentes:

```bash
# 1. Verificar que compila
cd apps/dashboard
npm run build

# 2. Verificar que el servidor inicia
npm run dev

# 3. Probar la ruta en el navegador
# http://localhost:3005/dashboard-bundui/ai-chat-v2
```

---

## 🔧 Troubleshooting

### Error: "Module not found"

**Síntomas:**
```
Module not found: Can't resolve '@/components/ui/custom/prompt/input'
```

**Solución:**
1. Verificar que el archivo existe en la ruta esperada
2. Verificar `tsconfig.json` paths
3. Verificar que el path alias esté correctamente configurado
4. Reiniciar el servidor de desarrollo

---

### Error: "500 Internal Server Error"

**Síntomas:**
- Build compila correctamente
- Error 500 en runtime
- No hay errores claros en consola

**Solución:**
1. Verificar logs del servidor
2. Verificar que todos los componentes importados existan
3. Verificar dependencias instaladas
4. Limpiar caché de Next.js: `rm -r .next`
5. Reiniciar servidor

---

### Error: "Cannot find module"

**Síntomas:**
```
Cannot find module '@/components/ui/custom/prompt/input' or its corresponding type declarations.
```

**Solución:**
1. Verificar que el archivo tenga extensión `.tsx` o `.ts`
2. Verificar que el export esté correcto
3. Verificar que `tsconfig.json` incluya el archivo en `include`

---

### Error: "Dependency not found"

**Síntomas:**
```
Error: Cannot find module 'shiki'
```

**Solución:**
```bash
# Instalar dependencia faltante
cd apps/dashboard
npm install shiki

# Verificar en package.json
grep "shiki" package.json
```

---

## 📝 Checklist para Nuevos Imports

### Antes de Migrar Código

- [ ] Identificar todos los imports del componente
- [ ] Verificar que el componente existe en la referencia
- [ ] Verificar dependencias requeridas
- [ ] Identificar la ubicación correcta según `tsconfig.json`

### Durante la Migración

- [ ] Crear directorios necesarios
- [ ] Copiar componentes a la ubicación correcta
- [ ] Ajustar imports si es necesario
- [ ] Verificar exports del componente

### Después de la Migración

- [ ] Verificar que compila: `npm run build`
- [ ] Verificar que el servidor inicia: `npm run dev`
- [ ] Probar la ruta en el navegador
- [ ] Verificar que no hay errores en consola
- [ ] Documentar el componente si es custom

---

## 📚 Referencias

- **tsconfig.json:** `apps/dashboard/tsconfig.json`
- **Componentes Custom:** `apps/dashboard/src/components/ui/custom/`
- **Bundui Reference:** `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard\`
- **Documentación Next.js:** [Module Resolution](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)

---

## 🎓 Resumen Ejecutivo

### Problema Principal
Componentes custom de prompt faltantes causaron error "Module not found" y error 500 en runtime.

### Solución
Crear componentes en `apps/dashboard/src/components/ui/custom/prompt/` siguiendo la estructura de paths de `tsconfig.json`.

### Lección Clave
**Siempre verificar la existencia de componentes y dependencias antes de migrar código que los importa.**

### Mejores Prácticas
1. Usar aliases de paths (`@/components/*`)
2. Verificar estructura de directorios
3. Documentar componentes custom
4. Probar después de crear componentes

---

**Última actualización:** 2025-01-16  
**Mantenido por:** Equipo de Desarrollo ViTo



