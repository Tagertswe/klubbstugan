<script setup lang="ts">
import type { HeroImage, NextRace } from "#shared/types/content";

// Home page opening. "split": text beside a tilted photo (Klassisk, Fart).
// "fullBleed": headline over a full-width photo (Klubbdräkt).
defineProps<{ nextRace: NextRace | null; hero: HeroImage }>();
const { config } = useTheme();
</script>

<template>
  <section class="hero" :class="`hero--${config.heroVariant}`" aria-labelledby="hero-title" :data-variant="config.heroVariant">
    <img
      v-if="config.heroVariant === 'fullBleed'"
      :src="hero.imageUrl"
      :alt="hero.imageAlt"
      class="backdrop"
    >
    <SpeedLines />
    <KitStripes />
    <div class="container inner">
      <div class="text">
        <p class="tag">Sedan 1992 · Bastasjöområdet, Karlskrona</p>
        <h1 id="hero-title">Löparklubb i Karlskrona – för <em>alla typer</em> av löpare</h1>
        <p class="lead">
          Gammal som ung, mindre snabb som snabb. Varje tisdag kl. 18 tränar vi intervaller i tre grupper från
          klubblokalen på Tennvägen 11 A i Torskors.
        </p>
        <div class="actions">
          <NuxtLink to="/prova-pa" class="button button--primary">Prova på gratis</NuxtLink>
          <NuxtLink to="/foreningen#bli-medlem" class="button button--outline">Bli medlem</NuxtLink>
        </div>
        <p class="check"><AppIcon name="check" :size="16" />Prova upp till tre träningspass gratis innan du blir medlem.</p>
      </div>
      <div v-if="config.heroVariant === 'split'" class="visual">
        <div class="frame" aria-hidden="true" />
        <img :src="hero.imageUrl" :alt="hero.imageAlt" class="photo">
        <CountdownBox v-if="nextRace" :race="nextRace" class="count" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: var(--c-hero-bg);
  color: var(--c-hero-fg);
  padding: var(--space-7) 0 calc(var(--space-7) + var(--edge-end));
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--edge-end)), 0 100%);
}
.inner {
  position: relative;
  display: grid;
  gap: var(--space-6);
  align-items: center;
}
.text {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.tag {
  align-self: flex-start;
  margin: 0;
  padding: 5px 12px;
  background: var(--c-label-bg);
  color: var(--c-label-fg);
  border-radius: var(--radius-label);
  font-size: 0.8125rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: rotate(calc(var(--tilt) * -1.3));
}
h1 {
  font-size: clamp(2.25rem, 5.5vw, 4rem);
}
h1 em {
  font-style: normal;
  color: var(--c-link);
}
.hero--fullBleed h1 em,
:root[data-theme="fart"] h1 em {
  color: var(--tb-orange);
}
.lead {
  margin: 0;
  font-size: 1.125rem;
  color: var(--c-hero-muted);
  max-width: 36rem;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
.check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--c-hero-muted);
  font-size: 0.9375rem;
}
.check svg {
  color: var(--tb-orange);
}
.visual {
  position: relative;
  padding: var(--space-4) var(--space-5) var(--space-7) 0;
}
.frame {
  position: absolute;
  inset: 32px 0 64px 40px;
  background: var(--tb-orange);
  transform: rotate(calc(var(--tilt) * 2.6));
  border-radius: var(--radius-card);
}
.photo {
  position: relative;
  width: 100%;
  height: 360px;
  object-fit: cover;
  border: 6px solid #fff;
  border-radius: var(--radius-card);
  transform: rotate(calc(var(--tilt) * 2.6));
}
.hero--fullBleed :deep(.kit-stripes) {
  z-index: 2;
}
:root[data-theme="klassisk"] .frame {
  display: none;
}
.count {
  position: absolute;
  left: -12px;
  bottom: 8px;
}

/* Full-bleed photo with headline over it */
.hero--fullBleed {
  min-height: 600px;
  display: flex;
  align-items: flex-end;
  padding-top: var(--space-8);
}
.backdrop {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 35%;
}
.hero--fullBleed::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(90deg, rgb(34 30 31 / 0.88) 0%, rgb(59 26 90 / 0.72) 45%, rgb(34 30 31 / 0.15) 80%),
    linear-gradient(180deg, rgb(34 30 31 / 0) 55%, rgb(34 30 31 / 0.85) 100%);
}
.hero--fullBleed .inner {
  z-index: 3;
}
.hero--fullBleed h1 {
  font-size: clamp(2.75rem, 7vw, 5.25rem);
  line-height: 0.95;
  max-width: 50rem;
}
.hero--fullBleed .button--outline {
  background: #fff;
  color: var(--tb-ink);
  border-color: #fff;
}
:root[data-theme="klassisk"] .button--outline {
  color: var(--c-text);
}
@media (min-width: 900px) {
  .hero--split .inner {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  }
}
</style>
