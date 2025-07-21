/**
 * Fixed Validators System for VibeThink 1.0
 * 
 * Sistema de validación corregido con interfaces consistentes
 * 
 * @author VibeThink Platform Team
 * @version 1.0.0
 */

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  firstError: string | null;
}

// Validation rule interface
export interface ValidationRule {
  validate: (value: any, formData?: Record<string, any>) => ValidationResult;
  message: string;
}

// Form validation result
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Helper to create validation result
const createResult = (isValid: boolean, error?: string): ValidationResult => ({
  isValid,
  errors: error ? [error] : [],
  firstError: error || null
});

// Common validation rules
export const validators = {
  /**
   * Required field validation
   */
  required: (message?: string): ValidationRule => ({
    validate: (value: any): ValidationResult => {
      const isValid = value !== null && value !== undefined && value !== '';
      return createResult(isValid, isValid ? undefined : (message || 'Este campo es requerido'));
    },
    message: message || 'Este campo es requerido'
  }),

  /**
   * Email validation
   */
  email: (message?: string): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      if (!value) return createResult(true); // Let required handle empty values
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      
      return createResult(isValid, isValid ? undefined : (message || 'Email inválido'));
    },
    message: message || 'Email inválido'
  }),

  /**
   * Password validation
   */
  password: (message?: string): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      if (!value) return createResult(true);
      
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      
      const isValid = value.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
      
      return createResult(isValid, isValid ? undefined : (message || 'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales'));
    },
    message: message || 'Contraseña inválida'
  }),

  /**
   * Confirm password validation
   */
  confirmPassword: (passwordField: string, message?: string): ValidationRule => ({
    validate: (value: string, formData?: Record<string, any>): ValidationResult => {
      if (!value) return createResult(true);
      
      const password = formData?.[passwordField];
      const isValid = value === password;
      
      return createResult(isValid, isValid ? undefined : (message || 'Las contraseñas no coinciden'));
    },
    message: message || 'Las contraseñas no coinciden'
  }),

  /**
   * Minimum length validation
   */
  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      if (!value) return createResult(true);
      
      const isValid = value.length >= min;
      
      return createResult(isValid, isValid ? undefined : (message || `Mínimo ${min} caracteres`));
    },
    message: message || `Mínimo caracteres`
  }),

  /**
   * Maximum length validation
   */
  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      if (!value) return createResult(true);
      
      const isValid = value.length <= max;
      
      return createResult(isValid, isValid ? undefined : (message || `Máximo ${max} caracteres`));
    },
    message: message || `Máximo caracteres`
  }),

  /**
   * Phone number validation
   */
  phone: (message?: string): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      if (!value) return createResult(true);
      
      // Remove all non-digit characters
      const cleanValue = value.replace(/\D/g, '');
      const isValid = cleanValue.length >= 10 && cleanValue.length <= 15;
      
      return createResult(isValid, isValid ? undefined : (message || 'Número de teléfono inválido'));
    },
    message: message || 'Número de teléfono inválido'
  }),

  /**
   * URL validation
   */
  url: (message?: string): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      if (!value) return createResult(true);
      
      try {
        new URL(value);
        return createResult(true);
      } catch {
        return createResult(false, message || 'URL inválida');
      }
    },
    message: message || 'URL inválida'
  }),

  /**
   * Number validation
   */
  number: (message?: string): ValidationRule => ({
    validate: (value: any): ValidationResult => {
      if (!value) return createResult(true);
      
      const isValid = !isNaN(Number(value));
      
      return createResult(isValid, isValid ? undefined : (message || 'Debe ser un número'));
    },
    message: message || 'Debe ser un número'
  }),

  /**
   * Minimum value validation
   */
  min: (min: number, message?: string): ValidationRule => ({
    validate: (value: any): ValidationResult => {
      if (!value) return createResult(true);
      
      const numValue = Number(value);
      const isValid = !isNaN(numValue) && numValue >= min;
      
      return createResult(isValid, isValid ? undefined : (message || `Valor mínimo: ${min}`));
    },
    message: message || `Valor mínimo`
  }),

  /**
   * Maximum value validation
   */
  max: (max: number, message?: string): ValidationRule => ({
    validate: (value: any): ValidationResult => {
      if (!value) return createResult(true);
      
      const numValue = Number(value);
      const isValid = !isNaN(numValue) && numValue <= max;
      
      return createResult(isValid, isValid ? undefined : (message || `Valor máximo: ${max}`));
    },
    message: message || `Valor máximo`
  })
};

// Validation function
export function validate(value: any, rules: ValidationRule[], formData?: Record<string, any>): ValidationResult {
  for (const rule of rules) {
    const result = rule.validate(value, formData);
    if (!result.isValid) {
      return result;
    }
  }
  
  return createResult(true);
}

// Form validation function
export function validateForm(formData: Record<string, any>, schema: Record<string, ValidationRule[]>): FormValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const result = validate(formData[field], rules, formData);
    if (!result.isValid) {
      errors[field] = result.firstError!;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Helper functions
export function isFormValid(result: FormValidationResult): boolean {
  return result.isValid;
}

export function getFirstError(result: FormValidationResult): string | null {
  const firstErrorField = Object.keys(result.errors)[0];
  return firstErrorField ? result.errors[firstErrorField] : null;
}

export function clearFormErrors(): FormValidationResult {
  return { isValid: true, errors: {} };
} 