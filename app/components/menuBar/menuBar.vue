<script setup lang="ts">
const colorMode = useColorMode();
const colorPreference = computed(() => colorMode.value);
const isMenuOpen = ref(false);
const hamburger = ref<HTMLElement | null>(null);
const isMobile = ref<boolean>(false);
const icon = ref<HTMLImageElement | null>(null);
const navWrapper = ref<HTMLElement | null>(null);

watch(colorPreference, (newVal) => {
    if (icon.value && newVal) {
        icon.value.setAttribute('data-color-preference', newVal);
    }
}, { immediate: true });

const checkMobile = () => {
    if (import.meta.client) {
        isMobile.value = window.innerWidth < 768;

        if (!isMobile.value) {
            isMenuOpen.value = false;
        }
    }
};

useThrottledResize(checkMobile);

const toggleMenu = (): void => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = (): void => {
    if (isMenuOpen.value) toggleMenu();
};

const handleClicks = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const isClickOutsideMenu = !navWrapper.value?.contains(target);
    const isThemeToggle = target.closest('.theme-toggle');
    const isMenuToggle = target.closest('.menu-toggle');
    const isThemeWrapper = target.closest('.theme-wrapper');
    const isNavLink = target.closest('.nav-button');

    if (isMenuOpen.value && isClickOutsideMenu && !isThemeToggle && !isMenuToggle && !isThemeWrapper) {
        closeMenu();
    } else if (isMenuOpen.value && isNavLink) {
        closeMenu();
    }
};

onMounted(() => {
    checkMobile();
    document.addEventListener('click', handleClicks);

    if (icon.value && colorMode.value) {
        icon.value.setAttribute('data-color-preference', colorMode.value);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClicks);
});
</script>

<template>
    <header class="menuBar">
        <img ref="icon" :data-color-preference="colorPreference" src="/clone-coreUpdated.svg" class="icon" alt="" width="40" height="40">
        <button class="menu-toggle" aria-label="Toggle Navigation Menu" :aria-expanded="isMenuOpen" @click="toggleMenu">
            <div ref="hamburger" class="hamburger">
                <div class="hamburger-bar top" />
                <div class="hamburger-bar middle" />
                <div class="hamburger-bar bottom" />
                <div class="cross left" />
                <div class="cross right" />
            </div>
        </button>

        <div ref="navWrapper" class="nav-wrapper" :class="{ open: isMenuOpen }">
            <ClientOnly>
                <navigationBar />
            </ClientOnly>
            <themeSelector />
        </div>
    </header>
</template>

<style lang="scss">
@use "sass:color";
@use "~/assets/styles/mixins" as *;

.menuBar {
    display: flex;
    max-height: $navbar-height;
    width: 100vw;
    min-width: 100%;
    justify-content: space-between;
    align-items: center;
    padding-inline: $spacing-md;
    padding-block: $spacing-lg;
    z-index: 2;
    position: fixed;
    top: 0;
    box-sizing: border-box;

    .icon {
        width: 3rem;
        height: 3rem;
        z-index: 2;

        &[data-color-preference="light"] {
            filter: drop-shadow(-2px 2px 3px rgba(0, 0, 0, 0.633));
        }

        &[data-color-preference="dark"] {
            filter: drop-shadow(2px -2px 3px var(--border-color));
        }

        &[data-color-preference="sepia"] {
            filter: sepia(0.6) drop-shadow(-2px 2px 3px rgba(0, 0, 0, 0.633));
        }

        &[data-color-preference="contrast"] {
            filter: unset;
        }
    }

    &::before {
        position: absolute;
        content: "";
        inset: 0;
        background-color: var(--sub-bg-color);
        backdrop-filter: blur(6px);
        border-radius: 0 0 $radius-lg $radius-lg;
        opacity: 0.8;
    }

    @include respond-below($breakpoint-md) {
        min-height: 2rem;

        &::before {
            border-radius: 0;
        }
    }
}

.nav-wrapper {
    display: inline-flex;
    width: 100%;
    z-index: 2;

    @include respond-below($breakpoint-md) {
        opacity: 0;
        pointer-events: none;
        --menu-width: 300px;
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: var(--menu-width);
        padding: $spacing-3xl $spacing-md $spacing-md;
        overflow-y: auto;
        z-index: 999;
        backdrop-filter: blur(16px);
        box-shadow: $shadow-md;
        display: grid;
        grid-template-columns: 1fr 45px;
        transform: translateX(100%);
        transition: transform $transition-base, opacity $transition-base;

        &.open {
            transform: translateX(0);
            opacity: 1;
            pointer-events: auto;
        }

        &::before {
            position: absolute;
            content: "";
            inset: 0;
            opacity: 0.6;
            background-color: var(--sub-bg-color);
            backdrop-filter: blur(16px);
        }
    }
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;

    @include respond-below($breakpoint-md) {
        display: block;
        position: fixed;
        top: $spacing-md;
        right: $spacing-sm;
        z-index: 9999;
    }
}

.hamburger {
    display: grid;
    place-items: center;
    overflow: clip;
    position: relative;
    width: 2rem;
    height: 2rem;

    >div {
        width: 28px;
        height: 3px;
        border-radius: 50px;
        background-color: currentColor;
        position: absolute;
        transform: translateY(-8px);
        transform-origin: right;

        &.top {
            transition: scale $transition-fast;
            transition-delay: 100ms;
        }

        &.middle {
            transform: translateY(0);
            transition: scale $transition-fast;
            transition-delay: 50ms;
        }

        &.bottom {
            transform: translateY(8px);
            transition: scale $transition-fast;
            transition-delay: 0ms;
        }

        &.cross {
            transform-origin: center;
            transform: rotate(90deg);
            opacity: 0;
            transition: opacity $transition-fast 0ms, transform $transition-fast;
        }
    }

    [aria-expanded="true"] & {
        >div {
            &.top {
                scale: 0 1;
                transition-delay: 0ms;
            }

            &.middle {
                scale: 0 1;
                transition-delay: 50ms;
            }

            &.bottom {
                scale: 0 1;
                transition-delay: 100ms;
            }

            &.cross {
                opacity: 1;
                transition-delay: 150ms;
            }

            &.left {
                transform: rotate(45deg);
            }

            &.right {
                transform: rotate(-225deg);
            }
        }
    }
}
</style>