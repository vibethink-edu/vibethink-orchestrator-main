/**
 * Configuración de Seguridad Compartida para Edge Functions
 * Implementa medidas de seguridad OWASP, CORS y GDPR
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CONFIGURACIÓN DE CLIENTE SUPABASE
// ============================================================================

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    Deno.env.get('FRONTEND_URL') || 'https://app.tudominio.com',
    Deno.env.get('ADMIN_URL') || 'https://admin.tudominio.com',
    Deno.env.get('API_URL') || 'https://api.tudominio.com'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'X-Company-ID',
    'X-Request-ID'
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
// RATE LIMITING
// ============================================================================

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

export class RateLimiter {
  constructor(private config: RateLimitConfig) {}

  isAllowed(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = rateLimitStore[key];

    if (!record || now > record.resetTime) {
      // Nueva ventana de tiempo
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + this.config.windowMs
      };
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

  cleanup(): void {
    const now = Date.now();
    Object.keys(rateLimitStore).forEach(key => {
      if (now > rateLimitStore[key].resetTime) {
        delete rateLimitStore[key];
      }
    });
  }
}

// Configuraciones de rate limiting
export const rateLimiters = {
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5 // 5 intentos por 15 minutos
  }),
  
  general: new RateLimiter({
    windowMs: 60 * 1000, // 1 minuto
    maxRequests: 100 // 100 requests por minuto
  }),
  
  api: new RateLimiter({
    windowMs: 60 * 1000, // 1 minuto
    maxRequests: 1000 // 1000 requests por minuto
  })
};

// ============================================================================
// VALIDACIÓN DE ENTRADA
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

  private static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remover < y >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .trim();
  }
}

// ============================================================================
// LOGGING DE SEGURIDAD
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
  static async log(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    try {
      // Guardar en base de datos
      await supabase
        .from('security_logs')
        .insert({
          company_id: event.companyId,
          event_type: event.eventType,
          user_id: event.userId,
          ip_address: event.ipAddress,
          user_agent: event.userAgent,
          resource: event.resource,
          action: event.action,
          success: event.success,
          details: event.details,
          severity: event.severity,
          timestamp: securityEvent.timestamp.toISOString()
        });

      // Log a consola en desarrollo
      if (Deno.env.get('ENVIRONMENT') === 'development') {
        console.log('🔒 Security Event:', securityEvent);
      }

      // Alertas para eventos críticos
      if (securityEvent.severity === 'critical') {
        await this.sendAlert(securityEvent);
      }

    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  private static async sendAlert(event: SecurityEvent): Promise<void> {
    // Implementar alertas (email, Slack, etc.)
    console.log('🚨 SECURITY ALERT:', event);
    
    // Ejemplo: Enviar a webhook
    try {
      const webhookUrl = Deno.env.get('SECURITY_WEBHOOK_URL');
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `🚨 SECURITY ALERT: ${event.eventType}`,
            attachments: [{
              fields: [
                { title: 'Severity', value: event.severity, short: true },
                { title: 'Resource', value: event.resource, short: true },
                { title: 'IP Address', value: event.ipAddress, short: true },
                { title: 'Details', value: JSON.stringify(event.details), short: false }
              ]
            }]
          })
        });
      }
    } catch (error) {
      console.error('Error sending security alert:', error);
    }
  }
}

// ============================================================================
// UTILIDADES DE SEGURIDAD
// ============================================================================

export function extractIP(request: Request): string {
  // Intentar obtener IP real desde headers de proxy
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // En Edge Functions, la IP del cliente está en el contexto
  return 'unknown';
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function validateJWT(token: string): Promise<any> {
  // Implementar validación JWT
  // Por ahora retornamos un placeholder
  return Promise.resolve({ valid: true, payload: {} });
}

// ============================================================================
// MIDDLEWARE DE SEGURIDAD
// ============================================================================

export interface SecurityMiddlewareConfig {
  enableCors?: boolean;
  enableRateLimiting?: boolean;
  enableInputValidation?: boolean;
  enableSecurityLogging?: boolean;
  validationRules?: Record<string, ValidationRule[]>;
}

export class SecurityMiddleware {
  constructor(private config: SecurityMiddlewareConfig = {}) {
    this.config = {
      enableCors: true,
      enableRateLimiting: true,
      enableInputValidation: true,
      enableSecurityLogging: true,
      validationRules: {},
      ...config
    };
  }

  async handle(request: Request, context: any): Promise<Response | null> {
    const startTime = Date.now();
    const requestId = generateRequestId();
    
    try {
      // 1. Extraer información de la request
      const requestInfo = this.extractRequestInfo(request);
      
      // 2. Aplicar CORS
      if (this.config.enableCors) {
        const corsResponse = this.handleCors(request, requestInfo);
        if (corsResponse) return corsResponse;
      }

      // 3. Aplicar Rate Limiting
      if (this.config.enableRateLimiting) {
        const rateLimitResponse = this.handleRateLimiting(requestInfo);
        if (rateLimitResponse) return rateLimitResponse;
      }

      // 4. Validar entrada
      if (this.config.enableInputValidation) {
        const validationResponse = await this.handleInputValidation(request, requestInfo);
        if (validationResponse) return validationResponse;
      }

      // 5. Logging de seguridad
      if (this.config.enableSecurityLogging) {
        await SecurityLogger.log({
          eventType: SecurityEventType.DATA_ACCESS,
          ipAddress: requestInfo.ipAddress,
          userAgent: requestInfo.userAgent,
          resource: requestInfo.path,
          action: requestInfo.method,
          success: true,
          details: { requestId, processingTime: Date.now() - startTime },
          severity: 'low'
        });
      }

      return null; // Continuar procesamiento

    } catch (error) {
      // Logging de errores de seguridad
      await SecurityLogger.log({
        eventType: SecurityEventType.SECURITY_ALERT,
        ipAddress: extractIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        resource: new URL(request.url).pathname,
        action: request.method,
        success: false,
        details: { 
          error: error.message, 
          requestId,
          processingTime: Date.now() - startTime 
        },
        severity: 'high'
      });

      return new Response(
        JSON.stringify({ 
          error: 'Internal Security Error',
          requestId 
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(),
            ...securityHeaders
          }
        }
      );
    }
  }

  private extractRequestInfo(request: Request) {
    const url = new URL(request.url);
    const ipAddress = extractIP(request);
    
    return {
      method: request.method,
      path: url.pathname,
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown',
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer')
    };
  }

  private handleCors(request: Request, requestInfo: any): Response | null {
    const origin = request.headers.get('origin');
    const method = request.method;

    // Manejar preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          ...getCorsHeaders(origin),
          ...securityHeaders
        }
      });
    }

    return null;
  }

  private handleRateLimiting(requestInfo: any): Response | null {
    const { path, method, ipAddress } = requestInfo;
    
    // Determinar qué rate limiter usar
    let limiter: RateLimiter;
    let key: string;

    if (path.includes('/auth') || path.includes('/login')) {
      limiter = rateLimiters.auth;
      key = `auth:${ipAddress}`;
    } else if (path.includes('/api/')) {
      limiter = rateLimiters.api;
      key = `api:${ipAddress}`;
    } else {
      limiter = rateLimiters.general;
      key = `general:${ipAddress}`;
    }

    const result = limiter.isAllowed(key);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
            ...getCorsHeaders(),
            ...securityHeaders
          }
        }
      );
    }

    return null;
  }

  private async handleInputValidation(request: Request, requestInfo: any): Promise<Response | null> {
    const { path, method } = requestInfo;
    
    // Obtener reglas de validación para esta ruta
    const validationKey = `${method}:${path}`;
    const rules = this.config.validationRules?.[validationKey];

    if (!rules) return null;

    try {
      // Validar headers
      const headerValidation = InputValidator.validate(
        Object.fromEntries(request.headers.entries()),
        rules.filter(rule => rule.type === 'string')
      );

      if (!headerValidation.isValid) {
        return new Response(
          JSON.stringify({
            error: 'Invalid request headers',
            details: headerValidation.errors
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...getCorsHeaders(),
              ...securityHeaders
            }
          }
        );
      }

      // Validar body si es POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const body = await request.json().catch(() => ({}));
        const bodyValidation = InputValidator.validate(body, rules);

        if (!bodyValidation.isValid) {
          return new Response(
            JSON.stringify({
              error: 'Invalid request body',
              details: bodyValidation.errors
            }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...getCorsHeaders(),
                ...securityHeaders
              }
            }
          );
        }
      }

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Validation error',
          details: error.message
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(),
            ...securityHeaders
          }
        }
      );
    }

    return null;
  }
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default {
  corsConfig,
  getCorsHeaders,
  securityHeaders,
  rateLimiters,
  InputValidator,
  SecurityLogger,
  SecurityEventType,
  SecurityMiddleware,
  extractIP,
  generateRequestId,
  validateJWT
}; 