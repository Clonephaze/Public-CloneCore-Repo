<script setup lang="ts">
defineOptions({ name: 'BuildWithMePage' })

const asyncHeroSection = defineAsyncComponent({
    loader: () => import('../components/heroSection/heroSection.vue'),
    errorComponent: () => h('div', { class: 'component-error' }, 'Hero section failed to load')
})

onMounted(() => {
    if (import.meta.client) {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }
})

useSeoMeta({
    title: 'Build Your Website With Me - Clone-Core',
    ogTitle: 'Build Your Website With Me - Clone-Core',
    description: 'Let\'s create your ideal website together. I specialize in building accessible, beautiful, and high-performance web experiences.',
    ogDescription: 'Let\'s create your ideal website together. I specialize in building accessible, beautiful, and high-performance web experiences.',
    ogImage: 'https://clonecore.net/CloneCoreHeroStill.png',
    ogUrl: 'https://clonecore.net/build-with-me',
    ogSiteName: 'Clone-Core',
    twitterCard: 'summary_large_image',
})

useHead(() => ({
    link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/clone-coreUpdated.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
    ],
    htmlAttrs: {
        lang: 'en'
    },
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
}))
</script>

<template>
    <div class="build-with-me-page">
        <div class="back-nav">
            <NuxtLink to="/" class="back-button">
                <Icon name="tabler:arrow-left" />
                Back to Home
            </NuxtLink>
        </div>

        <asyncHeroSection />

        <section class="services-section">
            <div class="services-container">
                <h2 class="services-title">Let's Build Your Ideal Website</h2>
                <p class="services-intro">
                    Whether you need a personal portfolio, business website, or custom web application, 
                    I can help bring your vision to life with clean code, beautiful design, and exceptional performance.
                </p>

                <div class="services-grid">
                    <div class="service-card">
                        <Icon name="tabler:layout-dashboard" class="service-icon" />
                        <h3>Custom Web Design</h3>
                        <p>Unique, responsive designs tailored to your brand and audience.</p>
                    </div>
                    <div class="service-card">
                        <Icon name="tabler:accessible" class="service-icon" />
                        <h3>Accessibility First</h3>
                        <p>Built with WCAG standards to ensure everyone can use your site.</p>
                    </div>
                    <div class="service-card">
                        <Icon name="tabler:rocket" class="service-icon" />
                        <h3>Performance Optimized</h3>
                        <p>Lightning-fast load times and smooth user experiences.</p>
                    </div>
                    <div class="service-card">
                        <Icon name="tabler:device-mobile" class="service-icon" />
                        <h3>Mobile Friendly</h3>
                        <p>Looks and works great on all devices and screen sizes.</p>
                    </div>
                    <div class="service-card">
                        <Icon name="tabler:seo" class="service-icon" />
                        <h3>SEO Ready</h3>
                        <p>Optimized for search engines to help you get discovered.</p>
                    </div>
                    <div class="service-card">
                        <Icon name="tabler:tools" class="service-icon" />
                        <h3>Ongoing Support</h3>
                        <p>Maintenance and updates to keep your site running smoothly.</p>
                    </div>
                </div>

                <div class="contact-cta">
                    <h3>Ready to Get Started?</h3>
                    <p>
                        Reach out and let's discuss your project. I'd love to hear about your ideas 
                        and help you create something amazing.
                    </p>
                    
                    <div class="email-template-info">
                        <p class="template-intro">When reaching out, please include:</p>
                        <ul class="template-list">
                            <li><strong>Purpose:</strong> What's the main goal of your website?</li>
                            <li><strong>Style Goal:</strong> What look and feel are you aiming for?</li>
                            <li><strong>Specific Needs:</strong> Any particular features or functionality?</li>
                            <li><strong>Timeline:</strong> When do you need it completed?</li>
                            <li><strong>Budget:</strong> What's your budget range?</li>
                        </ul>
                    </div>

                    <div class="contact-methods">
                        <a 
                            href="mailto:jack@clonecore.net?subject=Website Development Inquiry&body=Edit this however you like, but please include the following fields.%0D%0A%0D%0APurpose:%0D%0A[Describe the main goal of your website]%0D%0A%0D%0AStyle Goal:%0D%0A[What look and feel are you aiming for?]%0D%0A%0D%0ASpecific Needs:%0D%0A[Any particular features or functionality?]%0D%0A%0D%0ATimeline:%0D%0A[When do you need it completed?]%0D%0A%0D%0ABudget:%0D%0A[Your budget range]%0D%0A%0D%0AThanks!" 
                            class="contact-button primary"
                        >
                            <Icon name="tabler:mail" />
                            Email Me
                        </a>
                        <a href="https://github.com/Clonephaze/Clonephaze/discussions" target="_blank" rel="noopener noreferrer" class="contact-button secondary">
                            <Icon name="tabler:message-circle" />
                            Start a Discussion
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss">
@use "~/assets/styles/mixins" as *;

