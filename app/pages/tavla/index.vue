<script setup lang="ts">
useSeoMeta({ title: "Våra lopp", description: "Jämjöhalvan, Kustmaran & Kristianopel Runt och Veteran-SM – lopp som Team Blekinge LF arrangerar." });
const { data } = await useFetch("/api/races");
</script>

<template>
  <div>
    <PageTitle title="Våra lopp" lead="Loppen som Team Blekinge arrangerar, med anmälan, banor och resultat." />
    <div class="container races">
      <RaceCard v-for="race in data ?? []" :key="race.slug" :race="race" />
    </div>
  </div>
</template>

<style scoped>
.races {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
  display: grid;
  gap: var(--space-5);
}
@media (min-width: 768px) {
  .races {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
