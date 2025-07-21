# VibeThink Orchestrator

Plataforma SaaS Multi-tenant desarrollada con metodología VThink 1.0

## 🏗️ **ARQUITECTURA - ACLARACIÓN IMPORTANTE**

### **✅ Estructura Correcta (ÚNICA PERMITIDA)**
```
VibeThink-Orchestrator/
├── apps/                          # ✅ CORRECTO - Monorepo workspaces
│   ├── main-app/                  # Aplicación principal
│   ├── admin/                     # Panel de administración
│   ├── login/                     # Autenticación
│   └── helpdesk/                  # Sistema de soporte
├── src/                           # ✅ Código compartido
├── docs/                          # ✅ Documentación
└── dev-tools/                     # ✅ Herramientas de desarrollo
```

### **❌ Estructuras Prohibidas (ELIMINADAS)**
- `src/app/` → **ELIMINADO** (confuso)
- `src/apps/` → **ELIMINADO** (confuso)

### **🎯 Regla Simple**
- **✅ `/apps` es CORRECTO** - Es el monorepo workspaces
- **❌ `src/app/` y `src/apps/` son PROHIBIDOS** - Fueron eliminados

**📋 Ver documentación completa:** `dev-tools/ARCHITECTURE_CLARIFICATION.md`

## 🚀 **Inicio Rápido**

### **Prerrequisitos**
- Node.js 18+
- npm o yarn
- Git

### **Instalación**
```bash
# Clonar repositorio
git clone [repository-url]
cd VibeThink-Orchestrator

# Instalar dependencias
npm install

# Validar arquitectura
npm run validate:architecture

# Iniciar desarrollo
npm run dev
```

### **Validaciones**
```bash
# Validar arquitectura
npm run validate:architecture

# Validar organización
npm run validate:organization

# Validar reportes
npm run validate:reports

# Validar raíz limpia
npm run validate:root
```

## 📁 **Estructura del Proyecto**

### **Aplicaciones Independientes (`apps/`)**
- **`main-app/`**: Aplicación principal
- **`admin/`**: Panel de administración
- **`login/`**: Autenticación
- **`helpdesk/`**: Sistema de soporte

### **Código Compartido (`src/`)**
- **`shared/`**: Componentes compartidos
- **`lib/`**: Utilidades
- **`integrations/`**: Integraciones externas
- **`modules/`**: Módulos de negocio

### **Documentación (`docs/`)**
- **`reports/`**: Reportes técnicos
- **Docusaurus sites**: Documentación multi-sitio

### **Herramientas (`dev-tools/`)**
- **`scripts/`**: Scripts de desarrollo
- **`automation/`**: Automatización
- **`validation/`**: Validaciones

## 🎯 **Metodología VThink 1.0**

### **Principios**
- **Multi-tenant**: Aislamiento por empresa
- **Role-based**: Control de acceso por roles
- **Modular**: Arquitectura modular
- **CMMI-ML3**: Estándares de calidad

### **Roles del Sistema**
```
SUPER_ADMIN > OWNER > ADMIN > MANAGER > EMPLOYEE
```

## 🔧 **Desarrollo**

### **Comandos Principales**
```bash
# Desarrollo
npm run dev                    # Iniciar desarrollo
npm run build                  # Construir producción
npm run start                  # Iniciar producción

# Testing
npm run test                   # Ejecutar tests
npm run test:watch            # Tests en modo watch
npm run test:coverage         # Tests con cobertura

# Validación
npm run validate:architecture # Validar arquitectura
npm run validate:organization # Validar organización
npm run validate:reports      # Validar reportes

# Documentación
npm run start:sites           # Iniciar sitios Docusaurus
npm run create:sites          # Crear sitios Docusaurus
npm run migrate:docs          # Migrar documentación
```

### **Pre-commit Hooks**
```bash
# Validación automática antes de commit
npm run pre-commit
```

## 📊 **Reportes**

### **Generar Reportes**
```bash
# Crear reporte de migración
npm run create:report migration "Migración Docusaurus"

# Crear reporte de análisis
npm run create:report analysis "Análisis de Dependencias"

# Crear reporte de performance
npm run create:report performance "Métricas de Carga"
```

### **Tipos de Reportes**
- **`migration/`**: Reportes de migración
- **`analysis/`**: Análisis de código
- **`performance/`**: Métricas de rendimiento
- **`security/`**: Auditorías de seguridad
- **`quality/`**: Control de calidad
- **`deployment/`**: Reportes de despliegue
- **`archives/`**: Reportes históricos

## 🤝 **Contribución**

### **Reglas de Contribución**
1. **Arquitectura**: Seguir estructura monorepo
2. **Validación**: Ejecutar validaciones antes de commit
3. **Documentación**: Actualizar documentación
4. **Testing**: Incluir tests para nuevas funcionalidades

### **Proceso de Desarrollo**
1. Crear rama desde `main`
2. Desarrollar funcionalidad
3. Ejecutar validaciones
4. Crear pull request
5. Revisión y merge

## 📚 **Documentación**

### **Sitios Docusaurus**
- **`docusaurus-docs/`**: Documentación de usuario
- **`docusaurus-dev/`**: Documentación de desarrollo
- **`docusaurus-api/`**: Documentación de API
- **`docusaurus-vthink/`**: Metodología VThink 1.0
- **`docusaurus-archives/`**: Documentación histórica

### **Documentación Técnica**
- **`dev-tools/ARCHITECTURE_CLARIFICATION.md`**: Aclaración de arquitectura
- **`dev-tools/ARCHITECTURE_RULES.md`**: Reglas de arquitectura
- **`dev-tools/ORGANIZATION_RULES.md`**: Reglas de organización

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 **Soporte**

Para soporte técnico, consultar:
- **Documentación**: `docs/`
- **Issues**: GitHub Issues
- **Discusiones**: GitHub Discussions

---

**⚠️ IMPORTANTE: `/apps` es CORRECTO, `src/app/` y `src/apps/` son PROHIBIDOS**