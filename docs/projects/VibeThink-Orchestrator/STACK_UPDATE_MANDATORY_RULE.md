# Regla Obligatoria: Actualización del Documento Maestro de Stack

**Versión:** 1.0.0  
**Fecha:** 23 de Enero, 2025  
**Autor:** AI Pair Platform (asistente de Marcelo Escallón)  
**Estado:** OBLIGATORIA  
**Aplicación:** Inmediata  

---

## 🚨 **REGLAS MANDATORIAS**

### **REGLA #1: ACTUALIZACIÓN INMEDIATA**
```
❌ PROHIBIDO: Tomar decisiones de stack sin actualizar el documento maestro
✅ OBLIGATORIO: Actualizar docs/MASTER_STACK_DOCUMENT.md en las siguientes 24 horas
```

### **REGLA #2: VERSIÓN OBLIGATORIA**
```
❌ PROHIBIDO: Cambios sin incrementar versión
✅ OBLIGATORIO: Incrementar versión y documentar cambios
```

### **REGLA #3: VALIDACIÓN AUTOMÁTICA**
```
❌ PROHIBIDO: Commits sin validación del documento maestro
✅ OBLIGATORIO: Script de pre-commit valida actualización
```

### **REGLA #4: REVISIÓN SEMANAL**
```
❌ PROHIBIDO: Documento desactualizado por más de 7 días
✅ OBLIGATORIO: Revisión cada viernes
```

---

## 📋 **Proceso de Actualización Obligatorio**

### **PASO 1: Detección de Cambio**
```typescript
interface ChangeDetection {
  // ✅ REQUIRED: Detectar cambios en stack
  triggers: [
    'Nueva evaluación de componente',
    'Decisión de ADR',
    'Cambio en implementación',
    'Actualización de versión',
    'Nueva integración'
  ];
  
  // ✅ REQUIRED: Notificación automática
  notification: {
    channel: 'Slack/Email';
    recipients: 'Architecture Team';
    deadline: '24 hours';
    escalation: 'After 48 hours';
  };
}
```

### **PASO 2: Actualización del Documento**
```typescript
interface DocumentUpdate {
  // ✅ REQUIRED: Actualizar MASTER_STACK_DOCUMENT.md
  file: 'docs/MASTER_STACK_DOCUMENT.md';
  
  // ✅ REQUIRED: Incrementar versión
  version: {
    major: 'breaking changes';
    minor: 'new features';
    patch: 'bug fixes';
  };
  
  // ✅ REQUIRED: Documentar cambios
  changelog: {
    date: 'timestamp';
    author: 'name';
    description: 'detailed';
    impact: 'assessed';
    components: 'affected';
  };
}
```

### **PASO 3: Validación de Coherencia**
```typescript
interface CoherenceValidation {
  // ✅ REQUIRED: Verificar compatibilidad
  compatibility: {
    backwardCompatibility: boolean;
    performanceImpact: 'low' | 'medium' | 'high';
    securityImplications: string[];
    scalabilityEffects: string[];
  };
  
  // ✅ REQUIRED: Actualizar diagramas
  diagrams: [
    'Arquitectura general',
    'Interacción de componentes',
    'Flujo de datos',
    'Seguridad y permisos'
  ];
  
  // ✅ REQUIRED: Revisar métricas
  metrics: {
    coherence: 'percentage';
    scalability: 'percentage';
    security: 'percentage';
    performance: 'percentage';
  };
}
```

### **PASO 4: Comunicación y Aprobación**
```typescript
interface CommunicationApproval {
  // ✅ REQUIRED: Notificar al equipo
  teamNotification: {
    channel: 'Architecture Team';
    message: 'Stack updated - review required';
    deadline: '48 hours';
  };
  
  // ✅ REQUIRED: Aprobación de cambios críticos
  criticalChanges: {
    threshold: 'affects > 2 components';
    approval: 'Architecture Team + CTO';
    documentation: 'ADR required';
  };
  
  // ✅ REQUIRED: Actualizar FAQs
  faqUpdate: {
    newQuestions: string[];
    updatedAnswers: string[];
    deprecatedInfo: string[];
  };
}
```

---

## 🔍 **Checklist de Validación**

### **Antes de Commit:**
- [ ] **Documento maestro actualizado**
- [ ] **Versión incrementada**
- [ ] **Changelog documentado**
- [ ] **Diagramas actualizados**
- [ ] **Métricas recalculadas**
- [ ] **Compatibilidad verificada**

### **Después de Commit:**
- [ ] **Notificación enviada al equipo**
- [ ] **FAQs actualizadas**
- [ ] **ADR creado (si es crítico)**
- [ ] **Documentación de usuario actualizada**
- [ ] **Scripts de validación ejecutados**

---

## 🚨 **Alertas y Escalación**

