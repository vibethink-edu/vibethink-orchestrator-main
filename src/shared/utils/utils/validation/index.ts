/**
 * Utilidades de validación centralizadas que eliminan boilerplate común
 * 
 * Incluye validadores comunes y función de validación composable
 */

export interface ValidationRule {
  (value: any, formData?: Record<string, any>): string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  firstError: string | null;
}

/**
 * Validadores comunes reutilizables
 */
export const validators = {
  /**
   * Campo requerido
   */
  required: (message = 'Este campo es requerido'): ValidationRule => (value: any) => {
    if (value === null || value === undefined) return message;
    if (typeof value === 'string' && value.trim() === '') return message;
    if (Array.isArray(value) && value.length === 0) return message;
    return null;
  },

  /**
   * Validación de email
   */
  email: (message = 'Email inválido'): ValidationRule => (value: string) => {
    if (!value) return null; // Si está vacío, usar required validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  /**
   * Longitud mínima
   */
  minLength: (min: number, message?: string): ValidationRule => (value: string) => {
    if (!value) return null;
    const msg = message || `Mínimo ${min} caracteres`;
    return value.length >= min ? null : msg;
  },

  /**
   * Longitud máxima
   */
  maxLength: (max: number, message?: string): ValidationRule => (value: string) => {
    if (!value) return null;
    const msg = message || `Máximo ${max} caracteres`;
    return value.length <= max ? null : msg;
  },

  /**
   * Longitud exacta
   */
  exactLength: (length: number, message?: string): ValidationRule => (value: string) => {
    if (!value) return null;
    const msg = message || `Debe tener exactamente ${length} caracteres`;
    return value.length === length ? null : msg;
  },

  /**
   * Validación de teléfono
   */
  phone: (message = 'Teléfono inválido'): ValidationRule => (value: string) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleaned = value.replace(/\s/g, '');
    return phoneRegex.test(cleaned) ? null : message;
  },

  /**
   * Validación de URL
   */
  url: (message = 'URL inválida'): ValidationRule => (value: string) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  /**
   * Validación de número
   */
  number: (message = 'Debe ser un número'): ValidationRule => (value: any) => {
    if (!value) return null;
    return !isNaN(Number(value)) ? null : message;
  },

  /**
   * Número mínimo
   */
  minNumber: (min: number, message?: string): ValidationRule => (value: any) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) return 'Debe ser un número';
    const msg = message || `Debe ser mayor o igual a ${min}`;
    return num >= min ? null : msg;
  },

  /**
   * Número máximo
   */
  maxNumber: (max: number, message?: string): ValidationRule => (value: any) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) return 'Debe ser un número';
    const msg = message || `Debe ser menor o igual a ${max}`;
    return num <= max ? null : msg;
  },

  /**
   * Validación de fecha
   */
  date: (message = 'Fecha inválida'): ValidationRule => (value: any) => {
    if (!value) return null;
    const date = new Date(value);
    return !isNaN(date.getTime()) ? null : message;
  },

  /**
   * Fecha mínima
   */
  minDate: (minDate: Date, message?: string): ValidationRule => (value: any) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    const msg = message || `La fecha debe ser posterior a ${minDate.toLocaleDateString()}`;
    return date >= minDate ? null : msg;
  },

  /**
   * Fecha máxima
   */
  maxDate: (maxDate: Date, message?: string): ValidationRule => (value: any) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    const msg = message || `La fecha debe ser anterior a ${maxDate.toLocaleDateString()}`;
    return date <= maxDate ? null : msg;
  },

  /**
   * Validación de contraseña
   */
  password: (message = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'): ValidationRule => (value: string) => {
    if (!value) return null;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value) ? null : message;
  },

  /**
   * Validación de confirmación de contraseña
   */
  confirmPassword: (passwordField: string, message = 'Las contraseñas no coinciden'): ValidationRule => (value: string, formData?: Record<string, any>) => {
    if (!value) return null;
    if (!formData) return message;
    return value === formData[passwordField] ? null : message;
  },

  /**
   * Validación de regex personalizada
   */
  pattern: (regex: RegExp, message: string): ValidationRule => (value: string) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  },

  /**
   * Validación de valores permitidos
   */
  oneOf: (allowedValues: any[], message?: string): ValidationRule => (value: any) => {
    if (!value) return null;
    const msg = message || `Debe ser uno de: ${allowedValues.join(', ')}`;
    return allowedValues.includes(value) ? null : msg;
  },

  /**
   * Validación personalizada
   */
  custom: (validator: (value: any, formData?: Record<string, any>) => string | null): ValidationRule => validator,
};

/**
 * Función principal de validación
 * 
 * @param value - Valor a validar
 * @param rules - Array de reglas de validación
 * @param formData - Datos del formulario completo (para validaciones que dependen de otros campos)
 * @returns Resultado de la validación
 * 
 * @example
 * ```tsx
 * const result = validate(email, [
 *   validators.required(),
 *   validators.email(),
 *   validators.maxLength(100)
 * ]);
 * 
 * if (!result.isValid) {
 *   console.log(result.firstError);
 * }
 * ```
 */
export const validate = (
  value: any, 
  rules: ValidationRule[], 
  formData?: Record<string, any>
): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    const error = rule(value, formData);
    if (error) {
      errors.push(error);
      // Parar en el primer error si es una validación crítica
      if (error.includes('requerido') || error.includes('inválido')) {
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    firstError: errors[0] || null,
  };
};

/**
 * Validar formulario completo
 * 
 * @param formData - Datos del formulario
 * @param validationSchema - Esquema de validación por campo
 * @returns Resultado de validación del formulario
 * 
 * @example
 * ```tsx
 * const schema = {
 *   email: [validators.required(), validators.email()],
 *   password: [validators.required(), validators.password()],
 *   confirmPassword: [validators.required(), validators.confirmPassword('password')]
 * };
 * 
 * const result = validateForm(formData, schema);
 * ```
 */
export const validateForm = (
  formData: Record<string, any>,
  validationSchema: Record<string, ValidationRule[]>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [field, rules] of Object.entries(validationSchema)) {
    results[field] = validate(formData[field], rules, formData);
  }

  return results;
};

/**
 * Verificar si un formulario es válido
 */
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

/**
 * Obtener todos los errores de un formulario
 */
export const getFormErrors = (validationResults: Record<string, ValidationResult>): string[] => {
  return Object.values(validationResults)
    .flatMap(result => result.errors)
    .filter(Boolean);
}; 