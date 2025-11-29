<script setup lang="ts">
const asyncMenuBar = defineAsyncComponent(() => import('./components/menuBar/menuBar.vue'))
</script>

<template>
  <a href="#main" class="skip-to-content">
    Skip to main content
  </a>
  <asyncMenuBar />
  <main id="main">
    <NuxtPage />
  </main>
</template>
