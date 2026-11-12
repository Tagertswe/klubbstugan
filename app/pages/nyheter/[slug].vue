<script setup lang="ts">
const route = useRoute();
const slug = computed(() => String(route.params.slug));
const { data, error } = await useFetch(() => `/api/news/${slug.value}`);
if (error.value) throw createError({ statusCode: 404, statusMessage: "Nyheten finns inte", fatal: true });

useSeoMeta({
  title: () => data.value?.title ?? "Nyhet",
  description: () => data.value?.excerpt,
  ogImage: () => data.value?.imageUrl ?? undefined,
});
</script>

<template>
  <div v-if="data" class="container article-page">
    <NuxtLink to="/nyheter" class="back">← Nyheter</NuxtLink>
    <div class="columns">
      <article class="article card">
        <p class="category label">{{ data.category.name }}</p>
        <h1>{{ data.title }}</h1>
        <p class="byline">
          <span v-if="data.authorName">{{ data.authorName }} · </span>{{ data.longDate }}
        </p>
        <img v-if="data.imageUrl" :src="data.imageUrl" :alt="data.imageAlt ?? ''" class="image">
        <div class="body">
          <p v-for="(paragraph, index) in data.paragraphs" :key="index">{{ paragraph }}</p>
        </div>
      </article>
      <aside class="more card" aria-labelledby="more-title">
        <h2 id="more-title">Mer från Nyheter</h2>
        <ul>
          <li v-for="item in data.more" :key="item.slug">
            <span class="meta">{{ item.category.name }} · {{ item.dateLabel }}</span>
            <NuxtLink :to="`/nyheter/${item.slug}`">{{ item.title }}</NuxtLink>
          </li>
        </ul>
        <NuxtLink to="/nyheter" class="all">Alla nyheter →</NuxtLink>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.article-page {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
}
.back {
  display: inline-flex;
  align-items: center;
  min-height: var(--tap);
  font-weight: 700;
}
.columns {
  display: grid;
  gap: var(--space-5);
  margin-top: var(--space-3);
}
.article {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}
h1 {
  font-size: clamp(2rem, 4.5vw, 3rem);
}
.byline {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.9375rem;
}
.image {
  width: 100%;
  max-height: 460px;
  object-fit: cover;
  border-radius: min(var(--radius-card), 10px);
}
.body p {
  margin: 0 0 var(--space-4);
  font-size: 1.0625rem;
  max-width: 42rem;
}
.more {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-self: start;
}
.more h2 {
  font-size: 1.25rem;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
li {
  display: flex;
  flex-direction: column;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--c-line);
}
li a {
  color: var(--c-text);
  font-weight: 800;
  text-decoration: none;
}
.meta {
  font-size: 0.75rem;
  color: var(--c-brand-2);
  font-weight: 700;
}
.all {
  font-weight: 700;
}
@media (min-width: 1024px) {
  .columns {
    grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  }
}
</style>
