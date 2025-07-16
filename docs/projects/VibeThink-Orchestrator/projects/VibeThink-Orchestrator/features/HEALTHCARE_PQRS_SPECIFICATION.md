# 🏥 Especificación Técnica - Módulo PQRS Sector Salud

**Documento de Confidencialidad:** Este documento contiene información estratégica confidencial de Euphorianet. Solo para uso interno autorizado.

**Fecha de Creación:** 23 de junio de 2025  
**Responsable:** Marcelo Escallón, CEO de Euphorianet  
**Sesión:** Análisis profundo de PQRS en sector salud
**Última Actualización:** 23 de junio de 2025 - Clarificación global vs local

---

## 📋 Resumen Ejecutivo

Este documento define las especificaciones técnicas para el módulo PQRS especializado en el sector salud, un caso de uso crítico donde la arquitectura modular de extensión del Helpdesk demuestra todo su potencial. 

**Distinción Clave:** El sistema implementa un **núcleo universal** con **configuración local parametrizable**, permitiendo un solo producto para múltiples jurisdicciones y mercados.

---

## 🌍 **Arquitectura Universal vs Configuración Local**

### **✅ Funcionalidad GLOBAL (Núcleo Universal)**
Estos elementos son estándares de la industria y se aplican en cualquier sistema de salud moderno:

- **Clasificación avanzada** por tipo y criticidad
- **Enrutamiento inteligente** basado en roles y departamentos
- **Gestión de SLAs** con múltiples cronómetros
- **Auditoría y trazabilidad** para defensa legal
- **Análisis de causa raíz** para mejora continua
- **Integración con sistemas EHR** existentes
- **Control de acceso granular** por roles
- **Workflows especializados** por tipo de caso

### **🔄 Configuración LOCAL (Parametrizable)**
Estos elementos varían por país y se configuran sin desarrollo:

| Parámetro | Colombia | Estados Unidos | Unión Europea |
|-----------|----------|----------------|---------------|
| **Ente Regulador** | Superintendencia Nacional de Salud | HHS, CMS, Juntas Médicas Estatales | NHS England, CQC |
| **Legislación** | Ley 1755 de 2015 | HIPAA, HITECH | GDPR, NHS Constitution |
| **Terminología** | PQRS, EPS, IPS | Patient Grievance, Insurance Provider | Formal Complaint, NHS Trust |
| **Plazos Legales** | 15 días hábiles | 30 días | 1 mes |
| **Tipos de Caso** | Petición, Queja, Reclamo, Sugerencia | Grievance, Complaint, HIPAA Request | Complaint, GDPR Request |

---

## 🎯 **Casos de Uso Críticos en Salud**

### **Escenario 1: Cancelación de Cirugía (Alta Criticidad)**
- **Paciente:** Carlos
- **Problema:** Cirugía cancelada sin previo aviso
- **Criticidad:** Alta (impacta tratamiento médico)
- **Stakeholders:** Jefe de Cirugía, Comité de Calidad, EPS
- **SLA:** 15 días hábiles (legal) + 48 horas (operacional)

### **Escenario 2: Negación de Medicamento (Urgencia Vital)**
- **Paciente:** María
- **Problema:** EPS niega medicamento crítico
- **Criticidad:** Crítica (riesgo de vida)
- **Stakeholders:** Director Médico, Comité de Ética, Superintendencia
- **SLA:** 24 horas (operacional) + 15 días (legal)

### **Escenario 3: Error de Facturación (Baja Criticidad)**
- **Paciente:** Juan
- **Problema:** Cargo incorrecto en factura
- **Criticidad:** Baja (administrativo)
- **Stakeholders:** Administrativo, Facturación
- **SLA:** 15 días hábiles (legal)

---

## 🏗️ **Arquitectura Especializada para Salud**

