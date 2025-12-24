export const supabase = {
    from: (table: string) => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ error: null })
    })
}
export const supabaseAdmin = supabase
export const saveAutonomousDecision = async () => ({ error: null })
export const saveSystemLog = async () => ({ error: null })
export const getActionPulse = async () => []
export const saveSystemLearning = async () => ({ error: null })
export const saveActionExecution = async () => ({ error: null })
export default supabase
