<script setup lang="ts">
defineOptions({ name: 'HomePage' })

const asyncIntroSection = defineAsyncComponent({
  loader: () => import('../components/introSection/IntroSection.vue'),
  errorComponent: () => h('div', { class: 'component-error' }, 'Intro section failed to load')
})

const asyncBackgroundAnimation = defineAsyncComponent({
  loader: () => import('../components/backgroundAnimation/backgroundAnimation.vue'),
  errorComponent: () => h('div', { class: 'component-error' }, 'Background animation failed to load')
})

const aboutSection = defineAsyncComponent({
  loader: () => import('../components/sections/AboutSection.vue'),
  errorComponent: () => h('div', { class: 'component-error' }, 'About section failed to load')
})

const addonsSection = defineAsyncComponent({
  loader: () => import('../components/sections/AddonsSection.vue'),
  errorComponent: () => h('div', { class: 'component-error' }, 'Add-ons section failed to load')
})

const webProjectsSection = defineAsyncComponent({
  loader: () => import('../components/sections/WebProjectsSection.vue'),
  errorComponent: () => h('div', { class: 'component-error' }, 'Web projects section failed to load')
})

const artGallerySection = defineAsyncComponent({
  loader: () => import('../components/sections/ArtGallerySection.vue'),
  errorComponent: () => h('div', { class: 'component-error' }, 'Art gallery section failed to load')
})

const contactSection = defineAsyncComponent({
  loader: () => import('../components/sections/ContactSection.vue'),
  errorComponent: () => h('div', { class: 'component-error' }, 'Contact section failed to load')
})

useSeoMeta({
  title: 'Jack - Developer, Creator, Problem Solver | Clone-Core',
  ogTitle: 'Jack - Developer, Creator, Problem Solver | Clone-Core',
  description: 'Part-time librarian, full-time creator. I build web applications, Blender add-ons, and create 3D art. Explore my portfolio of projects spanning web development, 3D modeling, and digital art.',
  ogDescription: 'Part-time librarian, full-time creator. I build web applications, Blender add-ons, and create 3D art. Explore my portfolio of projects spanning web development, 3D modeling, and digital art.',
  ogImage: 'https://clonecore.net/CloneCoreHeroStill.png',
  ogUrl: 'https://clonecore.net',
  ogSiteName: 'Clone-Core',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Jack - Developer, Creator, Problem Solver',
  twitterDescription: 'Explore my portfolio of web development, Blender add-ons, and digital art.',
  twitterImage: 'https://clonecore.net/CloneCoreHeroStill.png',
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
  <div class="index">
    <asyncIntroSection />

    <aboutSection />

    <addonsSection />

    <webProjectsSection />
    
    <artGallerySection />

    <contactSection />

    <ClientOnly>
      <asyncBackgroundAnimation />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/mixins" as *;

.index {
  --sectionHeight: calc(100lvh - #{$navbar-height});
  @include flex-column;
  align-items: center;

  @include respond-below($breakpoint-md) {
    margin-inline: $spacing-md;
  }

  section {
    scroll-margin-top: $navbar-height;
    scroll-snap-align: start;
    min-height: var(--sectionHeight);
    width: 100%;

    &.coming-soon-section {
      display: grid;
      content-visibility: auto;
      place-items: center;

      p {
        max-width: min(568px, 80vw);
      }

      span {
        display: block;
        text-align: center;
        font-size: clamp(3rem, 10cqw, 10rem);
        font-weight: 900;
      }
    }
  }

  :focus-visible {
    outline: 3px solid var(--focus-color, #4A90E2);
    outline-offset: 2px;
  }


}
</style>
