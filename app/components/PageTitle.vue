<script setup lang="ts">
defineProps<{ title: string; lead?: string }>();
</script>

<template>
  <header class="page-title">
    <KitStripes size="s" />
    <div class="container inner">
      <h1><TitleMarker />{{ title }}</h1>
      <p v-if="lead">{{ lead }}</p>
      <slot />
    </div>
  </header>
</template>

<style scoped>
.page-title {
  position: relative;
  overflow: hidden;
  padding: var(--space-6) 0 var(--space-5);
}
.inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
h1 {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: clamp(2.25rem, 5vw, 3.25rem);
}
p {
  margin: 0;
  max-width: 44rem;
  color: var(--c-muted);
}
:root[data-theme="klubbdrakt"] .page-title {
  background: var(--c-band-bg);
  color: var(--c-band-fg);
}
:root[data-theme="klubbdrakt"] .page-title p {
  color: var(--tb-purple-soft);
}
</style>
