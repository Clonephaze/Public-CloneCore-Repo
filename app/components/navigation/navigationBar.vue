<!-- navigationBar.vue -->
<template>
    <ClientOnly>
        <nav class="navigation">
            <button class="nav-button" :class="{ active: activeSection === 'intro' }" @click="scrollToTop">
                Home
            </button>
            <button class="nav-button" :class="{ active: activeSection === 'about' }" @click="scrollToSection('#about')">
                About
            </button>
            <button class="nav-button" :class="{ active: activeSection === 'addons' }" @click="scrollToSection('#addons')">
                Add-ons
            </button>
            <button class="nav-button" :class="{ active: activeSection === 'web-projects' }" @click="scrollToSection('#web-projects')">
                Web Projects
            </button>
            <button class="nav-button" :class="{ active: activeSection === 'art' }" @click="scrollToSection('#art')">
                Art
            </button>
            <button class="nav-button" :class="{ active: activeSection === 'contact' }" @click="scrollToSection('#contact')">
                Contact
            </button>
        </nav>
    </ClientOnly>
</template>

<script setup lang="ts">
const route = useRoute()
const activeSection = ref<string>('intro')

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate there first
    if (route.path !== '/') {
        navigateTo('/')
        nextTick(() => {
            setTimeout(() => {
                scrollToElement(sectionId)
            }, 100)
        })
        return
    }

    scrollToElement(sectionId)
}

const scrollToElement = (selector: string) => {
    const element = document.querySelector(selector)

    if (!element) {
        console.warn(`Element "${selector}" not found`)
        return
    }

    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
}

let observer: IntersectionObserver | null = null

const setupObserver = () => {
    try {
        if (!import.meta.client) return

        if (observer) {
            observer.disconnect()
        }

        const sections = document.querySelectorAll('section[id]')
        if (sections.length === 0) {
            activeSection.value = 'none'
            return
        }

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        }

        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeSection.value = entry.target.id
                }
            })
        }, observerOptions)

        sections.forEach((section) => {
            observer!.observe(section)
        })
    } catch (error) {
        if (observer) {
            observer.disconnect()
        }
        observer = null;
        console.error('Error in setupObserver:', error)
    }
}

onMounted(() => {
    setupObserver()
})

watch(() => route.path, (newPath) => {
    if (newPath === '/') {
        nextTick(() => {
            setupObserver()
        })
    } else {
        activeSection.value = 'none'
        if (observer) {
            observer.disconnect()
        }
    }
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})
</script>

<style lang="scss">
@use "~/assets/styles/mixins" as *;

.navigation {
    display: flex;
    margin-inline-start: $spacing-sm;
    align-items: center;
    gap: $spacing-sm;
    position: relative;
    z-index: 999;
    font-family: $font-family-stack;

    @include respond-below($breakpoint-md) {
        flex-direction: column;
        gap: $spacing-sm;
        align-items: flex-start;
    }
}

.nav-button {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: $font-size-small;
    font-weight: 900;
    text-decoration: none;
    padding: $spacing-sm $spacing-sm;
    transition: all $transition-base;
    text-align: left;
    width: fit-content;
    border-radius: $radius-sm;
    position: relative;

    &:hover {
        background-color: var(--border-color);
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background: var(--highlight-color);
        border-radius: 1px;
        transition: width $transition-base;

        @include respond-below($breakpoint-md) {
            left: 0;
            transform: none;
            width: 3px;
            height: 0;
            transition: height $transition-base;
        }
    }

    &.active {
        color: var(--highlight-color);
        
        &::after {
            width: 80%;

            @include respond-below($breakpoint-md) {
                width: 3px;
                height: 100%;
            }
        }
    }

    &.highlight {
        color: var(--highlight-color);
        border: 2px solid var(--highlight-color);
        font-weight: 900;

        &:hover {
            background: var(--highlight-color);
            color: var(--bg-color);
        }

        &.active {
            background: var(--highlight-color);
            color: var(--bg-color);
        }
    }

    @include focus-visible-highlight;
}
</style>