### **1. Extensión del Core de Tickets**
```typescript
interface HealthcareTicket extends TicketCore {
  // Campos específicos de salud
  healthcare: {
    patientId: string;                    // ID del paciente en EHR
    patientName: string;                  // Nombre del paciente
    patientDocumentType: 'CC' | 'CE' | 'TI' | 'RC';
    patientDocumentNumber: string;
    patientDateOfBirth: string;
    patientPhone: string;
    patientEmail?: string;
    
    // Información médica
    medicalService?: {
      serviceType: 'consultation' | 'surgery' | 'examination' | 'medication' | 'emergency';
      serviceDate: string;
      physicianId?: string;
      physicianName?: string;
      department: string;
      procedureCode?: string;
      diagnosisCode?: string;
    };
    
    // Clasificación de criticidad
    criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
    clinicalArea: 'administrative' | 'clinical' | 'quality' | 'information';
    
    // Integración con EPS
    insuranceProvider?: {
      epsId: string;
      epsName: string;
      policyNumber: string;
      authorizationNumber?: string;
      denialReason?: string;
    };
    
    // Cumplimiento legal
    regulatoryCompliance: {
      superintendenciaHealth: boolean;    // Superintendencia de Salud
      hipaaCompliance: boolean;           // Protección de datos médicos
      gdprCompliance?: boolean;           // Para operaciones en UE
      auditTrail: HealthcareAuditEntry[];
    };
  };
}
```

### **2. Sistema de Clasificación por Criticidad**
```typescript
interface CriticalityClassification {
  levels: {
    low: {
      description: 'Quejas administrativas menores';
      examples: ['comida del hospital', 'limpieza', 'facturación'];
      slaOperational: 72; // horas
      slaLegal: 15; // días hábiles
      escalationLevel: 'department_head';
      notificationLevel: 'standard';
    };
    medium: {
      description: 'Problemas de calidad del servicio';
      examples: ['demora en citas', 'tiempo de espera', 'trato del personal'];
      slaOperational: 48; // horas
      slaLegal: 15; // días hábiles
      escalationLevel: 'quality_committee';
      notificationLevel: 'supervisor';
    };
    high: {
      description: 'Problemas que afectan el tratamiento';
      examples: ['cancelación de procedimientos', 'errores de medicación', 'demoras críticas'];
      slaOperational: 24; // horas
      slaLegal: 15; // días hábiles
      escalationLevel: 'medical_director';
      notificationLevel: 'urgent';
    };
    critical: {
      description: 'Riesgo de vida o muerte';
      examples: ['negación de medicamento crítico', 'error de diagnóstico', 'mala praxis'];
      slaOperational: 2; // horas
      slaLegal: 15; // días hábiles
      escalationLevel: 'executive_management';
      notificationLevel: 'immediate';
    };
  };
}
```

### **3. Integración con Historia Clínica Electrónica (EHR)**
```typescript
interface EHRIntegration {
  // Conectores a sistemas EHR
  connectors: {
    epic: {
      apiEndpoint: string;
      authentication: 'oauth2' | 'api_key';
      dataMapping: EHRDataMapping;
    };
    cerner: {
      apiEndpoint: string;
      authentication: 'oauth2' | 'api_key';
      dataMapping: EHRDataMapping;
    };
    custom: {
      apiEndpoint: string;
      authentication: 'custom';
      dataMapping: EHRDataMapping;
    };
  };
  
  // Datos que se pueden consultar
  accessibleData: {
    patientDemographics: boolean;
    medicalHistory: boolean;
    currentMedications: boolean;
    allergies: boolean;
    labResults: boolean;
    imagingResults: boolean;
    treatmentPlans: boolean;
    physicianNotes: boolean;
  };
  
  // Seguridad y auditoría
  security: {
    hipaaCompliant: boolean;
    accessLogging: boolean;
    dataEncryption: 'at_rest' | 'in_transit' | 'both';
    auditTrail: boolean;
  };
}

interface EHRDataMapping {
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  clinicalData: {
    diagnoses: string[];
    medications: string[];
    allergies: string[];
    procedures: string[];
  };
}
```

### **4. Sistema de Workflow Especializado**
```typescript
interface HealthcareWorkflow {
  // Workflows por tipo de caso
  workflows: {
    administrative: {
      steps: [
        'reception',
        'classification',
        'assignment_to_admin',
        'investigation',
        'resolution',
        'closure'
      ];
      sla: 15; // días hábiles
      escalation: 'department_head';
    };
    clinical: {
      steps: [
        'reception',
        'classification',
        'assignment_to_physician',
        'medical_review',
        'quality_committee_review',
        'resolution',
        'closure'
      ];
      sla: 15; // días hábiles
      escalation: 'medical_director';
    };
    critical: {
      steps: [
        'reception',
        'immediate_classification',
        'assignment_to_specialist',
        'emergency_review',
        'executive_notification',
        'immediate_resolution',
        'closure'
      ];
      sla: 2; // horas operacional
      escalation: 'executive_management';
    };
  };
  
  // Reglas de asignación automática
  assignmentRules: {
    byDepartment: {
      surgery: 'chief_surgeon';
      cardiology: 'cardiology_director';
      emergency: 'emergency_director';
      administration: 'admin_manager';
    };
    byCriticality: {
      low: 'department_supervisor';
      medium: 'department_head';
      high: 'medical_director';
      critical: 'executive_management';
    };
  };
}
```

