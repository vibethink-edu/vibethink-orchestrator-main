# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-01-18

### Added
- ✅ **Migración de Dashboards Bundui Premium**
  - Dashboard `default` (8 componentes) - `/dashboard-bundui/default`
  - Dashboard `website-analytics` (9 componentes) - `/dashboard-bundui/website-analytics`
  - Dashboard `project-management` (10 componentes) - `/dashboard-bundui/project-management`
  - Dashboard `sales` (7 componentes) - `/dashboard-bundui/sales` (migrado y corregido)
  
- ✅ **Componentes Compartidos Nuevos**
  - `DateTimePicker` → `src/shared/components/date-time-picker.tsx`
  - Función `getInitials()` → `packages/utils/src/cn.ts`
  - `CardActionMenus` → `src/shared/components/CardActionMenus.tsx`

- ✅ **Documentación de Migración**
  - Matriz de migración: `docs/architecture/DASHBOARD_MIGRATION_MATRIX.md`
  - Estado de migración: `docs/architecture/MIGRATION_STATUS_2025-01-18.md`

### Changed
- 🔄 **Corrección de Layouts y Imports**
  - Layout `dashboard-bundui`: Imports corregidos a `@/shared/components/...`
  - Layout `dashboard-vibethink`: Imports corregidos
  - Componentes de `sales`: Imports adaptados a `@vibethink/ui`
  - Componentes de `sales`: Rutas de helpers corregidas (`@/shared/components/CardActionMenus`)

- 🔄 **Configuración TypeScript**
  - `tsconfig.json`: Alias `@/shared/*` corregido de `../../src/shared/*` a `./src/shared/*`
  - `tsconfig.json`: Alias `@/*` corregido de `../../src/*` a `./src/*`

### Fixed
- 🐛 **Errores de Módulos Resueltos**
  - Error 500 en dashboard `sales`: Componentes incorrectos reemplazados por versión Bundui Premium
  - Error "Module not found" en layouts: Imports corregidos
  - Error de alias TypeScript: Rutas corregidas en `tsconfig.json`

### Removed
- 🗑️ **Limpieza de Backups Obsoletos**
  - Eliminados backups `bundui-ui.backup*` (más de 200 archivos)
  - Eliminado `tsconfig.tsbuildinfo`
  - Eliminados componentes obsoletos de `sales` (reemplazados por versión correcta)

### Technical
- ⚡ Progreso de migración: 4/15 dashboards core (26.7%)
- ⚡ Velocidad: 3 dashboards/día
- ⚡ Proyección: 9-10 días para completar todos los dashboards

---

## [Unreleased] - 2024-12-17

### Added
- ✅ **Arquitectura de Referencias Externas (Vendors)**
  - Documentación completa en `docs/references/REFERENCE_ARCHITECTURE.md`
  - Guía de estructura en `docs/references/VENDOR_STRUCTURE.md`
  - Scripts de inicio/parada para referencias externas
  
