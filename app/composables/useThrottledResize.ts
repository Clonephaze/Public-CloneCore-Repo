/**
 * A composable that executes a callback function on window resize events with throttling.
 * 
 * The callback is throttled to prevent excessive calls during rapid resize events.
 * Event listeners are automatically added on mount and removed on unmount.
 * 
 * @param callback - The function to execute on resize events
 * @param delay - The throttle delay in milliseconds (default: 150)
 */
export function useThrottledResize(callback: () => void, delay = 150) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    
    const throttled = () => {
        if (timeoutId) return
        timeoutId = setTimeout(() => {
            callback()
            timeoutId = null
        }, delay)
    }
    
    onMounted(() => window.addEventListener('resize', throttled))
    onUnmounted(() => window.removeEventListener('resize', throttled))
}