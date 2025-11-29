<script setup lang="ts">
import type { NuxtError } from '#app';

const error = useError() as unknown as NuxtError;

useHead({
  title: error.statusCode === 404 ? '404 - Page Not Found' : `Error ${error.statusCode}`,
  meta: [
    {
      name: 'description', content: error.statusCode === 404
        ? 'The page you\'re looking for doesn\'t exist.'
        : `An unexpected error occurred: ${error.message}`
    },
  ],
});
</script>

<template>
  <div class="error-page">
    <div v-if="error.statusCode === 404" class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/">Return to Home</router-link>
    </div>

    <div v-else class="other-error">
      <h1>Error {{ error.statusCode }}</h1>
      <p>{{ error.message || 'An unexpected error has occurred.' }}</p>
      <router-link to="/">Return to Home</router-link>
    </div>

    <dev-only>
      <pre v-if="error" class="error-details">
        {{ error }}
      </pre>
    </dev-only>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.error-page {
  padding: $spacing-xl;
  text-align: center;

  h1 {
    margin-bottom: $spacing-md;
    color: var(--text-color);
  }

  a {
    @include button-primary;
    display: inline-block;
    margin-top: $spacing-md;
    padding: $spacing-sm $spacing-md;
  }
}

.error-details {
  margin-top: $spacing-xl;
  padding: $spacing-md;
  border: 1px solid var(--border-color);
  border-radius: $radius-sm;
  text-align: left;
  overflow-x: auto;
  background: var(--sub-bg-color);
  color: var(--text-color);
}
</style>
