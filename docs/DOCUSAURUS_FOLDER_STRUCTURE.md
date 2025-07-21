# 📁 **ESTRUCTURA DE CARPETAS DOCUSAURUS - VibeThink.ai**

## 🎯 **RESUMEN EJECUTIVO**

**Ubicación:** Respeta estructura actual del proyecto  
**Configuración:** 🏠 Local inicial  
**Idiomas:** 🇪🇸 Español + 🇺🇸 English  
**Seguridad:** 🔒 Público vs Privado  
**Compatibilidad:** ✅ Preserva docs/ actual  
**Fecha:** 19/7/2025

## 🛡️ **COMPATIBILIDAD CON DOCS/ ACTUAL**

### **✅ ESTRATEGIA DE MIGRACIÓN SEGURA:**
```bash
# ✅ docs/ actual SE MANTIENE INTACTO
VibeThink-Orchestrator/
├── 📚 docs/                           # ✅ MANTENER (Documentación actual)
│   ├── 📄 development/                 # ✅ Preservar
│   ├── 📄 methodologies/               # ✅ Preservar
│   ├── 📄 integrations/                # ✅ Preservar
│   ├── 📄 architecture/                # ✅ Preservar
│   ├── 📄 reports/                     # ✅ Preservar
│   ├── 📄 projects/                    # ✅ Preservar
│   ├── 📄 evaluations/                 # ✅ Preservar
│   └── 📄 [todos los archivos actuales] # ✅ Preservar
├── 🎯 docusaurus-vthink/              # 🆕 NUEVO (vthink.vibethink.ai)
├── 🛠️ docusaurus-dev/                 # 🆕 NUEVO (dev.vibethink.ai)
├── 📖 docusaurus-docs/                # 🆕 NUEVO (docs.vibethink.ai)
├── ⚙️ docusaurus-platform-admin/      # 🆕 NUEVO (platform-admin.vibethink.ai)
├── 🔌 docusaurus-api/                 # 🆕 NUEVO (api.vibethink.ai)
└── 📋 docs-management/                 # 🆕 NUEVO (Gestión centralizada)
```

### **🔄 PROCESO DE MIGRACIÓN GRADUAL:**
```typescript
// ✅ Fase 1: Crear Docusaurus sin tocar docs/
const migrationPhase1 = {
  action: "Crear carpetas Docusaurus en raíz",
  preserve: "docs/ actual intacto",
  parallel: "Ambos sistemas funcionan simultáneamente",
  risk: "CERO - No afecta documentación existente"
};

// ✅ Fase 2: Migrar contenido gradualmente
const migrationPhase2 = {
  action: "Migrar contenido de docs/ a Docusaurus",
  method: "Copia selectiva, no eliminación",
  validation: "Verificar funcionamiento antes de eliminar",
  rollback: "Siempre posible volver a docs/"
};

// ✅ Fase 3: Eliminación opcional
const migrationPhase3 = {
  action: "Eliminar docs/ solo si es necesario",
  condition: "Solo después de validación completa",
  backup: "Crear backup antes de eliminar"
};
```

### **📋 CONTENIDO ACTUAL DE DOCS/ A MIGRAR:**
```bash
# ✅ Archivos identificados para migración
docs/
├── 📄 VIBETHINK_PROJECT_DOCUMENTATION.md     # → docusaurus-docs/
├── 📄 USER_MANUALS.md                        # → docusaurus-docs/
├── 📄 SWAGGER_DOCUMENTATION.md               # → docusaurus-api/
├── 📄 VIBE_CODING_METHODOLOGY.md             # → docusaurus-vthink/
├── 📄 DEVELOPMENT_GUIDE.md                    # → docusaurus-dev/
├── 📄 methodologies/                          # → docusaurus-vthink/
├── 📄 development/                            # → docusaurus-dev/
├── 📄 integrations/                           # → docusaurus-dev/
├── 📄 architecture/                           # → docusaurus-dev/
└── 📄 [otros archivos técnicos]              # → Según categoría
```

## 🏗️ **UBICACIÓN DE CARPETAS DOCUSAURUS**

### **📁 Estructura Propuesta:**
```bash
VibeThink-Orchestrator/
├── 📚 docs/                           # Documentación actual (MANTENER)
│   ├── 📄 development/                 # Guías de desarrollo
│   ├── 📄 methodologies/               # Metodologías
│   ├── 📄 integrations/                # Integraciones
│   ├── 📄 architecture/                # Arquitectura
│   └── 📄 reports/                     # Reportes
├── 🎯 docusaurus-vthink/              # vthink.vibethink.ai (PÚBLICO)
├── 🛠️ docusaurus-dev/                 # dev.vibethink.ai (PÚBLICO)
├── 📖 docusaurus-docs/                # docs.vibethink.ai (PÚBLICO)
├── ⚙️ docusaurus-platform-admin/      # platform-admin.vibethink.ai (PRIVADO)
├── 🔌 docusaurus-api/                 # api.vibethink.ai (PÚBLICO)
└── 📋 docs-management/                 # Gestión centralizada
```

