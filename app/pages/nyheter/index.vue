<script setup lang="ts">
useSeoMeta({ title: "Nyheter", description: "Nyheter från Team Blekinge LF: tävlingar, träning, långpass och klubbkläder." });

const route = useRoute();
const kategori = computed(() => (typeof route.query.kategori === "string" ? route.query.kategori : undefined));
const ar = computed(() => (typeof route.query.ar === "string" ? route.query.ar : undefined));
const { data } = await useFetch("/api/news", { query: { kategori, ar } });
const { config } = useTheme();
</script>

<template>
  <div>
    <PageTitle
      title="Nyheter"
      lead="Meddelanden från styrelsen, tränarna och arrangörerna. Som inloggad medlem ser du även nyheter som bara är för medlemmar."
    />
    <div v-if="data" class="container news-page">
      <nav class="filters" aria-label="Kategorier">
        <NuxtLink to="/nyheter" class="chip" :aria-current="!kategori ? 'page' : undefined">Alla</NuxtLink>
        <NuxtLink
          v-for="category in data.categories"
          :key="category.slug"
          :to="{ path: '/nyheter', query: { kategori: category.slug } }"
          class="chip"
          :aria-current="kategori === category.slug ? 'page' : undefined"
          >{{ category.name }}</NuxtLink
        >
      </nav>

      <div class="columns">
        <section aria-labelledby="latest" class="list-col">
          <h2 id="latest" class="visually-hidden">Senaste nyheterna</h2>
          <div class="list" :class="`list--${config.newsCardVariant}`">
            <NewsCard v-for="item in data.items" :key="item.slug" :item="item" />
          </div>
          <p v-if="data.items.length === 0" class="empty">Inga nyheter i den här kategorin än.</p>
          <aside class="members-note card">
            <AppIcon name="lock" />
            <p><strong>Fler nyheter är bara för medlemmar.</strong> Anmälningar, funktionärspass och protokoll syns när du har loggat in.</p>
            <NuxtLink to="/logga-in" class="button button--dark">Logga in</NuxtLink>
          </aside>
        </section>

        <aside class="side">
          <section class="card years" aria-labelledby="years-title">
            <h2 id="years-title">Tidigare nyheter</h2>
            <div class="year-list">
              <NuxtLink
                v-for="year in data.years"
                :key="year"
                :to="{ path: '/nyheter', query: { ar: String(year) } }"
                class="chip"
                :aria-current="ar === String(year) ? 'page' : undefined"
                >{{ year }}</NuxtLink
              >
            </div>
          </section>
          <section class="card follow" aria-labelledby="follow-title">
            <h2 id="follow-title">Missa inget</h2>
            <p>Som medlem väljer du per kategori om du vill ha nyheter direkt, i ett veckobrev eller inte alls.</p>
            <a href="/nyheter/rss.xml">Nyheter via RSS</a>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-page {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.filters,
.year-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.chip {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 16px;
  border: 1.5px solid var(--c-line);
  border-radius: var(--radius-label);
  background: var(--c-surface);
  color: var(--c-text);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.875rem;
}
.chip[aria-current="page"] {
  background: var(--tb-ink);
  border-color: var(--tb-ink);
  color: #fff;
}
.columns {
  display: grid;
  gap: var(--space-6);
}
.list-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}
.list {
  display: grid;
  gap: var(--space-4);
}
.empty {
  color: var(--c-muted);
}
.members-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--tb-purple-soft);
  color: var(--tb-purple-deep);
  border-style: dashed;
}
.members-note p {
  margin: 0;
  flex: 1 1 260px;
}
.side {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.side .card {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.side h2 {
  font-size: 1.25rem;
}
.side p {
  margin: 0;
  color: var(--c-muted);
}
@media (min-width: 768px) {
  .list--overlay {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .columns {
    grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
    align-items: start;
  }
}
</style>
