# ⚙️ Configuraciones Paramétricas PQRS - Por País e Industria

## 📋 Resumen Ejecutivo

Configuraciones paramétricas específicas para cada país e industria, basadas en la investigación global de requisitos PQRS. Todas las configuraciones son completamente parametrizables sin hardcoding.

---

## 🌍 Configuraciones por País

### 1. Colombia (CO)

```typescript
const ColombiaConfiguration: UniversalLocalConfiguration = {
  id: 'colombia-universal',
  countryCode: 'CO',
  industryCode: 'universal',
  regulatorCode: 'general',
  
  locale: {
    primaryLanguage: 'es',
    supportedLanguages: ['es', 'en'],
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'COP',
    timezone: 'America/Bogota',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      currencySymbol: '$',
      currencyPosition: 'before'
    }
  },
  
  regulatory: {
    applicableLaws: ['ley_1755_2015', 'decreto_1081_2015'],
    regulatoryBodies: ['procuraduria_general', 'superintendencia_industria_comercio'],
    complianceRequirements: ['derecho_peticion', 'plazos_legales', 'auditoria'],
    reportingRequirements: ['reporte_mensual', 'reporte_trimestral'],
    auditRequirements: ['trazabilidad', 'inmutabilidad', 'firma_digital']
  },
  
  classification: {
    caseTypes: {
      'peticion': 'Petición',
      'queja': 'Queja', 
      'reclamo': 'Reclamo',
      'solicitud': 'Solicitud'
    },
    priorities: {
      'baja': 'Baja',
      'media': 'Media',
      'alta': 'Alta',
      'critica': 'Crítica'
    },
    criticalityLevels: {
      'menor': 'Menor',
      'moderada': 'Moderada',
      'mayor': 'Mayor',
      'severa': 'Severa',
      'critica': 'Crítica'
    },
    routingRules: [
      {
        id: 'colombia-priority-routing',
        condition: 'priority === "critica"',
        action: 'escalate_immediate',
        target: 'supervisor'
      }
    ],
    escalationRules: [
      {
        id: 'colombia-sla-breach',
        trigger: 'sla_breach',
        action: 'notify_supervisor',
        timeframe: { value: 1, unit: 'hours' }
      }
    ]
  },
  
  sla: {
    responseTimes: {
      'peticion': { value: 15, unit: 'days', isBusinessDays: true },
      'queja': { value: 15, unit: 'days', isBusinessDays: true },
      'reclamo': { value: 30, unit: 'days', isBusinessDays: true },
      'solicitud': { value: 10, unit: 'days', isBusinessDays: true }
    },
    resolutionTimes: {
      'peticion': { value: 30, unit: 'days', isBusinessDays: true },
      'queja': { value: 30, unit: 'days', isBusinessDays: true },
      'reclamo': { value: 60, unit: 'days', isBusinessDays: true },
      'solicitud': { value: 20, unit: 'days', isBusinessDays: true }
    },
    escalationThresholds: [
      { percentage: 80, action: 'warning' },
      { percentage: 90, action: 'escalate' },
      { percentage: 100, action: 'breach_notification' }
    ],
    businessHours: {
      timezone: 'America/Bogota',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '17:00',
      breaks: [
        { start: '12:00', end: '13:00', description: 'Almuerzo' }
      ]
    },
    holidays: [
      { date: '2025-01-01', description: 'Año Nuevo' },
      { date: '2025-01-06', description: 'Reyes Magos' },
      { date: '2025-03-24', description: 'San José' },
      { date: '2025-04-17', description: 'Jueves Santo' },
      { date: '2025-04-18', description: 'Viernes Santo' },
      { date: '2025-05-01', description: 'Día del Trabajo' },
      { date: '2025-05-12', description: 'Ascensión' },
      { date: '2025-06-23', description: 'Corpus Christi' },
      { date: '2025-06-29', description: 'San Pedro y San Pablo' },
      { date: '2025-07-20', description: 'Independencia' },
      { date: '2025-08-07', description: 'Batalla de Boyacá' },
      { date: '2025-08-18', description: 'Asunción' },
      { date: '2025-10-13', description: 'Día de la Raza' },
      { date: '2025-11-03', description: 'Todos los Santos' },
      { date: '2025-11-17', description: 'Independencia de Cartagena' },
      { date: '2025-12-08', description: 'Inmaculada Concepción' },
      { date: '2025-12-25', description: 'Navidad' }
    ]
  },
  
  security: {
    dataRetention: {
      pqrsData: { period: 10, unit: 'years', policy: 'archive' },
      auditLogs: { period: 15, unit: 'years', policy: 'archive' },
      communications: { period: 5, unit: 'years', policy: 'archive' }
    },
    encryption: {
      algorithm: 'AES-256',
      keyRotation: { period: 90, unit: 'days' },
      transportEncryption: true
    },
    accessControl: {
      roles: ['admin', 'supervisor', 'agent', 'viewer'],
      permissions: ['create', 'read', 'update', 'delete', 'approve', 'escalate']
    },
    auditLogging: {
      enabled: true,
      events: ['create', 'update', 'delete', 'status_change', 'assignment'],
      retention: { period: 15, unit: 'years' }
    }
  },
  
  integration: {
    externalSystems: [
      {
        id: 'colombia-gov-api',
        name: 'API Gobierno Colombia',
        type: 'government',
        endpoints: ['/api/v1/pqrs', '/api/v1/status'],
        authentication: 'oauth2'
      }
    ],
    apiEndpoints: [
      {
        path: '/api/v1/pqrs',
        method: 'POST',
        description: 'Crear PQRS',
        authentication: 'required'
      }
    ],
    webhooks: [
      {
        url: '/webhooks/pqrs-status-change',
        events: ['status_change', 'sla_breach'],
        authentication: 'bearer_token'
      }
    ],
    dataMappings: [
      {
        sourceField: 'petitioner.documentNumber',
        targetField: 'numero_documento',
        transformation: 'direct'
      }
    ]
  },
  
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date('2025-01-23'),
    createdBy: 'system',
    validationStatus: 'active'
  }
};
```