### **5. Motor de SLA Avanzado para Salud**
```typescript
interface HealthcareSLAEngine {
  // Múltiples cronómetros
  timers: {
    legalSLA: {
      type: 'business_days';
      calculation: 'exclude_holidays';
      country: 'colombia';
      regulatoryBody: 'superintendencia_salud';
    };
    operationalSLA: {
      type: 'hours';
      calculation: 'continuous';
      internal: true;
      criticalityBased: true;
    };
    clinicalSLA: {
      type: 'hours';
      calculation: 'business_hours';
      clinicalUrgency: true;
    };
  };
  
  // Pausas inteligentes
  pauseConditions: {
    waitingForThirdParty: {
      condition: 'external_dependency';
      examples: ['eps_authorization', 'lab_results', 'specialist_consultation'];
      pauseLegalSLA: false; // No pausa SLA legal
      pauseOperationalSLA: true; // Pausa SLA operacional
    };
    patientUnavailable: {
      condition: 'patient_not_responding';
      maxPauseDuration: 72; // horas
      notificationRequired: true;
    };
    investigationRequired: {
      condition: 'complex_investigation';
      maxPauseDuration: 168; // 1 semana
      approvalRequired: 'supervisor';
    };
  };
  
  // Alertas y notificaciones
  notifications: {
    levels: {
      warning: {
        threshold: 0.7; // 70% del tiempo transcurrido
        recipients: ['assigned_agent', 'supervisor'];
        channels: ['email', 'in_app'];
      };
      urgent: {
        threshold: 0.9; // 90% del tiempo transcurrido
        recipients: ['assigned_agent', 'supervisor', 'department_head'];
        channels: ['email', 'in_app', 'sms'];
      };
      critical: {
        threshold: 0.95; // 95% del tiempo transcurrido
        recipients: ['assigned_agent', 'supervisor', 'department_head', 'medical_director'];
        channels: ['email', 'in_app', 'sms', 'phone'];
      };
    };
  };
}
```

### **6. Sistema de Auditoría Inmutable**
```typescript
interface HealthcareAuditTrail {
  // Entradas de auditoría
  entries: HealthcareAuditEntry[];
  
  // Tipos de eventos auditados
  eventTypes: {
    caseCreation: 'patient_data_access';
    caseAssignment: 'role_based_assignment';
    dataAccess: 'ehr_integration_access';
    statusChange: 'workflow_progression';
    noteAddition: 'internal_communication';
    documentAttachment: 'evidence_management';
    slaBreach: 'compliance_tracking';
    caseClosure: 'resolution_verification';
  };
  
  // Información capturada por evento
  auditData: {
    timestamp: string;
    userId: string;
    userRole: string;
    userDepartment: string;
    action: string;
    resource: string;
    details: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    sessionId: string;
  };
  
  // Cumplimiento legal
  compliance: {
    hipaaCompliant: boolean;
    digitalSignature: boolean;
    timestamping: boolean;
    immutability: boolean;
    retentionPolicy: '7_years' | '10_years' | 'permanent';
  };
}

interface HealthcareAuditEntry {
  id: string;
  caseId: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  details: Record<string, any>;
  digitalSignature: string;
  hash: string;
}
```

---

## 🔒 **Seguridad y Cumplimiento HIPAA**

### **1. Control de Acceso por Roles**
```typescript
interface HealthcareAccessControl {
  roles: {
    patient: {
      permissions: ['view_own_cases', 'create_case', 'add_notes'];
      restrictions: ['no_clinical_data', 'no_other_patients'];
    };
    administrative: {
      permissions: ['view_assigned_cases', 'update_status', 'add_notes'];
      restrictions: ['no_clinical_details', 'no_medical_history'];
    };
    clinical: {
      permissions: ['view_assigned_cases', 'access_ehr', 'update_medical_notes'];
      restrictions: ['no_financial_data', 'no_other_departments'];
    };
    quality_committee: {
      permissions: ['view_all_cases', 'access_ehr', 'quality_reviews'];
      restrictions: ['no_financial_data'];
    };
    medical_director: {
      permissions: ['view_all_cases', 'access_ehr', 'approve_resolutions'];
      restrictions: ['no_financial_data'];
    };
    executive: {
      permissions: ['view_all_cases', 'access_ehr', 'financial_data'];
      restrictions: ['no_patient_contact'];
    };
  };
  
  // Logging de acceso
  accessLogging: {
    enabled: true;
    logLevel: 'detailed';
    retention: '7_years';
    alerts: ['unauthorized_access', 'privilege_escalation'];
  };
}
```

