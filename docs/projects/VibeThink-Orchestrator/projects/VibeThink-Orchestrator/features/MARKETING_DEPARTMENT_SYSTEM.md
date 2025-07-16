# Sistema de Departamentos y Roles - Marketing Department

**Documento de Confidencialidad:** Este documento contiene información estratégica confidencial de Euphorianet. Solo para uso interno autorizado.

**Fecha de Creación:** 22 de junio de 2025  
**Responsable:** Marcelo Escallón, CEO de Euphorianet  
**Sesión:** Sistema completo de departamentos y roles

---

## 📋 Resumen Ejecutivo

Este documento define el sistema completo de departamentos, roles y planes que permite máxima flexibilidad para empresas con diferentes necesidades organizacionales. El sistema soporta empleados internos y asesores externos por departamento, con planes escalables según el tamaño y complejidad de la organización.

---

## 🏗️ Arquitectura del Sistema

### **Estructura Base: Roles + Departamentos + Planes**
```typescript
const systemArchitecture = {
  roles: {
    OWNER_CUST: 'Propietario de Empresa',
    ADMIN_CUST: 'Administrador de Empresa',
    MANAGER_CUST: 'Manager de Empresa',
    EMPLOYEE_CUST: 'Empleado de Empresa',
    ADVISOR_CUST: 'Asesor Externo'
  },
  
  departments: {
    FINANCE: 'Finanzas',
    MARKETING: 'Marketing',
    HR: 'Recursos Humanos',
    IT: 'Tecnología',
    LEGAL: 'Legal',
    SALES: 'Ventas',
    OPERATIONS: 'Operaciones',
    CUSTOMER_SERVICE: 'Atención al Cliente'
  },
  
  plans: {
    STARTER: 'Plan Básico',
    PROFESSIONAL: 'Plan Profesional',
    ENTERPRISE: 'Plan Empresarial'
  }
};
```

---

## 📊 Sistema de Planes con Departamentos

### **Plan STARTER (Básico)**
```typescript
const STARTER_PLAN = {
  name: 'Starter',
  price: '$29/mes',
  departments: {
    MARKETING: {
      employees: 2,
      advisors: 1,
      features: [
        'Gestión básica de redes sociales',
        'Programación de posts',
        'Analytics básicos',
        'IA para generación de contenido'
      ]
    },
    FINANCE: {
      employees: 1,
      advisors: 0,
      features: [
        'Gestión básica de finanzas',
        'Reportes simples',
        'Facturación básica'
      ]
    }
  },
  limits: {
    totalEmployees: 5,
    totalAdvisors: 2,
    aiRequests: 100/mes,
    storage: '10GB'
  }
};
```

### **Plan PROFESSIONAL (Profesional)**
```typescript
const PROFESSIONAL_PLAN = {
  name: 'Professional',
  price: '$99/mes',
  departments: {
    MARKETING: {
      employees: 5,
      advisors: 2,
      features: [
        'Gestión avanzada de redes sociales',
        'Programación automática',
        'Analytics avanzados',
        'IA para generación de contenido',
        'Gestión de campañas',
        'A/B testing'
      ]
    },
    FINANCE: {
      employees: 2,
      advisors: 1,
      features: [
        'Gestión completa de finanzas',
        'Reportes avanzados',
        'Facturación automática',
        'Análisis de costos'
      ]
    },
    HR: {
      employees: 2,
      advisors: 1,
      features: [
        'Gestión de empleados',
        'Procesos de selección',
        'Evaluaciones de desempeño',
        'Gestión de beneficios'
      ]
    },
    SALES: {
      employees: 3,
      advisors: 1,
      features: [
        'CRM básico',
        'Gestión de leads',
        'Reportes de ventas',
        'Seguimiento de oportunidades'
      ]
    }
  },
  limits: {
    totalEmployees: 15,
    totalAdvisors: 6,
    aiRequests: 500/mes,
    storage: '50GB'
  }
};
```

