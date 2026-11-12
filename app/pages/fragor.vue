<script setup lang="ts">
useSeoMeta({ title: "Frågor och kontakt", description: "Vanliga frågor om träning, medlemskap och våra lopp." });
const { data } = await useFetch("/api/faq");
</script>

<template>
  <div>
    <PageTitle title="Frågor och kontakt" lead="Svar på det vi oftast får frågor om via mejl." />
    <div class="container faq-page">
      <section v-for="group in data ?? []" :key="group.topic" :aria-labelledby="`t-${group.topic}`">
        <h2 :id="`t-${group.topic}`" class="section-title"><TitleMarker />{{ group.topic }}</h2>
        <FaqList :items="group.items" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.faq-page {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
