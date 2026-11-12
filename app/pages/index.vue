<script setup lang="ts">
useSeoMeta({
  title: "Löparklubb i Karlskrona",
  description:
    "Team Blekinge Löparförening i Karlskrona: intervaller varje tisdag i tre grupper, långpass, Jämjöhalvan och Kustmaran. Prova tre pass gratis.",
});

const { data } = await useFetch("/api/home");
const { config } = useTheme();
</script>

<template>
  <div v-if="data" class="home">
    <HeroSection :next-race="data.nextRace" :hero="data.hero" />

    <div class="container pinned-wrap">
      <PinnedStrip :items="data.pinned" />
    </div>

    <div class="container columns">
      <div class="main-col">
        <TrainingWeek :training="data.training" :time="data.trainingTime" :place="data.trainingPlace" />

        <section class="news" aria-labelledby="news-title">
          <div class="head">
            <h2 id="news-title" class="section-title"><TitleMarker color="brand-2" />Senaste nytt</h2>
            <NuxtLink to="/nyheter" class="more">Alla nyheter →</NuxtLink>
          </div>
          <div class="news-list" :class="`news-list--${config.newsCardVariant}`">
            <NewsCard
              v-for="(item, index) in data.news"
              :key="item.slug"
              :item="item"
              :large="config.newsCardVariant === 'overlay' && index === 0"
            />
          </div>
        </section>
      </div>

      <aside class="side-col">
        <ActivityList :items="data.activities" />
        <section class="join" aria-labelledby="join-title">
          <h2 id="join-title">Bli medlem</h2>
          <p>650 kr för hela 2026, oavsett när på året du går med. Prova gärna upp till tre pass först.</p>
          <NuxtLink to="/foreningen#bli-medlem" class="button button--dark">Så blir du medlem</NuxtLink>
        </section>
        <section class="member card" aria-labelledby="member-title">
          <h2 id="member-title">Medlem?</h2>
          <p>Nyheter för medlemmar, anmälningar och Klubbflödet finns när du har loggat in.</p>
          <NuxtLink to="/logga-in" class="button button--outline">Logga in</NuxtLink>
        </section>
      </aside>
    </div>

    <section class="races" aria-labelledby="races-title">
      <SpeedLines />
      <div class="container races-inner">
        <div class="head">
          <h2 id="races-title" class="section-title"><TitleMarker />Våra lopp</h2>
          <NuxtLink to="/tavla" class="more">Alla lopp och resultat →</NuxtLink>
        </div>
        <div class="race-grid">
          <RaceCard v-for="race in data.races" :key="race.slug" :race="race" />
        </div>
      </div>
    </section>

    <section class="container faq-section" aria-labelledby="faq-title">
      <div class="faq-intro">
        <h2 id="faq-title" class="section-title"><TitleMarker />Vanliga frågor</h2>
        <p>Svar på det vi oftast får frågor om via mejl.</p>
        <NuxtLink to="/fragor">Alla frågor och svar →</NuxtLink>
      </div>
      <FaqList :items="data.faq" open-first />
    </section>

    <SponsorRow :sponsors="data.sponsors" />
  </div>
</template>

<style scoped>
.pinned-wrap {
  position: relative;
  z-index: 2;
  margin-top: var(--space-5);
}
:root[data-theme="fart"] .pinned-wrap,
:root[data-theme="klubbdrakt"] .pinned-wrap {
  margin-top: calc(var(--space-5) * -1.4);
}
.columns {
  display: grid;
  gap: var(--space-7);
  padding-top: var(--space-6);
  padding-bottom: var(--space-7);
}
.main-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
  min-width: 0;
}
.side-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.more {
  font-weight: 700;
}
.news-list {
  display: grid;
  gap: var(--space-4);
}
.join {
  position: relative;
  overflow: hidden;
  padding: var(--space-5);
  background: var(--c-accent);
  color: var(--c-on-accent);
  border-radius: var(--radius-card);
  transform: rotate(calc(var(--tilt) * 0.8));
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
:root[data-theme="klubbdrakt"] .join {
  background: var(--tb-ink);
  color: #fff;
}
:root[data-theme="klubbdrakt"] .join .button--dark {
  background: var(--tb-orange);
  color: var(--tb-ink);
}
.join h2,
.member h2 {
  font-size: 1.5rem;
}
.join p,
.member p {
  margin: 0;
}
.join .button,
.member .button {
  align-self: flex-start;
}
.member {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.member p {
  color: var(--c-muted);
}
.races {
  position: relative;
  overflow: hidden;
  background: var(--c-band-bg);
  color: var(--c-band-fg);
  padding: calc(var(--space-7) + var(--edge-end)) 0;
  clip-path: polygon(0 var(--edge-end), 100% 0, 100% calc(100% - var(--edge-end)), 0 100%);
}
:root[data-theme="klubbdrakt"] .races {
  background: var(--tb-ink);
}
.races-inner {
  position: relative;
}
.races .more {
  color: var(--tb-orange);
}
.race-grid {
  display: grid;
  gap: var(--space-5);
}
:root[data-theme="fart"] .race-grid > :nth-child(odd) {
  transform: rotate(calc(var(--tilt) * -1));
}
:root[data-theme="fart"] .race-grid > :nth-child(even) {
  transform: rotate(var(--tilt));
}
.faq-section {
  display: grid;
  gap: var(--space-5);
  padding-top: var(--space-7);
  padding-bottom: var(--space-7);
}
.faq-intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.faq-intro p {
  margin: 0;
  color: var(--c-muted);
}
@media (min-width: 768px) {
  .race-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .news-list--overlay {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .news-list--overlay > :first-child {
    grid-column: span 2;
  }
  .faq-section {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  }
}
@media (min-width: 1024px) {
  .columns {
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    align-items: start;
  }
}
</style>
