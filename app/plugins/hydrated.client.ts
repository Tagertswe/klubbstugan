// Marks <html data-hydrated> once Vue has taken over the server-rendered page.
// End-to-end tests wait for it before clicking (e2e/helpers.ts, gotoReady).
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:suspense:resolve", () => {
    document.documentElement.dataset.hydrated = "true";
  });
});
