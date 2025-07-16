
/**
 * Input Validators with Enhanced UX and Feedback
 * 
 * Provides comprehensive validation functions with user-friendly
 * error messages and real-time feedback capabilities.
 * 
 * Part of Phase 2: Developer Experience improvements
 * 
 * @author AI Pair Platform - Developer Experience Team
 * @version 1.0.0
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  severity?: 'error' | 'warning' | 'info';
  suggestions?: string[];
}

export interface ValidationOptions {
  required?: boolean;
  language?: 'en' | 'es';
  customMessage?: string;
}

/**
 * Base validation messages in multiple languages
 */
const validationMessages = {
  en: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be no more than {max} characters',
    pattern: 'Invalid format',
    uuid: 'Invalid UUID format',
    strongPassword: 'Password must contain uppercase, lowercase, number and special character',
    passwordMatch: 'Passwords do not match',
    phoneNumber: 'Please enter a valid phone number',
    domain: 'Please enter a valid domain',
    slug: 'Invalid slug format (use lowercase letters, numbers, and hyphens)',
    json: 'Invalid JSON format',
    regex: 'Invalid regular expression',
    dateRange: 'End date must be after start date',
    fileSize: 'File size exceeds maximum allowed ({max})',
    fileType: 'File type not allowed',
    numeric: 'Must be a number',
    positive: 'Must be a positive number',
    integer: 'Must be a whole number'
  },
  es: {
    required: 'Este campo es obligatorio',
    email: 'Introduce una dirección de email válida',
    url: 'Introduce una URL válida',
    minLength: 'Debe tener al menos {min} caracteres',
    maxLength: 'No puede tener más de {max} caracteres',
    pattern: 'Formato inválido',
    uuid: 'Formato UUID inválido',
    strongPassword: 'La contraseña debe contener mayúscula, minúscula, número y carácter especial',
    passwordMatch: 'Las contraseñas no coinciden',
    phoneNumber: 'Introduce un número de teléfono válido',
    domain: 'Introduce un dominio válido',
    slug: 'Formato de slug inválido (usa letras minúsculas, números y guiones)',
    json: 'Formato JSON inválido',
    regex: 'Expresión regular inválida',
    dateRange: 'La fecha final debe ser posterior a la inicial',
    fileSize: 'El tamaño del archivo excede el máximo permitido ({max})',
    fileType: 'Tipo de archivo no permitido',
    numeric: 'Debe ser un número',
    positive: 'Debe ser un número positivo',
    integer: 'Debe ser un número entero'
  }
};

/**
 * Core Validation Functions
 */
