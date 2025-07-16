# 🏗️ Documentación Técnica Completa - Sistema PQRS Universal

**Documento de Confidencialidad:** Este documento contiene información estratégica confidencial de Euphorianet. Solo para uso interno autorizado.

**Fecha de Creación:** 23 de junio de 2025  
**Responsable:** Marcelo Escallón, CEO de Euphorianet  
**Sesión:** Documentación técnica completa con arquitectura híbrida

---

## 📋 Resumen Ejecutivo

Este documento define la **arquitectura híbrida completa** del sistema PQRS universal, implementando **separación funcional** entre módulos (Helpdesk, CRM, PQRS) con **integración de datos unificada**, soporte para **usuarios anónimos y registrados**, y **detección automática de derechos de petición**.

**Principio:** Módulos separados funcionalmente, datos integrados inteligentemente.

---

## 🏗️ **Arquitectura Híbrida del Sistema**

### **1. Separación Funcional de Módulos**
```typescript
// ========================================
// ARQUITECTURA DE MÓDULOS SEPARADOS
// ========================================

interface SystemModules {
  helpdesk: {
    purpose: 'Soporte técnico y operativo';
    access: 'Usuarios registrados + externos con validación de empresa';
    data: 'Información técnica y operativa';
    features: [
      'Gestión de tickets técnicos',
      'Soporte por niveles',
      'Integración con sistemas técnicos',
      'SLA operacional',
      'Base de conocimiento técnica'
    ];
  };
  
  crm: {
    purpose: 'Gestión comercial y leads';
    access: 'Leads abiertos, clientes registrados';
    data: 'Información comercial y de ventas';
    features: [
      'Gestión de leads y prospectos',
      'Pipeline de ventas',
      'Cotizaciones y propuestas',
      'Seguimiento comercial',
      'Analítica de ventas'
    ];
  };
  
  pqrs: {
    purpose: 'Derechos de petición, quejas, reclamos';
    access: 'Usuarios registrados + anónimos (según normativa)';
    data: 'Información legal y regulatoria';
    features: [
      'Gestión de PQRS formal',
      'Cumplimiento regulatorio',
      'SLA legal',
      'Auditoría inmutable',
      'Reportes regulatorios'
    ];
  };
}
```

### **2. Integración de Datos Unificada**
```typescript
// ========================================
// INTEGRACIÓN DE DATOS UNIFICADA
// ========================================

interface DataIntegration {
  userProfile: {
    unifiedId: string;
    email: string; // Clave de unificación
    phone?: string;
    personalInfo: PersonalInfo;
    companyRelationships: CompanyRelationship[];
    timeline: TimelineEntry[];
  };
  
  timeline: {
    consolidation: 'Historial unificado de todas las interacciones';
    filtering: 'Filtrado por módulo, empresa, tipo de interacción';
    search: 'Búsqueda global en toda la historia del usuario';
    analytics: 'Análisis de patrones de comportamiento';
  };
  
  notifications: {
    unified: 'Sistema único de notificaciones';
    preferences: 'Preferencias por usuario y tipo';
    channels: 'Email, SMS, push, in-app';
    templates: 'Plantillas por módulo y tipo';
  };
  
  audit: {
    centralized: 'Auditoría centralizada de todas las acciones';
    compliance: 'Cumplimiento regulatorio por módulo';
    retention: 'Políticas de retención diferenciadas';
    reporting: 'Reportes consolidados y específicos';
  };
}
```

---

## 👥 **Gestión de Usuarios y Acceso**

### **1. Tipos de Usuario y Acceso**
```typescript
// ========================================
// TIPOS DE USUARIO Y ACCESO
// ========================================

interface UserTypes {
  anonymous: {
    description: 'Usuario no registrado';
    access: {
      helpdesk: 'Solo con validación de empresa';
      crm: 'Creación de leads';
      pqrs: 'Permitido según normativa';
    };
    dataCapture: 'Información mínima requerida';
    privacy: 'Protección especial de datos';
  };
  
  external: {
    description: 'Usuario externo con validación';
    access: {
      helpdesk: 'Con validación de relación contractual';
      crm: 'Acceso completo a leads';
      pqrs: 'Acceso completo';
    };
    validation: 'Verificación de empresa y relación';
    dataCapture: 'Información completa';
  };
  
  registered: {
    description: 'Usuario registrado en el sistema';
    access: {
      helpdesk: 'Acceso completo';
      crm: 'Acceso completo';
      pqrs: 'Acceso completo';
    };
    profile: 'Perfil completo y unificado';
    history: 'Historial completo de interacciones';
  };
  
  employee: {
    description: 'Empleado de la empresa';
    access: {
      helpdesk: 'Acceso completo + gestión';
      crm: 'Acceso completo + gestión';
      pqrs: 'Acceso completo + gestión';
    };
    roles: 'Roles específicos por módulo';
    permissions: 'Permisos granulares';
  };
}
```

