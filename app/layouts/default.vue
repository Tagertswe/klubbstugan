<script setup lang="ts">
const menuOpen = ref(false);
const route = useRoute();
watch(() => route.fullPath, () => (menuOpen.value = false));
// Keep the page behind the phone menu still (iOS Safari scrolls it otherwise).
watch(menuOpen, (open) => {
  document.documentElement.style.overflow = open ? "hidden" : "";
});
</script>

<template>
  <div class="layout">
    <a href="#innehall" class="skip-link">Hoppa till innehållet</a>
    <SiteHeader />
    <main id="innehall" tabindex="-1">
      <slot />
    </main>
    <SiteFooter />
    <BottomBar @menu="menuOpen = true" />
    <MobileMenu :open="menuOpen" @close="menuOpen = false" />
  </div>
</template>

<style scoped>
main:focus {
  outline: none;
}
</style>
