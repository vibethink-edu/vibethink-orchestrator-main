# Estructura General del Monorepo VibeThink Orchestrator

## 🌳 Árbol de estructura general

```plaintext
/
├── src/
│   ├── apps/                    # Aplicaciones principales (front, admin, etc.)
│   │   └── [NombreApp]/         # Ejemplo: dashboard, admin, ai-chat, helpdesk, login
│   ├── modules/                 # Módulos propios de negocio
│   │   └── [NombreModulo]/      # Estructura libre, README y tests obligatorios
│   ├── ported/                  # Software portado (con original y adaptaciones)
│   │   └── [NombrePort]/        # Un port por carpeta
│   │       ├── src/             # Código portado/adaptado
│   │       ├── original/        # Código original para referencia/pruebas
│   │       ├── tests/           # Pruebas adaptadas o nuevas
│   │       ├── README.md        # Documentación de origen, versión, diferencias y pruebas
│   │       └── CHANGELOG.md     # Historial de cambios respecto al original
│   ├── integrations/            # Integraciones externas (Strapi, Supabase, Medusa, etc.)
│   │   └── [NombreIntegracion]/
│   │       ├── src/             # Código principal de integración
│   │       ├── adapters/        # Adaptadores para compatibilidad con el monorepo
│   │       ├── patches/         # Parches temporales o fixes
│   │       ├── modules/         # Módulos propios desarrollados para la integración
│   │       │   └── [NombreModuloPropio]/
│   │       │       ├── src/
│   │       │       ├── tests/
│   │       │       ├── README.md
│   │       │       └── CHANGELOG.md
│   │       ├── tests/           # Pruebas específicas de la integración/parches
│   │       ├── README.md        # Documentación de integración, parches y módulos propios
│   │       └── CHANGELOG.md     # Historial de cambios
│   ├── shared/                  # Componentes, hooks y utilidades compartidas
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   └── services/
│   └── ...                      # Otros recursos técnicos (factories, plugins, etc.)
├── projects/                    # Índice y fichas de proyectos internos/negocio
│   ├── README.md                # Índice central con enlaces y fichas-resumen
│   └── [NombreProyecto]/        # Carpeta por proyecto interno/negocio
├── docs/                        # Documentación centralizada y transversal
│   ├── README.md                # Propósito, estructura y gobernanza de /docs
│   ├── STRUCTURE_OVERVIEW.md    # Documento central de estructura y convenciones
│   ├── DECISION_LOG.md          # Registro de decisiones estructurales y excepciones
│   ├── templates/               # Plantillas y convenciones de documentación
│   ├── projects/                # Documentación específica por proyecto
│   │   └── [NombreProyecto]/
│   ├── development/             # Guías técnicas, arquitectura, patrones, etc.
│   ├── compliance/              # Documentación de cumplimiento, licencias, etc.
│   ├── security/                # Políticas y guías de seguridad
│   ├── onboarding/              # Guías de onboarding y formación
│   ├── evaluations/             # Evaluaciones y comparativas técnicas
│   ├── legacy/                  # Documentación histórica o deprecated
│   └── ...                      # Otras subcarpetas temáticas
├── repo-archive/                # Código/documentación legacy o deprecated
│   └── [Carpetas/archivos legacy]
├── dev-tools/                   # Herramientas internas de desarrollo
├── dev-dashboard/               # Portal de control para desarrolladores
├── tests/                       # Pruebas globales o E2E
├── scripts/                     # Scripts de automatización y utilidades
├── node_modules/                # Dependencias de Node.js
├── package.json                 # Configuración de dependencias y scripts
├── package-lock.json            # Lockfile de dependencias
├── README.md                    # Presentación general del monorepo
├── CHANGELOG.md                 # Historial de cambios global
├── .gitignore                   # Exclusiones de git
└── ...                          # Otros archivos de configuración y recursos raíz
```

---

## 📦 Estructura de Carpetas

```plaintext
/
├── src/
│   ├── apps/                # Aplicaciones principales (front, admin, etc.)
│   ├── modules/             # Módulos propios de negocio
│   ├── ported/              # Software portado (con original y adaptaciones)
│   ├── integrations/        # Integraciones externas (Strapi, Supabase, etc.)
│   └── shared/              # Componentes, hooks y utilidades compartidas
├── projects/                # Índice y fichas de proyectos internos/negocio
├── docs/                    # Documentación centralizada
│   └── projects/            # Documentación específica por proyecto
├── repo-archive/            # Código/documentación legacy o deprecated
└── ...                      # Otros recursos (tests, dev-tools, etc.)
```

---

## 🏗️ Convención de aplicaciones (apps/)

La carpeta `src/apps/` debe contener una app por contexto principal:
- `home/`: Landing page, splash, login público y acceso general.
- `superadmin-dashboard/`: Dashboard exclusivo para superadministradores (gestión global, monitoreo, administración de empresas y usuarios).
- `company-dashboard/`: Dashboard para empresas SaaS (clientes), con acceso y datos aislados por tenant.
- `login/`: (Opcional) App de login/autenticación si se separa del home.

Cada app debe tener su propio README, estructura aislada y consumir componentes de `shared/`.

---

## 🔄 Convenciones para Ports (`