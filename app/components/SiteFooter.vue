<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
  <footer class="site-footer">
    <KitStripes position="right" size="s" />
    <div class="container cols">
      <div class="col">
        <img src="/img/logo-wordmark.png" alt="Team Blekinge Löparförening" width="240" height="34">
        <p>Klubblokalen, Tennvägen 11 A, Torskors, Karlskrona</p>
        <NuxtLink to="/fragor" class="accent-link">Kontakta oss</NuxtLink>
      </div>
      <nav class="col" aria-label="Hitta">
        <h2>Hitta</h2>
        <NuxtLink to="/prova-pa">Prova på</NuxtLink>
        <NuxtLink to="/traning">Träningspass</NuxtLink>
        <NuxtLink to="/kalender">Kalender</NuxtLink>
        <NuxtLink to="/tavla">Våra lopp</NuxtLink>
      </nav>
      <nav class="col" aria-label="Föreningen">
        <h2>Föreningen</h2>
        <NuxtLink to="/foreningen">Om föreningen</NuxtLink>
        <NuxtLink to="/foreningen#bli-medlem">Bli medlem</NuxtLink>
        <NuxtLink to="/nyheter">Nyheter</NuxtLink>
        <NuxtLink to="/fragor">Frågor och kontakt</NuxtLink>
      </nav>
    </div>
    <div class="container bottom">
      <ThemeSwitch v-if="config.public.themeSwitch" />
      <p>Ingen spårning och inga kakor att godkänna.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  overflow: hidden;
  background: var(--c-footer-bg);
  color: var(--c-footer-fg);
  padding: var(--space-7) 0 calc(var(--space-6) + 76px + env(safe-area-inset-bottom));
  clip-path: polygon(0 var(--edge-end), 100% 0, 100% 100%, 0 100%);
}
.cols {
  position: relative;
  display: grid;
  gap: var(--space-5);
}
.col {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.col img {
  width: 220px;
  height: auto;
}
.col p {
  margin: 0;
}
h2 {
  font-size: 1rem;
  font-family: var(--font-body);
  text-transform: none;
  letter-spacing: 0;
  color: #fff;
}
:root[data-theme="klubbdrakt"] h2 {
  font-family: var(--font-display);
  text-transform: uppercase;
  font-size: 1.25rem;
}
a {
  color: inherit;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
.accent-link {
  color: var(--tb-orange);
  font-weight: 700;
}
.bottom {
  position: relative;
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid rgb(255 255 255 / 0.15);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-4);
  font-size: 0.875rem;
}
.bottom p {
  margin: 0;
  align-self: center;
}
@media (min-width: 768px) {
  .cols {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .site-footer {
    padding-bottom: var(--space-6);
  }
}
</style>
