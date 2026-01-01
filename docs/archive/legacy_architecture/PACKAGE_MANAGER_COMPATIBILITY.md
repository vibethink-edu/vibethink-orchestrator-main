# Package Manager Compatibility Guide

**Versión:** 1.0.0
**Última actualización:** 2025-12-25
**Estado:** ✅ Activo

## 🎯 Explicación Simple (Para Adolescentes)

### ¿De qué trata este documento?

Imagina que tienes tres tipos de control remoto para tu TV: Samsung, LG y Sony. Cada uno tiene botones que se llaman diferente, aunque hagan lo mismo.

En programación pasa igual:
- **npm** = Control remoto Samsung
- **yarn** = Control remoto LG
- **pnpm** = Control remoto Sony

Nuestro proyecto usa **npm** (Samsung), pero alguien copió instrucciones para **pnpm** (Sony). El resultado: ¡No funciona! 📺❌

### El problema en una frase

Usar sintaxis de **pnpm/yarn** en un proyecto configurado para **npm** es como presionar botones de un control Sony en una TV Samsung - simplemente no funciona.

### La solución

Cambiar las instrucciones al "idioma" correcto:
- ❌ `"workspace:*"` = Botón del control Sony
- ✅ `"^0.1.0"` = Botón del control Samsung

---

## Contexto

El proyecto **VibeThink Orchestrator** usa **npm** como gestor de paquetes oficial. Sin embargo, diferentes gestores de paquetes (npm, yarn, pnpm) tienen sintaxis incompatibles en `package.json`, especialmente para **workspaces** y **peer dependencies**.

**Gestor oficial del proyecto:**
```json
{
  "packageManager": "npm@10.2.4"
}
```

## Problema: Sintaxis workspace: Protocol

### ❌ Problema Común

**Síntoma:**
```bash
npm error code EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:": workspace:*
```

**Causa:**
Usar sintaxis de **pnpm/yarn** en un proyecto configurado para **npm**.

### Comparación de Sintaxis

| Gestor | Sintaxis workspace | Compatibilidad |
|--------|-------------------|----------------|
| **pnpm** | `"@vibethink/utils": "workspace:*"` | Solo pnpm |
| **yarn** | `"@vibethink/utils": "workspace:*"` | Solo yarn (v2+) |
| **npm** | `"@vibethink/utils": "^0.1.0"` | npm, pnpm, yarn |

### ✅ Solución

**Regla de oro:** Usar **versiones específicas** en lugar de `workspace:*`

```json
// ❌ INCORRECTO (solo funciona con pnpm/yarn)
{
  "dependencies": {
    "@vibethink/utils": "workspace:*",
    "@vibethink/ui": "workspace:^"
  }
}

// ✅ CORRECTO (compatible con npm, pnpm, yarn)
{
  "dependencies": {
    "@vibethink/utils": "^0.1.0",
    "@vibethink/ui": "^0.2.0"
  }
}
```

## Estructura de Workspaces en npm

### Root package.json

```json
{
  "name": "@vibethink/orchestrator",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "packageManager": "npm@10.2.4"
}
```

### Package en Workspace

**Ejemplo:** `packages/utils/package.json`

```json
{
  "name": "@vibethink/utils",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    // Sin referencias a workspace:
    "date-fns": "^4.1.0"
  }
}
```

### App que consume package

**Ejemplo:** `apps/dashboard/package.json`

```json
{
  "name": "vibethink-orchestrator-dashboard",
  "version": "1.0.0",
  "dependencies": {
    // ✅ Usar versión específica, NO workspace:
    "@vibethink/utils": "^0.1.0",
    "@vibethink/ui": "^0.2.0"
  }
}
```

## Comandos de Instalación

### Instalación en Monorepo

**SIEMPRE instalar desde la raíz:**

