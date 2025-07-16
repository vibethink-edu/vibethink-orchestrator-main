# Sistema Completo de Departamentos, Roles y Planes਍ഀഀ
**Documento de Confidencialidad:** Este documento contiene información estratégica confidencial de Euphorianet. Solo para uso interno autorizado.਍ഀഀ
**Fecha de Creación:** 22 de junio de 2025  ਍⨀⨀刀攀猀瀀漀渀猀愀戀氀攀㨀⨀⨀ 䴀愀爀挀攀氀漀 䔀猀挀愀氀氀渀Ⰰ 䌀䔀伀 搀攀 䔀甀瀀栀漀爀椀愀渀攀琀  ഀഀ
**Sesión:** Sistema completo de departamentos y roles਍ഀഀ
---਍ഀഀ
## 📋 Resumen Ejecutivo਍ഀഀ
Este documento define el sistema completo de departamentos, roles y planes que permite máxima flexibilidad para empresas con diferentes necesidades organizacionales. El sistema soporta empleados internos y asesores externos por departamento, con planes escalables según el tamaño y complejidad de la organización.਍ഀഀ
**Nueva Funcionalidad:** Usuarios multi-departamento con límites configurables por plan.਍ഀഀ
---਍ഀഀ
## 🏗️ Arquitectura del Sistema਍ഀഀ
### **Estructura Base: Roles + Departamentos + Planes**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
const systemArchitecture = {਍  爀漀氀攀猀㨀 笀ഀഀ
    OWNER_CUST: 'Propietario de Empresa',਍    䄀䐀䴀䤀一开䌀唀匀吀㨀 ✀䄀搀洀椀渀椀猀琀爀愀搀漀爀 搀攀 䔀洀瀀爀攀猀愀✀Ⰰഀഀ
    MANAGER_CUST: 'Manager de Empresa',਍    䔀䴀倀䰀伀夀䔀䔀开䌀唀匀吀㨀 ✀䔀洀瀀氀攀愀搀漀 搀攀 䔀洀瀀爀攀猀愀✀Ⰰഀഀ
    ADVISOR_CUST: 'Asesor Externo'਍  紀Ⰰഀഀ
  ਍  搀攀瀀愀爀琀洀攀渀琀猀㨀 笀ഀഀ
    FINANCE: 'Finanzas',਍    䴀䄀刀䬀䔀吀䤀一䜀㨀 ✀䴀愀爀欀攀琀椀渀最✀Ⰰഀഀ
    HR: 'Recursos Humanos',਍    䤀吀㨀 ✀吀攀挀渀漀氀漀最愀✀Ⰰഀഀ
    LEGAL: 'Legal',਍    匀䄀䰀䔀匀㨀 ✀嘀攀渀琀愀猀✀Ⰰഀഀ
    OPERATIONS: 'Operaciones',਍    䌀唀匀吀伀䴀䔀刀开匀䔀刀嘀䤀䌀䔀㨀 ✀䄀琀攀渀挀椀渀 愀氀 䌀氀椀攀渀琀攀✀ഀഀ
  },਍  ഀഀ
  plans: {਍    匀吀䄀刀吀䔀刀㨀 ✀倀氀愀渀 䈀猀椀挀漀✀Ⰰഀഀ
    PROFESSIONAL: 'Plan Profesional',਍    䔀一吀䔀刀倀刀䤀匀䔀㨀 ✀倀氀愀渀 䔀洀瀀爀攀猀愀爀椀愀氀✀ഀഀ
  }਍紀㬀ഀഀ