### **🎯 Justificación de Ubicación:**
- ✅ **Respeta estructura actual** - No mover docs/ existente
- ✅ **Mantiene organización** - Cada Docusaurus independiente
- ✅ **Escalabilidad** - Fácil agregar nuevos Docusaurus
- ✅ **Gestión centralizada** - docs-management/ para coordinación
- ✅ **Seguridad diferenciada** - Público vs Privado
- ✅ **Compatibilidad total** - docs/ actual se preserva

## 🔒 **CLASIFICACIÓN DE ACCESO**

### **🌐 DOCUMENTACIÓN PÚBLICA:**
```typescript
const publicDocs = {
  vthink: {
    url: "https://vthink.vibethink.ai",
    access: "Público",
    audience: "Comunidad de desarrolladores",
    content: "Metodología VThink 1.0"
  },
  dev: {
    url: "https://dev.vibethink.ai", 
    access: "Público",
    audience: "Desarrolladores",
    content: "Herramientas de desarrollo"
  },
  docs: {
    url: "https://docs.vibethink.ai",
    access: "Público", 
    audience: "Empresas cliente",
    content: "Documentación de usuario"
  },
  api: {
    url: "https://api.vibethink.ai",
    access: "Público",
    audience: "Integradores",
    content: "Documentación de APIs"
  }
};
```

### **🔒 DOCUMENTACIÓN PRIVADA:**
```typescript
const privateDocs = {
  platformAdmin: {
    url: "https://platform-admin.vibethink.ai",
    access: "Privado - Autenticación requerida",
    audience: "Super admins del SaaS",
    auth: {
      method: "Supabase Auth",
      roles: ["SUPER_ADMIN", "PLATFORM_ADMIN"],
      session: "JWT token"
    },
    content: "Administración de la plataforma SaaS"
  }
};
```

## 📋 **DETALLES POR CARPETA**

### **🎯 docusaurus-vthink/ (Metodología - PÚBLICO)**
```bash
# ✅ Ubicación: Raíz del proyecto
VibeThink-Orchestrator/docusaurus-vthink/

# ✅ Estructura interna
docusaurus-vthink/
├── 📄 docusaurus.config.js
├── 📄 package.json
├── 📄 sidebars.js
├── 📄 src/
│   ├── 📄 i18n/
│   │   ├── 📄 es/                      # Contenido en Español
│   │   │   └── 📄 docusaurus-plugin-content-docs/
│   │   │       └── 📄 current/
│   │   │           ├── 📄 intro.md
│   │   │           ├── 📄 methodology/
│   │   │           ├── 📄 frameworks/
│   │   │           ├── 📄 templates/
│   │   │           └── 📄 processes/
│   │   └── 📄 en/                      # Contenido en Inglés
│   │       └── 📄 docusaurus-plugin-content-docs/
│   │           └── 📄 current/
│   │               ├── 📄 intro.md
│   │               ├── 📄 methodology/
│   │               ├── 📄 frameworks/
│   │               ├── 📄 templates/
│   │               └── 📄 processes/
│   ├── 📄 pages/
│   ├── 📄 components/
│   └── 📄 css/
└── 📄 static/
```

### **🛠️ docusaurus-dev/ (Desarrollo - PÚBLICO)**
```bash
# ✅ Ubicación: Raíz del proyecto
VibeThink-Orchestrator/docusaurus-dev/

# ✅ Estructura interna
docusaurus-dev/
├── 📄 docusaurus.config.js
├── 📄 package.json
├── 📄 sidebars.js
├── 📄 src/
│   ├── 📄 i18n/
│   │   ├── 📄 es/                      # Contenido en Español
│   │   │   └── 📄 docusaurus-plugin-content-docs/
│   │   │       └── 📄 current/
│   │   │           ├── 📄 intro.md
│   │   │           ├── 📄 api-docs/
│   │   │           ├── 📄 sdk-guides/
│   │   │           ├── 📄 dev-tools/
│   │   │           └── 📄 deployment/
│   │   └── 📄 en/                      # Contenido en Inglés
│   │       └── 📄 docusaurus-plugin-content-docs/
│   │           └── 📄 current/
│   │               ├── 📄 intro.md
│   │               ├── 📄 api-docs/
│   │               ├── 📄 sdk-guides/
│   │               ├── 📄 dev-tools/
│   │               └── 📄 deployment/
│   ├── 📄 pages/
│   ├── 📄 components/
│   └── 📄 css/
└── 📄 static/
```

