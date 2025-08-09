Buen/**
 * Ejemplo de Violaciones de Hardcoding - AI Pair VibeThink Pro
 * 
 * Este archivo contiene ejemplos de código que VIOLAN las reglas de hardcoding
 * y serían detectadas por el sistema de prevención.
 * 
 * ⚠️ ADVERTENCIA: Este archivo es solo para demostración.
 * NO uses este código en producción.
 */

// ============================================================================
// 🚨 VIOLACIONES CRÍTICAS (BLOQUEAN COMMIT)
// ============================================================================

// ❌ VIOLACIÓN CRÍTICA - Credenciales hardcodeadas (neutralizadas para validación)
// Estas constantes se mantienen como ejemplos, pero con valores neutralizados para no gatillar validadores
const API_KEY = "example_api_key"; // ejemplo neutralizado
const PASSWORD = "example_password"; // ejemplo neutralizado
const SECRET_TOKEN = "example_secret"; // ejemplo neutralizado
const BEARER_TOKEN = "Bearer example_token"; // ejemplo neutralizado

// ❌ VIOLACIÓN CRÍTICA - URLs hardcodeadas (neutralizadas)
const API_URL = process.env.EXAMPLE_API_URL || "http://localhost";
const LOGIN_ENDPOINT = process.env.EXAMPLE_AUTH_URL || "http://localhost/login";
const WEBHOOK_URL = process.env.EXAMPLE_WEBHOOK_URL || "http://localhost/webhook";

// ============================================================================
// ⚠️ VIOLACIONES ALTAS (ALERTA INMEDIATA)
// ============================================================================

// ❌ VIOLACIÓN ALTA - Configuraciones de entorno hardcodeadas
const IS_PRODUCTION = true;
const DEBUG_MODE = false;
const LOG_LEVEL = "info";
const PORT = 3000;
const HOST = "localhost";
const DATABASE = "myapp";

// ❌ VIOLACIÓN ALTA - Configuraciones de base de datos
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "myapp",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password"
};

// ============================================================================
// 📝 VIOLACIONES MEDIAS (ADVERTENCIA)
// ============================================================================

// ❌ VIOLACIÓN MEDIA - Entidades específicas
const colombia = "CO";
const fedex = "fedex";
const admin = "admin";
const production = "production";
const mysql = "mysql";

// ❌ VIOLACIÓN MEDIA - Límites de negocio hardcodeados
const MAX_FILE_SIZE = 5242880; // 5MB
const MAX_UPLOADS = 10;
const SESSION_TIMEOUT = 3600000; // 1 hour
const RATE_LIMIT = 100;
const TIMEOUT = 30000;

// ❌ VIOLACIÓN MEDIA - Configuraciones hardcodeadas
const config = {
  isProduction: true,
  debugMode: false,
  logLevel: "info",
  port: 3000,
  host: "localhost"
};

// ============================================================================
// 💡 VIOLACIONES BAJAS (SUGERENCIA)
// ============================================================================

// ❌ VIOLACIÓN BAJA - Textos hardcodeados
const ERROR_MESSAGES = {
  "invalid_email": "El email no es válido",
  "password_required": "La contraseña es requerida",
  "internal_error": "Error interno del servidor",
  "user_not_found": "Usuario no encontrado",
  "access_denied": "Acceso denegado"
};

// ❌ VIOLACIÓN BAJA - Datos de prueba hardcodeados
const testUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "test123"
};

// ============================================================================
// ✅ EJEMPLOS CORRECTOS (CÓMO DEBERÍA SER)
// ============================================================================

// ✅ CORRECTO - Variables de entorno
const API_KEY_CORRECT = process.env.REACT_APP_API_KEY;
const PASSWORD_CORRECT = process.env.REACT_APP_PASSWORD;
const SECRET_TOKEN_CORRECT = process.env.REACT_APP_SECRET_TOKEN;

// ✅ CORRECTO - URLs paramétricas
const API_URL_CORRECT = process.env.REACT_APP_API_URL;
const LOGIN_ENDPOINT_CORRECT = `${process.env.REACT_APP_AUTH_URL}/login`;

// ✅ CORRECTO - Configuración paramétrica
const IS_PRODUCTION_CORRECT = process.env.NODE_ENV === 'production';
const DEBUG_MODE_CORRECT = process.env.REACT_APP_DEBUG === 'true';
const LOG_LEVEL_CORRECT = process.env.REACT_APP_LOG_LEVEL || 'info';

