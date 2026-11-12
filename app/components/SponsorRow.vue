<script setup lang="ts">
defineProps<{ sponsors: { id: string; name: string; logoUrl: string; url: string | null }[] }>();
</script>

<template>
  <section v-if="sponsors.length" class="sponsors" aria-labelledby="sponsors-title">
    <div class="container">
      <h2 id="sponsors-title">Samarbetspartners</h2>
      <ul>
        <li v-for="sponsor in sponsors" :key="sponsor.id">
          <a v-if="sponsor.url" :href="sponsor.url" rel="noopener"><img :src="sponsor.logoUrl" :alt="sponsor.name" loading="lazy"></a>
          <img v-else :src="sponsor.logoUrl" :alt="sponsor.name" loading="lazy">
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.sponsors {
  background: var(--c-surface);
  border-top: 1px solid var(--c-line);
  padding: var(--space-6) 0;
}
h2 {
  font-family: var(--font-body);
  font-size: 0.875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin-bottom: var(--space-4);
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: var(--space-3);
}
li {
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  border: 1px solid var(--c-line);
  border-radius: min(var(--radius-card), 8px);
}
img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
