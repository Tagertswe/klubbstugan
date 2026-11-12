<script setup lang="ts">
import type { NextRace } from "#shared/types/content";

defineProps<{ race: NextRace }>();
</script>

<template>
  <div class="countdown">
    <p class="count-label">{{ race.title }} · start om</p>
    <dl>
      <div><dt>dagar</dt><dd>{{ race.countdown.days }}</dd></div>
      <div><dt>tim</dt><dd>{{ race.countdown.hours }}</dd></div>
      <div><dt>min</dt><dd>{{ race.countdown.minutes }}</dd></div>
    </dl>
  </div>
</template>

<style scoped>
.countdown {
  display: inline-flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--tb-ink-2);
  border: 1px solid var(--tb-ink-3);
  border-radius: min(var(--radius-card), 10px);
  color: #fff;
  box-shadow: 0 16px 40px rgb(0 0 0 / 0.35);
  transform: rotate(var(--tilt));
}
.count-label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tb-orange);
}
dl {
  margin: 0;
  display: flex;
  gap: var(--space-2);
}
dl div {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  min-width: 56px;
  padding: 4px 6px;
  background: var(--tb-ink);
  border-radius: 6px;
}
dd {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
}
dt {
  font-size: 0.625rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tb-orange);
}
</style>
