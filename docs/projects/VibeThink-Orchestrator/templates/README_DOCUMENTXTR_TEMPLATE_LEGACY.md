# ⚠️ AVISO LEGACY: Este documento corresponde a la era DocumentXTR (pre-XTP/VTK)
# Para la versión actualizada y compatible con VibeThink/VTK, consulta `README_DOCUMENTVTK_TEMPLATE.md`.

# AI Pair Orchestrator Pro

## 🚀 Sistema SaaS Empresarial con Documentación Automatizada

Plataforma SaaS empresarial construida con React + TypeScript + Supabase, con arquitectura modular, integración de IA y cumplimiento normativo CMMI Level 3.

## 📋 Documentación Automatizada con DocumentXTR

### 🎯 Nuevo Estándar: "Documentar Todo"

**Para documentar todo el proyecto, simplemente ejecuta:**

```bash
node scripts/DocumentXTR.js
```

**¿Qué hace DocumentXTR?**
- ✅ **Documenta automáticamente** todo el código y componentes
- ✅ **Genera evidencias CMMI** para cumplimiento normativo
- ✅ **Crea FAQs** basadas en el código actual
- ✅ **Documenta metodología** de desarrollo
- ✅ **Analiza procesos** operativos
- ✅ **Evalúa impacto** de cambios
- ✅ **Genera retrospectivas** automáticas
- ✅ **Crea reportes** completos

### 🔄 Automatización con Git Hooks

**Configurar automatización (recomendado):**

```bash
# Linux/Mac
chmod +x scripts/setup-documentxtr-hooks.sh
./scripts/setup-documentxtr-hooks.sh

# Windows (PowerShell)
.\scripts\setup-documentxtr-hooks.ps1
```

**DocumentXTR se ejecutará automáticamente en:**
- **pre-commit:** Validación antes de cada commit
- **post-merge:** Análisis después de cada merge
- **post-checkout:** Actualización de documentación
- **post-commit:** Reporte final

### 📊 Reportes y Métricas

**Verificar estado de documentación:**
```bash
# Ver reporte más reciente
cat docs/xtr-report.json | jq '.metrics'

# Ver compliance score
cat docs/xtr-report.json | jq '.metrics.complianceScore'

# Ver recomendaciones
cat docs/xtr-report.json | jq '.recommendations'
```

**Archivos generados:**
```
docs/
├── xtr-report.json          # Reporte principal
├── xtr-report.md           # Reporte en Markdown
├── methodology/            # Metodología de desarrollo
├── processes/              # Procesos operativos
├── impact-analysis/        # Análisis de impacto
└── retrospective/          # Retrospectivas
```

## 🏗️ Arquitectura

### Stack Tecnológico
- **Frontend:** React 18 + TypeScript + Vite
- **UI Components:** shadcn/ui + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **State Management:** Zustand + React Query
- **Testing:** Vitest + Playwright
- **Documentación:** DocumentXTR (Automática)

### Características Principales
- 🏢 **Multi-tenant** con aislamiento de empresas
- 👥 **5 niveles de roles** (EMPLOYEE → MANAGER → ADMIN → OWNER → SUPER_ADMIN)
- 🤖 **Integración IA** (OpenAI, Firecrawl)
- 📊 **Planes dinámicos** con límites personalizables
- 🔒 **Cumplimiento CMMI Level 3**
- 📈 **Analytics avanzados**
- 🌐 **Internacionalización** completa

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- Git
- Supabase CLI (opcional)

### Instalación

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd ai-pair-orchestrator-pro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Configurar DocumentXTR (recomendado)
./scripts/setup-documentxtr-hooks.sh

# 5. Ejecutar DocumentXTR inicial
node scripts/DocumentXTR.js

# 6. Iniciar desarrollo
npm run dev
```

### Configuración de Entorno

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key
```

## 📚 Documentación

### Guías Principales
- [📖 Guía de Onboarding](docs/onboarding/DOCUMENTXTR_ONBOARDING_GUIDE.md) - Para nuevos desarrolladores
- [🔧 Guía de Comandos](docs/development/COMMAND_BEHAVIOR_GUIDE.md) - Diferencias entre sistemas
- [📊 Análisis DocumentXTR](docs/development/DOCUMENTXTR_ANALYSIS.md) - Implicaciones y beneficios
- [🏗️ Arquitectura](docs/architecture/) - Decisiones de arquitectura
- [🧪 Testing](docs/testing/) - Estrategias de testing

### Documentación Automática
- **Metodología:** `docs/methodology/`
- **Procesos:** `docs/processes/`
- **Análisis de Impacto:** `docs/impact-analysis/`
- **Retrospectivas:** `docs/retrospective/`
- **Reporte Principal:** `docs/xtr-report.json`

