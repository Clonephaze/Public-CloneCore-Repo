<script setup lang="ts">
import { animate } from 'motion';

const introSection = ref<HTMLElement | null>(null)
const prefersReducedMotion = ref<boolean>(false)

onMounted(() => {
    if (import.meta.client) {
        prefersReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        
        if (!prefersReducedMotion.value && introSection.value) {
            animateIntro()
        }
    }
})

const animateIntro = async (): Promise<void> => {
    if (!introSection.value) return

    const heading = introSection.value.querySelector('.intro-heading')
    const subheading = introSection.value.querySelector('.intro-subheading')
    const bio = introSection.value.querySelector('.intro-bio')
    const showcase = introSection.value.querySelector('.intro-showcase')
    const pixelAvatarMobile = introSection.value.querySelector('.pixel-avatar-mobile')
    const pixelAvatarDesktop = introSection.value.querySelector('.pixel-avatar-desktop')
    const ctas = introSection.value.querySelectorAll('.cta-button')

    await animate(heading as HTMLElement,
        { 
            opacity: [0, 1],
            y: [30, 0]
        },
        { 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    )
    
    await animate(subheading as HTMLElement,
        { 
            opacity: [0, 1],
            y: [20, 0]
        },
        { 
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    )

    await animate(bio as HTMLElement,
        { 
            opacity: [0, 1],
            y: [20, 0]
        },
        { 
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    )

    const showcaseAnimations: ReturnType<typeof animate>[] = []
    
    if (showcase) {
        showcaseAnimations.push(
            animate(showcase as HTMLElement,
                { 
                    opacity: [0, 1],
                    scale: [0.95, 1]
                },
                { 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                }
            )
        )
    }

    if (pixelAvatarMobile) {
        showcaseAnimations.push(
            animate(pixelAvatarMobile as HTMLElement,
                { 
                    opacity: [0, 1],
                    y: [30, 0]
                },
                { 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                }
            )
        )
    }

    if (pixelAvatarDesktop) {
        showcaseAnimations.push(
            animate(pixelAvatarDesktop as HTMLElement,
                { 
                    opacity: [0, 1],
                    x: [50, 0]
                },
                { 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                }
            )
        )
    }

    await Promise.all(showcaseAnimations)

    ctas.forEach((btn, i) => {
        animate(btn as HTMLElement,
            { 
                opacity: [0, 1],
                scale: [0.9, 1]
            },
            { 
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.15
            }
        )
    })
}

const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(sectionId)
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}
</script>

<template>
    <section id="intro" ref="introSection" class="intro-section">
        <div class="intro-container">
            <h1 class="intro-heading">
                Hey there 👋 I'm <span class="highlight">Jack</span>
            </h1>
            <p class="intro-subheading">
                Part-time librarian, full-time creator
            </p>
            <p class="intro-bio">
                I build web apps, craft Blender tools, and bring ideas to life through code and creativity.
            </p>

            <div class="pixel-avatar-mobile">
                <div class="sprite-image" role="img" aria-label="Pixel art of Jack waving"/>
            </div>

            <div class="intro-showcase">
                <div class="showcase-item">
                    <Icon name="tabler:code" />
                    <span class="showcase-number">5+</span>
                    <span class="showcase-label">Web Projects</span>
                </div>
                <div class="showcase-item">
                    <Icon name="tabler:puzzle" />
                    <span class="showcase-number">4</span>
                    <span class="showcase-label">Blender Add-ons</span>
                </div>
                <div class="showcase-item">
                    <Icon name="tabler:palette" />
                    <span class="showcase-number">6+</span>
                    <span class="showcase-label">Art Pieces</span>
                </div>
            </div>

            <div class="intro-ctas">
                <button class="cta-button" @click="scrollToSection('#contact')">
                    Get In Touch
                </button>
                <button class="cta-button tertiary" @click="scrollToSection('#addons')">
                    Explore My Work
                </button>
            </div>
        </div>

        <div class="pixel-avatar-desktop">
            <div class="sprite-image" role="img" aria-label="Pixel art of Jack waving"/>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.intro-section {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: var(--sectionHeight);
    padding: $spacing-xl $spacing-lg;
    padding-top: $spacing-2xl;
    position: relative;
    overflow: hidden;

    @include respond-to($breakpoint-md) {
        align-items: center;
        padding: $spacing-xl;
        padding-top: $spacing-xl;
    }
}

.pixel-avatar-mobile {
    display: flex;
    justify-content: center;
    margin-bottom: -$spacing-sm;
    opacity: 0;

    .sprite-image {
        width: 180px;
        height: 180px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    @include respond-to($breakpoint-md) {
        display: none;
    }
}

.pixel-avatar-desktop {
    display: none;
    position: absolute;
    bottom: 0;
    right: $spacing-lg;
    pointer-events: none;
    opacity: 0;

    .sprite-image {
        width: clamp(200px, 20vw, 400px);
        height: clamp(200px, 20vw, 400px);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    @include respond-to($breakpoint-md) {
        display: block;
    }

    @include respond-to($breakpoint-lg) {
        right: $spacing-2xl;
    }

    @include respond-to($breakpoint-xl) {
        right: $spacing-3xl;
    }
}

.intro-container {
    max-width: $container-narrow;
    text-align: center;
}

.intro-heading {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 900;
    color: var(--text-color);
    margin-bottom: $spacing-md;
    line-height: 1.2;
    opacity: 0;

    .highlight {
        color: var(--highlight-color);
        display: inline-block;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0.2em;
            background: var(--highlight-color);
            opacity: 0.2;
            transform: scaleX(0);
            transform-origin: left;
            animation: underlineGrow 0.8s 1.5s ease-out forwards;
        }
    }
}

@keyframes underlineGrow {
    to {
        transform: scaleX(1);
    }
}

.intro-subheading {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    color: var(--text-color);
    font-weight: 600;
    margin-bottom: $spacing-xl;
    opacity: 0;
}

.intro-bio {
    font-size: $font-size-body;
    color: var(--text-color);
    line-height: 1.8;
    margin-bottom: $spacing-2xl;
    opacity: 0;
}

.intro-showcase {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: $spacing-lg;
    margin-bottom: $spacing-2xl;
    padding: $spacing-xl;
    background: var(--sub-bg-color);
    border: 2px solid var(--border-color);
    border-radius: $radius-lg;
    opacity: 0;

    .showcase-item {
        @include flex-column;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-md;
        transition: transform $transition-base;

        &:hover {
            transform: translateY(-4px);
        }

        .iconify {
            font-size: 2.5rem;
            color: var(--highlight-color);
            margin-bottom: $spacing-sm;
        }

        .showcase-number {
            font-size: clamp(1.75rem, 4vw, 2.5rem);
            font-weight: 900;
            color: var(--text-color);
            line-height: 1;
        }

        .showcase-label {
            font-size: $font-size-small;
            color: var(--text-color);
            opacity: 0.8;
            text-align: center;
        }
    }

    @include respond-below($breakpoint-md) {
        grid-template-columns: repeat(3, 1fr);
        padding: $spacing-lg $spacing-md;
        z-index: 1;
        position: relative;
    }
}

.intro-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    justify-content: center;
}

.cta-button {
    @include button-base;
    font-size: $font-size-body;
    padding: $spacing-md $spacing-xl;
    border: 2px solid var(--border-color);
    transition: transform $transition-base, background $transition-base, border-color $transition-base, box-shadow $transition-base;
    opacity: 0;

    &.tertiary {
        background: transparent;
        color: var(--text-color);
        border-color: var(--border-color);

        &:hover {
            background: var(--border-color);
            transform: translateY(-2px);
        }
    }
}

@include respond-below($breakpoint-md) {
    .intro-ctas {
        flex-direction: column;
        width: 100%;

        .cta-button {
            width: 100%;
        }
    }
}
</style>

<style lang="scss">
#intro .pixel-avatar-mobile .sprite-image,
#intro .pixel-avatar-desktop .sprite-image {
    background-image: url('/images/jack-sprite/JackSmaller.png');
}

html.light-mode #intro .pixel-avatar-mobile .sprite-image,
html.light-mode #intro .pixel-avatar-desktop .sprite-image {
    background-image: url('/images/jack-sprite/JackSmallerLight.png');
}

