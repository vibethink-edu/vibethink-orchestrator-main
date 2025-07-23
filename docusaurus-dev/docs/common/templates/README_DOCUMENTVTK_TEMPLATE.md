# VibeThink Orchestrator Pro

## 🚀 Plataforma SaaS Empresarial con Documentación Automatizada VTK

Plataforma SaaS empresarial construida con React + TypeScript + Supabase, arquitectura modular, integración de IA y cumplimiento normativo CMMI/VTK.

## 📋 Documentación Automatizada con DocumentVTK

### 🎯 Nuevo Estándar: "Documentar Todo" (VTK)

**Para documentar todo el proyecto, ejecuta:**

```bash
node scripts/DocumentVTK.js
```

**¿Qué hace DocumentVTK?**
- ✅ Documenta automáticamente código y componentes
- ✅ Genera evidencias VTK/CMMI para cumplimiento normativo
- ✅ Crea FAQs y documentación técnica
- ✅ Documenta la metodología VTK
- ✅ Analiza procesos y retrospectivas
- ✅ Evalúa impacto de cambios
- ✅ Genera reportes y métricas

### 🔄 Automatización con Git Hooks

**Configurar automatización (recomendado):**

```bash
# Linux/Mac
chmod +x scripts/setup-documentvtk-hooks.sh
./scripts/setup-documentvtk-hooks.sh

# Windows (PowerShell)
.\scripts\setup-documentvtk-hooks.ps1
```

**DocumentVTK se ejecutará automáticamente en:**
- pre-commit
- post-merge
- post-checkout
- post-commit

### 📊 Reportes y Métricas

**Verificar estado de documentación:**
```bash
cat docs/vtk-report.json | jq '.metrics'
cat docs/vtk-report.json | jq '.metrics.complianceScore'
cat docs/vtk-report.json | jq '.recommendations'
```

**Archivos generados:**
```
docs/
├── vtk-report.json          # Reporte principal
├── vtk-report.md           # Reporte en Markdown
├── methodology/            # Metodología VTK
├── processes/              # Procesos operativos
├── impact-analysis/        # Análisis de impacto
└── retrospective/          # Retrospectivas
```

## 🏗️ Arquitectura

### Stack Tecnológico
- Frontend: React 18 + TypeScript + Vite
- UI Components: shadcn/ui + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Edge Functions)
- State Management: Zustand + React Query
- Testing: Vitest + Playwright
- Documentación: DocumentVTK (Automática)

### Características Principales
- Multi-tenant con aislamiento de empresas
- 5 niveles de roles (EMPLOYEE → MANAGER → ADMIN → OWNER → SUPER_ADMIN)
- Integración IA (OpenAI, Firecrawl, Knotie)
- Planes dinámicos y límites personalizables
- Cumplimiento VTK/CMMI
- Analytics avanzados
- Internacionalización

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- Git
- Supabase CLI (opcional)

### Instalación

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd vibethink-orchestrator-pro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Configurar DocumentVTK (recomendado)
./scripts/setup-documentvtk-hooks.sh

# 5. Ejecutar DocumentVTK inicial
node scripts/DocumentVTK.js

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
- [Guía de Onboarding](docs/onboarding/DOCUMENTVTK_ONBOARDING_GUIDE.md)
- [Guía de Comandos](docs/development/COMMAND_BEHAVIOR_GUIDE.md)
- [Análisis DocumentVTK](docs/development/DOCUMENTVTK_ANALYSIS.md)
- [Arquitectura](docs/architecture/)
- [Testing](docs/testing/)

### Documentación Automática
- Metodología: `docs/methodology/`
- Procesos: `docs/processes/`
- Análisis de Impacto: `docs/impact-analysis/`
- Retrospectivas: `docs/retrospective/`
- Reporte Principal: `docs/vtk-report.json`

## 🛠️ Scripts Disponibles

### DocumentVTK (Recomendado)
```bash
node scripts/DocumentVTK.js
./scripts/setup-documentvtk-hooks.sh
```

### Scripts NPM
```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:e2e
npm run test:coverage
npm run lint
npm run format
npm run type-check
```

## 🔄 Flujo de Trabajo

### Desarrollo Diario
```bash
git checkout -b feature/nueva-funcionalidad
# ... código ...
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### CI/CD
- DocumentVTK se ejecuta automáticamente en cada PR 