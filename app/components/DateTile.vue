<script setup lang="ts">
defineProps<{ day: string; month: string }>();
</script>

<template>
  <span class="tile">
    <span class="day">{{ day }}</span>
    <span class="month">{{ month }}</span>
  </span>
</template>

<style scoped>
.tile {
  flex: none;
  width: 52px;
  height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.05;
  background: var(--tb-ink);
  color: #fff;
  border-radius: min(var(--radius-button), 10px);
}
.day {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 900;
}
.month {
  font-size: 0.6875rem;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--tb-orange);
}
:root[data-theme="klubbdrakt"] .tile {
  background: transparent;
  color: var(--c-text);
}
:root[data-theme="klubbdrakt"] .day { font-size: 2rem; }
:root[data-theme="klubbdrakt"] .month { color: var(--c-brand-2); font-size: 0.875rem; }
</style>
