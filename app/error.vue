<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);
useSeoMeta({ title: () => (notFound.value ? "Sidan finns inte" : "Något gick fel") });
</script>

<template>
  <NuxtLayout>
    <div class="container error">
      <h1>{{ notFound ? "Sidan finns inte" : "Något gick fel" }}</h1>
      <p v-if="notFound">Sidan kan ha flyttat när hemsidan byttes. Prova någon av de här:</p>
      <p v-else>Försök igen om en stund.</p>
      <ul>
        <li><NuxtLink to="/">Startsidan</NuxtLink></li>
        <li><NuxtLink to="/nyheter">Nyheter</NuxtLink></li>
        <li><NuxtLink to="/kalender">Kalender</NuxtLink></li>
        <li><NuxtLink to="/fragor">Frågor och kontakt</NuxtLink></li>
      </ul>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error {
  padding-top: var(--space-7);
  padding-bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
h1 {
  font-size: 2.5rem;
}
p {
  margin: 0;
  color: var(--c-muted);
}
li {
  min-height: var(--tap);
  display: flex;
  align-items: center;
}
</style>
