# Arquitectura Compartida - AI Pair Orchestrator Pro

## 📋 Overview

Este documento define la arquitectura compartida entre `src/` (aplicación) y `dev-tools/` (herramientas), preservando todas las definiciones, reglas y estructuras establecidas previamente.

**Propósito**: Mantener consistencia arquitectónica sin perder conocimiento  
**Aplica a**: Todo el repositorio  
**Última actualización**: 7 de enero, 2025

---

## 🏗️ Estructura Unificada del Repositorio

### Organización Principal (Preservada)
```
📁 ai-pair-orchestrator-pro-main/
├── 📄 README.md                    # ✅ Documentación principal
├── 📄 SECURITY.md                  # ✅ Política de seguridad
├── 📄 LICENSE                      # ✅ Licencia
├── 📄 .gitignore                   # ✅ Exclusiones Git
├── 📄 .editorconfig                # ✅ Configuración editor
├── 📄 package.json                 # ✅ Dependencias principales
├── 📄 package-lock.json            # ✅ Lock de dependencias
├── 📄 tsconfig.json                # ✅ Config TypeScript base
├── 📄 tailwind.config.js           # ✅ Config Tailwind
├── 📄 vite.config.ts               # ✅ Config Vite
├── 📄 .env.example                 # ✅ Variables ejemplo
├── 📄 eslint.config.js             # ✅ Configuración ESLint
├── 📄 prettier.config.js           # ✅ Configuración Prettier
│
├── 📁 src/                         # 🚀 APLICACIÓN DE PRODUCCIÓN
│   ├── 📁 components/              # Componentes React
│   ├── 📁 pages/                   # Páginas de la aplicación
│   ├── 📁 services/                # Servicios y APIs
│   ├── 📁 utils/                   # Utilidades de la app
│   ├── 📁 types/                   # Tipos TypeScript
│   ├── 📁 hooks/                   # Custom hooks
│   ├── 📁 __tests__/               # Tests de la aplicación
│   ├── 📁 config/                  # Config específica de la app
│   ├── 📁 docs/                    # Documentación de la app
│   └── 📄 tsconfig.json            # Config TS específica de src/
│
├── 📁 dev-tools/                   # 🛠️ HERRAMIENTAS DE DESARROLLO
│   ├── 📁 scripts/                 # Scripts de automatización
│   │   ├── 📁 build/               # Scripts de build y deployment
│   │   ├── 📁 database/            # Scripts de base de datos
│   │   ├── 📁 maintenance/         # Scripts de mantenimiento
│   │   └── 📁 validation/          # Scripts de validación
│   ├── 📁 config/                  # Configuraciones de desarrollo
│   │   ├── 📁 ci-cd/               # Configuraciones CI/CD
│   │   ├── 📁 linting/             # Configuraciones de linting
│   │   └── 📁 testing/             # Configuraciones de testing
│   ├── 📁 templates/               # Templates de código
│   │   ├── 📁 components/          # Templates de componentes
│   │   ├── 📁 pages/               # Templates de páginas
│   │   └── 📁 services/            # Templates de servicios
│   ├── 📁 docker/                  # Configuraciones Docker
│   ├── 📁 build/                   # Scripts de build personalizados
│   ├── 📁 security/                # Herramientas de análisis de seguridad
│   │   ├── 📁 scanners/            # Scripts de scanning
│   │   ├── 📁 audit/               # Scripts de auditoría
│   │   └── 📁 monitoring/          # Herramientas de monitoreo
│   ├── 📁 __tests__/               # Tests de las herramientas
│   │   ├── 📁 scripts/             # Tests de scripts
│   │   └── 📁 utilities/           # Tests de utilidades
│   ├── 📁 docs/                    # Documentación de herramientas
│   ├── 📄 package.json             # Dependencias específicas
│   └── 📄 tsconfig.json            # Config TS específica
│
├── 📁 docs/                        # 📚 DOCUMENTACIÓN GLOBAL
│   ├── 📁 development/             # Documentación de desarrollo
│   │   ├── 📄 NAMING_CONVENTIONS.md # Convenciones de nombres
│   │   └── 📄 REPOSITORY_ORGANIZATION.md # Organización del repo
│   ├── 📁 architecture/            # Arquitectura del sistema
│   │   ├── 📄 SHARED_ARCHITECTURE.md # Este archivo
│   │   └── 📄 SYSTEM_DESIGN.md     # Diseño del sistema
│   ├── 📁 security/                # Políticas de seguridad
│   ├── 📁 api/                     # Documentación de APIs
│   └── 📁 guides/                  # Guías de uso
│
├── 📁 .github/                     # ⚙️ CONFIGURACIÓN GITHUB
│   ├── 📁 workflows/               # GitHub Actions
│   └── 📁 ISSUE_TEMPLATE/          # Templates de issues
└── 📁 supabase/                    # 🗄️ CONFIGURACIÓN BASE DE DATOS
```