### 2. Estados Unidos (US)

```typescript
const USConfiguration: UniversalLocalConfiguration = {
  id: 'usa-universal',
  countryCode: 'US',
  industryCode: 'universal',
  regulatorCode: 'general',
  
  locale: {
    primaryLanguage: 'en',
    supportedLanguages: ['en', 'es'],
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    currency: 'USD',
    timezone: 'America/New_York',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '$',
      currencyPosition: 'before'
    }
  },
  
  regulatory: {
    applicableLaws: ['administrative_procedure_act', 'freedom_of_information_act'],
    regulatoryBodies: ['various_federal_agencies'],
    complianceRequirements: ['right_to_petition', 'foia_compliance', 'privacy_protection'],
    reportingRequirements: ['monthly_report', 'quarterly_report'],
    auditRequirements: ['audit_trail', 'data_protection', 'access_logs']
  },
  
  classification: {
    caseTypes: {
      'complaint': 'Complaint',
      'inquiry': 'Inquiry',
      'grievance': 'Grievance',
      'appeal': 'Appeal',
      'foia_request': 'FOIA Request'
    },
    priorities: {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'critical': 'Critical'
    },
    criticalityLevels: {
      'minor': 'Minor',
      'moderate': 'Moderate',
      'major': 'Major',
      'severe': 'Severe',
      'critical': 'Critical'
    },
    routingRules: [
      {
        id: 'us-priority-routing',
        condition: 'priority === "critical"',
        action: 'escalate_immediate',
        target: 'supervisor'
      }
    ],
    escalationRules: [
      {
        id: 'us-sla-breach',
        trigger: 'sla_breach',
        action: 'notify_supervisor',
        timeframe: { value: 2, unit: 'hours' }
      }
    ]
  },
  
  sla: {
    responseTimes: {
      'complaint': { value: 30, unit: 'days', isBusinessDays: false },
      'inquiry': { value: 30, unit: 'days', isBusinessDays: false },
      'grievance': { value: 30, unit: 'days', isBusinessDays: false },
      'appeal': { value: 30, unit: 'days', isBusinessDays: false },
      'foia_request': { value: 20, unit: 'days', isBusinessDays: false }
    },
    resolutionTimes: {
      'complaint': { value: 60, unit: 'days', isBusinessDays: false },
      'inquiry': { value: 45, unit: 'days', isBusinessDays: false },
      'grievance': { value: 90, unit: 'days', isBusinessDays: false },
      'appeal': { value: 60, unit: 'days', isBusinessDays: false },
      'foia_request': { value: 30, unit: 'days', isBusinessDays: false }
    },
    escalationThresholds: [
      { percentage: 80, action: 'warning' },
      { percentage: 90, action: 'escalate' },
      { percentage: 100, action: 'breach_notification' }
    ],
    businessHours: {
      timezone: 'America/New_York',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
      breaks: [
        { start: '12:00', end: '13:00', description: 'Lunch' }
      ]
    },
    holidays: [
      { date: '2025-01-01', description: 'New Year\'s Day' },
      { date: '2025-01-20', description: 'Martin Luther King Jr. Day' },
      { date: '2025-02-17', description: 'Presidents\' Day' },
      { date: '2025-05-26', description: 'Memorial Day' },
      { date: '2025-07-04', description: 'Independence Day' },
      { date: '2025-09-01', description: 'Labor Day' },
      { date: '2025-10-13', description: 'Columbus Day' },
      { date: '2025-11-11', description: 'Veterans Day' },
      { date: '2025-11-27', description: 'Thanksgiving Day' },
      { date: '2025-12-25', description: 'Christmas Day' }
    ]
  },
  
  security: {
    dataRetention: {
      pqrsData: { period: 7, unit: 'years', policy: 'archive' },
      auditLogs: { period: 10, unit: 'years', policy: 'archive' },
      communications: { period: 3, unit: 'years', policy: 'archive' }
    },
    encryption: {
      algorithm: 'AES-256',
      keyRotation: { period: 90, unit: 'days' },
      transportEncryption: true
    },
    accessControl: {
      roles: ['admin', 'supervisor', 'agent', 'viewer'],
      permissions: ['create', 'read', 'update', 'delete', 'approve', 'escalate']
    },
    auditLogging: {
      enabled: true,
      events: ['create', 'update', 'delete', 'status_change', 'assignment'],
      retention: { period: 10, unit: 'years' }
    }
  },
  
  integration: {
    externalSystems: [
      {
        id: 'us-gov-api',
        name: 'US Government API',
        type: 'government',
        endpoints: ['/api/v1/complaints', '/api/v1/foia'],
        authentication: 'oauth2'
      }
    ],
    apiEndpoints: [
      {
        path: '/api/v1/complaints',
        method: 'POST',
        description: 'Create Complaint',
        authentication: 'required'
      }
    ],
    webhooks: [
      {
        url: '/webhooks/complaint-status-change',
        events: ['status_change', 'sla_breach'],
        authentication: 'bearer_token'
      }
    ],
    dataMappings: [
      {
        sourceField: 'petitioner.documentNumber',
        targetField: 'ssn',
        transformation: 'masked'
      }
    ]
  },
  
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date('2025-01-23'),
    createdBy: 'system',
    validationStatus: 'active'
  }
};
```

