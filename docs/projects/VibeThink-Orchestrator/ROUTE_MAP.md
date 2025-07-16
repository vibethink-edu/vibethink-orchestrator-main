# 🗺️ Mapa de Rutas - AI Pair Orchestrator Pro

## 📋 Resumen Ejecutivo

Este documento contiene el mapa completo de rutas de la aplicación AI Pair Orchestrator Pro.
**Última actualización**: 19 de Enero 2025

### 📊 Estadísticas
- **Total de rutas**: 25
- **Rutas públicas**: 4
- **Rutas protegidas**: 8
- **Rutas de admin**: 6
- **Rutas de testing**: 7
- **Rutas de mockup**: 6

---

## 🌐 Rutas Públicas

| Ruta | Componente | Descripción | Estado |
|------|------------|-------------|--------|
| `/` | `Index` | Página principal | ✅ Activa |
| `/auth` | `Auth` | Autenticación | ✅ Activa |
| `/login` | `Login` | Login tradicional | ✅ Activa |
| `/simple-login` | `SimpleLogin` | Login simplificado | ✅ Activa |

---

## 🔒 Rutas Protegidas (con DashboardLayout)

| Ruta | Componente | Layout | Permisos | Estado |
|------|------------|--------|----------|--------|
| `/dashboard` | `Dashboard` | DashboardLayout | Autenticado | ✅ Activa |
| `/operational-repositories` | `OperationalRepositories` | DashboardLayout | Autenticado | ✅ Activa |
| `/workflows` | `Workflows` | DashboardLayout | Autenticado | ✅ Activa |
| `/plans` | `Plans` | DashboardLayout | Autenticado | ✅ Activa |
| `/documentation` | `Documentation` | DashboardLayout | Autenticado | ✅ Activa |
| `/meeting-processor-demo` | `MeetingProcessorDemo` | DashboardLayout | Autenticado | ✅ Activa |
| `/daily-workflow` | `DailyWorkflow` | DashboardLayout | Autenticado | ✅ Activa |

---

## 👨‍💼 Rutas de Administración

| Ruta | Componente | Permisos | Descripción | Estado |
|------|------------|----------|-------------|--------|
| `/admin` | `AdminPanel` | ADMIN+ | Panel principal de admin | ✅ Activa |
| `/admin/users` | `UsersPage` | ADMIN+ | Gestión de usuarios | ✅ Activa |
| `/admin/companies` | `CompanyAdministration` | ADMIN+ | Administración de empresas | ✅ Activa |
| `/admin/plans` | `PlanManagement` | ADMIN+ | Gestión de planes | ✅ Activa |
| `/admin/limits` | `LimitManagement` | ADMIN+ | Gestión de límites | ✅ Activa |
| `/admin/permissions` | `PermissionManagement` | ADMIN+ | Gestión de permisos | ✅ Activa |

---

## 👑 Rutas de Super Admin

| Ruta | Componente | Permisos | Descripción | Estado |
|------|------------|----------|-------------|--------|
| `/super-admin` | `SuperAdminDashboard` | SUPER_ADMIN | Dashboard de super admin | ✅ Activa |

---

## 🧪 Rutas de Testing

| Ruta | Componente | Rol Requerido | Descripción | Estado |
|------|------------|---------------|-------------|--------|
| `/testing` | `TestingLanding` | DEVELOPER | Landing de testing | ✅ Activa |
| `/testing/phase2` | `Phase2Testing` | DEVELOPER | Testing fase 2 | ✅ Activa |
| `/testing/theme` | `ThemeTesting` | DEVELOPER | Testing de temas | ✅ Activa |
| `/testing/language` | `LanguageTesting` | DEVELOPER | Testing de idiomas | ✅ Activa |
| `/testing/dual-configuration` | `DualConfigurationTest` | DEVELOPER | Testing configuración dual | ✅ Activa |
| `/testing/billing` | `BillingTest` | DEVELOPER | Testing de facturación | ✅ Activa |
| `/testing/roles` | `RoleTesting` | DEVELOPER | Testing de roles | ✅ Activa |

---

## 🎨 Rutas de Mockup

