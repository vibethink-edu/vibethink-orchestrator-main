'use client'

// Mock React Query for Development
// TODO: Replace with actual React Query implementation

interface UseQueryOptions {
  queryKey: any[]
  queryFn: () => Promise<any>
  enabled?: boolean
  staleTime?: number
  gcTime?: number
}

interface UseQueryResult<T> {
  data: T
  isLoading: boolean
  isError: boolean
  error: any
  refetch: () => void
}

export const useQuery = <T = any>(options: UseQueryOptions): UseQueryResult<T> => {
  return {
    data: [] as T,
    isLoading: false,
    isError: false,
    error: null,
    refetch: () => {}
  }
}