### 3. Reino Unido (UK)

```typescript
const UKConfiguration: UniversalLocalConfiguration = {
  id: 'uk-universal',
  countryCode: 'UK',
  industryCode: 'universal',
  regulatorCode: 'general',
  
  locale: {
    primaryLanguage: 'en',
    supportedLanguages: ['en'],
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'GBP',
    timezone: 'Europe/London',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '£',
      currencyPosition: 'before'
    }
  },
  
  regulatory: {
    applicableLaws: ['freedom_of_information_act_2000', 'data_protection_act_2018'],
    regulatoryBodies: ['information_commissioners_office'],
    complianceRequirements: ['foi_compliance', 'gdpr_compliance', 'data_protection'],
    reportingRequirements: ['monthly_report', 'quarterly_report'],
    auditRequirements: ['audit_trail', 'data_protection', 'access_logs']
  },
  
  classification: {
    caseTypes: {
      'complaint': 'Complaint',
      'inquiry': 'Inquiry',
      'grievance': 'Grievance',
      'appeal': 'Appeal',
      'foi_request': 'FOI Request'
    },
    priorities: {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'critical': 'Critical'
    },
    criticalityLevels: {
      'minor': 'Minor',
      'moderate': 'Moderate',
      'major': 'Major',
      'severe': 'Severe',
      'critical': 'Critical'
    },
    routingRules: [
      {
        id: 'uk-priority-routing',
        condition: 'priority === "critical"',
        action: 'escalate_immediate',
        target: 'supervisor'
      }
    ],
    escalationRules: [
      {
        id: 'uk-sla-breach',
        trigger: 'sla_breach',
        action: 'notify_supervisor',
        timeframe: { value: 1, unit: 'hours' }
      }
    ]
  },
  
  sla: {
    responseTimes: {
      'complaint': { value: 28, unit: 'days', isBusinessDays: true },
      'inquiry': { value: 20, unit: 'days', isBusinessDays: true },
      'grievance': { value: 28, unit: 'days', isBusinessDays: true },
      'appeal': { value: 28, unit: 'days', isBusinessDays: true },
      'foi_request': { value: 20, unit: 'days', isBusinessDays: true }
    },
    resolutionTimes: {
      'complaint': { value: 56, unit: 'days', isBusinessDays: true },
      'inquiry': { value: 40, unit: 'days', isBusinessDays: true },
      'grievance': { value: 84, unit: 'days', isBusinessDays: true },
      'appeal': { value: 56, unit: 'days', isBusinessDays: true },
      'foi_request': { value: 40, unit: 'days', isBusinessDays: true }
    },
    escalationThresholds: [
      { percentage: 80, action: 'warning' },
      { percentage: 90, action: 'escalate' },
      { percentage: 100, action: 'breach_notification' }
    ],
    businessHours: {
      timezone: 'Europe/London',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
      breaks: [
        { start: '12:00', end: '13:00', description: 'Lunch' }
      ]
    },
    holidays: [
      { date: '2025-01-01', description: 'New Year\'s Day' },
      { date: '2025-04-18', description: 'Good Friday' },
      { date: '2025-04-21', description: 'Easter Monday' },
      { date: '2025-05-05', description: 'Early May Bank Holiday' },
      { date: '2025-05-26', description: 'Spring Bank Holiday' },
      { date: '2025-08-25', description: 'Summer Bank Holiday' },
      { date: '2025-12-25', description: 'Christmas Day' },
      { date: '2025-12-26', description: 'Boxing Day' }
    ]
  },
  
  security: {
    dataRetention: {
      pqrsData: { period: 6, unit: 'years', policy: 'archive' },
      auditLogs: { period: 7, unit: 'years', policy: 'archive' },
      communications: { period: 2, unit: 'years', policy: 'archive' }
    },
    encryption: {
      algorithm: 'AES-256',
      keyRotation: { period: 90, unit: 'days' },
      transportEncryption: true
    },
    accessControl: {
      roles: ['admin', 'supervisor', 'agent', 'viewer'],
      permissions: ['create', 'read', 'update', 'delete', 'approve', 'escalate']
    },
    auditLogging: {
      enabled: true,
      events: ['create', 'update', 'delete', 'status_change', 'assignment'],
      retention: { period: 7, unit: 'years' }
    }
  },
  
  integration: {
    externalSystems: [
      {
        id: 'uk-gov-api',
        name: 'UK Government API',
        type: 'government',
        endpoints: ['/api/v1/complaints', '/api/v1/foi'],
        authentication: 'oauth2'
      }
    ],
    apiEndpoints: [
      {
        path: '/api/v1/complaints',
        method: 'POST',
        description: 'Create Complaint',
        authentication: 'required'
      }
    ],
    webhooks: [
      {
        url: '/webhooks/complaint-status-change',
        events: ['status_change', 'sla_breach'],
        authentication: 'bearer_token'
      }
    ],
    dataMappings: [
      {
        sourceField: 'petitioner.documentNumber',
        targetField: 'national_insurance_number',
        transformation: 'masked'
      }
    ]
  },
  
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date('2025-01-23'),
    createdBy: 'system',
    validationStatus: 'active'
  }
};
```

