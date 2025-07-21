# Política de Limpieza del Root - VThink 1.0

## 🎯 **Objetivo**

Mantener el directorio raíz (`/`) del repositorio limpio y organizado, evitando la contaminación con scripts, archivos temporales y utilidades que deben estar en carpetas específicas.

## 📋 **Reglas Principales**

### ✅ **Archivos Permitidos en Root**

#### **Configuración del Proyecto**
- `package.json`, `package-lock.json`, `lerna.json`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `next.config.js`, `tailwind.config.ts`, `postcss.config.js`
- `eslint.config.js`, `.eslintrc.js`
- `vitest.config.ts`, `vitest.e2e.config.ts`, `playwright.config.ts`

#### **Configuración de Git y CI/CD**
- `.gitignore`, `.gitattributes`
- `.github/`, `.husky/`, `.vscode/`, `.cursor/`

#### **Documentación Principal**
- `README.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`, `LICENSE`, `SECURITY.md`

#### **Configuración de Entorno**
- `env.example`, `next-env.d.ts`
- `.cursorrules`, `.dartai.config.json`
- `components.json`, `ViveThink-Orchestrator-main.code-workspace`

#### **Directorios Principales**
- `src/`, `apps/`, `bundui/`, `external/`
- `docs/`, `tests/`, `public/`, `reports/`
- `projects/`, `dev-portal/`, `dev-tools/`
- `docusaurus-*` (sitios de documentación)
- `supabase/`, `traefik/`, `node_modules/`
- `.git/`, `.next/`

### ❌ **Archivos Prohibidos en Root**

#### **Scripts y Utilidades**
- Cualquier archivo `.js`, `.ts`, `.ps1`, `.cjs`, `.sh`, `.py`, `.sql`
- Scripts de testing, monitoreo, validación
- Utilidades de desarrollo, automatización
- Scripts de migración, backup, deployment

#### **Archivos Temporales**
- Archivos `.tmp`, `.temp`, `.bak`, `.backup`
- Logs de desarrollo, archivos de cache
- Archivos de debug, testing results

#### **Patrones Sospechosos**
- Archivos con nombres que contengan: `test`, `temp`, `tmp`, `backup`, `log`, `debug`, `dev`, `script`, `util`

## 🛠️ **Herramientas de Validación**

### **Script de Validación Automática**
```powershell
# Validar limpieza del root
.\dev-tools\validation\validate-root-clean.ps1

# Validar y mover archivos automáticamente
.\dev-tools\validation\validate-root-clean.ps1 -Fix

# Validación estricta (falla si hay problemas)
.\dev-tools\validation\validate-root-clean.ps1 -Strict
```

### **Integración con Git Hooks**
```bash
# Pre-commit hook para validar root
# Agregar a .husky/pre-commit
./dev-tools/validation/validate-root-clean.ps1 -Strict
```

## 📁 **Estructura Organizada**

### **dev-tools/ - Herramientas de Desarrollo**
```
dev-tools/
├── docusaurus/          # Gestión de sitios Docusaurus
├── monitoring/          # Monitoreo y health checks
├── testing/            # Scripts de testing y validación
├── security/           # Auditoría y validación de seguridad
├── deployment/         # Despliegue y backups
├── validation/         # Validación de stack y proyectos
├── automation/         # Automatización y limpieza
├── documentation/      # Generación y gestión de documentación
├── setup/             # Configuración y setup
├── migration/          # Migración de contenido
└── utilities/         # Scripts utilitarios diversos
```

### **Criterios de Organización**
- **Por Funcionalidad**: Scripts relacionados van en la misma carpeta
- **Por Tecnología**: Scripts de la misma tecnología van juntos
- **Por Propósito**: Testing, monitoreo, deployment, etc.
- **Escalabilidad**: Fácil agregar nuevas categorías

## 🔄 **Flujo de Trabajo**

### **1. Desarrollo de Nuevos Scripts**
```bash
# ✅ Correcto
touch dev-tools/automation/nuevo-script.js
touch dev-tools/testing/nuevo-test.js
touch dev-tools/utilities/nueva-utilidad.ps1

# ❌ Incorrecto
touch nuevo-script.js  # En root
touch test-temp.js     # En root
```

### **2. Migración de Scripts Existentes**
```powershell
# Usar el script de validación
.\dev-tools\validation\validate-root-clean.ps1 -Fix
```

### **3. Validación Continua**
```powershell
# En cada commit
.\dev-tools\validation\validate-root-clean.ps1 -Strict

# En CI/CD pipeline
.\dev-tools\validation\validate-root-clean.ps1 -Strict
```

## 📊 **Métricas de Cumplimiento**

### **KPIs de Limpieza**
- **0 archivos prohibidos en root**
- **100% de scripts en dev-tools/**
- **0 archivos temporales en control de versiones**
- **Estructura consistente en todas las carpetas**

### **Reportes de Validación**
- Lista de archivos prohibidos encontrados
- Sugerencias de reubicación
- Estadísticas de organización
- Alertas de patrones sospechosos

## 🚨 **Sanciones y Correcciones**

### **Proceso de Corrección**
1. **Detección**: Script de validación identifica problemas
2. **Notificación**: Reporte detallado de violaciones
3. **Corrección**: Movimiento automático o manual
4. **Verificación**: Re-validación post-corrección
5. **Prevención**: Actualización de reglas si es necesario

### **Escalación**
- **Advertencia**: Primer incumplimiento
- **Corrección automática**: Segundo incumplimiento
- **Revisión de código**: Incumplimientos repetidos
- **Documentación**: Actualización de políticas

## 📚 **Documentación Relacionada**

- [Estructura del Monorepo](./MONOREPO_STRUCTURE.md)
- [Guía de Desarrollo](./DEVELOPMENT_GUIDE.md)
- [Estándares de Código](./CODING_STANDARDS.md)
- [Proceso de CI/CD](./CI_CD_PROCESS.md)

## 🔗 **Enlaces Útiles**

- **Master Orchestrator**: `dev-tools/master-orchestrator.ps1`
- **Validación de Root**: `dev-tools/validation/validate-root-clean.ps1`
- **Documentación de Dev-Tools**: `dev-tools/README.md`

---

**Última actualización**: $(Get-Date -Format 'dd/MM/yyyy HH:mm')  
**Responsable**: Equipo de Desarrollo VThink 1.0  
**Versión**: 1.0 