export function useScrollPosition() {
    const gridRef = ref<HTMLElement | null>(null)
    const scrollPosition = ref<'start' | 'middle' | 'end'>('start')

    const updateScrollPosition = () => {
        if (!gridRef.value) return

        const { scrollLeft, scrollWidth, clientWidth } = gridRef.value
        const paddingLeft = 32
        const threshold = paddingLeft + 10

        if (scrollLeft <= threshold) {
            scrollPosition.value = 'start'
        } else if (scrollLeft + clientWidth >= scrollWidth - threshold) {
            scrollPosition.value = 'end'
        } else {
            scrollPosition.value = 'middle'
        }
    }

    onMounted(() => {
        if (gridRef.value) {
            gridRef.value.addEventListener('scroll', updateScrollPosition)
            updateScrollPosition()
        }
    })

    onUnmounted(() => {
        if (gridRef.value) {
            gridRef.value.removeEventListener('scroll', updateScrollPosition)
        }
    })

    return { gridRef, scrollPosition }
}