## 🔒 Principios Arquitectónicos Compartidos

### 1. Separación de Responsabilidades (Preservado)

#### 🚀 `src/` - Aplicación Independiente
- **Propósito**: Código que se ejecuta en producción
- **Incluye**: Componentes, servicios, páginas, hooks, utils
- **Excluye**: Tests, herramientas de desarrollo, documentación global
- **Tests**: `src/__tests__/` para testing de la aplicación
- **Config**: `src/tsconfig.json`, `src/config/`
- **Dependencias**: Solo las necesarias para producción
- **Build**: Se compila para distribución
- **Aislamiento**: No conoce ni depende de `dev-tools/`

#### 🛠️ `dev-tools/` - Herramientas Independientes  
- **Propósito**: Scripts y herramientas para el equipo de desarrollo
- **Incluye**: Scripts, configuraciones, herramientas del equipo
- **Excluye**: Código de producción, tests de aplicación
- **Tests**: `dev-tools/__tests__/` para testing de herramientas
- **Config**: `dev-tools/tsconfig.json`, `dev-tools/config/`
- **Dependencias**: `dev-tools/package.json` propio
- **Build**: Scripts que NO van a producción
- **Aislamiento**: No forma parte del build de la aplicación

### 2. Reglas de Organización (Preservadas)

#### ✅ PERMITIDO en ROOT
```
📄 Solo configuraciones globales:
- README.md, SECURITY.md, LICENSE
- .gitignore, .editorconfig
- package.json (dependencias compartidas mínimas)
- package-lock.json (lock de dependencias)
- tsconfig.json (configuración base)
- tailwind.config.js, vite.config.ts
- .env.example
- eslint.config.js, prettier.config.js
```

#### ❌ PROHIBIDO en ROOT
```
🚫 NUNCA en root:
- Archivos .ts, .tsx, .js, .jsx (van en src/)
- Archivos .md (excepto README.md y SECURITY.md)
- Scripts .sh, .bat, .ps1 (van en dev-tools/scripts/)
- Configuraciones específicas (van en dev-tools/config/ o src/config/)
- Archivos temporales (.tmp, .log, .bak)
- Directorios de dependencias (node_modules/, dist/)
- Archivos de datos (.json, .csv, .xml - van en src/data/ o dev-tools/fixtures/)
```

## 🔧 Scripts y Herramientas (Preservados)

### Scripts de Limpieza Gradual - Paso a Paso

#### PASO 1: Verificar estructura existente
```bash
#!/bin/bash
# cleanup-step1.sh - Verificar y crear solo lo faltante

echo "📁 PASO 1: Verificando estructura existente..."

# Verificar si src/ ya existe
if [ -d "src" ]; then
  echo "✅ src/ ya existe - SOFTWARE GENERAL"
else
  echo "⚠️  src/ no existe - se creará"
  mkdir -p src/{components,pages,services,utils,types,hooks,__tests__,config,docs}
fi

# Crear dev-tools/ solo si no existe
if [ ! -d "dev-tools" ]; then
  mkdir -p dev-tools/{scripts/{build,database,maintenance,validation},config/{ci-cd,linting,testing},templates/{components,pages,services},docker,build,security/{scanners,audit,monitoring},__tests__/{scripts,utilities},docs}
  echo "✅ dev-tools/ creado - SOFTWARE PARA DESARROLLO"
fi

# Crear docs/ solo si no existe
if [ ! -d "docs" ]; then
  mkdir -p docs/{development,architecture,security,api,guides}
  echo "✅ docs/ creado - DOCUMENTACIÓN GLOBAL"
fi

# Crear .github/ solo si no existe
if [ ! -d ".github" ]; then
  mkdir -p .github/{workflows,ISSUE_TEMPLATE}
  echo "✅ .github/ creado - CONFIGURACIÓN GITHUB"
fi

echo "📋 Estructura verificada y completada!"
```

