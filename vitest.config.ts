import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["src/__tests__/**/*.{test,spec}.{js,ts}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/vendor/",
        "src/__tests__/",
        "assets/",
        "_site/",
        "cypress/",
        "tests/",
        "*.config.ts",
        "*.setup.ts",
      ],
    },
    reporters: ["default", "verbose"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