## 🛠️ Scripts Disponibles

### DocumentXTR (Recomendado)
```bash
# Documentación completa automática
node scripts/DocumentXTR.js

# Configurar git hooks
./scripts/setup-documentxtr-hooks.sh
```

### Scripts NPM (Legacy)
```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview de build

# Testing
npm run test             # Tests unitarios
npm run test:e2e         # Tests end-to-end
npm run test:coverage    # Cobertura de tests

# Linting y Formato
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript check

# Documentación (Legacy)
npm run document-all     # Documentación básica
npm run generate-faqs    # Generar FAQs
npm run create-evidence  # Crear evidencias CMMI
```

## 🔄 Flujo de Trabajo

### Desarrollo Diario
```bash
# 1. Crear rama
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar
# ... código ...

# 3. Commit (DocumentXTR se ejecuta automáticamente)
git add .
git commit -m "feat: nueva funcionalidad"

# 4. Push y PR
git push origin feature/nueva-funcionalidad
```

### CI/CD
- **DocumentXTR** se ejecuta automáticamente en cada PR
- **Validación** de compliance score (>90%)
- **Reportes** automáticos en GitHub Issues
- **Artefactos** disponibles para descarga

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests end-to-end
npm run test:e2e

# Cobertura
npm run test:coverage

# Tests de performance
npm run test:performance
```

### Estrategia de Testing
- **Unit Tests:** Componentes y utilidades
- **Integration Tests:** APIs y servicios
- **E2E Tests:** Flujos completos de usuario
- **Performance Tests:** Carga y rendimiento
- **Security Tests:** Vulnerabilidades

## 🔒 Seguridad y Cumplimiento

### CMMI Level 3
- ✅ **Evidencias automáticas** generadas por DocumentXTR
- ✅ **Procesos documentados** automáticamente
- ✅ **Métricas de cumplimiento** en tiempo real
- ✅ **Auditoría continua** de calidad

### Seguridad
- 🔐 **Autenticación** multi-factor
- 🛡️ **Autorización** basada en roles
- 🔒 **Encriptación** en tránsito y reposo
- 📊 **Auditoría** completa de acciones

## 📈 Monitoreo y Analytics

### Métricas Automáticas
- **Performance:** Tiempo de respuesta, throughput
- **Errores:** Rate de errores, tipos de errores
- **Usuarios:** Activos, engagement, retención
- **Negocio:** Conversiones, revenue, churn

### Dashboards
- **Técnico:** Performance, errores, infraestructura
- **Negocio:** Usuarios, revenue, engagement
- **Cumplimiento:** CMMI, seguridad, auditoría

## 🤝 Contribución

### Proceso de Contribución
1. **Fork** el repositorio
2. **Crear** rama feature (`git checkout -b feature/amazing-feature`)
3. **Desarrollar** con DocumentXTR activo
4. **Commit** cambios (DocumentXTR se ejecuta automáticamente)
5. **Push** a la rama (`git push origin feature/amazing-feature`)
6. **Crear** Pull Request

### Estándares de Código
- **TypeScript** estricto (no `any`)
- **ESLint** + **Prettier** para formato
- **Conventional Commits** para mensajes
- **DocumentXTR** para documentación automática

## 📞 Soporte

### Recursos
- 📖 [Documentación Completa](docs/)
- 🐛 [Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)
- 📧 [Email de Soporte](mailto:support@yourcompany.com)

### Comunidad
- 👥 **Slack:** #ai-pair-orchestrator
- 📺 **YouTube:** Tutoriales y demos
- 📰 **Blog:** Actualizaciones y casos de uso

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Supabase** por la infraestructura backend
- **shadcn/ui** por los componentes de UI
- **OpenAI** por las capacidades de IA
- **Comunidad** por el feedback y contribuciones

---

## 🎯 Resumen: DocumentXTR

**Para documentar todo el proyecto:**
```bash
node scripts/DocumentXTR.js
```

**DocumentXTR automatiza:**
- 📋 Documentación técnica completa
- 🏗️ Metodología de desarrollo
- ⚙️ Procesos operativos
- 📊 Análisis de impacto
- 🔄 Retrospectivas automáticas
- 📈 Reportes y métricas

**No más documentación manual. Todo es automático, consistente y auditable.**

---

*¿Necesitas ayuda? Consulta la [Guía de Onboarding](docs/onboarding/DOCUMENTXTR_ONBOARDING_GUIDE.md) o contacta al equipo.* 