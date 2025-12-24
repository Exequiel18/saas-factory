export const n8n = {
    trigger: async (webhook: string, data: any) => ({ success: true }),
    sendSignal: (signal: string) => console.log('n8n Signal:', signal)
}
export const sendAIMetricsToN8n = async () => ({ success: true })
export const sendSignalToN8n = async () => ({ success: true })
export default n8n
