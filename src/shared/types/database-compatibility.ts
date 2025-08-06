/**
 * VTHINK DATABASE COMPATIBILITY LAYER
 * 
 * Permite transición fluida entre mock y base de datos real
 * Mantiene rendimiento optimal en desarrollo y producción
 */

// ✅ TIPOS COMPATIBLES - Funcionan con mock Y real DB
export interface VTQueryResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface VTQueryBuilder<T> {
  select(fields?: string): VTQueryBuilder<T>;
  eq(field: string, value: any): VTQueryBuilder<T>;
  then(callback: (result: VTQueryResponse<T>) => void): Promise<VTQueryResponse<T>>;
  single(): Promise<VTQueryResponse<T>>;
}

// ✅ INTERFAZ UNIVERSAL - Mock o Real Supabase
export interface VTDatabaseClient {
  from<T = any>(table: string): {
    select(fields?: string): VTQueryBuilder<T[]>;
    insert(data: Partial<T>): VTQueryBuilder<T>;
    update(data: Partial<T>): VTQueryBuilder<T>;
    delete(): VTQueryBuilder<T>;
  };
}

// ✅ TIPOS DE DATOS - Compatibles con estructura real
export interface VTBaseEntity {
  id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface VTUser extends VTBaseEntity {
  email: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';
  name?: string;
  avatar_url?: string;
}

export interface VTProject extends VTBaseEntity {
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  created_by: string;
}

// ✅ RESPONSE WRAPPERS - Para transición fácil
export type VTMockResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: Error;
};

export type VTRealResponse<T> = {
  data: T;
  error: null;
} | {
  data: null; 
  error: {
    message: string;
    code?: string;
  };
};

// ✅ UTILS PARA TRANSICIÓN
export const createCompatibleError = (message: string): Error => {
  return new Error(message);
};

export const isValidResponse = <T>(response: VTQueryResponse<T>): response is { data: T; error: null } => {
  return response.error === null && response.data !== null;
};

// ✅ PERFORMANCE HELPERS
export const withPerformanceLogging = <T>(
  operation: string,
  promise: Promise<VTQueryResponse<T>>
): Promise<VTQueryResponse<T>> => {
  const start = performance.now();
  
  return promise.then((result) => {
    const duration = performance.now() - start;
    console.log(`⚡ ${operation}: ${duration.toFixed(2)}ms`);
    return result;
  });
};

/**
 * 🎯 BENEFICIOS DE ESTE APPROACH:
 * 
 * ✅ RENDIMIENTO: Tipos optimizados para desarrollo rápido
 * ✅ COMPATIBILIDAD: Funciona con mock Y real DB sin cambios
 * ✅ MIGRACIÓN FÁCIL: Solo cambiar el client, tipos quedan igual
 * ✅ DEBUGGING: Performance logging incluido
 * ✅ TIPO SAFETY: TypeScript completo en ambos modos
 */