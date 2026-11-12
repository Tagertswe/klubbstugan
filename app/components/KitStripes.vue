<script setup lang="ts">
// The orange and purple side panels of the club singlet (Klubbdräkt theme).
const { config } = useTheme();
defineProps<{ position?: "right" | "left"; size?: "s" | "m" }>();
</script>

<template>
  <div
    v-if="config.decorations.kitStripes"
    class="kit-stripes"
    :class="[`kit-stripes--${position ?? 'right'}`, `kit-stripes--${size ?? 'm'}`]"
    aria-hidden="true"
    data-decoration="kit-stripes"
  >
    <span class="a" />
    <span class="b" />
  </div>
</template>

<style scoped>
.kit-stripes {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  gap: 10px;
  transform: skewX(-14deg);
  pointer-events: none;
}
.kit-stripes--right { right: -24px; }
@media (min-width: 768px) {
  .kit-stripes--right { right: 8%; }
}
.kit-stripes--left { left: -30px; }
.kit-stripes span { width: 24px; }
.kit-stripes--s span { width: 10px; }
.kit-stripes--s { gap: 5px; }
.a { background: var(--tb-orange); }
.b { background: var(--tb-purple); }
</style>
