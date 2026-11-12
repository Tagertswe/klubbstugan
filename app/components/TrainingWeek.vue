<script setup lang="ts">
import type { TrainingDay } from "#shared/types/content";

defineProps<{ training: TrainingDay | null; time: string; place: string }>();

const ACCENTS: Record<string, string> = {
  ink: "var(--tb-ink)",
  orange: "var(--tb-orange)",
  purple: "var(--tb-purple)",
};
</script>

<template>
  <section class="training" aria-labelledby="training-title">
    <div class="head">
      <div>
        <h2 id="training-title" class="section-title"><TitleMarker />Veckans träning</h2>
        <p v-if="training" class="when">{{ training.dateLabel }} · {{ time }} · {{ place }}</p>
      </div>
      <NuxtLink to="/traning" class="more">Hela terminsplanen →</NuxtLink>
    </div>
    <div v-if="training" class="groups">
      <article
        v-for="session in training.sessions"
        :key="session.group.slug"
        class="group card"
        :style="{ '--group-color': ACCENTS[session.group.accent] ?? 'var(--tb-ink)' }"
      >
        <span class="name" :class="`name--${session.group.accent}`">{{ session.group.name }}</span>
        <h3>{{ session.workout }}</h3>
        <p>{{ session.group.description }}</p>
        <p v-if="session.group.meetTime" class="meet">Samling {{ session.group.meetTime }}</p>
      </article>
    </div>
    <p v-else class="empty">Terminsplanen för nästa termin kommer snart.</p>
    <p class="newcomer">Ny? Läs <NuxtLink to="/prova-pa">Prova på</NuxtLink> – vilken grupp som passar dig och var du parkerar.</p>
  </section>
</template>

<style scoped>
.training {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-2);
}
.when {
  margin: var(--space-1) 0 0;
  color: var(--c-muted);
}
.more {
  font-weight: 700;
}
.groups {
  display: grid;
  gap: var(--space-4);
}
.group {
  border-top: 6px solid var(--group-color);
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.name {
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: var(--radius-label);
  font-size: 0.8125rem;
  font-weight: 800;
  background: var(--tb-ink);
  color: #fff;
}
.name--orange {
  background: var(--tb-orange);
  color: var(--tb-ink);
}
.name--purple {
  background: var(--tb-purple);
}
.group h3 {
  font-size: 1.25rem;
  line-height: 1.25;
}
.group p {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.9375rem;
}
.group .meet {
  color: var(--tb-purple);
  font-weight: 800;
}
.empty,
.newcomer {
  margin: 0;
  color: var(--c-muted);
}
.newcomer a {
  font-weight: 700;
}
@media (min-width: 768px) {
  .groups {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
