<script setup lang="ts">
const route = useRoute();
const { data, error } = await useFetch(() => `/api/races/${String(route.params.slug)}`);
if (error.value) throw createError({ statusCode: 404, statusMessage: "Loppet finns inte", fatal: true });
useSeoMeta({ title: () => data.value?.title ?? "Lopp", description: () => data.value?.summary ?? undefined });
</script>

<template>
  <div v-if="data">
    <PageTitle :title="data.title" :lead="data.summary ?? undefined">
      <p class="when">{{ data.isPast ? "Avgjort" : "" }} {{ data.dateLabel }} · {{ data.place }}</p>
    </PageTitle>
    <div class="container race-page">
      <img v-if="data.imageUrl" :src="data.imageUrl" :alt="data.imageAlt ?? ''" class="image">
      <div class="info card">
        <template v-if="data.isPast">
          <h2>Resultat</h2>
          <p>Klubbens resultat från loppet, med personbästan och årsbästan, publiceras här av resultatansvarig.</p>
        </template>
        <template v-else>
          <h2>Start om {{ data.countdown.days }} dagar</h2>
          <p>Anmälan görs hos tidtagaren när den öppnar. Distanser, starttider och avgifter kommer här.</p>
          <a v-if="data.url" :href="data.url" class="button button--primary" rel="noopener">Anmälan</a>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.when {
  font-weight: 800;
}
.race-page {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
  display: grid;
  gap: var(--space-5);
}
.image {
  width: 100%;
  max-height: 520px;
  object-fit: cover;
  border-radius: min(var(--radius-card), 10px);
}
.info {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-self: start;
}
.info p {
  margin: 0;
  color: var(--c-muted);
}
.info .button {
  align-self: flex-start;
}
@media (min-width: 1024px) {
  .race-page {
    grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  }
}
</style>
