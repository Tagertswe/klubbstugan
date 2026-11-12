<script setup lang="ts">
import { THEMES, THEME_IDS } from "#shared/utils/themes";

// Demo switch between the three themes (spec §5.8.1). Plain links: the server
// stores the choice in a cookie and renders the page again in that theme.
const { id } = useTheme();
const route = useRoute();
const themes = THEME_IDS.map((themeId) => THEMES[themeId]);

function href(themeId: string) {
  return `${route.path}?tema=${themeId}`;
}
</script>

<template>
  <nav class="theme-switch" aria-label="Utseende">
    <span class="label">Utseende:</span>
    <a
      v-for="theme in themes"
      :key="theme.id"
      :href="href(theme.id)"
      :aria-current="theme.id === id ? 'true' : undefined"
      :title="theme.description"
      :data-theme-option="theme.id"
      >{{ theme.name }}</a
    >
  </nav>
</template>

<style scoped>
.theme-switch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}
.label {
  font-weight: 700;
}
a {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border: 1.5px solid currentColor;
  border-radius: var(--radius-button);
  color: inherit;
  text-decoration: none;
  font-weight: 700;
}
a[aria-current="true"] {
  background: var(--tb-orange);
  border-color: var(--tb-orange);
  color: var(--tb-ink);
}
</style>
