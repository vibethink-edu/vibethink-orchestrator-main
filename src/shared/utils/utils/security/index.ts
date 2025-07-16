/**
 * Utilidades de Seguridad Centralizadas
 * Implementa medidas de seguridad OWASP, CORS y GDPR
 */

import crypto from 'crypto';

// ============================================================================
// CONFIGURACIÓN CORS SEGURA
// ============================================================================

export interface CorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

export const corsConfig: CorsConfig = {
  allowedOrigins: [
    import.meta.env.VITE_FRONTEND_URL || 'https://app.tudominio.com',
    import.meta.env.VITE_ADMIN_URL || 'https://admin.tudominio.com',
    import.meta.env.VITE_API_URL || 'https://api.tudominio.com'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'X-Company-ID'
  ],
  credentials: true,
  maxAge: 86400 // 24 horas
};

export const getCorsHeaders = (origin?: string): Record<string, string> => {
  const isAllowedOrigin = origin && corsConfig.allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : corsConfig.allowedOrigins[0],
    'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
    'Access-Control-Allow-Credentials': corsConfig.credentials.toString(),
    'Access-Control-Max-Age': corsConfig.maxAge.toString(),
  };
};

// ============================================================================
// HEADERS DE SEGURIDAD OWASP
// ============================================================================

export const securityHeaders = {
  // HSTS - Forzar HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Prevenir MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevenir clickjacking
  'X-Frame-Options': 'DENY',
  
  // Protección XSS básica
  'X-XSS-Protection': '1; mode=block',
  
  // Política de referrer
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.tudominio.com wss://api.tudominio.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Permissions Policy
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()'
  ].join(', '),
  
  // Cache control para recursos sensibles
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// ============================================================================
// ENCRIPTACIÓN DE DATOS (OWASP A02)
// ============================================================================

export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
  algorithm: string;
  version: string;
}

export class DataEncryption {
  private static readonly algorithm = 'aes-256-gcm';
  private static readonly keyLength = 32;
  private static readonly ivLength = 16;
  private static readonly tagLength = 16;
  private static readonly version = '1.0';

  /**
   * Encripta datos sensibles usando AES-256-GCM
   */
  static async encrypt(data: string, key: Buffer): Promise<EncryptedData> {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, key, iv);
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: cipher.getAuthTag().toString('hex'),
        algorithm: this.algorithm,
        version: this.version
      };
    } catch (error) {
      throw new Error(`Error encriptando datos: ${error}`);
    }
  }

  /**
   * Desencripta datos usando AES-256-GCM
   */
  static async decrypt(encryptedData: EncryptedData, key: Buffer): Promise<string> {
    try {
      const decipher = crypto.createDecipher(
        this.algorithm, 
        key, 
        Buffer.from(encryptedData.iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Error desencriptando datos: ${error}`);
    }
  }

  /**
   * Genera una clave de encriptación segura
   */
  static generateKey(): Buffer {
    return crypto.randomBytes(this.keyLength);
  }

  /**
   * Genera un hash seguro para contraseñas
   */
  static async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, import.meta.env.VITE_PASSWORD_SALT || 'default-salt', 64, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey.toString('hex'));
      });
    });
  }
}

// ============================================================================
// VALIDACIÓN DE ENTRADA (OWASP A03)
// ============================================================================

export interface ValidationRule {
  type: 'string' | 'email' | 'url' | 'number' | 'boolean' | 'date' | 'uuid';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowedValues?: string[];
  sanitize?: boolean;
}

export class InputValidator {
  /**
   * Valida y sanitiza entrada de usuario
   */
  static validate(input: any, rules: ValidationRule[]): { isValid: boolean; errors: string[]; sanitized: any } {
    const errors: string[] = [];
    let sanitized = input;

    for (const rule of rules) {
      try {
        // Validación de tipo
        if (rule.type === 'string' && typeof input !== 'string') {
          errors.push(`Campo debe ser string`);
          continue;
        }

        if (rule.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input)) {
            errors.push(`Email inválido`);
            continue;
          }
        }

        if (rule.type === 'url') {
          try {
            new URL(input);
          } catch {
            errors.push(`URL inválida`);
            continue;
          }
        }

        // Validación de longitud
        if (rule.minLength && input.length < rule.minLength) {
          errors.push(`Mínimo ${rule.minLength} caracteres`);
        }

        if (rule.maxLength && input.length > rule.maxLength) {
          errors.push(`Máximo ${rule.maxLength} caracteres`);
        }

        // Validación de patrón
        if (rule.pattern && !rule.pattern.test(input)) {
          errors.push(`Formato inválido`);
        }

        // Validación de valores permitidos
        if (rule.allowedValues && !rule.allowedValues.includes(input)) {
          errors.push(`Valor no permitido`);
        }

        // Sanitización
        if (rule.sanitize && typeof input === 'string') {
          sanitized = this.sanitizeString(input);
        }

      } catch (error) {
        errors.push(`Error de validación: ${error}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    };
  }

  /**
   * Sanitiza strings para prevenir XSS
   */
  private static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remover < y >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .trim();
  }
}