---

## 🏭 Configuraciones por Industria

### 1. Salud (Healthcare)

```typescript
const HealthcareIndustryConfiguration: IndustryConfiguration = {
  code: 'healthcare',
  name: {
    es: 'Salud',
    en: 'Healthcare',
    default: 'Healthcare'
  },
  description: {
    es: 'Sector de servicios de salud y atención médica',
    en: 'Healthcare and medical services sector',
    default: 'Healthcare and medical services sector'
  },
  applicableRegulations: [
    'hipaa', 'hitech', 'aca', 'gdpr', 'local_health_regulations'
  ],
  specificRequirements: [
    'patient_privacy_protection',
    'medical_record_integration',
    'clinical_criticality_assessment',
    'regulatory_reporting',
    'audit_trail_medical'
  ],
  customFields: [
    {
      id: 'patient_id',
      name: { es: 'ID del Paciente', en: 'Patient ID', default: 'Patient ID' },
      type: 'string',
      required: true,
      validation: 'medical_record_format'
    },
    {
      id: 'medical_record_number',
      name: { es: 'Número de Historia Clínica', en: 'Medical Record Number', default: 'Medical Record Number' },
      type: 'string',
      required: false,
      validation: 'optional'
    },
    {
      id: 'clinical_criticality',
      name: { es: 'Criticidad Clínica', en: 'Clinical Criticality', default: 'Clinical Criticality' },
      type: 'select',
      options: ['low', 'medium', 'high', 'critical'],
      required: true,
      validation: 'required'
    },
    {
      id: 'health_area',
      name: { es: 'Área de Salud', en: 'Health Area', default: 'Health Area' },
      type: 'select',
      options: ['emergency', 'surgery', 'pharmacy', 'billing', 'laboratory', 'imaging', 'therapy'],
      required: true,
      validation: 'required'
    }
  ],
  workflowRules: [
    {
      id: 'healthcare-critical-escalation',
      name: 'Escalación Crítica en Salud',
      condition: 'clinical_criticality === "critical"',
      action: 'immediate_escalation',
      target: 'medical_director'
    },
    {
      id: 'healthcare-privacy-review',
      name: 'Revisión de Privacidad',
      condition: 'contains_phi === true',
      action: 'privacy_officer_review',
      target: 'privacy_officer'
    }
  ],
  slaMultipliers: {
    'critical': 0.5, // 50% del tiempo normal
    'high': 0.7,     // 70% del tiempo normal
    'medium': 1.0,   // Tiempo normal
    'low': 1.5       // 150% del tiempo normal
  }
};
```

