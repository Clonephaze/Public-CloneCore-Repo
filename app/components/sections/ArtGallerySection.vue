<script setup lang="ts">
import artworksData from '~/data/artworks.json'
import type { PortfolioItem } from '~/types/portfolio'

const LazyModalWrapper = defineAsyncComponent(() => import('~/components/modal/ModalWrapper.vue'))

const artworks = ref<PortfolioItem[]>(artworksData)
const selectedItem = ref<PortfolioItem | null>(null)
const showModal = ref(false)
const { gridRef, scrollPosition } = useScrollPosition()

const openModal = (item: PortfolioItem) => {
    selectedItem.value = item
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    setTimeout(() => {
        selectedItem.value = null
    }, 300)
}
</script>

<template>
    <section id="art" class="art-gallery-section">
        <div class="section-container">
            <h2 class="section-title">Art Gallery</h2>
            <p class="section-description">
                3D renders, digital art, and mixed-media experiments. 
                <a href="https://www.artstation.com/clonephaze" target="_blank" rel="noopener noreferrer" class="artstation-link">
                    View full portfolio on ArtStation <Icon name="tabler:external-link" />
                </a>
            </p>
            <div ref="gridRef" class="portfolio-grid" :class="`scroll-${scrollPosition}`">
                <PortfolioCard 
                    v-for="artwork in artworks" 
                    :key="artwork.id"
                    :item="artwork"
                    @open-modal="openModal"
                />
            </div>
        </div>

        <LazyModalWrapper
            v-if="showModal || selectedItem"
            :show="showModal"
            :title="selectedItem?.title"
            :images="selectedItem?.images"
            :description="selectedItem?.description"
            :external-link="selectedItem?.externalLink"
            @close="closeModal"
        />
    </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.art-gallery-section {
    @include section-padding;
}

.section-container {
    @include section-container;
}

.section-title {
    @include section-title;
}

.section-description {
    @include section-description;

    .artstation-link {
        display: inline-flex;
        align-items: center;
        gap: $spacing-xs;
        color: var(--highlight-color);
        text-decoration: none;
        font-weight: 600;
        transition: opacity $transition-fast;

        &:hover {
            opacity: 0.8;
        }

        @include focus-visible-highlight;
    }
}

.portfolio-grid {
    @include portfolio-grid;
}
</style>
