<script setup lang="ts">
import webProjectsData from '~/data/webProjects.json'
import type { PortfolioItem } from '~/types/portfolio'

const LazyModalWrapper = defineAsyncComponent(() => import('~/components/modal/ModalWrapper.vue'))

const webProjects = ref<PortfolioItem[]>(webProjectsData)
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
    <section id="web-projects" class="web-projects-section">
        <div class="section-container">
            <h2 class="section-title">Web Projects</h2>
            <p class="section-description">
                Websites and web applications I've designed and built.
            </p>
            <div ref="gridRef" class="portfolio-grid" :class="`scroll-${scrollPosition}`">
                <PortfolioCard 
                    v-for="project in webProjects" 
                    :key="project.id"
                    :item="project"
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

.web-projects-section {
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

.portfolio-grid {
    @include portfolio-grid;
}
</style>