### **Plan ENTERPRISE (Empresarial)**
```typescript
const ENTERPRISE_PLAN = {
  name: 'Enterprise',
  price: '$299/mes',
  departments: {
    MARKETING: {
      employees: 10,
      advisors: 3,
      features: [
        'Gestión completa de redes sociales',
        'Programación inteligente',
        'Analytics en tiempo real',
        'IA avanzada para contenido',
        'Gestión de campañas complejas',
        'A/B testing avanzado',
        'Automatización de marketing',
        'Integración con herramientas externas'
      ]
    },
    FINANCE: {
      employees: 5,
      advisors: 2,
      features: [
        'Gestión financiera completa',
        'Reportes ejecutivos',
        'Facturación automatizada',
        'Análisis de costos avanzado',
        'Presupuestos y forecasting',
        'Integración contable'
      ]
    },
    HR: {
      employees: 5,
      advisors: 2,
      features: [
        'Gestión completa de RRHH',
        'Procesos de selección avanzados',
        'Evaluaciones 360°',
        'Gestión de beneficios',
        'Desarrollo de talento',
        'Compliance y legal'
      ]
    },
    IT: {
      employees: 3,
      advisors: 1,
      features: [
        'Gestión de infraestructura',
        'Soporte técnico',
        'Seguridad de datos',
        'Integración de sistemas'
      ]
    },
    LEGAL: {
      employees: 2,
      advisors: 1,
      features: [
        'Gestión de contratos',
        'Compliance legal',
        'Gestión de riesgos',
        'Asesoría legal básica'
      ]
    },
    SALES: {
      employees: 8,
      advisors: 2,
      features: [
        'CRM avanzado',
        'Gestión de leads',
        'Reportes de ventas',
        'Seguimiento de oportunidades',
        'Automatización de ventas',
        'Análisis de pipeline'
      ]
    },
    OPERATIONS: {
      employees: 4,
      advisors: 1,
      features: [
        'Gestión de operaciones',
        'Optimización de procesos',
        'Control de calidad',
        'Gestión de proyectos'
      ]
    },
    CUSTOMER_SERVICE: {
      employees: 6,
      advisors: 1,
      features: [
        'Gestión de tickets',
        'Chat en vivo',
        'Base de conocimientos',
        'Análisis de satisfacción'
      ]
    }
  },
  limits: {
    totalEmployees: 50,
    totalAdvisors: 15,
    aiRequests: 2000/mes,
    storage: '200GB'
  }
};
```

---

## 👥 Roles y Permisos por Departamento

### **EMPLOYEE_CUST + MARKETING**
```typescript
const MARKETING_EMPLOYEE = {
  role: 'EMPLOYEE_CUST',
  department: 'MARKETING',
  permissions: [
    // Permisos base del empleado
    'access_assigned_tasks',
    'view_company_data',
    'collaborate_with_team',
    'submit_work',
    'use_basic_ai_tools',
    
    // Permisos específicos de marketing
    'manage_social_media_accounts',
    'schedule_posts',
    'create_content',
    'edit_published_content',
    'view_marketing_analytics',
    'use_ai_content_generation',
    'manage_content_calendar',
    'track_basic_performance'
  ],
  dataAccess: [
    'assigned_tasks.*',
    'company_data.*',
    'marketing_data.*',
    'social_media.*',
    'content.*'
  ]
};
```

### **ADVISOR_CUST + MARKETING**
```typescript
const MARKETING_ADVISOR = {
  role: 'ADVISOR_CUST',
  department: 'MARKETING',
  permissions: [
    // Permisos base del asesor
    'access_assigned_tasks',
    'view_company_data',
    'submit_reports',
    'collaborate_with_team',
    'use_advanced_ai_tools',
    
    // Permisos específicos de marketing
    'manage_social_media_accounts',
    'schedule_posts',
    'create_content',
    'edit_published_content',
    'view_marketing_analytics',
    'use_ai_content_generation',
    'manage_content_calendar',
    'track_advanced_performance',
    'generate_strategic_reports',
    'provide_marketing_consulting',
    'create_marketing_strategies',
    'optimize_campaigns',
    'analyze_competitor_data'
  ],
  dataAccess: [
    'assigned_tasks.*',
    'company_data.*',
    'marketing_data.*',
    'social_media.*',
    'content.*',
    'analytics.*',
    'strategic_reports.*'
  ]
};
```

---

## 📋 Casos de Uso Detallados

### **Caso de Uso 1: Startup Tecnológica (Plan Starter)**
```typescript
const startupCase = {
  company: 'TechStartup Inc.',
  plan: 'STARTER',
  size: '5 empleados',
  departments: {
    MARKETING: {
      employees: [
        {
          name: 'Ana García',
          role: 'EMPLOYEE_CUST',
          position: 'Marketing Manager',
          responsibilities: 'Gestión completa de marketing'
        },
        {
          name: 'Carlos López',
          role: 'EMPLOYEE_CUST',
          position: 'Content Creator',
          responsibilities: 'Creación de contenido'
        }
      ],
      advisors: [
        {
          name: 'María Consultora',
          role: 'ADVISOR_CUST',
          position: 'Consultora de Marketing Digital',
          responsibilities: 'Estrategia mensual'
        }
      ]
    },
    FINANCE: {
      employees: [
        {
          name: 'Luis Contador',
          role: 'EMPLOYEE_CUST',
          position: 'Contador',
          responsibilities: 'Gestión financiera básica'
        }
      ],
      advisors: []
    }
  },
  scenario: 'Startup que necesita presencia en redes sociales y gestión financiera básica'
};
```

