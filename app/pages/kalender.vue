<script setup lang="ts">
import type { Activity } from "#shared/types/content";

useSeoMeta({ title: "Kalender", description: "Träningar, långpass och lopp med Team Blekinge LF." });
const { data } = await useFetch("/api/events");

const MONTHS = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
const months = computed(() => {
  const groups = new Map<string, (Activity & { summary: string | null })[]>();
  for (const item of data.value ?? []) {
    const date = new Date(item.startsAt);
    const key = `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()];
});
</script>

<template>
  <div>
    <PageTitle title="Kalender" lead="Träningar, långpass och lopp. Medlemmar ser även aktiviteter med anmälan." />
    <div class="container calendar">
      <section v-for="[month, items] in months" :key="month" :aria-labelledby="`m-${month}`" class="month">
        <h2 :id="`m-${month}`">{{ month }}</h2>
        <ul>
          <li v-for="item in items" :key="item.slug" class="card">
            <DateTile :day="item.tile.day" :month="item.tile.month" />
            <span class="text">
              <span class="name">{{ item.title }}</span>
              <span class="where">{{ [item.relative, item.time].filter(Boolean).join(" ") }} · {{ item.place }}</span>
            </span>
          </li>
        </ul>
      </section>
      <p v-if="months.length === 0">Inga aktiviteter inlagda just nu.</p>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
h2 {
  font-size: 1.5rem;
  text-transform: capitalize;
  margin-bottom: var(--space-3);
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-3);
}
li {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
}
.text {
  display: flex;
  flex-direction: column;
}
.name {
  font-weight: 800;
}
.where {
  color: var(--c-muted);
  font-size: 0.9375rem;
}
@media (min-width: 768px) {
  ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