### **Alertas Automáticas:**
```typescript
interface Alerts {
  // ✅ REQUIRED: Alertas cuando no se cumple
  alerts: {
    documentOutdated: {
      trigger: '> 24 hours without update';
      action: 'Slack notification + email';
      escalation: 'After 48 hours';
    };
    
    versionNotIncremented: {
      trigger: 'Changes without version bump';
      action: 'Block commit';
      escalation: 'Manual review required';
    };
    
    coherenceCheckFailed: {
      trigger: 'Incompatible components';
      action: 'Block merge';
      escalation: 'Architecture review required';
    };
  };
}
```

### **Escalación:**
```typescript
interface Escalation {
  // ✅ REQUIRED: Proceso de escalación
  levels: {
    level1: {
      trigger: '24 hours without update';
      action: 'Slack reminder';
      responsible: 'Architecture Team';
    };
    
    level2: {
      trigger: '48 hours without update';
      action: 'Email to CTO';
      responsible: 'CTO';
    };
    
    level3: {
      trigger: '72 hours without update';
      action: 'Emergency meeting';
      responsible: 'All stakeholders';
    };
  };
}
```

---

## 📊 **Métricas de Cumplimiento**

### **KPIs Obligatorios:**
```typescript
interface ComplianceKPIs {
  // ✅ REQUIRED: Métricas de cumplimiento
  metrics: {
    updateTime: {
      target: '< 24 hours';
      current: 'tracked';
      trend: 'monitored';
    };
    
    documentAccuracy: {
      target: '100%';
      current: 'measured';
      trend: 'improving';
    };
    
    teamAwareness: {
      target: '100%';
      current: 'surveyed';
      trend: 'maintained';
    };
    
    validationSuccess: {
      target: '100%';
      current: 'automated';
      trend: 'stable';
    };
  };
}
```

---

## 🛠️ **Herramientas de Automatización**

### **Script de Pre-commit:**
```bash
#!/bin/bash
# pre-commit-stack-validation.sh

# Verificar que el documento maestro esté actualizado
if ! grep -q "Última actualización: $(date +%Y-%m-%d)" docs/MASTER_STACK_DOCUMENT.md; then
    echo "❌ ERROR: MASTER_STACK_DOCUMENT.md no está actualizado"
    echo "✅ REQUIRED: Actualizar documento antes del commit"
    exit 1
fi

# Verificar que la versión esté incrementada
if ! git diff --cached --name-only | grep -q "MASTER_STACK_DOCUMENT.md"; then
    echo "❌ ERROR: Versión no incrementada"
    echo "✅ REQUIRED: Incrementar versión en cambios de stack"
    exit 1
fi

echo "✅ Stack document validation passed"
```

### **Git Hook:**
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Ejecutar validación de stack
./scripts/pre-commit-stack-validation.sh

# Si falla, bloquear commit
if [ $? -ne 0 ]; then
    echo "❌ Stack validation failed - commit blocked"
    exit 1
fi
```

---

## 📅 **Cronograma de Revisión**

### **Revisión Diaria:**
- ✅ Verificar que no hay cambios pendientes
- ✅ Ejecutar validaciones automáticas
- ✅ Notificar si hay inconsistencias

### **Revisión Semanal (Viernes):**
- ✅ Revisión completa del documento
- ✅ Validación de coherencia
- ✅ Actualización de métricas
- ✅ Comunicación al equipo

### **Revisión Mensual:**
- ✅ Análisis de tendencias
- ✅ Optimización del proceso
- ✅ Actualización de reglas
- ✅ Training del equipo

---

## 🎯 **Consecuencias de Incumplimiento**

### **Nivel 1: Advertencia**
- Recordatorio por Slack/Email
- Documentación del incidente
- Plan de corrección

### **Nivel 2: Bloqueo**
- Commit bloqueado hasta corrección
- Revisión manual requerida
- Escalación al CTO

### **Nivel 3: Sanción**
- Revisión de proceso
- Training obligatorio
- Medidas correctivas

---

## 📞 **Contactos de Responsabilidad**

### **Responsable Principal:**
- **Rol:** Architecture Team Lead
- **Responsabilidad:** Cumplimiento general
- **Contacto:** Slack #architecture-team

### **Responsable de Validación:**
- **Rol:** DevOps Engineer
- **Responsabilidad:** Scripts y automatización
- **Contacto:** Slack #devops

### **Responsable de Escalación:**
- **Rol:** CTO
- **Responsabilidad:** Decisiones críticas
- **Contacto:** Slack #cto

---

## 🚀 **Implementación Inmediata**

### **PASO 1: Configurar Automatización**
```bash
# Instalar git hooks
cp scripts/pre-commit-stack-validation.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Configurar alertas
# Configurar Slack webhooks
# Configurar email notifications
```

### **PASO 2: Training del Equipo**
```bash
# Documentar proceso
# Crear guías de usuario
# Realizar training session
# Establecer contactos de soporte
```

### **PASO 3: Monitoreo Continuo**
```bash
# Configurar métricas
# Establecer dashboards
# Programar revisiones
# Documentar lecciones aprendidas
```

---

**Responsable:** Equipo de Arquitectura  
**Fecha de implementación:** 23 de Enero, 2025  
**Estado:** OBLIGATORIA - Implementación inmediata  
**Próxima revisión:** 30 de Enero, 2025 