```bash
# ✅ CORRECTO - Instalar desde raíz
cd C:\IA Marcelo Labs\vibethink-orchestrator-main
npm install

# ❌ INCORRECTO - NO instalar desde workspace individual
cd apps/dashboard
npm install  # ⚠️ Puede causar problemas de hoisting
```

### Agregar Dependencia a Workspace

**Opción 1: Manual (recomendado)**

```bash
# 1. Editar package.json del workspace manualmente
# 2. Instalar desde raíz
npm install
```

**Opción 2: npm con -w flag**

```bash
# Instalar en workspace específico
npm install react@19.0.0 -w apps/dashboard

# Instalar en todos los workspaces
npm install typescript@5.8.3 -ws
```

### Limpiar y Reinstalar

Cuando hay problemas de dependencias:

```bash
# 1. Eliminar node_modules y lockfiles
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm package-lock.json

# 2. Reinstalar desde raíz
npm install

# 3. Verificar instalación
npm ls autoprefixer
npm ls react react-dom
```

**Alternativa con npm clean:**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Validación de package.json

### Script de Validación

**Crear:** `scripts/validate-package-json-syntax.js`

```javascript
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Buscar todos los package.json en workspaces
const packageJsonFiles = glob.sync('packages/*/package.json')
  .concat(glob.sync('apps/*/package.json'));

let hasErrors = false;

packageJsonFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const pkg = JSON.parse(content);

  // Buscar workspace: protocol
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (!pkg[depType]) return;

    Object.entries(pkg[depType]).forEach(([name, version]) => {
      if (version.includes('workspace:')) {
        console.error(`❌ ERROR en ${file}:`);
        console.error(`   "${name}": "${version}"`);
        console.error(`   Cambiar a versión específica (ej: "^0.1.0")`);
        hasErrors = true;
      }
    });
  });
});

if (hasErrors) {
  console.error('\n⚠️ Encontrados errores de sintaxis workspace:');
  console.error('   Reemplazar "workspace:*" con versiones específicas');
  process.exit(1);
} else {
  console.log('✅ Todos los package.json son compatibles con npm');
}
```

**Uso:**

```bash
node scripts/validate-package-json-syntax.js
```

### Validación Manual

**Buscar workspace: en todos los package.json:**

```bash
# Linux/Mac/Git Bash
grep -r "workspace:" packages/*/package.json apps/*/package.json

# PowerShell
Select-String -Path packages\*/package.json,apps\*/package.json -Pattern "workspace:"
```

## Casos Documentados

### Caso 1: autoprefixer Missing (2025-12-25)

**Error:**
```
Cannot find module 'autoprefixer'
```

**Causa:**
```json
// packages/integrations/package.json
{
  "dependencies": {
    "@vibethink/utils": "workspace:*"  // ❌ npm no soporta esto
  }
}
```

**Solución:**
```json
{
  "dependencies": {
    "@vibethink/utils": "^0.1.0"  // ✅ Versión específica
  }
}
```

**Resultado:**
- `npm install` completó exitosamente
- `autoprefixer` se instaló correctamente
- Build funciona sin errores

**Archivos afectados:**
- `packages/integrations/package.json:12`

**Referencia:** `docs/TROUBLESHOOTING.md` - Sección "Cannot find module 'autoprefixer'"

## Best Practices

### ✅ DO (Hacer)

1. **Usar versiones específicas en dependencies:**
   ```json
   {
     "dependencies": {
       "@vibethink/utils": "^0.1.0"
     }
   }
   ```

2. **Instalar siempre desde raíz:**
   ```bash
   npm install  # Desde raíz del monorepo
   ```

3. **Validar antes de commit:**
   ```bash
   node scripts/validate-package-json-syntax.js
   ```

4. **Usar npm workspaces correctamente:**
   ```bash
   npm install react -w apps/dashboard
   ```

5. **Documentar versiones de packages:**
   - Mantener `version` actualizado en cada package.json
   - Sincronizar versiones entre dependencias

### ❌ DON'T (No hacer)