.build-with-me-page {
    --sectionHeight: calc(100lvh - #{$navbar-height});

    section {
        scroll-margin-top: $navbar-height;
        scroll-snap-align: start;
        min-height: var(--sectionHeight);
        width: 100%;
    }
}

.back-nav {
    position: fixed;
    top: calc(#{$navbar-height} + $spacing-md);
    left: $spacing-md;
    z-index: 1000;

    .back-button {
        display: inline-flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm $spacing-md;
        background: var(--bg-color);
        color: var(--text-color);
        text-decoration: none;
        border: 2px solid var(--border-color);
        border-radius: $radius-md;
        font-weight: 700;
        font-size: $font-size-small;
        transition: all $transition-base;
        box-shadow: $shadow-md;

        .iconify {
            font-size: 1.25rem;
        }

        &:hover {
            background: var(--border-color);
            transform: translateX(-4px);
        }

        @include focus-visible-highlight;
    }

    @include respond-below($breakpoint-md) {
        top: calc(#{$navbar-height} + $spacing-sm);
        left: $spacing-sm;

        .back-button {
            padding: $spacing-sm $spacing-md;
            font-size: 0.85rem;
        }
    }
}

.services-section {
    @include section-padding;
    width: 100%;
    box-sizing: border-box;
}

.services-container {
    @include section-container;
    width: 100%;
    box-sizing: border-box;
}

.services-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 900;
    color: var(--text-color);
    text-align: center;
    margin-bottom: $spacing-lg;
}

.services-intro {
    text-align: center;
    color: var(--text-color);
    font-size: $font-size-body;
    line-height: 1.8;
    max-width: $container-narrow;
    margin: 0 auto $spacing-3xl;
}

.services-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;
    margin-bottom: $spacing-3xl;
    width: 100%;
    box-sizing: border-box;

    @include respond-to($breakpoint-sm) {
        grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to($breakpoint-lg) {
        grid-template-columns: repeat(3, 1fr);
        gap: $spacing-xl;
    }
}

.service-card {
    padding: $spacing-xl;
    background: var(--sub-bg-color);
    border: 2px solid var(--border-color);
    border-radius: $radius-lg;
    text-align: center;
    transition: all $transition-base;
    min-width: 0;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;

    @include respond-below($breakpoint-sm) {
        padding: $spacing-lg;
    }

    &:hover {
        border-color: var(--highlight-color);
        transform: translateY(-4px);
        box-shadow: $shadow-lg;

        .service-icon {
            transform: scale(1.1);
            color: var(--highlight-color);
        }
    }

    .service-icon {
        font-size: clamp(2.5rem, 5vw, 3rem);
        color: var(--text-color);
        margin-bottom: $spacing-md;
        transition: all $transition-base;
    }

    h3 {
        font-size: clamp(1.1rem, 3vw, 1.5rem);
        font-weight: 700;
        color: var(--text-color);
        margin-bottom: $spacing-md;
        word-wrap: break-word;
    }

    p {
        color: var(--text-color);
        line-height: 1.6;
        margin: 0;
        font-size: clamp(0.9rem, 2vw, 1rem);
    }
}

.contact-cta {
    text-align: center;
    padding: $spacing-2xl $spacing-xl;
    background: var(--sub-bg-color);
    border: 2px solid var(--border-color);
    border-radius: $radius-lg;
    margin-bottom: $spacing-xl;
    width: 100%;
    box-sizing: border-box;

    @include respond-below($breakpoint-sm) {
        padding: $spacing-xl $spacing-lg;
    }

    h3 {
        font-size: $font-size-title;
        font-weight: 700;
        color: var(--text-color);
        margin-bottom: $spacing-md;
    }

    > p {
        color: var(--text-color);
        font-size: $font-size-body;
        line-height: 1.8;
        max-width: $container-wide;
        margin: 0 auto $spacing-xl;
    }

    .email-template-info {
        margin: $spacing-xl auto;
        padding: $spacing-lg;
        background: var(--bg-color);
        border: 2px solid var(--border-color);
        border-radius: $radius-md;
        max-width: $container-wide;
        text-align: left;

        .template-intro {
            font-weight: 700;
            color: var(--text-color);
            margin-bottom: $spacing-md;
            font-size: 1.125rem;
        }

        .template-list {
            list-style: none;
            padding: 0;
            margin: 0;
            @include flex-column;
            gap: $spacing-sm;

            li {
                color: var(--text-color);
                font-size: $font-size-body;
                line-height: 1.5;
                padding-left: $spacing-lg;
                position: relative;

                &::before {
                    content: '→';
                    position: absolute;
                    left: 0;
                    color: var(--highlight-color);
                    font-weight: bold;
                }

                strong {
                    color: var(--highlight-color);
                }
            }
        }
    }
}

.contact-methods {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
}

.contact-button {
    @include button-base;
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-body;
    max-width: 100%;

    @include respond-below($breakpoint-sm) {
        padding: $spacing-sm $spacing-lg;
        width: 100%;
    }

    &.primary {
        background: var(--highlight-color);
        color: var(--bg-color);
        border: 2px solid var(--highlight-color);

        &:hover {
            transform: translateY(-2px);
            box-shadow: $shadow-lg;
        }
    }

    &.secondary {
        background: transparent;
        color: var(--highlight-color);
        border: 2px solid var(--highlight-color);

        &:hover {
            background: var(--highlight-color);
            color: var(--bg-color);
            transform: translateY(-2px);
        }
    }

    .iconify {
        font-size: 1.5rem;
    }
}

@include respond-below($breakpoint-md) {
    .contact-methods {
        flex-direction: column;
        width: 100%;

        .contact-button {
            box-sizing: border-box;
            width: 100%;
            justify-content: center;
        }
    }
}
</style>