### **2. Encriptación y Protección de Datos**
```typescript
interface HealthcareDataProtection {
  encryption: {
    atRest: {
      algorithm: 'AES-256';
      keyManagement: 'hardware_security_module';
    };
    inTransit: {
      protocol: 'TLS_1_3';
      certificateValidation: 'strict';
    };
  };
  
  dataClassification: {
    phi: {
      level: 'highest';
      encryption: 'mandatory';
      accessLogging: 'detailed';
      retention: '7_years';
    };
    financial: {
      level: 'high';
      encryption: 'mandatory';
      accessLogging: 'standard';
      retention: '7_years';
    };
    operational: {
      level: 'medium';
      encryption: 'optional';
      accessLogging: 'basic';
      retention: '3_years';
    };
  };
}
```

---

## 📊 **Analítica y Reportes de Causa Raíz**

### **1. Métricas Específicas de Salud**
```typescript
interface HealthcareAnalytics {
  // Métricas de cumplimiento
  complianceMetrics: {
    slaCompliance: {
      legal: number; // porcentaje
      operational: number; // porcentaje
      byCriticality: Record<string, number>;
      byDepartment: Record<string, number>;
    };
    regulatoryCompliance: {
      superintendenciaHealth: number;
      hipaaCompliance: number;
      auditReadiness: number;
    };
  };
  
  // Métricas de calidad
  qualityMetrics: {
    firstContactResolution: number;
    patientSatisfaction: number;
    clinicalOutcomes: number;
    readmissionRate: number;
  };
  
  // Análisis de causa raíz
  rootCauseAnalysis: {
    byIssueType: Record<string, number>;
    byDepartment: Record<string, number>;
    byEPS: Record<string, number>;
    byPhysician: Record<string, number>;
    trends: {
      monthly: Record<string, number>;
      quarterly: Record<string, number>;
      yearly: Record<string, number>;
    };
  };
  
  // Predicciones y alertas
  predictiveAnalytics: {
    riskScoring: {
      patientRisk: number; // 0-100
      caseRisk: number; // 0-100
      departmentRisk: number; // 0-100
    };
    earlyWarning: {
      slaBreachPrediction: number; // probabilidad
      escalationPrediction: number; // probabilidad
      litigationRisk: number; // probabilidad
    };
  };
}
```

### **2. Reportes Regulatorios**
```typescript
interface RegulatoryReports {
  // Reportes para Superintendencia de Salud
  superintendenciaHealth: {
    monthlyReport: {
      totalCases: number;
      resolvedCases: number;
      pendingCases: number;
      slaCompliance: number;
      byType: Record<string, number>;
      byCriticality: Record<string, number>;
    };
    quarterlyReport: {
      trends: Record<string, number>;
      rootCauseAnalysis: Record<string, number>;
      improvementActions: string[];
    };
  };
  
  // Reportes internos
  internalReports: {
    executiveDashboard: {
      keyMetrics: Record<string, number>;
      alerts: string[];
      recommendations: string[];
    };
    departmentReports: {
      byDepartment: Record<string, DepartmentMetrics>;
      comparisons: Record<string, number>;
    };
  };
}
```

---

## 🌍 **Configuración Local Parametrizable**

