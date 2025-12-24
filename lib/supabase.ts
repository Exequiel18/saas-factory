// Mock implementation for build time
// In production, this should use the real Supabase client
const createMockQuery = () => {
  const queryBuilder = {
    eq: (column: string, value: any) => queryBuilder,
    gte: (column: string, value: any) => queryBuilder,
    lte: (column: string, value: any) => queryBuilder,
    data: [],
    error: null,
    count: 0
  }
  
  return {
    select: (columns?: string, options?: { count?: string; head?: boolean }) => {
      // Si tiene opciones (count, head), devolver resultado directo
      if (options?.count || options?.head) {
        return {
          data: null,
          error: null,
          count: 0
        }
      }
      // Si no, devolver query builder
      return queryBuilder
    },
    insert: (values: any) => ({ error: null, data: null }),
    update: (values: any) => queryBuilder,
    delete: () => queryBuilder
  }
}

export const supabase = {
  from: (table: string) => createMockQuery()
}

export const supabaseAdmin = supabase

export const saveAutonomousDecision = async (data: any) => ({ error: null, id: 'mock-id' })
export const saveSystemLog = async (data: any) => ({ error: null, id: 'mock-id' })
export const getActionPulse = async () => []
export const saveSystemLearning = async (data: any) => ({ error: null, id: 'mock-id' })
export const saveActionExecution = async (data: any) => ({ error: null, id: 'mock-id' })

export default supabase
