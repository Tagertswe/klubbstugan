<script setup lang="ts">
// Inline stroke icons, decorative by default (the label sits next to them).
const props = defineProps<{ name: string; size?: number }>();
const PATHS: Record<string, string> = {
  home: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z",
  calendar: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
  feed: "M8 12a3 3 0 100-6 3 3 0 000 6zM17 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2 20c0-3 3-5 6-5s6 2 6 5M14 19c0-2 1.5-3.5 3-3.5s4 1.5 4 3.5",
  news: "M3 4h15v16H3zM18 8h3v10a2 2 0 01-2 2M7 8h7M7 12h7M7 16h4",
  menu: "M4 7h16M4 12h16M4 17h16",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6",
  chevron: "M6 9l6 6 6-6",
  close: "M6 6l12 12M18 6L6 18",
  lock: "M5 11h14v10H5zM8 11V8a4 4 0 018 0v3",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M5 12l5 5 9-10",
  pin: "M9 4h6l-1 6 4 3H6l4-3zM12 13v8",
};
const d = computed(() => PATHS[props.name] ?? "");
</script>

<template>
  <svg
    aria-hidden="true"
    :width="size ?? 20"
    :height="size ?? 20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path :d="d" />
  </svg>
</template>
