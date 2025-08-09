/**
 * VTHINK DATABASE ADAPTER - Capa de compatibilidad universal
 * Permite transición perfecta entre mock y real Supabase
 */

import { VTDatabaseClient, VTQueryBuilder, VTQueryResponse } from '../types/database-compatibility';

// ✅ MOCK QUERY BUILDER - Compatible con Supabase real
class MockQueryBuilder<T> implements VTQueryBuilder<T> {
  private table: string;
  private fields: string = '*';
  private conditions: Array<{ field: string; value: any }> = [];

  constructor(table: string) {
    this.table = table;
  }

  select(fields: string = '*'): VTQueryBuilder<T> {
    this.fields = fields;
    return this;
  }

  eq(field: string, value: any): VTQueryBuilder<T> {
    this.conditions.push({ field, value });
    return this;
  }

  async then(callback: (result: VTQueryResponse<T>) => void): Promise<VTQueryResponse<T>> {
    // Simular delay de DB real para testing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const mockData = this.generateMockData() as unknown as T;
    const response: VTQueryResponse<T> = {
      data: mockData,
      error: null
    };
    
    callback(response);
    return response;
  }

  async single(): Promise<VTQueryResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, 5));
    
    const mockData = this.generateMockData();
    return {
      data: Array.isArray(mockData) ? mockData[0] : mockData,
      error: null
    };
  }

  private generateMockData(): T | T[] {
    // Mock data basado en tabla
    const mockDataMap: Record<string, any> = {
      users: [{
        id: 'mock-user-1',
        company_id: 'mock-company-1',
        email: 'user@vibethink.com',
        role: 'ADMIN',
        name: 'Test User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }],
      projects: [{
        id: 'mock-project-1',
        company_id: 'mock-company-1',
        name: 'VibeThink Dashboard',
        description: 'Main dashboard project',
        status: 'active',
        created_by: 'mock-user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }],
      // Agregar más según se necesite
    };

    return mockDataMap[this.table] || [];
  }
}

// ✅ MOCK DATABASE CLIENT
class MockDatabaseClient implements VTDatabaseClient {
  from<T = any>(table: string) {
    return {
      select: (fields?: string) => new MockQueryBuilder<T[]>(table).select(fields),
      insert: (data: Partial<T>) => new MockQueryBuilder<T>(table),
      update: (data: Partial<T>) => new MockQueryBuilder<T>(table),
      delete: () => new MockQueryBuilder<T>(table)
    };
  }
}

// ✅ FACTORY PATTERN - Auto-detect mock vs real
export function createDatabaseClient(): VTDatabaseClient {
  // En desarrollo: usar mock
  // En producción: usar real Supabase client
  const isProduction = process.env.NODE_ENV === 'production';
  const useRealDB = process.env.VTHINK_USE_REAL_DB === 'true';
  
  if (isProduction && useRealDB) {
    // TODO: Return real Supabase client when ready
    console.log('🔄 Using Real Supabase Client');
    // return createSupabaseClient();
  }
  
  console.log('🔧 Using Mock Database Client');
  return new MockDatabaseClient();
}

// ✅ PERFORMANCE WRAPPER
export function withPerformanceTracking<T>(
  operation: string,
  queryPromise: Promise<VTQueryResponse<T>>
): Promise<VTQueryResponse<T>> {
  const start = performance.now();
  
  return queryPromise
    .then(result => {
      const duration = performance.now() - start;
      console.log(`⚡ DB ${operation}: ${duration.toFixed(2)}ms`);
      return result;
    })
    .catch(error => {
      const duration = performance.now() - start;
      console.error(`❌ DB ${operation} failed after ${duration.toFixed(2)}ms:`, error);
      return { data: null, error };
    });
}

// ✅ EXPORT DEFAULT INSTANCE
export const db = createDatabaseClient();
export default db;