export class InputValidators {
  private static getMessage(key: string, language: string = 'en', replacements?: Record<string, any>): string {
    const messages = validationMessages[language as keyof typeof validationMessages] || validationMessages.en;
    let message = messages[key as keyof typeof messages] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        message = message.replace(`{${placeholder}}`, value);
      });
    }
    
    return message;
  }

  /**
   * Required field validation
   */
  static required(value: any, options: ValidationOptions = {}): ValidationResult {
    const isEmpty = value === null || value === undefined || value === '' || 
      (Array.isArray(value) && value.length === 0);
    
    if (isEmpty) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('required', options.language),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * Email validation with suggestions
   */
  static email(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
      const suggestions: string[] = [];
      
      // Common domain suggestions
      if (value.includes('@') && !value.includes('.')) {
        const [username, domain] = value.split('@');
        const commonDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'];
        suggestions.push(...commonDomains.map(d => `${username}@${d}`));
      }
      
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('email', options.language),
        severity: 'error',
        suggestions
      };
    }
    
    return { isValid: true };
  }

  /**
   * URL validation
   */
  static url(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('url', options.language),
        severity: 'error',
        suggestions: value.startsWith('www.') ? [`https://${value}`] : [`https://${value}`]
      };
    }
  }

  /**
   * Length validation
   */
  static length(
    value: string, 
    min?: number, 
    max?: number, 
    options: ValidationOptions = {}
  ): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    if (min !== undefined && value.length < min) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('minLength', options.language, { min }),
        severity: 'error'
      };
    }
    
    if (max !== undefined && value.length > max) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('maxLength', options.language, { max }),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * Pattern validation
   */
  static pattern(
    value: string, 
    pattern: RegExp, 
    options: ValidationOptions = {}
  ): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    if (!pattern.test(value)) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('pattern', options.language),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * UUID validation
   */
  static uuid(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(value)) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('uuid', options.language),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * Strong password validation
   */
  static strongPassword(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;
    
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar || !isLongEnough) {
      const suggestions = [];
      if (!isLongEnough) suggestions.push('At least 8 characters');
      if (!hasUppercase) suggestions.push('Add uppercase letter');
      if (!hasLowercase) suggestions.push('Add lowercase letter');
      if (!hasNumber) suggestions.push('Add number');
      if (!hasSpecialChar) suggestions.push('Add special character');
      
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('strongPassword', options.language),
        severity: 'error',
        suggestions
      };
    }
    
    return { isValid: true };
  }

  /**
   * Password confirmation validation
   */
  static passwordMatch(
    password: string, 
    confirmation: string, 
    options: ValidationOptions = {}
  ): ValidationResult {
    if (password !== confirmation) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('passwordMatch', options.language),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * Phone number validation
   */
  static phoneNumber(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    // Simple international phone regex
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanValue = value.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(cleanValue)) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('phoneNumber', options.language),
        severity: 'error',
        suggestions: ['Include country code', 'Remove special characters except +']
      };
    }
    
    return { isValid: true };
  }

  /**
   * Domain validation
   */
  static domain(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    
    if (!domainRegex.test(value)) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('domain', options.language),
        severity: 'error',
        suggestions: ['Example: example.com', 'Do not include http://']
      };
    }
    
    return { isValid: true };
  }

  /**
   * Slug validation
   */
  static slug(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    
    if (!slugRegex.test(value)) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('slug', options.language),
        severity: 'error',
        suggestions: [
          'Use lowercase letters only',
          'Replace spaces with hyphens',
          'Remove special characters'
        ]
      };
    }
    
    return { isValid: true };
  }

  /**
   * JSON validation
   */
  static json(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    try {
      JSON.parse(value);
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('json', options.language),
        severity: 'error',
        suggestions: ['Check for missing quotes', 'Validate brackets and commas']
      };
    }
  }

  /**
   * Regular expression validation
   */
  static regex(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    try {
      new RegExp(value);
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('regex', options.language),
        severity: 'error',
        suggestions: ['Escape special characters', 'Check regex syntax']
      };
    }
  }

  /**
   * Numeric validation
   */
  static numeric(value: string, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && !value) return { isValid: true };
    
    if (isNaN(Number(value))) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('numeric', options.language),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * Positive number validation
   */
  static positive(value: string | number, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && (!value || value === '')) return { isValid: true };
    
    const numValue = typeof value === 'string' ? Number(value) : value;
    
    if (isNaN(numValue) || numValue <= 0) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('positive', options.language),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * Integer validation
   */
  static integer(value: string | number, options: ValidationOptions = {}): ValidationResult {
    if (!options.required && (!value || value === '')) return { isValid: true };
    
    const numValue = typeof value === 'string' ? Number(value) : value;
    
    if (isNaN(numValue) || !Number.isInteger(numValue)) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('integer', options.language),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * Date range validation
   */
  static dateRange(
    startDate: string | Date, 
    endDate: string | Date, 
    options: ValidationOptions = {}
  ): ValidationResult {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('dateRange', options.language),
        severity: 'error'
      };
    }
    
    return { isValid: true };
  }

  /**
   * File validation
   */
  static file(
    file: File,
    options: {
      maxSize?: number; // in bytes
      allowedTypes?: string[];
      language?: 'en' | 'es';
      customMessage?: string;
    } = {}
  ): ValidationResult {
    if (options.maxSize && file.size > options.maxSize) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('fileSize', options.language, { 
          max: this.formatFileSize(options.maxSize) 
        }),
        severity: 'error'
      };
    }
    
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: options.customMessage || this.getMessage('fileType', options.language),
        severity: 'error',
        suggestions: [`Allowed types: ${options.allowedTypes.join(', ')}`]
      };
    }
    
    return { isValid: true };
  }

  private static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }
}

/**
 * Validation chain builder for complex validations
 */
export class ValidationChain {
  private validations: Array<() => ValidationResult> = [];
  private stopOnFirstError = true;

  static create(): ValidationChain {
    return new ValidationChain();
  }

  continueOnError(): this {
    this.stopOnFirstError = false;
    return this;
  }

  required(value: any, options?: ValidationOptions): this {
    this.validations.push(() => InputValidators.required(value, options));
    return this;
  }

  email(value: string, options?: ValidationOptions): this {
    this.validations.push(() => InputValidators.email(value, options));
    return this;
  }

  length(value: string, min?: number, max?: number, options?: ValidationOptions): this {
    this.validations.push(() => InputValidators.length(value, min, max, options));
    return this;
  }

  custom(validator: () => ValidationResult): this {
    this.validations.push(validator);
    return this;
  }

  validate(): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    for (const validation of this.validations) {
      const result = validation();
      results.push(result);
      
      if (!result.isValid && this.stopOnFirstError) {
        break;
      }
    }
    
    return results;
  }

  isValid(): boolean {
    const results = this.validate();
    return results.every(result => result.isValid);
  }

  getFirstError(): ValidationResult | null {
    const results = this.validate();
    return results.find(result => !result.isValid) || null;
  }
}

/**
 * Exported validation utilities
 */
export const Validators = InputValidators;

/**
 * Usage examples:
 * 
 * // Simple validation
 * const emailResult = Validators.email('user@example.com', { language: 'es' });
 * 
 * // Validation chain
 * const isValid = ValidationChain.create()
 *   .required(email)
 *   .email(email)
 *   .isValid();
 * 
 * // Complex validation with suggestions
 * const passwordResult = Validators.strongPassword('weak', { language: 'en' });
 * // passwordResult.suggestions contains improvement tips
 */
