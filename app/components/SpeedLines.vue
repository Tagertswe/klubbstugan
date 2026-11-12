<script setup lang="ts">
// Thin diagonal lines behind dark sections in the Fart theme. Drawn as a
// background pattern, not as elements, so nothing sits on top of text.
const { config } = useTheme();
</script>

<template>
  <div v-if="config.decorations.speedLines" class="speed-lines" aria-hidden="true" data-decoration="speed-lines">
    <span class="bright" />
  </div>
</template>

<style scoped>
.speed-lines {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    124deg,
    transparent 0 180px,
    rgb(238 137 21 / 0.22) 180px 181px,
    transparent 181px 230px,
    rgb(238 137 21 / 0.16) 230px 231px
  );
  mask-image: linear-gradient(90deg, transparent 25%, #000 60%);
}
.bright {
  position: absolute;
  left: 62%;
  top: 70%;
  width: 3px;
  height: 80px;
  background: var(--c-accent);
  transform: rotate(34deg);
}
/* On narrow screens the bright line would cross text. */
@media (max-width: 899px) {
  .bright {
    display: none;
  }
}
</style>
