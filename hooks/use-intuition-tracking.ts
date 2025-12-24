export const useIntuitionTracking = () => {
    return {
        track: (event: string, data?: any) => console.log('Intuition Event:', event, data)
    }
}
export const useBehavioralTracking = useIntuitionTracking