html.dark-mode #intro .pixel-avatar-mobile .sprite-image,
html.dark-mode #intro .pixel-avatar-desktop .sprite-image {
    background-image: url('/images/jack-sprite/JackSmaller.png');
}

html.sepia-mode #intro .pixel-avatar-mobile .sprite-image,
html.sepia-mode #intro .pixel-avatar-desktop .sprite-image {
    background-image: url('/images/jack-sprite/JackSmallerSepia.png');
}

html.contrast-mode #intro .pixel-avatar-mobile .sprite-image,
html.contrast-mode #intro .pixel-avatar-desktop .sprite-image {
    background-image: url('/images/jack-sprite/JackSmallerContrast.png');
}

@media (prefers-color-scheme: light) {
    html:not(.light-mode):not(.dark-mode):not(.sepia-mode):not(.contrast-mode) #intro .pixel-avatar-mobile .sprite-image,
    html:not(.light-mode):not(.dark-mode):not(.sepia-mode):not(.contrast-mode) #intro .pixel-avatar-desktop .sprite-image {
        background-image: url('/images/jack-sprite/JackSmallerLight.png');
    }
}

@media (prefers-color-scheme: dark) {
    html:not(.light-mode):not(.dark-mode):not(.sepia-mode):not(.contrast-mode) #intro .pixel-avatar-mobile .sprite-image,
    html:not(.light-mode):not(.dark-mode):not(.sepia-mode):not(.contrast-mode) #intro .pixel-avatar-desktop .sprite-image {
        background-image: url('/images/jack-sprite/JackSmaller.png');
    }
}
</style>
