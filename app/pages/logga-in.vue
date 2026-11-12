<script setup lang="ts">
useSeoMeta({ title: "Logga in", robots: "noindex" });
const route = useRoute();
const next = computed(() => (typeof route.query.next === "string" ? route.query.next : null));
</script>

<template>
  <div class="container login">
    <h1><TitleMarker />Logga in</h1>
    <p>Medlemmar loggar in med en länk via e-post eller med en passkey. Inloggningen byggs i nästa steg av demon.</p>
    <p v-if="next" class="next">Du kommer till <strong>{{ next }}</strong> när du har loggat in.</p>
    <NuxtLink to="/" class="button button--dark">Till startsidan</NuxtLink>
  </div>
</template>

<style scoped>
.login {
  max-width: 34rem;
  padding-top: var(--space-7);
  padding-bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
h1 {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 2.5rem;
}
p {
  margin: 0;
  color: var(--c-muted);
}
.button {
  align-self: flex-start;
}
</style>