```਍ഀഀ
---਍ഀഀ
## 📊 Sistema de Planes con Departamentos਍ഀഀ
### **Plan STARTER (Básico)**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
const STARTER_PLAN = {਍  渀愀洀攀㨀 ✀匀琀愀爀琀攀爀✀Ⰰഀഀ
  price: '$29/mes',਍  搀攀瀀愀爀琀洀攀渀琀猀㨀 笀ഀഀ
    MARKETING: {਍      攀洀瀀氀漀礀攀攀猀㨀 ㈀Ⰰഀഀ
      advisors: 1,਍      昀攀愀琀甀爀攀猀㨀 嬀ഀഀ
        'Gestión básica de redes sociales',਍        ✀倀爀漀最爀愀洀愀挀椀渀 搀攀 瀀漀猀琀猀✀Ⰰഀഀ
        'Analytics básicos',਍        ✀䤀䄀 瀀愀爀愀 最攀渀攀爀愀挀椀渀 搀攀 挀漀渀琀攀渀椀搀漀✀ഀഀ
      ]਍    紀Ⰰഀഀ
    FINANCE: {਍      攀洀瀀氀漀礀攀攀猀㨀 ㄀Ⰰഀഀ
      advisors: 0,਍      昀攀愀琀甀爀攀猀㨀 嬀ഀഀ
        'Gestión básica de finanzas',਍        ✀刀攀瀀漀爀琀攀猀 猀椀洀瀀氀攀猀✀Ⰰഀഀ
        'Facturación básica'਍      崀ഀഀ
    }਍  紀Ⰰഀഀ
  limits: {਍    琀漀琀愀氀䔀洀瀀氀漀礀攀攀猀㨀 㔀Ⰰഀഀ
    totalAdvisors: 2,਍    愀椀刀攀焀甀攀猀琀猀㨀 ㄀　　⼀洀攀猀Ⰰഀഀ
    storage: '10GB',਍    洀愀砀䐀攀瀀愀爀琀洀攀渀琀猀倀攀爀唀猀攀爀㨀 ㈀Ⰰ ⼀⼀ Ԁ‧一唀䔀嘀伀㨀 䴀砀椀洀漀 ㈀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀 瀀漀爀 甀猀甀愀爀椀漀ഀഀ
    maxUsersPerDepartment: 3  // ✅ NUEVO: Máximo 3 usuarios por departamento਍  紀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀倀氀愀渀 倀刀伀䘀䔀匀匀䤀伀一䄀䰀 ⠀倀爀漀昀攀猀椀漀渀愀氀⤀⨀⨀ഀഀ
```typescript਍挀漀渀猀琀 倀刀伀䘀䔀匀匀䤀伀一䄀䰀开倀䰀䄀一 㴀 笀ഀഀ
  name: 'Professional',਍  瀀爀椀挀攀㨀 ✀␀㤀㤀⼀洀攀猀✀Ⰰഀഀ
  departments: {਍    䴀䄀刀䬀䔀吀䤀一䜀㨀 笀ഀഀ
      employees: 5,਍      愀搀瘀椀猀漀爀猀㨀 ㈀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 愀瘀愀渀稀愀搀愀 搀攀 爀攀搀攀猀 猀漀挀椀愀氀攀猀✀Ⰰഀഀ
        'Programación automática',਍        ✀䄀渀愀氀礀琀椀挀猀 愀瘀愀渀稀愀搀漀猀✀Ⰰഀഀ
        'IA para generación de contenido',਍        ✀䜀攀猀琀椀渀 搀攀 挀愀洀瀀愀愀猀✀Ⰰഀഀ
        'A/B testing'਍      崀ഀഀ
    },਍    䘀䤀一䄀一䌀䔀㨀 笀ഀഀ
      employees: 2,਍      愀搀瘀椀猀漀爀猀㨀 ㄀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 挀漀洀瀀氀攀琀愀 搀攀 昀椀渀愀渀稀愀猀✀Ⰰഀഀ
        'Reportes avanzados',਍        ✀䘀愀挀琀甀爀愀挀椀渀 愀甀琀漀洀琀椀挀愀✀Ⰰഀഀ
        'Análisis de costos'਍      崀ഀഀ
    },਍    䠀刀㨀 笀ഀഀ
      employees: 2,਍      愀搀瘀椀猀漀爀猀㨀 ㄀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 搀攀 攀洀瀀氀攀愀搀漀猀✀Ⰰഀഀ
        'Procesos de selección',਍        ✀䔀瘀愀氀甀愀挀椀漀渀攀猀 搀攀 搀攀猀攀洀瀀攀漀✀Ⰰഀഀ
        'Gestión de beneficios'਍      崀ഀഀ
    },਍    匀䄀䰀䔀匀㨀 笀ഀഀ
      employees: 3,਍      愀搀瘀椀猀漀爀猀㨀 ㄀Ⰰഀഀ
      features: [਍        ✀䌀刀䴀 戀猀椀挀漀✀Ⰰഀഀ
        'Gestión de leads',਍        ✀刀攀瀀漀爀琀攀猀 搀攀 瘀攀渀琀愀猀✀Ⰰഀഀ
        'Seguimiento de oportunidades'਍      崀ഀഀ
    }਍  紀Ⰰഀഀ
  limits: {਍    琀漀琀愀氀䔀洀瀀氀漀礀攀攀猀㨀 ㄀㔀Ⰰഀഀ
    totalAdvisors: 6,਍    愀椀刀攀焀甀攀猀琀猀㨀 㔀　　⼀洀攀猀Ⰰഀഀ
    storage: '50GB',਍    洀愀砀䐀攀瀀愀爀琀洀攀渀琀猀倀攀爀唀猀攀爀㨀 ㌀Ⰰ ⼀⼀ Ԁ‧一唀䔀嘀伀㨀 䴀砀椀洀漀 ㌀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀 瀀漀爀 甀猀甀愀爀椀漀ഀഀ
    maxUsersPerDepartment: 8  // ✅ NUEVO: Máximo 8 usuarios por departamento਍  紀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀倀氀愀渀 䔀一吀䔀刀倀刀䤀匀䔀 ⠀䔀洀瀀爀攀猀愀爀椀愀氀⤀⨀⨀ഀഀ
```typescript਍挀漀渀猀琀 䔀一吀䔀刀倀刀䤀匀䔀开倀䰀䄀一 㴀 笀ഀഀ
  name: 'Enterprise',਍  瀀爀椀挀攀㨀 ✀␀㈀㤀㤀⼀洀攀猀✀Ⰰഀഀ
  departments: {਍    䴀䄀刀䬀䔀吀䤀一䜀㨀 笀ഀഀ
      employees: 10,਍      愀搀瘀椀猀漀爀猀㨀 ㌀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 挀漀洀瀀氀攀琀愀 搀攀 爀攀搀攀猀 猀漀挀椀愀氀攀猀✀Ⰰഀഀ
        'Programación inteligente',਍        ✀䄀渀愀氀礀琀椀挀猀 攀渀 琀椀攀洀瀀漀 爀攀愀氀✀Ⰰഀഀ
        'IA avanzada para contenido',਍        ✀䜀攀猀琀椀渀 搀攀 挀愀洀瀀愀愀猀 挀漀洀瀀氀攀樀愀猀✀Ⰰഀഀ
        'A/B testing avanzado',਍        ✀䄀甀琀漀洀愀琀椀稀愀挀椀渀 搀攀 洀愀爀欀攀琀椀渀最✀Ⰰഀഀ
        'Integración con herramientas externas'਍      崀ഀഀ
    },਍    䘀䤀一䄀一䌀䔀㨀 笀ഀഀ
      employees: 5,਍      愀搀瘀椀猀漀爀猀㨀 ㈀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 昀椀渀愀渀挀椀攀爀愀 挀漀洀瀀氀攀琀愀✀Ⰰഀഀ
        'Reportes ejecutivos',਍        ✀䘀愀挀琀甀爀愀挀椀渀 愀甀琀漀洀愀琀椀稀愀搀愀✀Ⰰഀഀ
        'Análisis de costos avanzado',਍        ✀倀爀攀猀甀瀀甀攀猀琀漀猀 礀 昀漀爀攀挀愀猀琀椀渀最✀Ⰰഀഀ
        'Integración contable'਍      崀ഀഀ
    },਍    䠀刀㨀 笀ഀഀ
      employees: 5,਍      愀搀瘀椀猀漀爀猀㨀 ㈀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 挀漀洀瀀氀攀琀愀 搀攀 刀刀䠀䠀✀Ⰰഀഀ
        'Procesos de selección avanzados',਍        ✀䔀瘀愀氀甀愀挀椀漀渀攀猀 ㌀㘀　뀀✀Ⰰഀഀ
        'Gestión de beneficios',਍        ✀䐀攀猀愀爀爀漀氀氀漀 搀攀 琀愀氀攀渀琀漀✀Ⰰഀഀ
        'Compliance y legal'਍      崀ഀഀ
    },਍    䤀吀㨀 笀ഀഀ
      employees: 3,਍      愀搀瘀椀猀漀爀猀㨀 ㄀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 搀攀 椀渀昀爀愀攀猀琀爀甀挀琀甀爀愀✀Ⰰഀഀ
        'Soporte técnico',਍        ✀匀攀最甀爀椀搀愀搀 搀攀 搀愀琀漀猀✀Ⰰഀഀ
        'Integración de sistemas'਍      崀ഀഀ
    },਍    䰀䔀䜀䄀䰀㨀 笀ഀഀ
      employees: 2,਍      愀搀瘀椀猀漀爀猀㨀 ㄀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 搀攀 挀漀渀琀爀愀琀漀猀✀Ⰰഀഀ
        'Compliance legal',਍        ✀䜀攀猀琀椀渀 搀攀 爀椀攀猀最漀猀✀Ⰰഀഀ
        'Asesoría legal básica'਍      崀ഀഀ
    },਍    匀䄀䰀䔀匀㨀 笀ഀഀ
      employees: 8,਍      愀搀瘀椀猀漀爀猀㨀 ㈀Ⰰഀഀ
      features: [਍        ✀䌀刀䴀 愀瘀愀渀稀愀搀漀✀Ⰰഀഀ
        'Gestión de leads',਍        ✀刀攀瀀漀爀琀攀猀 搀攀 瘀攀渀琀愀猀✀Ⰰഀഀ
        'Seguimiento de oportunidades',਍        ✀䄀甀琀漀洀愀琀椀稀愀挀椀渀 搀攀 瘀攀渀琀愀猀✀Ⰰഀഀ
        'Análisis de pipeline'਍      崀ഀഀ
    },਍    伀倀䔀刀䄀吀䤀伀一匀㨀 笀ഀഀ
      employees: 4,਍      愀搀瘀椀猀漀爀猀㨀 ㄀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 搀攀 漀瀀攀爀愀挀椀漀渀攀猀✀Ⰰഀഀ
        'Optimización de procesos',਍        ✀䌀漀渀琀爀漀氀 搀攀 挀愀氀椀搀愀搀✀Ⰰഀഀ
        'Gestión de proyectos'਍      崀ഀഀ
    },਍    䌀唀匀吀伀䴀䔀刀开匀䔀刀嘀䤀䌀䔀㨀 笀ഀഀ
      employees: 6,਍      愀搀瘀椀猀漀爀猀㨀 ㄀Ⰰഀഀ
      features: [਍        ✀䜀攀猀琀椀渀 搀攀 琀椀挀欀攀琀猀✀Ⰰഀഀ
        'Chat en vivo',਍        ✀䈀愀猀攀 搀攀 挀漀渀漀挀椀洀椀攀渀琀漀猀✀Ⰰഀഀ
        'Análisis de satisfacción'਍      崀ഀഀ
    }਍  紀Ⰰഀഀ
  limits: {਍    琀漀琀愀氀䔀洀瀀氀漀礀攀攀猀㨀 㔀　Ⰰഀഀ
    totalAdvisors: 15,਍    愀椀刀攀焀甀攀猀琀猀㨀 ㈀　　　⼀洀攀猀Ⰰഀഀ
    storage: '200GB',਍    洀愀砀䐀攀瀀愀爀琀洀攀渀琀猀倀攀爀唀猀攀爀㨀 㔀Ⰰ ⼀⼀ Ԁ‧一唀䔀嘀伀㨀 䴀砀椀洀漀 㔀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 瀀漀爀 甀猀甀愀爀椀漀ഀഀ
    maxUsersPerDepartment: 15 // ✅ NUEVO: Máximo 15 usuarios por departamento਍  紀ഀഀ
};਍怀怀怀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ 㴀旘⃜刀漀氀攀猀 礀 倀攀爀洀椀猀漀猀 瀀漀爀 䐀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
਍⌀⌀⌀ ⨀⨀䔀䴀倀䰀伀夀䔀䔀开䌀唀匀吀 ⬀ 䴀䄀刀䬀䔀吀䤀一䜀⨀⨀ഀഀ
```typescript਍挀漀渀猀琀 䴀䄀刀䬀䔀吀䤀一䜀开䔀䴀倀䰀伀夀䔀䔀 㴀 笀ഀഀ
  role: 'EMPLOYEE_CUST',਍  搀攀瀀愀爀琀洀攀渀琀㨀 ✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰഀഀ
  permissions: [਍    ⼀⼀ 倀攀爀洀椀猀漀猀 戀愀猀攀 搀攀氀 攀洀瀀氀攀愀搀漀ഀഀ
    'access_assigned_tasks',਍    ✀瘀椀攀眀开挀漀洀瀀愀渀礀开搀愀琀愀✀Ⰰഀഀ
    'collaborate_with_team',਍    ✀猀甀戀洀椀琀开眀漀爀欀✀Ⰰഀഀ
    'use_basic_ai_tools',਍    ഀഀ
    // Permisos específicos de marketing਍    ✀洀愀渀愀最攀开猀漀挀椀愀氀开洀攀搀椀愀开愀挀挀漀甀渀琀猀✀Ⰰഀഀ
    'schedule_posts',਍    ✀挀爀攀愀琀攀开挀漀渀琀攀渀琀✀Ⰰഀഀ
    'edit_published_content',਍    ✀瘀椀攀眀开洀愀爀欀攀琀椀渀最开愀渀愀氀礀琀椀挀猀✀Ⰰഀഀ
    'use_ai_content_generation',਍    ✀洀愀渀愀最攀开挀漀渀琀攀渀琀开挀愀氀攀渀搀愀爀✀Ⰰഀഀ
    'track_basic_performance'਍  崀Ⰰഀഀ
  dataAccess: [਍    ✀愀猀猀椀最渀攀搀开琀愀猀欀猀⸀⨀✀Ⰰഀഀ
    'company_data.*',਍    ✀洀愀爀欀攀琀椀渀最开搀愀琀愀⸀⨀✀Ⰰഀഀ
    'social_media.*',਍    ✀挀漀渀琀攀渀琀⸀⨀✀ഀഀ
  ]਍紀㬀ഀഀ
```਍ഀഀ
### **ADVISOR_CUST + MARKETING**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
const MARKETING_ADVISOR = {਍  爀漀氀攀㨀 ✀䄀䐀嘀䤀匀伀刀开䌀唀匀吀✀Ⰰഀഀ
  department: 'MARKETING',਍  瀀攀爀洀椀猀猀椀漀渀猀㨀 嬀ഀഀ
    // Permisos base del asesor਍    ✀愀挀挀攀猀猀开愀猀猀椀最渀攀搀开琀愀猀欀猀✀Ⰰഀഀ
    'view_company_data',਍    ✀猀甀戀洀椀琀开爀攀瀀漀爀琀猀✀Ⰰഀഀ
    'collaborate_with_team',਍    ✀甀猀攀开愀搀瘀愀渀挀攀搀开愀椀开琀漀漀氀猀✀Ⰰഀഀ
    ਍    ⼀⼀ 倀攀爀洀椀猀漀猀 攀猀瀀攀挀昀椀挀漀猀 搀攀 洀愀爀欀攀琀椀渀最ഀഀ
    'manage_social_media_accounts',਍    ✀猀挀栀攀搀甀氀攀开瀀漀猀琀猀✀Ⰰഀഀ
    'create_content',਍    ✀攀搀椀琀开瀀甀戀氀椀猀栀攀搀开挀漀渀琀攀渀琀✀Ⰰഀഀ
    'view_marketing_analytics',਍    ✀甀猀攀开愀椀开挀漀渀琀攀渀琀开最攀渀攀爀愀琀椀漀渀✀Ⰰഀഀ
    'manage_content_calendar',਍    ✀琀爀愀挀欀开愀搀瘀愀渀挀攀搀开瀀攀爀昀漀爀洀愀渀挀攀✀Ⰰഀഀ
    'generate_strategic_reports',਍    ✀瀀爀漀瘀椀搀攀开洀愀爀欀攀琀椀渀最开挀漀渀猀甀氀琀椀渀最✀Ⰰഀഀ
    'create_marketing_strategies',਍    ✀漀瀀琀椀洀椀稀攀开挀愀洀瀀愀椀最渀猀✀Ⰰഀഀ
    'analyze_competitor_data'਍  崀Ⰰഀഀ
  dataAccess: [਍    ✀愀猀猀椀最渀攀搀开琀愀猀欀猀⸀⨀✀Ⰰഀഀ
    'company_data.*',਍    ✀洀愀爀欀攀琀椀渀最开搀愀琀愀⸀⨀✀Ⰰഀഀ
    'social_media.*',਍    ✀挀漀渀琀攀渀琀⸀⨀✀Ⰰഀഀ
    'analytics.*',਍    ✀猀琀爀愀琀攀最椀挀开爀攀瀀漀爀琀猀⸀⨀✀ഀഀ
  ]਍紀㬀ഀഀ
```਍ഀഀ
---਍ഀഀ
## 🔄 Usuarios Multi-Departamento਍ഀഀ
### **Estructura de Usuario Multi-Departamento**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
const multiDepartmentUser = {਍  椀搀㨀 ✀甀猀攀爀ⴀ㄀㈀㌀✀Ⰰഀഀ
  name: 'María González',਍  攀洀愀椀氀㨀 ✀洀愀爀椀愀䀀攀洀瀀爀攀猀愀⸀挀漀洀✀Ⰰഀഀ
  role: 'EMPLOYEE_CUST',਍  瀀爀椀洀愀爀礀䐀攀瀀愀爀琀洀攀渀琀㨀 ✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰഀഀ
  secondaryDepartments: ['SALES', 'CUSTOMER_SERVICE'],਍  瀀攀爀洀椀猀猀椀漀渀猀㨀 笀ഀഀ
    MARKETING: [਍      ✀洀愀渀愀最攀开猀漀挀椀愀氀开洀攀搀椀愀开愀挀挀漀甀渀琀猀✀Ⰰഀഀ
      'create_content',਍      ✀瘀椀攀眀开洀愀爀欀攀琀椀渀最开愀渀愀氀礀琀椀挀猀✀ഀഀ
    ],਍    匀䄀䰀䔀匀㨀 嬀ഀഀ
      'view_sales_reports',਍      ✀洀愀渀愀最攀开氀攀愀搀猀✀Ⰰഀഀ
      'track_opportunities'਍    崀Ⰰഀഀ
    CUSTOMER_SERVICE: [਍      ✀瘀椀攀眀开挀甀猀琀漀洀攀爀开琀椀挀欀攀琀猀✀Ⰰഀഀ
      'respond_to_inquiries',਍      ✀愀挀挀攀猀猀开欀渀漀眀氀攀搀最攀开戀愀猀攀✀ഀഀ
    ]਍  紀Ⰰഀഀ
  dataAccess: {਍    䴀䄀刀䬀䔀吀䤀一䜀㨀 嬀✀洀愀爀欀攀琀椀渀最开搀愀琀愀⸀⨀✀Ⰰ ✀猀漀挀椀愀氀开洀攀搀椀愀⸀⨀✀崀Ⰰഀഀ
    SALES: ['sales_data.*', 'leads.*'],਍    䌀唀匀吀伀䴀䔀刀开匀䔀刀嘀䤀䌀䔀㨀 嬀✀挀甀猀琀漀洀攀爀开搀愀琀愀⸀⨀✀Ⰰ ✀琀椀挀欀攀琀猀⸀⨀✀崀ഀഀ
  }਍紀㬀ഀഀ
```਍ഀഀ
### **Validaciones Multi-Departamento**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
const validateMultiDepartment = {਍  挀栀攀挀欀䐀攀瀀愀爀琀洀攀渀琀䰀椀洀椀琀㨀 ⠀甀猀攀爀䤀搀㨀 猀琀爀椀渀最Ⰰ 渀攀眀䐀攀瀀愀爀琀洀攀渀琀㨀 猀琀爀椀渀最⤀ 㴀㸀 笀ഀഀ
    // Validar que no exceda el límite de departamentos por usuario਍  紀Ⰰഀഀ
  ਍  挀栀攀挀欀唀猀攀爀䰀椀洀椀琀㨀 ⠀搀攀瀀愀爀琀洀攀渀琀㨀 猀琀爀椀渀最⤀ 㴀㸀 笀ഀഀ
    // Validar que no exceda el límite de usuarios por departamento਍  紀Ⰰഀഀ
  ਍  洀攀爀最攀倀攀爀洀椀猀猀椀漀渀猀㨀 ⠀甀猀攀爀䐀攀瀀愀爀琀洀攀渀琀猀㨀 猀琀爀椀渀最嬀崀⤀ 㴀㸀 笀ഀഀ
    // Combinar permisos de múltiples departamentos਍  紀Ⰰഀഀ
  ਍  爀攀猀漀氀瘀攀䌀漀渀昀氀椀挀琀猀㨀 ⠀瀀攀爀洀椀猀猀椀漀渀猀㨀 猀琀爀椀渀最嬀崀⤀ 㴀㸀 笀ഀഀ
    // Resolver conflictos de permisos entre departamentos਍  紀ഀഀ
};਍怀怀怀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ 㴀쯘⃜䌀愀猀漀猀 搀攀 唀猀漀 䐀攀琀愀氀氀愀搀漀猀ഀഀ
਍⌀⌀⌀ ⨀⨀䌀愀猀漀 搀攀 唀猀漀 ㄀㨀 匀琀愀爀琀甀瀀 吀攀挀渀漀氀最椀挀愀 ⠀倀氀愀渀 匀琀愀爀琀攀爀⤀⨀⨀ഀഀ
```typescript਍挀漀渀猀琀 猀琀愀爀琀甀瀀䌀愀猀攀 㴀 笀ഀഀ
  company: 'TechStartup Inc.',਍  瀀氀愀渀㨀 ✀匀吀䄀刀吀䔀刀✀Ⰰഀഀ
  size: '5 empleados',਍  搀攀瀀愀爀琀洀攀渀琀猀㨀 笀ഀഀ
    MARKETING: {਍      攀洀瀀氀漀礀攀攀猀㨀 嬀ഀഀ
        {਍          渀愀洀攀㨀 ✀䄀渀愀 䜀愀爀挀愀✀Ⰰഀഀ
          role: 'EMPLOYEE_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀䴀愀爀欀攀琀椀渀最 䴀愀渀愀最攀爀✀Ⰰഀഀ
          responsibilities: 'Gestión completa de marketing',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰ ✀匀䄀䰀䔀匀✀崀 ⼀⼀ Ԁ‧䴀甀氀琀椀ⴀ搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
        },਍        笀ഀഀ
          name: 'Carlos López',਍          爀漀氀攀㨀 ✀䔀䴀倀䰀伀夀䔀䔀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Content Creator',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀䌀爀攀愀挀椀渀 搀攀 挀漀渀琀攀渀椀搀漀✀Ⰰഀഀ
          departments: ['MARKETING'] // Solo marketing਍        紀ഀഀ
      ],਍      愀搀瘀椀猀漀爀猀㨀 嬀ഀഀ
        {਍          渀愀洀攀㨀 ✀䴀愀爀愀 䌀漀渀猀甀氀琀漀爀愀✀Ⰰഀഀ
          role: 'ADVISOR_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀䌀漀渀猀甀氀琀漀爀愀 搀攀 䴀愀爀欀攀琀椀渀最 䐀椀最椀琀愀氀✀Ⰰഀഀ
          responsibilities: 'Estrategia mensual',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰ ✀匀䄀䰀䔀匀✀崀 ⼀⼀ Ԁ‧䴀甀氀琀椀ⴀ搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
        }਍      崀ഀഀ
    },਍    䘀䤀一䄀一䌀䔀㨀 笀ഀഀ
      employees: [਍        笀ഀഀ
          name: 'Luis Contador',਍          爀漀氀攀㨀 ✀䔀䴀倀䰀伀夀䔀䔀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Contador',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀䜀攀猀琀椀渀 昀椀渀愀渀挀椀攀爀愀 戀猀椀挀愀✀Ⰰഀഀ
          departments: ['FINANCE', 'HR'] // ✅ Multi-departamento਍        紀ഀഀ
      ],਍      愀搀瘀椀猀漀爀猀㨀 嬀崀ഀഀ
    }਍  紀Ⰰഀഀ
  scenario: 'Startup que necesita presencia en redes sociales y gestión financiera básica'਍紀㬀ഀഀ
```਍ഀഀ
### **Caso de Uso 2: Empresa Mediana (Plan Professional)**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
const mediumCompanyCase = {਍  挀漀洀瀀愀渀礀㨀 ✀刀攀猀琀愀甀爀愀渀琀䌀栀愀椀渀 匀⸀䄀⸀✀Ⰰഀഀ
  plan: 'PROFESSIONAL',਍  猀椀稀攀㨀 ✀㄀㔀 攀洀瀀氀攀愀搀漀猀✀Ⰰഀഀ
  departments: {਍    䴀䄀刀䬀䔀吀䤀一䜀㨀 笀ഀഀ
      employees: [਍        笀ഀഀ
          name: 'Sofia Marketing',਍          爀漀氀攀㨀 ✀䔀䴀倀䰀伀夀䔀䔀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Marketing Director',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀䐀椀爀攀挀挀椀渀 搀攀 洀愀爀欀攀琀椀渀最✀Ⰰഀഀ
          departments: ['MARKETING', 'SALES', 'CUSTOMER_SERVICE'] // ✅ 3 departamentos਍        紀Ⰰഀഀ
        {਍          渀愀洀攀㨀 ✀刀漀戀攀爀琀漀 匀漀挀椀愀氀✀Ⰰഀഀ
          role: 'EMPLOYEE_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀匀漀挀椀愀氀 䴀攀搀椀愀 䴀愀渀愀最攀爀✀Ⰰഀഀ
          responsibilities: 'Gestión de redes sociales',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰ ✀䌀唀匀吀伀䴀䔀刀开匀䔀刀嘀䤀䌀䔀✀崀 ⼀⼀ Ԁ‧㈀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
        },਍        笀ഀഀ
          name: 'Elena Content',਍          爀漀氀攀㨀 ✀䔀䴀倀䰀伀夀䔀䔀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Content Manager',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀䜀攀猀琀椀渀 搀攀 挀漀渀琀攀渀椀搀漀✀Ⰰഀഀ
          departments: ['MARKETING'] // Solo marketing਍        紀ഀഀ
      ],਍      愀搀瘀椀猀漀爀猀㨀 嬀ഀഀ
        {਍          渀愀洀攀㨀 ✀䐀爀⸀ 䌀愀爀氀漀猀 匀琀爀愀琀攀最礀✀Ⰰഀഀ
          role: 'ADVISOR_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀䌀漀渀猀甀氀琀漀爀 䔀猀琀爀愀琀最椀挀漀✀Ⰰഀഀ
          responsibilities: 'Estrategia de marca',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰ ✀匀䄀䰀䔀匀✀崀 ⼀⼀ Ԁ‧䴀甀氀琀椀ⴀ搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
        },਍        笀ഀഀ
          name: 'Laura Analytics',਍          爀漀氀攀㨀 ✀䄀䐀嘀䤀匀伀刀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Analista de Marketing',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀䄀渀氀椀猀椀猀 搀攀 瀀攀爀昀漀爀洀愀渀挀攀✀Ⰰഀഀ
          departments: ['MARKETING'] // Solo marketing਍        紀ഀഀ
      ]਍    紀Ⰰഀഀ
    HR: {਍      攀洀瀀氀漀礀攀攀猀㨀 嬀ഀഀ
        {਍          渀愀洀攀㨀 ✀倀愀琀爀椀挀椀愀 䠀刀✀Ⰰഀഀ
          role: 'EMPLOYEE_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀䠀刀 䴀愀渀愀最攀爀✀Ⰰഀഀ
          responsibilities: 'Gestión de RRHH',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀䠀刀✀Ⰰ ✀䘀䤀一䄀一䌀䔀✀崀 ⼀⼀ Ԁ‧䴀甀氀琀椀ⴀ搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
        }਍      崀Ⰰഀഀ
      advisors: [਍        笀ഀഀ
          name: 'Dr. Miguel Legal',਍          爀漀氀攀㨀 ✀䄀䐀嘀䤀匀伀刀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Consultor Legal',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀䌀漀洀瀀氀椀愀渀挀攀 氀愀戀漀爀愀氀✀Ⰰഀഀ
          departments: ['HR', 'LEGAL'] // ✅ Multi-departamento਍        紀ഀഀ
      ]਍    紀ഀഀ
  },਍  猀挀攀渀愀爀椀漀㨀 ✀䌀愀搀攀渀愀 搀攀 爀攀猀琀愀甀爀愀渀琀攀猀 焀甀攀 渀攀挀攀猀椀琀愀 洀愀爀欀攀琀椀渀最 搀椀最椀琀愀氀 礀 最攀猀琀椀渀 搀攀 瀀攀爀猀漀渀愀氀✀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀䌀愀猀漀 搀攀 唀猀漀 ㌀㨀 䔀洀瀀爀攀猀愀 䜀爀愀渀搀攀 ⠀倀氀愀渀 䔀渀琀攀爀瀀爀椀猀攀⤀⨀⨀ഀഀ
```typescript਍挀漀渀猀琀 氀愀爀最攀䌀漀洀瀀愀渀礀䌀愀猀攀 㴀 笀ഀഀ
  company: 'GlobalTech Corporation',਍  瀀氀愀渀㨀 ✀䔀一吀䔀刀倀刀䤀匀䔀✀Ⰰഀഀ
  size: '50 empleados',਍  搀攀瀀愀爀琀洀攀渀琀猀㨀 笀ഀഀ
    MARKETING: {਍      攀洀瀀氀漀礀攀攀猀㨀 嬀ഀഀ
        {਍          渀愀洀攀㨀 ✀䐀椀爀攀挀琀漀爀 䴀愀爀欀攀琀椀渀最✀Ⰰഀഀ
          role: 'EMPLOYEE_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀䌀䴀伀✀Ⰰഀഀ
          responsibilities: 'Dirección estratégica',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰ ✀匀䄀䰀䔀匀✀Ⰰ ✀䌀唀匀吀伀䴀䔀刀开匀䔀刀嘀䤀䌀䔀✀Ⰰ ✀伀倀䔀刀䄀吀䤀伀一匀✀崀 ⼀⼀ Ԁ‧㐀 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
        },਍        笀ഀഀ
          name: 'Social Media Team',਍          爀漀氀攀㨀 ✀䔀䴀倀䰀伀夀䔀䔀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Social Media Specialists',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀䜀攀猀琀椀渀 搀攀 爀攀搀攀猀 猀漀挀椀愀氀攀猀✀Ⰰഀഀ
          departments: ['MARKETING', 'CUSTOMER_SERVICE'] // ✅ 2 departamentos਍        紀Ⰰഀഀ
        {਍          渀愀洀攀㨀 ✀䌀漀渀琀攀渀琀 吀攀愀洀✀Ⰰഀഀ
          role: 'EMPLOYEE_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀䌀漀渀琀攀渀琀 䌀爀攀愀琀漀爀猀✀Ⰰഀഀ
          responsibilities: 'Creación de contenido',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰ ✀匀䄀䰀䔀匀✀崀 ⼀⼀ Ԁ‧㈀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
        }਍      崀Ⰰഀഀ
      advisors: [਍        笀ഀഀ
          name: 'Agencia Digital',਍          爀漀氀攀㨀 ✀䄀䐀嘀䤀匀伀刀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Agencia de Marketing Digital',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀䔀猀琀爀愀琀攀最椀愀 礀 攀樀攀挀甀挀椀渀✀Ⰰഀഀ
          departments: ['MARKETING', 'SALES', 'CUSTOMER_SERVICE'] // ✅ 3 departamentos਍        紀Ⰰഀഀ
        {਍          渀愀洀攀㨀 ✀䌀漀渀猀甀氀琀漀爀 䤀䄀✀Ⰰഀഀ
          role: 'ADVISOR_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀䌀漀渀猀甀氀琀漀爀 搀攀 䤀䄀✀Ⰰഀഀ
          responsibilities: 'Optimización con IA',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀䴀䄀刀䬀䔀吀䤀一䜀✀Ⰰ ✀䤀吀✀崀 ⼀⼀ Ԁ‧㈀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
        }਍      崀ഀഀ
    },਍    匀䄀䰀䔀匀㨀 笀ഀഀ
      employees: [਍        笀ഀഀ
          name: 'Sales Team',਍          爀漀氀攀㨀 ✀䔀䴀倀䰀伀夀䔀䔀开䌀唀匀吀✀Ⰰഀഀ
          position: 'Sales Representatives',਍          爀攀猀瀀漀渀猀椀戀椀氀椀琀椀攀猀㨀 ✀嘀攀渀琀愀猀 搀椀爀攀挀琀愀猀✀Ⰰഀഀ
          departments: ['SALES', 'CUSTOMER_SERVICE'] // ✅ 2 departamentos਍        紀ഀഀ
      ],਍      愀搀瘀椀猀漀爀猀㨀 嬀ഀഀ
        {਍          渀愀洀攀㨀 ✀䌀漀渀猀甀氀琀漀爀 嘀攀渀琀愀猀✀Ⰰഀഀ
          role: 'ADVISOR_CUST',਍          瀀漀猀椀琀椀漀渀㨀 ✀䌀漀渀猀甀氀琀漀爀 搀攀 嘀攀渀琀愀猀✀Ⰰഀഀ
          responsibilities: 'Optimización de ventas',਍          搀攀瀀愀爀琀洀攀渀琀猀㨀 嬀✀匀䄀䰀䔀匀✀Ⰰ ✀䴀䄀刀䬀䔀吀䤀一䜀✀崀 ⼀⼀ Ԁ‧㈀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
        }਍      崀ഀഀ
    }਍  紀Ⰰഀഀ
  scenario: 'Empresa global que necesita marketing digital avanzado y ventas optimizadas'਍紀㬀ഀഀ
```਍ഀഀ
---਍ഀഀ
## ❓ FAQs (Preguntas Frecuentes) - EXPANDIDAS਍ഀഀ
### **FAQ 1: ¿Puedo cambiar de plan en cualquier momento?**਍⨀⨀刀㨀⨀⨀ 匀Ⰰ 瀀甀攀搀攀猀 挀愀洀戀椀愀爀 搀攀 瀀氀愀渀 攀渀 挀甀愀氀焀甀椀攀爀 洀漀洀攀渀琀漀⸀ 䰀漀猀 挀愀洀戀椀漀猀 猀攀 愀瀀氀椀挀愀渀 愀氀 猀椀最甀椀攀渀琀攀 挀椀挀氀漀 搀攀 昀愀挀琀甀爀愀挀椀渀⸀ 䰀漀猀 甀猀甀愀爀椀漀猀 攀砀椀猀琀攀渀琀攀猀 洀愀渀琀椀攀渀攀渀 猀甀猀 搀愀琀漀猀 礀 挀漀渀昀椀最甀爀愀挀椀漀渀攀猀⸀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀愀 猀琀愀爀琀甀瀀 焀甀攀 挀爀攀挀攀 搀攀 㔀 愀 ㄀㔀 攀洀瀀氀攀愀搀漀猀 瀀甀攀搀攀 愀挀琀甀愀氀椀稀愀爀 搀攀 匀琀愀爀琀攀爀 愀 倀爀漀昀攀猀猀椀漀渀愀氀 猀椀渀 瀀攀爀搀攀爀 搀愀琀漀猀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 ㈀㨀 뼀儀甀 瀀愀猀愀 猀椀 攀砀挀攀搀漀 攀氀 氀洀椀琀攀 搀攀 攀洀瀀氀攀愀搀漀猀 漀 愀猀攀猀漀爀攀猀㼀⨀⨀ഀഀ
**R:** El sistema te notificará cuando te acerques al límite. Puedes:਍ⴀ 䄀挀琀甀愀氀椀稀愀爀 愀 甀渀 瀀氀愀渀 猀甀瀀攀爀椀漀爀ഀഀ
- Reducir el número de usuarios਍ⴀ 䌀漀渀琀愀挀琀愀爀 猀漀瀀漀爀琀攀 瀀愀爀愀 氀洀椀琀攀猀 瀀攀爀猀漀渀愀氀椀稀愀搀漀猀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀愀 攀洀瀀爀攀猀愀 挀漀渀 ㄀㐀 攀洀瀀氀攀愀搀漀猀 攀渀 倀爀漀昀攀猀猀椀漀渀愀氀 爀攀挀椀戀攀 渀漀琀椀昀椀挀愀挀椀渀 挀甀愀渀搀漀 椀渀琀攀渀琀愀 愀最爀攀最愀爀 攀氀 攀洀瀀氀攀愀搀漀 ⌀㄀㘀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 ㌀㨀 뼀䰀漀猀 愀猀攀猀漀爀攀猀 攀砀琀攀爀渀漀猀 琀椀攀渀攀渀 愀挀挀攀猀漀 氀椀洀椀琀愀搀漀㼀⨀⨀ഀഀ
**R:** Los asesores tienen acceso específico a:਍ⴀ 䐀愀琀漀猀 搀攀 猀甀 搀攀瀀愀爀琀愀洀攀渀琀漀 愀猀椀最渀愀搀漀ഀഀ
- Herramientas de consultoría਍ⴀ 刀攀瀀漀爀琀攀猀 礀 愀渀愀氀礀琀椀挀猀ഀഀ
- Colaboración con el equipo interno਍ഀഀ
**Caso Real:** Un consultor de marketing puede ver analytics de marketing pero no datos financieros.਍ഀഀ
### **FAQ 4: ¿Puedo tener diferentes departamentos en diferentes planes?**਍⨀⨀刀㨀⨀⨀ 一漀Ⰰ 攀氀 瀀氀愀渀 猀攀 愀瀀氀椀挀愀 愀 琀漀搀愀 氀愀 攀洀瀀爀攀猀愀⸀ 匀椀渀 攀洀戀愀爀最漀Ⰰ 瀀甀攀搀攀猀 挀漀渀昀椀最甀爀愀爀 瀀攀爀洀椀猀漀猀 最爀愀渀甀氀愀爀攀猀 瀀漀爀 搀攀瀀愀爀琀愀洀攀渀琀漀 搀攀渀琀爀漀 搀攀氀 瀀氀愀渀⸀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 䔀渀 䔀渀琀攀爀瀀爀椀猀攀Ⰰ 瀀甀攀搀攀猀 琀攀渀攀爀 ㄀　 攀洀瀀氀攀愀搀漀猀 攀渀 䴀愀爀欀攀琀椀渀最 瀀攀爀漀 猀漀氀漀 㔀 攀渀 䘀椀渀愀渀稀愀猀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 㔀㨀 뼀䌀洀漀 昀甀渀挀椀漀渀愀 氀愀 昀愀挀琀甀爀愀挀椀渀 瀀漀爀 愀猀攀猀漀爀攀猀㼀⨀⨀ഀഀ
**R:** Los asesores se facturan por separado del plan base. Cada asesor tiene un costo adicional mensual según su especialización.਍ഀഀ
**Caso Real:** Plan Professional ($99) + 2 asesores ($50 cada uno) = $199/mes total.਍ഀഀ
### **FAQ 6: ¿Puedo personalizar los permisos por usuario?**਍⨀⨀刀㨀⨀⨀ 匀Ⰰ 瀀甀攀搀攀猀 瀀攀爀猀漀渀愀氀椀稀愀爀 瀀攀爀洀椀猀漀猀 椀渀搀椀瘀椀搀甀愀氀攀猀 洀愀渀琀攀渀椀攀渀搀漀 氀愀 攀猀琀爀甀挀琀甀爀愀 戀愀猀攀 搀攀 爀漀氀 ⬀ 搀攀瀀愀爀琀愀洀攀渀琀漀⸀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀 攀洀瀀氀攀愀搀漀 搀攀 洀愀爀欀攀琀椀渀最 瀀甀攀搀攀 琀攀渀攀爀 愀挀挀攀猀漀 愀 愀渀愀氀礀琀椀挀猀 愀瘀愀渀稀愀搀漀猀 洀椀攀渀琀爀愀猀 漀琀爀漀 猀漀氀漀 琀椀攀渀攀 愀挀挀攀猀漀 戀猀椀挀漀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 㜀㨀 뼀儀甀 椀渀挀氀甀礀攀 攀氀 愀氀洀愀挀攀渀愀洀椀攀渀琀漀㼀⨀⨀ഀഀ
**R:** El almacenamiento incluye:਍ⴀ 䄀爀挀栀椀瘀漀猀 搀攀 挀漀渀琀攀渀椀搀漀ഀഀ
- Documentos de marketing਍ⴀ 刀攀瀀漀爀琀攀猀 礀 愀渀愀氀礀琀椀挀猀ഀഀ
- Assets multimedia਍ഀഀ
**Caso Real:** 10GB en Starter permite ~1000 imágenes de alta calidad o 100 videos cortos.਍ഀഀ
### **FAQ 8: ¿Los límites de IA son por empresa o por usuario?**਍⨀⨀刀㨀⨀⨀ 䰀漀猀 氀洀椀琀攀猀 搀攀 䤀䄀 猀漀渀 瀀漀爀 攀洀瀀爀攀猀愀⸀ 匀攀 搀椀猀琀爀椀戀甀礀攀渀 愀甀琀漀洀琀椀挀愀洀攀渀琀攀 攀渀琀爀攀 琀漀搀漀猀 氀漀猀 甀猀甀愀爀椀漀猀 猀攀最切渀 猀甀 甀猀漀⸀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ ㄀　　 爀攀焀甀攀猀琀猀⼀洀攀猀 攀渀 匀琀愀爀琀攀爀 猀攀 搀椀猀琀爀椀戀甀礀攀渀 攀渀琀爀攀 琀漀搀漀猀 氀漀猀 甀猀甀愀爀椀漀猀 搀攀 氀愀 攀洀瀀爀攀猀愀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 㤀㨀 뼀倀甀攀搀攀 甀渀 甀猀甀愀爀椀漀 瀀攀爀琀攀渀攀挀攀爀 愀 洀切氀琀椀瀀氀攀猀 搀攀瀀愀爀琀愀洀攀渀琀漀猀㼀⨀⨀ Ԁ‧一唀䔀嘀䄀ഀഀ
**R:** Sí, un usuario puede pertenecer a múltiples departamentos según el plan:਍ⴀ ⨀⨀匀琀愀爀琀攀爀㨀⨀⨀ 䴀砀椀洀漀 ㈀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀 瀀漀爀 甀猀甀愀爀椀漀ഀഀ
- **Professional:** Máximo 3 departamentos por usuario  ਍ⴀ ⨀⨀䔀渀琀攀爀瀀爀椀猀攀㨀⨀⨀ 䴀砀椀洀漀 㔀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 瀀漀爀 甀猀甀愀爀椀漀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀 䴀愀爀欀攀琀椀渀最 䴀愀渀愀最攀爀 瀀甀攀搀攀 琀爀愀戀愀樀愀爀 攀渀 䴀愀爀欀攀琀椀渀最Ⰰ 匀愀氀攀猀 礀 䌀甀猀琀漀洀攀爀 匀攀爀瘀椀挀攀 猀椀洀甀氀琀渀攀愀洀攀渀琀攀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 ㄀　㨀 뼀䌀洀漀 猀攀 洀愀渀攀樀愀渀 氀漀猀 瀀攀爀洀椀猀漀猀 挀甀愀渀搀漀 甀渀 甀猀甀愀爀椀漀 攀猀琀 攀渀 洀切氀琀椀瀀氀攀猀 搀攀瀀愀爀琀愀洀攀渀琀漀猀㼀⨀⨀ Ԁ‧一唀䔀嘀䄀ഀഀ
**R:** Los permisos se combinan de la siguiente manera:਍ⴀ ⨀⨀唀渀椀渀 搀攀 瀀攀爀洀椀猀漀猀㨀⨀⨀ 䔀氀 甀猀甀愀爀椀漀 琀椀攀渀攀 愀挀挀攀猀漀 愀 琀漀搀愀猀 氀愀猀 昀甀渀挀椀漀渀愀氀椀搀愀搀攀猀 搀攀 琀漀搀漀猀 猀甀猀 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
- **Jerarquía:** Los permisos más restrictivos tienen prioridad਍ⴀ ⨀⨀䌀漀渀昀氀椀挀琀漀㨀⨀⨀ 䔀渀 挀愀猀漀 搀攀 挀漀渀昀氀椀挀琀漀Ⰰ 猀攀 愀瀀氀椀挀愀 攀氀 瀀攀爀洀椀猀漀 洀猀 瀀攀爀洀椀猀椀瘀漀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀 甀猀甀愀爀椀漀 攀渀 䴀愀爀欀攀琀椀渀最 ⬀ 匀愀氀攀猀 瀀甀攀搀攀 挀爀攀愀爀 挀漀渀琀攀渀椀搀漀 礀 最攀猀琀椀漀渀愀爀 氀攀愀搀猀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 ㄀㄀㨀 뼀䠀愀礀 氀洀椀琀攀猀 攀渀 攀氀 渀切洀攀爀漀 搀攀 甀猀甀愀爀椀漀猀 瀀漀爀 搀攀瀀愀爀琀愀洀攀渀琀漀㼀⨀⨀ Ԁ‧一唀䔀嘀䄀ഀഀ
**R:** Sí, cada plan tiene límites específicos:਍ⴀ ⨀⨀匀琀愀爀琀攀爀㨀⨀⨀ 䴀砀椀洀漀 ㌀ 甀猀甀愀爀椀漀猀 瀀漀爀 搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
- **Professional:** Máximo 8 usuarios por departamento਍ⴀ ⨀⨀䔀渀琀攀爀瀀爀椀猀攀㨀⨀⨀ 䴀砀椀洀漀 ㄀㔀 甀猀甀愀爀椀漀猀 瀀漀爀 搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 䔀渀 倀爀漀昀攀猀猀椀漀渀愀氀Ⰰ 攀氀 搀攀瀀愀爀琀愀洀攀渀琀漀 搀攀 䴀愀爀欀攀琀椀渀最 瀀甀攀搀攀 琀攀渀攀爀 栀愀猀琀愀 㠀 甀猀甀愀爀椀漀猀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 ㄀㈀㨀 뼀儀甀 瀀愀猀愀 猀椀 甀渀 甀猀甀愀爀椀漀 渀攀挀攀猀椀琀愀 愀挀挀攀猀漀 愀 洀猀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 搀攀 氀漀猀 瀀攀爀洀椀琀椀搀漀猀㼀⨀⨀ Ԁ‧一唀䔀嘀䄀ഀഀ
**R:** Puedes:਍ⴀ 䄀挀琀甀愀氀椀稀愀爀 愀 甀渀 瀀氀愀渀 猀甀瀀攀爀椀漀爀ഀഀ
- Reorganizar la estructura de departamentos਍ⴀ 匀漀氀椀挀椀琀愀爀 氀洀椀琀攀猀 瀀攀爀猀漀渀愀氀椀稀愀搀漀猀 瀀愀爀愀 挀愀猀漀猀 攀猀瀀攀挀椀愀氀攀猀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀 䌀䔀伀 攀渀 匀琀愀爀琀攀爀 焀甀攀 渀攀挀攀猀椀琀愀 愀挀挀攀猀漀 愀 㐀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 搀攀戀攀 愀挀琀甀愀氀椀稀愀爀 愀 倀爀漀昀攀猀猀椀漀渀愀氀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 ㄀㌀㨀 뼀䰀漀猀 愀猀攀猀漀爀攀猀 琀愀洀戀椀渀 瀀甀攀搀攀渀 攀猀琀愀爀 攀渀 洀切氀琀椀瀀氀攀猀 搀攀瀀愀爀琀愀洀攀渀琀漀猀㼀⨀⨀ Ԁ‧一唀䔀嘀䄀ഀഀ
**R:** Sí, los asesores siguen las mismas reglas que los empleados:਍ⴀ 䴀椀猀洀漀猀 氀洀椀琀攀猀 搀攀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 瀀漀爀 甀猀甀愀爀椀漀ഀഀ
- Permisos específicos de consultoría por departamento਍ⴀ 䘀愀挀琀甀爀愀挀椀渀 愀搀椀挀椀漀渀愀氀 瀀漀爀 搀攀瀀愀爀琀愀洀攀渀琀漀 愀搀椀挀椀漀渀愀氀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀 挀漀渀猀甀氀琀漀爀 瀀甀攀搀攀 愀猀攀猀漀爀愀爀 攀渀 䴀愀爀欀攀琀椀渀最 礀 匀愀氀攀猀 瀀漀爀 甀渀 挀漀猀琀漀 愀搀椀挀椀漀渀愀氀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 ㄀㐀㨀 뼀䌀洀漀 猀攀 挀愀氀挀甀氀愀 攀氀 甀猀漀 搀攀 䤀䄀 挀甀愀渀搀漀 甀渀 甀猀甀愀爀椀漀 攀猀琀 攀渀 洀切氀琀椀瀀氀攀猀 搀攀瀀愀爀琀愀洀攀渀琀漀猀㼀⨀⨀ Ԁ‧一唀䔀嘀䄀ഀഀ
**R:** El uso de IA se calcula por usuario, no por departamento:਍ⴀ 唀渀 甀猀甀愀爀椀漀 攀渀 ㌀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀 挀甀攀渀琀愀 挀漀洀漀 ㄀ 甀猀甀愀爀椀漀 瀀愀爀愀 氀洀椀琀攀猀 搀攀 䤀䄀ഀഀ
- El uso se distribuye entre todos sus departamentos਍ⴀ 䰀漀猀 爀攀焀甀攀猀琀猀 猀攀 猀甀洀愀渀 椀渀搀攀瀀攀渀搀椀攀渀琀攀洀攀渀琀攀 搀攀氀 搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀 甀猀甀愀爀椀漀 焀甀攀 最攀渀攀爀愀 挀漀渀琀攀渀椀搀漀 瀀愀爀愀 䴀愀爀欀攀琀椀渀最 礀 匀愀氀攀猀 挀甀攀渀琀愀 猀甀猀 爀攀焀甀攀猀琀猀 搀攀 䤀䄀 甀渀愀 猀漀氀愀 瘀攀稀⸀ഀഀ
਍⌀⌀⌀ ⨀⨀䘀䄀儀 ㄀㔀㨀 뼀倀甀攀搀漀 琀爀愀渀猀昀攀爀椀爀 甀猀甀愀爀椀漀猀 攀渀琀爀攀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 猀椀渀 瀀攀爀搀攀爀 搀愀琀漀猀㼀⨀⨀ Ԁ‧一唀䔀嘀䄀ഀഀ
**R:** Sí, puedes transferir usuarios entre departamentos:਍ⴀ 䰀漀猀 搀愀琀漀猀 栀椀猀琀爀椀挀漀猀 猀攀 洀愀渀琀椀攀渀攀渀ഀഀ
- Los permisos se actualizan automáticamente਍ⴀ 匀攀 渀漀琀椀昀椀挀愀 愀氀 甀猀甀愀爀椀漀 搀攀氀 挀愀洀戀椀漀ഀഀ
਍⨀⨀䌀愀猀漀 刀攀愀氀㨀⨀⨀ 唀渀 䌀漀渀琀攀渀琀 䌀爀攀愀琀漀爀 焀甀攀 猀攀 洀甀攀瘀攀 搀攀 䴀愀爀欀攀琀椀渀最 愀 匀愀氀攀猀 洀愀渀琀椀攀渀攀 琀漀搀漀 猀甀 栀椀猀琀漀爀椀愀氀 搀攀 挀漀渀琀攀渀椀搀漀⸀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ 㴀⟘⃝䔀猀瀀攀挀椀昀椀挀愀挀椀漀渀攀猀 吀挀渀椀挀愀猀ഀഀ
਍⌀⌀⌀ ⨀⨀䈀愀猀攀 搀攀 䐀愀琀漀猀㨀 䔀猀焀甀攀洀愀 搀攀 倀氀愀渀攀猀 ⠀䄀挀琀甀愀氀椀稀愀搀漀⤀⨀⨀ഀഀ
```sql਍ⴀⴀ 吀愀戀氀愀 搀攀 瀀氀愀渀攀猀 ⠀愀挀琀甀愀氀椀稀愀搀愀⤀ഀഀ
CREATE TABLE plans (਍  椀搀 唀唀䤀䐀 倀刀䤀䴀䄀刀夀 䬀䔀夀Ⰰഀഀ
  name VARCHAR(50) NOT NULL,਍  瀀爀椀挀攀 䐀䔀䌀䤀䴀䄀䰀⠀㄀　Ⰰ㈀⤀ 一伀吀 一唀䰀䰀Ⰰഀഀ
  max_employees INTEGER NOT NULL,਍  洀愀砀开愀搀瘀椀猀漀爀猀 䤀一吀䔀䜀䔀刀 一伀吀 一唀䰀䰀Ⰰഀഀ
  ai_requests_limit INTEGER NOT NULL,਍  猀琀漀爀愀最攀开氀椀洀椀琀开最戀 䤀一吀䔀䜀䔀刀 一伀吀 一唀䰀䰀Ⰰഀഀ
  max_departments_per_user INTEGER NOT NULL, -- ✅ NUEVO਍  洀愀砀开甀猀攀爀猀开瀀攀爀开搀攀瀀愀爀琀洀攀渀琀 䤀一吀䔀䜀䔀刀 一伀吀 一唀䰀䰀Ⰰ ⴀⴀ Ԁ‧一唀䔀嘀伀ഀഀ
  created_at TIMESTAMP DEFAULT NOW()਍⤀㬀ഀഀ
਍ⴀⴀ 吀愀戀氀愀 搀攀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 瀀漀爀 瀀氀愀渀ഀഀ
CREATE TABLE plan_departments (਍  椀搀 唀唀䤀䐀 倀刀䤀䴀䄀刀夀 䬀䔀夀Ⰰഀഀ
  plan_id UUID REFERENCES plans(id),਍  搀攀瀀愀爀琀洀攀渀琀开挀漀搀攀 嘀䄀刀䌀䠀䄀刀⠀㈀　⤀ 一伀吀 一唀䰀䰀Ⰰഀഀ
  max_employees INTEGER NOT NULL,਍  洀愀砀开愀搀瘀椀猀漀爀猀 䤀一吀䔀䜀䔀刀 一伀吀 一唀䰀䰀Ⰰഀഀ
  features JSONB NOT NULL,਍  挀爀攀愀琀攀搀开愀琀 吀䤀䴀䔀匀吀䄀䴀倀 䐀䔀䘀䄀唀䰀吀 一伀圀⠀⤀ഀഀ
);਍ഀഀ
-- Tabla de usuarios con rol y departamento (actualizada)਍䌀刀䔀䄀吀䔀 吀䄀䈀䰀䔀 甀猀攀爀猀 ⠀ഀഀ
  id UUID PRIMARY KEY,਍  挀漀洀瀀愀渀礀开椀搀 唀唀䤀䐀 一伀吀 一唀䰀䰀Ⰰഀഀ
  role VARCHAR(20) NOT NULL,਍  瀀爀椀洀愀爀礀开搀攀瀀愀爀琀洀攀渀琀 嘀䄀刀䌀䠀䄀刀⠀㈀　⤀Ⰰ ⴀⴀ Ԁ‧一唀䔀嘀伀㨀 䐀攀瀀愀爀琀愀洀攀渀琀漀 瀀爀椀渀挀椀瀀愀氀ഀഀ
  created_at TIMESTAMP DEFAULT NOW()਍⤀㬀ഀഀ
਍ⴀⴀ Ԁ‧一唀䔀嘀䄀㨀 吀愀戀氀愀 搀攀 甀猀甀愀爀椀漀猀 瀀漀爀 搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
CREATE TABLE user_departments (਍  椀搀 唀唀䤀䐀 倀刀䤀䴀䄀刀夀 䬀䔀夀Ⰰഀഀ
  user_id UUID REFERENCES users(id),਍  搀攀瀀愀爀琀洀攀渀琀开挀漀搀攀 嘀䄀刀䌀䠀䄀刀⠀㈀　⤀ 一伀吀 一唀䰀䰀Ⰰഀഀ
  is_primary BOOLEAN DEFAULT FALSE,਍  瀀攀爀洀椀猀猀椀漀渀猀 䨀匀伀一䈀 一伀吀 一唀䰀䰀Ⰰഀഀ
  created_at TIMESTAMP DEFAULT NOW(),਍  唀一䤀儀唀䔀⠀甀猀攀爀开椀搀Ⰰ 搀攀瀀愀爀琀洀攀渀琀开挀漀搀攀⤀ഀഀ
);਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀䄀倀䤀 䔀渀搀瀀漀椀渀琀猀 ⠀䄀挀琀甀愀氀椀稀愀搀漀猀⤀⨀⨀ഀഀ
```typescript਍⼀⼀ 䜀攀猀琀椀渀 搀攀 瀀氀愀渀攀猀ഀഀ
GET /api/plans                    // Listar planes disponibles਍䜀䔀吀 ⼀愀瀀椀⼀瀀氀愀渀猀⼀㨀椀搀               ⼀⼀ 伀戀琀攀渀攀爀 搀攀琀愀氀氀攀猀 搀攀氀 瀀氀愀渀ഀഀ
POST /api/companies/:id/plan     // Asignar plan a empresa਍ഀഀ
// Gestión de departamentos਍䜀䔀吀 ⼀愀瀀椀⼀搀攀瀀愀爀琀洀攀渀琀猀             ⼀⼀ 䰀椀猀琀愀爀 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
GET /api/companies/:id/departments // Departamentos de la empresa਍倀伀匀吀 ⼀愀瀀椀⼀挀漀洀瀀愀渀椀攀猀⼀㨀椀搀⼀搀攀瀀愀爀琀洀攀渀琀猀 ⼀⼀ 䌀爀攀愀爀 搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
਍⼀⼀ 䜀攀猀琀椀渀 搀攀 甀猀甀愀爀椀漀猀 ⠀愀挀琀甀愀氀椀稀愀搀愀⤀ഀഀ
GET /api/companies/:id/users     // Listar usuarios਍倀伀匀吀 ⼀愀瀀椀⼀挀漀洀瀀愀渀椀攀猀⼀㨀椀搀⼀甀猀攀爀猀    ⼀⼀ 䌀爀攀愀爀 甀猀甀愀爀椀漀ഀഀ
PUT /api/users/:id               // Actualizar usuario਍䐀䔀䰀䔀吀䔀 ⼀愀瀀椀⼀甀猀攀爀猀⼀㨀椀搀            ⼀⼀ 䔀氀椀洀椀渀愀爀 甀猀甀愀爀椀漀ഀഀ
਍⼀⼀ Ԁ‧一唀䔀嘀伀匀㨀 䜀攀猀琀椀渀 洀甀氀琀椀ⴀ搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
GET /api/users/:id/departments   // Obtener departamentos del usuario਍倀伀匀吀 ⼀愀瀀椀⼀甀猀攀爀猀⼀㨀椀搀⼀搀攀瀀愀爀琀洀攀渀琀猀  ⼀⼀ 䄀最爀攀最愀爀 搀攀瀀愀爀琀愀洀攀渀琀漀 愀氀 甀猀甀愀爀椀漀ഀഀ
DELETE /api/users/:id/departments/:dept // Remover departamento del usuario਍倀唀吀 ⼀愀瀀椀⼀甀猀攀爀猀⼀㨀椀搀⼀搀攀瀀愀爀琀洀攀渀琀猀⼀㨀搀攀瀀琀⼀瀀攀爀洀椀猀猀椀漀渀猀 ⼀⼀ 䄀挀琀甀愀氀椀稀愀爀 瀀攀爀洀椀猀漀猀 瀀漀爀 搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
```਍ഀഀ
### **Validaciones de Límites (Actualizadas)**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
const validateLimits = {਍  挀栀攀挀欀䔀洀瀀氀漀礀攀攀䰀椀洀椀琀㨀 ⠀挀漀洀瀀愀渀礀䤀搀㨀 猀琀爀椀渀最Ⰰ 搀攀瀀愀爀琀洀攀渀琀㨀 猀琀爀椀渀最⤀ 㴀㸀 笀ഀഀ
    // Validar límite de empleados por departamento਍  紀Ⰰഀഀ
  ਍  挀栀攀挀欀䄀搀瘀椀猀漀爀䰀椀洀椀琀㨀 ⠀挀漀洀瀀愀渀礀䤀搀㨀 猀琀爀椀渀最Ⰰ 搀攀瀀愀爀琀洀攀渀琀㨀 猀琀爀椀渀最⤀ 㴀㸀 笀ഀഀ
    // Validar límite de asesores por departamento਍  紀Ⰰഀഀ
  ਍  挀栀攀挀欀倀氀愀渀䰀椀洀椀琀㨀 ⠀挀漀洀瀀愀渀礀䤀搀㨀 猀琀爀椀渀最⤀ 㴀㸀 笀ഀഀ
    // Validar límites generales del plan਍  紀Ⰰഀഀ
  ਍  挀栀攀挀欀䄀䤀刀愀琀攀䰀椀洀椀琀㨀 ⠀挀漀洀瀀愀渀礀䤀搀㨀 猀琀爀椀渀最⤀ 㴀㸀 笀ഀഀ
    // Validar límite de requests de IA਍  紀Ⰰഀഀ
  ਍  ⼀⼀ Ԁ‧一唀䔀嘀䄀匀㨀 嘀愀氀椀搀愀挀椀漀渀攀猀 洀甀氀琀椀ⴀ搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
  checkDepartmentPerUserLimit: (userId: string, newDepartment: string) => {਍    ⼀⼀ 嘀愀氀椀搀愀爀 焀甀攀 渀漀 攀砀挀攀搀愀 攀氀 氀洀椀琀攀 搀攀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 瀀漀爀 甀猀甀愀爀椀漀ഀഀ
  },਍  ഀഀ
  checkUserPerDepartmentLimit: (department: string) => {਍    ⼀⼀ 嘀愀氀椀搀愀爀 焀甀攀 渀漀 攀砀挀攀搀愀 攀氀 氀洀椀琀攀 搀攀 甀猀甀愀爀椀漀猀 瀀漀爀 搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
  },਍  ഀഀ
  mergeUserPermissions: (userId: string) => {਍    ⼀⼀ 䌀漀洀戀椀渀愀爀 瀀攀爀洀椀猀漀猀 搀攀 琀漀搀漀猀 氀漀猀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 搀攀氀 甀猀甀愀爀椀漀ഀഀ
  },਍  ഀഀ
  resolvePermissionConflicts: (permissions: string[]) => {਍    ⼀⼀ 刀攀猀漀氀瘀攀爀 挀漀渀昀氀椀挀琀漀猀 搀攀 瀀攀爀洀椀猀漀猀 攀渀琀爀攀 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
  }਍紀㬀ഀഀ
```਍ഀഀ
---਍ഀഀ
## 🚀 Roadmap de Implementación਍ഀഀ
### **Fase 1: Sistema Base (2 semanas)**਍ⴀ 嬀 崀 䤀洀瀀氀攀洀攀渀琀愀爀 攀猀琀爀甀挀琀甀爀愀 搀攀 爀漀氀攀猀ഀഀ
- [ ] Implementar estructura de departamentos਍ⴀ 嬀 崀 䌀爀攀愀爀 猀椀猀琀攀洀愀 搀攀 瀀攀爀洀椀猀漀猀 最爀愀渀甀氀愀爀攀猀ഀഀ
- [ ] Configurar validaciones de límites਍ഀഀ
### **Fase 2: Planes y Límites (2 semanas)**਍ⴀ 嬀 崀 䤀洀瀀氀攀洀攀渀琀愀爀 猀椀猀琀攀洀愀 搀攀 瀀氀愀渀攀猀ഀഀ
- [ ] Configurar límites por departamento਍ⴀ 嬀 崀 䌀爀攀愀爀 猀椀猀琀攀洀愀 搀攀 昀愀挀琀甀爀愀挀椀渀ഀഀ
- [ ] Implementar notificaciones de límites਍ഀഀ
### **Fase 3: Multi-Departamento (2 semanas)** ✅ NUEVA਍ⴀ 嬀 崀 䤀洀瀀氀攀洀攀渀琀愀爀 甀猀甀愀爀椀漀猀 洀甀氀琀椀ⴀ搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
- [ ] Crear sistema de permisos combinados਍ⴀ 嬀 崀 䤀洀瀀氀攀洀攀渀琀愀爀 瘀愀氀椀搀愀挀椀漀渀攀猀 搀攀 氀洀椀琀攀猀 洀甀氀琀椀ⴀ搀攀瀀愀爀琀愀洀攀渀琀漀ഀഀ
- [ ] Crear interfaz de gestión multi-departamento਍ഀഀ
### **Fase 4: Marketing Department (3 semanas)**਍ⴀ 嬀 崀 䤀洀瀀氀攀洀攀渀琀愀爀 昀甀渀挀椀漀渀愀氀椀搀愀搀攀猀 搀攀 洀愀爀欀攀琀椀渀最ഀഀ
- [ ] Integrar con redes sociales਍ⴀ 嬀 崀 䌀爀攀愀爀 猀椀猀琀攀洀愀 搀攀 愀渀愀氀礀琀椀挀猀ഀഀ
- [ ] Implementar IA para contenido਍ഀഀ
### **Fase 5: Otros Departamentos (4 semanas)**਍ⴀ 嬀 崀 䤀洀瀀氀攀洀攀渀琀愀爀 搀攀瀀愀爀琀愀洀攀渀琀漀 搀攀 昀椀渀愀渀稀愀猀ഀഀ
- [ ] Implementar departamento de RRHH਍ⴀ 嬀 崀 䤀洀瀀氀攀洀攀渀琀愀爀 搀攀瀀愀爀琀愀洀攀渀琀漀 搀攀 瘀攀渀琀愀猀ഀഀ
- [ ] Implementar departamentos adicionales਍ഀഀ
### **Fase 6: Testing y Optimización (2 semanas)**਍ⴀ 嬀 崀 吀攀猀琀椀渀最 挀漀洀瀀氀攀琀漀 搀攀氀 猀椀猀琀攀洀愀ഀഀ
- [ ] Optimización de performance਍ⴀ 嬀 崀 䐀漀挀甀洀攀渀琀愀挀椀渀 搀攀 甀猀甀愀爀椀漀ഀഀ
- [ ] Training del equipo਍ഀഀ
---਍ഀഀ
## 📈 Métricas de Éxito਍ഀഀ
### **Técnicas**਍ⴀ ⨀⨀倀攀爀昀漀爀洀愀渀挀攀㨀⨀⨀ 䌀愀爀最愀 搀攀 甀猀甀愀爀椀漀猀 㰀 ㈀ 猀攀最甀渀搀漀猀ഀഀ
- **Escalabilidad:** Soporte para 1000+ empresas਍ⴀ ⨀⨀䐀椀猀瀀漀渀椀戀椀氀椀搀愀搀㨀⨀⨀ 㤀㤀⸀㤀─ 甀瀀琀椀洀攀ഀഀ
- **Seguridad:** 0 vulnerabilidades críticas਍ഀഀ
### **Negocio**਍ⴀ ⨀⨀䄀搀漀瀀挀椀渀㨀⨀⨀ 㠀　─ 搀攀 攀洀瀀爀攀猀愀猀 甀猀愀渀搀漀 洀切氀琀椀瀀氀攀猀 搀攀瀀愀爀琀愀洀攀渀琀漀猀ഀഀ
- **Satisfacción:** > 4.5/5 en encuestas਍ⴀ ⨀⨀刀攀琀攀渀挀椀渀㨀⨀⨀ 㸀 㤀　─ 搀攀 挀氀椀攀渀琀攀猀ഀഀ
- **Upselling:** 40% de empresas actualizando planes਍ഀഀ
### **Operacionales**਍ⴀ ⨀⨀匀漀瀀漀爀琀攀㨀⨀⨀ 㰀 ㈀㐀 栀漀爀愀猀 爀攀猀瀀甀攀猀琀愀ഀഀ
- **Onboarding:** < 30 minutos para primer usuario਍ⴀ ⨀⨀䐀漀挀甀洀攀渀琀愀挀椀渀㨀⨀⨀ ㄀　　─ 搀攀 昀甀渀挀椀漀渀愀氀椀搀愀搀攀猀 搀漀挀甀洀攀渀琀愀搀愀猀ഀഀ
- **Training:** < 2 horas para nuevos usuarios਍ഀഀ
---਍ഀഀ
**Responsable:** Equipo de Arquitectura  ਍⨀⨀䘀攀挀栀愀㨀⨀⨀ ㈀㈀ 搀攀 䨀甀渀椀漀Ⰰ ㈀　㈀㔀  ഀഀ
**Estado:** Documentación completa con multi-departamento  ਍⨀⨀倀爀砀椀洀愀 爀攀瘀椀猀椀渀㨀⨀⨀ ㈀㤀 搀攀 䨀甀渀椀漀Ⰰ ㈀　㈀㔀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ 㴀퇘⃜䔀瘀椀搀攀渀挀椀愀 礀 嘀愀氀椀搀愀挀椀渀 䌀䴀䴀䤀ഀഀ
਍ⴀ 倀爀甀攀戀愀猀 愀甀琀漀洀愀琀椀稀愀搀愀猀 搀攀 愀猀椀最渀愀挀椀渀 搀攀 爀漀氀攀猀 礀 搀攀瀀愀爀琀愀洀攀渀琀漀猀 搀漀挀甀洀攀渀琀愀搀愀猀 攀渀 怀搀漀挀猀⼀瀀漀猀琀洀愀渀⼀䄀䤀ⴀ倀愀椀爀ⴀ伀爀挀栀攀猀琀爀愀琀漀爀ⴀ倀爀漀⸀瀀漀猀琀洀愀渀开挀漀氀氀攀挀琀椀漀渀⸀樀猀漀渀怀ഀഀ
- Evidencia de ejecución en `docs/postman/reports/`਍ⴀ 嘀愀氀椀搀愀挀椀渀 挀爀甀稀愀搀愀 瀀漀爀 䤀䄀 礀 栀甀洀愀渀漀ഀഀ
- Referencia central: `docs/EXTREME_TRACEABLE_PROGRAMMING_XTP.md`਍ഀഀ
### Ejemplo਍ⴀ 䄀猀椀最渀愀爀 甀猀甀愀爀椀漀 愀 ㈀ 搀攀瀀愀爀琀愀洀攀渀琀漀猀 ⠀匀琀愀爀琀攀爀⤀㨀 搀攀戀攀 昀愀氀氀愀爀 攀渀 攀氀 琀攀爀挀攀爀漀Ⰰ 攀瘀椀搀攀渀挀椀愀 攀渀 爀攀瀀漀爀琀攀 一攀眀洀愀渀ഀഀ
- Cambiar de plan y validar límites: reporte y log਍