### 2. Financiero (Financial)

```typescript
const FinancialIndustryConfiguration: IndustryConfiguration = {
  code: 'financial',
  name: {
    es: 'Financiero',
    en: 'Financial',
    default: 'Financial'
  },
  description: {
    es: 'Sector de servicios financieros y bancarios',
    en: 'Financial services and banking sector',
    default: 'Financial services and banking sector'
  },
  applicableRegulations: [
    'dodd_frank', 'cfpb_rules', 'sox', 'pci_dss', 'glba', 'local_financial_regulations'
  ],
  specificRequirements: [
    'financial_data_protection',
    'transaction_monitoring',
    'fraud_detection',
    'regulatory_reporting',
    'audit_trail_financial'
  ],
  customFields: [
    {
      id: 'account_number',
      name: { es: 'Número de Cuenta', en: 'Account Number', default: 'Account Number' },
      type: 'string',
      required: true,
      validation: 'account_format'
    },
    {
      id: 'transaction_id',
      name: { es: 'ID de Transacción', en: 'Transaction ID', default: 'Transaction ID' },
      type: 'string',
      required: false,
      validation: 'optional'
    },
    {
      id: 'financial_criticality',
      name: { es: 'Criticidad Financiera', en: 'Financial Criticality', default: 'Financial Criticality' },
      type: 'select',
      options: ['low', 'medium', 'high', 'critical'],
      required: true,
      validation: 'required'
    },
    {
      id: 'financial_area',
      name: { es: 'Área Financiera', en: 'Financial Area', default: 'Financial Area' },
      type: 'select',
      options: ['banking', 'investment', 'insurance', 'credit', 'payment', 'compliance'],
      required: true,
      validation: 'required'
    }
  ],
  workflowRules: [
    {
      id: 'financial-fraud-escalation',
      name: 'Escalación de Fraude',
      condition: 'financial_criticality === "critical"',
      action: 'immediate_escalation',
      target: 'fraud_department'
    },
    {
      id: 'financial-compliance-review',
      name: 'Revisión de Cumplimiento',
      condition: 'amount > threshold',
      action: 'compliance_review',
      target: 'compliance_officer'
    }
  ],
  slaMultipliers: {
    'critical': 0.3, // 30% del tiempo normal (más estricto)
    'high': 0.5,     // 50% del tiempo normal
    'medium': 1.0,   // Tiempo normal
    'low': 1.2       // 120% del tiempo normal
  }
};
```

