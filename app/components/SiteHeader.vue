<script setup lang="ts">
defineEmits<{ menu: [] }>();
</script>

<template>
  <header class="site-header">
    <div class="container bar">
      <NuxtLink to="/" class="logo">
        <img src="/img/logo-wordmark.png" alt="Team Blekinge Löparförening" width="320" height="45">
      </NuxtLink>
      <NuxtLink to="/logga-in" class="login" aria-label="Logga in">
        <AppIcon name="user" :size="18" />
        <span class="login-text" aria-hidden="true">Logga in</span>
      </NuxtLink>
    </div>
    <div class="menu-row">
      <div class="container">
        <MainMenu />
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  background: var(--c-header-bg);
  color: var(--c-header-fg);
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: 64px;
}
.logo img {
  height: 32px;
  width: auto;
}
.login {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--tap);
  min-width: var(--tap);
  justify-content: center;
  padding: 0 var(--space-3);
  border: 1.5px solid var(--c-accent);
  border-radius: var(--radius-button);
  color: var(--c-header-fg);
  text-decoration: none;
  font-weight: 700;
}
.login-text {
  display: none;
}
.menu-row {
  display: none;
  border-top: 1px solid var(--tb-ink-3);
}
:root[data-theme="klubbdrakt"] .login {
  background: var(--tb-purple);
  border-color: var(--tb-purple);
}
@media (min-width: 640px) {
  .login-text {
    display: inline;
  }
  .logo img {
    height: 44px;
  }
}
@media (min-width: 1024px) {
  .menu-row {
    display: block;
  }
  .bar {
    min-height: 76px;
  }
}
</style>
