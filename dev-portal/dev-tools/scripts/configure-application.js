#!/usr/bin/env node

/**
 * Configurador de Aplicaciones y Módulos - Sistema de Mapeo Dual
 * Genera nomenclatura inteligente para aplicaciones con características configurables
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎯 CONFIGURADOR DE APLICACIONES Y MÓDULOS');
console.log('📋 Sistema de Mapeo Dual - VTK 1.0');
console.log('='.repeat(60));

// Tipos de proyecto
const PROJECT_TYPES = {
  INTEGRATION: 'INT',
  PORT: 'POR', 
  DEVELOPMENT: 'DEV'
};

// Niveles de plan
const PLAN_LEVELS = {
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise', 
  CUSTOM: 'custom'
};

// Matriz de características por plan
const FEATURE_MATRIX = {
  // Autenticación y seguridad
  "biometric_enabled": {
    enabled_in: ["enterprise", "custom"],
    description: "Autenticación biométrica",
    technical_requirements: ["InpFisical.BiometricModule"],
    dependencies: ["physical_access_hardware"]
  },
  
  "multi_factor": {
    enabled_in: ["basic", "professional", "enterprise", "custom"],
    description: "Autenticación multifactor",
    technical_requirements: ["SMS_Gateway", "Email_Service"]
  },

  "physical_integration": {
    enabled_in: ["enterprise", "custom"], 
    description: "Integración con control físico",
    technical_requirements: ["InpFisical.PhysicalAccess"],
    dependencies: ["hardware_integration"]
  },

  // Ecommerce y PIM
  "multi_currency": {
    enabled_in: ["professional", "enterprise", "custom"],
    description: "Soporte para múltiples monedas",
    technical_requirements: ["CurrencyAPI", "PaymentGateway_Multi"],
    dependencies: ["advanced_payment_processing"]
  },

  "inventory_tracking": {
    enabled_in: ["basic", "professional", "enterprise", "custom"],
    description: "Seguimiento de inventario básico"
  },

  "advanced_shipping": {
    enabled_in: ["enterprise", "custom"],
    description: "Cálculo avanzado de envíos con múltiples carriers",
    technical_requirements: ["GoogleMaps_API", "Carrier_APIs"],
    dependencies: ["logistics_module"]
  },

  "pim_integration": {
    enabled_in: ["professional", "enterprise", "custom"],
    description: "Integración con PIM externo",
    technical_requirements: ["Strapi_API", "Medusa_API"],
    dependencies: ["external_pim_system"]
  },

  // CRM y gestión de clientes
  "advanced_pipeline": {
    enabled_in: ["professional", "enterprise", "custom"],
    description: "Pipeline de ventas avanzado con automatización"
  },

  "ai_scoring": {
    enabled_in: ["enterprise", "custom"],
    description: "Scoring inteligente de leads con IA",
    technical_requirements: ["OpenAI_API", "ML_Pipeline"],
    dependencies: ["advanced_analytics"]
  },

  "workflow_automation": {
    enabled_in: ["professional", "enterprise", "custom"],
    description: "Automatización de workflows de ventas"
  },

  "white_label": {
    enabled_in: ["enterprise", "custom"],
    description: "Personalización de marca completa"
  },

  // IA y Chat
  "gpt4_access": {
    enabled_in: ["professional", "enterprise", "custom"],
    description: "Acceso a GPT-4 para respuestas avanzadas",
    technical_requirements: ["OpenAI_GPT4_API"],
    dependencies: ["premium_ai_quota"]
  },

  "custom_training": {
    enabled_in: ["enterprise", "custom"],
    description: "Entrenamiento personalizado de modelos IA",
    technical_requirements: ["ML_Training_Pipeline"],
    dependencies: ["custom_data_pipeline"]
  },

  "voice_integration": {
    enabled_in: ["enterprise", "custom"],
    description: "Integración con reconocimiento de voz",
    technical_requirements: ["Speech_API"],
    dependencies: ["audio_processing"]
  },

  // Analytics y reportes
  "real_time_data": {
    enabled_in: ["professional", "enterprise", "custom"],
    description: "Datos en tiempo real",
    technical_requirements: ["WebSocket_Server", "Stream_Processing"]
  },

  "advanced_charts": {
    enabled_in: ["professional", "enterprise", "custom"],
    description: "Gráficos y visualizaciones avanzadas",
    technical_requirements: ["D3_Charts", "Custom_Visualizations"]
  },

  "ai_predictions": {
    enabled_in: ["enterprise", "custom"],
    description: "Predicciones con IA para analytics",
    technical_requirements: ["ML_Models", "Prediction_Pipeline"],
    dependencies: ["historical_data_analysis"]
  }
};

// Inventario de aplicaciones base
const APPLICATION_INVENTORY = {
  // Núcleo de autenticación
  "AuthHub": {
    source: "InpFisical",
    type: "INTEGRATION",
    business_function: "security_access_control",
    description: "Componente de autorización física integrado",
    modules: {
      "physical_access": "InpFisical.PhysicalAccess",
      "digital_auth": "InpFisical.DigitalAuth", 
      "biometric_scan": "InpFisical.BiometricModule",
      "access_control": "InpFisical.AccessControl"
    }
  },

  // Comercio electrónico  
  "CommerceEngine": {
    source: "MedusaJS", 
    type: "PORT",
    business_function: "ecommerce_operations",
    description: "Motor de ecommerce portado desde Medusa",
    modules: {
      "product_catalog": "Medusa.ProductModule",
      "order_management": "Medusa.OrderModule",
      "payment_gateway": "Medusa.PaymentModule",
      "shipping_calc": "Internal.ShippingModule"
    }
  },

  "ProductHub": {
    source: "Strapi",
    type: "INTEGRATION", 
    business_function: "product_information_management",
    description: "PIM integrado con Strapi",
    modules: {
      "product_info": "Strapi.ContentManager",
      "media_assets": "Strapi.MediaLibrary",
      "catalog_sync": "Internal.SyncModule",
      "attribute_mgmt": "Strapi.FieldManager"
    }
  },

  // Gestión de clientes
  "ClientMaster": {
    source: "Internal",
    type: "DEVELOPMENT",
    business_function: "customer_relationship_management",
    description: "CRM desarrollado internamente",
    modules: {
      "contact_mgmt": "Internal.ContactModule",
      "pipeline_mgmt": "Internal.PipelineModule", 
      "activity_track": "Internal.ActivityModule",
      "ai_insights": "Internal.AIModule"
    }
  },

  // Business Intelligence
  "InsightDash": {
    source: "Internal",
    type: "DEVELOPMENT", 
    business_function: "business_intelligence",
    description: "Dashboard de analytics desarrollado",
    modules: {
      "metrics_engine": "Internal.MetricsModule",
      "chart_render": "ChartJS.RenderModule",
      "data_connector": "Internal.ConnectorModule",
      "ai_predictions": "Internal.PredictionModule"
    }
  },

  // Inteligencia Artificial
  "SmartChat": {
    source: "OpenAI",
    type: "INTEGRATION",
    business_function: "ai_customer_support",
    description: "Chat inteligente integrado con OpenAI",
    modules: {
      "chat_engine": "OpenAI.ChatCompletion",
      "context_mgmt": "Internal.ContextModule",
      "knowledge_base": "Internal.KnowledgeModule",
      "conversation_flow": "Internal.FlowModule"
    }
  },

  // Logística y envíos
  "LogiTracker": {
    source: "GoogleMaps",
    type: "INTEGRATION",
    business_function: "logistics_tracking",
    description: "Sistema de logística con tracking en tiempo real",
    modules: {
      "route_optimization": "GoogleMaps.RouteAPI",
      "tracking_system": "Internal.TrackingModule",
      "carrier_integration": "Internal.CarrierModule",
      "delivery_prediction": "Internal.PredictionModule"
    }
  },

  // Comunicaciones
  "NotifyEngine": {
    source: "Internal",
    type: "DEVELOPMENT",
    business_function: "notifications_communications",
    description: "Motor de notificaciones multicanal",
    modules: {
      "email_service": "Internal.EmailModule",
      "sms_service": "Internal.SMSModule",
      "push_notifications": "Internal.PushModule",
      "notification_rules": "Internal.RulesEngine"
    }
  }
};

// Función para generar código interno
function generateInternalCode(type, appAbbrev) {
  const prefix = PROJECT_TYPES[type] || 'DEV';
  // Generar secuencia basada en timestamp para evitar colisiones
  const timestamp = Date.now().toString().slice(-3);
  return `${prefix}_${appAbbrev}${timestamp}`;
}

// Función para obtener características habilitadas por plan
function getEnabledFeatures(planLevel) {
  return Object.keys(FEATURE_MATRIX)
    .filter(feature => FEATURE_MATRIX[feature].enabled_in.includes(planLevel));
}

// Función principal de configuración
function generateAppConfig(appName, sourceApp, projectType, planLevel) {
  const appCode = `AP_${appName}`;
  const appAbbrev = appName.substring(0, 2).toUpperCase();
  const internalCode = generateInternalCode(projectType, appAbbrev);
  const sourceMapping = `${sourceApp}_${internalCode}`;
  
  // Auto-habilitar características según el plan
  const enabledFeatures = getEnabledFeatures(planLevel);
  
  // Obtener información base de la aplicación
  const appInfo = APPLICATION_INVENTORY[appName] || {
    source: sourceApp,
    type: projectType,
    business_function: "custom_application",
    description: `Aplicación personalizada basada en ${sourceApp}`,
    modules: {}
  };

  return {
    appCode,
    sourceMapping,
    internalCode,
    projectType,
    planLevel,
    enabledFeatures,
    appInfo,
    generatedAt: new Date().toISOString(),
    configuration: {
      source_system: sourceApp,
      integration_type: projectType,
      business_function: appInfo.business_function,
      modules: appInfo.modules,
      enabled_features: enabledFeatures.reduce((acc, feature) => {
        acc[feature] = {
          enabled: true,
          description: FEATURE_MATRIX[feature].description,
          technical_requirements: FEATURE_MATRIX[feature].technical_requirements || [],
          dependencies: FEATURE_MATRIX[feature].dependencies || []
        };
        return acc;
      }, {}),
      disabled_features: Object.keys(FEATURE_MATRIX)
        .filter(feature => !enabledFeatures.includes(feature))
        .reduce((acc, feature) => {
          acc[feature] = {
            enabled: false,
            description: FEATURE_MATRIX[feature].description,
            available_in: FEATURE_MATRIX[feature].enabled_in
          };
          return acc;
        }, {})
    }
  };
}

// Función para crear evidencia de configuración
function createConfigurationEvidence(config) {
  const evidenceDir = 'docs/PROJECT/09_EVIDENCES/by-application/';
  const appDir = path.join(evidenceDir, config.appCode.toLowerCase());
  const configDir = path.join(appDir, 'configuration');

  // Crear directorios
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Generar evidencia de configuración
  const evidenceFile = path.join(configDir, 'app-configuration-evidence.json');
  const evidenceData = {
    configuration_evidence: {
      execution_id: `CONFIG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      application_config: config,
      compliance_info: {
        VTK_version: "1.0",
        evidence_type: "application_configuration",
        compliance_frameworks: ["CMMI", "VTK", "ISO-27001"],
        audit_trail: {
          configured_by: process.env.USERNAME || process.env.USER || 'system',
          configuration_source: "automated_generator",
          validation_status: "pending_review"
        }
      }
    }
  };

  fs.writeFileSync(evidenceFile, JSON.stringify(evidenceData, null, 2));
  
  return evidenceFile;
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  const appName = args.find(arg => arg.startsWith('--name='))?.split('=')[1];
  const sourceApp = args.find(arg => arg.startsWith('--source='))?.split('=')[1];
  const projectType = args.find(arg => arg.startsWith('--type='))?.split('=')[1]?.toUpperCase();
  const planLevel = args.find(arg => arg.startsWith('--plan='))?.split('=')[1]?.toLowerCase();

  if (!appName || !sourceApp || !projectType || !planLevel) {
    console.log('❌ Parámetros requeridos:');
    console.log('   --name=NombreApp');
    console.log('   --source=SistemaFuente');
    console.log('   --type=integration|port|development');
    console.log('   --plan=basic|professional|enterprise|custom');
    console.log('');
    console.log('📝 Ejemplo:');
    console.log('   node configure-application.js --name="ProductCatalog" --source="Strapi" --type="integration" --plan="professional"');
    return;
  }

  console.log(`🔧 Configurando aplicación: ${appName}`);
  console.log(`📦 Sistema fuente: ${sourceApp}`);
  console.log(`🎯 Tipo de proyecto: ${projectType}`);
  console.log(`📋 Plan: ${planLevel}`);
  console.log('');

  try {
    // Generar configuración
    const config = generateAppConfig(appName, sourceApp, projectType, planLevel);
    
    console.log('✅ Configuración generada:');
    console.log(`   Código aplicación: ${config.appCode}`);
    console.log(`   Mapeo fuente: ${config.sourceMapping}`);
    console.log(`   Código interno: ${config.internalCode}`);
    console.log(`   Características habilitadas: ${config.enabledFeatures.length}`);
    console.log('');

    // Crear evidencia
    const evidenceFile = createConfigurationEvidence(config);
    console.log(`📋 Evidencia generada: ${evidenceFile}`);
    
    // Mostrar características principales
    console.log('🎛️ Características habilitadas:');
    config.enabledFeatures.slice(0, 5).forEach(feature => {
      console.log(`   ✅ ${feature}: ${FEATURE_MATRIX[feature].description}`);
    });
    
    if (config.enabledFeatures.length > 5) {
      console.log(`   ... y ${config.enabledFeatures.length - 5} más`);
    }

    console.log('');
    console.log('🎯 Configuración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateAppConfig, getEnabledFeatures, APPLICATION_INVENTORY, FEATURE_MATRIX };