### 3. Telecomunicaciones (Telecommunications)

```typescript
const TelecommunicationsIndustryConfiguration: IndustryConfiguration = {
  code: 'telecommunications',
  name: {
    es: 'Telecomunicaciones',
    en: 'Telecommunications',
    default: 'Telecommunications'
  },
  description: {
    es: 'Sector de servicios de telecomunicaciones',
    en: 'Telecommunications services sector',
    default: 'Telecommunications services sector'
  },
  applicableRegulations: [
    'communications_act', 'fcc_rules', 'net_neutrality', 'cpni', 'local_telecom_regulations'
  ],
  specificRequirements: [
    'network_quality_monitoring',
    'service_availability_tracking',
    'billing_dispute_resolution',
    'regulatory_reporting',
    'audit_trail_telecom'
  ],
  customFields: [
    {
      id: 'service_id',
      name: { es: 'ID de Servicio', en: 'Service ID', default: 'Service ID' },
      type: 'string',
      required: true,
      validation: 'service_format'
    },
    {
      id: 'phone_number',
      name: { es: 'Número de Teléfono', en: 'Phone Number', default: 'Phone Number' },
      type: 'string',
      required: false,
      validation: 'phone_format'
    },
    {
      id: 'telecom_criticality',
      name: { es: 'Criticidad de Telecomunicaciones', en: 'Telecom Criticality', default: 'Telecom Criticality' },
      type: 'select',
      options: ['low', 'medium', 'high', 'critical'],
      required: true,
      validation: 'required'
    },
    {
      id: 'telecom_area',
      name: { es: 'Área de Telecomunicaciones', en: 'Telecom Area', default: 'Telecom Area' },
      type: 'select',
      options: ['mobile', 'fixed_line', 'internet', 'tv', 'data', 'enterprise'],
      required: true,
      validation: 'required'
    }
  ],
  workflowRules: [
    {
      id: 'telecom-outage-escalation',
      name: 'Escalación de Interrupción',
      condition: 'telecom_criticality === "critical"',
      action: 'immediate_escalation',
      target: 'network_operations'
    },
    {
      id: 'telecom-billing-review',
      name: 'Revisión de Facturación',
      condition: 'billing_dispute === true',
      action: 'billing_review',
      target: 'billing_department'
    }
  ],
  slaMultipliers: {
    'critical': 0.4, // 40% del tiempo normal
    'high': 0.6,     // 60% del tiempo normal
    'medium': 1.0,   // Tiempo normal
    'low': 1.3       // 130% del tiempo normal
  }
};
```

### 4. Servicios Públicos (Utilities)

