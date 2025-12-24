export const intuition = {
    get: (signal: string) => ({ probability: 0.5 }),
    track: () => console.log('Tracking intuition...')
}
export const IntuitionEngine = intuition
export default intuition