| Ruta | Componente | Descripción | Estado |
|------|------------|-------------|--------|
| `/mockup-demo` | `MockupDemo` | Demo de mockups | ✅ Activa |
| `/classic` | `MockupDashboardClassic` | Dashboard clásico | ✅ Activa |
| `/minimal` | `MockupDashboardMinimal` | Dashboard minimalista | ✅ Activa |
| `/tabs` | `MockupDashboardTabs` | Dashboard con tabs | ✅ Activa |
| `/aistudio` | `AIStudioMockup` | Mockup AI Studio | ✅ Activa |
| `/mockup` | `MockupAIStudioPage` | Página AI Studio | ✅ Activa |

---

## 🔐 Matriz de Permisos

### Niveles de Acceso

| Nivel | Descripción | Rutas Accesibles |
|-------|-------------|------------------|
| **Público** | Sin autenticación | `/`, `/auth`, `/login`, `/simple-login` |
| **Autenticado** | Usuario logueado | `/dashboard`, `/workflows`, `/operational-repositories`, etc. |
| **ADMIN** | Administrador de empresa | `/admin/*` + todas las rutas protegidas |
| **SUPER_ADMIN** | Super administrador | Todas las rutas + cross-company |

### Permisos por Rol

| Rol | Rutas Específicas | Capacidades |
|-----|-------------------|-------------|
| **EMPLOYEE** | `/dashboard`, `/workflows` | Acceso básico a funcionalidades |
| **MANAGER** | + `/operational-repositories` | Gestión de repositorios |
| **ADMIN** | + `/admin/*` | Administración de empresa |
| **OWNER** | + `/plans`, `/documentation` | Gestión completa de empresa |
| **SUPER_ADMIN** | + `/super-admin`, `/testing/*` | Control total de la plataforma |
| **DEVELOPER** | + `/testing/*` | Acceso a herramientas de desarrollo |

---

## 🏗️ Estructura de Layouts

### Layout Principal (DashboardLayout)
- **Aplicado a**: Todas las rutas protegidas principales
- **Componentes**: Sidebar, Header, Footer, Content Area
- **Responsive**: Adaptable a móvil, tablet y desktop
- **Rutas**: `/dashboard`, `/workflows`, `/operational-repositories`, etc.

### Layout de Testing
- **Aplicado a**: Rutas de testing específicas
- **Componentes**: TestingRouteGuard, contenido aislado
- **Propósito**: Testing sin interferencias del layout principal
- **Rutas**: `/testing/*`

### Sin Layout
- **Aplicado a**: Mockups, páginas públicas, testing aislado
- **Propósito**: Máxima flexibilidad para prototipos
- **Rutas**: `/`, `/auth`, `/mockup-demo`, `/classic`, etc.

---

## 📝 Notas de Desarrollo

### Convenciones de Naming
- **Rutas públicas**: Sin prefijo especial (`/`, `/auth`)
- **Rutas protegidas**: Prefijo funcional (`/dashboard`, `/workflows`)
- **Rutas de admin**: Prefijo `/admin`
- **Rutas de testing**: Prefijo `/testing`
- **Rutas de mockup**: Sin prefijo específico o `/mockup`

### Patrones de Seguridad
- **ProtectedRoute**: Wrapper para rutas que requieren autenticación
- **TestingRouteGuard**: Wrapper específico para rutas de testing
- **Role-based access**: Control granular por rol de usuario
- **Company isolation**: Todas las rutas respetan aislamiento multi-tenant

### Mejores Prácticas
- ✅ Rutas organizadas por categoría
- ✅ Permisos claramente definidos
- ✅ Layouts consistentes
- ✅ Naming descriptivo
- ✅ Separación de concerns

---

## 🔄 Mantenimiento

### Actualización Manual
Para actualizar este documento cuando se agreguen nuevas rutas:

1. **Agregar la ruta** en `src/App.tsx`
2. **Actualizar esta tabla** con la nueva información
3. **Verificar permisos** y layout aplicado
4. **Actualizar fecha** de última modificación

### Verificación de Rutas
Para verificar que todas las rutas están correctamente configuradas:

```bash
# Verificar que todas las rutas son accesibles
npm run test:routes

# Verificar permisos
npm run test:permissions
```

---

## 🚀 Próximos Pasos

### Automatización
- [ ] Implementar script de generación automática
- [ ] Integrar con CI/CD para actualización automática
- [ ] Crear validación de rutas en tests

### Mejoras
- [ ] Agregar diagramas visuales de navegación
- [ ] Implementar breadcrumbs automáticos
- [ ] Crear sitemap dinámico

---

*Documento mantenido manualmente - Actualizar con cada cambio en el routing* 