### Changed
- 🔄 **Migración de referencias externas a directorios vendor**
  - `bundui/shadcn-ui-kit-dashboard` movido a `C:\IA Marcelo Labs\bundui\`
  - `shadcn-ui/ui` movido a `C:\IA Marcelo Labs\shadcn-ui\`
  - Directorio `external/` deprecado
  
### Documentation
- 📚 Actualizado `AGENTS.md` con referencias externas y flujo de componentes
- 📚 Nueva sección de documentación de referencias
- 📚 Deprecación documentada de `external/README.md`

### Technical
- ⚡ Scripts actualizados para apuntar a nuevas ubicaciones
- ⚡ Separación clara: vendors fuera del monorepo principal
- ⚡ Puertos asignados: Dashboard=3005, Bundui=3006, Shadcn=3007, ReactFlow=3008
- ⚡ Script de verificación de versiones: `check-vendor-versions.ps1`
- ⚡ Documentación de compatibilidad: `VENDOR_VERSIONS.md`

### Refactoring
- 🔄 **@vibethink/ui v0.2.0** - 100% Shadcn UI Compatible
  - Migrados 22 componentes faltantes desde bundui-ui
  - 55 componentes base (100% cobertura Shadcn)
  - 4 componentes custom VThink
  - 6+ extensiones premium (TipTap, Chat/AI, Kanban, Timeline)
  
### Deprecated
- ❌ **@vibethink/bundui-ui** - ELIMINADO
  - Componentes migrados a `@vibethink/ui`
  - Extensiones en `@vibethink/ui/components/extensions/`
  - Bundui vendor solo como referencia visual (puerto 3006)

---

## [2.8.0] - 2025-07-05

### Added
- ✅ **Stack Tecnológico 100% COMPLETO**
  - Cal.com aprobado para scheduling (MIT)
  - Crawl4AI aprobado para web crawling (9.8/10)
  - Chat2DB aprobado para interfaz de BD (9.5/10)
  - Documenso aprobado para gestión documental (9.3/10)
  - e2CRM desarrollado (Entidad a Entidad) inspirado en Twenty
  - e2PQRS desarrollado (Entidad a Entidad) para gestión de peticiones
  - EasyAppointments rechazado - stack incompatible
- ✅ **Evaluaciones completas** de todos los componentes críticos
- ✅ **Documentación actualizada** con decisiones finales
- ✅ **Inventario completo** de evaluaciones realizadas
- ✅ **e2CRM Concept** - Sistema Entidad a Entidad con inspiraciones de Twenty

### Changed
- 🔄 Actualizado sistema de DNS multi-tenant
- 🔄 Mejorado proceso de evaluación de componentes
- 🔄 Optimizada documentación del stack tecnológico

### Fixed
- 🐛 Corregida estructura de documentación
- 🐛 Actualizada información de licencias
- 🐛 Mejorada consistencia en documentación

## [1.1.0] - 2025-06-16

### Añadido
- **Sistema completo de configuraciones de plataforma**
  - Configuraciones globales gestionadas por super admin
  - Overrides específicos por empresa con fechas de expiración
  - Log completo de auditoría para todos los cambios
  - Funciones SQL para gestión de configuraciones

### Refactorizado
- **Componentes de administración modularizados**
  - `ConfigurationForm`: Formulario reutilizable para configuraciones
  - `ConfigurationTable`: Tabla genérica para mostrar configuraciones
  - `AuditLogTable`: Tabla especializada para log de auditoría
  - `GlobalConfigurationPanel`: Panel simplificado usando componentes modulares
  - `CompanyOverridesPanel`: Panel mejorado con mejor UX

### Corregido
- **Error de TypeScript** en `usePlatformConfigurations`
  - Corregido tipado de `AuditLogEntry` para manejar relaciones nullables
  - Agregada transformación de datos para errores de Supabase
  - Mejorado manejo de tipos en relaciones de tablas

### Documentación
- **Nuevos documentos de arquitectura**:
  - `REFACTORING_LOG.md`: Log detallado del proceso de refactorización
  - `CURSOR_DEVELOPMENT_STANDARDS.md`: Estándares para Cursor IDE
  - `COMPONENT_ARCHITECTURE.md`: Guía completa de arquitectura de componentes

### Técnico
- **Separación de responsabilidades mejorada**
  - Hooks para lógica de negocio
  - Componentes focalizados en UI
  - Servicios para API calls
- **Componentes reutilizables**
  - Reducción de código duplicado
  - Interfaces bien definidas
  - Mejor testabilidad

### Migraciones SQL
- **Nuevas tablas**:
  - `platform_configurations`: Configuraciones globales
  - `company_configuration_overrides`: Overrides por empresa
  - `configuration_audit_log`: Log de auditoría
- **Funciones de base de datos**:
  - `get_effective_configuration()`: Obtener configuración efectiva
  - `upsert_platform_configuration()`: Crear/actualizar configuraciones
  - `create_company_override()`: Crear overrides de empresa
- **Políticas RLS**: Seguridad a nivel de fila implementada

### Performance
- **Arquitectura optimizada**
  - Componentes más pequeños (< 150 líneas)
  - Separación clara de responsabilidades
  - Potencial para lazy loading y memoización

## [1.0.0] - 2025-01-15

### Añadido
- Sistema de autenticación mock con roles jerárquicos
- Protección de rutas basada en roles (EMPLOYEE, MANAGER, ADMIN, OWNER)
- Panel de administración con múltiples secciones
- Layout responsive con sidebar y header
- Componentes de UI con shadcn/ui
- Documentación completa del proyecto
- Configuración inicial de Supabase

### Características Principales
- **Autenticación**: Sistema mock con persistencia en localStorage
- **Roles**: Jerarquía de 4 niveles con control de acceso
- **Administración**: Panel para gestión de usuarios, permisos y límites
- **UI/UX**: Diseño moderno con Tailwind CSS y componentes shadcn/ui
- **Routing**: React Router con protección avanzada de rutas

### Páginas Implementadas
- `/login` - Página de inicio de sesión
- `/dashboard` - Dashboard principal (todos los usuarios)
- `/admin` - Panel de administración (solo ADMIN+)
- `/admin/users` - Gestión de usuarios (placeholder)
- `/admin/permissions` - Gestión de permisos (placeholder)
- `/admin/limits` - Gestión de límites (placeholder)
- `/documentation` - Documentación del sistema (solo ADMIN+)

### Componentes Técnicos
- `useAuth` - Hook personalizado para gestión de autenticación

## [2025-07-01] Limpieza post-migración VibeThink/VTK

- Se eliminó el directorio `eslint-plugin-ai-pair-parametric` de la raíz, ya que sus reglas estaban alineadas con la metodología anterior (AIPAIR/XTP/XTR) y no aportaba valor a la nueva cultura VibeThink/VTK.
- Documentación y estructura centralizadas en `docs/` siguiendo los estándares VTK.

## [2025-07-03] Limpieza de carpetas temporales y cobertura

- Se eliminó la carpeta `coverage/` y su subcarpeta `.tmp/` (vacía), ya que solo almacenaban archivos temporales de reportes de cobertura.
- Se verificó que `coverage/` está correctamente incluida en los `.gitignore` principales y de subproyectos, asegurando que no se versionen archivos de cobertura en el futuro.
- Esta acción refuerza las buenas prácticas de CI/CD y mantiene la estructura del monorepo limpia y profesional.