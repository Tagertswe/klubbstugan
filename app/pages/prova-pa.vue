<script setup lang="ts">
useSeoMeta({ title: "Prova på", description: "Nyfiken på att löpträna? Prova upp till tre träningspass gratis med Team Blekinge LF i Karlskrona." });
</script>

<template>
  <div>
    <PageTitle title="Prova på" lead="Nyfiken på att löpträna? Du får vara med på upp till tre träningspass gratis innan du bestämmer dig." />
    <div class="container steps">
      <ol>
        <li class="card">
          <h2>1. Välj grupp</h2>
          <p>Klarar du cirka 10 km springer du med Långa gruppen, cirka 5 km med Korta gruppen. Hälsagruppen passar dig som vill börja lugnt.</p>
          <NuxtLink to="/traning">Se grupperna och veckans pass</NuxtLink>
        </li>
        <li class="card">
          <h2>2. Kom till klubblokalen</h2>
          <p>Tisdagar kl. 18 (Hälsagruppen 17.45) på Tennvägen 11 A i Torskors, Karlskrona. Parkera på gatan eller vid idrottsplatsen.</p>
        </li>
        <li class="card">
          <h2>3. Bli medlem när du vill</h2>
          <p>650 kr för hela året, oavsett när du går med. Försäkring ingår.</p>
          <NuxtLink to="/foreningen#bli-medlem">Så blir du medlem</NuxtLink>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.steps {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
}
ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-4);
}
li {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
h2 {
  font-size: 1.375rem;
}
p {
  margin: 0;
  color: var(--c-muted);
}
a {
  font-weight: 700;
}
@media (min-width: 768px) {
  ol {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
