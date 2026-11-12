<script setup lang="ts">
const { id } = useTheme();
useHead({ htmlAttrs: { "data-theme": id } });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