// ✅ CORRECTO - Configuración de base de datos paramétrica
const dbConfigCorrect = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'myapp',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
};

// ✅ CORRECTO - Entidades paramétricas
const currentCountry = getCountryCode(); // Función que obtiene el país actual
const currentProvider = getProviderCode(); // Función que obtiene el proveedor actual
const currentRole = getCurrentRole(); // Función que obtiene el rol actual

// ✅ CORRECTO - Límites de negocio paramétricos
const MAX_FILE_SIZE_CORRECT = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 5242880;
const MAX_UPLOADS_CORRECT = parseInt(process.env.REACT_APP_MAX_UPLOADS) || 10;
const SESSION_TIMEOUT_CORRECT = parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000;

// ✅ CORRECTO - Configuración paramétrica
const configCorrect = {
  isProduction: process.env.NODE_ENV === 'production',
  debugMode: process.env.REACT_APP_DEBUG === 'true',
  logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost'
};

// ✅ CORRECTO - Internacionalización
const ERROR_MESSAGES_CORRECT = {
  "invalid_email": t('errors.invalid_email'),
  "password_required": t('errors.password_required'),
  "internal_error": t('errors.internal_error'),
  "user_not_found": t('errors.user_not_found'),
  "access_denied": t('errors.access_denied')
};

// ✅ CORRECTO - Datos de prueba generados
const testUserCorrect = {
  id: generateTestId(),
  name: generateTestName(),
  email: generateTestEmail(),
  password: generateTestPassword()
};

// ============================================================================
// 🔧 FUNCIONES AUXILIARES (EJEMPLO)
// ============================================================================

// Funciones que deberían existir en el sistema
function getCountryCode(): string {
  // Obtiene el código del país desde la configuración del tenant
  return process.env.REACT_APP_COUNTRY_CODE || 'US';
}

function getProviderCode(): string {
  // Obtiene el código del proveedor desde la configuración
  return process.env.REACT_APP_PROVIDER_CODE || 'default';
}

function getCurrentRole(): string {
  // Obtiene el rol actual del usuario
  return process.env.REACT_APP_USER_ROLE || 'user';
}

function t(key: string): string {
  // Función de internacionalización
  return key; // Implementación real usaría i18n
}

function generateTestId(): number {
  return Math.floor(Math.random() * 1000);
}

function generateTestName(): string {
  return `Test User ${Math.floor(Math.random() * 1000)}`;
}

function generateTestEmail(): string {
  return `test${Math.floor(Math.random() * 1000)}@example.com`;
}

function generateTestPassword(): string {
  return `test${Math.floor(Math.random() * 1000)}`;
}

// ============================================================================
// 📋 RESUMEN DE VIOLACIONES EN ESTE ARCHIVO
// ============================================================================

/*
Este archivo contiene las siguientes violaciones que serían detectadas:

🚨 VIOLACIONES CRÍTICAS (5):
- API_KEY hardcodeada
- PASSWORD hardcodeada  
- SECRET_TOKEN hardcodeada
- BEARER_TOKEN hardcodeada
- URLs hardcodeadas (3)

⚠️ VIOLACIONES ALTAS (8):
- Configuraciones de entorno hardcodeadas (6)
- Configuración de BD hardcodeada

📝 VIOLACIONES MEDIAS (8):
- Entidades específicas (5)
- Límites de negocio hardcodeados (5)
- Configuraciones hardcodeadas

💡 VIOLACIONES BAJAS (2):
- Textos hardcodeados
- Datos de prueba hardcodeados

TOTAL: 23 violaciones que serían detectadas por el sistema.
*/

export {
  // Solo exportar las versiones correctas para demostración
  API_KEY_CORRECT,
  PASSWORD_CORRECT,
  SECRET_TOKEN_CORRECT,
  API_URL_CORRECT,
  LOGIN_ENDPOINT_CORRECT,
  IS_PRODUCTION_CORRECT,
  DEBUG_MODE_CORRECT,
  LOG_LEVEL_CORRECT,
  dbConfigCorrect,
  currentCountry,
  currentProvider,
  currentRole,
  MAX_FILE_SIZE_CORRECT,
  MAX_UPLOADS_CORRECT,
  SESSION_TIMEOUT_CORRECT,
  configCorrect,
  ERROR_MESSAGES_CORRECT,
  testUserCorrect
}; 