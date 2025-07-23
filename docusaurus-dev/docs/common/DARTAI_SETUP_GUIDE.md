# 🚀 Guía de Setup DartAI - VThink 1.0

## 🎯 **Setup Inmediato (Esta Semana)**

### **1. Configurar Cuenta DartAI**
```bash
# 1. Crear cuenta en dartai.com
# 2. Obtener API key
# 3. Configurar workspace para VibeThink Orchestrator
```

### **2. Instalar MCP Server**
```bash
# Instalar MCP server globalmente
npm install -g dart-mcp-server

# Configurar token
export DART_TOKEN="dsa_..."
```

### **3. Integración con Cursor**
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

### **4. Scripts de Automatización**
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

## 📋 **Tareas Inmediatas**

### **Semana 1: Setup Básico**
- [ ] Configurar cuenta DartAI
- [ ] Instalar MCP server
- [ ] Integrar con Cursor
- [ ] Crear proyecto en DartAI

### **Semana 2: Integración**
- [ ] Configurar GitHub Actions
- [ ] Crear scripts de automatización
- [ ] Migrar tareas existentes
- [ ] Configurar reporting

---

**Responsable:** Lead Developer  
**Timeline:** 2 semanas  
**Estado:** Pendiente de inicio 