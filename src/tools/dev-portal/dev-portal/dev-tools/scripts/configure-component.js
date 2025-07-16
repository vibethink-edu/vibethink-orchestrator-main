#!/usr/bin/env node

/**
 * 🎭 Component Configuration Script - VTK 1.0
 * Gestiona la configuración de componentes del sistema de orquestación
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

console.log('🎭 CONFIGURADOR DE COMPONENTES - AI Pair Orchestrator Pro');
console.log('📋 Inventario de componentes reales del sistema');
console.log('='.repeat(60));

// Inventario de componentes reales con tracking de portes
const COMPONENT_INVENTORY = {
  // Autenticación
  authentication: {
    'AP_AUTH_LOGIN': { 
      source: 'FUSIONAUTH_AUTH_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'FusionAuth',
      version: '1.50.1'
    },
    'AP_AUTH_JWT': { 
      source: 'FUSIONAUTH_JWT_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'FusionAuth',
      version: '1.50.1'
    },
    'AP_AUTH_SSO': { 
      source: 'FUSIONAUTH_SSO_INT', 
      type: 'INTEGRATION', 
      status: 'PLANNED',
      provider: 'FusionAuth',
      version: '1.50.1'
    },
    'AP_AUTH_PERMISSIONS': { 
      source: 'CUSTOM_RLS_DEV', 
      type: 'DEVELOPMENT', 
      status: 'ACTIVE' 
    },
    'AP_AUTH_SECRETS': { 
      source: 'INFISICAL_SECRETS_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'Infisical',
      version: '0.28.1'
    },
    'AP_AUTH_LEGACY': { 
      source: 'SUPABASE_AUTH_POR', 
      type: 'PORTE', 
      status: 'MIGRATING',
      porte_info: {
        origin_version: '2.45.0',
        frozen_at: '2025-01-15',
        last_upstream_check: '2025-06-29',
        upstream_version: '2.68.2',
        pending_improvements: ['passkeys', 'oauth2.1', 'device_flow'],
        adoption_decisions: []
      }
    },
  },

  // CRM (Desarrollo propio inspirado en Attio)
  crm: {
    'AP_CRM_CORE': { 
      source: 'ATTIO_INSPIRED_DEV', 
      type: 'DEVELOPMENT', 
      status: 'ACTIVE', 
      name: 'PENDING_RECOVERY',
      inspired_by: ['Attio', 'Twenty', 'Atomic CRM']
    },
    'AP_CRM_OBJECTS': { source: 'CUSTOM_OBJECTS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CRM_ATTRIBUTES': { source: 'CUSTOM_ATTRIBUTES_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CRM_RELATIONS': { source: 'CUSTOM_RELATIONS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CRM_PIPELINE': { source: 'CUSTOM_PIPELINE_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CRM_ACTIVITIES': { source: 'CUSTOM_ACTIVITIES_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CRM_ANALYTICS': { source: 'CUSTOM_ANALYTICS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // Help Desk y PQRS
  helpdesk: {
    'AP_HELP_TICKETS': { source: 'CUSTOM_HELPDESK_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_HELP_KNOWLEDGE': { source: 'CUSTOM_KB_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_HELP_SLA': { source: 'CUSTOM_SLA_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PQRS_REQUESTS': { source: 'CUSTOM_PQRS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PQRS_WORKFLOW': { source: 'CUSTOM_WORKFLOW_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PQRS_COMPLIANCE': { source: 'CUSTOM_COMPLIANCE_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // Social Media Management (POSTIZ - Componente Porte)
  social: {
    'AP_SOCIAL_POSTING': { 
      source: 'POSTIZ_SOCIAL_POR', 
      type: 'PORTE', 
      status: 'ACTIVE',
      porte_info: {
        origin_version: '1.9.2',
        frozen_at: '2025-01-20',
        last_upstream_check: '2025-06-29',
        upstream_version: '1.9.5',
        pending_improvements: ['instagram_reels', 'threads_api', 'linkedin_video'],
        adoption_decisions: [
          {
            improvement: 'tiktok_auto_captions',
            decision: 'adopt',
            date: '2025-06-15',
            rationale: 'Mejoras significativas en engagement',
            implemented: true
          }
        ],
        original_repo: 'https://github.com/gitroomhq/postiz-app',
        our_adaptations: ['custom_branding', 'api_extensions', 'multi_tenant_support'],
        maintenance_notes: 'Portado específicamente para integración con nuestro sistema CRM'
      }
    },
    'AP_SOCIAL_SCHEDULING': { 
      source: 'POSTIZ_SCHEDULER_POR', 
      type: 'PORTE', 
      status: 'ACTIVE',
      porte_info: {
        origin_version: '1.9.2',
        frozen_at: '2025-01-20',
        last_upstream_check: '2025-06-29',
        upstream_version: '1.9.5',
        pending_improvements: ['bulk_operations', 'content_ai_generation', 'analytics_dashboard'],
        adoption_decisions: [],
        original_repo: 'https://github.com/gitroomhq/postiz-app',
        our_adaptations: ['calendar_integration', 'approval_workflows', 'team_collaboration'],
        maintenance_notes: 'Scheduler adaptado para workflows empresariales'
      }
    },
    'AP_SOCIAL_ANALYTICS': { 
      source: 'POSTIZ_ANALYTICS_POR', 
      type: 'PORTE', 
      status: 'ACTIVE',
      porte_info: {
        origin_version: '1.9.2',
        frozen_at: '2025-01-20',
        last_upstream_check: '2025-06-29',
        upstream_version: '1.9.5',
        pending_improvements: ['advanced_metrics', 'competitor_analysis', 'roi_tracking'],
        adoption_decisions: [],
        original_repo: 'https://github.com/gitroomhq/postiz-app',
        our_adaptations: ['custom_kpis', 'executive_reports', 'multi_account_comparison'],
        maintenance_notes: 'Analytics extendidos para métricas empresariales'
      }
    },
  },

  // Payments
  payments: {
    'AP_PAY_GATEWAY': { source: 'CUSTOM_PAYMENT_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PAY_STRIPE': { 
      source: 'STRIPE_GATEWAY_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'Stripe',
      version: '14.25.0'
    },
    'AP_PAY_MERCADOPAGO': { 
      source: 'MERCADOPAGO_INT', 
      type: 'INTEGRATION', 
      status: 'PLANNED',
      provider: 'MercadoPago',
      version: 'latest'
    },
    'AP_PAY_PSE': { 
      source: 'PSE_COLOMBIA_INT', 
      type: 'INTEGRATION', 
      status: 'PLANNED',
      provider: 'ACH Colombia',
      version: 'latest'
    },
    'AP_PAY_BILLING': { source: 'CUSTOM_BILLING_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // AI Chat
  ai_chat: {
    'AP_CHAT_CORE': { source: 'CUSTOM_AICHAT_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CHAT_OPENAI': { 
      source: 'OPENAI_GPT_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'OpenAI',
      version: 'gpt-4-turbo'
    },
    'AP_CHAT_ANTHROPIC': { 
      source: 'ANTHROPIC_CLAUDE_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'Anthropic',
      version: 'claude-3.5-sonnet'
    },
    'AP_CHAT_WORKFLOW': { source: 'CUSTOM_WORKFLOW_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CHAT_CONTEXT': { source: 'CUSTOM_CONTEXT_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // Notifications
  notifications: {
    'AP_NOTIF_CORE': { source: 'CUSTOM_NOTIFICATION_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_NOTIF_EMAIL': { source: 'CUSTOM_EMAIL_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_NOTIF_SMS': { source: 'CUSTOM_SMS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_NOTIF_PUSH': { source: 'CUSTOM_PUSH_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_NOTIF_WEBHOOKS': { source: 'CUSTOM_WEBHOOKS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // PIM (Mixto)
  pim: {
    'AP_PIM_CORE': { 
      source: 'PIMCORE_COMMUNITY_POR', 
      type: 'PORTE', 
      status: 'CONDITIONAL',
      porte_info: {
        origin_version: '11.1.0',
        frozen_at: null, // No portado aún
        last_upstream_check: '2025-06-29',
        upstream_version: '11.2.3',
        pending_improvements: ['api_v2', 'graphql_improvements', 'performance_optimizations'],
        adoption_decisions: ['conditional_on_sector']
      }
    },
    'AP_PIM_PRODUCTS': { source: 'CUSTOM_PIM_DEV', type: 'DEVELOPMENT', status: 'CONDITIONAL' },
    'AP_PIM_CATEGORIES': { source: 'CUSTOM_CATEGORIES_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PIM_ATTRIBUTES': { source: 'CUSTOM_ATTRIBUTES_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PIM_SYNC': { source: 'CUSTOM_SYNC_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PIM_HEALTH': { source: 'CUSTOM_HEALTH_DEV', type: 'DEVELOPMENT', status: 'SECTOR_SPECIFIC' },
  },

  // Workflows
  workflows: {
    'AP_WORKFLOW_ENGINE': { 
      source: 'KESTRA_WORKFLOWS_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'Kestra',
      version: '0.15.7'
    },
    'AP_WORKFLOW_TASKS': { 
      source: 'KESTRA_TASKS_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'Kestra',
      version: '0.15.7'
    },
    'AP_WORKFLOW_API': { 
      source: 'KESTRA_API_INT', 
      type: 'INTEGRATION', 
      status: 'ACTIVE',
      provider: 'Kestra',
      version: '0.15.7'
    },
  },

  // Social Media & Content
  social: {
    'AP_SOCIAL_POSTING': { 
      source: 'POSTIZ_SOCIAL_POR', 
      type: 'PORTE', 
      status: 'ACTIVE',
      porte_info: {
        origin_version: '1.7.2',
        frozen_at: '2025-02-10',
        last_upstream_check: '2025-06-29',
        upstream_version: '1.9.5',
        pending_improvements: ['instagram_reels', 'tiktok_integration', 'ai_content_gen'],
        adoption_decisions: [
          { improvement: 'ai_content_gen', decision: 'adopt', date: '2025-06-15' },
          { improvement: 'instagram_reels', decision: 'evaluate', date: '2025-06-29' }
        ]
      }
    },
    'AP_SOCIAL_SCHEDULING': { 
      source: 'POSTIZ_SCHEDULE_POR', 
      type: 'PORTE', 
      status: 'ACTIVE',
      porte_info: {
        origin_version: '1.7.2',
        frozen_at: '2025-02-10',
        last_upstream_check: '2025-06-29',
        upstream_version: '1.9.5',
        pending_improvements: ['advanced_scheduling', 'bulk_operations'],
        adoption_decisions: []
      }
    },
  },

  // Analytics
  analytics: {
    'AP_DATA_QUERY': { 
      source: 'CHAT2DB_INSPIRED_DEV', 
      type: 'DEVELOPMENT', 
      status: 'PLANNED',
      inspired_by: ['Chat2DB']
    },
    'AP_DATA_NLQ': { source: 'CUSTOM_NLQ_DEV', type: 'DEVELOPMENT', status: 'PLANNED' },
    'AP_ANALYTICS_BI': { 
      source: 'LIGHTDASH_BI_INT', 
      type: 'INTEGRATION', 
      status: 'PENDING_APPROVAL',
      provider: 'Lightdash',
      version: '0.1071.0'
    },
    'AP_ANALYTICS_CUSTOM': { source: 'CUSTOM_BI_DEV', type: 'DEVELOPMENT', status: 'FALLBACK' },
    'AP_ANALYTICS_DBT': { 
      source: 'DBT_TRANSFORM_INT', 
      type: 'INTEGRATION', 
      status: 'CONDITIONAL',
      provider: 'dbt Labs',
      version: '1.7.4'
    },
    'AP_ANALYTICS_REPORTS': { source: 'CUSTOM_REPORTS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },
  payments: {
    'AP_PAY_GATEWAY': { source: 'CUSTOM_PAYMENT_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PAY_STRIPE': { source: 'STRIPE_GATEWAY_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_PAY_MERCADOPAGO': { source: 'MERCADOPAGO_INT', type: 'INTEGRATION', status: 'PLANNED' },
    'AP_PAY_PSE': { source: 'PSE_COLOMBIA_INT', type: 'INTEGRATION', status: 'PLANNED' },
    'AP_PAY_BILLING': { source: 'CUSTOM_BILLING_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // AI Chat
  ai_chat: {
    'AP_CHAT_CORE': { source: 'CUSTOM_AICHAT_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CHAT_OPENAI': { source: 'OPENAI_GPT_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_CHAT_ANTHROPIC': { source: 'ANTHROPIC_CLAUDE_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_CHAT_WORKFLOW': { source: 'CUSTOM_WORKFLOW_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_CHAT_CONTEXT': { source: 'CUSTOM_CONTEXT_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // Notifications
  notifications: {
    'AP_NOTIF_CORE': { source: 'CUSTOM_NOTIFICATION_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_NOTIF_EMAIL': { source: 'CUSTOM_EMAIL_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_NOTIF_SMS': { source: 'CUSTOM_SMS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_NOTIF_PUSH': { source: 'CUSTOM_PUSH_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_NOTIF_WEBHOOKS': { source: 'CUSTOM_WEBHOOKS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // PIM (Mixto)
  pim: {
    'AP_PIM_CORE': { source: 'PIMCORE_COMMUNITY_POR', type: 'PORTE', status: 'CONDITIONAL' },
    'AP_PIM_PRODUCTS': { source: 'CUSTOM_PIM_DEV', type: 'DEVELOPMENT', status: 'CONDITIONAL' },
    'AP_PIM_CATEGORIES': { source: 'CUSTOM_CATEGORIES_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PIM_ATTRIBUTES': { source: 'CUSTOM_ATTRIBUTES_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PIM_SYNC': { source: 'CUSTOM_SYNC_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_PIM_HEALTH': { source: 'CUSTOM_HEALTH_DEV', type: 'DEVELOPMENT', status: 'SECTOR_SPECIFIC' },
  },

  // Workflows
  workflows: {
    'AP_WORKFLOW_ENGINE': { source: 'KESTRA_WORKFLOWS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_WORKFLOW_TASKS': { source: 'KESTRA_TASKS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_WORKFLOW_API': { source: 'KESTRA_API_INT', type: 'INTEGRATION', status: 'ACTIVE' },
  },

  // Analytics
  analytics: {
    'AP_DATA_QUERY': { source: 'CHAT2DB_INSPIRED_DEV', type: 'DEVELOPMENT', status: 'PLANNED' },
    'AP_DATA_NLQ': { source: 'CUSTOM_NLQ_DEV', type: 'DEVELOPMENT', status: 'PLANNED' },
    'AP_ANALYTICS_BI': { source: 'LIGHTDASH_BI_INT', type: 'INTEGRATION', status: 'PENDING_APPROVAL' },
    'AP_ANALYTICS_CUSTOM': { source: 'CUSTOM_BI_DEV', type: 'DEVELOPMENT', status: 'FALLBACK' },
    'AP_ANALYTICS_DBT': { source: 'DBT_TRANSFORM_INT', type: 'INTEGRATION', status: 'CONDITIONAL' },
    'AP_ANALYTICS_REPORTS': { source: 'CUSTOM_REPORTS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
  },

  // UI Components
  ui: {
    'AP_UI_DESIGN': { source: 'SHADCN_UI_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_UI_COMPONENTS': { source: 'CUSTOM_COMPONENTS_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_UI_FORMS': { source: 'REACT_HOOK_FORM_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_UI_TABLES': { source: 'TANSTACK_TABLE_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_UI_CHARTS': { source: 'RECHARTS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_UI_ICONS': { source: 'LUCIDE_ICONS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
  },

  // Database & ORM
  database: {
    'AP_DB_POSTGRES': { source: 'SUPABASE_POSTGRES_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_DB_RLS': { source: 'SUPABASE_RLS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_DB_ORM': { source: 'CUSTOM_QUERIES_DEV', type: 'DEVELOPMENT', status: 'ACTIVE' },
    'AP_DB_SEARCH': { source: 'POSTGRES_FTS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_DB_CACHE': { source: 'REDIS_CACHE_INT', type: 'INTEGRATION', status: 'ACTIVE' },
  },

  // CDP
  cdp: {
    'AP_CDP_CORE': { source: 'TRACARDI_CDP_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_CDP_PROFILES': { source: 'TRACARDI_PROFILES_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_CDP_EVENTS': { source: 'TRACARDI_EVENTS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_CDP_SEGMENTS': { source: 'TRACARDI_SEGMENTS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
    'AP_CDP_ANALYTICS': { source: 'TRACARDI_ANALYTICS_INT', type: 'INTEGRATION', status: 'ACTIVE' },
  }
};

// Estados de componentes
const STATUS_COLORS = {
  'ACTIVE': '🟢',
  'PLANNED': '🟡',
  'PENDING_APPROVAL': '🟠',
  'PENDING_INFO': '🔴',
  'CONDITIONAL': '🔵',
  'MIGRATING': '🟣',
  'FALLBACK': '⚪',
  'SECTOR_SPECIFIC': '🟤'
};

// Función para mostrar el inventario
function showInventory() {
  console.log('\n📋 INVENTARIO COMPLETO DE COMPONENTES\n');
  
  Object.entries(COMPONENT_INVENTORY).forEach(([category, components]) => {
    console.log(`\n🔧 ${category.toUpperCase()}`);
    console.log('─'.repeat(50));
    
    Object.entries(components).forEach(([internal_code, config]) => {
      const status_icon = STATUS_COLORS[config.status] || '❓';
      const type_icon = config.type === 'INTEGRATION' ? '🔗' : 
                       config.type === 'DEVELOPMENT' ? '⚡' : '📦';
      
      console.log(`${status_icon} ${type_icon} ${internal_code}`);
      console.log(`    Source: ${config.source}`);
      console.log(`    Type: ${config.type}`);
      console.log(`    Status: ${config.status}`);
      
      if (config.name) {
        console.log(`    Name: ${config.name}`);
      }
      console.log('');
    });
  });
}

// Función para obtener estadísticas
function getStats() {
  let total = 0;
  let by_type = { 'INTEGRATION': 0, 'DEVELOPMENT': 0, 'PORTE': 0 };
  let by_status = {};
  
  Object.values(COMPONENT_INVENTORY).forEach(components => {
    Object.values(components).forEach(config => {
      total++;
      by_type[config.type] = (by_type[config.type] || 0) + 1;
      by_status[config.status] = (by_status[config.status] || 0) + 1;
    });
  });
  
  console.log('\n📊 ESTADÍSTICAS DEL INVENTARIO\n');
  console.log(`Total de componentes: ${total}`);
  console.log('\nPor tipo:');
  Object.entries(by_type).forEach(([type, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    console.log(`  ${type}: ${count} (${percentage}%)`);
  });
  
  console.log('\nPor estado:');
  Object.entries(by_status).forEach(([status, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    const icon = STATUS_COLORS[status] || '❓';
    console.log(`  ${icon} ${status}: ${count} (${percentage}%)`);
  });
}

// Función para buscar componente
function findComponent(search) {
  console.log(`\n🔍 BUSCANDO: "${search}"\n`);
  
  let found = false;
  Object.entries(COMPONENT_INVENTORY).forEach(([category, components]) => {
    Object.entries(components).forEach(([internal_code, config]) => {
      if (internal_code.toLowerCase().includes(search.toLowerCase()) ||
          config.source.toLowerCase().includes(search.toLowerCase())) {
        
        if (!found) found = true;
        
        const status_icon = STATUS_COLORS[config.status] || '❓';
        const type_icon = config.type === 'INTEGRATION' ? '🔗' : 
                         config.type === 'DEVELOPMENT' ? '⚡' : '📦';
        
        console.log(`${status_icon} ${type_icon} ${internal_code}`);
        console.log(`    Category: ${category}`);
        console.log(`    Source: ${config.source}`);
        console.log(`    Type: ${config.type}`);
        console.log(`    Status: ${config.status}`);
        console.log('');
      }
    });
  });
  
  if (!found) {
    console.log('❌ No se encontraron componentes que coincidan.');
  }
}

// Función para mostrar información de portes
function showPorteComponents() {
  console.log('\n📦 COMPONENTES PORTADOS - TRACKING UPSTREAM\n');
  
  let found = false;
  Object.entries(COMPONENT_INVENTORY).forEach(([category, components]) => {
    Object.entries(components).forEach(([internal_code, config]) => {
      if (config.type === 'PORTE' && config.porte_info) {
        if (!found) found = true;
        
        const status_icon = STATUS_COLORS[config.status] || '❓';
        console.log(`${status_icon} 📦 ${internal_code}`);
        console.log(`    Source: ${config.source}`);
        console.log(`    Provider: ${config.provider || 'Unknown'}`);
        
        const porte = config.porte_info;
        console.log(`    📌 Origin Version: ${porte.origin_version}`);
        console.log(`    🔒 Frozen At: ${porte.frozen_at || 'Not frozen yet'}`);
        console.log(`    🔍 Last Check: ${porte.last_upstream_check}`);
        console.log(`    ⬆️  Upstream Version: ${porte.upstream_version}`);
        console.log(`    📝 Pending Improvements: ${porte.pending_improvements.length}`);
        
        if (porte.pending_improvements.length > 0) {
          porte.pending_improvements.forEach(improvement => {
            console.log(`        - ${improvement}`);
          });
        }
        
        console.log(`    ✅ Adoption Decisions: ${porte.adoption_decisions.length}`);
        if (porte.adoption_decisions.length > 0) {
          porte.adoption_decisions.forEach(decision => {
            const decision_icon = decision.decision === 'adopt' ? '✅' : 
                                 decision.decision === 'reject' ? '❌' : '🔄';
            console.log(`        ${decision_icon} ${decision.improvement}: ${decision.decision} (${decision.date})`);
          });
        }
        
        console.log('');
      }
    });
  });
  
  if (!found) {
    console.log('❌ No se encontraron componentes portados con tracking activo.');
  }
}
function showPendingComponents() {
  console.log('\n⚠️  COMPONENTES QUE REQUIEREN ATENCIÓN\n');
  
  const pending_statuses = ['PENDING_INFO', 'PENDING_APPROVAL', 'CONDITIONAL', 'PLANNED'];
  let found = false;
  
  Object.entries(COMPONENT_INVENTORY).forEach(([category, components]) => {
    Object.entries(components).forEach(([internal_code, config]) => {
      if (pending_statuses.includes(config.status)) {
        if (!found) found = true;
        
        const status_icon = STATUS_COLORS[config.status] || '❓';
        const type_icon = config.type === 'INTEGRATION' ? '🔗' : 
                         config.type === 'DEVELOPMENT' ? '⚡' : '📦';
        
        console.log(`${status_icon} ${type_icon} ${internal_code}`);
        console.log(`    Source: ${config.source}`);
        console.log(`    Status: ${config.status}`);
        
        // Agregar mensaje específico según el estado
        if (config.status === 'PENDING_INFO') {
          console.log(`    ⚠️  ACCIÓN REQUERIDA: Necesita información sobre "${config.source}"`);
        } else if (config.status === 'PENDING_APPROVAL') {
          console.log(`    ⚠️  ACCIÓN REQUERIDA: Pendiente aprobación final`);
        } else if (config.status === 'CONDITIONAL') {
          console.log(`    ⚠️  ACCIÓN REQUERIDA: Depende de condiciones específicas`);
        } else if (config.status === 'PLANNED') {
          console.log(`    ⚠️  ACCIÓN REQUERIDA: Pendiente de implementación`);
        }
        
        if (config.name === 'PENDING_RECOVERY') {
          console.log(`    ⚠️  ACCIÓN REQUERIDA: Recuperar nombre original del CRM`);
        }
        
        console.log('');
      }
    });
  });
  
  if (!found) {
    console.log('✅ No hay componentes pendientes de atención.');
  }
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'inventory':
    case 'list':
      showInventory();
      break;
      
    case 'stats':
      getStats();
      break;
      
    case 'search':
      const searchTerm = args[1];
      if (!searchTerm) {
        console.log('❌ Error: Debes proporcionar un término de búsqueda');
        console.log('Uso: node configure-component.js search <término>');
        process.exit(1);
      }
      findComponent(searchTerm);
      break;
      
    case 'porte':
    case 'ports':
      showPorteComponents();
      break;
      
    case 'pending':
    case 'todo':
      showPendingComponents();
      break;
      
    case 'help':
    default:
      console.log('\n📖 COMANDOS DISPONIBLES:\n');
      console.log('node configure-component.js inventory  - Mostrar inventario completo');
      console.log('node configure-component.js stats     - Mostrar estadísticas');
      console.log('node configure-component.js search <término> - Buscar componente');
      console.log('node configure-component.js porte     - Mostrar componentes portados');
      console.log('node configure-component.js pending   - Mostrar componentes pendientes');
      console.log('node configure-component.js help      - Mostrar ayuda');
      console.log('');
      break;
  }
}

// Ejecutar
main();