### **2. Flujo de Validación de Empresa**
```typescript
// ========================================
// FLUJO DE VALIDACIÓN DE EMPRESA
// ========================================

interface CompanyValidationFlow {
  // Usuario no registrado solicita soporte
  externalSupportRequest: {
    step1: 'Usuario accede sin autenticación';
    step2: 'Sistema solicita información básica';
    step3: 'Sistema solicita empresa/proceso relacionado';
    step4: 'Validación de relación contractual';
    
    validation: {
      ifContractual: {
        action: 'Permitir ticket de soporte';
        dataCapture: 'Información completa del usuario';
        tracking: 'Seguimiento completo del caso';
      };
      ifNotContractual: {
        action: 'Redirigir a CRM (cotización)';
        message: 'No podemos brindar soporte sin relación contractual';
        alternative: 'Sugerir proceso de cotización';
      };
      ifUnclear: {
        action: 'Solicitar información adicional';
        escalation: 'Revisión manual por supervisor';
        followUp: 'Contacto directo para aclaración';
      };
    };
  };
  
  // Datos capturados
  dataCapture: {
    userInfo: {
      name: string;
      email: string;
      phone?: string;
      company: string;
      position?: string;
    };
    companyInfo: {
      companyName: string;
      industry: string;
      relationship: 'client' | 'prospect' | 'partner' | 'vendor';
      contractNumber?: string;
      startDate?: string;
    };
    issueInfo: {
      category: string;
      priority: PriorityLevel;
      description: string;
      attachments?: Attachment[];
    };
  };
}
```

---

## 📋 **Detección y Gestión de Derechos de Petición**

### **1. Detección Automática**
```typescript
// ========================================
// DETECCIÓN AUTOMÁTICA DE DERECHOS DE PETICIÓN
// ========================================

interface PetitionDetection {
  // Palabras clave y patrones
  keywords: {
    spanish: [
      'derecho de petición',
      'derecho de petición',
      'ejerzo mi derecho',
      'presento petición formal',
      'solicito formalmente',
      'acudo a mis derechos',
      'ejerzo mi facultad'
    ];
    english: [
      'formal petition',
      'legal request',
      'exercise my right',
      'formal request',
      'legal petition',
      'statutory right'
    ];
    portuguese: [
      'direito de petição',
      'exercer meu direito',
      'petição formal',
      'solicitação legal'
    ];
  };
  
  // Patrones de lenguaje
  patterns: {
    formal: [
      'solicito formalmente',
      'ejerzo mi derecho de',
      'presento petición',
      'acudo a mis derechos',
      'formalmente solicito'
    ];
    legal: [
      'conforme a la ley',
      'según la normativa',
      'de acuerdo con',
      'en virtud de',
      'en ejercicio de'
    ];
    specific: [
      'información sobre',
      'copia de documentos',
      'estado de mi',
      'resolución de mi',
      'respuesta a mi'
    ];
  };
  
  // Contexto y análisis
  context: {
    language: 'Lenguaje formal y estructurado';
    references: 'Referencias a leyes o normativas';
    specificity: 'Solicitud específica y detallada';
    tone: 'Tono formal y respetuoso';
    structure: 'Estructura organizada del mensaje';
  };
  
  // Algoritmo de detección
  detectionAlgorithm: {
    step1: 'Análisis de palabras clave';
    step2: 'Identificación de patrones';
    step3: 'Análisis de contexto';
    step4: 'Puntuación de confianza';
    step5: 'Clasificación automática';
    step6: 'Revisión manual opcional';
  };
}
```