### **📖 docusaurus-docs/ (Usuario Final - PÚBLICO)**
```bash
# ✅ Ubicación: Raíz del proyecto
VibeThink-Orchestrator/docusaurus-docs/

# ✅ Estructura interna
docusaurus-docs/
├── 📄 docusaurus.config.js
├── 📄 package.json
├── 📄 sidebars.js
├── 📄 src/
│   ├── 📄 i18n/
│   │   ├── 📄 es/                      # Contenido en Español
│   │   │   └── 📄 docusaurus-plugin-content-docs/
│   │   │       └── 📄 current/
│   │   │           ├── 📄 intro.md
│   │   │           ├── 📄 user-guides/
│   │   │           ├── 📄 onboarding/
│   │   │           ├── 📄 troubleshooting/
│   │   │           ├── 📄 faq/
│   │   │           └── 📄 company-admin/     # Admin de empresas
│   │   └── 📄 en/                      # Contenido en Inglés
│   │       └── 📄 docusaurus-plugin-content-docs/
│   │           └── 📄 current/
│   │               ├── 📄 intro.md
│   │               ├── 📄 user-guides/
│   │               ├── 📄 onboarding/
│   │               ├── �� troubleshooting/
│   │               ├── 📄 faq/
│   │               └── 📄 company-admin/     # Company admin
│   ├── 📄 pages/
│   ├── 📄 components/
│   └── 📄 css/
└── 📄 static/
```

### **⚙️ docusaurus-platform-admin/ (Administración del SaaS - PRIVADO)**
```bash
# ✅ Ubicación: Raíz del proyecto
VibeThink-Orchestrator/docusaurus-platform-admin/

# ✅ Estructura interna
docusaurus-platform-admin/
├── 📄 docusaurus.config.js
├── 📄 package.json
├── 📄 sidebars.js
├── 📄 src/
│   ├── 📄 i18n/
│   │   ├── 📄 es/                      # Contenido en Español
│   │   │   └── 📄 docusaurus-plugin-content-docs/
│   │   │       └── 📄 current/
│   │   │           ├── 📄 intro.md
│   │   │           ├── 📄 platform-config/   # Configuración del SaaS
│   │   │           ├── 📄 system-monitoring/ # Monitoreo del sistema
│   │   │           ├── 📄 support-tools/     # Herramientas de soporte
│   │   │           ├── 📄 security-policies/ # Políticas de seguridad
│   │   │           └── 📄 backup-recovery/   # Backup y recuperación
│   │   └── 📄 en/                      # Contenido en Inglés
│   │       └── 📄 docusaurus-plugin-content-docs/
│   │           └── 📄 current/
│   │               ├── 📄 intro.md
│   │               ├── 📄 platform-config/   # SaaS Configuration
│   │               ├── 📄 system-monitoring/ # System Monitoring
│   │               ├── 📄 support-tools/     # Support Tools
│   │               ├── 📄 security-policies/ # Security Policies
│   │               └── 📄 backup-recovery/   # Backup & Recovery
│   ├── 📄 pages/
│   ├── 📄 components/
│   └── 📄 css/
└── 📄 static/
```

### **🔌 docusaurus-api/ (APIs - PÚBLICO)**
```bash
# ✅ Ubicación: Raíz del proyecto
VibeThink-Orchestrator/docusaurus-api/

# ✅ Estructura interna
docusaurus-api/
├── 📄 docusaurus.config.js
├── 📄 package.json
├── 📄 sidebars.js
├── 📄 src/
│   ├── 📄 i18n/
│   │   ├── 📄 es/                      # Contenido en Español
│   │   │   └── 📄 docusaurus-plugin-content-docs/
│   │   │       └── 📄 current/
│   │   │           ├── 📄 intro.md
│   │   │           ├── 📄 api-reference/
│   │   │           ├── 📄 authentication/
│   │   │           ├── 📄 code-examples/
│   │   │           └── 📄 sdk-docs/
│   │   └── 📄 en/                      # Contenido en Inglés
│   │       └── 📄 docusaurus-plugin-content-docs/
│   │           └── 📄 current/
│   │               ├── 📄 intro.md
│   │               ├── 📄 api-reference/
│   │               ├── 📄 authentication/
│   │               ├── 📄 code-examples/
│   │               └── 📄 sdk-docs/
│   ├── 📄 pages/
│   ├── 📄 components/
│   └── 📄 css/
└── 📄 static/
```

## 🔐 **CONFIGURACIÓN DE AUTENTICACIÓN**

