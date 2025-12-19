'use client'

// Mock Supabase Client for Development
// TODO: Replace with actual Supabase implementation

interface MockQueryBuilder {
  select: (columns: string) => MockQueryBuilder
  eq: (column: string, value: any) => MockQueryBuilder
  gte: (column: string, value: any) => MockQueryBuilder
  lte: (column: string, value: any) => MockQueryBuilder
  order: (column: string, options?: any) => MockQueryBuilder
  limit: (count: number) => Promise<{ data: any[], error: any }>
}

const createMockQueryBuilder = (): MockQueryBuilder => ({
  select: () => createMockQueryBuilder(),
  eq: () => createMockQueryBuilder(),
  gte: () => createMockQueryBuilder(),
  lte: () => createMockQueryBuilder(),
  order: () => createMockQueryBuilder(),
  limit: async () => ({ data: [], error: null })
})

export const supabase = {
  from: (tableName: string) => createMockQueryBuilder()
}