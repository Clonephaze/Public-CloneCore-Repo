<script setup lang="ts">
const contactLinks = [
    {
        icon: 'tabler:mail',
        label: 'Email',
        value: 'jack@clonecore.net',
        href: 'mailto:jack@clonecore.net',
        primary: false
    },
    {
        icon: 'tabler:brand-github',
        label: 'GitHub',
        value: '@Clonephaze',
        href: 'https://github.com/Clonephaze',
        primary: false
    },
    {
        icon: 'tabler:brand-instagram',
        label: 'Instagram',
        value: '@clonephaze2327',
        href: 'https://www.instagram.com/clonephaze2327/',
        primary: false
    },
    {
        icon: 'tabler:palette',
        label: 'ArtStation',
        value: '@clonephaze',
        href: 'https://www.artstation.com/clonephaze',
        primary: false
    }
]
</script>

<template>
    <section id="contact" class="contact-section">
        <div class="section-container">
            <h2 class="section-title">Get In Touch</h2>
            <p class="section-description">
                Have a project in mind or just want to chat? I'd love to hear from you!
            </p>

            <div class="contact-grid">
                <a 
                    v-for="link in contactLinks" 
                    :key="link.label"
                    :href="link.href"
                    :class="['contact-card', { 'primary': link.primary }]"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Icon :name="link.icon" class="contact-icon" />
                    <div class="contact-info">
                        <span class="contact-label">{{ link.label }}</span>
                        <span class="contact-value">{{ link.value }}</span>
                    </div>
                    <Icon name="tabler:arrow-right" class="contact-arrow" />
                </a>
            </div>

            <div class="contact-footer">
                <div class="build-showcase">
                    <h3>Need a Website Built?</h3>
                    <p>
                        I specialize in creating accessible, beautiful, and high-performance websites. 
                        From personal portfolios to custom web applications, let's bring your vision to life.
                    </p>
                    <NuxtLink to="/build-with-me" class="build-button">
                        <Icon name="tabler:sparkles" />
                        Build With Me
                        <Icon name="tabler:arrow-right" />
                    </NuxtLink>
                </div>
            </div>

            <ClientOnly>
                <BuyMeCoffee />
            </ClientOnly>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.contact-section {
    @include section-padding(var(--sub-bg-color));
}

.section-container {
    @include section-container;
}

.section-title {
    @include section-title;
}

.section-description {
    @include section-description;
}

.contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    margin-bottom: $spacing-2xl;

    @include respond-to($breakpoint-sm) {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: $spacing-lg;
    }
}

.contact-card {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    padding: $spacing-lg;
    @include card-base;
    text-decoration: none;
    position: relative;
    overflow: hidden;

    &:hover {
        border-color: var(--highlight-color);
        transform: translateY(-4px);
        box-shadow: $shadow-lg;

        .contact-arrow {
            transform: translateX(4px);
        }
    }

    @include focus-visible-highlight;

    &.primary {
        background: linear-gradient(135deg, 
            rgba(var(--highlight-color-rgb, 70, 129, 228), 0.1) 0%, 
            rgba(var(--highlight-color-rgb, 70, 129, 228), 0.05) 100%
        );

        .contact-icon {
            color: var(--highlight-color);
        }
    }

    .contact-icon {
        font-size: 2rem;
        color: var(--text-color);
        flex-shrink: 0;
    }

    .contact-info {
        @include flex-column;
        gap: $spacing-xs;
        flex-grow: 1;

        .contact-label {
            font-size: $font-size-small;
            color: var(--text-color);
            opacity: 0.7;
            font-weight: 600;
        }

        .contact-value {
            font-size: $font-size-body-sm;
            color: var(--text-color);
            font-weight: 700;
        }
    }

    .contact-arrow {
        font-size: 1.5rem;
        color: var(--text-color);
        opacity: 0.5;
        transition: transform $transition-base;
        flex-shrink: 0;
    }
}

.contact-footer {
    margin-top: $spacing-2xl;

    .build-showcase {
        text-align: center;
        padding: $spacing-xl $spacing-lg;
        background: linear-gradient(135deg,
            rgba(var(--highlight-color-rgb, 70, 129, 228), 0.1) 0%, 
            rgba(var(--highlight-color-rgb, 70, 129, 228), 0.05) 100%
        );
        border: 2px solid var(--highlight-color);
        border-radius: $radius-lg;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, 
                rgba(var(--highlight-color-rgb, 70, 129, 228), 0.1) 0%, 
                transparent 70%
            );
            pointer-events: none;
        }

        h3 {
            font-size: $font-size-subtitle;
            font-weight: 900;
            color: var(--text-color);
            margin-bottom: $spacing-md;
            position: relative;
        }

        p {
            color: var(--text-color);
            font-size: $font-size-body;
            line-height: 1.8;
            max-width: $container-wide;
            margin: 0 auto $spacing-xl;
            position: relative;
        }

        @include respond-to($breakpoint-md) {
            padding: $spacing-2xl $spacing-xl;
        }

        .build-button {
            @include button-primary;
            padding: 1.25rem 2.5rem;
            font-size: $font-size-body;
            box-shadow: $shadow-md;

            .iconify {
                font-size: 1.5rem;
            }

            &:hover {
                transform: translateY(-4px) scale(1.05);
                box-shadow: $shadow-xl;
            }

            &:focus-visible {
                outline: 3px solid var(--text-color);
                outline-offset: 4px;
            }
        }
    }

    // Buy Me a Coffee spacing and positioning
    :deep(.bmc-button.mobile) {
        margin-top: $spacing-xl;
    }

    // Desktop floating button
    :deep(.bmc-button:not(.mobile)) {
        @include respond-below($breakpoint-sm) {
            display: none;
        }
    }
}
</style>
