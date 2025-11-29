<script setup lang="ts">
interface ModalProps {
    show: boolean
    title?: string
    images?: string[]
    description?: string
    externalLink?: string
}

const props = defineProps<ModalProps>()
const emit = defineEmits<{
    close: []
}>()

const modalContent = ref<HTMLElement | null>(null)
const currentImageIndex = ref(0)

const closeModal = () => {
    emit('close')
    currentImageIndex.value = 0
}

const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
        closeModal()
    }
}

const handleKeydown = (event: KeyboardEvent) => {
    if (!props.show) return

    if (event.key === 'Escape') {
        closeModal()
    } else if (event.key === 'ArrowRight' && props.images && props.images.length > 1) {
        nextImage()
    } else if (event.key === 'ArrowLeft' && props.images && props.images.length > 1) {
        prevImage()
    }
}

const nextImage = () => {
    if (props.images && currentImageIndex.value < props.images.length - 1) {
        currentImageIndex.value++
    }
}

const prevImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    }
}

const trapFocus = (event: KeyboardEvent) => {
    if (!props.show || !modalContent.value) return

    const focusableElements = modalContent.value.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (!firstElement || !lastElement) return

    if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus()
            event.preventDefault()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus()
            event.preventDefault()
        }
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('keydown', trapFocus)
})

watch(() => props.show, (newValue) => {
    if (newValue) {
        document.body.style.overflow = 'hidden'
        nextTick(() => {
            modalContent.value?.focus()
        })
        if (props.images && props.images.length > 1) {
            props.images.forEach((src, index) => {
                if (index !== 0) {
                    const img = new Image()
                    img.src = src
                }
            })
        }
    } else {
        document.body.style.overflow = ''
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="modal-backdrop" @click="handleBackdropClick">
                <div ref="modalContent" class="modal-content" role="dialog" aria-modal="true" :aria-label="title || 'Modal dialog'" tabindex="-1">
                    <button class="modal-close" aria-label="Close modal" @click="closeModal">
                        <Icon name="tabler:x" />
                    </button>

                    <h2 v-if="title" class="modal-title">{{ title }}</h2>

                    <div v-if="images && images.length > 0" class="modal-gallery">
                        <div class="gallery-viewer">
                            <NuxtImg :src="images[currentImageIndex]" :alt="`${title} - Image ${currentImageIndex + 1}`" loading="lazy" />
                        
                            <div v-if="images.length > 1" class="gallery-controls">
                                <button 
                                    class="gallery-btn prev"
                                    aria-label="Previous image"
                                    :disabled="currentImageIndex === 0"
                                    @click="prevImage"
                                >
                                    <Icon name="tabler:chevron-left" />
                                </button>
                                <span class="gallery-counter">{{ currentImageIndex + 1 }} / {{ images.length }}</span>
                                <button 
                                    class="gallery-btn next"
                                    aria-label="Next image"
                                    :disabled="currentImageIndex === images.length - 1"
                                    @click="nextImage"
                                >
                                    <Icon name="tabler:chevron-right" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <p v-if="description" class="modal-description">{{ description }}</p>

                    <a v-if="externalLink" :href="externalLink" target="_blank" rel="noopener noreferrer" class="modal-link">
                        View Project <Icon name="tabler:external-link" />
                    </a>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    @include flex-center;
    z-index: 9999;
    padding: $spacing-md;
    box-sizing: border-box;
    overflow-y: auto;
}

.modal-content {
    background: var(--bg-color);
    border: 2px solid var(--border-color);
    border-radius: $radius-lg;
    padding: $spacing-xl;
    width: min(800px, calc(100vw - 2rem));
    max-width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    box-shadow: $shadow-xl;
    box-sizing: border-box;

    @include respond-below($breakpoint-sm) {
        padding: $spacing-lg;
        max-height: calc(100vh - 2rem);
    }

    &:focus {
        outline: 3px solid var(--highlight-color);
        outline-offset: 2px;
    }
}

.modal-close {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
    background: transparent;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: 1.5rem;
    padding: $spacing-sm;
    @include flex-center;
    border-radius: $radius-sm;
    transition: background $transition-fast;

    &:hover {
        background: var(--border-color);
    }

    @include focus-visible-highlight;
}

.modal-title {
    font-size: $font-size-subtitle;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: $spacing-lg;
    padding-right: $spacing-2xl;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.modal-gallery {
    margin-bottom: $spacing-lg;

    .gallery-viewer {
        position: relative;

        img {
            width: 100%;
            height: auto;
            border-radius: $radius-sm;
            max-height: 60vh;
            object-fit: contain;
        }

        .gallery-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: $spacing-md;
            margin-top: $spacing-md;

            .gallery-btn {
                background: var(--border-color);
                border: none;
                color: var(--text-color);
                cursor: pointer;
                padding: $spacing-sm;
                border-radius: $radius-sm;
                @include flex-center;
                transition: background $transition-fast;

                &:hover:not(:disabled) {
                    background: var(--highlight-color);
                }

                &:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                @include focus-visible-highlight;
            }

            .gallery-counter {
                color: var(--text-color);
                font-weight: 600;
            }
        }
    }
}

.modal-description {
    color: var(--text-color);
    line-height: 1.6;
    margin-bottom: $spacing-lg;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.modal-link {
    @include button-secondary;
    padding: $spacing-sm $spacing-lg;
}

// Modal transitions
.modal-enter-active,
.modal-leave-active {
    transition: opacity $transition-base;

    .modal-content {
        transition: transform $transition-base;
    }
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;

    .modal-content {
        transform: scale(0.9);
    }
}
</style>
