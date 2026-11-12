<script setup lang="ts">
import type { NewsCard } from "#shared/types/content";
import type { NewsCardVariant } from "#shared/utils/themes";

// One news item in a list. "side" puts the image beside the text, "overlay"
// sets the headline over the photo (Klubbdräkt). The theme decides unless a
// variant is given.
const props = defineProps<{ item: NewsCard; variant?: NewsCardVariant; large?: boolean }>();
const { config } = useTheme();
const variant = computed(() => props.variant ?? config.value.newsCardVariant);
const overlay = computed(() => variant.value === "overlay" && Boolean(props.item.imageUrl));
</script>

<template>
  <article class="news-card card" :class="{ 'news-card--overlay': overlay, 'news-card--side': !overlay, 'news-card--large': large }" :data-variant="overlay ? 'overlay' : 'side'">
    <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.imageAlt ?? ''" class="image" loading="lazy">
    <div v-else class="image placeholder" aria-hidden="true">
      <img src="/img/clubmark.png" alt="">
    </div>
    <div class="body">
      <p class="meta">
        <span class="category">{{ item.category.name }}</span>
        <span v-if="item.dateLabel"> · {{ item.dateLabel }}</span>
        <span v-if="item.membersOnly" class="badge lock"><AppIcon name="lock" :size="12" />Medlemmar</span>
        <span v-if="item.isNew" class="badge new">Ny</span>
      </p>
      <h3 class="title">
        <NuxtLink :to="`/nyheter/${item.slug}`" class="stretched">{{ item.title }}</NuxtLink>
      </h3>
      <p v-if="!overlay" class="excerpt">{{ item.excerpt }}</p>
    </div>
  </article>
</template>

<style scoped>
.news-card {
  position: relative;
  display: flex;
  overflow: hidden;
  min-height: 140px;
}
.stretched {
  color: inherit;
  text-decoration: none;
}
.stretched::after {
  content: "";
  position: absolute;
  inset: 0;
}
.stretched:focus-visible {
  outline: none;
}
.news-card:has(.stretched:focus-visible) {
  outline: 3px solid var(--c-accent);
  outline-offset: 2px;
}
.news-card--side .image {
  flex: none;
  width: 34%;
  max-width: 200px;
  object-fit: cover;
  clip-path: polygon(0 0, 100% 0, calc(100% - var(--edge-end) * 0.4) 100%, 0 100%);
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tb-ink);
}
.placeholder img {
  width: 48px;
  opacity: 0.9;
}
.news-card--side .body {
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.meta {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: var(--c-muted);
}
.category {
  font-weight: 800;
  color: var(--c-brand-2);
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  border-radius: var(--radius-label);
  font-size: 0.6875rem;
  font-weight: 900;
  text-transform: uppercase;
}
.lock {
  background: var(--tb-purple-soft);
  color: var(--tb-purple);
}
.new {
  background: var(--c-accent);
  color: var(--c-on-accent);
}
.title {
  font-size: 1.25rem;
  line-height: 1.25;
}
.excerpt {
  margin: 0;
  color: var(--c-muted);
}

/* Headline over the photo */
.news-card--overlay {
  min-height: 260px;
  align-items: flex-end;
  background: var(--tb-ink);
  color: #fff;
  border: 0;
}
.news-card--overlay.news-card--large {
  min-height: 420px;
}
.news-card--overlay .image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.news-card--overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgb(34 30 31 / 0) 30%, rgb(34 30 31 / 0.92) 100%);
}
.news-card--overlay .body {
  position: relative;
  z-index: 2;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.news-card--overlay .meta {
  color: #fff;
}
.news-card--overlay .category {
  padding: 2px 8px;
  background: var(--c-label-bg);
  color: var(--c-label-fg);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.news-card--overlay .title {
  font-size: 1.875rem;
  line-height: 1;
}
.news-card--overlay.news-card--large .title {
  font-size: clamp(2rem, 4vw, 3.25rem);
}
</style>
