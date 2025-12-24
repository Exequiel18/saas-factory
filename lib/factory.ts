export const factory = {
    generate: async (intent: string) => {
        return {
            success: true,
            message: `Generated solution for intent: ${intent}`
        }
    }
}
export const intuitSolution = factory.generate
export default factory
