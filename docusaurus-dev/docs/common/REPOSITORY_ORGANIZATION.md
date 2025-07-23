# Organización del Repositorio - AI Pair Orchestrator Pro

## 📋 Overview

Este documento establece las reglas de organización y estructura del repositorio AI Pair Orchestrator Pro con **separación clara** entre `src/` (aplicación) y `dev-tools/` (herramientas), cada uno con sus propios tests y configuraciones.

**Versión**: 1.0  
**Última actualización**: 7 de enero, 2025  
**Referencia**: Basado en SECURITY.md consolidado

---

## 🏗️ Estructura Separada e Independiente

```
📁 ai-pair-orchestrator-pro-main/
├── 📄 README.md                    # ✅ Documentación principal
├── 📄 SECURITY.md                  # ✅ Política de seguridad
├── 📄 LICENSE                      # ✅ Licencia
├── 📄 .gitignore                   # ✅ Exclusiones Git
├── 📄 package.json                 # ✅ Dependencias principales
├── 📄 tsconfig.json                # ✅ Config TypeScript base
├── 📄 tailwind.config.js           # ✅ Config Tailwind
├── 📄 vite.config.ts               # ✅ Config Vite
├── 📄 .env.example                 # ✅ Variables ejemplo
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
│   ├── 📁 config/                  # Configuraciones de desarrollo
│   ├── 📁 templates/               # Templates de código
│   ├── 📁 docker/                  # Configuraciones Docker
│   ├── 📁 build/                   # Scripts de build
│   ├── 📁 security/                # Herramientas de seguridad
│   ├── 📁 __tests__/               # Tests de las herramientas
│   ├── 📁 docs/                    # Documentación de herramientas
│   ├── 📄 package.json             # Dependencias específicas
│   └── 📄 tsconfig.json            # Config TS específica de dev-tools/
│
├── 📁 docs/                        # 📚 DOCUMENTACIÓN GLOBAL
│   ├── 📁 development/             # Documentación de desarrollo
│   ├── 📁 architecture/            # Arquitectura del sistema
│   ├── 📁 security/                # Políticas de seguridad
│   └── 📁 api/                     # Documentación de APIs
│
├── 📁 .github/                     # ⚙️ CONFIGURACIÓN GITHUB
└── 📁 supabase/                    # 🗄️ CONFIGURACIÓN BASE DE DATOS
```

## 🔒 Principios de Separación

### 🚀 `src/` - Aplicación Independiente
- **Propósito**: Código que se ejecuta en producción
- **Tests**: `src/__tests__/` para testing de la aplicación
- **Config**: `src/tsconfig.json`, `src/config/`
- **Dependencias**: Solo las necesarias para producción
- **Build**: Se compila para distribución
- **Aislamiento**: No conoce ni depende de `dev-tools/`

### 🛠️ `dev-tools/` - Herramientas Independientes  
- **Propósito**: Scripts y herramientas para el equipo de desarrollo
- **Tests**: `dev-tools/__tests__/` para testing de herramientas
- **Config**: `dev-tools/tsconfig.json`, `dev-tools/config/`
- **Dependencias**: `dev-tools/package.json` propio
- **Build**: Scripts que NO van a producción
- **Aislamiento**: No forma parte del build de la aplicación

## 🚨 Reglas de Organización

### ✅ PERMITIDO en ROOT
```
📄 Solo configuraciones globales:
- README.md, SECURITY.md, LICENSE
- .gitignore, .editorconfig
- package.json (dependencias compartidas mínimas)
- tsconfig.json (configuración base)
- tailwind.config.js, vite.config.ts
- .env.example
```

### ❌ PROHIBIDO en ROOT
```
🚫 NUNCA en root:
- Código de aplicación (va en src/)
- Scripts de desarrollo (van en dev-tools/)
- Tests específicos (van en src/ o dev-tools/)
- Configuraciones específicas
- Archivos temporales
```

## 🔧 Scripts de Mantenimiento

### Verificación de Estructura
```bash
# Verificar que cada directorio mantenga su independencia
bash dev-tools/scripts/verify-repository-structure.sh

# Limpiar archivos mal ubicados
bash dev-tools/scripts/emergency-cleanup.sh
```

### Comandos por Directorio
```bash
# Para src/ (aplicación)
cd src && npm test
cd src && npm run build

# Para dev-tools/ (herramientas)
cd dev-tools && npm test
cd dev-tools && npm run validate-tools
```

---

**Principio Clave**: `src/` y `dev-tools/` son **independientes** y **autónomos**, cada uno con su propia responsabilidad, tests y configuraciones.

**Mantenido por**: Equipo AI Pair (Marcelo + Crisselda)  
**Revisión**: Trimestral  
**Creado**: 7 de enero, 2025
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

## 📋 Protocolo de Mantenimiento

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
3. **Categorizar correctamente**: src/, dev-tools/, tests/, docs/
4. **Verificar antes de commit**

## 🎯 Reglas de Oro

> **🔒 REGLA #1**: Si dudas dónde va un archivo, NO lo pongas en root
> 
> **📋 REGLA #2**: Seguir siempre las convenciones en [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md)
> 
> **⚠️ REGLA #3**: Cursor y herramientas deben seguir estas reglas

---

**Principio Clave**: `src/` y `dev-tools/` son **independientes** y **autónomos**, cada uno con su propia responsabilidad, tests y configuraciones.

**Mantenido por**: Equipo AI Pair (Marcelo + Crisselda)  
**Revisión**: Trimestral  
**Referencia**: [SECURITY.md](../../SECURITY.md) - Política general de seguridad
