<script setup lang="ts">
import { MAIN_MENU, isActive, type MenuItem } from "#shared/utils/navigation";

// Desktop menu: plain links and disclosure groups (button + list), closed by
// Escape, a click outside or choosing a link.
const props = withDefaults(defineProps<{ items?: MenuItem[] }>(), { items: () => MAIN_MENU });
const route = useRoute();
const open = ref<number | null>(null);
const root = ref<HTMLElement | null>(null);

function toggle(index: number) {
  open.value = open.value === index ? null : index;
}

function close() {
  open.value = null;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value !== null) {
    const index = open.value;
    close();
    root.value?.querySelector<HTMLButtonElement>(`[data-group="${index}"]`)?.focus();
  }
}

function onDocumentClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) close();
}

onMounted(() => document.addEventListener("click", onDocumentClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick));
watch(() => route.fullPath, close);

const active = computed(() => props.items.map((item) => isActive(item, route.path)));
</script>

<template>
  <nav ref="root" class="main-menu" aria-label="Huvudmeny" @keydown="onKeydown">
    <ul>
      <li v-for="(item, index) in items" :key="item.label" class="item">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="top"
          :class="{ active: active[index] }"
          :aria-current="active[index] ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
        <template v-else>
          <button
            type="button"
            class="top"
            :class="{ active: active[index] }"
            :data-group="index"
            :aria-expanded="open === index"
            :aria-controls="`menu-group-${index}`"
            @click.stop="toggle(index)"
          >
            {{ item.label }}
            <AppIcon name="chevron" :size="14" />
          </button>
          <ul v-show="open === index" :id="`menu-group-${index}`" class="group">
            <li v-for="child in item.children" :key="child.to">
              <NuxtLink :to="child.to" @click="close">{{ child.label }}</NuxtLink>
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.main-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.main-menu > ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--space-5);
}
.item {
  position: relative;
}
.top {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  padding: 0;
  background: none;
  border: 0;
  color: var(--c-header-muted);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  box-shadow: inset 0 -3px 0 transparent;
}
.top:hover,
.top.active {
  color: var(--c-header-fg);
}
.top.active {
  box-shadow: inset 0 -3px 0 var(--c-accent);
}
/* Klubbdräkt: the kit's two stripes instead of one orange line. */
:root[data-theme="klubbdrakt"] .top.active {
  box-shadow: none;
  background: linear-gradient(90deg, var(--tb-orange) 0 50%, var(--tb-purple-light) 50% 100%) bottom / 100% 4px no-repeat;
}
.group {
  position: absolute;
  z-index: 30;
  top: 100%;
  left: -12px;
  min-width: 220px;
  padding: var(--space-2) 0;
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-card);
  box-shadow: 0 16px 32px rgb(34 30 31 / 0.18);
}
.group a {
  display: block;
  padding: 10px 16px;
  color: var(--c-text);
  text-decoration: none;
  font-weight: 600;
}
.group a:hover,
.group a:focus-visible {
  background: var(--c-bg);
}
</style>
