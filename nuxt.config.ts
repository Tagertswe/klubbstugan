// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-11-01",
  devtools: { enabled: false },
  modules: ["@nuxt/eslint", "@nuxt/test-utils/module"],

  css: [
    "@fontsource/inter/400.css",
    "@fontsource/inter/600.css",
    "@fontsource/inter/700.css",
    "@fontsource/inter/800.css",
    "@fontsource/barlow-condensed/700.css",
    "@fontsource/barlow-condensed/800.css",
    "~/assets/css/tokens.css",
    "~/assets/css/themes/klassisk.css",
    "~/assets/css/themes/fart.css",
    "~/assets/css/themes/klubbdrakt.css",
    "~/assets/css/base.css",
  ],

  app: {
    head: {
      htmlAttrs: { lang: "sv" },
      titleTemplate: "%s – Team Blekinge LF",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#221E1F" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/img/clubmark.png" }],
    },
  },

  runtimeConfig: {
    databaseUrl: "",
    /** Where content-pack images live (NUXT_UPLOADS_DIR); the `uploads` volume in Docker. */
    uploadsDir: "./uploads",
    defaultTheme: "klassisk",
    public: {
      siteUrl: "http://localhost:3000",
      themeSwitch: true,
    },
  },

  nitro: {
    // Prisma's generated client lives in server/generated; keep pg external
    // so its optional native bindings are not bundled.
    externals: { external: ["pg-native"] },
  },

  eslint: { config: { stylistic: false } },
});
