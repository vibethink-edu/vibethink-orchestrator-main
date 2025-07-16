# 🌳 Árbol de Rutas - AI Pair Orchestrator Pro

## 📊 Vista Jerárquica

```
/
├── 📄 / (Index) [PUBLIC]
├── 🔐 /auth (Auth) [PUBLIC]
├── 🔐 /login (Login) [PUBLIC]
├── 🔐 /simple-login (SimpleLogin) [PUBLIC]
├── 📊 /dashboard (Dashboard) [PROTECTED + LAYOUT]
│   ├── 📁 /operational-repositories (OperationalRepositories)
│   ├── 🔄 /workflows (Workflows)
│   ├── 💰 /plans (Plans)
│   ├── 📚 /documentation (Documentation)
│   ├── 🎤 /meeting-processor-demo (MeetingProcessorDemo)
│   └── 📅 /daily-workflow (DailyWorkflow)
├── 🧪 /testing (TestingLanding) [DEVELOPER]
│   ├── 🔧 /testing/phase2 (Phase2Testing)
│   ├── 🎨 /testing/theme (ThemeTesting)
│   ├── 🌍 /testing/language (LanguageTesting)
│   ├── ⚙️ /testing/dual-configuration (DualConfigurationTest)
│   ├── 💳 /testing/billing (BillingTest)
│   └── 👥 /testing/roles (RoleTesting)
├── 👨‍💼 /admin (AdminPanel) [ADMIN + LAYOUT]
│   ├── 👥 /admin/users (UsersPage)
│   ├── 🏢 /admin/companies (CompanyAdministration)
│   ├── 📦 /admin/plans (PlanManagement)
│   ├── ⚖️ /admin/limits (LimitManagement)
│   └── 🔐 /admin/permissions (PermissionManagement)
├── 👑 /super-admin (SuperAdminDashboard) [SUPER_ADMIN + LAYOUT]
├── 🎨 /mockup-demo (MockupDemo) [NO LAYOUT]
├── 🎨 /classic (MockupDashboardClassic) [NO LAYOUT]
├── 🎨 /minimal (MockupDashboardMinimal) [NO LAYOUT]
├── 🎨 /tabs (MockupDashboardTabs) [NO LAYOUT]
├── 🤖 /aistudio (AIStudioMockup) [NO LAYOUT]
└── 🤖 /mockup (MockupAIStudioPage) [NO LAYOUT]
```

## 🏷️ Leyenda

- 📄 Página pública
- 🔐 Autenticación requerida
- 📊 Dashboard principal
- 🧪 Testing y desarrollo
- 👨‍💼 Administración
- 👑 Super administración
- 🎨 Mockups y prototipos
- 🤖 AI Studio

## 🔐 Niveles de Protección

- **[PUBLIC]**: Sin autenticación requerida
- **[PROTECTED]**: Requiere autenticación
- **[ADMIN]**: Requiere rol ADMIN o superior
- **[SUPER_ADMIN]**: Requiere rol SUPER_ADMIN
- **[DEVELOPER]**: Requiere rol DEVELOPER o SUPER_ADMIN

## 🏗️ Layouts

- **[LAYOUT]**: Usa DashboardLayout (sidebar, header, footer)
- **[NO LAYOUT]**: Sin layout específico (página completa)

---

## 📊 Estadísticas por Categoría

### 🌐 Públicas (4 rutas)
- Landing page
- Autenticación
- Login tradicional y simplificado

### 🔒 Protegidas (8 rutas)
- Dashboard principal
- Funcionalidades core
- Demos y workflows

### 👨‍💼 Administración (6 rutas)
- Panel de admin
- Gestión de usuarios
- Configuración de empresa

### 🧪 Testing (7 rutas)
- Herramientas de desarrollo
- Testing de funcionalidades
- Validación de roles

### 🎨 Mockups (6 rutas)
- Prototipos de UI
- Demos de componentes
- Testing de layouts

---

## 🔄 Flujo de Navegación

### Usuario Público
```
/ → /auth → /login → [Autenticación] → /dashboard
```

### Usuario Autenticado
```
/dashboard → /workflows → /operational-repositories → /plans
```

### Administrador
```
/admin → /admin/users → /admin/companies → /admin/plans
```

### Super Admin
```
/super-admin → /admin/* → /testing/* → [Todas las rutas]
```

### Developer
```
/testing → /testing/phase2 → /testing/theme → /testing/language
```

---

## 🎯 Patrones de Navegación

### Navegación Principal
- **Dashboard**: Centro de control principal
- **Workflows**: Gestión de procesos
- **Repositories**: Gestión de repositorios
- **Plans**: Gestión de planes y facturación

### Navegación de Admin
- **Users**: Gestión de usuarios
- **Companies**: Administración de empresas
- **Plans**: Configuración de planes
- **Limits**: Gestión de límites
- **Permissions**: Control de permisos

### Navegación de Testing
- **Phase2**: Testing de nuevas funcionalidades
- **Theme**: Testing de temas y UI
- **Language**: Testing de internacionalización
- **Dual Configuration**: Testing de configuraciones
- **Billing**: Testing de facturación
- **Roles**: Testing de permisos y roles

---

*Árbol generado manualmente - Actualizar con cada cambio en el routing* 