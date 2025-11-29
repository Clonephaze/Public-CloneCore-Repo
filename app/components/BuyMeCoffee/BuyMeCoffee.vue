<script setup lang="ts">
const isVisible = ref(false)
const isMobile = ref(false)

const checkScroll = () => {
    const contactSection = document.querySelector('#contact')
    if (!contactSection) return
    
    const contactTop = contactSection.getBoundingClientRect().top + window.scrollY
    const scrolled = window.scrollY
    
    isVisible.value = scrolled >= contactTop - window.innerHeight / 2
}

const checkMobile = () => {
    isMobile.value = window.matchMedia('(max-width: 768px)').matches
}

useThrottledResize(checkMobile);

onMounted(() => {
    if (import.meta.client) {
        checkMobile()
        checkScroll()
        window.addEventListener('scroll', checkScroll)
    }
})

onUnmounted(() => {
    if (import.meta.client) {
        window.removeEventListener('scroll', checkScroll)
    }
})
</script>

<template>
    <Transition name="bmc-fade">
        <a
            v-if="isVisible && !isMobile"
            href="https://buymeacoffee.com/clonephaze"
            target="_blank"
            rel="noopener noreferrer"
            class="bmc-button"
            aria-label="Buy me a coffee"
        >
            <img src="/bmc-brand-icon.svg" alt="Buy me a coffee" class="bmc-icon">
            <span class="bmc-tooltip">Buy me a coffee 🙂</span>
        </a>
    </Transition>

    <a
        v-if="isMobile"
        href="https://buymeacoffee.com/clonephaze"
        target="_blank"
        rel="noopener noreferrer"
        class="bmc-button mobile"
    >
        <img src="/bmc-brand-icon.svg" alt="Buy me a coffee" class="bmc-icon">
        <span class="bmc-text">Buy me a coffee 🙂</span>
    </a>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.bmc-button {
    position: fixed;
    z-index: 9998;
    background: var(--highlight-color);
    color: var(--bg-color);
    text-decoration: none;
    @include flex-center;
    transition: all $transition-base;
    cursor: pointer;
    box-shadow: $shadow-md;

    &:focus-visible {
        outline: 3px solid var(--text-color);
        outline-offset: 2px;
    }

    &:not(.mobile) {
        bottom: $spacing-xl;
        left: $spacing-3xl;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 3px solid var(--border-color);

        .bmc-icon {
            width: 32px;
            height: 32px;
        }

        .bmc-tooltip {
            position: absolute;
            left: 100%;
            margin-left: $spacing-md;
            background: var(--bg-color);
            color: var(--text-color);
            padding: $spacing-sm $spacing-md;
            border-radius: $radius-sm;
            border: 2px solid var(--border-color);
            white-space: nowrap;
            font-weight: 600;
            font-size: $font-size-small;
            opacity: 0;
            pointer-events: none;
            transition: opacity $transition-base;
            box-shadow: $shadow-sm;

            &::before {
                content: '';
                position: absolute;
                right: 100%;
                top: 50%;
                transform: translateY(-50%);
                border: 6px solid transparent;
                border-right-color: var(--border-color);
            }

            &::after {
                content: '';
                position: absolute;
                right: 100%;
                top: 50%;
                transform: translateY(-50%);
                margin-right: -2px;
                border: 6px solid transparent;
                border-right-color: var(--bg-color);
            }
        }

        &:hover {
            transform: translateY(-4px) scale(1.1);
            box-shadow: $shadow-lg;

            .bmc-tooltip {
                opacity: 1;
            }
        }
    }

    &.mobile {
        position: relative;
        width: 100%;
        max-width: 100%;
        padding: $spacing-md $spacing-lg;
        gap: $spacing-sm;
        border: 2px solid var(--border-color);
        border-radius: $radius-md;
        box-shadow: $shadow-md;
        box-sizing: border-box;
        margin-top: $spacing-lg;

        .bmc-icon {
            width: 28px;
            height: 28px;
            flex-shrink: 0;
        }

        .bmc-text {
            font-weight: 700;
            font-size: $font-size-body;
        }

        &:active {
            transform: scale(0.98);
        }
    }
}

.bmc-fade-enter-active,
.bmc-fade-leave-active {
    transition: all $transition-base;
}

.bmc-fade-enter-from {
    opacity: 0;
    
    &:not(.mobile) {
        transform: translateX(-100%);
    }
    
    &.mobile {
        transform: translateY(100%);
    }
}

.bmc-fade-leave-to {
    opacity: 0;
    
    &:not(.mobile) {
        transform: translateX(-100%);
    }
    
    &.mobile {
        transform: translateY(100%);
    }
}
</style>