### **Caso de Uso 2: Empresa Mediana (Plan Professional)**
```typescript
const mediumCompanyCase = {
  company: 'RestaurantChain S.A.',
  plan: 'PROFESSIONAL',
  size: '15 empleados',
  departments: {
    MARKETING: {
      employees: [
        {
          name: 'Sofia Marketing',
          role: 'EMPLOYEE_CUST',
          position: 'Marketing Director',
          responsibilities: 'Dirección de marketing'
        },
        {
          name: 'Roberto Social',
          role: 'EMPLOYEE_CUST',
          position: 'Social Media Manager',
          responsibilities: 'Gestión de redes sociales'
        },
        {
          name: 'Elena Content',
          role: 'EMPLOYEE_CUST',
          position: 'Content Manager',
          responsibilities: 'Gestión de contenido'
        }
      ],
      advisors: [
        {
          name: 'Dr. Carlos Strategy',
          role: 'ADVISOR_CUST',
          position: 'Consultor Estratégico',
          responsibilities: 'Estrategia de marca'
        },
        {
          name: 'Laura Analytics',
          role: 'ADVISOR_CUST',
          position: 'Analista de Marketing',
          responsibilities: 'Análisis de performance'
        }
      ]
    },
    HR: {
      employees: [
        {
          name: 'Patricia HR',
          role: 'EMPLOYEE_CUST',
          position: 'HR Manager',
          responsibilities: 'Gestión de RRHH'
        }
      ],
      advisors: [
        {
          name: 'Dr. Miguel Legal',
          role: 'ADVISOR_CUST',
          position: 'Consultor Legal',
          responsibilities: 'Compliance laboral'
        }
      ]
    }
  },
  scenario: 'Cadena de restaurantes que necesita marketing digital y gestión de personal'
};
```

### **Caso de Uso 3: Empresa Grande (Plan Enterprise)**
```typescript
const largeCompanyCase = {
  company: 'GlobalTech Corporation',
  plan: 'ENTERPRISE',
  size: '50 empleados',
  departments: {
    MARKETING: {
      employees: [
        {
          name: 'Director Marketing',
          role: 'EMPLOYEE_CUST',
          position: 'CMO',
          responsibilities: 'Dirección estratégica'
        },
        {
          name: 'Social Media Team',
          role: 'EMPLOYEE_CUST',
          position: 'Social Media Specialists',
          responsibilities: 'Gestión de redes sociales'
        },
        {
          name: 'Content Team',
          role: 'EMPLOYEE_CUST',
          position: 'Content Creators',
          responsibilities: 'Creación de contenido'
        }
      ],
      advisors: [
        {
          name: 'Agencia Digital',
          role: 'ADVISOR_CUST',
          position: 'Agencia de Marketing Digital',
          responsibilities: 'Estrategia y ejecución'
        },
        {
          name: 'Consultor IA',
          role: 'ADVISOR_CUST',
          position: 'Consultor de IA',
          responsibilities: 'Optimización con IA'
        }
      ]
    },
    SALES: {
      employees: [
        {
          name: 'Sales Team',
          role: 'EMPLOYEE_CUST',
          position: 'Sales Representatives',
          responsibilities: 'Ventas directas'
        }
      ],
      advisors: [
        {
          name: 'Consultor Ventas',
          role: 'ADVISOR_CUST',
          position: 'Consultor de Ventas',
          responsibilities: 'Optimización de ventas'
        }
      ]
    }
  },
  scenario: 'Empresa global que necesita marketing digital avanzado y ventas optimizadas'
};
```

---

## ❓ FAQs (Preguntas Frecuentes)

### **FAQ 1: ¿Puedo cambiar de plan en cualquier momento?**
**R:** Sí, puedes cambiar de plan en cualquier momento. Los cambios se aplican al siguiente ciclo de facturación. Los usuarios existentes mantienen sus datos y configuraciones.

### **FAQ 2: ¿Qué pasa si excedo el límite de empleados o asesores?**
**R:** El sistema te notificará cuando te acerques al límite. Puedes:
- Actualizar a un plan superior
- Reducir el número de usuarios
- Contactar soporte para límites personalizados

### **FAQ 3: ¿Los asesores externos tienen acceso limitado?**
**R:** Los asesores tienen acceso específico a:
- Datos de su departamento asignado
- Herramientas de consultoría
- Reportes y analytics
- Colaboración con el equipo interno

### **FAQ 4: ¿Puedo tener diferentes departamentos en diferentes planes?**
**R:** No, el plan se aplica a toda la empresa. Sin embargo, puedes configurar permisos granulares por departamento dentro del plan.

### **FAQ 5: ¿Cómo funciona la facturación por asesores?**
**R:** Los asesores se facturan por separado del plan base. Cada asesor tiene un costo adicional mensual según su especialización.

