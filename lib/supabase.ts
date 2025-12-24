// Mock implementation for build time
// In production, this should use the real Supabase client
const createMockQuery = () => ({
  select: (columns?: string, options?: { count?: string; head?: boolean }) => ({
    eq: (column: string, value: any) => createMockQuery(),
    gte: (column: string, value: any) => createMockQuery(),
    lte: (column: string, value: any) => createMockQuery(),
    data: [],
    error: null,
    count: 0
  }),
  insert: (values: any) => ({ error: null, data: null }),
  update: (values: any) => createMockQuery(),
  delete: () => createMockQuery()
})

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