1. **NO usar sintaxis workspace: protocol:**
   ```json
   // ❌ Evitar
   "@vibethink/utils": "workspace:*"
   "@vibethink/utils": "workspace:^"
   ```

2. **NO instalar desde workspaces individuales:**
   ```bash
   # ❌ Evitar
   cd apps/dashboard
   npm install
   ```

3. **NO mezclar gestores de paquetes:**
   - Si usas npm, NO uses yarn.lock o pnpm-lock.yaml
   - Si cambias de gestor, limpia lockfiles previos

4. **NO ignorar errores EUNSUPPORTEDPROTOCOL:**
   - Significa que hay sintaxis incompatible
   - Corregir inmediatamente

5. **NO copiar package.json de proyectos con otro gestor:**
   - Validar sintaxis antes de integrar
   - Adaptar a npm si es necesario

## Migración entre Gestores

### De pnpm/yarn a npm

**Pasos:**

1. **Identificar sintaxis incompatible:**
   ```bash
   grep -r "workspace:" packages/*/package.json apps/*/package.json
   ```

2. **Reemplazar workspace: por versiones:**
   ```bash
   # Cambiar manualmente cada ocurrencia
   # De: "workspace:*" o "workspace:^"
   # A: "^0.1.0" (versión real del package)
   ```

3. **Eliminar lockfiles previos:**
   ```bash
   rm pnpm-lock.yaml  # Si venía de pnpm
   rm yarn.lock       # Si venía de yarn
   ```

4. **Crear lockfile de npm:**
   ```bash
   npm install
   # Crea package-lock.json
   ```

5. **Validar instalación:**
   ```bash
   npm ls
   npm run build
   ```

### De npm a pnpm/yarn

**No recomendado para este proyecto**, pero si es necesario:

1. **Actualizar packageManager en root:**
   ```json
   {
     "packageManager": "pnpm@9.0.0"  // o yarn@4.0.0
   }
   ```

2. **Reemplazar versiones por workspace:**
   ```json
   {
     "dependencies": {
       "@vibethink/utils": "workspace:*"
     }
   }
   ```

3. **Eliminar package-lock.json:**
   ```bash
   rm package-lock.json
   ```

4. **Instalar con nuevo gestor:**
   ```bash
   pnpm install  # o yarn install
   ```

## Troubleshooting Rápido

### Error: EUNSUPPORTEDPROTOCOL

**Solución:**
```bash
# 1. Buscar workspace: en package.json
grep -r "workspace:" packages/*/package.json

# 2. Reemplazar con versiones específicas

# 3. Reinstalar
npm install
```

### Error: Cannot find module 'X'

**Solución:**
```bash
# 1. Verificar que npm install completó sin errores
npm install

# 2. Verificar que el módulo está instalado
npm ls <module-name>

# 3. Si no está, reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Múltiples versiones de la misma dependencia

**Solución:**
```bash
# 1. Ver árbol de dependencias
npm ls <dependency-name>

# 2. Forzar versión única con overrides (root package.json)
{
  "overrides": {
    "react": "^19.0.0"
  }
}

# 3. Reinstalar
npm install
```

## Referencias

- **Documentación oficial npm workspaces:** https://docs.npmjs.com/cli/v10/using-npm/workspaces
- **Troubleshooting general:** `docs/TROUBLESHOOTING.md`
- **Validación de React versions:** `scripts/validate-react-versions.js`
- **Caso autoprefixer:** `docs/TROUBLESHOOTING.md#incident-cannot-find-module-autoprefixer-build-error`

## Changelog

### 2025-12-25
- ✅ Documento creado
- ✅ Documentado caso autoprefixer
- ✅ Agregada sección de validación
- ✅ Agregados best practices
- ✅ Agregada guía de migración

---

**Nota:** Este documento debe actualizarse cada vez que se encuentre un problema relacionado con package managers o sintaxis de package.json.
