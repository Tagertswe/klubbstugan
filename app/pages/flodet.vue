<script setup lang="ts">
// Klubbflödet is members only; until login exists every visit goes to login.
await navigateTo({ path: "/logga-in", query: { next: "/flodet" } }, { redirectCode: 302 });
</script>

<template>
  <div />
</template>