#### PASO 2: Mover scripts y herramientas
```bash
#!/bin/bash
# cleanup-step2.sh - Mover scripts

echo "🔧 PASO 2: Moviendo scripts y herramientas..."

# Mover scripts de shell/batch
for file in *.sh *.bat *.ps1; do
  if [[ -f "$file" ]]; then
    mv "$file" dev-tools/scripts/maintenance/
    echo "Movido: $file → dev-tools/scripts/maintenance/"
  fi
done

# Mover archivos de build específicos
for file in webpack.* rollup.* vite.build.*; do
  if [[ -f "$file" ]]; then
    mv "$file" dev-tools/build/
    echo "Movido: $file → dev-tools/build/"
  fi
done

echo "✅ Scripts movidos!"
```

#### PASO 3: Mover configuraciones específicas
```bash
#!/bin/bash
# cleanup-step3.sh - Mover configs específicas

echo "🧪 PASO 3: Moviendo configuraciones específicas..."

# Mover configuraciones de testing
for file in jest.config.* vitest.config.* cypress.config.* playwright.config.*; do
  if [[ -f "$file" ]]; then
    mv "$file" dev-tools/config/testing/
    echo "Movido: $file → dev-tools/config/testing/"
  fi
done

# Mover configuraciones de Docker
for file in docker-compose.* Dockerfile* .dockerignore; do
  if [[ -f "$file" ]]; then
    mv "$file" dev-tools/docker/
    echo "Movido: $file → dev-tools/docker/"
  fi
done

# Mover templates
for file in template-* example-* *.template; do
  if [[ -f "$file" ]]; then
    mv "$file" dev-tools/templates/
    echo "Movido: $file → dev-tools/templates/"
  fi
done

echo "✅ Configuraciones específicas movidas!"
```

### Sistema de Prevención Automática (Preservado)

#### .gitignore - Reglas de prevención
```gitignore
# PREVENIR archivos prohibidos en root
/*.ts
/*.tsx
/*.js
/*.jsx
/*.vue
/*.svelte
!vite.config.ts
!tailwind.config.js
!eslint.config.js
!prettier.config.js

# PREVENIR documentación dispersa
/*.md
!README.md
!SECURITY.md

# PREVENIR scripts dispersos
/*.sh
/*.bat
/*.ps1

# PREVENIR configuraciones dispersas
/jest.config.*
/cypress.config.*
/playwright.config.*
/vitest.config.*

# PREVENIR temporales
*.tmp
*.temp
*.log
*.bak
*.backup
```

#### Pre-commit Hook - Verificación automática
```bash
#!/bin/bash
# .git/hooks/pre-commit - Verificar organización

echo "🔍 Verificando organización del repositorio..."

# Verificar archivos prohibidos en root
prohibited_files=$(git diff --cached --name-only | grep -E '^[^/]+\.(ts|tsx|js|jsx)$' | grep -v -E '(vite\.config|tailwind\.config|eslint\.config|prettier\.config)')

if [ ! -z "$prohibited_files" ]; then
  echo "❌ ERROR: Archivos de código en root detectados:"
  echo "$prohibited_files"
  echo ""
  echo "💡 Mueve estos archivos a src/"
  exit 1
fi

# Verificar documentación dispersa
prohibited_docs=$(git diff --cached --name-only | grep -E '^[^/]+\.md$' | grep -v -E '(README|SECURITY)')

if [ ! -z "$prohibited_docs" ]; then
  echo "❌ ERROR: Documentación dispersa detectada:"
  echo "$prohibited_docs"
  echo ""
  echo "💡 Mueve estos archivos a docs/"
  exit 1
fi

echo "✅ Organización verificada correctamente"
```

