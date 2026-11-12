<script setup lang="ts">
useSeoMeta({ title: "Föreningen", description: "Om Team Blekinge Löparförening, medlemskap och kontakt." });
</script>

<template>
  <div>
    <PageTitle title="Föreningen" lead="Team Blekinge Löparförening startade 1992 och har sin klubblokal på Tennvägen 11 A i Torskors, Karlskrona." />
    <div class="container club">
      <section id="bli-medlem" class="card" aria-labelledby="join-title">
        <h2 id="join-title">Bli medlem</h2>
        <p>Medlemskapet kostar 650 kr för hela 2026, oavsett när på året du går med. I avgiften ingår en olycksfallsförsäkring som gäller på föreningens träningar.</p>
        <p>Du är medlem tills du säger upp medlemskapet och betalar bara årets avgift.</p>
        <p class="note">Ansökan görs tills vidare via föreningens nuvarande medlemsformulär.</p>
      </section>
      <section id="styrelsen" class="card" aria-labelledby="board-title">
        <h2 id="board-title">Styrelsen och kontakt</h2>
        <p>Styrelsen och ansvariga presenteras här. Frågor? Se <NuxtLink to="/fragor">Frågor och kontakt</NuxtLink>.</p>
      </section>
      <section id="bilder" class="card" aria-labelledby="photos-title">
        <h2 id="photos-title">Bilder</h2>
        <p>Bildalbum från lopp och träningar länkas här.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.club {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
  display: grid;
  gap: var(--space-4);
}
section {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  scroll-margin-top: var(--space-5);
}
h2 {
  font-size: 1.5rem;
}
p {
  margin: 0;
  color: var(--c-muted);
}
.note {
  font-style: italic;
}
</style>