```typescript
const UtilitiesIndustryConfiguration: IndustryConfiguration = {
  code: 'utilities',
  name: {
    es: 'Servicios Públicos',
    en: 'Utilities',
    default: 'Utilities'
  },
  description: {
    es: 'Sector de servicios públicos (energía, agua, gas)',
    en: 'Public utilities sector (energy, water, gas)',
    default: 'Public utilities sector (energy, water, gas)'
  },
  applicableRegulations: [
    'public_utility_regulations', 'energy_policy_act', 'clean_air_act', 'local_utility_regulations'
  ],
  specificRequirements: [
    'service_continuity_monitoring',
    'safety_compliance_tracking',
    'billing_dispute_resolution',
    'regulatory_reporting',
    'audit_trail_utilities'
  ],
  customFields: [
    {
      id: 'service_id',
      name: { es: 'ID de Servicio', en: 'Service ID', default: 'Service ID' },
      type: 'string',
      required: true,
      validation: 'service_format'
    },
    {
      id: 'meter_number',
      name: { es: 'Número de Medidor', en: 'Meter Number', default: 'Meter Number' },
      type: 'string',
      required: false,
      validation: 'optional'
    },
    {
      id: 'utilities_criticality',
      name: { es: 'Criticidad de Servicios Públicos', en: 'Utilities Criticality', default: 'Utilities Criticality' },
      type: 'select',
      options: ['low', 'medium', 'high', 'critical'],
      required: true,
      validation: 'required'
    },
    {
      id: 'utilities_area',
      name: { es: 'Área de Servicios Públicos', en: 'Utilities Area', default: 'Utilities Area' },
      type: 'select',
      options: ['electricity', 'water', 'gas', 'waste', 'sewage', 'heating', 'cooling'],
      required: true,
      validation: 'required'
    }
  ],
  workflowRules: [
    {
      id: 'utilities-outage-escalation',
      name: 'Escalación de Interrupción',
      condition: 'utilities_criticality === "critical"',
      action: 'immediate_escalation',
      target: 'emergency_services'
    },
    {
      id: 'utilities-safety-review',
      name: 'Revisión de Seguridad',
      condition: 'safety_concern === true',
      action: 'safety_review',
      target: 'safety_officer'
    }
  ],
  slaMultipliers: {
    'critical': 0.3, // 30% del tiempo normal (más estricto)
    'high': 0.5,     // 50% del tiempo normal
    'medium': 1.0,   // Tiempo normal
    'low': 1.4       // 140% del tiempo normal
  }
};
```

---

## 🔧 Sistema de Configuración Dinámica

### 1. Motor de Configuración

```typescript
/**
 * Motor de Configuración Paramétrica
 */
class ParametricConfigurationEngine {
  private configurations: Map<string, UniversalLocalConfiguration> = new Map();
  private translations: Map<string, TranslationConfiguration> = new Map();
  
  /**
   * Obtener configuración por país e industria
   */
  getConfiguration(countryCode: string, industryCode: string): UniversalLocalConfiguration {
    const key = `${countryCode}-${industryCode}`;
    const config = this.configurations.get(key);
    
    if (!config) {
      throw new Error(`Configuration not found for ${countryCode}-${industryCode}`);
    }
    
    return config;
  }
  
  /**
   * Obtener traducción parametrizada
   */
  getTranslation(key: string, languageCode: string, countryCode?: string): string {
    const translationKey = countryCode ? `${countryCode}-${languageCode}-${key}` : `${languageCode}-${key}`;
    const translation = this.translations.get(translationKey);
    
    if (!translation) {
      return key; // Fallback al key si no hay traducción
    }
    
    return translation.value;
  }
  
  /**
   * Validar configuración
   */
  validateConfiguration(config: UniversalLocalConfiguration): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validar campos requeridos
    if (!config.countryCode) {
      errors.push({ field: 'countryCode', message: 'Country code is required' });
    }
    
    if (!config.industryCode) {
      errors.push({ field: 'industryCode', message: 'Industry code is required' });
    }
    
    // Validar SLA
    if (!config.sla.responseTimes || Object.keys(config.sla.responseTimes).length === 0) {
      errors.push({ field: 'sla.responseTimes', message: 'Response times are required' });
    }
    
    // Validar clasificación
    if (!config.classification.caseTypes || Object.keys(config.classification.caseTypes).length === 0) {
      errors.push({ field: 'classification.caseTypes', message: 'Case types are required' });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      info: [],
      complianceScore: errors.length === 0 ? 100 : Math.max(0, 100 - (errors.length * 10)),
      recommendations: []
    };
  }
  
  /**
   * Aplicar configuración a PQRS
   */
  applyConfiguration(pqrs: UniversalPQRS, config: UniversalLocalConfiguration): UniversalPQRS {
    return {
      ...pqrs,
      localConfigId: config.id,
      classification: {
        ...pqrs.classification,
        category: this.validateCaseType(pqrs.classification.category, config),
        priority: this.validatePriority(pqrs.classification.priority, config),
        criticality: this.validateCriticality(pqrs.classification.criticality, config)
      },
      sla: {
        ...pqrs.sla,
        responseSLA: this.calculateSLA(pqrs.classification.category, config, 'response'),
        resolutionSLA: this.calculateSLA(pqrs.classification.category, config, 'resolution')
      }
    };
  }
  
  /**
   * Validar tipo de caso
   */
  private validateCaseType(caseType: string, config: UniversalLocalConfiguration): string {
    const validTypes = Object.keys(config.classification.caseTypes);
    return validTypes.includes(caseType) ? caseType : validTypes[0];
  }
  
  /**
   * Validar prioridad
   */
  private validatePriority(priority: string, config: UniversalLocalConfiguration): string {
    const validPriorities = Object.keys(config.classification.priorities);
    return validPriorities.includes(priority) ? priority : validPriorities[0];
  }
  
  /**
   * Validar criticidad
   */
  private validateCriticality(criticality: string, config: UniversalLocalConfiguration): string {
    const validCriticalities = Object.keys(config.classification.criticalityLevels);
    return validCriticalities.includes(criticality) ? criticality : validCriticalities[0];
  }
  
  /**
   * Calcular SLA
   */
  private calculateSLA(caseType: string, config: UniversalLocalConfiguration, slaType: 'response' | 'resolution'): SLATimeframe {
    const slaConfig = slaType === 'response' ? config.sla.responseTimes : config.sla.resolutionTimes;
    return slaConfig[caseType] || slaConfig[Object.keys(slaConfig)[0]];
  }
}
```