### Script de Limpieza de Emergencia (Preservado)
```bash
#!/bin/bash
# emergency-cleanup.sh - Limpieza rápida si se rompen las reglas

echo "🚨 LIMPIEZA DE EMERGENCIA..."

# Crear estructura si no existe
mkdir -p dev-tools/{scripts/{build,database,maintenance,validation},config/{ci-cd,linting,testing},templates/{components,pages,services},docker,build,security/{scanners,audit,monitoring},__tests__/{scripts,utilities},docs}
mkdir -p docs/{development,architecture,security,api,guides}
mkdir -p src/{components,pages,services,utils,types,hooks,__tests__,config,docs}

# Crear archivos de convenciones si no existen
if [ ! -f "docs/development/NAMING_CONVENTIONS.md" ]; then
  echo "📋 Creando archivos de convenciones..."
  mkdir -p docs/development/
  echo "# Ver SHARED_ARCHITECTURE.md para las definiciones completas" > docs/development/README.md
fi

# Mover archivos mal ubicados
echo "🔧 Moviendo archivos de código..."
for file in *.ts *.tsx *.js *.jsx; do
  if [[ -f "$file" && "$file" != "vite.config.ts" && "$file" != "tailwind.config.js" && "$file" != "eslint.config.js" && "$file" != "prettier.config.js" ]]; then
    mv "$file" src/
    echo "Movido: $file → src/"
  fi
done

echo "📚 Moviendo documentación..."
for file in *.md; do
  if [[ "$file" != "README.md" && "$file" != "SECURITY.md" ]]; then
    mv "$file" docs/
    echo "Movido: $file → docs/"
  fi
done

echo "⚙️ Moviendo scripts..."
for file in *.sh *.bat *.ps1; do
  if [[ -f "$file" ]]; then
    mv "$file" dev-tools/scripts/maintenance/
    echo "Movido: $file → dev-tools/scripts/maintenance/"
  fi
done

# Verificar estado final
echo ""
echo "📋 Estado final del root:"
ls -la | grep "^-" | grep -v -E "(README|SECURITY|LICENSE|package|tsconfig|tailwind|vite|\.env|\.git|eslint|prettier)"

echo ""
echo "✅ Limpieza de emergencia completada"
echo "📋 Todas las definiciones preservadas en docs/architecture/SHARED_ARCHITECTURE.md"
```

## 📋 Checklist de Verificación (Preservado)

### Verificación Diaria de Organización

#### Root debe contener SOLO:
- [ ] README.md
- [ ] SECURITY.md
- [ ] LICENSE
- [ ] .gitignore
- [ ] .editorconfig
- [ ] package.json
- [ ] package-lock.json
- [ ] tsconfig.json
- [ ] tailwind.config.js
- [ ] vite.config.ts
- [ ] .env.example
- [ ] eslint.config.js
- [ ] prettier.config.js

#### Verificar estructura:
- [ ] src/ contiene solo código de producción
- [ ] dev-tools/ contiene solo herramientas de desarrollo
- [ ] docs/ contiene solo documentación
- [ ] No hay archivos dispersos

#### Comando de verificación:
```bash
# Ejecutar diariamente
ls -la | grep "^-" | grep -v -E "(README|SECURITY|LICENSE|package|tsconfig|tailwind|vite|\.env|\.git|eslint|prettier)"
```

## 🔄 Protocolo de Mantenimiento (Preservado)

### Semanal
- [ ] Ejecutar verificación de organización
- [ ] Revisar nuevos archivos en root
- [ ] Aplicar limpieza si es necesario

### Mensual
- [ ] Auditar estructura completa
- [ ] Actualizar reglas si es necesario
- [ ] Verificar hooks de Git

### Al agregar archivos
1. **SIEMPRE preguntar**: ¿Este archivo va en root?
2. **Si no está en la lista permitida**: NO va en root
3. **Categorizar correctamente**: src/, dev-tools/, docs/
4. **Verificar antes de commit**

## 🎯 Reglas de Oro (Preservadas)

> **🔒 REGLA #1**: Si dudas dónde va un archivo, NO lo pongas en root
> 
> **📋 REGLA #2**: Seguir siempre las convenciones en [docs/development/NAMING_CONVENTIONS.md](../development/NAMING_CONVENTIONS.md)
> 
> **⚠️ REGLA #3**: Cursor y herramientas deben seguir estas reglas
>
> **🏗️ REGLA #4**: `src/` y `dev-tools/` son independientes pero comparten arquitectura
>
> **📚 REGLA #5**: Toda definición importante se preserva en documentación

---

**Mantenido por**: Equipo AI Pair (Marcelo + Crisselda)  
**Revisión**: Trimestral  
**Creado**: 7 de enero, 2025  
**Propósito**: Preservar todo el conocimiento arquitectónico sin perder definiciones
