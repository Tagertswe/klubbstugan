// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  ignores: ["server/generated/**", "coverage/**", "playwright-report/**", "test-results/**"],
});