### **FAQ 6: ¿Puedo personalizar los permisos por usuario?**
**R:** Sí, puedes personalizar permisos individuales manteniendo la estructura base de rol + departamento.

### **FAQ 7: ¿Qué incluye el almacenamiento?**
**R:** El almacenamiento incluye:
- Archivos de contenido
- Documentos de marketing
- Reportes y analytics
- Assets multimedia

### **FAQ 8: ¿Los límites de IA son por empresa o por usuario?**
**R:** Los límites de IA son por empresa. Se distribuyen automáticamente entre todos los usuarios según su uso.

---

## 🔧 Especificaciones Técnicas

### **Base de Datos: Esquema de Planes**
```sql
-- Tabla de planes
CREATE TABLE plans (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  max_employees INTEGER NOT NULL,
  max_advisors INTEGER NOT NULL,
  ai_requests_limit INTEGER NOT NULL,
  storage_limit_gb INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de departamentos por plan
CREATE TABLE plan_departments (
  id UUID PRIMARY KEY,
  plan_id UUID REFERENCES plans(id),
  department_code VARCHAR(20) NOT NULL,
  max_employees INTEGER NOT NULL,
  max_advisors INTEGER NOT NULL,
  features JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de usuarios con rol y departamento
CREATE TABLE users (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL,
  department_code VARCHAR(20),
  plan_id UUID REFERENCES plans(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **API Endpoints**
```typescript
// Gestión de planes
GET /api/plans                    // Listar planes disponibles
GET /api/plans/:id               // Obtener detalles del plan
POST /api/companies/:id/plan     // Asignar plan a empresa

// Gestión de departamentos
GET /api/departments             // Listar departamentos
GET /api/companies/:id/departments // Departamentos de la empresa
POST /api/companies/:id/departments // Crear departamento

// Gestión de usuarios
GET /api/companies/:id/users     // Listar usuarios
POST /api/companies/:id/users    // Crear usuario
PUT /api/users/:id               // Actualizar usuario
DELETE /api/users/:id            // Eliminar usuario
```

### **Validaciones de Límites**
```typescript
const validateLimits = {
  checkEmployeeLimit: (companyId: string, department: string) => {
    // Validar límite de empleados por departamento
  },
  
  checkAdvisorLimit: (companyId: string, department: string) => {
    // Validar límite de asesores por departamento
  },
  
  checkPlanLimit: (companyId: string) => {
    // Validar límites generales del plan
  },
  
  checkAIRateLimit: (companyId: string) => {
    // Validar límite de requests de IA
  }
};
```

---

## 🚀 Roadmap de Implementación

### **Fase 1: Sistema Base (2 semanas)**
- [ ] Implementar estructura de roles
- [ ] Implementar estructura de departamentos
- [ ] Crear sistema de permisos granulares
- [ ] Configurar validaciones de límites

### **Fase 2: Planes y Límites (2 semanas)**
- [ ] Implementar sistema de planes
- [ ] Configurar límites por departamento
- [ ] Crear sistema de facturación
- [ ] Implementar notificaciones de límites

### **Fase 3: Marketing Department (3 semanas)**
- [ ] Implementar funcionalidades de marketing
- [ ] Integrar con redes sociales
- [ ] Crear sistema de analytics
- [ ] Implementar IA para contenido

### **Fase 4: Otros Departamentos (4 semanas)**
- [ ] Implementar departamento de finanzas
- [ ] Implementar departamento de RRHH
- [ ] Implementar departamento de ventas
- [ ] Implementar departamentos adicionales

### **Fase 5: Testing y Optimización (2 semanas)**
- [ ] Testing completo del sistema
- [ ] Optimización de performance
- [ ] Documentación de usuario
- [ ] Training del equipo

---

## 📈 Métricas de Éxito

### **Técnicas**
- **Performance:** Carga de usuarios < 2 segundos
- **Escalabilidad:** Soporte para 1000+ empresas
- **Disponibilidad:** 99.9% uptime
- **Seguridad:** 0 vulnerabilidades críticas

### **Negocio**
- **Adopción:** 80% de empresas usando múltiples departamentos
- **Satisfacción:** > 4.5/5 en encuestas
- **Retención:** > 90% de clientes
- **Upselling:** 40% de empresas actualizando planes

### **Operacionales**
- **Soporte:** < 24 horas respuesta
- **Onboarding:** < 30 minutos para primer usuario
- **Documentación:** 100% de funcionalidades documentadas
- **Training:** < 2 horas para nuevos usuarios

---

**Responsable:** Equipo de Arquitectura  
**Fecha:** 22 de Junio, 2025  
**Estado:** Documentación completa  
**Próxima revisión:** 29 de Junio, 2025 