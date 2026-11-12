<script setup lang="ts">
import { BOTTOM_BAR } from "#shared/utils/navigation";

// Phone navigation: Hem · Kalender · Flöde · Nyheter · Meny (spec §5.8).
const emit = defineEmits<{ menu: [] }>();
const route = useRoute();

function isCurrent(to?: string) {
  if (!to) return false;
  return to === "/" ? route.path === "/" : route.path === to || route.path.startsWith(`${to}/`);
}
</script>

<template>
  <nav class="bottom-bar" aria-label="Snabbmeny">
    <template v-for="item in BOTTOM_BAR" :key="item.label">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="tab"
        :class="{ current: isCurrent(item.to) }"
        :aria-current="isCurrent(item.to) ? 'page' : undefined"
      >
        <AppIcon :name="item.icon" :size="24" />
        <span>{{ item.label }}</span>
      </NuxtLink>
      <button v-else type="button" class="tab" aria-haspopup="dialog" @click="emit('menu')">
        <AppIcon :name="item.icon" :size="24" />
        <span>{{ item.label }}</span>
      </button>
    </template>
  </nav>
</template>

<style scoped>
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  background: var(--c-surface);
  border-top: 1px solid var(--c-line);
}
.tab {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--c-text);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.current {
  color: var(--c-link);
  font-weight: 800;
  box-shadow: inset 0 3px 0 var(--c-accent);
}
:root[data-theme="klubbdrakt"] .bottom-bar {
  background: var(--tb-ink);
  border-top: 0;
}
:root[data-theme="klubbdrakt"] .tab {
  color: #fff;
}
:root[data-theme="klubbdrakt"] .current {
  color: var(--tb-orange);
}
@media (min-width: 1024px) {
  .bottom-bar {
    display: none;
  }
}
</style>