### **2. Marcado y Consecuencias**
```typescript
// ========================================
// MARCADO Y CONSECUENCIAS
// ========================================

interface PetitionMarking {
  // Marcado automático
  automaticMarking: {
    confidence: number; // 0-100
    threshold: 75; // Umbral para marcado automático
    reviewRequired: boolean; // Si requiere revisión manual
    notification: boolean; // Si notifica a supervisores
  };
  
  // Marcado manual
  manualMarking: {
    agentCanMark: boolean;
    supervisorApproval: boolean;
    auditTrail: boolean;
    reason: string; // Razón del marcado manual
  };
  
  // Consecuencias del marcado
  consequences: {
    timelineHighlight: {
      enabled: boolean;
      style: 'highlight' | 'badge' | 'icon';
      color: 'red' | 'orange' | 'yellow';
      text: 'Derecho de Petición';
    };
    
    notification: {
      supervisors: boolean;
      legal: boolean;
      compliance: boolean;
      channels: NotificationChannel[];
    };
    
    escalation: {
      automatic: boolean;
      level: 'supervisor' | 'manager' | 'director';
      timeframe: number; // horas
      priority: 'high' | 'critical';
    };
    
    reporting: {
      regulatory: boolean;
      internal: boolean;
      executive: boolean;
      frequency: 'immediate' | 'daily' | 'weekly';
    };
    
    retention: {
      extended: boolean;
      period: number; // años
      reason: 'legal_compliance' | 'regulatory_requirement';
    };
  };
}
```

---

## 🔗 **Integración de Timeline y Perfil Unificado**

### **1. Perfil Unificado del Usuario**
```typescript
// ========================================
// PERFIL UNIFICADO DEL USUARIO
// ========================================

interface UnifiedUserProfile {
  // Identificación unificada
  unifiedId: string;
  email: string; // Clave de unificación
  phone?: string;
  
  // Información personal
  personalInfo: {
    name: string;
    language: SupportedLanguage;
    timezone: string;
    preferences: UserPreferences;
    avatar?: string;
  };
  
  // Relaciones empresariales
  companyRelationships: {
    primaryCompany?: string; // Empresa principal
    associatedCompanies: CompanyRelationship[];
    roles: Record<string, string>; // Rol por empresa
    accessLevels: Record<string, AccessLevel>; // Nivel de acceso por empresa
    permissions: Record<string, Permission[]>; // Permisos por empresa
  };
  
  // Historial consolidado
  timeline: {
    interactions: TimelineEntry[];
    statistics: UserStatistics;
    patterns: UserBehaviorPatterns;
    preferences: UserInteractionPreferences;
  };
  
  // Configuración de privacidad
  privacy: {
    dataSharing: 'none' | 'anonymized' | 'full';
    retentionPeriod: number; // días
    gdprCompliant: boolean;
    dataPortability: boolean;
  };
}

interface CompanyRelationship {
  companyId: string;
  companyName: string;
  relationship: 'client' | 'prospect' | 'partner' | 'vendor' | 'employee';
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'pending';
  contractNumber?: string;
  role?: string;
  accessLevel: AccessLevel;
}
```

### **2. Timeline Consolidado**
```typescript
// ========================================
// TIMELINE CONSOLIDADO
// ========================================

interface TimelineEntry {
  id: string;
  timestamp: string;
  module: 'helpdesk' | 'crm' | 'pqrs';
  action: string;
  description: string;
  status: string;
  priority?: PriorityLevel;
  company?: string;
  
  // Información específica del módulo
  moduleSpecificData: {
    helpdesk?: HelpdeskTimelineData;
    crm?: CRMTimelineData;
    pqrs?: PQRSTimelineData;
  };
  
  // Marcado especial
  specialMarking?: {
    isPetition: boolean;
    isCritical: boolean;
    requiresAttention: boolean;
    highlightStyle?: string;
  };
  
  // Metadatos
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    location?: string;
  };
}

interface PQRSTimelineData {
  caseType: 'peticion' | 'queja' | 'reclamo' | 'solicitud';
  isFormalPetition: boolean;
  regulatoryCompliance: boolean;
  legalDeadline: string;
  status: string;
  assignedTo?: string;
  slaStatus: SLAStatus;
  escalationLevel?: number;
}

interface HelpdeskTimelineData {
  ticketType: 'technical' | 'operational' | 'access' | 'billing';
  category: string;
  subcategory: string;
  assignedTo?: string;
  resolutionTime?: number;
  satisfaction?: number;
}

interface CRMTimelineData {
  leadType: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  value?: number;
  currency: string;
  assignedTo?: string;
  nextAction?: string;
  nextActionDate?: string;
}
```

---

## 🔒 **Seguridad y Cumplimiento**