### 2. Hook de React Paramétrico

```typescript
/**
 * Hook de Configuración Paramétrica para React
 */
export const useParametricConfiguration = () => {
  const [engine] = useState(() => new ParametricConfigurationEngine());
  const [currentConfig, setCurrentConfig] = useState<UniversalLocalConfiguration | null>(null);
  
  /**
   * Cargar configuración
   */
  const loadConfiguration = useCallback((countryCode: string, industryCode: string) => {
    try {
      const config = engine.getConfiguration(countryCode, industryCode);
      setCurrentConfig(config);
      return config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      return null;
    }
  }, [engine]);
  
  /**
   * Obtener traducción
   */
  const getTranslation = useCallback((key: string, languageCode?: string) => {
    if (!currentConfig) return key;
    
    const lang = languageCode || currentConfig.locale.primaryLanguage;
    return engine.getTranslation(key, lang, currentConfig.countryCode);
  }, [engine, currentConfig]);
  
  /**
   * Validar configuración
   */
  const validateConfiguration = useCallback((config: UniversalLocalConfiguration) => {
    return engine.validateConfiguration(config);
  }, [engine]);
  
  /**
   * Aplicar configuración a PQRS
   */
  const applyConfiguration = useCallback((pqrs: UniversalPQRS) => {
    if (!currentConfig) return pqrs;
    return engine.applyConfiguration(pqrs, currentConfig);
  }, [engine, currentConfig]);
  
  return {
    currentConfig,
    loadConfiguration,
    getTranslation,
    validateConfiguration,
    applyConfiguration
  };
};
```

---

## 🚀 Beneficios de la Configuración Paramétrica

### 1. **Escalabilidad Global**
- Nuevos países mediante configuración
- Nuevas industrias sin desarrollo
- Adaptación automática a regulaciones locales

### 2. **Mantenibilidad**
- Cambios regulatorios sin código
- Actualizaciones centralizadas
- Testing automatizado por configuración

### 3. **Cumplimiento Automático**
- Validación regulatoria automática
- Reportes automáticos según normativa
- Auditoría inmutable configurable

### 4. **Flexibilidad Total**
- Workflows completamente configurables
- SLA adaptativos por industria
- Terminología local parametrizable

### 5. **Aprovechamiento de Plataforma**
- Multi-tenancy nativo
- Roles y permisos parametrizables
- Integración configurable
- Analytics adaptables

Esta arquitectura de configuración paramétrica garantiza que el sistema PQRS sea **completamente genérico y adaptable**, aprovechando al máximo las capacidades de nuestra plataforma y permitiendo escalabilidad global sin límites. 