### **🔒 Para docusaurus-platform-admin/ (PRIVADO):**
```typescript
// ✅ Configuración de autenticación
const authConfig = {
  provider: "Supabase Auth",
  required: true,
  roles: ["SUPER_ADMIN", "PLATFORM_ADMIN"],
  redirect: "/login",
  session: {
    type: "JWT",
    storage: "localStorage",
    refresh: true
  },
  middleware: {
    checkAuth: true,
    checkRole: true,
    redirectUnauthorized: true
  }
};

// ✅ Componente de protección
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user || !hasRole(user, requiredRole)) {
    return <Redirect to="/login" />;
  }
  
  return children;
};
```

## 🚀 **CONFIGURACIÓN DE DEPLOY**

### **📅 Fase 1: Local (Actual)**
```bash
# ✅ URLs locales por carpeta
http://localhost:3000/vthink-docs        # docusaurus-vthink/ (PÚBLICO)
http://localhost:3000/dev-docs           # docusaurus-dev/ (PÚBLICO)
http://localhost:3000/docs               # docusaurus-docs/ (PÚBLICO)
http://localhost:3000/platform-admin     # docusaurus-platform-admin/ (PRIVADO)
http://localhost:3000/api-docs           # docusaurus-api/ (PÚBLICO)
```

### **📅 Fase 2: Subdominios (Futuro)**
```bash
# 🚀 URLs con subdominios (DIFERENCIADOS)
https://vthink.vibethink.ai              # docusaurus-vthink/ (PÚBLICO)
https://dev.vibethink.ai                 # docusaurus-dev/ (PÚBLICO)
https://docs.vibethink.ai                # docusaurus-docs/ (PÚBLICO)
https://platform-admin.vibethink.ai      # docusaurus-platform-admin/ (PRIVADO)
https://api.vibethink.ai                 # docusaurus-api/ (PÚBLICO)
```

## ✅ **DIFERENCIACIÓN CLARA**

### **📖 docs.vibethink.ai - Empresas Cliente (PÚBLICO):**
```typescript
const companyAdminContent = {
  purpose: "Administración de empresas cliente",
  access: "Público",
  audience: [
    "Administradores de empresa",
    "OWNER de empresas",
    "ADMIN de empresas",
    "Equipos de negocio"
  ],
  content: [
    "Gestión de usuarios de la empresa",
    "Configuración de la empresa",
    "Billing y planes",
    "Reportes de la empresa",
    "Integraciones de la empresa"
  ]
};
```

### **⚙️ platform-admin.vibethink.ai - Administración del SaaS (PRIVADO):**
```typescript
const platformAdminContent = {
  purpose: "Administración de la plataforma SaaS",
  access: "Privado - Autenticación requerida",
  audience: [
    "Super admins del SaaS",
    "Platform administrators",
    "Technical support",
    "System operators",
    "DevOps team"
  ],
  auth: {
    required: true,
    roles: ["SUPER_ADMIN", "PLATFORM_ADMIN"],
    session: "JWT token"
  },
  content: [
    "Configuración del sistema SaaS",
    "Monitoreo de toda la plataforma",
    "Gestión de múltiples empresas",
    "Herramientas de soporte técnico",
    "Políticas de seguridad globales",
    "Backup y recuperación del sistema"
  ]
};
```

## 🔗 **CROSS-REFERENCING CLARO**

### **📋 Enlaces Diferenciados:**
```markdown
// ✅ Enlaces claros y diferenciados
[VThink Methodology](https://vthink.vibethink.ai)                    # PÚBLICO
[Development Tools](https://dev.vibethink.ai)                        # PÚBLICO
[User Documentation](https://docs.vibethink.ai)                      # PÚBLICO
[Platform Administration](https://platform-admin.vibethink.ai)        # PRIVADO
[API Reference](https://api.vibethink.ai)                            # PÚBLICO
```

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **✅ Fase 1: Configuración Local**
- [ ] **Crear carpetas** Docusaurus en raíz
- [ ] **Configurar docusaurus.config.js** para cada carpeta
- [ ] **Configurar i18n** para Español e Inglés
- [ ] **Diferenciar contenido** empresa vs plataforma
- [ ] **Implementar selector** de idioma
- [ ] **Configurar autenticación** para platform-admin
- [ ] **Probar URLs locales** bilingües
- [ ] **Validar compatibilidad** con docs/ actual

### **📅 Fase 2: Subdominios**
- [ ] **Configurar DNS** para subdominios
- [ ] **Configurar SSL** para cada subdominio
- [ ] **Optimizar SEO** por idioma
- [ ] **Implementar analytics** separados por idioma
- [ ] **Configurar autenticación** en producción

---

**📌 NOTA: Esta estructura diferencia claramente la documentación pública vs privada, con autenticación requerida solo para platform-admin. El docs/ actual se preserva completamente durante la migración.** 