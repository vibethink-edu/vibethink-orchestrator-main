---
title: "Decisión: Gestión de Proyectos con DartAI"
sidebar_position: 2
tags: [decision, project-management, dartai, mcp, automation]
audience: "dev, qa, product, ai, onboarding"
---

# 🎯 Decisión: Gestión de Proyectos con DartAI

## Resumen Ejecutivo

**Decisión:** Usar **DartAI** como plataforma principal de gestión de proyectos para VibeThink Orchestrator v1.0.

**Razones:**
- Integración AI nativa con Claude, Cursor, Cline
- MCP Server para automatización inteligente
- API-first que se integra con el monorepo
- Reporting inteligente para métricas de proyecto

---

## Comparativa Final

| Criterio | DartAI | Huly.io | Plane.so |
|----------|:------:|:-------:|:--------:|
| AI Integration | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| MCP Support | ✅ | ❌ | ❌ |
| Open Source | ❌ | ✅ | ✅ |
| Self-host | ❌ | ✅ | ✅ |
| GitHub Integration | ✅ | ✅ | ✅ |
| Visual | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Reporting | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## Setup y Configuración

### 1. Configurar DartAI MCP Server

```bash
# Instalar MCP server
npm install -g dart-mcp-server

# Configurar token
export DART_TOKEN="dsa_..."
```

### 2. Integración con Cursor

```json
// Cursor MCP Config
{
  "mcpServers": {
    "dart": {
      "command": "npx",
      "args": ["-y", "dart-mcp-server@latest"],
      "env": {
        "DART_TOKEN": "dsa_..."
      }
    }
  }
}
```

### 3. Integración con Claude Desktop

```json
// Claude Desktop MCP Config
{
  "mcpServers": {
    "dart": {
      "command": "npx",
      "args": ["-y", "dart-mcp-server@latest"],
      "env": {
        "DART_TOKEN": "dsa_..."
      }
    }
  }
}
```

---

## Flujos de Trabajo Recomendados

### 1. Creación de Tareas con AI
```typescript
// El AI assistant puede crear tareas directamente
const taskCreation = {
  title: "Implementar observabilidad con DataDog",
  description: "Configurar APM, dashboards y alertas",
  status: "TODO",
  priority: "HIGH",
  assignee: "lead-dev",
  dueDate: "2025-01-15"
};
```

### 2. Gestión de Documentación
```typescript
// Crear documentos automáticamente
const docCreation = {
  title: "Setup DataDog - VThink 1.0",
  content: "Guía de implementación...",
  folder: "docs/observability"
};
```

### 3. Reporting Automático
```typescript
// Resúmenes automáticos de tareas
const reporting = {
  summarizeTasks: {
    status: "IN_PROGRESS",
    assignee: "all",
    dateRange: "last_week"
  }
};
```

---

## Integración con el Monorepo

### 1. GitHub Actions Integration
```yaml
# .github/workflows/dart-sync.yml
name: Sync with DartAI
on:
  push:
    branches: [main, develop]
jobs:
  sync-tasks:
    runs-on: ubuntu-latest
    steps:
      - name: Sync project status
        run: |
          # Sync task status with DartAI
          npm run dart:sync
```

### 2. Scripts de Automatización
```typescript
// scripts/dart-integration.ts
export const dartIntegration = {
  createTaskFromIssue: (issue: GitHubIssue) => {
    // Convertir GitHub issues a DartAI tasks
  },
  updateTaskStatus: (taskId: string, status: string) => {
    // Actualizar estado de tareas
  },
  generateReport: () => {
    // Generar reportes automáticos
  }
};
```

---

## Mejores Prácticas

### 1. Nomenclatura de Tareas
- **Formato:** `[AREA] - [DESCRIPTION]`
- **Ejemplos:**
  - `[Observabilidad] - Configurar DataDog APM`
  - `[Security] - Implementar penetration testing`
  - `[Performance] - Optimizar bundle size`

### 2. Estados y Prioridades
- **Estados:** TODO, IN_PROGRESS, REVIEW, DONE
- **Prioridades:** LOW, MEDIUM, HIGH, CRITICAL
- **Tamaños:** XS, S, M, L, XL

### 3. Documentación
- **Carpetas:** docs/, architecture/, setup/
- **Formato:** Markdown con frontmatter
- **Integración:** Auto-sync con Docusaurus

---

## Métricas y KPIs

### 1. Métricas de Proyecto
- **Velocidad:** Tareas completadas por sprint
- **Calidad:** Bugs por tarea
- **Predictibilidad:** Estimación vs tiempo real

### 2. Métricas de AI Integration
- **Automatización:** % de tareas creadas por AI
- **Eficiencia:** Tiempo ahorrado por AI
- **Precisión:** % de tareas correctas generadas por AI

---

## Próximos Pasos

### Semana 1: Setup
- [ ] Configurar DartAI account
- [ ] Instalar MCP server
- [ ] Integrar con Cursor/Claude
- [ ] Crear proyectos iniciales

### Semana 2: Integración
- [ ] Configurar GitHub Actions
- [ ] Crear scripts de automatización
- [ ] Migrar tareas existentes
- [ ] Documentar flujos

### Semana 3: Optimización
- [ ] Configurar reporting automático
- [ ] Optimizar prompts de AI
- [ ] Crear templates de tareas
- [ ] Validar integración completa

---

## Referencias

- [DartAI MCP Server](https://github.com/its-dart/dart-mcp-server)
- [DartAI sitio oficial](https://dartai.com)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Cursor MCP Setup](https://cursor.sh/docs/mcp)

---

**Responsable:** Lead Developer  
**Fecha de decisión:** 05-07-2025  
**Revisión:** Mensual 