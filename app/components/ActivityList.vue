<script setup lang="ts">
import type { Activity } from "#shared/types/content";

defineProps<{ items: Activity[]; title?: string }>();
</script>

<template>
  <section class="activities card" aria-labelledby="activities-title">
    <h2 id="activities-title">{{ title ?? "Kommande aktiviteter" }}</h2>
    <ul v-if="items.length">
      <li v-for="item in items" :key="item.slug">
        <DateTile :day="item.tile.day" :month="item.tile.month" />
        <span class="text">
          <span class="name">{{ item.title }}</span>
          <span class="where">{{ [item.relative, item.time].filter(Boolean).join(" ") }} · {{ item.place }}</span>
        </span>
      </li>
    </ul>
    <p v-else class="empty">Inga aktiviteter inlagda just nu.</p>
    <div class="links">
      <NuxtLink to="/kalender">Hela kalendern →</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.activities {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
h2 {
  font-size: 1.375rem;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.text {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}
.name {
  font-weight: 800;
}
.where {
  font-size: 0.875rem;
  color: var(--c-muted);
}
.empty {
  margin: 0;
  color: var(--c-muted);
}
.links {
  border-top: 1px solid var(--c-line);
  padding-top: var(--space-3);
  font-weight: 700;
}
</style>