### **1. Control de Acceso Granular**
```typescript
// ========================================
// CONTROL DE ACCESO GRANULAR
// ========================================

interface AccessControl {
  // Roles por módulo
  roles: {
    helpdesk: {
      viewer: 'Ver tickets asignados';
      agent: 'Gestionar tickets';
      supervisor: 'Supervisar y escalar';
      manager: 'Gestión completa';
    };
    crm: {
      viewer: 'Ver leads y oportunidades';
      sales: 'Gestionar pipeline';
      manager: 'Gestión comercial';
      director: 'Estrategia comercial';
    };
    pqrs: {
      viewer: 'Ver PQRS asignadas';
      agent: 'Gestionar PQRS';
      legal: 'Revisión legal';
      compliance: 'Cumplimiento regulatorio';
    };
  };
  
  // Permisos específicos
  permissions: {
    dataAccess: {
      ownData: boolean;
      companyData: boolean;
      crossCompanyData: boolean;
      anonymousData: boolean;
    };
    actions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      escalate: boolean;
      approve: boolean;
    };
    modules: {
      helpdesk: boolean;
      crm: boolean;
      pqrs: boolean;
    };
  };
  
  // Validación de acceso
  validation: {
    authentication: 'Autenticación requerida';
    authorization: 'Autorización por roles';
    companyValidation: 'Validación de empresa';
    sessionManagement: 'Gestión de sesiones';
    auditLogging: 'Logging de acceso';
  };
}
```

### **2. Protección de Datos Anónimos**
```typescript
// ========================================
// PROTECCIÓN DE DATOS ANÓNIMOS
// ========================================

interface AnonymousDataProtection {
  // Principios de protección
  principles: {
    dataMinimization: 'Solo datos necesarios';
    purposeLimitation: 'Uso específico y limitado';
    storageLimitation: 'Retención limitada';
    accuracy: 'Datos precisos y actualizados';
    security: 'Protección técnica y organizativa';
    accountability: 'Responsabilidad demostrable';
  };
  
  // Medidas técnicas
  technicalMeasures: {
    encryption: {
      atRest: 'AES-256';
      inTransit: 'TLS 1.3';
      keyManagement: 'HSM o KMS';
    };
    anonymization: {
      pseudonymization: boolean;
      dataMasking: boolean;
      aggregation: boolean;
    };
    accessControl: {
      roleBased: boolean;
      attributeBased: boolean;
      timeBased: boolean;
    };
  };
  
  // Políticas de retención
  retentionPolicies: {
    anonymousData: {
      period: 30; // días
      reason: 'Temporal para procesamiento';
      deletion: 'Automática';
    };
    petitionData: {
      period: 7; // años
      reason: 'Cumplimiento legal';
      archival: 'Automática';
    };
    auditData: {
      period: 10; // años
      reason: 'Auditoría regulatoria';
      immutability: true;
    };
  };
}
```

---

## 📊 **Métricas y KPIs**

### **1. Métricas por Módulo**
```typescript
// ========================================
// MÉTRICAS POR MÓDULO
// ========================================

interface ModuleMetrics {
  helpdesk: {
    tickets: {
      total: number;
      open: number;
      resolved: number;
      averageResolutionTime: number;
      satisfaction: number;
    };
    sla: {
      compliance: number;
      breaches: number;
      averageResponseTime: number;
    };
    users: {
      registered: number;
      external: number;
      anonymous: number;
    };
  };
  
  crm: {
    leads: {
      total: number;
      qualified: number;
      converted: number;
      conversionRate: number;
    };
    sales: {
      pipeline: number;
      closed: number;
      averageDealSize: number;
      salesCycle: number;
    };
    users: {
      prospects: number;
      customers: number;
      partners: number;
    };
  };
  
  pqrs: {
    cases: {
      total: number;
      petitions: number;
      complaints: number;
      claims: number;
      suggestions: number;
    };
    compliance: {
      legalDeadline: number;
      regulatoryCompliance: number;
      auditReadiness: number;
    };
    users: {
      registered: number;
      anonymous: number;
      formalPetitions: number;
    };
  };
}
```

### **2. Métricas Integradas**
```typescript
// ========================================
// MÉTRICAS INTEGRADAS
// ========================================

interface IntegratedMetrics {
  user: {
    totalUsers: number;
    activeUsers: number;
    crossModuleUsers: number;
    averageInteractions: number;
    satisfaction: number;
  };
  
  system: {
    performance: PerformanceMetrics;
    availability: AvailabilityMetrics;
    security: SecurityMetrics;
    compliance: ComplianceMetrics;
  };
  
  business: {
    efficiency: number;
    costSavings: number;
    riskReduction: number;
    competitiveAdvantage: number;
  };
}
```

---

> **Nota:** Esta documentación técnica define la arquitectura híbrida completa del sistema PQRS universal, con separación funcional de módulos e integración inteligente de datos, soporte para usuarios anónimos y detección automática de derechos de petición. 