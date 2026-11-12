<script setup lang="ts">
// The small slanted bar before section titles (Fart) or the kit stripes
// (Klubbdräkt). Klassisk shows nothing.
const { id } = useTheme();
defineProps<{ color?: "accent" | "brand-2" }>();
</script>

<template>
  <span v-if="id !== 'klassisk'" class="marker" :class="[`marker--${id}`, `marker--${color ?? 'accent'}`]" aria-hidden="true" />
</template>

<style scoped>
.marker {
  display: inline-block;
  flex: none;
}
.marker--fart {
  width: 1.6em;
  height: 0.6em;
  transform: skewX(-24deg);
}
.marker--klubbdrakt {
  width: 0.35em;
  height: 0.9em;
  box-shadow: 0.5em 0 0 var(--c-brand-2);
  margin-right: 0.5em;
  transform: skewX(-14deg);
}
.marker--accent {
  background: var(--c-accent);
}
.marker--brand-2 {
  background: var(--c-brand-2);
}
.marker--klubbdrakt.marker--brand-2 {
  background: var(--c-accent);
}
</style>
