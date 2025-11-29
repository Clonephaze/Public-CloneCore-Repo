<template>
    <div ref="themeWrapper" class="theme-wrapper">
        <span aria-hidden="true">Theme</span>
        <div class="theme-menu">
            <button ref="themeSelector" aria-label="Theme Selector, switch between light, dark, sepia, and contrast" class="theme-selector" :class="{ disabled: !menuReady }" @click="toggleThemeMenu">
                <Icon name="pepicons-pop:paint-pallet" ssr="true" />
            </button>
            <ClientOnly>
                <div ref="themeSelection" class="theme-selection">
                    <template v-for="(theme, index) in themes" :key="theme.name">
                        <button :aria-labelledby="theme.name" :class="{ 'active': colorMode.value === theme.name }" :style="{ transitionDelay: `${(index * 20) + 150}ms` }" @click="selectTheme(theme.name)">
                            <Icon :name="theme.icon" />
                            <span :id="theme.name" class="label">{{ theme.label }}</span>
                        </button>
                        <hr v-if="index < themes.length - 1" :key="'hr-' + index">
                    </template>
                </div>
            </ClientOnly>
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const isOpen = ref(false);
const menuReady = ref(false);
const themeWrapper = ref<HTMLElement | null>(null);
const themeSelection = ref<HTMLElement | null>(null);
const themeSelector = ref<HTMLButtonElement | null>(null);

const themes = [
    { name: 'light', label: 'Light', icon: 'tabler:sun-high' },
    { name: 'dark', label: 'Dark', icon: 'tabler:moon' },
    { name: 'sepia', label: 'Sepia', icon: 'tabler:coffee' },
    { name: 'contrast', label: 'Contrast', icon: 'tabler:squares-selected' },
];

const spriteImages = [
    '/images/jack-sprite/JackSmallerLight.png',
    '/images/jack-sprite/JackSmaller.png',
    '/images/jack-sprite/JackSmallerSepia.png',
    '/images/jack-sprite/JackSmallerContrast.png',
];

let spritesPreloaded = false;

const preloadSprites = () => {
    if (spritesPreloaded) return;
    spriteImages.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
    spritesPreloaded = true;
};

let animationFrame: number | null = null;

const animateMenu = (open: boolean) => {
    if (!themeSelection.value) return;
    const menu = themeSelection.value;

    if (!open) {
        menu.classList.remove('open');
    } else {
        menu.classList.add('open');
    }
};

const toggleThemeMenu = () => {
    isOpen.value = !isOpen.value;
    if (animationFrame) cancelAnimationFrame(animationFrame);

    // Preload sprites when menu is first opened
    if (isOpen.value) {
        preloadSprites();
    }

    animationFrame = requestAnimationFrame(() => {
        animateMenu(isOpen.value);
    });
};

const selectTheme = (theme: string) => {
    colorMode.preference = theme;
    document.querySelectorAll('[data-color-preference]').forEach((element) => {
        element.setAttribute('data-color-preference', colorMode.preference);
    });
    setTimeout(() => {
        isOpen.value = false;
        themeSelection.value?.classList.remove('open');
    }, 150);
};

const handleClickOutside = (event: MouseEvent) => {
    if (
        themeWrapper.value &&
        !themeWrapper.value.contains(event.target as Node)
    ) {
        isOpen.value = false;
        themeSelection.value?.classList.remove('open');
    }
};

onMounted(() => {
    nextTick(() => {
        menuReady.value = true;
    });
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>

<style lang="scss">
.theme-wrapper {
    position: relative;
    margin-left: auto;
    display: inline-flex;
    width: 45px;
    height: 45px;
    align-self: center;

    >span {
        position: absolute;
        transform: translateX(-6ch);
        padding-top: 12px;
        font-weight: bold;
        opacity: 0;
        transition: opacity 300ms ease-out;
    }

    &:hover>span {
        opacity: 1;
        transition: opacity 300ms ease-in;
    }

    .disabled {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.5;
        filter: grayscale(100%);
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            transition-delay: 0ms !important;
        }
    }
}

.theme-menu {
    position: fixed;
    border-radius: 8px;
    z-index: 999;
    border: 2px solid var(--border-color);
    box-shadow: light-dark(rgba(0, 0, 0, 0.6), rgba(255, 255, 255, 0.3)) 0 0 5px;
    background-color: var(--sub-bg-color);
    transition: background-color 200ms ease;
}

.theme-selector {
    display: flex;
    border-radius: 8px;
    position: relative;
    align-items: center;
    border: unset;
    background: unset;
    font-weight: bold;
    cursor: pointer;
    padding: 0.5rem;

    &:focus-visible {
        outline: 2px solid var(--highlight-color);
    }

    >.iconify {
        color: var(--highlight-color);
        width: 1.5rem;
        height: 1.5rem;
    }
}

.theme-selection {
    display: flex;
    flex-direction: column;
    visibility: hidden;
    height: 0;
    overflow-y: clip;
    transition: height 200ms 200ms ease-in, visibility 0ms 200ms ease-in;

    >button {
        width: fit-content;
        border: unset;
        background: unset;
        cursor: pointer;
        position: relative;
        padding: 0.5rem;
        opacity: 0;
        transform: translateY(-0.5rem);
        transition-property: opacity, transform;
        transition-duration: 150ms, 175ms;
        transition-timing-function: ease-out;

        .iconify {
            width: 1.5rem;
            height: 1.5rem;
            transition: color 200ms ease;
        }

        &:hover>.label {
            opacity: 1;
            transition: opacity 200ms ease-in;
        }

        &.active {
            .iconify {
                color: var(--highlight-color);
            }
        }

        .label {
            position: absolute;
            right: 3rem;
            top: 0.75rem;
            opacity: 0;
            transition: opacity 200ms ease-out;
            font-weight: bold;
        }
    }

    >hr {
        width: 60%;
        border-top-width: 1px;
        border-top-color: var(--border-color);
        border-radius: 5px;
        margin-block: 0.015rem;
        transform: scaleX(0.5);
        translate: 0 -0.5rem;
        opacity: 0;
        transition-property: transform, translate, opacity;
        transition-delay: 50ms;
        transition-duration: 175ms, 100ms, 100ms;
        transition-timing-function: ease-out;
    }
}

.theme-selection.open {
    visibility: visible;
    height: calc((43px * 4) + (2px * 3));
    transition: height 200ms ease-in;

    >button {
        opacity: 1;
        transform: translateY(0);
        transition-property: opacity, transform;
        transition-duration: 300ms, 250ms;
        transition-timing-function: ease-out;
    }

    >hr {
        opacity: 1;
        translate: 0 0;
        transform: scaleX(1);
        transition-property: transform, translate, opacity;
        transition-delay: 100ms;
        transition-duration: 300ms, 200ms, 200ms;
        transition-timing-function: cubic-bezier(.58,-0.04,.89,.75), ease-out, ease-out;
    }
}

@media (max-width: 768px) {
    .theme-wrapper {
        margin-top: 0.8rem;
        align-self: unset;

        >span {
            display: none;
        }
    }

    .theme-selection {
        >button {
            .label {
                display: none;
            }
        }
    }
}
</style>