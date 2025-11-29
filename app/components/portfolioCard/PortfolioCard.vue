<script setup lang="ts">
import type { PortfolioItem } from '~/types/portfolio'

interface PortfolioCardProps {
    item: PortfolioItem
}

const props = defineProps<PortfolioCardProps>()
const emit = defineEmits<{
    openModal: [item: PortfolioItem]
}>()

const isInternalLink = computed(() => props.item.externalLink.startsWith('/'))

const handleCardClick = () => {
    if (props.item.images.length > 1) {
        emit('openModal', props.item)
    }
}

const handleExternalLink = (event: MouseEvent) => {
    event.stopPropagation()
}
</script>

<template>
    <article 
        class="portfolio-card" 
        :class="{ 'has-gallery': item.images.length > 1 }"
        :tabindex="item.images.length > 1 ? 0 : undefined"
        @click="handleCardClick"
        @keydown.enter="handleCardClick"
        @keydown.space.prevent="handleCardClick"
    >
        <div class="card-image-wrapper">
            <NuxtImg 
                :src="item.images[0]" 
                :alt="item.title"
                loading="lazy"
                width="400"
                height="225"
                sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 400px"
                format="webp"
                quality="80"
                fit="cover"
                class="card-image"
            />
            <div v-if="item.badge" class="card-badge">
                {{ item.badge }}
            </div>
        </div>

        <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>

            <div v-if="item.tags && item.tags.length > 0" class="card-tags">
                <span v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</span>
            </div>

            <div class="card-actions">
                <NuxtLink 
                    v-if="isInternalLink"
                    :to="item.externalLink" 
                    class="card-link"
                    @click="handleExternalLink"
                >
                    View Project <Icon name="tabler:arrow-right" />
                </NuxtLink>
                <a 
                    v-else
                    :href="item.externalLink" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="card-link"
                    @click="handleExternalLink"
                >
                    View Project <Icon name="tabler:external-link" />
                </a>
                <button 
                    v-if="item.images.length > 1" 
                    class="card-gallery-btn"
                    aria-label="View gallery"
                    @click.stop="handleCardClick"
                >
                    <Icon name="tabler:photo" /> {{ item.images.length }}
                </button>
            </div>
        </div>
    </article>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.portfolio-card {
    @include card-base;
    overflow: hidden;
    @include flex-column;
    height: $card-height-desktop;

    @include respond-below($breakpoint-sm) {
        // Use min-height instead of auto to prevent layout shift when images load
        height: auto;
        min-height: 420px;
    }

    &.has-gallery {
        cursor: pointer;

        &:hover {
            transform: translateY(-4px);
            box-shadow: $shadow-lg;
            border-color: var(--highlight-color);
        }
    }

    @include focus-visible-highlight;
}

.card-image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--sub-bg-color);
    // Ensure container size is established before image loads
    min-height: 0;
    flex-shrink: 0;

    .card-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform $transition-base;

        .portfolio-card:hover & {
            transform: scale(1.05);
        }
    }

    .card-badge {
        position: absolute;
        top: $spacing-sm;
        right: $spacing-sm;
        background: var(--highlight-color);
        color: var(--bg-color);
        padding: $spacing-xs $spacing-sm;
        border-radius: $radius-sm;
        font-size: $font-size-small;
        font-weight: 600;
    }
}

.card-content {
    padding: $spacing-lg;
    display: grid;
    grid-template-rows: auto auto 1fr auto auto;
    gap: $spacing-md;
    flex-grow: 1;
}

.card-title {
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
}

.card-description {
    color: var(--text-color);
    line-height: 1.6;
    margin: 0;
    align-self: start;
}

.card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    align-self: end;

    .card-tag {
        background: var(--highlight-color);
        color: var(--bg-color);
        padding: $spacing-xs $spacing-sm;
        border-radius: $radius-sm;
        font-size: $font-size-small;
        font-weight: 600;
    }
}

.card-actions {
    display: flex;
    gap: $spacing-md;
    align-items: center;
    justify-content: space-between;
}

.card-link {
    @include button-secondary;
    padding: $spacing-sm $spacing-md;
    flex-grow: 1;
}

.card-gallery-btn {
    @include button-tertiary;
    padding: $spacing-sm $spacing-md;
    gap: $spacing-xs;
}
</style>
