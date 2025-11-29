<script setup lang="ts">
import addonsData from '~/data/addons.json'
import type { PortfolioItem } from '~/types/portfolio'

const LazyModalWrapper = defineAsyncComponent(() => import('~/components/modal/ModalWrapper.vue'))

const addons = ref<PortfolioItem[]>(addonsData)
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
    <section id="addons" class="addons-section">
        <div class="section-container">
            <h2 class="section-title">Blender Add-ons</h2>
            <p class="section-description">
                Tools and extensions I've created and maintained for the Blender community.
            </p>
            <div ref="gridRef" class="portfolio-grid" :class="`scroll-${scrollPosition}`">
                <PortfolioCard v-for="addon in addons" :key="addon.id" :item="addon" @open-modal="openModal" />
            </div>
        </div>

        <LazyModalWrapper v-if="showModal || selectedItem" :show="showModal" :title="selectedItem?.title" :images="selectedItem?.images" :description="selectedItem?.description" :external-link="selectedItem?.externalLink" @close="closeModal" />
    </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.addons-section {
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
}

.portfolio-grid {
    @include portfolio-grid;
}
</style>
