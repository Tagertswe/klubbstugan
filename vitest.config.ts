import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

// Two projects, as CLAUDE.md describes:
// - unit: plain Node for shared/, server/ and test/ (pure logic, no Nuxt).
// - nuxt: components and composables inside a Nuxt runtime (happy-dom), in
//   test/nuxt/ (Nuxt would register .ts files under app/components/ as components).
// e2e/ is Playwright's and never matched here.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["shared/**/*.test.ts", "server/**/*.test.ts", "test/*.test.ts"],
        },
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          environment: "nuxt",
          include: ["test/nuxt/**/*.test.ts"],
          environmentOptions: { nuxt: { domEnvironment: "happy-dom" } },
        },
      }),
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: [
        "shared/**/*.ts",
        "server/utils/**/*.ts",
        "app/components/**/*.vue",
        "app/composables/**/*.ts",
      ],
      exclude: ["**/*.test.ts", "server/generated/**", "server/utils/db.ts"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
