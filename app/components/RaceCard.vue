<script setup lang="ts">
import type { RaceCard } from "#shared/types/content";

defineProps<{ race: RaceCard }>();
</script>

<template>
  <article class="race card" :class="{ past: race.isPast }">
    <img v-if="race.imageUrl" :src="race.imageUrl" :alt="race.imageAlt ?? ''" class="image" loading="lazy">
    <div v-else class="image placeholder" aria-hidden="true">
      <img src="/img/clubmark.png" alt="">
    </div>
    <div class="body">
      <p class="when">
        <template v-if="race.isPast">Avgjort {{ race.dateLabel }}</template>
        <template v-else>{{ race.dateLabel }}</template>
        · {{ race.place }}
      </p>
      <h3>{{ race.title }}</h3>
      <p v-if="race.summary" class="summary">{{ race.summary }}</p>
      <NuxtLink :to="`/tavla/${race.slug}`" class="button" :class="race.isPast ? 'button--primary' : 'button--dark'">
        {{ race.isPast ? "Resultat och bilder" : "Till loppet" }}<span class="visually-hidden">: {{ race.title }}</span>
      </NuxtLink>
    </div>
  </article>
</template>

<style scoped>
.race {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--c-text);
}
.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--edge-end) * 0.4), 0 100%);
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tb-purple);
}
.placeholder img {
  width: 72px;
  height: auto;
}
.body {
  padding: var(--space-4) var(--space-5) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}
.when {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-link);
}
h3 {
  font-size: 1.5rem;
}
.summary {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.9375rem;
}
.button {
  align-self: flex-start;
  margin-top: auto;
}
</style>
