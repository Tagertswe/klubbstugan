<script setup lang="ts">
import { MAIN_MENU, type MenuItem } from "#shared/utils/navigation";

// The phone's full menu, opened from "Meny" in the bottom bar.
const props = withDefaults(defineProps<{ open: boolean; items?: MenuItem[] }>(), { items: () => MAIN_MENU });
const emit = defineEmits<{ close: [] }>();
const panel = ref<HTMLElement | null>(null);

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return;
    await nextTick();
    panel.value?.querySelector<HTMLElement>("button, a")?.focus();
  },
);
</script>

<template>
  <div v-if="open" class="backdrop" @click.self="emit('close')" @keydown.esc="emit('close')">
    <div ref="panel" class="sheet" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
      <div class="head">
        <h2 id="mobile-menu-title"><TitleMarker />Meny</h2>
        <button type="button" class="close" aria-label="Stäng menyn" @click="emit('close')">
          <AppIcon name="close" />
        </button>
      </div>
      <nav aria-label="Huvudmeny">
        <ul>
          <li v-for="item in items" :key="item.label">
            <NuxtLink v-if="item.to" :to="item.to" class="link strong" @click="emit('close')">{{ item.label }}</NuxtLink>
            <template v-else>
              <span class="group-label">{{ item.label }}</span>
              <ul>
                <li v-for="child in item.children" :key="child.to">
                  <NuxtLink :to="child.to" class="link" @click="emit('close')">{{ child.label }}</NuxtLink>
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </nav>
      <NuxtLink to="/logga-in" class="button button--primary login" @click="emit('close')">Logga in</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(34 30 31 / 0.5);
  display: flex;
  align-items: flex-end;
  overscroll-behavior: contain;
}
.sheet {
  width: 100%;
  max-height: 88vh;
  /* dvh follows Safari's collapsing toolbars; vh above is the fallback. */
  max-height: 88dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--tb-ink);
  color: #fff;
  padding: var(--space-4) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom));
  border-radius: var(--radius-card) var(--radius-card) 0 0;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.head h2 {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 1.5rem;
}
.close {
  width: var(--tap);
  height: var(--tap);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--tb-ink-3);
  border-radius: var(--radius-button);
  background: transparent;
  color: #fff;
  cursor: pointer;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.group-label {
  display: block;
  margin-top: var(--space-4);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tb-orange);
}
.link {
  display: flex;
  align-items: center;
  min-height: var(--tap);
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid var(--tb-ink-3);
}
.strong {
  font-weight: 800;
}
.login {
  width: 100%;
  margin-top: var(--space-5);
}
</style>
