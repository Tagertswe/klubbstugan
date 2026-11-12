<script setup lang="ts">
import type { NewsCard } from "#shared/types/content";

// "Viktigt nu": pinned news, shown until its pin date passes (spec §5.2).
defineProps<{ items: NewsCard[] }>();
</script>

<template>
  <section v-if="items.length" class="pinned" aria-labelledby="pinned-title">
    <div class="inner">
      <h2 id="pinned-title" class="tag">Viktigt nu</h2>
      <ul>
        <li v-for="item in items" :key="item.slug">
          <NuxtLink :to="`/nyheter/${item.slug}`">
            {{ item.title }}
            <AppIcon name="arrow" :size="16" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.pinned {
  background: var(--c-accent);
  color: var(--c-on-accent);
  border-radius: var(--radius-card);
  transform: skewX(var(--skew));
  box-shadow: var(--card-shadow);
}
.inner {
  transform: skewX(calc(var(--skew) * -1));
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-5);
  padding: var(--space-3) var(--space-5);
}
.tag {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 10px;
  background: var(--tb-ink);
  color: var(--tb-orange);
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-5);
}
a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--tap);
  color: inherit;
  font-weight: 800;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