// ============================================================================
// RATE LIMITING (OWASP A01)
// ============================================================================

export interface RateLimitConfig {
  windowMs: number; // Ventana de tiempo en ms
  maxRequests: number; // Máximo de requests por ventana
  keyGenerator?: (req: any) => string; // Función para generar clave
}

export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private config: RateLimitConfig) {}

  /**
   * Verifica si una request está dentro del límite
   */
  isAllowed(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      // Nueva ventana de tiempo
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs
      };
    }

    if (record.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }

    record.count++;
    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime
    };
  }

  /**
   * Limpia registros expirados
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// ============================================================================
// LOGGING DE SEGURIDAD (OWASP A09)
// ============================================================================

export enum SecurityEventType {
  AUTHENTICATION_SUCCESS = 'auth_success',
  AUTHENTICATION_FAILURE = 'auth_failure',
  AUTHORIZATION_DENIED = 'authz_denied',
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  CONFIGURATION_CHANGE = 'config_change',
  SECURITY_ALERT = 'security_alert',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INPUT_VALIDATION_FAILED = 'input_validation_failed'
}

export interface SecurityEvent {
  timestamp: Date;
  eventType: SecurityEventType;
  userId?: string;
  companyId?: string;
  ipAddress: string;
  userAgent: string;
  resource: string;
  action: string;
  success: boolean;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  /**
   * Registra un evento de seguridad
   */
  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(securityEvent);

    // TODO: log 🔒 Security Event en desarrollo

    // En producción, enviar a SIEM
    if (import.meta.env.MODE === 'production') {
      this.sendToSIEM(securityEvent);
    }

    // Alertas para eventos críticos
    if (securityEvent.severity === 'critical') {
      this.sendAlert(securityEvent);
    }
  }

  /**
   * Obtiene eventos de seguridad filtrados
   */
  getEvents(filters?: Partial<SecurityEvent>): SecurityEvent[] {
    return this.events.filter(event => {
      if (!filters) return true;
      
      return Object.entries(filters).every(([key, value]) => {
        return event[key as keyof SecurityEvent] === value;
      });
    });
  }

  private sendToSIEM(event: SecurityEvent): void {
    // Implementar envío a SIEM (Splunk, ELK, etc.)
    // TODO: log 📊 SIEM Event
  }

  private sendAlert(event: SecurityEvent): void {
    // Implementar alertas (email, Slack, etc.)
    // TODO: log 🚨 SECURITY ALERT
  }
}

// ============================================================================
// UTILIDADES GDPR
// ============================================================================

export interface ConsentRecord {
  id: string;
  userId: string;
  purpose: string;
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  version: string;
  withdrawalTimestamp?: Date;
}

export class GDPRManager {
  /**
   * Registra consentimiento del usuario
   */
  static recordConsent(consent: Omit<ConsentRecord, 'id' | 'timestamp'>): ConsentRecord {
    const record: ConsentRecord = {
      ...consent,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    // Guardar en base de datos
    // TODO: Implementar persistencia

    return record;
  }

  /**
   * Retira consentimiento
   */
  static withdrawConsent(userId: string, purpose: string): void {
    // Marcar consentimiento como retirado
    // TODO: Implementar actualización en BD
    // TODO: log Consentimiento retirado para usuario ${userId}, propósito: ${purpose}
  }

  /**
   * Genera exportación de datos personales
   */
  static async exportPersonalData(userId: string): Promise<any> {
    // TODO: Implementar exportación completa de datos
    return {
      userId,
      exportDate: new Date(),
      data: {
        profile: {},
        activities: [],
        preferences: {},
        consents: []
      }
    };
  }

  /**
   * Elimina datos personales (derecho al olvido)
   */
  static async deletePersonalData(userId: string): Promise<void> {
    // TODO: Implementar eliminación segura
    // TODO: log Eliminando datos personales para usuario ${userId}
  }
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default {
  corsConfig,
  getCorsHeaders,
  securityHeaders,
  DataEncryption,
  InputValidator,
  RateLimiter,
  SecurityLogger,
  GDPRManager,
  SecurityEventType
}; 