### **1. Configuración por País**
```typescript
interface LocalConfiguration {
  // Configuración de Colombia
  colombia: {
    regulatoryBody: 'Superintendencia Nacional de Salud';
    legislation: 'Ley 1755 de 2015';
    terminology: {
      caseTypes: ['peticion', 'queja', 'reclamo', 'solicitud'];
      insuranceProvider: 'EPS';
      healthcareProvider: 'IPS';
      medicalRecord: 'Historia Clínica';
    };
    legalDeadlines: {
      peticion: 15; // días hábiles
      queja: 15;
      reclamo: 30;
      solicitud: 10;
    };
    reportTemplates: {
      superintendencia: 'monthly_report_template';
      internal: 'executive_dashboard_template';
    };
  };
  
  // Configuración de Estados Unidos
  usa: {
    regulatoryBody: 'HHS, CMS, State Medical Boards';
    legislation: 'HIPAA, HITECH, State Laws';
    terminology: {
      caseTypes: ['grievance', 'complaint', 'hipaa_request'];
      insuranceProvider: 'Insurance Provider';
      healthcareProvider: 'Healthcare Provider';
      medicalRecord: 'EHR/PHI';
    };
    legalDeadlines: {
      grievance: 30; // días
      complaint: 30;
      hipaa_request: 30;
    };
    reportTemplates: {
      hhs: 'hipaa_compliance_report';
      internal: 'quality_metrics_dashboard';
    };
  };
  
  // Configuración de Unión Europea
  eu: {
    regulatoryBody: 'NHS England, CQC';
    legislation: 'GDPR, NHS Constitution';
    terminology: {
      caseTypes: ['complaint', 'gdpr_request', 'pals_query'];
      insuranceProvider: 'NHS Trust';
      healthcareProvider: 'Healthcare Provider';
      medicalRecord: 'Patient Record';
    };
    legalDeadlines: {
      complaint: 30; // días
      gdpr_request: 30;
      pals_query: 25;
    };
    reportTemplates: {
      nhs: 'nhs_complaint_report';
      internal: 'quality_improvement_dashboard';
    };
  };
}
```

### **2. Constructor de Configuración Visual**
```typescript
interface ConfigurationBuilder {
  // Interfaz visual para configuración
  visualConfigurator: {
    countrySelector: 'dropdown_with_flags';
    regulatoryBody: 'text_input_with_validation';
    legislation: 'multi_select_with_search';
    terminology: 'form_builder_with_templates';
    legalDeadlines: 'calendar_with_business_days';
    reportTemplates: 'template_editor_with_preview';
  };
  
  // Validación de configuración
  validation: {
    requiredFields: ['regulatoryBody', 'legislation', 'terminology'];
    legalDeadlines: 'must_be_positive_integers';
    terminology: 'must_have_case_types';
    reportTemplates: 'must_be_valid_json';
  };
  
  // Exportación e importación
  dataManagement: {
    exportFormat: 'json' | 'yaml' | 'xml';
    importValidation: 'schema_validation';
    versionControl: 'configuration_versioning';
    backupRestore: 'automatic_backup';
  };
}
```

---

## 🎯 **Implementación y Roadmap**

### **Fase 1: Core de Salud (Q4 2025)**
1. ✅ Especificación técnica completa
2. 🔄 Desarrollo del módulo base de salud
3. 📋 Integración con EHR básica
4. 🏗️ Sistema de clasificación por criticidad

### **Fase 2: Cumplimiento Legal (Q1 2026)**
1. Motor de SLA especializado para salud
2. Auditoría inmutable HIPAA
3. Reportes para Superintendencia de Salud
4. Control de acceso por roles

### **Fase 3: Configuración Local (Q2 2026)**
1. Constructor visual de configuración
2. Templates para Colombia, EE.UU., UE
3. Validación de configuración
4. Exportación/importación de configuraciones

### **Fase 4: Analítica Avanzada (Q3 2026)**
1. Análisis de causa raíz
2. Predicciones y alertas tempranas
3. Dashboard ejecutivo
4. Integración con sistemas de calidad

### **Fase 5: Expansión Global (Q4 2026)**
1. Configuraciones para más países
2. Machine Learning para clasificación
3. Automatización de workflows
4. Marketplace de configuraciones

---

## 💡 **Valor Diferencial en Salud**

### **1. Argumento de Venta Principal**
- **"Salvar vidas mientras cumple la ley"**
- **"Protección legal en casos de mala praxis"**
- **"Mejora continua de la calidad del servicio"**
- **"Un producto, múltiples mercados"**

### **2. ROI Específico del Sector Salud**
- **Reducción de demandas por mala praxis:** 60%
- **Cumplimiento regulatorio:** 100%
- **Mejora en tiempos de respuesta:** 40%
- **Satisfacción del paciente:** +30%

### **3. Diferenciación Competitiva**
- **Integración nativa con EHR** (no disponible en competidores)
- **Clasificación por criticidad** (único en el mercado)
- **Auditoría inmutable** (requerimiento legal crítico)
- **Analítica de causa raíz** (transforma quejas en mejora)
- **Configuración local sin desarrollo** (implementación rápida)

---

> **Nota:** Esta especificación técnica se actualiza continuamente basado en feedback de hospitales, clínicas y entidades reguladoras del sector salud. El enfoque de configuración local permite implementar el sistema en nuevos países sin desarrollo adicional. 